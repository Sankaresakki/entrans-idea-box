/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Idea, IdeaStatus, UserPersona, NotificationLog, getAuthorizedIdeasForRole, OfflineMeeting } from "./types";
import { MOCK_IDEAS } from "./mockData";
import * as db from "./lib/db";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { Dashboard } from "./components/Dashboard";
import { IdeaSubmissionForm } from "./components/IdeaSubmissionForm";
import { TaskCenter } from "./components/TaskCenter";
import { CertificateView } from "./components/CertificateView";
import { NotificationLogView } from "./components/NotificationLogView";
import { LoginGate } from "./components/LoginGate";
import { LandingPage } from "./components/LandingPage";
import { DemoFlowRunner } from "./components/DemoFlowRunner";
import { CertificationModule } from "./components/CertificationModule";
import { MonthlyTrackerModule } from "./components/MonthlyTrackerModule";
import { MeetingManagementModule, OfflineMeeting as IOfflineMeeting } from "./components/MeetingManagementModule";
import { 
  Building2, Users, Mail, ClipboardCheck, Sparkles, Inbox, Award, 
  BookOpen, ChevronRight, Play, Loader2, RefreshCcw, Landmark, Clock,
  LogOut, ShieldAlert, KeyRound, ChevronDown, Calendar, Activity, Eye, Lightbulb
} from "lucide-react";

// ── All switchable personas for the "Simulate Switch User" dropdown ──────────
const ALL_SWITCH_PERSONAS: UserPersona[] = [
  // Employees
  { role: "Employee", name: "Sathya Kumar",      email: "sathyakumar@entrans.io",       businessUnit: "Industrial Water Division",    employeeId: "ION-EMP-2026-081", department: "Process Engineering & Design",       designation: "Senior Process Engineer" },
  { role: "Employee", name: "Anita Desai",        email: "anita.d@ionexchange.com",       businessUnit: "R&D Centre of Excellence",     employeeId: "ION-EMP-2026-044", department: "Membrane Research Division",         designation: "Research Scientist" },
  { role: "Employee", name: "Aditi Rao",          email: "aditi.rao@ionexchange.com",     businessUnit: "Chemical Division",            employeeId: "ION-EMP-2026-067", department: "Chemical Process Engineering",       designation: "Process Automation Engineer" },
  { role: "Employee", name: "Sanjay Deshmukh",    email: "sanjay.deshmukh@ionexchange.com", businessUnit: "Municipal Infrastructure Group", employeeId: "ION-EMP-2026-029", department: "Municipal Water & Waste",         designation: "Municipal Systems Engineer" },
  // Governance
  { role: "C-POC",           name: "TM & OD CoE Lead",       email: "coe@ionexchange.com",           businessUnit: "Central HR & OD",           employeeId: "ION-HR-2026-004",   department: "Talent Management & OD",               designation: "AVP - Talent Management & OD" },
  { role: "IRC Member",      name: "Senior Advisory Panel",  email: "advisor@ionexchange.com",       businessUnit: "Technical Board",           employeeId: "ION-TECH-2026-012", department: "R&D Centre of Excellence",             designation: "Technical Jury Chairman" },
  { role: "Functional Head", name: "Dr. Alok Gupta",         email: "alok.gupta@ionexchange.com",    businessUnit: "Chemical Division",         employeeId: "ION-EXEC-2026-003", department: "Chemical Manufacturing & Trials",      designation: "Executive Director & Business Head" },
  { role: "Plan Owner",      name: "Kavita Sharma (Lead)",   email: "kavita.s@ionexchange.com",      businessUnit: "Project Execution Team",    employeeId: "ION-PIL-2026-052",  department: "Project Execution & Commissioning",    designation: "Pilot Implementation Manager" },
  { role: "Finance",         name: "Central Finance Admin",  email: "finance@ionexchange.com",       businessUnit: "Corporate Finance",         employeeId: "ION-FIN-2026-018",  department: "Corporate Treasury & Audit",           designation: "Senior Finance Auditor" },
  { role: "CFO",             name: "N. M. Ranadive (CFO)",   email: "nmr@ionexchange.com",           businessUnit: "Executive Committee",       employeeId: "ION-CFO-2026-001",  department: "Executive Finance Committee",          designation: "Chief Financial Officer (CFO)" },
  // Super Admin
  { role: "Super Admin",     name: "Super Admin Observer",   email: "superadmin@ionexchange.com",    businessUnit: "System Administration",     employeeId: "ION-SYS-2026-000",  department: "IT Governance & Audit",                designation: "Platform Super Administrator" },
];

