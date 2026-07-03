/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * End-to-End Live Demo Runner
 * Auto-pilots through the complete Ripple idea lifecycle for client demonstrations.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Idea, IdeaStatus, UserPersona } from "../types";

// ─── Demo personas ───────────────────────────────────────────────────────────
const P_EMPLOYEE: UserPersona = {
  role: "Employee", name: "Sathya Kumar", email: "sathyakumar@entrans.io",
  businessUnit: "Industrial Water Division", employeeId: "ION-EMP-2026-081",
  department: "Process Engineering & Design", designation: "Senior Process Engineer",
};
const P_CPOC: UserPersona = {
  role: "C-POC", name: "TM & OD CoE Lead", email: "coe@ionexchange.com",
  businessUnit: "Central HR & OD", employeeId: "ION-HR-2026-004",
  department: "Talent Management & OD", designation: "AVP - Talent Management & OD",
};
const P_IRC: UserPersona = {
  role: "IRC Member", name: "Senior Advisory Panel", email: "advisor@ionexchange.com",
  businessUnit: "Technical Board", employeeId: "ION-TECH-2026-012",
  department: "R&D Centre of Excellence", designation: "Technical Jury Chairman",
};
const P_FH: UserPersona = {
  role: "Functional Head", name: "Dr. Alok Gupta", email: "alok.gupta@ionexchange.com",
  businessUnit: "Chemical Division", employeeId: "ION-EXEC-2026-003",
  department: "Chemical Manufacturing & Trials", designation: "Executive Director & Business Head",
};
const P_PLAN: UserPersona = {
  role: "Plan Owner", name: "Kavita Sharma (Lead)", email: "kavita.s@ionexchange.com",
  businessUnit: "Project Execution Team", employeeId: "ION-PIL-2026-052",
  department: "Project Execution & Commissioning", designation: "Pilot Implementation Manager",
};
const P_FINANCE: UserPersona = {
  role: "Finance", name: "Central Finance Admin", email: "finance@ionexchange.com",
  businessUnit: "Corporate Finance", employeeId: "ION-FIN-2026-018",
  department: "Corporate Treasury & Audit", designation: "Senior Finance Auditor",
};
const P_CFO: UserPersona = {
  role: "CFO", name: "N. M. Ranadive (CFO)", email: "nmr@ionexchange.com",
  businessUnit: "Executive Committee", employeeId: "ION-CFO-2026-001",
  department: "Executive Finance Committee", designation: "Chief Financial Officer (CFO)",
};

// ─── Demo idea seed ───────────────────────────────────────────────────────────
export const DEMO_IDEA_ID = "DEMO-2026-LIVE";

const makeDemoIdea = (): Idea => ({
  id: DEMO_IDEA_ID,
  status: IdeaStatus.Submitted,
  createdAt: new Date().toISOString(),
  employeeName: "Sathya Kumar",
  employeeEmail: "sathyakumar@entrans.io",
  businessUnit: "Industrial Water Division",
  areaOfImpact: "Process Water Purification Efficiency",
  title: "AI-Driven Predictive Dosing System for Chemical Reduction in Water Treatment",
  problemStatement:
    "Current chemical dosing in water treatment plants is manual and reactive, causing over-dosing by 20–35%, leading to excess chemical costs of ₹12–18 Lakhs annually and increased residual contamination risk.",
  proposedSolution:
    "Deploy an AI-powered real-time dosing controller using IoT turbidity + pH sensors, predictive ML models trained on 3 years of plant data, and automated servo-controlled dosing pumps to maintain optimal chemical usage.",
  expectedImpact:
    "Achieve 28% chemical cost reduction (₹8 Lakhs/year savings), 15% energy savings on pumping, and a 40% reduction in post-treatment chemical residuals — improving water quality scores by 22%.",
  submissionDate: new Date().toISOString(),
  employeeId: "ION-EMP-2026-081",
  department: "Process Engineering & Design",
  designation: "Senior Process Engineer",
  vettingSendBackCount: 0,
  ircReviews: [],
  allocatedTeamMembers: ["kavita.s@ionexchange.com", "deepak.m@ionexchange.com"],
  financeSendBackCount: 0,
});

