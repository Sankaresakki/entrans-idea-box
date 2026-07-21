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
    const MONTH_OPTIONS = (() => {
      const opts: string[] = [];
      const now = new Date();
      for (let i = 12; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        opts.push(d.toLocaleString("en-IN", { month: "long", year: "numeric" }));
      }
      return opts;
    })();

    const savePLRow = (idea: Idea) => {
      const edit = rowEdits[idea.id] || emptyRow();
      if (!edit.milestoneActivities.trim()) { alert("Please fill in Milestone Activities for This Month."); return; }
      if (!edit.progressAchieved.trim()) { alert("Please fill in Progress Achieved for Assigned Milestones."); return; }
      const entry = {
        month: selectedMonth,
        status: edit.status,
        achievements: edit.progressAchieved,
        milestones: edit.milestoneActivities,
        comments: edit.remarks,
        dateSubmitted: new Date().toISOString(),
      };
      const existing = (idea.monthlyTrackers || []).filter((e) => e.month !== selectedMonth);
      onUpdateIdea({ ...idea, monthlyTrackers: [...existing, entry] });
      onAddNotification(
        "coe@ionexchange.com",
        `Monthly Update Submitted — ${idea.id} (${selectedMonth})`,
        `Dear C-POC,\n\nProject Lead ${persona.name} has submitted their monthly progress update for "${idea.fhProjectTitle || idea.title}" (${idea.id}) — ${selectedMonth}.\n\nMilestone Activities: ${edit.milestoneActivities}\nProgress Achieved: ${edit.progressAchieved}\nStatus: ${edit.status}${edit.remarks ? `\nRemarks: ${edit.remarks}` : ""}\n\nPlease review and update the monthly tracker by the 5th of the month.`
      );
      setSavedRows((prev) => { const s = new Set(prev); s.add(idea.id); return s; });
      setTimeout(
        () => setSavedRows((prev) => { const s = new Set(prev); s.delete(idea.id); return s; }),
        2500
      );
      setPoSuccess(`Monthly update for ${selectedMonth} submitted successfully. C-POC has been notified.`);
      setTimeout(() => setPoSuccess(""), 5000);
    };

    return (
      <div className="space-y-5">
        {/* Header bar */}
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
                Your active pilot projects — log milestone activities and progress. C-POC is notified automatically.
              </p>
            </div>
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Reporting Month
                </label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 w-44">
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold rounded-xl cursor-pointer transition-all">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {poSuccess && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />{poSuccess}
          </div>
        )}

        <div className="print-area-table">
          <div className="no-print mb-3 px-1">
            <p className="text-[10.5px] font-bold text-slate-800">
              RIPPLE — Monthly Project Progress Tracker &nbsp;|&nbsp;
              <span className="text-teal-700">{selectedMonth}</span>
              &nbsp;|&nbsp; Ion Exchange (India) Limited
            </p>
            <p className="text-[9.5px] text-slate-400 mt-0.5">
              Fill in milestone activities and progress achieved for each project, then click Save to submit to C-POC.
            </p>
          </div>

          {visibleIdeas.length === 0 ? (
            <div className="no-print p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
              <Clock className="w-10 h-10 opacity-20 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No active pilots assigned to you yet.</p>
              <p className="text-[11px] mt-1">Projects appear here after the Action Plan is approved by the Functional Head.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto overflow-y-visible">
              <table className="w-full text-xs border-collapse min-w-[960px]">
                <thead>
                  <tr className="bg-teal-800 text-white">
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-center border-r border-teal-700 w-10">Sr.{"\u00a0"}No.</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-24">Idea ID</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-36">Idea Title</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-28">Functional Head</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-28">Project Lead</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700">Milestone Activities for{"\u00a0"}This Month</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700">Progress Achieved for{"\u00a0"}Assigned Milestones</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-center border-r border-teal-700 w-24">Status</th>
                    <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700">Remarks / Escalation (if any)</th>
                    <th className="no-print px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-center w-12">Save</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleIdeas.map((idea, idx) => {
                    const edit = rowEdits[idea.id] || emptyRow();
                    const isSaved = savedRows.has(idea.id);
                    return (
                      <tr key={idea.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-teal-50/20 transition-colors`}>
                        <td className="px-3 py-3 text-center text-[10px] text-slate-500 font-mono border-b border-r border-slate-100 align-top">{idx + 1}</td>
                        <td className="px-3 py-3 border-b border-r border-slate-100 align-top">
                          <span className="font-mono text-[9.5px] font-bold text-teal-700 whitespace-nowrap">{idea.id}</span>
                        </td>
                        <td className="px-3 py-3 border-b border-r border-slate-100 align-top max-w-[130px]">
                          <span className="text-[10.5px] text-slate-800 leading-snug">{idea.fhProjectTitle || idea.title}</span>
                        </td>
                        <td className="px-3 py-3 border-b border-r border-slate-100 align-top">
                          <span className="text-[10px] text-slate-700">{idea.assignedFHName || "—"}</span>
                        </td>
                        <td className="px-3 py-3 border-b border-r border-slate-100 align-top">
                          <span className="text-[10px] text-slate-700">{idea.projectLeadName || idea.employeeName}</span>
                        </td>
                        <td className="px-2 py-2 border-b border-r border-slate-100 align-top">
                          <textarea value={edit.milestoneActivities}
                            onChange={(e) => setCell(idea.id, "milestoneActivities", e.target.value)}
                            rows={3} placeholder="Enter milestone activities for this month..."
                            className="w-full px-2 py-1.5 bg-teal-50/50 border border-teal-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none min-w-[150px]" />
                        </td>
                        <td className="px-2 py-2 border-b border-r border-slate-100 align-top">
                          <textarea value={edit.progressAchieved}
                            onChange={(e) => setCell(idea.id, "progressAchieved", e.target.value)}
                            rows={3} placeholder="Progress achieved against milestones..."
                            className="w-full px-2 py-1.5 bg-teal-50/50 border border-teal-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none min-w-[150px]" />
                        </td>
                        <td className="px-2 py-2 border-b border-r border-slate-100 align-top text-center">
                          <select value={edit.status} onChange={(e) => setCell(idea.id, "status", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-bold focus:outline-none focus:ring-1 focus:ring-teal-400 min-w-[90px]">
                            <option>On Track</option>
                            <option>Delayed</option>
                            <option>On Hold</option>
                            <option>Completed</option>
                          </select>
                        </td>
                        <td className="px-2 py-2 border-b border-r border-slate-100 align-top">
                          <textarea value={edit.remarks}
                            onChange={(e) => setCell(idea.id, "remarks", e.target.value)}
                            rows={3} placeholder="Remarks, escalation flags, or actions required..."
                            className="w-full px-2 py-1.5 bg-amber-50/50 border border-amber-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none min-w-[120px]" />
                        </td>
                        <td className="no-print px-2 py-2 border-b border-slate-100 align-top text-center">
                          <button onClick={() => savePLRow(idea)} title={isSaved ? "Saved!" : "Submit update to C-POC"}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer transition-all ${
                              isSaved
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-teal-600 hover:bg-teal-700 text-white"
                            }`}>
                            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // C-POC / ADMIN / FH / OTHER ROLES -- ANNEXURE 9 TABLE
  return (
    <div className="space-y-5">
      {/* ── Header bar with Idea ID selector ── */}
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

      {/* Printable section */}
      <div className="print-area-table">
        {/* Screen sub-header */}
        <div className="no-print mb-3 px-1">
          <p className="text-[10.5px] font-bold text-slate-800">
            RIPPLE â€” Monthly Project Progress Tracker &nbsp;|&nbsp;
            <span className="text-teal-700">{selectedMonth}</span>
            &nbsp;|&nbsp; Ion Exchange (India) Limited
          </p>
          <p className="text-[9.5px] text-slate-400 mt-0.5">
            One row per active pilot idea. C-POC to update by the 5th of each month and share with CHRO.
            {isCPOC && (
              <span className="ml-2 text-teal-600 font-semibold">
                Edit cells inline â€” save each row individually.
              </span>
            )}
          </p>
        </div>

        {/* Print-only document header */}
        <div className="screen-hidden-print-visible mb-5">
          <p style={{ fontSize: "8pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569" }}>
            ION EXCHANGE (INDIA) LIMITED â€” RIPPLE EMPLOYEE INNOVATION PROGRAMME
          </p>
          <p style={{ fontSize: "14pt", fontWeight: 900, color: "#0f172a", marginTop: "2pt" }}>
            RIPPLE â€” Monthly Project Progress Tracker &nbsp;|&nbsp; {selectedMonth} &nbsp;|&nbsp; Ion Exchange (India) Limited
          </p>
          <p style={{ fontSize: "8pt", color: "#64748b", marginTop: "2pt" }}>
            One row per active pilot idea. C-POC to update by the 5th of each month and share with CHRO.
          </p>
        </div>

        {visibleIdeas.length === 0 ? (
          <div className="no-print p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            <Clock className="w-10 h-10 opacity-20 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No active pilot projects to track yet.</p>
            <p className="text-[11px] mt-1">Projects appear here after their Action Plan is approved by the Functional Head.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto overflow-y-visible">
            <table className="w-full text-xs border-collapse min-w-[960px]">
              <thead>
                <tr className="bg-teal-800 text-white">
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-center border-r border-teal-700 w-10">Sr.{"\u00a0"}No.</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-24">Idea ID</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-36">Idea Title</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-28">Functional Head</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700 w-28">Project Lead</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700">Milestone Activities for{"\u00a0"}This Month</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700">Progress Achieved for{"\u00a0"}Assigned Milestones</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-center border-r border-teal-700 w-24">Status</th>
                  <th className="px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-left border-r border-teal-700">Remarks / Escalation (if any)</th>
                  {isCPOC && (
                    <th className="no-print px-3 py-3 text-[8.5px] font-black uppercase tracking-widest text-center w-12">Save</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {visibleIdeas.map((idea, idx) => {
                  const edit = rowEdits[idea.id] || emptyRow();
                  const isSaved = savedRows.has(idea.id);
                  return (
                    <tr key={idea.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-teal-50/20 transition-colors`}>
                      <td className="px-3 py-3 text-center text-[10px] text-slate-500 font-mono border-b border-r border-slate-100 align-top">{idx + 1}</td>
                      <td className="px-3 py-3 border-b border-r border-slate-100 align-top">
                        <span className="font-mono text-[9.5px] font-bold text-teal-700 whitespace-nowrap">{idea.id}</span>
                      </td>
                      <td className="px-3 py-3 border-b border-r border-slate-100 align-top max-w-[130px]">
                        <span className="text-[10.5px] text-slate-800 leading-snug">{idea.fhProjectTitle || idea.title}</span>
                      </td>
                      <td className="px-3 py-3 border-b border-r border-slate-100 align-top">
                        <span className="text-[10px] text-slate-700">{idea.assignedFHName || "â€”"}</span>
                      </td>
                      <td className="px-3 py-3 border-b border-r border-slate-100 align-top">
                        <span className="text-[10px] text-slate-700">{idea.projectLeadName || idea.employeeName}</span>
                      </td>
                      {/* Milestone Activities */}
                      <td className="px-2 py-2 border-b border-r border-slate-100 align-top">
                        {isCPOC ? (
                          <textarea value={edit.milestoneActivities}
                            onChange={(e) => setCell(idea.id, "milestoneActivities", e.target.value)}
                            rows={3} placeholder="Enter milestone activities for this monthâ€¦"
                            className="w-full px-2 py-1.5 bg-teal-50/50 border border-teal-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none min-w-[150px]" />
                        ) : (
                          <span className="text-[10px] text-slate-600 whitespace-pre-line">
                            {edit.milestoneActivities || <span className="text-slate-300 italic">â€”</span>}
                          </span>
                        )}
                      </td>
                      {/* Progress Achieved */}
                      <td className="px-2 py-2 border-b border-r border-slate-100 align-top">
                        {isCPOC ? (
                          <textarea value={edit.progressAchieved}
                            onChange={(e) => setCell(idea.id, "progressAchieved", e.target.value)}
                            rows={3} placeholder="Progress achieved against milestonesâ€¦"
                            className="w-full px-2 py-1.5 bg-teal-50/50 border border-teal-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none min-w-[150px]" />
                        ) : (
                          <span className="text-[10px] text-slate-600 whitespace-pre-line">
                            {edit.progressAchieved || <span className="text-slate-300 italic">â€”</span>}
                          </span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-2 py-2 border-b border-r border-slate-100 align-top text-center">
                        {isCPOC ? (
                          <select value={edit.status} onChange={(e) => setCell(idea.id, "status", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-bold focus:outline-none focus:ring-1 focus:ring-teal-400 min-w-[90px]">
                            <option>On Track</option>
                            <option>Delayed</option>
                            <option>On Hold</option>
                            <option>Completed</option>
                          </select>
                        ) : (
                          <StatusBadge status={edit.status} />
                        )}
                      </td>
                      {/* Remarks */}
                      <td className="px-2 py-2 border-b border-r border-slate-100 align-top">
                        {isCPOC ? (
                          <textarea value={edit.remarks}
                            onChange={(e) => setCell(idea.id, "remarks", e.target.value)}
                            rows={3} placeholder="Remarks, escalation flags, or actions requiredâ€¦"
                            className="w-full px-2 py-1.5 bg-amber-50/50 border border-amber-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none min-w-[120px]" />
                        ) : (
                          <span className="text-[10px] text-slate-600 whitespace-pre-line">
                            {edit.remarks || <span className="text-slate-300 italic">â€”</span>}
                          </span>
                        )}
                      </td>
                      {/* Save button â€” C-POC only, hidden on print */}
                      {isCPOC && (
                        <td className="no-print px-2 py-2 border-b border-slate-100 align-top text-center">
                          <button onClick={() => saveRow(idea)} title={isSaved ? "Saved!" : "Save row"}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer transition-all ${
                              isSaved
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-teal-600 hover:bg-teal-700 text-white"
                            }`}>
                            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Print footer */}
        <div className="screen-hidden-print-visible mt-4 pt-2 border-t border-slate-300">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8pt", color: "#64748b" }}>
            <span>Prepared by: C-POC | RIPPLE â€” Talent Management &amp; OD | Ion Exchange (India) Limited</span>
            <span>Reporting Month: {selectedMonth}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
