/**
 * IdeaWorkflowPanel — Role-specific workflow tab panel.
 * Shows a filtered list of ideas relevant to the current tab.
 * When an idea is selected, the full TaskCenter is shown inline.
 */

import React, { useState } from "react";
import { Idea, IdeaStatus } from "../types";
import { TaskCenter } from "./TaskCenter";
import { ArrowLeft, ClipboardCheck, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  description: string;
  ideas: Idea[];
  statuses: IdeaStatus[];
  persona: { role: string; name: string; email: string };
  onUpdateIdea: (idea: Idea) => void;
  onAddNotification: (
    recipient: string,
    subject: string,
    body: string,
    attachmentName?: string,
    attachmentType?: string
  ) => void;
  /** Optional: pre-select an idea by id on mount */
  initialSelectedId?: string | null;
}

// ─── Status badge colours ──────────────────────────────────────────────────────
const STATUS_PILL: Partial<Record<string, string>> = {
  "Pending C-POC Vetting":                       "bg-slate-100 text-slate-600",
  "Returned to Employee":                         "bg-amber-100 text-amber-700",
  "Vetted — Awaiting Proposer-IRC Meeting":       "bg-blue-100 text-blue-700",
  "Under IRC Evaluation":                         "bg-violet-100 text-violet-700",
  "Selected — Selected by IRC":                   "bg-[#15B45A]/10 text-[#0d7a3a]",
  "Awaiting Functional Head Decision":            "bg-orange-100 text-orange-700",
  "Awaiting Action Plan Submission":              "bg-yellow-100 text-yellow-700",
  "Action Plan Submitted — Pending Approval":     "bg-cyan-100 text-cyan-700",
  "Action Plan — Revision Required":              "bg-orange-100 text-orange-700",
  "Action Plan Approved — C-POC Offline Tracker": "bg-teal-100 text-teal-700",
  "Project Report Submitted — Pending Review":    "bg-indigo-100 text-indigo-700",
  "Project Report — Revision Required":           "bg-orange-100 text-orange-700",
  "Awaiting Finance Impact Evaluation":           "bg-rose-100 text-rose-700",
  "Finance Impact — Revision Required":           "bg-orange-100 text-orange-700",
  "Awaiting CFO / Finance Head Sign-Off":         "bg-purple-100 text-purple-700",
  "Journey Complete — Rewards Distributed":       "bg-emerald-100 text-emerald-700",
};

function pillClass(status: string): string {
  return STATUS_PILL[status] || "bg-slate-100 text-slate-600";
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const IdeaWorkflowPanel: React.FC<Props> = ({
  title,
  description,
  ideas,
  statuses,
  persona,
  onUpdateIdea,
  onAddNotification,
  initialSelectedId = null,
}) => {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(initialSelectedId);

  // Filter to only ideas in relevant statuses
  const relevant = ideas
    .filter(i => statuses.includes(i.status))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const selectedIdea = relevant.find(i => i.id === localSelectedId) || null;

  // ── Idea selected: show TaskCenter ──────────────────────────────────────────
  if (selectedIdea) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setLocalSelectedId(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0098DB] hover:text-[#004a69] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {title} list ({relevant.length} idea{relevant.length !== 1 ? "s" : ""})
        </button>

        <TaskCenter
          idea={selectedIdea}
          persona={persona}
          onUpdateIdea={(updated) => {
            onUpdateIdea(updated);
            // Keep selection if idea is still in relevant statuses; otherwise go back to list
            if (!statuses.includes(updated.status)) {
              setLocalSelectedId(null);
            }
          }}
          onAddNotification={onAddNotification}
        />
      </div>
    );
  }

  // ── Idea list ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Panel header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">{title}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
        </div>
        <span className="text-xs font-bold text-[#0098DB] bg-[#0098DB]/10 px-3 py-1 rounded-full border border-[#0098DB]/20 shrink-0">
          {relevant.length} item{relevant.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {relevant.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
            <ClipboardCheck className="w-7 h-7 text-slate-400" />
          </div>
          <p className="font-bold text-sm text-slate-500">No items in this section right now</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Ideas will appear here once they reach the relevant workflow stage.
          </p>
        </div>
      )}

      {/* Idea cards */}
      {relevant.length > 0 && (
        <div className="space-y-3">
          {relevant.map(idea => (
            <div
              key={idea.id}
              onClick={() => setLocalSelectedId(idea.id)}
              className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-[#0098DB]/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 min-w-0 flex-1">
                  {/* ID + date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{idea.id}</span>
                    {idea.submissionDate && (
                      <>
                        <span className="text-slate-200 text-xs">·</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(idea.submissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0098DB] transition-colors leading-snug">
                    {idea.title}
                  </h3>

                  {/* Status + meta */}
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pillClass(idea.status)}`}>
                      {idea.status}
                    </span>
                    {idea.employeeName && (
                      <span className="text-[10px] text-slate-400">By {idea.employeeName}</span>
                    )}
                    {idea.businessUnit && (
                      <span className="text-[10px] text-slate-400">· {idea.businessUnit}</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 mt-1 w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#0098DB] flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
