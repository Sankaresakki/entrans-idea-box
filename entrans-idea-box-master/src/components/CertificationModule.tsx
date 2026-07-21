/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Idea, IdeaStatus, UserPersona } from "../types";
import { CertificateView } from "./CertificateView";
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  ShieldCheck, 
  Download, 
  Send, 
  Search, 
  BookmarkCheck, 
  Lock, 
  Eye, 
  Mail, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface CertificationModuleProps {
  ideas: Idea[];
  persona: UserPersona;
  selectedIdea: Idea | null;
  onSelectIdea: (idea: Idea) => void;
  onAddNotification: (recipient: string, subject: string, message: string) => void;
}

export const CertificationModule: React.FC<CertificationModuleProps> = ({ 
  ideas, 
  persona, 
  selectedIdea, 
  onSelectIdea,
  onAddNotification
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [certTypeFilter, setCertTypeFilter] = useState<string>("all");
  const [activeCert, setActiveCert] = useState<Idea | null>(selectedIdea || null);
  const [activeCertType, setActiveCertType] = useState<"Certificate of Selection" | "Certificate of Contribution">("Certificate of Selection");
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);

  // Automatically sync with selectedIdea if it changes from parent
  React.useEffect(() => {
    if (selectedIdea) {
      setActiveCert(selectedIdea);
      // Determine default cert type based on status
      if (selectedIdea.status === IdeaStatus.Completed) {
        setActiveCertType("Certificate of Contribution");
      } else {
        setActiveCertType("Certificate of Selection");
      }
    }
  }, [selectedIdea]);

  // Generate the database of all credentials that could be generated
  const credentialsList: {
    id: string;
    ideaId: string;
    ideaTitle: string;
    recipientName: string;
    recipientEmail: string;
    recipientDept: string;
    type: "Certificate of Selection" | "Certificate of Contribution";
    issueDate: string;
    digitalSignatureHash: string;
    signatureStatus: "Digitally Signed & Secured" | "Pending Dynamic Keys";
    emailStatus: "Sent Automatically via RIPPLE Zoho-SMTP" | "Pending Queue";
    associatedIdea: Idea;
  }[] = [];

  ideas.forEach((idea) => {
    // 1. Certificate of Selection (IRC Selected — issued automatically)
    const hasBeenSelected = idea.ircSelectionStatus === "Selected" ||
      (idea.status !== IdeaStatus.Submitted &&
       idea.status !== IdeaStatus.ReturnedToEmployee &&
       idea.status !== IdeaStatus.VettingLimitExceeded &&
       idea.status !== IdeaStatus.ApprovedByCPOC &&
       idea.status !== IdeaStatus.UnderIRCEvaluation &&
       idea.status !== IdeaStatus.RejectedByIRC);
    if (hasBeenSelected) {
      credentialsList.push({
        id: `CERT-SL-${idea.id.split("-").pop()}`,
        ideaId: idea.id,
        ideaTitle: idea.title,
        recipientName: idea.employeeName,
        recipientEmail: idea.employeeEmail,
        recipientDept: idea.department || "General Engineering",
        type: "Certificate of Selection",
        issueDate: idea.cpocVettedDate || idea.createdAt,
        digitalSignatureHash: `SHA256:d5e6f7...${idea.id.replace(/-/g, "").toLowerCase()}`,
        signatureStatus: "Digitally Signed & Secured",
        emailStatus: "Sent Automatically via RIPPLE Zoho-SMTP",
        associatedIdea: idea
      });
    }

    // 2. Certificate of Contribution (CFO sign-off — issued automatically)
    if (idea.status === IdeaStatus.Completed) {
      credentialsList.push({
        id: `CERT-CT-${idea.id.split("-").pop()}`,
        ideaId: idea.id,
        ideaTitle: idea.title,
        recipientName: idea.employeeName,
        recipientEmail: idea.employeeEmail,
        recipientDept: idea.department || "General Engineering",
        type: "Certificate of Contribution",
        issueDate: idea.cfoSignOffDate || new Date().toISOString(),
        digitalSignatureHash: `SHA256:c1d2e3...${idea.id.replace(/-/g, "").toLowerCase()}`,
        signatureStatus: "Digitally Signed & Secured",
        emailStatus: "Sent Automatically via RIPPLE Zoho-SMTP",
        associatedIdea: idea
      });
    }
  });
  // All roles see only the 2 valid certificate types
  const myCredentials = credentialsList.filter((cred) => {
    if (persona.role === "Employee") {
      return cred.recipientEmail.toLowerCase() === persona.email.toLowerCase();
    }
    return true;
  });

  const searchedCredentials = myCredentials.filter((cred) => {
    const matchesSearch = 
      cred.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.ideaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.ideaId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = certTypeFilter === "all" ? true : cred.type === certTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleSelectCredential = (cred: typeof credentialsList[0]) => {
    setActiveCert(cred.associatedIdea);
    setActiveCertType(cred.type);
    onSelectIdea(cred.associatedIdea);
  };

  const handleSimulatedDownload = (credId: string) => {
    setDownloadProgress(credId);
    setTimeout(() => {
      setDownloadProgress("compiling");
      setTimeout(() => {
        setDownloadProgress("saving");
        setTimeout(() => {
          setDownloadProgress(null);
          // Simulate local file download
          alert(`Success: Credential PDF generated and saved successfully! ID: ${credId}`);
        }, 800);
      }, 700);
    }, 600);
  };

  const handleReSendEmail = (cred: typeof credentialsList[0]) => {
    const subject = `[RIPPLE Credentials] Your Official ${cred.type} has been Released!`;
    const message = `Dear ${cred.recipientName},

We are proud to notify you that your official Ion Exchange corporate credential has been securely issued and digitally signed!

CREDENTIAL DETAILS:
------------------------------------------
Certificate ID: ${cred.id}
Initiative Reference: ${cred.ideaTitle} (ID: ${cred.ideaId})
Credential Type: ${cred.type}
Issue Date: ${new Date(cred.issueDate).toLocaleDateString()}
Digital Signature Verification SHA-256 Key: ${cred.digitalSignatureHash}
Corporate Security Authority: TM & OD CoE Lead (AVP - Talent Management & OD)

You DO NOT need to check dashboards or track administrative rosters to access your recognition. Your digital certificate is fully compiled, verified, and active. You can print or download the physical copy anytime.

Thank you for your outstanding contribution to organization-wide innovation and operational excellence under the RIPPLE timeline!

Best regards,
TM & OD Central Coordinator CoE
Ion Exchange (India) Limited
Corporate Treasury & HR Audit Systems`;

    onAddNotification(cred.recipientEmail, subject, message);
    alert(`Success: Re-delivery triggered! Certificate email dispatched to ${cred.recipientEmail} via Zoho Mail Server.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Stats Bar */}
      <div className="p-5 bg-gradient-to-br from-[#004a69] via-[#003350] to-[#003350] border border-[#0098DB]/20 rounded-2xl text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10">
          <Award className="w-56 h-56 text-indigo-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-300 font-bold bg-indigo-500/25 px-2.5 py-1 rounded-md border border-indigo-500/30">
              Governance Standard
            </span>
            <h2 className="text-xl font-black font-display tracking-tight">
              SECURE CORPORATE CERTIFICATION CHAMBER
            </h2>
            <p className="text-slate-300 text-[10.5px] max-w-xl font-sans">
              Employees should not need to monitor dashboard states. Digital credentials generate instantly upon checkpoint passage, with automated Zoho Mail notification deliveries direct to recipients.
            </p>
          </div>
          <div className="flex gap-4 font-mono bg-white/5 border border-white/10 p-3 rounded-xl">
            <div className="text-center pr-4 border-r border-white/10">
              <span className="text-[9px] text-slate-400 block uppercase font-bold">My Credentials</span>
              <strong className="text-lg text-indigo-300">{myCredentials.length}</strong>
            </div>
            <div className="text-center pl-1">
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Registry Total</span>
              <strong className="text-lg text-emerald-400">{credentialsList.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Filter and List of Certificates */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl card-shadow space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search credentials, titles, IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                />
              </div>
              <select
                value={certTypeFilter}
                onChange={(e) => setCertTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="all">All Certificate Types</option>
                <option value="Certificate of Selection">Certificate of Selection</option>
                <option value="Certificate of Contribution">Certificate of Contribution</option>
              </select>
            </div>

            {/* Certificate Gallery only — Audit History removed */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {searchedCredentials.length > 0 ? (
                  searchedCredentials.map((cred) => {
                    const isSelected = activeCert?.id === cred.ideaId && activeCertType === cred.type;
                    return (
                      <div
                        key={`${cred.id}-${cred.type}`}
                        onClick={() => handleSelectCredential(cred)}
                        className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                          isSelected
                            ? "bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-300"
                            : "bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 hover:border-slate-350"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {cred.id}
                          </span>
                          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            cred.type === "Certificate of Contribution"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : cred.type === "Certificate of Selection"
                              ? "bg-violet-50 text-violet-700 border border-violet-100"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {cred.type === "Certificate of Selection" ? "Selection" : "Contribution"}
                          </span>
                        </div>

                        <h4 className="font-display font-extrabold text-xs text-slate-800 leading-snug mt-2 line-clamp-1">
                          {cred.ideaTitle}
                        </h4>

                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <div>
                            Recipient: <strong className="text-slate-700 font-medium">{cred.recipientName}</strong>
                          </div>
                          <div className="font-mono text-[9px]">
                            {new Date(cred.issueDate).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Interactive Footer badges */}
                        <div className="mt-3 pt-2.5 border-t border-slate-150 flex items-center justify-between">
                          <span className="text-[8.5px] text-indigo-700 font-mono font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Secure Seal Verified
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReSendEmail(cred);
                              }}
                              title="Redeliver Zoho Email Notification"
                              className="p-1 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 rounded transition-all"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSimulatedDownload(cred.id);
                              }}
                              disabled={downloadProgress !== null}
                              title="Download Signed PDF File"
                              className="p-1 text-slate-400 hover:text-emerald-650 hover:bg-emerald-50 rounded transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                    <BookmarkCheck className="w-8 h-8 opacity-20 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold">No Credentials matching search criteria</p>
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* Right Side: Active Certificate Display Pane */}
        <div className="lg:col-span-6 space-y-4">
          {activeCert ? (
            <div className="bg-white border border-slate-200 p-5 rounded-2xl card-shadow">
              
              {/* Dynamic Signatures status box */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-850 flex items-start gap-2.5 mb-4 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <strong className="text-emerald-950 font-bold block">Digital Signature Authentication Active</strong>
                  <p className="text-[10px]">
                    This certificate carries a verified cryptographic seal from the central AVP - Talent Management & OD. Secure key reference is embedded in the layout footer.
                  </p>
                </div>
              </div>

              {/* Certificate selector — 2 types only */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCertType("Certificate of Selection")}
                  className={`px-2.5 py-1 text-[9.5px] font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    activeCertType === "Certificate of Selection"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  (1) Certificate of Selection
                </button>
                {activeCert.status === IdeaStatus.Completed && (
                  <button
                    onClick={() => setActiveCertType("Certificate of Contribution")}
                    className={`px-2.5 py-1 text-[9.5px] font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                      activeCertType === "Certificate of Contribution"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    (2) Certificate of Contribution
                  </button>
                )}
              </div>

              {/* Download Indicator Overlay */}
              {downloadProgress && (
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-150 rounded-xl flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" />
                    <span className="font-medium text-indigo-950">
                      {downloadProgress === "compiling" ? "Compiling cryptographic vectors..." : downloadProgress === "saving" ? "Applying secure digital seals & downloading..." : "Analyzing print canvas size..."}
                    </span>
                  </div>
                  <strong className="text-[10px] font-mono text-indigo-700 font-bold uppercase">Processing</strong>
                </div>
              )}

              {/* The actual certificate viewer */}
              <div className="border border-slate-150 rounded-2xl bg-slate-50/50 p-2 overflow-x-auto">
                <CertificateView idea={activeCert} certType={activeCertType} />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1 font-mono text-[9px]">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Secure Key: SHA256:{activeCert.id.replace(/-/g, "").toLowerCase()}</span>
                </div>
                <span>* Use standard Print option to generate high fidelity PDF vector layouts.</span>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-12 rounded-2xl card-shadow text-center text-slate-400">
              <Eye className="w-12 h-12 opacity-15 mx-auto mb-2" />
              <p className="font-bold text-xs">No Certificate Focus Loaded</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                Please select any credential from the gallery list on the left to review its dynamic, signed representation.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
