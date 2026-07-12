/**
 * EmployeeIdeaTracker — Simplified idea-status view for Employee role.
 * Shows a list of the employee's submitted ideas with simplified status labels.
 * Each idea row can be expanded to show the original submitted form data.
 */

import React, { useState } from "react";
import { Idea, IdeaStatus } from "../types";
import { ChevronDown, ChevronUp, Eye, Lightbulb, Paperclip } from "lucide-react";

interface Props {
  ideas: Idea[];
  persona: { name: string; email: string; role: string };
}

// ─── Simplified status labels per spec ────────────────────────────────────────
function getSimplifiedStatus(status: IdeaStatus): { label: string; colorClass: string } {
  switch (status) {
    case IdeaStatus.ReturnedToEmployee:
      return { label: "Idea Sent Back for Resubmission", colorClass: "bg-amber-100 text-amber-800 border-amber-200" };

    case IdeaStatus.VettingLimitExceeded:
    case IdeaStatus.RejectedByIRC:
    case IdeaStatus.DeclinedByFH:
    case IdeaStatus.ActionPlanRejected:
    case IdeaStatus.ReportRejected:
    case IdeaStatus.FinanceRevisionLimitExceeded:
    case IdeaStatus.NoQuantifiableFinancialBenefit:
      return { label: "Idea — Not Selected", colorClass: "bg-rose-100 text-rose-800 border-rose-200" };

    case IdeaStatus.Submitted:
      return { label: "Pending Quality Review", colorClass: "bg-slate-100 text-slate-600 border-slate-200" };

    case IdeaStatus.ApprovedByCPOC:
    case IdeaStatus.UnderIRCEvaluation:
      return { label: "Shortlisted for IRC Review", colorClass: "bg-[#0098DB]/10 text-[#004a69] border-[#0098DB]/20" };

    case IdeaStatus.SelectedByIRC:
    case IdeaStatus.WithFunctionalHead:
    case IdeaStatus.AwaitingActionPlan:
    case IdeaStatus.ActionPlanSubmitted:
    case IdeaStatus.ActionPlanRevision:
    case IdeaStatus.ActionPlanApproved:
    case IdeaStatus.ReportSubmitted:
    case IdeaStatus.ReportRevision:
    case IdeaStatus.PendingFinanceEvaluation:
    case IdeaStatus.FinanceRevision:
    case IdeaStatus.PendingCFOSignOff:
      return { label: "Idea Selected by IRC", colorClass: "bg-[#15B45A]/10 text-[#0d7a3a] border-[#15B45A]/20" };

    case IdeaStatus.Completed:
      return { label: "Idea Contributed to Financial Impact", colorClass: "bg-emerald-100 text-emerald-800 border-emerald-300" };

    default:
      return { label: "In Review", colorClass: "bg-slate-100 text-slate-600 border-slate-200" };
  }
}

// ─── Field row helper ──────────────────────────────────────────────────────────
const FormField = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</span>
      <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const EmployeeIdeaTracker: React.FC<Props> = ({ ideas, persona }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const myIdeas = ideas
    .filter(i => i.employeeEmail.toLowerCase() === persona.email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (myIdeas.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 mx-auto bg-[#0098DB]/10 rounded-2xl flex items-center justify-center">
          <Lightbulb className="w-8 h-8 text-[#0098DB]" />
        </div>
        <div>
          <h3 className="font-bold text-slate-700 text-sm">No Ideas Submitted Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Head to the <strong>Submit Idea</strong> tab to share your first idea with the organisation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">My Submitted Ideas</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Click <strong>Show Submitted Form</strong> to view your idea details.</p>
        </div>
        <span className="text-xs font-bold text-[#0098DB] bg-[#0098DB]/10 px-3 py-1 rounded-full border border-[#0098DB]/20">
          {myIdeas.length} Idea{myIdeas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {myIdeas.map(idea => {
        const { label, colorClass } = getSimplifiedStatus(idea.status);
        const isExpanded = expandedId === idea.id;

        return (
          <div key={idea.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
            {/* Header row */}
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{idea.id}</span>
                  <span className="text-slate-200 text-xs">·</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(idea.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{idea.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${colorClass}`}>
                    {label}
                  </span>
                  {idea.areaOfImpact && (
                    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {idea.areaOfImpact}
                    </span>
                  )}
                  {idea.businessUnit && (
                    <span className="inline-block text-[10px] text-slate-400">{idea.businessUnit}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-[#0098DB] bg-[#0098DB]/8 border border-[#0098DB]/20 hover:bg-[#0098DB]/15 rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Eye className="w-3 h-3" />
                {isExpanded ? "Hide Form" : "Show Submitted Form"}
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Expandable submitted form data */}
            {isExpanded && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                  Submitted Idea Proposal — Read Only
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Employee Name" value={idea.employeeName} />
                  <FormField label="Employee ID" value={idea.employeeId} />
                  <FormField label="Department" value={idea.department} />
                  <FormField label="Designation" value={idea.designation} />
                  <FormField label="Business Unit" value={idea.businessUnit} />
                  <FormField label="Area of Impact" value={idea.areaOfImpact} />
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <FormField label="Problem Statement" value={idea.problemStatement} />
                  <FormField label="Proposed Solution" value={idea.proposedSolution} />
                  <FormField label="Expected Impact" value={idea.expectedImpact} />
                </div>

                {idea.uploadedFiles && idea.uploadedFiles.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Attachments
                    </span>
                    <div className="space-y-1.5">
                      {idea.uploadedFiles.map(f => (
                        <div key={f.name} className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{f.name}</span>
                          <span className="text-slate-400">({f.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {idea.customFields && idea.customFields.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    {idea.customFields.map((field, cfIdx) => (
                      <React.Fragment key={cfIdx}>
                        <FormField label={String(field.label)} value={field.value != null ? String(field.value) : undefined} />
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
