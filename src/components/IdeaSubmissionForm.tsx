/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ANNEXURE 1 — RIPPLE Idea Submission Form
 * Sections A–G as per client specification.
 */

import React, { useState } from "react";
import {
  Sparkles, FileText, CheckCircle, Send, Loader2,
  AlertCircle, Upload, Paperclip, X
} from "lucide-react";

// ─── Updated Area of Impact list (client spec) ────────────────────────────────
const AREA_OF_IMPACT_LIST = [
  "Sales & Revenue Growth",
  "Marketing & Corporate Communications",
  "Proposals & Bid Management",
  "Project Management",
  "Project Engineering",
  "Product Development",
  "Manufacturing & Operations Efficiency",
  "Cost Optimization",
  "Supply Chain & Procurement",
  "Customer Service & Support",
  "Quality, Safety & Compliance",
  "Sustainability & Water Stewardship",
  "Digital, Data, IT & Automation",
  "Research & Development",
  "Human Resources",
  "International Business Development",
  "Domestic Business Development",
  "Legal & Compliance",
  "Finance & Internal Audit",
];

const WHO_AFFECTED_OPTIONS = ["Customers", "Employees", "Operations", "Supply Chain", "Management", "Other"];
const IMPACT_TYPE_OPTIONS  = ["Cost saving", "Revenue generation", "Productivity improvement", "Risk or compliance avoidance"];
const YEARS_IN_ROLE_OPTIONS = ["<1 year", "1-3 years", "3-5 years", "5+ years"];
const DURATION_OPTIONS      = ["<3 months", "3-12 months", "1-3 years", "3+ years"];
const CONTRIBUTION_OPTIONS  = [
  "I want to lead the implementation",
  "I want to be part of the implementation team",
  "I can advise or consult but cannot commit time",
  "I have submitted the idea; the relevant team should take it forward",
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface IdeaSubmissionFormProps {
  onSubmit: (formData: {
    employeeName: string;
    employeeEmail: string;
    businessUnit: string;
    areaOfImpact: string;
    title: string;
    problemStatement: string;
    proposedSolution: string;
    expectedImpact: string;
    uploadedFiles?: { name: string; size: string }[];
    employeeId?: string;
    department?: string;
    designation?: string;
    customFields?: { id: string; label: string; value: string; type: string }[];
  }) => void;
  currentPersona?: {
    role: string; name: string; email: string;
    businessUnit?: string; employeeId?: string;
    department?: string; designation?: string;
  };
}

// ─── Small helpers ─────────────────────────────────────────────────────────────
const autoClass =
  "w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 text-slate-500 font-semibold cursor-not-allowed rounded-xl font-sans text-sm";
const inputClass =
  "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white rounded-xl transition-all font-sans text-sm text-slate-800";

const SectionHeader = ({
  letter, title, subtitle,
}: {
  letter: string; title: string; subtitle?: string;
}) => (
  <div className="flex items-start gap-3 pb-3 border-b border-slate-200 mb-5">
    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">
      {letter}
    </div>
    <div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const FieldLabel = ({
  children, required, optional,
}: {
  children: React.ReactNode; required?: boolean; optional?: boolean;
}) => (
  <label className="block text-slate-600 font-semibold text-xs mb-1.5">
    {children}
    {required && <span className="text-rose-500 ml-0.5">*</span>}
    {optional && <span className="text-slate-400 font-normal ml-1">(optional)</span>}
  </label>
);

const AutoBadge = () => (
  <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
    Auto-synced
  </span>
);

const WordCount = ({ text, max }: { text: string; max: number }) => {
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  const over = count > max;
  return (
    <span className={`text-[10px] font-mono ${over ? "text-rose-500 font-bold" : "text-slate-400"}`}>
      {count}/{max} words
    </span>
  );
};

const PillSelector = ({
  options, selected, onToggle, singleSelect = false,
}: {
  options: string[]; selected: string | string[];
  onToggle: (v: string) => void; singleSelect?: boolean;
}) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {options.map((opt) => {
      const active = Array.isArray(selected) ? selected.includes(opt) : selected === opt;
      return (
        <button
          key={opt} type="button"
          onClick={() => onToggle(opt)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            active
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const RatingSelector = ({
  value, onChange, label1, label5,
}: {
  value: number; onChange: (v: number) => void; label1: string; label5: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n} type="button"
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all cursor-pointer ${
            value === n
              ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-400"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
    <div className="flex justify-between text-[10px] text-slate-400">
      <span>1 = {label1}</span>
      <span>5 = {label5}</span>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ onSubmit, currentPersona }) => {
  // ── A. Submitter details (auto-filled from HRMS / SSO) ──────────────────────
  const [employeeName,     setEmployeeName]     = useState(currentPersona?.name || "");
  const [employeeEmail,    setEmployeeEmail]    = useState(currentPersona?.email || "");
  const [businessUnit,     setBusinessUnit]     = useState(currentPersona?.businessUnit || "");
  const [employeeId,       setEmployeeId]       = useState(currentPersona?.employeeId || "");
  const [department,       setDepartment]       = useState(currentPersona?.department || "");
  const [designation,      setDesignation]      = useState(currentPersona?.designation || "");
  const [baseLocation,     setBaseLocation]     = useState("");
  const [reportingManager, setReportingManager] = useState("");
  const [yearsInRole,      setYearsInRole]      = useState("");

  // ── B. Problem identification ───────────────────────────────────────────────
  const [title,               setTitle]               = useState("");
  const [areaOfImpact,        setAreaOfImpact]        = useState("");
  const [whoAffected,         setWhoAffected]         = useState<string[]>([]);
  const [opportunityDesc,     setOpportunityDesc]     = useState("");
  const [rootCause,           setRootCause]           = useState("");
  const [opportunityDuration, setOpportunityDuration] = useState("");
  const [ideaExperience,      setIdeaExperience]      = useState("");
  const [previousAttempts,    setPreviousAttempts]    = useState("");

  // ── C. The proposed idea ────────────────────────────────────────────────────
  const [proposedSolution, setProposedSolution] = useState("");
  const [currentState,     setCurrentState]     = useState("");
  const [proposedState,    setProposedState]    = useState("");
  const [evidence,         setEvidence]         = useState("");
  const [supportResources, setSupportResources] = useState("");

  // ── D. Risk awareness ───────────────────────────────────────────────────────
  const [riskAwareness, setRiskAwareness] = useState("");

  // ── E. Self-assessment ─────────────────────────────────────────────────────
  const [originalityRating,  setOriginalityRating]  = useState(0);
  const [feasibilityRating,  setFeasibilityRating]  = useState(0);
  const [contributionChoice, setContributionChoice] = useState("");

  // ── F. Financial estimate (optional) ───────────────────────────────────────
  const [estimatedImpact,    setEstimatedImpact]    = useState("");
  const [basisOfCalculation, setBasisOfCalculation] = useState("");
  const [impactTypes,        setImpactTypes]        = useState<string[]>([]);

  // ── G. Declarations and attachments ────────────────────────────────────────
  const [duplicateDeclared, setDuplicateDeclared] = useState(false);
  const [uploadedFiles,     setUploadedFiles]     = useState<{ name: string; size: string }[]>([]);
  const [isDragging,        setIsDragging]        = useState(false);

  // ── AI refinement ───────────────────────────────────────────────────────────
  const [isRefining,   setIsRefining]   = useState(false);
  const [refineError,  setRefineError]  = useState("");
  const [refinedBadge, setRefinedBadge] = useState(false);

  // Sync persona when it changes
  React.useEffect(() => {
    if (currentPersona) {
      setEmployeeName(currentPersona.name || "");
      setEmployeeEmail(currentPersona.email || "");
      setEmployeeId(currentPersona.employeeId || "");
      setDepartment(currentPersona.department || "");
      setDesignation(currentPersona.designation || "");
      if (currentPersona.businessUnit) setBusinessUnit(currentPersona.businessUnit);
    }
  }, [currentPersona]);

  const toggleWhoAffected = (v: string) =>
    setWhoAffected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const toggleImpactType = (v: string) =>
    setImpactTypes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f: any) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).map((f: any) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRefineWithAI = async () => {
    if (!title || !opportunityDesc || !proposedSolution) {
      setRefineError(
        "Please fill in Idea Title, Problem Description, and Proposed Solution before using AI refinement."
      );
      return;
    }
    setIsRefining(true);
    setRefineError("");
    setRefinedBadge(false);
    try {
      const res = await fetch("/api/gemini/refine-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          problemStatement: opportunityDesc,
          proposedSolution,
          expectedImpact: currentState,
          areaOfImpact,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.problemStatement) setOpportunityDesc(data.problemStatement);
      if (data.proposedSolution) setProposedSolution(data.proposedSolution);
      if (data.expectedImpact) setProposedState(data.expectedImpact);
      setRefinedBadge(true);
    } catch (err: any) {
      setRefineError(err.message || "Could not reach refinement service.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duplicateDeclared) {
      alert("Please confirm the duplicate check declaration in Section G before submitting.");
      return;
    }
    if (originalityRating === 0 || feasibilityRating === 0) {
      alert("Please provide both Originality and Feasibility self-assessment ratings in Section E.");
      return;
    }
    if (!contributionChoice) {
      alert("Please select how you would like to contribute (Section E).");
      return;
    }

    const customFields = [
      { id: "yearsInRole",         label: "Years in Current Role",                   value: yearsInRole,              type: "select"   },
      { id: "baseLocation",        label: "Base Location",                           value: baseLocation,             type: "text"     },
      { id: "reportingManager",    label: "Reporting Manager",                       value: reportingManager,         type: "text"     },
      { id: "whoAffected",         label: "Who Is Affected",                         value: whoAffected.join(", "),   type: "text"     },
      { id: "rootCause",           label: "Root Cause Analysis",                     value: rootCause,                type: "textarea" },
      { id: "opportunityDuration", label: "How Long Has This Opportunity Existed",   value: opportunityDuration,      type: "select"   },
      { id: "ideaExperience",      label: "Experience That Led to This Idea",        value: ideaExperience,           type: "textarea" },
      { id: "previousAttempts",    label: "Previous Attempts to Address",            value: previousAttempts,         type: "textarea" },
      { id: "currentState",        label: "Current State (Before)",                  value: currentState,             type: "textarea" },
      { id: "proposedState",       label: "Proposed State (After)",                  value: proposedState,            type: "textarea" },
      { id: "evidence",            label: "Supporting Evidence and Data",            value: evidence,                 type: "textarea" },
      { id: "supportResources",    label: "Support and Resources Needed",            value: supportResources,         type: "textarea" },
      { id: "riskAwareness",       label: "Risk Awareness",                          value: riskAwareness,            type: "textarea" },
      { id: "originalityRating",   label: "Originality Self-Rating (1-5)",          value: String(originalityRating), type: "number"  },
      { id: "feasibilityRating",   label: "Feasibility Self-Rating (1-5)",          value: String(feasibilityRating),  type: "number"  },
      { id: "contributionChoice",  label: "Contribution Commitment",                 value: contributionChoice,       type: "select"   },
      { id: "estimatedImpact",     label: "Estimated Annual Financial Impact (Rs)", value: estimatedImpact,          type: "number"   },
      { id: "basisOfCalculation",  label: "Basis of Calculation",                    value: basisOfCalculation,       type: "text"     },
      { id: "impactTypes",         label: "Type of Impact",                          value: impactTypes.join(", "),   type: "text"     },
    ].filter((f) => f.value);

    onSubmit({
      employeeName,
      employeeEmail,
      businessUnit: businessUnit || currentPersona?.businessUnit || "",
      areaOfImpact,
      title,
      problemStatement: opportunityDesc,
      proposedSolution,
      expectedImpact: proposedState || `Current: ${currentState}`,
      uploadedFiles,
      employeeId: employeeId || currentPersona?.employeeId,
      department: department || currentPersona?.department,
      designation: designation || currentPersona?.designation,
      customFields,
    });

    // Reset all fields
    setTitle(""); setAreaOfImpact(""); setWhoAffected([]); setOpportunityDesc("");
    setRootCause(""); setOpportunityDuration(""); setIdeaExperience(""); setPreviousAttempts("");
    setProposedSolution(""); setCurrentState(""); setProposedState(""); setEvidence("");
    setSupportResources(""); setRiskAwareness("");
    setOriginalityRating(0); setFeasibilityRating(0); setContributionChoice("");
    setEstimatedImpact(""); setBasisOfCalculation(""); setImpactTypes([]);
    setDuplicateDeclared(false); setUploadedFiles([]); setRefinedBadge(false);
    alert("Your idea has been submitted successfully! A unique Ripple ID (RPL-2026-XXXX) has been allocated.");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none">Annexure 1 — Idea Submission Form</h2>
            <p className="text-indigo-200 text-xs mt-1">RIPPLE · Ion Exchange (India) Limited</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-white/20 border border-white/30 px-3 py-1 rounded-full">
          Stage 1: Idea Entry
        </span>
      </div>

      <form onSubmit={handleFormSubmit} className="divide-y divide-slate-100">

        {/* ====== SECTION A — SUBMITTER DETAILS ============================== */}
        <div className="p-6">
          <SectionHeader
            letter="A"
            title="Submitter Details"
            subtitle="Auto-filled from HRMS / SSO — read-only fields marked with Auto-synced badge"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Employee Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Employee Name</FieldLabel>
                <AutoBadge />
              </div>
              <input type="text" readOnly value={employeeName} className={autoClass} />
            </div>

            {/* Employee ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Employee ID</FieldLabel>
                <AutoBadge />
              </div>
              <input type="text" readOnly value={employeeId || currentPersona?.employeeId || ""} className={autoClass + " font-mono"} />
            </div>

            {/* Business Unit */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Business Unit</FieldLabel>
                <AutoBadge />
              </div>
              <input type="text" readOnly value={businessUnit || currentPersona?.businessUnit || ""} className={autoClass} />
            </div>

            {/* Division */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Division</FieldLabel>
                <AutoBadge />
              </div>
              <input type="text" readOnly value={department || currentPersona?.department || ""} className={autoClass} />
            </div>

            {/* Business Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Business Email ID</FieldLabel>
                <AutoBadge />
              </div>
              <input type="email" readOnly value={employeeEmail} className={autoClass + " font-mono"} />
            </div>

            {/* Designation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Grade / Designation</FieldLabel>
                <AutoBadge />
              </div>
              <input type="text" readOnly value={designation || currentPersona?.designation || ""} className={autoClass} />
            </div>

            {/* Base Location */}
            <div>
              <FieldLabel required>Base Location</FieldLabel>
              <input
                type="text"
                placeholder="e.g. Mumbai, Pune, Chennai"
                value={baseLocation}
                onChange={(e) => setBaseLocation(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Reporting Manager */}
            <div>
              <FieldLabel required>Reporting Manager Name</FieldLabel>
              <input
                type="text"
                placeholder="e.g. Rajesh Mehta"
                value={reportingManager}
                onChange={(e) => setReportingManager(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Years in current role */}
            <div className="md:col-span-2">
              <FieldLabel>Years in Current Role</FieldLabel>
              <PillSelector
                options={YEARS_IN_ROLE_OPTIONS}
                selected={yearsInRole}
                onToggle={(v) => setYearsInRole(v === yearsInRole ? "" : v)}
                singleSelect
              />
            </div>
          </div>
        </div>

        {/* ====== SECTION B — PROBLEM IDENTIFICATION ========================= */}
        <div className="p-6">
          <SectionHeader letter="B" title="Problem Identification" />

          {/* AI Refinement banner */}
          <div className="mb-5 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-800 font-medium">
                Fill in Title, Description, and Solution — then click AI Refine to polish the language.
              </p>
            </div>
            <button
              type="button"
              disabled={isRefining || !title || !opportunityDesc || !proposedSolution}
              onClick={handleRefineWithAI}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isRefining ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Refining...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Refine with AI</>
              )}
            </button>
          </div>

          {refineError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" /> {refineError}
            </div>
          )}
          {refinedBadge && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" /> Proposal refined by AI — please review before submitting.
            </div>
          )}

          <div className="space-y-5">

            {/* Idea Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Idea Title <span className="text-slate-400 font-normal">(max 80 characters)</span></FieldLabel>
                <span className={`text-[10px] font-mono ${title.length > 80 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                  {title.length}/80
                </span>
              </div>
              <input
                type="text" required maxLength={100}
                placeholder="One-line summary of your idea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Area of Impact */}
            <div>
              <FieldLabel required>Area of Impact</FieldLabel>
              <select required value={areaOfImpact} onChange={(e) => setAreaOfImpact(e.target.value)} className={inputClass + " cursor-pointer"}>
                <option value="">Select area...</option>
                {AREA_OF_IMPACT_LIST.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Who is affected */}
            <div>
              <FieldLabel required>Who is Affected? <span className="text-slate-400 font-normal">(select all that apply)</span></FieldLabel>
              <PillSelector options={WHO_AFFECTED_OPTIONS} selected={whoAffected} onToggle={toggleWhoAffected} />
            </div>

            {/* Area of opportunity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>What is the area of opportunity you would like to address?</FieldLabel>
                <WordCount text={opportunityDesc} max={150} />
              </div>
              <textarea
                required rows={3}
                placeholder="What is happening today? Describe the current situation or gap..."
                value={opportunityDesc}
                onChange={(e) => setOpportunityDesc(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Root cause */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Why does this opportunity exist? Root cause / elaboration</FieldLabel>
                <WordCount text={rootCause} max={100} />
              </div>
              <textarea
                required rows={3}
                placeholder="Underlying root cause — one layer deeper than the symptom..."
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Duration */}
            <div>
              <FieldLabel required>How long has this opportunity existed?</FieldLabel>
              <PillSelector
                options={DURATION_OPTIONS}
                selected={opportunityDuration}
                onToggle={(v) => setOpportunityDuration(v === opportunityDuration ? "" : v)}
                singleSelect
              />
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>What experience led you to this idea?</FieldLabel>
                <WordCount text={ideaExperience} max={150} />
              </div>
              <textarea
                required rows={3}
                placeholder="Proximity / lived experience that made you notice this gap..."
                value={ideaExperience}
                onChange={(e) => setIdeaExperience(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Previous attempts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Have you tried to address this before? What happened?</FieldLabel>
                <WordCount text={previousAttempts} max={100} />
              </div>
              <textarea
                required rows={3}
                placeholder="Describe any previous attempt and its outcome, or confirm this is a first attempt..."
                value={previousAttempts}
                onChange={(e) => setPreviousAttempts(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* ====== SECTION C — THE PROPOSED IDEA ============================== */}
        <div className="p-6">
          <SectionHeader letter="C" title="The Proposed Idea" />
          <div className="space-y-5">

            {/* Proposed Solution */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>Proposed Solution <span className="text-slate-400 font-normal">(max 250 words)</span></FieldLabel>
                <WordCount text={proposedSolution} max={250} />
              </div>
              <textarea
                required rows={5}
                placeholder="What do you propose should change? Describe the process, system, or approach..."
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Current state / Proposed state */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel required>Current State (Before)</FieldLabel>
                  <WordCount text={currentState} max={50} />
                </div>
                <textarea
                  required rows={2}
                  placeholder="e.g. Cycle time: 5 days; cost: Rs. 18L/yr"
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  className={inputClass + " resize-none"}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel required>Proposed State (After)</FieldLabel>
                  <WordCount text={proposedState} max={50} />
                </div>
                <textarea
                  required rows={2}
                  placeholder="e.g. Cycle time: 2 days; cost: Rs. 10L/yr"
                  value={proposedState}
                  onChange={(e) => setProposedState(e.target.value)}
                  className={inputClass + " resize-none"}
                />
              </div>
            </div>

            {/* Evidence */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required>What evidence or data supports this idea?</FieldLabel>
                <WordCount text={evidence} max={100} />
              </div>
              <textarea
                required rows={3}
                placeholder="Personal observation, team feedback, report data, benchmarking etc..."
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Support / Resources */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel optional>What support and resources will be needed?</FieldLabel>
                <WordCount text={supportResources} max={50} />
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Lab access, 2 FTEs for 3 months, procurement budget of Rs. 50k..."
                value={supportResources}
                onChange={(e) => setSupportResources(e.target.value)}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* ====== SECTION D — RISK AWARENESS ================================= */}
        <div className="p-6">
          <SectionHeader letter="D" title="Risk Awareness" />
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel required>What are the risks involved in implementing this solution?</FieldLabel>
              <WordCount text={riskAwareness} max={50} />
            </div>
            <textarea
              required rows={2}
              placeholder="Briefly describe implementation risks, dependencies, or constraints..."
              value={riskAwareness}
              onChange={(e) => setRiskAwareness(e.target.value)}
              className={inputClass + " resize-none"}
            />
          </div>
        </div>

        {/* ====== SECTION E — SELF-ASSESSMENT ================================ */}
        <div className="p-6">
          <SectionHeader letter="E" title="Self-Assessment" />
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FieldLabel required>Originality — How new is this idea to Ion Exchange?</FieldLabel>
                <RatingSelector
                  value={originalityRating}
                  onChange={setOriginalityRating}
                  label1="Already exists at ION"
                  label5="Completely novel"
                />
              </div>
              <div className="space-y-3">
                <FieldLabel required>Feasibility — How easy / low-cost is this to implement?</FieldLabel>
                <RatingSelector
                  value={feasibilityRating}
                  onChange={setFeasibilityRating}
                  label1="Almost free"
                  label5="Major investment"
                />
              </div>
            </div>

            <div>
              <FieldLabel required>How would you like to contribute or be involved?</FieldLabel>
              <div className="space-y-2 mt-1">
                {CONTRIBUTION_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${
                      contributionChoice === opt ? "bg-indigo-50 border-indigo-400" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio" name="contribution" value={opt}
                      checked={contributionChoice === opt}
                      onChange={() => setContributionChoice(opt)}
                      className="mt-0.5 accent-indigo-600 shrink-0"
                    />
                    <span className="text-sm text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ====== SECTION F — FINANCIAL ESTIMATE ============================= */}
        <div className="p-6">
          <SectionHeader
            letter="F"
            title="Financial Estimate"
            subtitle="Optional — idea will not be blocked if left blank"
          />
          <div className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel optional>Estimated Annual Financial Impact (Rs.)</FieldLabel>
                <input
                  type="number" min="0"
                  placeholder="e.g. 800000"
                  value={estimatedImpact}
                  onChange={(e) => setEstimatedImpact(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>
                  Basis of Calculation{" "}
                  <span className="text-slate-400 font-normal text-xs">
                    {estimatedImpact ? "(required when impact is filled)" : "(if impact entered above)"}
                  </span>
                </FieldLabel>
                <input
                  type="text"
                  required={!!estimatedImpact}
                  placeholder="e.g. 200 hrs/month x Rs. 500/hr = Rs. 12L/year"
                  value={basisOfCalculation}
                  onChange={(e) => setBasisOfCalculation(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Type of Impact <span className="text-slate-400 font-normal text-xs">(select all that apply)</span></FieldLabel>
              <PillSelector
                options={IMPACT_TYPE_OPTIONS}
                selected={impactTypes}
                onToggle={toggleImpactType}
              />
            </div>
          </div>
        </div>

        {/* ====== SECTION G — DECLARATIONS AND ATTACHMENTS ================== */}
        <div className="p-6">
          <SectionHeader letter="G" title="Declarations and Attachments" />
          <div className="space-y-5">

            {/* Duplicate check declaration */}
            <label
              className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                duplicateDeclared
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <input
                type="checkbox" required
                checked={duplicateDeclared}
                onChange={(e) => setDuplicateDeclared(e.target.checked)}
                className="mt-0.5 accent-emerald-600 w-4 h-4 shrink-0"
              />
              <span className="text-sm text-slate-700">
                <strong>Duplicate Check Declaration:</strong> I have checked existing ideas on Ripple and believe this is not a duplicate submission. <span className="text-rose-500">*</span>
              </span>
            </label>

            {/* File upload */}
            <div>
              <FieldLabel optional>
                Attachments{" "}
                <span className="text-slate-400 font-normal text-xs">
                  — PDF / JPG / XLSX (sketches, data, references)
                </span>
              </FieldLabel>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="file" multiple id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                    <Upload className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-indigo-600">Click to upload</span>
                  <span className="text-xs text-slate-400">or drag and drop — PDF, JPG, XLSX</span>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700 truncate max-w-xs">{file.name}</span>
                        <span className="text-slate-400 font-mono">{file.size}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles((p) => p.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====== SUBMIT FOOTER ============================================== */}
        <div className="p-6 bg-slate-50">
          <div className="text-xs text-slate-500 mb-4 p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <div className="font-semibold text-slate-700 mb-1">System-generated on submit:</div>
            <div>• <strong>Idea ID</strong> — Format: RPL-2026-XXXX (auto-assigned)</div>
            <div>• <strong>Submission timestamp</strong> — System date / time</div>
            <div>• <strong>Status</strong> — Default: Submitted → Pending C-POC Vetting</div>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Idea to Ripple Platform
          </button>
        </div>

      </form>
    </div>
  );
};
