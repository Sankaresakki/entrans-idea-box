/**
 * db.ts — All Supabase read/write operations for the Ripple platform.
 *
 * Schema (run in Supabase SQL editor — see supabase-schema.sql):
 *   ideas         (id TEXT PK, data JSONB, updated_at TIMESTAMPTZ)
 *   notifications (id TEXT PK, idea_id TEXT, recipient TEXT, subject TEXT,
 *                  body TEXT, timestamp TIMESTAMPTZ,
 *                  attachment_name TEXT, attachment_type TEXT)
 *   meetings      (id TEXT PK, data JSONB, updated_at TIMESTAMPTZ)
 *
 * All functions are silent no-ops when isSupabaseConfigured === false,
 * letting the app run on localStorage as a fallback.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type { Idea, NotificationLog } from "../types";
import type { OfflineMeeting } from "../components/MeetingManagementModule";

// ─────────────────────────────────────────────────────────────────────────────
// IDEAS
// ─────────────────────────────────────────────────────────────────────────────

export const fetchIdeas = async (): Promise<Idea[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("ideas")
    .select("data")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: { data: unknown }) => row.data as Idea);
};

export const upsertIdea = async (idea: Idea): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("ideas").upsert({
    id: idea.id,
    data: idea,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("[db] upsertIdea:", error.message);
};

export const upsertManyIdeas = async (ideas: Idea[]): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const rows = ideas.map((idea) => ({
    id: idea.id,
    data: idea,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("ideas").upsert(rows);
  if (error) console.error("[db] upsertManyIdeas:", error.message);
};

export const deleteAllIdeas = async (): Promise<void> => {
  if (!isSupabaseConfigured) return;
  // delete all rows — the neq filter ensures the query runs
  const { error } = await supabase.from("ideas").delete().neq("id", "");
  if (error) console.error("[db] deleteAllIdeas:", error.message);
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

function rowToNotif(row: Record<string, unknown>): NotificationLog {
  return {
    id: row.id as string,
    ideaId: row.idea_id as string,
    recipient: row.recipient as string,
    subject: row.subject as string,
    body: row.body as string,
    timestamp: row.timestamp as string,
    attachmentName: (row.attachment_name as string) || undefined,
    attachmentType: (row.attachment_type as string) || undefined,
  };
}

export const fetchNotifications = async (): Promise<NotificationLog[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []).map(rowToNotif);
};

export const insertNotification = async (notif: NotificationLog): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("notifications").insert({
    id: notif.id,
    idea_id: notif.ideaId,
    recipient: notif.recipient,
    subject: notif.subject,
    body: notif.body,
    timestamp: notif.timestamp,
    attachment_name: notif.attachmentName ?? null,
    attachment_type: notif.attachmentType ?? null,
  });
  if (error) console.error("[db] insertNotification:", error.message);
};

export const deleteAllNotifications = async (): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("notifications").delete().neq("id", "");
  if (error) console.error("[db] deleteAllNotifications:", error.message);
};

// ─────────────────────────────────────────────────────────────────────────────
// MEETINGS
// ─────────────────────────────────────────────────────────────────────────────

export const fetchMeetings = async (): Promise<OfflineMeeting[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("meetings")
    .select("data")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: { data: unknown }) => row.data as OfflineMeeting);
};

export const upsertMeeting = async (meeting: OfflineMeeting): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("meetings").upsert({
    id: meeting.id,
    data: meeting,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("[db] upsertMeeting:", error.message);
};

export const deleteAllMeetings = async (): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("meetings").delete().neq("id", "");
  if (error) console.error("[db] deleteAllMeetings:", error.message);
};

// Export the row→notification mapper so App.tsx can use it in the realtime handler
export { rowToNotif };

// ─────────────────────────────────────────────────────────────────────────────
// USERS  (self-registered employees)
// ─────────────────────────────────────────────────────────────────────────────

export interface RegisteredUser {
  id?: string;
  email: string;
  password: string;
  name: string;
  role: string;
  business_unit: string;
  employee_id: string;
  department: string;
  designation: string;
  created_at?: string;
}

export const lookupUser = async (email: string): Promise<RegisteredUser | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error || !data) return null;
  return data as RegisteredUser;
};

export const registerUser = async (
  user: Omit<RegisteredUser, "id" | "created_at">
): Promise<{ error: string | null }> => {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { error } = await supabase.from("users").insert({
    ...user,
    email: user.email.toLowerCase(),
  });
  if (error) {
    if (error.code === "23505") return { error: "This email is already registered. Please sign in." };
    return { error: error.message };
  }
  return { error: null };
};
