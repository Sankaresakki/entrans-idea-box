﻿﻿/**
 * ANNEXURE 9 â€” RIPPLE Monthly Project Progress Tracker
 * One row per active pilot idea.
 * C-POC fills and saves by the 5th of each month, then prints / shares with CHRO.
 * Project Leads log their own monthly updates; C-POC sees them pre-filled.
 */

import React, { useState, useEffect, useMemo } from "react";
import { Idea, IdeaStatus, UserPersona } from "../types";
import {
  Download,
  Save,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
} from "lucide-react";

// Statuses that indicate an active pilot project (action plan approved and beyond)
const PILOT_STATUSES = new Set<IdeaStatus>([
  IdeaStatus.ActionPlanApproved,
  IdeaStatus.ReportSubmitted,
  IdeaStatus.ReportRevision,
  IdeaStatus.PendingFinanceEvaluation,
  IdeaStatus.FinanceRevision,
  IdeaStatus.FinanceRevisionLimitExceeded,
  IdeaStatus.PendingCFOSignOff,
  IdeaStatus.Completed,
]);

type TrackStatus = "On Track" | "Delayed" | "On Hold" | "Completed";

interface RowState {
  milestoneActivities: string;
  progressAchieved: string;
  status: TrackStatus;
  remarks: string;
}

const emptyRow = (): RowState => ({
  milestoneActivities: "",
  progressAchieved: "",
  status: "On Track",
  remarks: "",
});

const getRowFromIdea = (idea: Idea, month: string): RowState => {
  const cpoc = (idea.cpocMonthlyEntries || []).find((e) => e.month === month);
  if (cpoc) {
    return {
      milestoneActivities: cpoc.milestoneActivities,
      progressAchieved: cpoc.progressAchieved,
      status: cpoc.status as TrackStatus,
      remarks: cpoc.remarks,
    };
  }
  const po = (idea.monthlyTrackers || []).find((t) => t.month === month);
  if (po) {
    return {
      milestoneActivities: po.milestones || "",
      progressAchieved: po.achievements || "",
      status: po.status as TrackStatus,
      remarks: po.comments || "",
    };
  }
  return emptyRow();
};

