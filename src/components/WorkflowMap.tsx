/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Idea, IdeaStatus } from "../types";
import { 
  Users, 
  SearchCode, 
  Calendar, 
  HelpCircle, 
  Award, 
  Clock, 
  Briefcase, 
  FileCheck, 
  ShieldAlert, 
  CheckCircle,
  FileText,
  Activity,
  UserCheck,
  Percent,
  Coins,
  Send,
  Download
} from "lucide-react";

interface WorkflowMapProps {
  idea: Idea;
}

export const WorkflowMap: React.FC<WorkflowMapProps> = ({ idea }) => {
  const currentStatus = idea.status;

  // Helpers to check passage or active status of nodes
  const getStatusIndex = (status: IdeaStatus) => {
    return Object.values(IdeaStatus).indexOf(status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  const isNodeActive = (nodeKeys: IdeaStatus[]) => {
    return nodeKeys.includes(currentStatus);
  };

  const isNodePassed = (nodeKeys: IdeaStatus[]) => {
    // If any of the nodeKeys is the current state, it is active rather than passed
    if (isNodeActive(nodeKeys)) return false;
    // Find the max index among our keys
    const maxKeyIndex = Math.max(...nodeKeys.map(k => getStatusIndex(k)));
    return currentIndex > maxKeyIndex;
  };

  // Node styles from the PNG's legend:
  // - System / Platform = Blue (border-sky-500 bg-sky-50 text-sky-800)
  // - Offline meeting = Purple (border-violet-500 bg-violet-50 text-violet-800)
  // - Approval / Recognition = Green (border-emerald-500 bg-emerald-50 text-emerald-850)
  // - Closure = Red (border-rose-500 bg-rose-50 text-rose-800)
  // - Final Reward = Dark Blue (border-indigo-950 bg-indigo-900 text-white)
  // - Decision diamond = Yellow/Orange (border-amber-500 bg-amber-50 text-amber-900 rounded-lg rotate-15)

  // RIPPLE WORKFLOW NODES SPLIT BY ROWS (exactly like the PNG layout)

  // ROW 1
  const row1Nodes = [
    {
      id: "node_1",
      label: "Proposal Submitted",
      desc: "Employee submits idea on portal",
      type: "system",
      keys: [IdeaStatus.Submitted],
      icon: Send
    },
    {
      id: "node_2",
      label: "C-POC Quality Vetting",
      desc: "Approve or Send-back (2x = reject)",
      type: "system",
      keys: [IdeaStatus.Submitted, IdeaStatus.ReturnedToEmployee, IdeaStatus.VettingLimitExceeded],
      icon: SearchCode
    },
    {
      id: "node_3",
      label: "Proposer-IRC Meet Setup",
      desc: "C-POC schedules offline pitcher",
      type: "offline",
      keys: [IdeaStatus.ApprovedByCPOC],
      icon: Calendar
    },
    {
      id: "node_4",
      label: "Senior Advisors Evaluation",
      desc: "IRC panel scoring & assessment",
      type: "system",
      keys: [IdeaStatus.UnderIRCEvaluation],
      icon: Users
    },
    {
      id: "node_5",
      label: "Idea Selected Check",
      desc: "Advisor authorization decisions",
      type: "decision",
      keys: [IdeaStatus.SelectedByIRC, IdeaStatus.RejectedByIRC],
      icon: HelpCircle
    },
    {
      id: "node_6",
      label: "Voucher Released",
      desc: "Rs. 2k reward & digital Selection Cert",
      type: "approval",
      keys: [IdeaStatus.SelectedByIRC],
      icon: Award
    }
  ];

  // ROW 2
  const row2Nodes = [
    {
      id: "node_7",
      label: "IRC Core FH Handoff",
      desc: "Central C-POC inputs FH details",
      type: "system",
      keys: [IdeaStatus.SelectedByIRC],
      icon: UserCheck
    },
    {
      id: "node_8",
      label: "FH-Proposer Offline Meet",
      desc: "Align pilot trial parameters",
      type: "offline",
      keys: [IdeaStatus.WithFunctionalHead],
      icon: Calendar
    },
    {
      id: "node_9",
      label: "FH Deploy Decision",
      desc: "Decline closes idea / Accept trials",
      type: "decision",
      keys: [IdeaStatus.WithFunctionalHead, IdeaStatus.DeclinedByFH],
      icon: HelpCircle
    },
    {
      id: "node_10",
      label: "Nominate Team & Lead",
      desc: "FH inputs lead & trial co-menders",
      type: "approval",
      keys: [IdeaStatus.AwaitingActionPlan],
      icon: Briefcase
    },
    {
      id: "node_11",
      label: "Structured Action Plan",
      desc: "Project Lead files timeline & budget",
      type: "system",
      keys: [IdeaStatus.AwaitingActionPlan, IdeaStatus.ActionPlanRevision],
      icon: FileText
    },
    {
      id: "node_12",
      label: "FH Plan Approval",
      desc: "Approve / Send-back revision / Reject",
      type: "decision",
      keys: [IdeaStatus.ActionPlanSubmitted, IdeaStatus.ActionPlanRejected],
      icon: HelpCircle
    }
  ];

  // ROW 3
  const row3Nodes = [
    {
      id: "node_13",
      label: "Action Plan Approved",
      desc: "C-POC registers offline tracker lock",
      type: "approval",
      keys: [IdeaStatus.ActionPlanApproved],
      icon: CheckCircle
    },
    {
      id: "node_14",
      label: "Trial & Final Report",
      desc: "Lead submits deliverables & savings",
      type: "system",
      keys: [IdeaStatus.ActionPlanApproved, IdeaStatus.ReportSubmitted, IdeaStatus.ReportRevision],
      icon: Activity
    },
    {
      id: "node_15",
      label: "C-POC Finance offline",
      desc: "Validate chemical/O&M savings logs",
      type: "offline",
      keys: [IdeaStatus.PendingFinanceEvaluation],
      icon: Calendar
    },
    {
      id: "node_16",
      label: "Central Finance Audit",
      desc: "Approve net savings / Sendback (max 2x → auto-close)",
      type: "decision",
      keys: [IdeaStatus.PendingFinanceEvaluation, IdeaStatus.FinanceRevision, IdeaStatus.FinanceRevisionLimitExceeded],
      icon: HelpCircle
    },
    {
      id: "node_17",
      label: "Rewards calculation",
      desc: "System split: 25% Owner / 75% Team",
      type: "system",
      keys: [IdeaStatus.PendingCFOSignOff],
      icon: Percent
    },
    {
      id: "node_18",
      label: "CFO Disbursement",
      desc: "CFO signoff triggers mail to Finance",
      type: "approval",
      keys: [IdeaStatus.Completed],
      icon: Coins
    }
  ];

  const renderNodeCard = (node: any) => {
    const active = isNodeActive(node.keys);
    const passed = isNodePassed(node.keys);
    const IconComponent = node.icon;

    // Check custom closure color conditions (Rejection nodes)
    let isRejectionOrDecline = false;
    if (active) {
      if (
        currentStatus === IdeaStatus.RejectedByIRC || 
        currentStatus === IdeaStatus.DeclinedByFH || 
        currentStatus === IdeaStatus.ActionPlanRejected ||
        currentStatus === IdeaStatus.VettingLimitExceeded
      ) {
        isRejectionOrDecline = true;
      }
    }

    // Determine colors
    let cardStyle = "bg-slate-50 border-slate-200 text-slate-400";
    let iconBg = "bg-slate-100 text-slate-400";

    if (active) {
      if (isRejectionOrDecline) {
        cardStyle = "bg-rose-50 border-rose-300 text-rose-900 shadow-md ring-2 ring-rose-500/20";
        iconBg = "bg-rose-600 text-white animate-pulse";
      } else if (node.type === "system") {
        cardStyle = "bg-sky-50 border-sky-400 text-sky-950 shadow-md ring-2 ring-sky-500/20";
        iconBg = "bg-sky-600 text-white animate-bounce";
      } else if (node.type === "offline") {
        cardStyle = "bg-violet-50 border-violet-450 text-violet-950 shadow-md ring-2 ring-violet-500/20";
        iconBg = "bg-violet-600 text-white animate-pulse";
      } else if (node.type === "approval") {
        cardStyle = "bg-emerald-50 border-emerald-450 text-emerald-950 shadow-md ring-2 ring-emerald-500/20";
        iconBg = "bg-emerald-600 text-white animate-pulse";
      } else if (node.type === "decision") {
        cardStyle = "bg-amber-50 border-amber-450 text-amber-950 shadow-md ring-2 ring-amber-500/20";
        iconBg = "bg-amber-500 text-white animate-spin-slow";
      } else {
        cardStyle = "bg-indigo-900 border-indigo-950 text-white shadow-md";
        iconBg = "bg-emerald-500 text-white";
      }
    } else if (passed) {
      cardStyle = "bg-slate-100/50 border-slate-200/60 text-slate-400 line-through";
      iconBg = "bg-slate-200 text-slate-400";
    }

    // Decision specific card shape (rotate etc)
    const cardShape = node.type === "decision" ? "rounded-2xl" : "rounded-xl";

    return (
      <div 
        key={node.id} 
        className={`flex-1 min-w-[130px] p-2.5 border transition-all duration-300 flex flex-col justify-between ${cardShape} ${cardStyle}`}
      >
        <div className="flex items-start justify-between gap-1">
          <span className="text-[9.5px] font-bold leading-tight font-display tracking-wide uppercase line-clamp-2">
            {node.label}
          </span>
          <div className={`p-1.5 rounded-lg flex-shrink-0 ${iconBg}`}>
            <IconComponent className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-[8.5px] text-slate-500 mt-1.5 leading-snug font-sans tracking-tight">
          {active && isRejectionOrDecline ? "Incubation Closed / Rejected" : node.desc}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 card-shadow space-y-4">
      {/* Visual Title & Legend Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-150 pb-3">
        <div>
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping" />
            RIPPLE Workflow Live Monitor (Visual Map)
          </h4>
          <p className="text-[9.5px] text-slate-500 font-sans mt-1">
            Track implementation gating nodes corresponding to standard corporate incubation rules.
          </p>
        </div>

        {/* Dynamic Map Legend */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[8.5px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-sky-500 border" />
            <span>Platform</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-violet-500 border" />
            <span>Offline</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-500 border" />
            <span>Approval</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-rose-500 border" />
            <span>Closure</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-amber-500 border" />
            <span>Decision</span>
          </div>
        </div>
      </div>

      {/* Rows Container */}
      <div className="space-y-4 overflow-x-auto pb-1">
        {/* Row 1 / Phase 1: Vetting & Selection */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1 font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Phase 1: Quality Vetting & Advisor Jury Connect</span>
            <span className="text-sky-700">Live Stage Gate</span>
          </div>
          <div className="flex gap-2.5">
            {row1Nodes.map(renderNodeCard)}
          </div>
        </div>

        {/* Row 2 / Phase 2: FH Allocation & Action Plan Setup */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className="flex justify-between items-center px-1 font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Phase 2: Functional Assignment & Deployment Plan</span>
            {currentIndex >= 6 && <span className="text-violet-700">Handoff Stage</span>}
          </div>
          <div className="flex gap-2.5">
            {row2Nodes.map(renderNodeCard)}
          </div>
        </div>

        {/* Row 3 / Phase 3: Project Execution & Reward split */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className="flex justify-between items-center px-1 font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Phase 3: Execution, Savings Audit & CFO Disbursement Sign-off</span>
            {currentIndex >= 12 && <span className="text-emerald-700">Realized Stage</span>}
          </div>
          <div className="flex gap-2.5">
            {row3Nodes.map(renderNodeCard)}
          </div>
        </div>
      </div>
    </div>
  );
};
