/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Download, ChevronDown, ChevronUp, CheckCircle, Info, Lightbulb, ArrowRight, FileText, Award, AlertCircle } from "lucide-react";

// ─── Place your PPT/PDF in /public/employee-manual.pdf (or update the path below) ───
const MANUAL_FILE_PATH = "/employee-manual.pdf";
// To embed from Google Slides: set SLIDES_EMBED_URL to your published slide embed URL
// e.g. "https://docs.google.com/presentation/d/SLIDE_ID/embed?start=false&loop=false&delayms=3000"
const SLIDES_EMBED_URL = "";

interface Step {
  id: number;
  title: string;
  desc: string;
  detail: string[];
  icon: React.ReactNode;
  color: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Log In to Ripple",
    desc: "Sign in with your corporate credentials to access the platform.",
    detail: [
      "Open the Ripple platform link shared by TM & OD.",
      "Click 'Sign In' on the landing page.",
      "Enter your registered corporate email address and password.",
      "On your first login, you will be on the 'New Idea Proposal' tab automatically.",
    ],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4 5-5-5-5m5 5H3"/></svg>,
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    id: 2,
    title: "Fill In the Idea Submission Form",
    desc: "Complete all required sections of the Annexure 1 proposal form.",
    detail: [
      "Navigate to the 'New Idea Proposal' tab (visible after login).",
      "Section A: Enter your employee details (name, department, business unit).",
      "Section B: Describe the problem or opportunity you have identified.",
      "Section C: Explain your proposed idea (the 'before' vs 'after' change).",
      "Section D: List possible implementation risks and how to address them.",
      "Section E: Estimate the financial or operational impact of your idea.",
      "Optionally attach any supporting documents or data.",
      "Click 'Submit Idea Proposal' to send your submission.",
    ],
    icon: <FileText className="w-6 h-6" />,
    color: "bg-violet-50 border-violet-200 text-violet-700",
  },
  {
    id: 3,
    title: "Track Your Idea Status",
    desc: "Monitor where your idea is in the review cycle at any time.",
    detail: [
      "Go to the 'My Idea Tracker' tab to see all your submissions.",
      "Click the coloured status badge on any idea to see the full 15-stage progress timeline.",
      "Statuses you may see: Submitted → Under Review → Approved/Returned → IRC Evaluation → Selected / Rejected → Implementation → Completed.",
      "If your idea is returned for more information, you will receive an email with specific questions — update and resubmit from the Tracker.",
    ],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    id: 4,
    title: "Respond to Send-Backs",
    desc: "If C-POC requests more detail, update your idea within the platform.",
    detail: [
      "You will receive an automated email when a send-back is raised on your idea.",
      "Log in and go to 'My Idea Tracker'.",
      "Click on the idea marked 'Returned — Needs Clarification'.",
      "Review the specific sections flagged for more detail.",
      "Edit your responses in the form and click 'Resubmit'.",
      "Note: You have a maximum of 2 send-back rounds per idea.",
    ],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6 6-6"/></svg>,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    id: 5,
    title: "IRC Pitch Presentation",
    desc: "If your idea clears vetting, you will be invited to present to the IRC.",
    detail: [
      "You will receive a Teams meeting invitation via email with the scheduled date and time.",
      "Prepare a 5-slide PDF pitch deck for the 5-minute presentation.",
      "Slide structure: (1) Problem, (2) Proposed Solution, (3) Impact & Data, (4) Implementation Plan, (5) Ask / Resources needed.",
      "The IRC panel will evaluate your idea on 6 criteria: Alignment, Feasibility, Business Value, Innovation, Scalability, Risk.",
      "Results are notified by C-POC after the evaluation cycle closes.",
    ],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4z"/></svg>,
    color: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    id: 6,
    title: "Certificate & Recognition",
    desc: "Receive your digital certificate once your idea is selected or implemented.",
    detail: [
      "On IRC selection, your 'Certificate of Selection' is automatically generated and emailed to you.",
      "On successful implementation and CFO sign-off, your 'Certificate of Contribution' is issued.",
      "View and download your certificates from the 'Certificates' tab.",
      "Both certificates carry a digital SHA-256 signature seal and are verifiable.",
    ],
    icon: <Award className="w-6 h-6" />,
    color: "bg-rose-50 border-rose-200 text-rose-700",
  },
];

const FAQ = [
  {
    q: "What kinds of ideas can I submit?",
    a: "Any idea that can improve a process, reduce waste, save cost, improve safety, or add value to the business. This is not a grievance/feedback channel — ideas should be actionable improvement proposals.",
  },
  {
    q: "How long does the evaluation process take?",
    a: "C-POC vetting takes up to 5 working days. IRC evaluation sessions are conducted monthly. You will receive automated updates at each stage via email.",
  },
  {
    q: "Can I submit more than one idea?",
    a: "Yes. There is no limit on the number of ideas you can submit. Each submission gets its own unique ID and goes through the full evaluation cycle independently.",
  },
  {
    q: "What happens if my idea is rejected?",
    a: "You will receive a respectful email explaining the decision. You can resubmit a refined version in a future cycle. Not all rejections are permanent — ideas may be revisited as business priorities change.",
  },
  {
    q: "Who sees my idea?",
    a: "Your idea is visible to the C-POC team for vetting, the IRC committee for evaluation, and the assigned Functional Head for implementation planning. Access is role-gated.",
  },
  {
    q: "What is the Rs. 2,000 reward?",
    a: "Every idea that is selected by the IRC (passes evaluation) receives a Rs. 2,000 voucher reward — regardless of whether it proceeds to implementation. This rewards the quality of the idea itself.",
  },
];