export default function App() {
  // ── Data state — seeded from Supabase when configured, otherwise localStorage ──
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    if (isSupabaseConfigured) return []; // loaded async on mount
    const saved = localStorage.getItem("ion_ideas");
    return saved ? JSON.parse(saved) : MOCK_IDEAS;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    if (isSupabaseConfigured) return []; // loaded async on mount
    const saved = localStorage.getItem("ion_notifications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "notif-init",
        ideaId: "ION-2026-0001",
        recipient: "sathyakumar@entrans.io",
        subject: "One Ion Idea Box: Idea Submitted - ION-2026-0001",
        body: `Dear Sathya Kumar,<br/><br/>Thank you for submitting your idea to the One Ion — Idea Box program!<br/><br/>Your idea has been successfully received and allocated the unique identifier: <strong>ION-2026-0001</strong>.<br/><br/><strong>Idea Title:</strong> Eco-Loop Solar-Powered Modular ZLD System<br/><br/>Your idea is now under routing review by our B-POC coordinator to assign the relevant Business Idea Review Committee (B-IRC) members.<br/><br/>Best Regards,<br/>Talent Management & OD Centre of Excellence (CoE)<br/>Ion Exchange (India) Ltd.`,
        timestamp: "2026-06-01T10:15:00Z"
      }
    ];
  });

  // Meetings state — Supabase-backed when configured, otherwise localStorage
  const [meetings, setMeetings] = useState<IOfflineMeeting[]>(() => {
    if (isSupabaseConfigured) return []; // loaded async on mount
    const saved = localStorage.getItem("ion_meetings");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "MEET-0001",
        ideaId: "ION-2026-0002",
        ideaTitle: "Nanocoated Biofouling-Resistant RO Membranes",
        meetingType: "IRC_Proposer",
        meetingTypeLabel: "IRC ↔ Idea Proposer Meeting",
        date: "2026-06-25",
        time: "14:00",
        participants: "Anita Desai, Ramesh Chawla (Sr Scientist), Dr. Sandeep Jha, C-POC Lead",
        agenda: "Technical presentation of Nanocoated Biofouling-Resistant RO Membranes to the central IRC Advisory Jury to clarify scaling feasibility.",
        mom: "Anita Desai presented atomic layer deposition variables. Ramesh Chawla verified the 120% membrane lifespan expectation, noting that localized gas chamber expansion represents the sole major scaling hurdle.",
        decisions: "Agreed to proceed to next stage-gate with a custom score threshold of 80. Draft recommendation is positive.",
        actionItems: "1. Anita Desai to share physical nano-thickness specs by 2nd July.\n2. Ramesh Chawla to draft final feasibility annexure.",
        followUpStatus: "In Progress",
        dateCreated: "2026-06-24T10:00:00Z"
      },
      {
        id: "MEET-0002",
        ideaId: "ION-2026-0003",
        ideaTitle: "AI-Driven Smart Dosage Coagulant Injector",
        meetingType: "FH_Proposer",
        meetingTypeLabel: "Functional Head ↔ Idea Proposer Presentation",
        date: "2026-06-18",
        time: "11:30",
        participants: "Aditi Rao, Dr. Alok Gupta (Functional Head), Kavita Sharma (Project Lead)",
        agenda: "Reviewing 6-Month Pilot Implementation timeline, trial parameters, and milestone checkpoints for AI-Driven Smart Dosage Coagulant Injector.",
        mom: "Reviewed the physical pump layout and turbidity sensor calibration phases. Dr. Alok Gupta approved the procurement budget of Rs. 1,50,050.",
        decisions: "Action Plan officially approved. Cavendish pilot cleared to commence.",
        actionItems: "1. Kavita Sharma to finalize sensor bill of material by 10th July.\n2. Aditi Rao to coordinate lab bench setup.",
        followUpStatus: "Resolved",
        dateCreated: "2026-06-17T15:00:00Z"
      }
    ];
  });

  // Active Workspace State
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>("ION-2026-0001");
  const [activeTab, setActiveTab] = useState<"dashboard" | "submit" | "taskcenter" | "certificates" | "zohomail" | "monthlytracker" | "meetings">("dashboard");
  const [selectedCertType, setSelectedCertType] = useState<string | null>(null);

  // Simulated Actor Persona Switcher (Authentic Gated Authentication)
  const [currentPersona, setCurrentPersona] = useState<UserPersona | null>(() => {
    const saved = localStorage.getItem("ripple_logged_persona");
    return saved ? JSON.parse(saved) : null;
  });

  // Controls whether to show LoginGate or LandingPage when not authenticated
  const [showLogin, setShowLogin] = useState(false);

  // Demo flow runner visibility
  const [demoOpen, setDemoOpen] = useState(false);

  // Realtime sync status (shown in header badge)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "connected" | "offline">(
    isSupabaseConfigured ? "connecting" : "offline"
  );

  // ── localStorage fallback (only when Supabase is not configured) ──
  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem("ion_ideas", JSON.stringify(ideas));
  }, [ideas]);
  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem("ion_meetings", JSON.stringify(meetings));
  }, [meetings]);
  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem("ion_notifications", JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  // ── Supabase: initial load + realtime subscription ──
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [ideasData, notifsData, meetingsData] = await Promise.all([
          db.fetchIdeas(),
          db.fetchNotifications(),
          db.fetchMeetings(),
        ]);
        // Seed mock data on first run (empty DB)
        if (ideasData.length === 0) {
          await db.upsertManyIdeas(MOCK_IDEAS);
          setIdeas(MOCK_IDEAS);
        } else {
          setIdeas(ideasData);
        }
        setNotificationLogs(notifsData);
        setMeetings(meetingsData);
      } catch (err) {
        console.error("[Supabase] Initial load failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();

    // Realtime subscription — all three tables
    const channel = supabase
      .channel("ripple-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "ideas" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const idea = (payload.new as { data: Idea }).data;
          setIdeas((prev) => {
            const idx = prev.findIndex((i) => i.id === idea.id);
            if (idx >= 0) {
              if (JSON.stringify(prev[idx]) === JSON.stringify(idea)) return prev;
              const next = [...prev]; next[idx] = idea; return next;
            }
            return [idea, ...prev];
          });
        }
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const notif = db.rowToNotif(payload.new as Record<string, unknown>);
        setNotificationLogs((prev) => {
          if (prev.some((n) => n.id === notif.id)) return prev; // skip optimistic duplicate
          return [notif, ...prev];
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const meeting = (payload.new as { data: IOfflineMeeting }).data;
          setMeetings((prev) => {
            const idx = prev.findIndex((m) => m.id === meeting.id);
            if (idx >= 0) { const next = [...prev]; next[idx] = meeting; return next; }
            return [meeting, ...prev];
          });
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeStatus("connected");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setRealtimeStatus("offline");
      });

    return () => { supabase.removeChannel(channel); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Enforce role-based authorized ideas scope
  const authorizedIdeas = currentPersona ? getAuthorizedIdeasForRole(ideas, currentPersona) : [];

  // Selected Idea Instance (only searches authorized ideas to avoid unauthorized access bypass)
  const selectedIdea = authorizedIdeas.find(i => i.id === selectedIdeaId) || null;

  // Sync tab when selecting individual ideas
  const handleSelectIdeaFromDashboard = (idea: Idea) => {
    setSelectedIdeaId(idea.id);
    setSelectedCertType(null);
    setActiveTab("taskcenter");
  };

  // Callback to push auto emails — writes to Supabase (fire-and-forget) + local state
  const handleAddNotification = useCallback((
    recipient: string,
    subject: string,
    body: string,
    attachmentName?: string,
    attachmentType?: string
  ) => {
    const newLog: NotificationLog = {
      id: `znotif-${Date.now()}`,
      ideaId: selectedIdea?.id || "ION-2026-GENERAL",
      recipient,
      subject: `One Ion Notification: ${subject}`,
      body,
      timestamp: new Date().toISOString(),
      attachmentName,
      attachmentType
    };
    setNotificationLogs(prev => [newLog, ...prev]);
    db.insertNotification(newLog).catch(err => console.error("[db] insertNotification:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdea?.id]);

  // Callback to update idea state — optimistic local + async Supabase write
  const handleUpdateIdea = (updatedIdea: Idea) => {
    setIdeas(prev => prev.map(item => item.id === updatedIdea.id ? updatedIdea : item));
    db.upsertIdea(updatedIdea).catch(err => console.error("[db] upsertIdea:", err));
  };

  // Add a newly submitted idea
  const handleNewIdeaSubmit = (formData: {
    employeeName: string;
    employeeEmail: string;
    businessUnit: string;
    areaOfImpact: string;
    title: string;
    problemStatement: string;
    proposedSolution: string;
    expectedImpact: string;
    employeeId?: string;
    department?: string;
    designation?: string;
    uploadedFiles?: { name: string; size: string }[];
    customFields?: { id: string; label: string; value: string; type: string }[];
  }) => {
    const nextNum = ideas.length + 1;
    const formattedId = `ION-2026-${String(nextNum).padStart(4, "0")}`;

    const newIdea: Idea = {
      id: formattedId,
      status: IdeaStatus.Submitted,
      createdAt: new Date().toISOString(),
      employeeName: formData.employeeName,
      employeeEmail: formData.employeeEmail,
      businessUnit: formData.businessUnit,
      areaOfImpact: formData.areaOfImpact,
      title: formData.title,
      problemStatement: formData.problemStatement,
      proposedSolution: formData.proposedSolution,
      expectedImpact: formData.expectedImpact,
      uploadedFiles: formData.uploadedFiles,
      customFields: formData.customFields,
      submissionDate: new Date().toISOString(),
      employeeId: formData.employeeId || currentPersona?.employeeId,
      department: formData.department || currentPersona?.department,
      designation: formData.designation || currentPersona?.designation,
      vettingSendBackCount: 0,
      ircReviews: [],
      allocatedTeamMembers: [],
      financeSendBackCount: 0
    };

    setIdeas(prev => [newIdea, ...prev]);
    setSelectedIdeaId(newIdea.id);
    db.upsertIdea(newIdea).catch(err => console.error("[db] new idea upsert:", err));

    // Dynamic Zoho Emails Triggers
    const confirmBody = `Dear ${formData.employeeName},<br/><br/>Thank you for submitting your idea proposal to the RIPPLE incubation portal! Your submission has been captured under ID <strong>${formattedId}</strong>.<br/><br/><strong>Idea Title:</strong> "${formData.title}"<br/><strong>Business Unit:</strong> ${formData.businessUnit}<br/></br>Central C-POC has been notified and is conducting the Quality Vetting step prior to IRC presentations.<br/><br/>Best Regards,<br/>TM & OD CoE (One Ion Exchange Ltd.)`;
    
    // Add employee mail log
    const log1: NotificationLog = {
      id: `notif-${Date.now()}-emp`,
      ideaId: formattedId,
      recipient: formData.employeeEmail,
      subject: `One Ion Notification: Idea Submitted & ID Allocated - ${formattedId}`,
      body: confirmBody,
      timestamp: new Date().toISOString()
    };

    // Route notify email log to C-POC
    const cpocBody = `Dear C-POC Team,<br/><br/>A new idea proposal has been submitted to the RIPPLE platform from associate ${formData.employeeName}.<br/><br/><strong>Project Title:</strong> "${formData.title}"<br/><strong>Unique ID:</strong> ${formattedId}<br/><br/>Please review details under the Quality Vetting panel to approve for monthly IRC senior advisor connect.<br/><br/>Best Regards,<br/>RIPPLE Core Server.`;
    const log2: NotificationLog = {
      id: `notif-${Date.now()}-cpoc`,
      ideaId: formattedId,
      recipient: "coe@ionexchange.com",
      subject: `One Ion Notification: Quality Vetting Task Assigned - ${formattedId}`,
      body: cpocBody,
      timestamp: new Date().toISOString()
    };

    setNotificationLogs(prev => [log1, log2, ...prev]);
    Promise.all([db.insertNotification(log1), db.insertNotification(log2)])
      .catch(err => console.error("[db] submit notifications:", err));
    setActiveTab("taskcenter");
  };

  // Clear inbox — local + Supabase
  const handleClearInbox = () => {
    localStorage.removeItem("ion_notifications");
    db.deleteAllNotifications().catch(console.error);
    setNotificationLogs([]);
  };

  // Master system reset — clears both localStorage and Supabase, reseeds mock data
  const handleSystemRestore = () => {
    if (confirm("Reset local workshop state and restore defaults?")) {
      localStorage.removeItem("ion_ideas");
      localStorage.removeItem("ion_notifications");
      // Clear DB and reseed with mock data
      Promise.all([db.deleteAllIdeas(), db.deleteAllNotifications()])
        .then(() => db.upsertManyIdeas(MOCK_IDEAS))
        .catch(console.error);
      setIdeas(MOCK_IDEAS);
      setNotificationLogs([
        {
          id: "notif-init",
          ideaId: "ION-2026-0001",
          recipient: "sathyakumar@entrans.io",
          subject: "One Ion Notification: Idea Submitted - ION-2026-0001",
          body: `Dear Sathya Kumar,<br/><br/>Thank you for submitting your idea to the One Ion — Idea Box program!<br/><br/>Your idea has been successfully received and allocated the unique identifier: <strong>ION-2026-0001</strong>.<br/><br/>Best Regards,<br/>Talent Management & OD Centre of Excellence (CoE)<br/>Ion Exchange (India) Ltd.`,
          timestamp: "2026-06-01T10:15:00Z"
        }
      ]);
      setSelectedIdeaId("ION-2026-0001");
      setActiveTab("dashboard");
      alert("Workshop database successfully restored to standard test cases.");
    }
  };

  if (!currentPersona) {
    if (!showLogin) {
      return <LandingPage onSignIn={() => setShowLogin(true)} />;
    }
    return (
      <LoginGate
        onBack={() => setShowLogin(false)}
        onLogin={(persona) => {
          setCurrentPersona(persona);
          setShowLogin(false);
          localStorage.setItem("ripple_logged_persona", JSON.stringify(persona));
        }} 
      />
    );
  }

  // Supabase initial data load screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-5 text-white">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          ION
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          Connecting to Supabase — loading live data…
        </div>
        <p className="text-xs text-slate-500">One Ion Ripple Platform</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none antialiased bg-slate-50 text-slate-800 transition-all duration-300 ${demoOpen ? "mr-80" : ""}`}>
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 text-slate-900 py-4 px-6 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ION
            </div>
            <div>
              <h1 className="text-sm font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-1.5 leading-none uppercase">
                One Ion — Idea Box Portal
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/50 font-mono font-bold text-[8.5px] px-2 py-0.5 rounded-full tracking-wider">
                  Bento Flow
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Ion Exchange (India) Limited Corporate Ideation Program
              </p>
            </div>
          </div>

          {/* Quick Resolute buttons */}
          <div className="flex items-center gap-2">
            {/* Demo Flow trigger button */}
            <button
              onClick={() => setDemoOpen(v => !v)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                demoOpen
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <polygon points="5,3 19,12 5,21" fill="currentColor" />
              </svg>
              {demoOpen ? "Close Demo" : "Run Live Demo"}
            </button>

            {/* Submit New Idea — Employee only, header shortcut */}
            {currentPersona.role === "Employee" && (
              <button
                onClick={() => setActiveTab("submit")}
                className="animate-bulb-glow px-4 py-2 text-sm font-bold text-amber-800 border border-amber-300 rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95"
              >
                <Lightbulb className="w-4 h-4 text-amber-500 animate-bulb-icon" />
                Submit New Idea
              </button>
            )}
            <button
              onClick={handleSystemRestore}
              className="px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3 text-indigo-500" />
              Restore Testcases
            </button>
            <div className={`flex items-center border px-2.5 py-1 rounded-full text-[10px] font-semibold ${
              realtimeStatus === "connected"
                ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
                : realtimeStatus === "connecting"
                ? "bg-amber-50 border-amber-200/60 text-amber-700"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1.5 ${
                realtimeStatus === "connected" ? "bg-emerald-500 animate-pulse"
                : realtimeStatus === "connecting" ? "bg-amber-400 animate-pulse"
                : "bg-slate-400"
              }`} />
              <span>
                {realtimeStatus === "connected" ? "Live — Real-time"
                : realtimeStatus === "connecting" ? "Connecting…"
                : "Offline (localStorage)"}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Active Secure Persona Workspace Segment */}
      <section className="bg-slate-900 border-b border-slate-800 py-3 px-6 shadow-md relative text-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-400/35 flex items-center justify-center font-bold text-xs text-sky-450 font-mono shadow-xs animate-pulse">
              {currentPersona.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-widest font-bold text-indigo-300 font-mono">
                  Active Session
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs font-bold font-display text-white mt-0.5">
                {currentPersona.name} &bull; <span className="text-sky-350 font-mono">[{currentPersona.role}]</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-none mt-1">
                {currentPersona.email} {currentPersona.businessUnit ? `| ${currentPersona.businessUnit}` : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            
            {/* Quick Switch Dropdown — hidden for Employee role */}
            {currentPersona.role !== "Employee" && (
            <div className="relative group">
              <button 
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                <span>Simulate Switch User</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-850 border border-slate-700 rounded-xl shadow-xl shadow-slate-950/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 p-1 divide-y divide-slate-800 max-h-96 overflow-y-auto">
                <div className="p-2 text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider sticky top-0 bg-slate-850">
                  Select Corporate Persona
                </div>

                {/* Employee section */}
                <div className="py-1">
                  <div className="px-2.5 py-1 text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest">
                    Employees
                  </div>
                  {ALL_SWITCH_PERSONAS.filter(p => p.role === "Employee").map((p) => (
                    <button key={p.email}
                      onClick={() => { setCurrentPersona(p); localStorage.setItem("ripple_logged_persona", JSON.stringify(p)); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10.5px] text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex flex-col cursor-pointer"
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="text-[8px] text-emerald-500/70 font-mono">{p.role} &bull; {p.businessUnit}</span>
                    </button>
                  ))}
                </div>

                {/* Admin section */}
                <div className="py-1">
                  <div className="px-2.5 py-1 text-[8px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                    Governance / Admin
                  </div>
                  {ALL_SWITCH_PERSONAS.filter(p => p.role !== "Employee" && p.role !== "Super Admin").map((p) => (
                    <button key={p.email}
                      onClick={() => { setCurrentPersona(p); localStorage.setItem("ripple_logged_persona", JSON.stringify(p)); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10.5px] text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex flex-col cursor-pointer"
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="text-[8px] text-slate-500 font-mono">{p.role} &bull; {p.businessUnit}</span>
                    </button>
                  ))}
                </div>

                {/* Super Admin section */}
                <div className="py-1">
                  <div className="px-2.5 py-1 text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    Super Admin
                  </div>
                  {ALL_SWITCH_PERSONAS.filter(p => p.role === "Super Admin").map((p) => (
                    <button key={p.email}
                      onClick={() => { setCurrentPersona(p); localStorage.setItem("ripple_logged_persona", JSON.stringify(p)); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10.5px] text-amber-200 hover:text-white hover:bg-amber-950/40 transition-all flex flex-col cursor-pointer"
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="text-[8px] text-amber-500/70 font-mono">{p.role} &bull; Full Oversight</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Clear Sign Out button */}
            <button
              onClick={() => {
                localStorage.removeItem("ripple_logged_persona");
                setCurrentPersona(null);
                setActiveTab("dashboard");
              }}
              className="px-3 py-1.5 text-[10px] font-bold text-rose-300 bg-rose-950/30 hover:bg-rose-955/50 border border-rose-900/50 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Tab Controller navigation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 mb-6 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2.5 text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "border-indigo-600 text-indigo-700 bg-linear-to-b from-transparent to-indigo-50/20"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {currentPersona.role === "Employee" ? "My Proposals Desk" : "Dashboard & Registry"}
          </button>



          {/* Simulate Gating Task - visible for all roles */}
          <button
              onClick={() => setActiveTab("taskcenter")}
              className={`px-4 py-2.5 text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === "taskcenter"
                  ? "border-indigo-600 text-indigo-700 bg-linear-to-b from-transparent to-indigo-50/20"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Simulate Active Task
              {selectedIdea && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute right-1.5 top-1.5" />
              )}
            </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2.5 text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "certificates"
                ? "border-indigo-600 text-indigo-700 bg-linear-to-b from-transparent to-indigo-50/20"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Credentials Chamber
          </button>

          <button
            onClick={() => setActiveTab("monthlytracker")}
            className={`px-4 py-2.5 text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "monthlytracker"
                ? "border-indigo-600 text-indigo-700 bg-linear-to-b from-transparent to-indigo-50/20"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Monthly Tracker
          </button>

          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-4 py-2.5 text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "meetings"
                ? "border-indigo-600 text-indigo-700 bg-linear-to-b from-transparent to-indigo-50/20"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Meeting Management
          </button>

          <button
            onClick={() => setActiveTab("zohomail")}
            className={`px-4 py-2.5 text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "zohomail"
                ? "border-indigo-650 text-indigo-700 bg-linear-to-b from-transparent to-indigo-50/20"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Zoho Mail Inbox
            {(() => {
              const count = notificationLogs.filter(log => {
                const r = log.recipient.toLowerCase();
                const e = currentPersona?.email.toLowerCase() || "";
                if (currentPersona?.role === "CFO" || currentPersona?.role === "Super Admin") {
                  return true; // Super Admin and CFO see all
                }
                return r === e;
              }).length;

              return count > 0 ? (
                <span className="bg-indigo-100 text-indigo-700 font-mono px-1.5 py-0.5 text-[9px] rounded-full font-bold">
                  {count}
                </span>
              ) : null;
            })()}
          </button>
        </div>

        {/* Tab Contents Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Main Workspace Block */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "dashboard" && (
                  <Dashboard 
                    ideas={ideas} 
                    onSelectIdea={handleSelectIdeaFromDashboard}
                    selectedIdeaId={selectedIdeaId}
                    persona={currentPersona}
                  />
                )}

                {activeTab === "submit" && currentPersona.role === "Employee" && (
                  <IdeaSubmissionForm onSubmit={handleNewIdeaSubmit} currentPersona={currentPersona} />
                )}

                {activeTab === "submit" && currentPersona.role !== "Employee" && (
                  <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-lg mx-auto">
                    <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3 animate-bounce" />
                    <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wider font-display">
                      Security Restriction: Access Denied
                    </h3>
                    <p className="text-[10.5px] mt-2 text-rose-800 leading-relaxed font-sans font-medium">
                      Strict Segregation of Duties (SoD) policy restricts the Proposer Submission Desk to <strong>Employees</strong>. Administrative roster accounts (such as <strong>{currentPersona.role}</strong>) are restricted from submitting ideas.
                    </p>
                  </div>
                )}

                {activeTab === "taskcenter" && currentPersona.role === "Super Admin" && selectedIdea && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-800">
                      <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                      Super Admin Observer Mode — Full read-only view of all stages. No action buttons shown.
                    </div>
                    <TaskCenter 
                      idea={selectedIdea}
                      persona={currentPersona}
                      onUpdateIdea={handleUpdateIdea}
                      onAddNotification={handleAddNotification}
                    />
                  </div>
                )}

                {activeTab === "taskcenter" && currentPersona.role !== "Super Admin" && selectedIdea && (
                  <TaskCenter 
                    idea={selectedIdea}
                    persona={currentPersona}
                    onUpdateIdea={handleUpdateIdea}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {activeTab === "taskcenter" && currentPersona.role !== "Employee" && !selectedIdea && (
                  <div className="p-12 text-center text-slate-400 bg-white border rounded-xl flex flex-col items-center justify-center">
                    <ClipboardCheck className="w-10 h-10 opacity-30 mb-2" />
                    <p className="font-semibold text-xs">No Active Project Selected</p>
                    <p className="text-[10px] mt-1 text-slate-400 max-w-sm">
                      Please head back to the <strong>Dashboard & Registry</strong> tab and select an authorized project to evaluate.
                    </p>
                  </div>
                )}

                {activeTab === "certificates" && (
                  <CertificationModule 
                    ideas={ideas}
                    persona={currentPersona}
                    selectedIdea={selectedIdea || undefined}
                    onSelectIdea={handleSelectIdeaFromDashboard}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {activeTab === "monthlytracker" && (
                  <MonthlyTrackerModule 
                    ideas={ideas}
                    persona={currentPersona}
                    onUpdateIdea={handleUpdateIdea}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {activeTab === "meetings" && (
                  <MeetingManagementModule 
                    ideas={ideas}
                    persona={currentPersona}
                    meetings={meetings}
                    onAddMeeting={(m) => {
                      setMeetings(prev => [m, ...prev]);
                      db.upsertMeeting(m).catch(console.error);
                    }}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {activeTab === "zohomail" && (
                  <NotificationLogView 
                    logs={notificationLogs} 
                    onClear={handleClearInbox}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Active 25-Stage Checklist Timeline */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Project info card */}
            {selectedIdea ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-widest">
                    Selected Idea Flow
                  </h3>
                  <span className="font-mono bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100/60 shadow-xs">
                    {selectedIdea.id}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-650 font-sans">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Title</span>
                    <strong className="text-slate-800 leading-snug font-display text-xs line-clamp-2 mt-1 block">{selectedIdea.title}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Submitter</span>
                      <span className="font-medium text-slate-800 block mt-0.5">{selectedIdea.employeeName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Email</span>
                      <span className="font-mono text-slate-500 font-medium tracking-tight block truncate mt-0.5" title={selectedIdea.employeeEmail}>{selectedIdea.employeeEmail}</span>
                    </div>
                  </div>
                </div>

                {/* RIPPLE Visual Timeline Checklist */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#0b1a30] mb-3 flex items-center justify-between font-mono">
                    <span>RIPPLE Stage-Gate Timeline</span>
                    <span className="text-indigo-650 font-bold text-[9.5px]">Active Progress</span>
                  </h4>

                  <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 scrollbar-thin">
                    {Object.values(IdeaStatus).map((status, index) => {
                      const isActive = selectedIdea.status === status;
                      const hasPassed = Object.values(IdeaStatus).indexOf(selectedIdea.status) >= index;
                      const isClosed = (selectedIdea.status.includes("Closed") || selectedIdea.status.includes("Rejected")) && isActive;

                      return (
                        <div 
                          key={status}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition-all text-[11px] border ${
                            isActive 
                              ? isClosed
                                ? "bg-rose-50 border-rose-300 font-bold text-rose-800 shadow-xs"
                                : "bg-indigo-50/70 border-indigo-200 font-bold text-indigo-900 shadow-xs scale-[1.01]"
                              : hasPassed
                              ? "bg-slate-50/70 border-slate-100 text-slate-400 line-through"
                              : "border-transparent text-slate-400"
                          }`}
                        >
                          <div className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isActive
                              ? isClosed
                                ? "bg-rose-600 text-white"
                                : "bg-indigo-600 text-white animate-pulse"
                              : hasPassed
                              ? "bg-slate-300 text-slate-500"
                              : "bg-slate-150 text-slate-400 border border-slate-200/50"
                          }`}>
                            {index + 1}
                          </div>
                          <span className="truncate">{status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-100 p-6 rounded-2xl text-center text-slate-400 border border-slate-250">
                <p className="text-xs font-semibold">No active idea timeline loaded.</p>
              </div>
            )}

            {/* ── Next Step Flow Guide ── */}
            {selectedIdea && (() => {
              type StepDef = { label: string; role: string; instruction: string; personaKey: string };
              const STEP_MAP: Partial<Record<IdeaStatus, StepDef>> = {
                [IdeaStatus.Submitted]:           { label: "C-POC Quality Vetting",        role: "C-POC",           personaKey: "coe@ionexchange.com",           instruction: "Open Task Center → verify the 5-item checklist → Approve or Return the idea." },
                [IdeaStatus.ReturnedToEmployee]:  { label: "Employee Resubmission",         role: "Employee",        personaKey: selectedIdea.employeeEmail,      instruction: "Open Task Center → review C-POC comments → edit fields → Resubmit." },
                [IdeaStatus.ApprovedByCPOC]:      { label: "C-POC — Schedule IRC Meeting",  role: "C-POC",           personaKey: "coe@ionexchange.com",           instruction: "Open Task Center → configure IRC committee & threshold → Publish Meeting." },
                [IdeaStatus.UnderIRCEvaluation]:  { label: "IRC Member — Score Idea",       role: "IRC Member",      personaKey: "advisor@ionexchange.com",       instruction: "Open Task Center → adjust 4 score sliders (1–5) → Submit Scorecard. Then switch back to C-POC to run the board average." },
                [IdeaStatus.SelectedByIRC]:       { label: "C-POC — Assign Functional Head",role: "C-POC",           personaKey: "coe@ionexchange.com",           instruction: "Open Task Center → select a Functional Head → Assign & Handoff." },
                [IdeaStatus.WithFunctionalHead]:  { label: "Functional Head — Review",      role: "Functional Head", personaKey: "alok.gupta@ionexchange.com",    instruction: "Open Task Center → accept or decline. If accept, nominate Project Lead & team." },
                [IdeaStatus.AwaitingActionPlan]:  { label: "Plan Owner — Submit Action Plan",role: "Plan Owner",     personaKey: "kavita.s@ionexchange.com",      instruction: "Open Task Center → fill objectives, milestones, budget, dates → Submit Action Plan." },
                [IdeaStatus.ActionPlanRevision]:  { label: "Plan Owner — Revise Plan",       role: "Plan Owner",     personaKey: "kavita.s@ionexchange.com",      instruction: "Open Task Center → update Action Plan based on FH remarks → Resubmit." },
                [IdeaStatus.ActionPlanSubmitted]: { label: "Functional Head — Review Plan",  role: "Functional Head", personaKey: "alok.gupta@ionexchange.com",   instruction: "Open Task Center → review Action Plan → Approve, Send-back, or Reject." },
                [IdeaStatus.ActionPlanApproved]:  { label: "Plan Owner — Run Pilot & Report",role: "Plan Owner",     personaKey: "kavita.s@ionexchange.com",      instruction: "Add Monthly Tracker updates, then open Task Center → submit Final Report with savings figure." },
                [IdeaStatus.ReportRevision]:      { label: "Plan Owner — Revise Report",     role: "Plan Owner",     personaKey: "kavita.s@ionexchange.com",      instruction: "Open Task Center → revise Final Report per FH feedback → Resubmit." },
                [IdeaStatus.ReportSubmitted]:     { label: "Functional Head — Review Report",role: "Functional Head", personaKey: "alok.gupta@ionexchange.com",   instruction: "Open Task Center → review Final Report → Approve (sends to Finance) or Send-back." },
                [IdeaStatus.PendingFinanceEvaluation]: { label: "Finance — Audit Savings",  role: "Finance",         personaKey: "finance@ionexchange.com",       instruction: "Open Task Center → input certified savings (Rs.) → Approve or Send-back (max 2×)." },
                [IdeaStatus.FinanceRevision]:     { label: "Plan Owner — Revise Savings",    role: "Plan Owner",     personaKey: "kavita.s@ionexchange.com",      instruction: "Open Task Center → update savings figure per Finance feedback → Resubmit." },
                [IdeaStatus.PendingCFOSignOff]:   { label: "CFO — Final Sign-Off",           role: "CFO",            personaKey: "nmr@ionexchange.com",           instruction: "Open Task Center → click CFO Sign-Off to release rewards & close the journey." },
              };

              const step = STEP_MAP[selectedIdea.status];
              const isComplete = selectedIdea.status === IdeaStatus.Completed;
              const isClosed = selectedIdea.status.includes("Closed");

              if (!step && !isComplete && !isClosed) return null;

              const switchPersona = step ? ALL_SWITCH_PERSONAS.find(p => p.email === step.personaKey) || ALL_SWITCH_PERSONAS.find(p => p.role === step.role) : null;

              return (
                <div className={`rounded-2xl border p-4 space-y-3 text-xs ${
                  isComplete ? "bg-emerald-50 border-emerald-200" :
                  isClosed   ? "bg-rose-50 border-rose-200" :
                               "bg-indigo-50 border-indigo-200"
                }`}>
                  <h4 className={`font-display font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${
                    isComplete ? "text-emerald-800" : isClosed ? "text-rose-800" : "text-indigo-900"
                  }`}>
                    <ChevronRight className="w-3.5 h-3.5" />
                    {isComplete ? "Journey Complete 🎉" : isClosed ? "Idea Closed" : "Next Step Required"}
                  </h4>

                  {step && (
                    <>
                      <div className="space-y-1">
                        <div className={`font-bold text-[11px] ${isClosed ? "text-rose-700" : "text-indigo-800"}`}>
                          {step.label}
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed">{step.instruction}</p>
                      </div>

                      {switchPersona && (
                        <button
                          onClick={() => {
                            setCurrentPersona(switchPersona);
                            localStorage.setItem("ripple_logged_persona", JSON.stringify(switchPersona));
                            setActiveTab("taskcenter");
                          }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <KeyRound className="w-3 h-3" />
                          Switch to {step.role} &amp; Open Task Center
                        </button>
                      )}
                    </>
                  )}

                  {isComplete && (
                    <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                      All stages cleared. CFO has signed off. Rewards distributed. Certificate of Contribution issued.
                    </p>
                  )}

                  {isClosed && !step && (
                    <p className="text-[10px] text-rose-700 leading-relaxed font-medium">
                      This idea journey was closed at the current gate. No further actions required.
                    </p>
                  )}
                </div>
              );
            })()}

          </div>

        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 py-3 mt-12 text-center text-[10px] text-slate-400 font-mono">
        &copy; 2026 Ion Exchange (India) Limited. Core Ideation Server Platform. Unified Corporate Portal.
      </footer>

      {/* ── Demo Flow Runner Panel (fixed overlay, inside root div) ── */}
      {demoOpen && (
        <DemoFlowRunner
          ideas={ideas}
          setIdeas={setIdeas}
          setCurrentPersona={(p) => {
            setCurrentPersona(p);
            localStorage.setItem("ripple_logged_persona", JSON.stringify(p));
          }}
          setActiveTab={(t) => setActiveTab(t as typeof activeTab)}
          setSelectedIdeaId={setSelectedIdeaId}
          onClose={() => setDemoOpen(false)}
        />
      )}

    </div>
  );
}
