/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Idea, IdeaStatus } from "../types";
import { Award, Sparkles, Printer } from "lucide-react";
import ionLogo from "../../assets/ion_logo.png";
import rightLogo from "../../assets/image001.png";

interface CertificateViewProps {
  idea: Idea;
  certType: "Certificate of Selection" | "Certificate of Contribution";
}

export const CertificateView: React.FC<CertificateViewProps> = ({ idea, certType }) => {
  const getBannerDetails = () => {
    switch (certType) {
      case "Certificate of Selection":
        return {
          title: "CERTIFICATE OF SELECTION",
          subtitle: "Presented for Central IRC Jury Board Selection",
          description: "Awarded to recognize that this outstanding idea has successfully matched critical feasibility, alignment, and sustainability thresholds of the Central Idea Review Committee (IRC) and is cleared with a Rs. 2,000 Voucher.",
          color: "border-indigo-400 bg-linear-to-br from-indigo-50 to-violet-100",
          accentColor: "text-indigo-800",
          headerBg: "bg-linear-to-r from-indigo-900 to-violet-950"
        };
      case "Certificate of Contribution":
      default:
        return {
          title: "CERTIFICATE OF CONTRIBUTION",
          subtitle: "In Recognition of Completed Trial & Realized Savings",
          description: "Awarded in appreciation of successful pilot execution, team collaboration, and realizing verified net utility savings under the RIPPLE Incu-Workspace program.",
          color: "border-emerald-300 bg-linear-to-br from-emerald-50 to-teal-50",
          accentColor: "text-green-800",
          headerBg: "bg-linear-to-r from-emerald-900 via-teal-900 to-cyan-950"
        };
    }
  };

  const details = getBannerDetails();

  const handlePrint = () => {
    const certEl = document.getElementById(`cert-card-${idea.id}`);
    if (!certEl) { window.print(); return; }

    // Clone the certificate and strip non-print elements
    const clone = certEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".no-print").forEach(el => el.remove());
    clone.id = "print-clone-cert";
    document.body.appendChild(clone);
    document.body.classList.add("cert-printing");

    const cleanup = () => {
      const el = document.getElementById("print-clone-cert");
      if (el) document.body.removeChild(el);
      document.body.classList.remove("cert-printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  // ─── Dedicated layout: Certificate of Idea Selection (per spec) ───────────
  if (certType === "Certificate of Selection") {
    const selectionDate = (() => {
      const raw =
        (idea.ircReviews && idea.ircReviews.length > 0
          ? idea.ircReviews[idea.ircReviews.length - 1].dateSubmitted
          : undefined) ||
        idea.submissionDate ||
        idea.createdAt;
      return new Date(raw).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    })();

    return (
      <div id={`cert-card-${idea.id}`} className="max-w-5xl mx-auto my-4 print-area p-6">
        {/* Print button */}
        <div className="flex justify-end mb-2 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF Certificate
          </button>
        </div>

        {/* ── Certificate Card ─────────────────────────────────────────────── */}
        <div className="bg-white border-[3px] border-blue-900 shadow-xl overflow-hidden relative select-none">

          {/* Corner circle accents */}
          <div className="absolute top-[10px] left-[10px] w-5 h-5 border-2 border-blue-900 rounded-full pointer-events-none z-10" />
          <div className="absolute top-[10px] right-[10px] w-5 h-5 border-2 border-blue-900 rounded-full pointer-events-none z-10" />
          <div className="absolute bottom-[10px] left-[10px] w-5 h-5 border-2 border-blue-900 rounded-full pointer-events-none z-10" />
          <div className="absolute bottom-[10px] right-[10px] w-5 h-5 border-2 border-blue-900 rounded-full pointer-events-none z-10" />

          {/* Inner border frame */}
          <div className="mx-[22px] my-[22px] border border-blue-900/30">

            {/* ── Header: Logos row ──────────────────────────────────────── */}
            <div className="flex items-center justify-between px-8 pt-6 pb-4">
              {/* ION EXCHANGE logo – left */}
              <img src={ionLogo} alt="Ion Exchange Logo" className="h-12 w-auto object-contain" />
              {/* Right logo */}
              <img src={rightLogo} alt="Right Logo" className="h-12 w-auto object-contain" />
            </div>

            {/* Top title divider */}
            <div className="h-[2px] bg-blue-900 mx-0" />

            {/* Certificate title */}
            <div className="text-center py-4">
              <h1 style={{fontFamily:"'Georgia','Times New Roman',serif", letterSpacing:"0.16em"}} className="text-[18px] font-black text-blue-900 uppercase">
                CERTIFICATE OF IDEA SELECTION
              </h1>
            </div>

            {/* Bottom title divider */}
            <div className="h-[2px] bg-blue-900 mx-0" />

            {/* ── Main Body ─────────────────────────────────────────────── */}
            <div className="text-center px-10 pt-9 pb-7">

              <p style={{fontFamily:"Georgia,serif", fontStyle:"italic"}} className="text-blue-800 text-[14px] mb-6">
                This is proudly presented to
              </p>

              <div className="mb-6">
                <p style={{fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif"}} className="text-[36px] font-bold text-slate-900 leading-none tracking-wide">
                  {idea.employeeName}
                </p>
                <div className="h-[2px] bg-slate-800 w-80 mx-auto mt-3" />
              </div>

              <p style={{fontFamily:"Georgia,serif", fontStyle:"italic"}} className="text-blue-800 text-[14px] mb-5">
                in recognition of the idea
              </p>

              <p style={{fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif"}} className="text-[19px] font-bold text-slate-900 leading-snug px-6 mb-5">
                &ldquo;{idea.title}&rdquo;
              </p>

              <p style={{fontFamily:"Georgia,serif"}} className="text-slate-600 text-[12.5px] leading-relaxed max-w-md mx-auto">
                selected by the Idea Review Committee under the Ripple Programme<br />
                at Ion Exchange (India) Limited.
              </p>

            </div>

            {/* ── Metadata strip ────────────────────────────────────────── */}
            <div className="h-[1px] bg-slate-300 mx-6 mt-1" />
            <div className="flex justify-between items-center px-8 py-3">
              <span style={{fontFamily:"'Courier New',monospace"}} className="text-[11px] text-slate-700">
                <strong>Idea ID:</strong> {idea.id}
              </span>
              <span style={{fontFamily:"'Courier New',monospace"}} className="text-[11px] text-slate-700">
                <strong>Date:</strong> {selectionDate}
              </span>
            </div>

            {/* ── Signature block ───────────────────────────────────────── */}
            <div className="text-center pt-5 pb-8">
              {/* Signature line */}
              <div className="flex flex-col items-center gap-1">
                <p style={{fontFamily:"'Brush Script MT','Segoe Script',cursive", fontSize:"28px"}} className="text-slate-700 leading-none tracking-wide">
                  Authorized Signatory
                </p>
                <div className="w-52 h-[1px] bg-slate-700 mt-1 mb-2" />
                <p style={{fontFamily:"Georgia,serif"}} className="text-[13px] font-bold text-slate-900">
                  Chief Human Resources Officer
                </p>
                <p style={{fontFamily:"Georgia,serif"}} className="text-[11px] text-slate-500 mt-0.5">
                  Ion Exchange (India) Limited
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div id={`cert-card-${idea.id}`} className="max-w-5xl mx-auto my-4 print-area">
      <div className="flex justify-end mb-2 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md transition-all cursor-pointer shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / PDF Certificate
        </button>
      </div>

      <div className={`p-8 border-6 rounded-2xl relative overflow-hidden card-shadow ${details.color} transition-all`}>
        {/* Background watermark seals */}
        <div className="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 bg-slate-400/5 rounded-full pointer-events-none blur-xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 -ml-16 -mb-16 bg-blue-400/5 rounded-full pointer-events-none blur-lg" />

        {/* Certificate Border Line */}
        <div className="border border-slate-300/60 p-6 rounded-lg pointer-events-none">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <img src={ionLogo} alt="Ion Exchange Logo" className="h-12 w-auto object-contain" />
              <img src={rightLogo} alt="Right Logo" className="h-12 w-auto object-contain" />
            </div>
            <div className="text-center">
              <span className="text-[10px] tracking-widest font-bold text-slate-500 uppercase block mb-1">
                Ion Exchange (India) Limited
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 font-display tracking-tight uppercase">
                One Ion — Idea Box
              </h2>
              <div className="h-[2px] w-16 bg-sky-500 mx-auto mt-2" />
            </div>
          </div>

          {/* Badge & Title */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center p-3 rounded-full mb-3 ${details.headerBg} text-white shadow-md`}>
              {certType === "Certificate of Selection" ? (
                <Sparkles className="w-6 h-6 text-violet-300" />
              ) : (
                <Award className="w-6 h-6 text-emerald-300" />
              )}
            </div>

            <h1 className={`text-2xl font-black tracking-wider ${details.accentColor} font-display uppercase`}>
              {details.title}
            </h1>
            <p className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wide">
              {details.subtitle}
            </p>
          </div>

          {/* Main Certificate Content */}
          <div className="text-center px-4 mb-8">
            <p className="text-slate-500 text-xs italic mb-4">
              This credential is proudfully bestowed upon
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight border-b border-slate-300 pb-2 inline-block px-12 uppercase">
              {idea.employeeName}
            </h3>
            
            <p className="text-slate-600 text-xs mt-4 leading-relaxed max-w-lg mx-auto">
              {details.description}
            </p>
            
            <div className="mt-6 bg-white/70 backdrop-blur-xs p-3 rounded-lg max-w-md mx-auto border border-slate-200/50">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-1">
                For the Proposed Initiative:
              </span>
              <p className="text-slate-800 font-semibold font-display text-sm leading-snug">
                "{idea.title}"
              </p>
              <div className="mt-2 flex justify-center gap-4 text-[10px] font-mono text-slate-500">
                <span>ID: {idea.id}</span>
                <span>•</span>
                <span>BU: {idea.businessUnit}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Footer info */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 text-center">
            <div>
              <div className="h-6 font-mono text-xs italic text-slate-400 flex items-end justify-center">
                Organizing Team
              </div>
              <div className="w-24 h-[1px] bg-slate-300 mx-auto my-1" />
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-600">
                TM & OD CoE
              </p>
              <p className="text-[8px] text-slate-400">Ion Exchange India</p>
            </div>

            <div>
              <div className="h-6 flex items-end justify-center text-xs text-slate-800 font-mono font-medium">
                {new Date(idea.submissionDate || idea.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="w-24 h-[1px] bg-slate-300 mx-auto my-1" />
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-600">
                Date Verified
              </p>
              <p className="text-[8px] text-slate-400">System Controlled Log</p>
            </div>

            <div>
              <div className="h-6 font-mono text-xs italic text-slate-400 flex items-end justify-center">
                Verified Approval
              </div>
              <div className="w-24 h-[1px] bg-slate-300 mx-auto my-1" />
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-600">
                Review Board Signature
              </p>
              <p className="text-[8px] text-slate-400">One Ion Security Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
