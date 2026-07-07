/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Idea, IdeaStatus, UserPersona, AREA_OF_IMPACT_THEMES, BUSINESS_UNITS, getAuthorizedIdeasForRole } from "../types";
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  DollarSign, 
  Award, 
  Eye, 
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  Inbox,
  Database,
  UserCheck,
  Building,
  Sparkles,
  X,
  Paperclip,
  Calendar,
  User,
  Mail,
  BarChart3,
  TrendingUp,
  Printer,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface DashboardProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
  selectedIdeaId: string | null;
  persona: UserPersona;
}

export const Dashboard: React.FC<DashboardProps> = ({ ideas, onSelectIdea, selectedIdeaId, persona }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [buFilter, setBuFilter] = useState("");
  const [impactFilter, setImpactFilter] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"pending" | "all">("pending");
  const [showQuarterly, setShowQuarterly] = useState(false);
  const [viewingDetailIdea, setViewingDetailIdea] = useState<Idea | null>(null);

  // Helper: map a status to the required role responsible for processing the stage-gate
  const getRequiredRoleForStatus = (status: IdeaStatus): string => {
    switch (status) {
      case IdeaStatus.Submitted:
        return "C-POC";
      case IdeaStatus.ReturnedToEmployee:
        return "Employee";
      case IdeaStatus.ApprovedByCPOC:
        return "C-POC";
      case IdeaStatus.UnderIRCEvaluation:
        return "IRC Member";
      case IdeaStatus.SelectedByIRC:
        return "C-POC";
      case IdeaStatus.WithFunctionalHead:
        return "Functional Head";
      case IdeaStatus.AwaitingActionPlan:
      case IdeaStatus.ActionPlanRevision:
        return "Plan Owner (Project Lead)";
      case IdeaStatus.ActionPlanSubmitted:
        return "Functional Head";
      case IdeaStatus.ActionPlanApproved:
      case IdeaStatus.ReportRevision:
        return "Plan Owner (Project Lead)";
      case IdeaStatus.ReportSubmitted:
        return "Functional Head";
      case IdeaStatus.PendingFinanceEvaluation:
      case IdeaStatus.FinanceRevision:
        return "Finance";
      case IdeaStatus.FinanceRevisionLimitExceeded:
        return "Governance System";
      case IdeaStatus.PendingCFOSignOff:
        return "CFO";
      default:
        return "Governance System";
    }
  };

  // Helper: Determine if the currently logged-in persona is authorized to take action on this idea's current status
  const isPersonaHandlerForIdea = (idea: Idea): boolean => {
    const status = idea.status;
    switch (status) {
      case IdeaStatus.Submitted:
      case IdeaStatus.ApprovedByCPOC:
      case IdeaStatus.SelectedByIRC:
        return persona.role === "C-POC";

      case IdeaStatus.ReturnedToEmployee:
        // Employee matches either because they are employee role, and specifically match email
        return persona.role === "Employee" && persona.email.toLowerCase() === idea.employeeEmail.toLowerCase();

      case IdeaStatus.UnderIRCEvaluation:
        return persona.role === "IRC Member";

      case IdeaStatus.WithFunctionalHead:
      case IdeaStatus.ActionPlanSubmitted:
      case IdeaStatus.ReportSubmitted:
        return persona.role === "Functional Head";

      case IdeaStatus.AwaitingActionPlan:
      case IdeaStatus.ActionPlanRevision:
      case IdeaStatus.ActionPlanApproved:
      case IdeaStatus.ReportRevision:
        return persona.role === "Plan Owner";

      case IdeaStatus.PendingFinanceEvaluation:
      case IdeaStatus.FinanceRevision:
        return persona.role === "Finance";

      case IdeaStatus.FinanceRevisionLimitExceeded:
        return false;

      case IdeaStatus.PendingCFOSignOff:
        return persona.role === "CFO";

      default:
        return false;
    }
  };

  // Filter logic
  const matchFilters = (idea: Idea) => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBU = buFilter ? idea.businessUnit === buFilter : true;
    const matchesImpact = impactFilter ? idea.areaOfImpact === impactFilter : true;
    const matchesStatus = statusSearch ? idea.status === statusSearch : true;

    return matchesSearch && matchesBU && matchesImpact && matchesStatus;
  };

  // Filter ideas at the entry level of dashboard to enforce strict segregation of duties (SoD)
  const authorizedIdeas = getAuthorizedIdeasForRole(ideas, persona);

  // Coerce tab selection for non-CFO roles who don't have access to other staff dashboards
  React.useEffect(() => {
    if (persona.role !== "CFO") {
      setActiveWorkspaceTab("pending");
    }
  }, [persona]);

  // Ideas awaiting direct action from CURRENT logged-in user
  const pendingInboxIdeas = authorizedIdeas.filter(idea => isPersonaHandlerForIdea(idea) && matchFilters(idea));

  // All ideas registry matching searched filters
  const allRegistryIdeas = authorizedIdeas.filter(matchFilters);

  // Totals for badge counts (not affected by filters, for accuracy)
  const totalMyPendingTasks = authorizedIdeas.filter(idea => isPersonaHandlerForIdea(idea)).length;

  // KPI Calculations (Filtered to authorized scope)
  const totalSubmissions = authorizedIdeas.length;
  const shortlistedCount = authorizedIdeas.filter(i => 
    i.status !== IdeaStatus.Submitted && 
    i.status !== IdeaStatus.ReturnedToEmployee && 
    i.status !== IdeaStatus.VettingLimitExceeded
  ).length;

  const stage2Active = authorizedIdeas.filter(i => {
    const s = i.status;
    return s !== IdeaStatus.Submitted && 
           s !== IdeaStatus.ReturnedToEmployee && 
           s !== IdeaStatus.VettingLimitExceeded && 
           s !== IdeaStatus.ApprovedByCPOC && 
           s !== IdeaStatus.UnderIRCEvaluation && 
           s !== IdeaStatus.RejectedByIRC && 
           s !== IdeaStatus.SelectedByIRC &&
           s !== IdeaStatus.DeclinedByFH &&
           s !== IdeaStatus.ActionPlanRejected &&
           s !== IdeaStatus.Completed;
  }).length;

  const winnerCount = authorizedIdeas.filter(i => i.status === IdeaStatus.Completed).length;

  // Total funds calculated for deployment rewards
  const totalRewards = authorizedIdeas.reduce((acc, curr) => {
    return acc + (curr.calculatedRewardIdeaOwner || 0) + (curr.calculatedRewardTeamMembers || 0);
  }, 0);

  const activeDisplayList = activeWorkspaceTab === "pending" ? pendingInboxIdeas : allRegistryIdeas;

  return (
    <div className="space-y-6">

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 card-shadow flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all duration-300 min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
              Total Proposals
            </span>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-display tracking-tight block">
              {totalSubmissions}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Across 7 Business Units</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 card-shadow flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all duration-300 min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
              Shortlisted (Stage 1)
            </span>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
              <FileCheck className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-display tracking-tight block">
              {shortlistedCount}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Passed B-IRC Checkpoints</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 card-shadow flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all duration-300 min-h-[140px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
              Stage 2 Pilots Active
            </span>
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-slate-600">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-display tracking-tight block">
              {stage2Active}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Undergoing 6-Month Trial</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-6 bg-white border border-[#0098DB]/20 rounded-2xl card-shadow flex flex-col justify-between shadow-lg shadow-[#0098DB]/10 min-h-[140px] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
            <DollarSign className="w-36 h-36 text-[#0098DB]" />
          </div>
          <div className="flex justify-between items-start z-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
              Rewards Simulated
            </span>
            <div className="p-2.5 bg-[#0098DB]/10 rounded-xl text-amber-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 z-1">
            <span className="text-2xl font-black text-slate-900 font-display tracking-tight block font-mono">
              ₹ {totalRewards.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#0098DB] font-medium block mt-1">{winnerCount} Leadership Winners</span>
          </div>
        </div>
      </div>

      {/* Segregation Duty Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs leading-relaxed text-amber-850 flex items-start gap-3">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-950 font-bold block mb-0.5">Corporate Segregation of Duties (SoD) Active</strong>
          <span>Admin action panels are strictly localized. You cannot evaluate, sign off, or edit proposals assigned to other actors in the RIPPLE timeline. Use your designated workspace below or toggle persona above to advance stages.</span>
        </div>
      </div>

      {/* Workspace Dashboard Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow">
        
        {/* Workspace Separation Navigation Header */}
        <div className="border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between">
          <div className="flex border-r border-slate-200/60 overflow-x-auto">
            
            {/* Tab: Employee Submissions */}
            {persona.role === "Employee" && (
              <button
                onClick={() => setActiveWorkspaceTab("pending")}
                className={`px-5 py-4 text-xs font-bold font-display uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeWorkspaceTab === "pending"
                    ? "border-indigo-650 text-indigo-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/55"
                }`}
              >
                <Inbox className="w-4 h-4 text-indigo-600" />
                <span>My Proposals Vault</span>
                <span className="bg-indigo-100 text-indigo-700 font-mono px-2 py-0.5 text-[9px] rounded-full font-bold ml-1">
                  {authorizedIdeas.length} Saved
                </span>
              </button>
            )}

            {/* Tab: Personalized Workspace */}
            {persona.role !== "Employee" && (
              <button
                onClick={() => setActiveWorkspaceTab("pending")}
                className={`px-5 py-4 text-xs font-bold font-display uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeWorkspaceTab === "pending"
                    ? "border-indigo-650 text-indigo-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/55"
                }`}
              >
                <Inbox className="w-4 h-4 text-indigo-600" />
                <span>My Role Gating Inbox</span>
                {totalMyPendingTasks > 0 ? (
                  <span className="bg-rose-500 text-white font-mono px-2 py-0.5 text-[9px] rounded-full font-bold ml-1 animate-pulse">
                    {totalMyPendingTasks} Pending
                  </span>
                ) : (
                  <span className="bg-slate-200 text-slate-600 font-mono px-2 py-0.5 text-[9px] rounded-full font-medium ml-1">
                    0
                  </span>
                )}
              </button>
            )}

            {/* Tab: All Registry (restricted only to CFO) */}
            {persona.role === "CFO" && (
              <button
                onClick={() => setActiveWorkspaceTab("all")}
                className={`px-5 py-4 text-xs font-bold font-display uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeWorkspaceTab === "all"
                    ? "border-indigo-650 text-indigo-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/55"
                }`}
              >
                <Database className="w-4 h-4 text-slate-500" />
                <span>Global RIPPLE Registry</span>
                <span className="bg-indigo-100 text-indigo-700 font-mono px-2 py-0.5 text-[9px] rounded-full font-bold ml-1">
                  {ideas.length} Total
                </span>
              </button>
            )}
          </div>

          <div className="p-3 text-[10px] text-slate-400 font-mono bg-slate-50 text-right pr-4 self-center flex items-center gap-1.5 self-end sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Process Segment: Active Session Filter</span>
          </div>
        </div>

        {/* Global Search and Filter Block inside selected Dashboard view */}
        <div className="p-5 border-b border-slate-150 bg-slate-50/20 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="font-display font-black text-xs text-[#004a69] uppercase tracking-widest flex items-center gap-1.5">
              {persona.role === "Employee" ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
                  My Personal Proposer Desk — {persona.name}
                </>
              ) : activeWorkspaceTab === "pending" ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
                  Authorized Duty Dashboard — {persona.role}
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-indigo-650" />
                  Institutional Innovation Registry Audit Log
                </>
              )}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium font-sans">
              {persona.role === "Employee"
                ? "Real-time tracking of your submitted innovations and active feedback loop"
                : activeWorkspaceTab === "pending" 
                ? "Filter through strategic gates waiting for your direct decision action" 
                : "A centralized secure audit of all enterprise developments"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search ID, Title, Owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 focus:outline-hidden text-xs bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl transition-all w-48 font-sans shadow-xs"
              />
            </div>

            <select
              value={buFilter}
              onChange={(e) => setBuFilter(e.target.value)}
              className="px-3.5 py-2 focus:outline-hidden text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-xs text-slate-700"
            >
              <option value="">All Divisions</option>
              {BUSINESS_UNITS.map(bu => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>

            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="px-3.5 py-2 focus:outline-hidden text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all max-w-sm shadow-xs text-slate-700"
            >
              <option value="">All Themes</option>
              {AREA_OF_IMPACT_THEMES.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>

            <select
              value={statusSearch}
              onChange={(e) => setStatusSearch(e.target.value)}
              className="px-3.5 py-2 focus:outline-hidden text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-xs text-slate-700"
            >
              <option value="">All Statuses</option>
              {Object.values(IdeaStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Idea Table */}
        <div className="overflow-x-auto">
          {activeDisplayList.length === 0 ? (
            <div className="p-16 text-center text-slate-400 max-w-xl mx-auto flex flex-col items-center justify-center">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 mb-3 border border-indigo-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                {activeWorkspaceTab === "pending" ? "Your Stage-Gates are all Clear!" : "No Matching Innovations"}
              </p>
              <p className="text-[10.5px] mt-2 text-slate-500 leading-relaxed font-sans">
                {activeWorkspaceTab === "pending" 
                  ? `Excellent job! No incubation proposals are currently awaiting stage-gate action or evaluation from the "${persona.role}" division. Everything is fully cleared.`
                  : "We couldn't find any ideas matching the selected search query and filters. Adjust your criteria and try again."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 pl-4">Idea ID</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5">Business Unit</th>
                  <th className="p-3.5">Stage & Secure Status</th>
                  <th className="p-3.5">Next Gating Admin Owner</th>
                  <th className="p-3.5 text-right pr-4">Authentication Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {activeDisplayList.map((idea) => {
                  const isSelected = selectedIdeaId === idea.id;
                  const isAwaitingCurrentUser = isPersonaHandlerForIdea(idea);
                  const requiredRole = getRequiredRoleForStatus(idea.status);

                  // Calculate reviewer SLA days
                  let slaWarning = false;
                  let slaDays = 0;
                  if (idea.status === IdeaStatus.Submitted && idea.submissionDate) {
                    const diffTime = Math.abs(new Date().getTime() - new Date(idea.submissionDate).getTime());
                    slaDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (slaDays > 7) {
                      slaWarning = true;
                    }
                  }

                  return (
                    <tr 
                      key={idea.id}
                      onDoubleClick={() => setViewingDetailIdea(idea)}
                      title="Double-click this row to open complete submission details & evaluation history"
                      className={`hover:bg-slate-50/85 transition-all cursor-pointer select-none ${
                        isSelected ? "bg-sky-50/40 font-medium" : ""
                      }`}
                    >
                      {/* Idea ID */}
                      <td className="p-3.5 pl-4">
                        <span className="font-mono bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-sm border border-slate-200 block text-center w-28">
                          {idea.id}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="p-3.5 max-w-sm">
                        <div className="text-slate-800 font-bold text-xs truncate">
                          {idea.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                          <span>By: <strong className="text-slate-600 font-bold">{idea.employeeName}</strong></span>
                          <span>&bull;</span>
                          <span>{idea.areaOfImpact}</span>
                        </div>
                      </td>

                      {/* Business Unit */}
                      <td className="p-3.5 text-slate-600 font-medium whitespace-nowrap">
                        {idea.businessUnit}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black w-fit uppercase tracking-wider ${
                            idea.status.includes("Closed") || idea.status.includes("Rejected") || idea.status.includes("Exceeded") || idea.status.includes("Declined")
                              ? "bg-rose-50 text-rose-700 border border-rose-250 font-bold"
                              : idea.status === IdeaStatus.Completed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-250 animate-pulse font-bold"
                              : isAwaitingCurrentUser
                              ? "bg-amber-50 text-amber-800 border border-amber-250 font-bold animate-pulse"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}>
                            {idea.status}
                          </span>
                          
                          {/* SLA alert */}
                          {slaWarning && (
                            <span className="text-[9px] text-rose-600 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                              SLA Breach: Overdue ({slaDays} Days)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Required Admin Role */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="space-y-1 text-[10px] font-mono text-slate-500">
                          {idea.status === IdeaStatus.Completed ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </div>
                          ) : isAwaitingCurrentUser ? (
                            <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 border border-amber-200/50 px-2 py-1 rounded-lg">
                              <Unlock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Requires You ({persona.role})</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>{requiredRole}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions with Access Level Enforcement */}
                      <td className="p-3.5 text-right pr-4">
                        {isAwaitingCurrentUser ? (
                          <button
                            onClick={() => onSelectIdea(idea)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 font-display font-medium text-[9.5px] font-bold text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 ml-auto shadow-sm shadow-indigo-650/15"
                          >
                            <Unlock className="w-3 h-3" />
                            Act on Gating Task
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectIdea(idea)}
                            className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-[9.5px] font-bold text-slate-600 rounded-xl transition-all cursor-pointer flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            View Flow (Read Only)
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Submission Details Modal */}
      {viewingDetailIdea && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in" id="dashboard-detail-modal">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                  {viewingDetailIdea.id}
                </span>
                <div>
                  <h3 className="text-xs font-black font-display tracking-widest text-slate-900 uppercase">
                    Full Submission Details &amp; Evaluation Audit
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Stage-gate pipeline verification &amp; historical review logs</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setViewingDetailIdea(null)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              
              {/* Row 1: Idea Title banner */}
              <div className="bg-gradient-to-r from-[#003350] to-[#004a69] p-5 rounded-2xl text-white shadow-xs">
                <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-indigo-300">Project Title</span>
                <h4 className="text-sm font-black tracking-tight leading-tight mt-1 font-display uppercase">{viewingDetailIdea.title}</h4>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-white/10 text-[10px] text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Submitted by: <strong className="text-white font-bold">{viewingDetailIdea.employeeName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-indigo-300" />
                    <span>{viewingDetailIdea.employeeEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-300" />
                    <span>BU: {viewingDetailIdea.businessUnit}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                    <span>{new Date(viewingDetailIdea.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Proposer Draft Inputs */}
                <div className="lg:col-span-6 space-y-5">
                  <h5 className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-widest border-b border-slate-150 pb-2">
                    I. Strategic Submission Details
                  </h5>

                  <div className="space-y-4">
                    {/* HR Credentials Badge Table */}
                    <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-2">
                      <span className="text-[9px] uppercase font-bold text-indigo-800 tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                        Verified HR System Corporate Identity
                      </span>
                      <div className="grid grid-cols-3 gap-3 text-[10px] text-slate-600 font-medium">
                        <div>
                          <span className="block text-[8px] uppercase text-slate-400 font-bold tracking-wider">Employee ID</span>
                          <strong className="text-slate-800 font-mono">{viewingDetailIdea.employeeId || "ION-EMP-2026-081"}</strong>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase text-slate-400 font-bold tracking-wider">HR Department</span>
                          <strong className="text-slate-800">{viewingDetailIdea.department || "Process Engineering & Design"}</strong>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase text-slate-400 font-bold tracking-wider">Designation</span>
                          <strong className="text-slate-800">{viewingDetailIdea.designation || "Senior Process Engineer"}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Area of Impact Theme</span>
                      <p className="font-semibold text-slate-800">{viewingDetailIdea.areaOfImpact}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Problem Statement</span>
                      <p className="text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl leading-relaxed font-sans text-[11px] whitespace-pre-wrap">
                        {viewingDetailIdea.problemStatement}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Proposed Solution</span>
                      <p className="text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl leading-relaxed font-sans text-[11px] whitespace-pre-wrap">
                        {viewingDetailIdea.proposedSolution}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Expected Quantifiable Impact</span>
                      <p className="text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl leading-relaxed font-sans text-[11px] whitespace-pre-wrap">
                        {viewingDetailIdea.expectedImpact || "No direct quantifiable metrics provided."}
                      </p>
                    </div>

                    {/* Dynamic Template & Custom Fields */}
                    {viewingDetailIdea.customFields && viewingDetailIdea.customFields.length > 0 && (
                      <div className="space-y-2 p-4 bg-indigo-50/30 border border-indigo-100 rounded-xl">
                        <span className="text-[9px] uppercase font-black text-indigo-900 tracking-widest font-mono block mb-2 border-b border-indigo-100 pb-1">
                          Injected Business Schema &amp; Custom Fields
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {viewingDetailIdea.customFields.map((field, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                                {field.label}
                              </span>
                              <span className="text-slate-800 font-semibold text-[10.5px] mt-0.5 block font-sans">
                                {field.value || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attached files */}
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Attached supporting files / annexures</span>
                      {viewingDetailIdea.uploadedFiles && viewingDetailIdea.uploadedFiles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-1.5">
                          {viewingDetailIdea.uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition-all">
                              <div className="flex items-center gap-2 min-w-0">
                                <Paperclip className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                <span className="font-bold text-slate-700 truncate text-[10.5px]">{file.name}</span>
                                <span className="text-[9px] text-slate-400 font-mono flex-shrink-0">({file.size})</span>
                              </div>
                              <span className="text-[8px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 tracking-widest font-mono">
                                Read Secure
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 font-medium">
                          No external attachments uploaded with this proposal.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Stage-Gate Evaluation Audit Trail */}
                <div className="lg:col-span-6 space-y-5">
                  <h5 className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-widest border-b border-slate-150 pb-2">
                    II. Stage-Gate Evaluation Audit Log
                  </h5>

                  <div className="space-y-4">
                    
                    {/* Gate 1: Central CPOC Vetting */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800 tracking-tight">Gate 1: Central C-POC Quality Vetting</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider font-mono ${
                          viewingDetailIdea.cpocComments ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-amber-50 text-amber-700 border border-amber-150"
                        }`}>
                          {viewingDetailIdea.cpocComments ? "Vetted & Passed" : "Pending Vetting"}
                        </span>
                      </div>
                      <div className="p-4 space-y-2.5 bg-white font-sans">
                        {viewingDetailIdea.cpocComments ? (
                          <>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium font-mono">
                              <div>Vetted By: <strong className="text-slate-700">{viewingDetailIdea.cpocVettedBy || "TM & OD CoE Lead"}</strong></div>
                              <div className="text-right">Date: <strong className="text-slate-700">{viewingDetailIdea.vettingDate ? new Date(viewingDetailIdea.vettingDate).toLocaleDateString() : "N/A"}</strong></div>
                            </div>
                            <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-150 leading-relaxed italic text-[10.5px]">
                              "{viewingDetailIdea.cpocComments}"
                            </div>
                            <div className="text-[9.5px] text-slate-500 font-medium">
                              Send back count: <span className="font-mono font-bold text-slate-700">{viewingDetailIdea.vettingSendBackCount}</span> / 2 returns limit
                            </div>
                          </>
                        ) : (
                          <p className="text-slate-400 italic">Central C-POC has not completed vetting comments on this proposal yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Gate 2: IRC Evaluation Scorecard */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800 tracking-tight">Gate 2: IRC Committee Scoring</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold text-slate-500">
                            Threshold: {(viewingDetailIdea.ircScoresThreshold ?? 17).toFixed(1)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider font-mono ${
                            viewingDetailIdea.averageIrcScore ? (viewingDetailIdea.averageIrcScore >= (viewingDetailIdea.ircScoresThreshold ?? 17) ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-rose-50 text-rose-700 border border-rose-150") : "bg-amber-50 text-amber-700 border border-amber-150"
                          }`}>
                            {viewingDetailIdea.averageIrcScore ? `Avg: ${viewingDetailIdea.averageIrcScore.toFixed(2)}` : "No Score"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 bg-white font-sans">
                        {viewingDetailIdea.ircReviews && viewingDetailIdea.ircReviews.length > 0 ? (
                          <div className="space-y-3">
                            <span className="text-[9.5px] uppercase font-bold text-indigo-950 font-mono tracking-wider block">Individual Council Submissions:</span>
                            <div className="space-y-2.5">
                              {viewingDetailIdea.ircReviews.map((review, idx) => {
                                const avgScore = review.aggregateScore;
                                return (
                                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                                    <div className="flex items-center justify-between font-mono text-[9.5px] text-slate-500 pb-1.5 border-b border-slate-200/60">
                                      <span className="font-bold text-slate-700">{review.reviewerEmail} ({review.reviewerName})</span>
                                      <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-1.5 py-0.5 rounded">Avg: {avgScore.toFixed(2)}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 text-center font-mono text-[8px] text-slate-500">
                                      <div className="bg-white p-1 rounded border border-slate-150">
                                        <span className="block font-bold text-slate-800 text-[10px]">{review.scores?.innovation}</span>
                                        Inno
                                      </div>
                                      <div className="bg-white p-1 rounded border border-slate-150">
                                        <span className="block font-bold text-slate-800 text-[10px]">{review.scores?.feasibility}</span>
                                        Feas
                                      </div>
                                      <div className="bg-white p-1 rounded border border-slate-150">
                                        <span className="block font-bold text-slate-800 text-[10px]">{review.scores?.businessValue}</span>
                                        BizVal
                                      </div>
                                      <div className="bg-white p-1 rounded border border-slate-150">
                                        <span className="block font-bold text-slate-800 text-[10px]">{review.scores?.impact}</span>
                                        Impact
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-slate-600 leading-relaxed italic mt-1 font-sans">
                                      "{review.comments}"
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No official IRC committee reviews recorded yet for this idea.</p>
                        )}
                      </div>
                    </div>

                    {/* Gate 3: Functional Head (FH) Technical Trials */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800 tracking-tight">Gate 3: Functional Head Trial Sign-off</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider font-mono ${
                          viewingDetailIdea.fhComments ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-amber-50 text-amber-700 border border-amber-150"
                        }`}>
                          {viewingDetailIdea.fhComments ? "Evaluated" : "Pending Trial"}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 bg-white text-slate-700 font-sans">
                        {viewingDetailIdea.fhComments ? (
                          <>
                            <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">FH Evaluation Remarks:</p>
                            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 italic leading-relaxed text-[10.5px]">
                              "{viewingDetailIdea.fhComments}"
                            </p>
                          </>
                        ) : (
                          <p className="text-slate-400 italic">Pending official trials presentation or trial approval remarks.</p>
                        )}
                      </div>
                    </div>

                    {/* Gate 4: Project Pilot Progress Tracker */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800 tracking-tight">Gate 4: Pilot Progress Updates (Plan Owner)</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 border border-slate-300 text-[8.5px] font-black uppercase tracking-wider font-mono">
                          {viewingDetailIdea.monthlyTrackers?.length || 0} Filed
                        </span>
                      </div>
                      <div className="p-4 space-y-3 bg-white text-slate-700 font-sans">
                        {viewingDetailIdea.monthlyTrackers && viewingDetailIdea.monthlyTrackers.length > 0 ? (
                          <div className="space-y-3">
                            {viewingDetailIdea.monthlyTrackers.map((track, trackIdx) => (
                              <div key={trackIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                                  <span className="font-bold text-slate-800 text-[11px]">{track.month}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider font-mono ${
                                    track.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-amber-50 text-amber-700 border border-amber-150'
                                  }`}>
                                    {track.status}
                                  </span>
                                </div>
                                <div className="text-[10px] space-y-1">
                                  <div><span className="text-slate-400 font-semibold uppercase text-[8.5px] block font-mono">Progress Summary:</span> {track.progress}</div>
                                  <div className="pt-1"><span className="text-slate-400 font-semibold uppercase text-[8.5px] block font-mono">Key Achievements:</span> {track.achievements}</div>
                                  {track.filename && (
                                    <div className="pt-1.5 flex items-center gap-1.5 text-indigo-600 font-medium">
                                      <Paperclip className="w-3 h-3" />
                                      <span>Attached Report: <strong className="font-mono">{track.filename}</strong></span>
                                    </div>
                                  )}
                                  <div className="text-[8.5px] text-slate-450 text-right pt-1 border-t border-slate-100 font-mono">
                                    Submitted: {new Date(track.dateSubmitted).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No monthly progress trackers or implementation logs have been filed yet by the Plan Owner.</p>
                        )}
                      </div>
                    </div>

                    {/* Gate 5: Corporate Finance Audit & CFO Sign-Off */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800 tracking-tight">Gate 5: Finance Audit &amp; CFO Disbursement</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider font-mono ${
                          viewingDetailIdea.selectionVoucherReleased ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : "bg-amber-50 text-amber-700 border border-amber-150"
                        }`}>
                          {viewingDetailIdea.selectionVoucherReleased ? "Disbursed" : "Awaiting Audit"}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 bg-white text-slate-700 font-sans">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span>Finance Vetting Verdict:</span>
                            <span className="font-bold text-slate-800">{viewingDetailIdea.financeAuditVetted ? "✓ Audited & Passed" : "Pending Audit"}</span>
                          </div>
                          {viewingDetailIdea.financeSPOCComments && (
                            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 italic leading-relaxed text-[10.5px] text-slate-600">
                              Finance SPOC Feedback: "{viewingDetailIdea.financeSPOCComments}"
                            </p>
                          )}
                          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 font-sans">
                            <span>Selection Voucher (Rs. 5,000):</span>
                            <span className={`font-extrabold ${viewingDetailIdea.selectionVoucherReleased ? "text-emerald-600" : "text-amber-600"}`}>
                              {viewingDetailIdea.selectionVoucherReleased ? "✓ Released & Disbursed" : "Awaiting CFO Release"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingDetailIdea(null)}
                className="px-5 py-2 bg-[#0098DB] hover:bg-[#0089c5] text-white font-bold tracking-widest uppercase rounded-xl cursor-pointer text-[10px] transition-all"
              >
                Close Audit Logs
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Annexure 10: Quarterly Leadership Report ───────────────────────── */}
      {(persona.role === "C-POC" || persona.role === "Super Admin" || persona.role === "CFO") && (() => {
        const currentYear = new Date().getFullYear();
        const quarters = [
          { label: "Q1", months: [0,1,2], range: "Jan–Mar" },
          { label: "Q2", months: [3,4,5], range: "Apr–Jun" },
          { label: "Q3", months: [6,7,8], range: "Jul–Sep" },
          { label: "Q4", months: [9,10,11], range: "Oct–Dec" },
        ];

        const inQ = (idea: Idea, months: number[]) => {
          const d = new Date(idea.createdAt);
          return d.getFullYear() === currentYear && months.includes(d.getMonth());
        };

        const isShortlisted = (s: IdeaStatus) => ![
          IdeaStatus.Submitted, IdeaStatus.ReturnedToEmployee, IdeaStatus.VettingLimitExceeded
        ].includes(s);

        const isIRCSelected = (s: IdeaStatus) => ![
          IdeaStatus.Submitted, IdeaStatus.ReturnedToEmployee, IdeaStatus.VettingLimitExceeded,
          IdeaStatus.ApprovedByCPOC, IdeaStatus.UnderIRCEvaluation, IdeaStatus.RejectedByIRC
        ].includes(s);

        const isActivePilot = (s: IdeaStatus) => [
          IdeaStatus.AwaitingActionPlan, IdeaStatus.ActionPlanSubmitted, IdeaStatus.ActionPlanRevision,
          IdeaStatus.ActionPlanApproved, IdeaStatus.ReportSubmitted, IdeaStatus.ReportRevision,
          IdeaStatus.PendingFinanceEvaluation, IdeaStatus.FinanceRevision, IdeaStatus.PendingCFOSignOff
        ].includes(s);

        const qData = quarters.map(q => {
          const qIdeas = ideas.filter(i => inQ(i, q.months));
          return {
            ...q,
            submitted: qIdeas.length,
            shortlisted: qIdeas.filter(i => isShortlisted(i.status)).length,
            selected: qIdeas.filter(i => isIRCSelected(i.status)).length,
            activePilots: qIdeas.filter(i => isActivePilot(i.status)).length,
            completed: qIdeas.filter(i => i.status === IdeaStatus.Completed).length,
            rewardsCertified: qIdeas.reduce((a, i) => a + (i.calculatedRewardIdeaOwner || 0) + (i.calculatedRewardTeamMembers || 0), 0),
          };
        });

        const buList = Array.from(new Set(ideas.map(i => i.businessUnit))).filter(Boolean);
        const buData = buList.map(bu => {
          const buIdeas = ideas.filter(i => i.businessUnit === bu);
          return {
            bu,
            submitted: buIdeas.length,
            active: buIdeas.filter(i => isActivePilot(i.status) || isIRCSelected(i.status)).length,
            completed: buIdeas.filter(i => i.status === IdeaStatus.Completed).length,
          };
        }).sort((a,b) => b.submitted - a.submitted);

        const completedIdeas = ideas.filter(i => i.status === IdeaStatus.Completed);
        const activeIdeas = ideas.filter(i => isActivePilot(i.status));

        return (
          <div className="mt-4">
            {/* Header toggle */}
            <button
              type="button"
              onClick={() => setShowQuarterly(v => !v)}
              className="w-full flex items-center justify-between p-4 bg-indigo-950 text-white rounded-2xl hover:bg-indigo-900 transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-indigo-200" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black tracking-tight">Quarterly Leadership Report</div>
                  <div className="text-[10px] text-indigo-300 font-mono">{currentYear} · For CHRO / MD / Board Review</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); window.print(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                {showQuarterly ? <ChevronUp className="w-5 h-5 text-indigo-300" /> : <ChevronDown className="w-5 h-5 text-indigo-300" />}
              </div>
            </button>

            {showQuarterly && (
              <div className="mt-3 space-y-5">

                {/* Quarter grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {qData.map(q => (
                    <div key={q.label} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{q.label}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{q.range} {currentYear}</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        {[
                          ["Submitted",     q.submitted,      "text-slate-700"],
                          ["Shortlisted",   q.shortlisted,    "text-indigo-600"],
                          ["IRC Selected",  q.selected,       "text-violet-600"],
                          ["Active Pilots", q.activePilots,   "text-emerald-600"],
                          ["Completed",     q.completed,      "text-amber-600"],
                        ].map(([label, val, cls]) => (
                          <div key={label as string} className="flex items-center justify-between">
                            <span className="text-slate-500">{label as string}</span>
                            <span className={`font-black font-mono ${cls as string}`}>{val as number}</span>
                          </div>
                        ))}
                        {q.rewardsCertified > 0 && (
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <span className="text-slate-500">₹ Certified</span>
                            <span className="font-black font-mono text-teal-600">₹{q.rewardsCertified.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Business Unit breakdown */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Business Unit Breakdown</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="text-left px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Business Unit</th>
                          <th className="text-center px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Submitted</th>
                          <th className="text-center px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">In Progress</th>
                          <th className="text-center px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Completed</th>
                          <th className="text-center px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Conversion %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buData.map((row, idx) => (
                          <tr key={row.bu} className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                            <td className="px-4 py-2.5 font-semibold text-slate-800">{row.bu}</td>
                            <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-700">{row.submitted}</td>
                            <td className="px-4 py-2.5 text-center font-mono font-bold text-indigo-600">{row.active}</td>
                            <td className="px-4 py-2.5 text-center font-mono font-bold text-emerald-600">{row.completed}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                row.submitted === 0 ? "bg-slate-100 text-slate-400" :
                                (row.completed / row.submitted) >= 0.5 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                (row.completed / row.submitted) >= 0.2 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}>
                                {row.submitted === 0 ? "—" : `${Math.round((row.completed / row.submitted) * 100)}%`}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {buData.length === 0 && (
                          <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic text-xs">No data available.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Completed & Active spotlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Completed */}
                  <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Completed Projects ({completedIdeas.length})</span>
                    </div>
                    <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                      {completedIdeas.length === 0 ? (
                        <p className="text-slate-400 italic text-xs p-2">No completed projects yet.</p>
                      ) : completedIdeas.map(i => (
                        <div key={i.id} className="flex items-start gap-2.5 p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-800 truncate">{i.title}</div>
                            <div className="text-[9px] text-slate-500 font-mono">{i.id} · {i.employeeName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Pilots */}
                  <div className="bg-white border border-indigo-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-200 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-indigo-800 uppercase tracking-widest">Active Pilots ({activeIdeas.length})</span>
                    </div>
                    <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                      {activeIdeas.length === 0 ? (
                        <p className="text-slate-400 italic text-xs p-2">No active pilots yet.</p>
                      ) : activeIdeas.map(i => (
                        <div key={i.id} className="flex items-start gap-2.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                          <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-800 truncate">{i.title}</div>
                            <div className="text-[9px] text-slate-500 font-mono">{i.id} · {i.projectLeadName || i.employeeName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-center text-[9px] text-slate-400 font-mono">Ripple Quarterly Leadership Report · {currentYear} · Generated {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