// ─── Step definitions ─────────────────────────────────────────────────────────
interface DemoStep {
  id: number;
  label: string;
  subLabel: string;
  role: string;
  roleColor: string;
  roleBg: string;
  persona: UserPersona;
  tab: string;
  durationMs: number;
  /** Returns the updated idea (or null if no idea change) */
  applyToIdea: (prev: Idea) => Idea;
}

const STEPS: DemoStep[] = [
  {
    id: 1, label: "Idea Submitted", subLabel: "Employee files the innovation proposal",
    role: "Employee", roleColor: "text-emerald-700", roleBg: "bg-emerald-100",
    persona: P_EMPLOYEE, tab: "taskcenter", durationMs: 3500,
    applyToIdea: (prev) => ({ ...prev, status: IdeaStatus.Submitted }),
  },
  {
    id: 2, label: "C-POC Quality Vetting", subLabel: "Coordinator reviews for quality & relevance",
    role: "C-POC", roleColor: "text-sky-700", roleBg: "bg-sky-100",
    persona: P_CPOC, tab: "taskcenter", durationMs: 3500,
    applyToIdea: (prev) => ({ ...prev }),
  },
  {
    id: 3, label: "Quality Approved → IRC", subLabel: "Idea cleared; IRC jury assigned",
    role: "C-POC", roleColor: "text-sky-700", roleBg: "bg-sky-100",
    persona: P_CPOC, tab: "taskcenter", durationMs: 3500,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.ApprovedByCPOC,
      cpocVettedBy: "TM & OD CoE Lead",
      vettingDate: new Date().toISOString(),
      vettingComments: "Idea demonstrates strong technical merit and clear cost-saving potential. Aligns with ION Water Division priorities. Approved for IRC jury presentation.",
      proposerIrcMeetingDetails: "Virtual Teams meeting scheduled 5th July, 11:00 AM — Sathya Kumar + IRC Advisory Panel.",
      ircCouncilAssignedEmails: ["advisor@ionexchange.com", "ramesh@ionexchange.com"],
      useDefaultIRCCouncil: true,
      ircScoresThreshold: 75,
    }),
  },
  {
    id: 4, label: "IRC Evaluation", subLabel: "Jury scores innovation, feasibility & impact",
    role: "IRC Member", roleColor: "text-violet-700", roleBg: "bg-violet-100",
    persona: P_IRC, tab: "taskcenter", durationMs: 4000,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.UnderIRCEvaluation,
      ircReviews: [{
        reviewerName: "Senior Advisory Panel",
        reviewerEmail: "advisor@ionexchange.com",
        scores: { alignmentPriority: 4, feasibility: 4, businessValue: 5, innovation: 4, scalability: 4, riskDependency: 4, financialRoi: 5 },
        aggregateScore: 4.5,
        comments: "Exceptional financial ROI projection backed by real sensor data. AI-dosing is proven technology repurposed innovatively for ION's specific wastewater chemistry. Highly recommend selection.",
        dateSubmitted: new Date().toISOString(),
      }],
    }),
  },
  {
    id: 5, label: "IRC Selects Idea", subLabel: "Score 87/100 — Appreciation voucher released",
    role: "IRC Member", roleColor: "text-violet-700", roleBg: "bg-violet-100",
    persona: P_IRC, tab: "taskcenter", durationMs: 3500,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.SelectedByIRC,
      averageIrcScore: 87,
      ircSelectionStatus: "Selected" as const,
      ircScoreMin: 1,
      ircScoreMax: 5,
      ircEvaluationCycle: "Monthly Cycle — July 2026",
      selectionVoucherReleased: true,
    }),
  },
  {
    id: 6, label: "Functional Head Accepts", subLabel: "FH assigns project lead & approves execution",
    role: "Functional Head", roleColor: "text-indigo-700", roleBg: "bg-indigo-100",
    persona: P_FH, tab: "taskcenter", durationMs: 3500,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.AwaitingActionPlan,
      assignedFHName: "Dr. Alok Gupta",
      assignedFHEmail: "alok.gupta@ionexchange.com",
      fhDecision: "Accept",
      fhDecisionDate: new Date().toISOString(),
      fhAssignmentComments: "Strong ROI case. Aligning with Q3 capex budget. Kavita Sharma assigned as Project Lead. Begin action plan within 10 days.",
      projectLeadName: "Kavita Sharma",
      projectLeadEmail: "kavita.s@ionexchange.com",
    }),
  },
  {
    id: 7, label: "Action Plan Approved", subLabel: "Plan Owner submits & FH approves the roadmap",
    role: "Plan Owner", roleColor: "text-teal-700", roleBg: "bg-teal-100",
    persona: P_PLAN, tab: "taskcenter", durationMs: 4000,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.ActionPlanApproved,
      actionPlanTitle: "AI Dosing Controller — 6-Month Pilot Rollout",
      actionPlanObjectives: "Deploy IoT sensor network across 3 Water Treatment Plants. Integrate ML dosing model. Validate 28% chemical reduction. Commission servo pump hardware.",
      actionPlanMilestones: "Month 1: Sensor installation & data collection\nMonth 2–3: ML model training & validation\nMonth 4: Pilot hardware deployment\nMonth 5: Trial run & calibration\nMonth 6: Full commissioning & impact report",
      actionPlanBudget: 150000,
      actionPlanTimelineStart: "2026-07-15",
      actionPlanTimelineEnd: "2026-12-15",
      actionPlanDocumentName: "AI_Dosing_Action_Plan_v2.pdf",
      fhPlanDecision: "Approve",
      actionPlanRemarks: "Action plan approved. Procurement authorized. Timeline is aggressive but achievable.",
    }),
  },
  {
    id: 8, label: "Pilot Completed & Report Filed", subLabel: "6-month execution done; final report submitted",
    role: "Plan Owner", roleColor: "text-teal-700", roleBg: "bg-teal-100",
    persona: P_PLAN, tab: "taskcenter", durationMs: 4000,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.PendingFinanceEvaluation,
      monthlyTrackers: [
        { month: "July 2026", status: "On Track" as const, achievements: "IoT sensor deployment across 3 plants completed.", progress: "20%", completionPercentage: 20, dateSubmitted: new Date().toISOString() },
        { month: "August 2026", status: "On Track" as const, achievements: "ML model trained on 18-month historical data. Accuracy 94%.", progress: "42%", completionPercentage: 42, dateSubmitted: new Date().toISOString() },
        { month: "September 2026", status: "On Track" as const, achievements: "Pilot hardware installed, servo pumps calibrated.", progress: "62%", completionPercentage: 62, dateSubmitted: new Date().toISOString() },
        { month: "October 2026", status: "On Track" as const, achievements: "Trial run: 27.4% chemical reduction observed.", progress: "78%", completionPercentage: 78, dateSubmitted: new Date().toISOString() },
        { month: "November 2026", status: "On Track" as const, achievements: "Full commissioning. ₹8.2L savings confirmed.", progress: "95%", completionPercentage: 95, dateSubmitted: new Date().toISOString() },
        { month: "December 2026", status: "Completed" as const, achievements: "Project complete. Final report filed for Finance audit.", progress: "100%", completionPercentage: 100, dateSubmitted: new Date().toISOString() },
      ],
      finalReportObjectivesMet: "All 5 objectives fully achieved. Chemical usage reduced by 27.8% (target: 28%). ₹8,20,000 annual savings verified across 3 plants. IoT uptime: 99.2%.",
      finalReportDocumentName: "AI_Dosing_Final_Report_Dec2026.pdf",
      finalReportSubmissionDate: new Date().toISOString(),
      fhReportDecision: "Approve",
      fhReportRemarks: "Excellent outcome. Numbers verified by plant operations. Recommend permanent deployment across all 12 ION plants.",
    }),
  },
  {
    id: 9, label: "Finance Audit — ₹8.2L Certified", subLabel: "Finance team certifies the financial savings",
    role: "Finance", roleColor: "text-amber-700", roleBg: "bg-amber-100",
    persona: P_FINANCE, tab: "taskcenter", durationMs: 4000,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.PendingCFOSignOff,
      financeEvaluatedImpact: 820000,
      financeDecision: "Validate",
      financeFeedback: "Financial impact of ₹8,20,000 per annum independently verified from plant cost ledgers. Chemical procurement invoices reviewed. Savings certified as recurring. Reward bracket: ₹35,000 (₹7L–₹10L band).",
    }),
  },
  {
    id: 10, label: "CFO Final Sign-Off", subLabel: "CFO authorizes reward distribution",
    role: "CFO", roleColor: "text-rose-700", roleBg: "bg-rose-100",
    persona: P_CFO, tab: "taskcenter", durationMs: 3500,
    applyToIdea: (prev) => ({
      ...prev,
      status: IdeaStatus.Completed,
      cfoSignOffDate: new Date().toISOString(),
      calculatedRewardIdeaOwner: 8750,     // 25% of 35,000
      calculatedRewardTeamMembers: 26250,  // 75% of 35,000
    }),
  },
  {
    id: 11, label: "🎉 Certificate Issued!", subLabel: "Journey complete — Reward: ₹35,000",
    role: "Employee", roleColor: "text-emerald-700", roleBg: "bg-emerald-100",
    persona: P_EMPLOYEE, tab: "certificates", durationMs: 0,
    applyToIdea: (prev) => prev, // no change, just navigate
  },
];