const formatMonth = (d: Date) =>
  d.toLocaleString("en-IN", { month: "long", year: "numeric" });

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg =
    status === "On Track"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : status === "Delayed"
      ? "bg-rose-100 text-rose-800 border-rose-200"
      : status === "Completed"
      ? "bg-indigo-100 text-indigo-800 border-indigo-200"
      : "bg-amber-100 text-amber-800 border-amber-200";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[9.5px] font-bold border whitespace-nowrap ${cfg}`}>
      {status}
    </span>
  );
};

interface MonthlyTrackerModuleProps {
  ideas: Idea[];
  persona: UserPersona;
  onUpdateIdea: (updatedIdea: Idea) => void;
  onAddNotification: (recipient: string, subject: string, message: string) => void;
}

export const MonthlyTrackerModule: React.FC<MonthlyTrackerModuleProps> = ({
  ideas,
  persona,
  onUpdateIdea,
  onAddNotification,
}) => {
  const isCPOC = persona.role === "C-POC" || persona.role === "Super Admin";
  const isProjectLead = persona.role === "Project Lead";

  const activeIdeas = useMemo(
    () => ideas.filter((i) => PILOT_STATUSES.has(i.status)),
    [ideas]
  );

  const visibleIdeas = useMemo(
    () =>
      isProjectLead
        ? activeIdeas.filter(
            (i) =>
              i.projectLeadEmail?.toLowerCase() === persona.email.toLowerCase() ||
              i.employeeEmail.toLowerCase() === persona.email.toLowerCase()
          )
        : activeIdeas,
    [activeIdeas, persona, isProjectLead]
  );

  // â”€â”€ Month selector â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [selectedMonth, setSelectedMonth] = useState(formatMonth(new Date()));
  const [cpocSelectedIdeaId, setCpocSelectedIdeaId] = useState("");

  // â”€â”€ C-POC inline row edits â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [rowEdits, setRowEdits] = useState<Record<string, RowState>>({});
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const init: Record<string, RowState> = {};
    for (const idea of visibleIdeas) {
      init[idea.id] = getRowFromIdea(idea, selectedMonth);
    }
    setRowEdits(init);
    setSavedRows(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  useEffect(() => {
    setRowEdits((prev) => {
      const updated = { ...prev };
      for (const idea of visibleIdeas) {
        if (!updated[idea.id]) {
          updated[idea.id] = getRowFromIdea(idea, selectedMonth);
        }
      }
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIdeas.length]);

  useEffect(() => {
    if (!cpocSelectedIdeaId && visibleIdeas.length > 0) {
      setCpocSelectedIdeaId(visibleIdeas[0].id);
      return;
    }
    if (cpocSelectedIdeaId && !visibleIdeas.some((idea) => idea.id === cpocSelectedIdeaId)) {
      setCpocSelectedIdeaId(visibleIdeas[0]?.id || "");
    }
  }, [cpocSelectedIdeaId, visibleIdeas]);

  const setCell = (ideaId: string, field: keyof RowState, val: string) => {
    setRowEdits((prev) => ({
      ...prev,
      [ideaId]: { ...(prev[ideaId] || emptyRow()), [field]: val },
    }));
  };

  const saveRow = (idea: Idea) => {
    const edit = rowEdits[idea.id] || emptyRow();
    const entry = {
      month: selectedMonth,
      milestoneActivities: edit.milestoneActivities,
      progressAchieved: edit.progressAchieved,
      status: edit.status,
      remarks: edit.remarks,
      updatedAt: new Date().toISOString(),
    };
    const existing = (idea.cpocMonthlyEntries || []).filter(
      (e) => e.month !== selectedMonth
    );
    onUpdateIdea({ ...idea, cpocMonthlyEntries: [...existing, entry] });
    setSavedRows((prev) => { const s = new Set(prev); s.add(idea.id); return s; });
    setTimeout(
      () => setSavedRows((prev) => { const s = new Set(prev); s.delete(idea.id); return s; }),
      2500
    );
  };

  const handlePrint = () => {
    const style = document.createElement("style");
    style.id = "__print-tracker-page__";
    style.textContent = "@page { size: A4 landscape; margin: 8mm; }";
    document.head.appendChild(style);
    document.body.classList.add("print-tracker");
    window.print();
    document.body.classList.remove("print-tracker");
    const el = document.getElementById("__print-tracker-page__");
    if (el) document.head.removeChild(el);
  };

  const handleExportCSV = () => {
    const headers = ["Sr.No","Idea ID","Idea Title","Functional Head","Project Lead","Milestone Activities","Progress Achieved","Status","Remarks"];
    const esc = (s: string) => `"${String(s || "").replace(/"/g, '""')}"`;
    const rows = visibleIdeas.map((idea, idx) => {
      const edit = rowEdits[idea.id] || emptyRow();
      return [
        idx + 1, idea.id,
        esc(idea.fhProjectTitle || idea.title),
        esc(idea.assignedFHName || ""),
        esc(idea.projectLeadName || idea.employeeName),
        esc(edit.milestoneActivities),
        esc(edit.progressAchieved),
        edit.status,
        esc(edit.remarks),
      ].join(",");
    });
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RIPPLE_Tracker_${selectedMonth.replace(/ /g, "_")}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // â”€â”€ Project Lead form state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [selectedIdeaId, setSelectedIdeaId] = useState(""); // Require explicit selection
  const [poMonth, setPoMonth] = useState(formatMonth(new Date()));
  const [poMilestones, setPoMilestones] = useState("");
  const [poProgress, setPoProgress] = useState("");
  const [poStatus, setPoStatus] = useState<TrackStatus>("On Track");
  const [poRemarks, setPoRemarks] = useState("");
  const [poSuccess, setPoSuccess] = useState("");
  const [showPoForm, setShowPoForm] = useState(false);

  const handlePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idea = ideas.find((i) => i.id === selectedIdeaId);
    if (!idea) return;
    if (!poMonth.trim()) { alert("Please enter the reporting month (e.g. July 2026)."); return; }
    if (!poMilestones.trim()) { alert("Please fill in Milestone Activities for This Month."); return; }
    if (!poProgress.trim()) { alert("Please fill in Progress Achieved for Assigned Milestones."); return; }
    const entry = {
      month: poMonth.trim(),
      status: poStatus,
      achievements: poProgress,
      milestones: poMilestones,
      comments: poRemarks,
      dateSubmitted: new Date().toISOString(),
    };
    onUpdateIdea({ ...idea, monthlyTrackers: [entry, ...(idea.monthlyTrackers || [])] });
    onAddNotification(
      "coe@ionexchange.com",
      `Monthly Update Submitted — ${idea.id} (${poMonth.trim()})`,
      `Dear C-POC,\n\nProject Lead ${persona.name} has submitted their monthly progress update for "${idea.fhProjectTitle || idea.title}" (${idea.id}) â€” ${poMonth.trim()}.\n\nMilestone Activities: ${poMilestones}\nProgress Achieved: ${poProgress}\nStatus: ${poStatus}${poRemarks ? `\nRemarks: ${poRemarks}` : ""}\n\nPlease review and update the monthly tracker by the 5th of the month.`
    );
    setPoMilestones(""); setPoProgress(""); setPoRemarks(""); setPoStatus("On Track");
    setShowPoForm(false);
    setPoSuccess(`Monthly update for ${poMonth.trim()} submitted. C-POC notified.`);
    setTimeout(() => setPoSuccess(""), 5000);
  };

  // â”€â”€ Project Lead VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (isProjectLead) {
    const selectedIdea = ideas.find((i) => i.id === selectedIdeaId);
    const history = selectedIdea?.monthlyTrackers || [];
    // Generate rolling 13-month window (12 past + current)
    const MONTH_OPTIONS = (() => {
      const opts: string[] = [];
      const now = new Date();
      for (let i = 12; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        opts.push(d.toLocaleString("en-IN", { month: "long", year: "numeric" }));
      }
      return opts;
    })();
    const submittedMonths = new Set((history || []).map(t => t.month));

    return (
      <div className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
              Monthly Tracker
            </span>
            <h2 className="text-xl font-black font-display text-slate-900 tracking-tight mt-1">
              Monthly Progress Update
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Log milestone activities and progress for your active pilot. C-POC is notified automatically.
            </p>
          </div>
          {visibleIdeas.length > 0 && (
            <div className="flex flex-col gap-1.5 min-w-[240px]">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Select Project <span className="text-rose-500">*</span></label>
              <select
                value={selectedIdeaId}
                onChange={(e) => { setSelectedIdeaId(e.target.value); setShowPoForm(false); }}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              >
                <option value="">-- Select an Idea ID --</option>
                {visibleIdeas.map((i) => (
                  <option key={i.id} value={i.id}>{i.id} — {(i.fhProjectTitle || i.title).slice(0, 35)}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {poSuccess && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />{poSuccess}
          </div>
        )}

        {visibleIdeas.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            <Clock className="w-10 h-10 opacity-20 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No active pilots assigned to you yet.</p>
            <p className="text-[11px] mt-1">Projects become trackable after the Action Plan is approved by the Functional Head.</p>
          </div>
        ) : !selectedIdeaId ? (
          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            <Clock className="w-10 h-10 opacity-20 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">Select a Project to Continue</p>
            <p className="text-[11px] mt-1">Choose an Idea ID from the dropdown above to view history or log a new update.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Submission History ({history.length})
                </h3>
                {!showPoForm && (
                  <button onClick={() => setShowPoForm(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg cursor-pointer">
                    <Plus className="w-3 h-3" /> Add Update
                  </button>
                )}
              </div>
              {/* Month coverage indicators — green = submitted, red = missed, amber = current */}
              {MONTH_OPTIONS.length > 0 && (
                <div className="py-2 flex flex-wrap gap-1.5">
                  {MONTH_OPTIONS.map((m, idx) => {
                    const submitted = submittedMonths.has(m);
                    const isCurrent = idx === MONTH_OPTIONS.length - 1;
                    const isPastMonth = !isCurrent;
                    const color = submitted
                      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                      : isPastMonth
                      ? "bg-rose-100 text-rose-600 border-rose-300"
                      : "bg-amber-100 text-amber-700 border-amber-300";
                    return (
                      <span key={m} title={submitted ? "Submitted" : isPastMonth ? "Missed — overdue submission" : "Current month — pending"}
                        className={`px-2 py-0.5 text-[8.5px] font-bold border rounded-full whitespace-nowrap cursor-default ${color}`}>
                        {m.slice(0, m.lastIndexOf(" "))} {submitted ? "✓" : isPastMonth ? "!" : "~"}
                      </span>
                    );
                  })}
                </div>
              )}
              {history.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <p className="text-xs">No monthly updates submitted for this project yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((t, i) => (
                    <div key={i} className="pl-4 border-l-2 border-teal-200 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-800">{t.month}</span>
                        <StatusBadge status={t.status} />
                        <span className="text-[9px] text-slate-400 font-mono ml-auto">{new Date(t.dateSubmitted).toLocaleDateString()}</span>
                      </div>
                      {t.milestones && <p className="text-[10.5px] text-slate-700"><strong>Milestone Activities:</strong> {t.milestones}</p>}
                      {t.achievements && <p className="text-[10.5px] text-slate-700"><strong>Progress Achieved:</strong> {t.achievements}</p>}
                      {t.comments && <p className="text-[10.5px] text-slate-500 italic"><strong>Remarks:</strong> {t.comments}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              {showPoForm ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">New Monthly Update</h3>
                    <button onClick={() => setShowPoForm(false)} className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
                  </div>
                  <form onSubmit={handlePOSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                        Reporting Month <span className="text-rose-500">*</span>
                      </label>
                      <select value={poMonth} onChange={(e) => setPoMonth(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-400 focus:outline-none">
                        {MONTH_OPTIONS.map(m => (
                          <option key={m} value={m}>{m}{submittedMonths.has(m) ? " ✓ Submitted" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                        Milestone Activities for This Month <span className="text-rose-500">*</span>
                      </label>
                      <textarea value={poMilestones} onChange={(e) => setPoMilestones(e.target.value)} rows={3}
                        placeholder="What milestone activities were planned and carried out this month?"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                        Progress Achieved for Assigned Milestones <span className="text-rose-500">*</span>
                      </label>
                      <textarea value={poProgress} onChange={(e) => setPoProgress(e.target.value)} rows={3}
                        placeholder="What was actually achieved against those milestones?"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Status</label>
                      <div className="flex gap-2 flex-wrap">
                        {(["On Track", "Delayed", "On Hold", "Completed"] as TrackStatus[]).map((s) => (
                          <button key={s} type="button" onClick={() => setPoStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                              poStatus === s
                                ? s === "On Track" ? "bg-emerald-600 text-white border-emerald-600"
                                : s === "Delayed" ? "bg-rose-600 text-white border-rose-600"
                                : s === "On Hold" ? "bg-amber-500 text-white border-amber-500"
                                : "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                        Remarks / Escalation <span className="text-slate-400 normal-case font-normal tracking-normal">(optional)</span>
                      </label>
                      <textarea value={poRemarks} onChange={(e) => setPoRemarks(e.target.value)} rows={2}
                        placeholder="Any blockers, escalation flags, or notes for C-POCâ€¦"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none" />
                    </div>
                    <button type="submit"
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl cursor-pointer transition-all">
                      Submit Monthly Update
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                  <Plus className="w-8 h-8 opacity-30 mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">Log this month's progress</p>
                  <p className="text-[10.5px]">Click "Add Update" to submit your milestone activities and progress achieved.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // C-POC / ADMIN VIEW
  return (
    <div className="space-y-5">
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
              Monthly Tracker
            </span>
            <h2 className="text-xl font-black font-display text-slate-900 tracking-tight mt-1">
              Monthly Project Progress Tracker
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              All active pilot projects — update by the 5th of each month. Export to CSV for offline analysis.
            </p>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="min-w-[250px]">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Select Project
              </label>
              <select
                value={cpocSelectedIdeaId}
                onChange={(e) => setCpocSelectedIdeaId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {visibleIdeas.length === 0 && <option value="">No active projects</option>}
                {visibleIdeas.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    {idea.id} — {(idea.fhProjectTitle || idea.title).slice(0, 40)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Reporting Month
              </label>
              <input type="text" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 w-44" />
            </div>
            <button onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold rounded-xl cursor-pointer transition-all">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>
      </div>
      {visibleIdeas.length === 0 ? (
        <div className="no-print p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <Clock className="w-10 h-10 opacity-20 mx-auto mb-2" />
          <p className="font-bold text-slate-700 text-sm">No active pilot projects to track yet.</p>
          <p className="text-[11px] mt-1">Projects appear here after the Action Plan is approved by the Functional Head.</p>
        </div>
      ) : (
        (() => {
          const selectedIdea = visibleIdeas.find((idea) => idea.id === cpocSelectedIdeaId) || visibleIdeas[0];
          const edit = rowEdits[selectedIdea.id] || emptyRow();
          const isSaved = savedRows.has(selectedIdea.id);

          const history = [
            ...(selectedIdea.monthlyTrackers || []).map((entry) => ({
              source: "Project Lead",
              month: entry.month,
              status: entry.status,
              milestones: entry.milestones || "",
              progress: entry.achievements || "",
              remarks: entry.comments || "",
              date: entry.dateSubmitted,
            })),
            ...(selectedIdea.cpocMonthlyEntries || []).map((entry) => ({
              source: "C-POC",
              month: entry.month,
              status: entry.status,
              milestones: entry.milestoneActivities || "",
              progress: entry.progressAchieved || "",
              remarks: entry.remarks || "",
              date: entry.updatedAt,
            })),
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Submission History ({history.length})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedIdea.id}</span>
                </div>
                {history.length === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <p className="text-xs">No monthly updates available for this project yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((entry, idx) => (
                      <div key={`${entry.source}-${entry.month}-${idx}`} className="pl-4 border-l-2 border-teal-200 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-800">{entry.month}</span>
                          <StatusBadge status={entry.status} />
                          <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${entry.source === "C-POC" ? "bg-sky-100 text-sky-700 border-sky-200" : "bg-violet-100 text-violet-700 border-violet-200"}`}>
                            {entry.source}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono ml-auto">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        {entry.milestones && <p className="text-[10.5px] text-slate-700"><strong>Milestone Activities:</strong> {entry.milestones}</p>}
                        {entry.progress && <p className="text-[10.5px] text-slate-700"><strong>Progress Achieved:</strong> {entry.progress}</p>}
                        {entry.remarks && <p className="text-[10.5px] text-slate-500 italic"><strong>Remarks:</strong> {entry.remarks}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">C-POC Monthly Update</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">{selectedMonth}</span>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Milestone Activities for This Month
                  </label>
                  <textarea
                    value={edit.milestoneActivities}
                    onChange={(e) => setCell(selectedIdea.id, "milestoneActivities", e.target.value)}
                    rows={3}
                    placeholder="Enter milestone activities for this month"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                    disabled={!isCPOC}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Progress Achieved for Assigned Milestones
                  </label>
                  <textarea
                    value={edit.progressAchieved}
                    onChange={(e) => setCell(selectedIdea.id, "progressAchieved", e.target.value)}
                    rows={3}
                    placeholder="Enter achieved progress for this month"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                    disabled={!isCPOC}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {(["On Track", "Delayed", "On Hold", "Completed"] as TrackStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => isCPOC && setCell(selectedIdea.id, "status", status)}
                        disabled={!isCPOC}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          edit.status === status
                            ? status === "On Track"
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : status === "Delayed"
                              ? "bg-rose-600 text-white border-rose-600"
                              : status === "On Hold"
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 border-slate-300"
                        } ${!isCPOC ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Remarks / Escalation <span className="text-slate-400 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    value={edit.remarks}
                    onChange={(e) => setCell(selectedIdea.id, "remarks", e.target.value)}
                    rows={2}
                    placeholder="Any blockers, escalation flags, or notes"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                    disabled={!isCPOC}
                  />
                </div>

                {isCPOC && (
                  <button
                    onClick={() => saveRow(selectedIdea)}
                    className={`w-full py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                      isSaved
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-teal-600 hover:bg-teal-700 text-white"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save Monthly Update"}
                  </button>
                )}
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};