export const EmployeeUserManual: React.FC = () => {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<"guide" | "slides">("guide");

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="p-5 bg-gradient-to-br from-[#004a69] via-[#003350] to-[#003350] border border-[#0098DB]/20 rounded-2xl text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-4 top-4 opacity-10">
          <BookOpen className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="text-[9px] font-mono tracking-widest uppercase text-sky-300 font-bold bg-sky-500/20 px-2.5 py-1 rounded-md border border-sky-500/30">
            Employee Resource
          </span>
          <h2 className="text-xl font-black font-display tracking-tight">
            RIPPLE — Employee User Manual
          </h2>
          <p className="text-slate-300 text-[11px] max-w-2xl">
            A step-by-step guide to submitting your ideas, tracking progress, and earning recognition through the Ripple platform.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setActiveView("guide")}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                activeView === "guide"
                  ? "bg-white text-[#003350] border-white"
                  : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
              }`}
            >
              Step-by-Step Guide
            </button>
            {SLIDES_EMBED_URL ? (
              <button
                onClick={() => setActiveView("slides")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                  activeView === "slides"
                    ? "bg-white text-[#003350] border-white"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                }`}
              >
                View Slides Presentation
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Slides Embed (when URL is set) */}
      {activeView === "slides" && SLIDES_EMBED_URL && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            Ripple Employee Guide — Slide Presentation
          </div>
          <iframe
            src={SLIDES_EMBED_URL}
            title="Ripple Employee Manual"
            className="w-full"
            style={{ height: "520px", border: "none" }}
            allowFullScreen
          />
        </div>
      )}

      {/* Step-by-Step Guide */}
      {activeView === "guide" && (
        <>
          {/* Quick summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STEPS.map(step => (
              <button
                key={step.id}
                onClick={() => setOpenStep(openStep === step.id ? null : step.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer hover:shadow-sm ${step.color} ${
                  openStep === step.id ? "ring-2 ring-offset-1 ring-current" : ""
                }`}
              >
                <div className="mb-2 opacity-80">{step.icon}</div>
                <div className="text-[9px] font-mono font-bold opacity-60 mb-0.5">Step {step.id}</div>
                <div className="text-[10.5px] font-extrabold leading-tight">{step.title}</div>
              </button>
            ))}
          </div>

          {/* Expanded Step Detail */}
          {STEPS.map(step => (
            openStep === step.id ? (
              <div key={step.id} className={`rounded-2xl border p-5 ${step.color} space-y-3`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 opacity-80">{step.icon}</div>
                    <div>
                      <div className="text-[9px] font-mono font-bold opacity-60 uppercase tracking-wider">Step {step.id} of {STEPS.length}</div>
                      <h3 className="font-extrabold font-display text-base">{step.title}</h3>
                      <p className="text-[11px] opacity-75 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => setOpenStep(null)} className="flex-shrink-0 opacity-50 hover:opacity-80 cursor-pointer">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {step.detail.map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11.5px]">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-70" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {/* Navigation between steps */}
                <div className="flex items-center justify-between pt-2 border-t border-current/10">
                  {step.id > 1 ? (
                    <button onClick={() => setOpenStep(step.id - 1)} className="text-[10px] font-bold flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer">
                      ← Step {step.id - 1}
                    </button>
                  ) : <span />}
                  {step.id < STEPS.length ? (
                    <button onClick={() => setOpenStep(step.id + 1)} className="text-[10px] font-bold flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer">
                      Step {step.id + 1} <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold opacity-60 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> You're done!
                    </span>
                  )}
                </div>
              </div>
            ) : null
          ))}

          {/* Important Notices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                Important — What Ripple is NOT for
              </div>
              <ul className="space-y-1.5 text-[11px] text-amber-800">
                {[
                  "Grievances or HR complaints",
                  "Personal feedback about colleagues",
                  "General suggestions without a clear implementation path",
                  "Requests for resources or budget without an improvement rationale",
                ].map(item => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="mt-0.5 font-bold">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Lightbulb className="w-4 h-4" />
                Tips for a Strong Submission
              </div>
              <ul className="space-y-1.5 text-[11px] text-emerald-800">
                {[
                  "Be specific — use data or observations to back your problem",
                  "Focus on ONE clear improvement area per idea",
                  "Estimate impact, even roughly (time saved, cost reduced)",
                  "Consider feasibility — can this be done with current resources?",
                ].map(item => (
                  <li key={item} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-indigo-500" />
              <h3 className="font-extrabold text-sm text-slate-800">Frequently Asked Questions</h3>
            </div>
            {FAQ.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <span className="text-[11.5px] font-semibold text-slate-800">{item.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 py-3 text-[11.5px] text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact footer */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800 mb-0.5">Need help with your submission?</p>
              <p className="text-[10.5px]">Reach out to the TM & OD CoE team or write to <strong>coe@ionexchange.com</strong></p>
            </div>
            <div className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
              Ripple — One Ion Exchange India Ltd.
            </div>
          </div>
        </>
      )}

    </div>
  );
};