// ─── Role color map ───────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { dot: string; badge: string }> = {
  "Employee":         { dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "C-POC":            { dot: "bg-sky-500",     badge: "bg-sky-100 text-sky-800 border-sky-200" },
  "IRC Member":       { dot: "bg-violet-500",  badge: "bg-violet-100 text-violet-800 border-violet-200" },
  "Functional Head":  { dot: "bg-indigo-500",  badge: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  "Plan Owner":       { dot: "bg-teal-500",    badge: "bg-teal-100 text-teal-800 border-teal-200" },
  "Finance":          { dot: "bg-amber-500",   badge: "bg-amber-100 text-amber-800 border-amber-200" },
  "CFO":              { dot: "bg-rose-500",    badge: "bg-rose-100 text-rose-800 border-rose-200" },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface DemoFlowRunnerProps {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  setCurrentPersona: (p: UserPersona) => void;
  setActiveTab: (t: string) => void;
  setSelectedIdeaId: (id: string) => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const DemoFlowRunner: React.FC<DemoFlowRunnerProps> = ({
  ideas, setIdeas, setCurrentPersona, setActiveTab, setSelectedIdeaId, onClose,
}) => {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stepIdx, setStepIdx] = useState(0);   // 0-based index into STEPS
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (clockRef.current) clearInterval(clockRef.current);
  };

  // ── Execute a single step ────────────────────────────────────────────────
  const executeStep = useCallback((idx: number) => {
    if (idx >= STEPS.length) {
      setPhase("done");
      clearTimers();
      return;
    }
    const step = STEPS[idx];

    // 1. Switch persona
    setCurrentPersona(step.persona);
    localStorage.setItem("ripple_logged_persona", JSON.stringify(step.persona));

    // 2. Ensure demo idea exists (Step 0 creates it)
    setIdeas(prev => {
      const exists = prev.find(i => i.id === DEMO_IDEA_ID);
      const base = exists ?? makeDemoIdea();
      const updated = step.applyToIdea(base);
      if (exists) return prev.map(i => i.id === DEMO_IDEA_ID ? updated : i);
      return [updated, ...prev];
    });

    // 3. Navigate
    setSelectedIdeaId(DEMO_IDEA_ID);
    setActiveTab(step.tab);

    // 4. Schedule next step
    if (step.durationMs > 0) {
      const duration = Math.round(step.durationMs / speed);
      timerRef.current = setTimeout(() => {
        setStepIdx(idx + 1);
      }, duration);
    } else {
      setPhase("done");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // ── Step advancement effect ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "running") return;
    executeStep(stepIdx);
    return clearTimers;
  }, [stepIdx, phase, executeStep]);

  // ── Elapsed clock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "running") {
      setElapsed(0);
      clockRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (clockRef.current) clearInterval(clockRef.current);
    }
    return () => { if (clockRef.current) clearInterval(clockRef.current); };
  }, [phase]);

  const startDemo = () => {
    setStepIdx(0);
    setElapsed(0);
    setPhase("running");
  };

  const resetDemo = () => {
    clearTimers();
    setPhase("idle");
    setStepIdx(0);
    setElapsed(0);
    // Remove demo idea from list
    setIdeas(prev => prev.filter(i => i.id !== DEMO_IDEA_ID));
  };

  const handleClose = () => {
    resetDemo();
    onClose();
  };

  const progress = phase === "done" ? 100 : Math.round((stepIdx / STEPS.length) * 100);
  const currentStep = STEPS[stepIdx] ?? STEPS[STEPS.length - 1];

  // ─── Panel ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed right-0 top-0 h-screen w-80 z-50 flex flex-col bg-slate-950 border-l border-slate-800 shadow-2xl font-sans overflow-hidden">

      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-none">Live Demo Mode</div>
            <div className="text-[10px] text-slate-400 mt-0.5">End-to-End Ripple Flow</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase !== "idle" && (
            <button
              onClick={() => setSpeed(s => s === 1 ? 2 : 1)}
              className="text-[10px] font-bold px-2 py-1 rounded border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
            >
              {speed}x
            </button>
          )}
          <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Body — scrollable step list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
        {STEPS.map((step, i) => {
          const isDone = phase === "running" ? i < stepIdx : phase === "done" ? true : false;
          const isActive = phase === "running" && i === stepIdx;
          const isPending = !isDone && !isActive;
          const rc = ROLE_COLORS[step.role] ?? { dot: "bg-slate-500", badge: "bg-slate-800 text-slate-300 border-slate-700" };

          return (
            <div
              key={step.id}
              className={`rounded-xl px-3 py-2.5 border transition-all duration-500 ${
                isActive
                  ? "bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-950/40"
                  : isDone
                  ? "bg-slate-900/60 border-slate-700/40"
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Step number / state icon */}
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-400">
                      {step.id}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-bold leading-tight ${isActive ? "text-white" : isDone ? "text-slate-300" : "text-slate-500"}`}>
                      {step.label}
                    </span>
                  </div>
                  <div className={`text-[10px] mt-0.5 leading-snug ${isActive ? "text-indigo-300" : "text-slate-500"}`}>
                    {step.subLabel}
                  </div>
                  {/* Role badge */}
                  <span className={`inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${rc.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                    {step.role}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="px-3 py-4 border-t border-slate-800 shrink-0 space-y-3">

        {/* Elapsed / status */}
        {phase === "running" && (
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Running — Step {stepIdx + 1} of {STEPS.length}</span>
            </div>
            <span className="font-mono">{String(Math.floor(elapsed / 60)).padStart(2,"0")}:{String(elapsed % 60).padStart(2,"0")}</span>
          </div>
        )}

        {phase === "done" && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-700/50 rounded-xl text-center space-y-1">
            <div className="text-emerald-400 font-bold text-sm">🎉 Demo Complete!</div>
            <div className="text-[10px] text-emerald-300">Full lifecycle in {elapsed}s · Certificate ready</div>
          </div>
        )}

        {/* Current role indicator when running */}
        {phase === "running" && stepIdx < STEPS.length && (
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[currentStep.role]?.dot ?? "bg-slate-500"} animate-pulse`} />
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400">Currently acting as</div>
              <div className="text-xs font-bold text-white truncate">{currentStep.persona.name}</div>
              <div className="text-[9px] text-slate-500 truncate">{currentStep.role}</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {phase === "idle" && (
          <button
            onClick={startDemo}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <polygon points="5,3 19,12 5,21" fill="currentColor" />
            </svg>
            Start Live Demo
          </button>
        )}

        {phase === "running" && (
          <button
            onClick={resetDemo}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" />
            </svg>
            Reset Demo
          </button>
        )}

        {phase === "done" && (
          <div className="flex gap-2">
            <button
              onClick={resetDemo}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={() => { setStepIdx(0); setElapsed(0); setPhase("running"); }}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Replay
            </button>
          </div>
        )}

        <p className="text-[9px] text-slate-600 text-center">
          Toggle speed with the <strong className="text-slate-500">1x / 2x</strong> button above
        </p>
      </div>
    </div>
  );
};
