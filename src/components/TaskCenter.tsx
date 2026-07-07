/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Idea, IdeaStatus, IRCReview, AREA_OF_IMPACT_THEMES } from "../types";
import { WorkflowMap } from "./WorkflowMap";
import { 
  Sparkles, 
  CheckSquare, 
  Sliders, 
  ShieldCheck, 
  Award, 
  AlertCircle, 
  Play, 
  ArrowRight, 
  UserCheck, 
  FileUp, 
  Database, 
  Calendar, 
  Landmark, 
  CheckCircle, 
  RefreshCcw, 
  FileText, 
  XCircle, 
  Compass, 
  Coins, 
  Users, 
  Flame,
  Cpu,
  Paperclip,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Search,
  X,
  UserPlus
} from "lucide-react";

interface EnterpriseReviewer {
  id: string;
  name: string;
  email: string;
  department: string;
}

const AVAILABLE_ENTERPRISE_REVIEWERS: EnterpriseReviewer[] = [
  { id: "EMP-2384", name: "Dr. Alok Gupta", email: "alok@ionexchange.com", department: "R&D Water Quality" },
  { id: "EMP-9021", name: "Ramesh Chawla (Sr Scientist)", email: "ramesh@ionexchange.com", department: "Sensing & Diagnostics" },
  { id: "EMP-7112", name: "Suresh Pillai", email: "suresh.pillai@ionexchange.com", department: "Industrial Membrane CoE" },
  { id: "EMP-3849", name: "Meera Nair", email: "meera.nair@ionexchange.com", department: "Zero Liquid Discharge" },
  { id: "EMP-5021", name: "Anil Deshmukh", email: "anil.deshmukh@ionexchange.com", department: "Chemical Engineering" },
  { id: "EMP-8841", name: "Advisory Expert A", email: "advisor@ionexchange.com", department: "Sensing CoE" },
  { id: "EMP-8842", name: "Advisory Panel Member", email: "advisor1@ionexchange.com", department: "R&D Centre of Excellence" },
  { id: "EMP-1022", name: "Technical Expert B", email: "council1@ionexchange.com", department: "Water Quality" },
  { id: "EMP-1023", name: "Jury Advisor C", email: "council2@ionexchange.com", department: "ZLD CoE" }
];

const INNOVATION_RUBRIC_MESSAGES: Record<number, string> = {
  1: "Very Poor / No Innovation: Minor adaptation of standard industry procedures.",
  2: "Limited Value: Incremental design modification of common technology.",
  3: "Moderate: Novel layout with proprietary configuration potential.",
  4: "Strong Innovation: Patentable process unique to Ion Exchange IP.",
  5: "Highly Innovative / Exceptional: Global first-of-kind pioneering tech breakthrough."
};

const FEASIBILITY_RUBRIC_MESSAGES: Record<number, string> = {
  1: "Very Poor / High Risk: High CapEx theoretical model with significant process risks.",
  2: "Limited Value: Viable, but requires major engineering revisions.",
  3: "Moderate: Technically feasible with standard stock components.",
  4: "Strong: High feasibility; builds on active lines with minimal risks.",
  5: "Highly Innovative / Exceptional: Plug-and-play system; instant commissioning ready."
};

const BUSINESS_VALUE_RUBRIC_MESSAGES: Record<number, string> = {
  1: "Very Poor / Low ROI: Break-even or payback period exceeds 5 years.",
  2: "Limited Value: Payback within 3-5 years with modest material savings.",
  3: "Moderate: Payback within 2-3 years; saves >5 Lakhs annually.",
  4: "Strong: High ROI; payback under 18 months with low CapEx.",
  5: "Highly Innovative / Exceptional: Extraordinary payback (<6 months); massive recurring yield."
};

const IMPACT_RUBRIC_MESSAGES: Record<number, string> = {
  1: "Very Poor / Site Bound: Custom build bound to one unique geological site.",
  2: "Limited Value: Replicable across specific divisional BUs only.",
  3: "Moderate: Replicable across standard industrial water plants with >75% recovery.",
  4: "Strong: Net positive footprint; saves chemicals, >90% water recovery.",
  5: "Highly Innovative / Exceptional: Zero Liquid Discharge (ZLD); universal modular design deployable globally."
};

const getRubricGuidance = (criterion: string, score: number, max: number): string => {
  if (max === 5) {
    if (criterion === "innovation") return INNOVATION_RUBRIC_MESSAGES[score] || "Moderate innovation parameters.";
    if (criterion === "feasibility") return FEASIBILITY_RUBRIC_MESSAGES[score] || "Feasible with standard efforts.";
    if (criterion === "businessValue") return BUSINESS_VALUE_RUBRIC_MESSAGES[score] || "Provides steady business value.";
    if (criterion === "impact") return IMPACT_RUBRIC_MESSAGES[score] || "Presents notable scalability footprint.";
  }
  const ratio = score / max;
  if (ratio <= 0.2) return "Very Poor performance / minimal impact indicator.";
  if (ratio <= 0.4) return "Limited value with compliance challenges.";
  if (ratio <= 0.6) return "Moderate / Meets basic engineering and ROI targets.";
  if (ratio <= 0.8) return "Strong / Highly recommended, low-risk optimization potential.";
  return "Highly Innovative / Exceptional: Exceeds all benchmark performance standards.";
};

interface TaskCenterProps {
  idea: Idea;
  persona: { role: string; name: string; email: string };
  onUpdateIdea: (updated: Idea) => void;
  onAddNotification: (recipient: string, subject: string, body: string, attachmentName?: string, attachmentType?: string) => void;
}

export const TaskCenter: React.FC<TaskCenterProps> = ({ idea, persona, onUpdateIdea, onAddNotification }) => {
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiEvalError, setAiEvalError] = useState("");

  // Collapsible Proposal Dossier and Quality Vetting states
  const [isDossierExpanded, setIsDossierExpanded] = useState(true);

  // Step 1: C-POC Vetting (Annexure 2)
  const [vettingDecision,  setVettingDecision]  = useState<"" | "Approve" | "Send-back" | "Reject">("");
  const [sendBackSections, setSendBackSections] = useState({ B: false, C: false, D: false, F: false });
  const [rejectReason,     setRejectReason]     = useState<"" | "scope" | "revision">("");
  const [vettingComments,  setVettingComments]  = useState("");

  // Step 2: Employee Resubmission
  const [resubTitle, setResubTitle] = useState(idea.title);
  const [resubProblem, setResubProblem] = useState(idea.problemStatement);
  const [resubSolution, setResubSolution] = useState(idea.proposedSolution);
  const [resubImpact, setResubImpact] = useState(idea.expectedImpact);

  // Step 3: CPOC arrange IRC meeting details
  const [meetingDetails, setMeetingDetails] = useState(idea.proposerIrcMeetingDetails || "IRC Presentation scheduled for next Tuesday, 11:30 AM via Microsoft Teams.");

  // Step 4: IRC Scoring — Annexure 4 (6 criteria, 1-5 each)
  const [ircScores, setIrcScores] = useState({
    alignmentPriority: 0,
    feasibility: 0,
    businessValue: 0,
    innovation: 0,
    scalability: 0,
    riskDependency: 0,
  });
  const [ircRationale, setIrcRationale] = useState({
    alignmentPriority: "",
    feasibility: "",
    businessValue: "",
    innovation: "",
    scalability: "",
    riskDependency: "",
  });
  const [ircRecommendedFH, setIrcRecommendedFH] = useState("");
  const [ircImprovements, setIrcImprovements] = useState("");
  const [ircFlags, setIrcFlags] = useState("");
  const [ircComments, setIRCComments] = useState("");

  // Step 5: CPOC assign FH
  const [selectedFH, setSelectedFH] = useState("Dr. Alok Gupta");
  const [fhAssignmentComments, setFhAssignmentComments] = useState("Assigned for tactical water filtration system deployment trial.");

  // Step 6: FH Decision Fields (Annexure 7)
  const [fhProjectTitle, setFhProjectTitle] = useState(idea.fhProjectTitle || idea.title);
  const [fhDecisionChoice, setFhDecisionChoice] = useState<"" | "Accept" | "Reject">("" );
  const [declineReason, setDeclineReason] = useState("");
  const [teamRows, setTeamRows] = useState<{ name: string; email: string }[]>([{ name: "", email: "" }]);
  const [nominatedOwner, setNominatedOwner] = useState("");
  const [rewardConfirmed, setRewardConfirmed] = useState(false);

  // Step 7: Action Plan (Step 2 — Pilot Project spec)
  const [actionPlanTitle, setActionPlanTitle] = useState(idea.actionPlanTitle || idea.fhProjectTitle || idea.title);
  const [apKRA, setApKRA] = useState(idea.apKRA || "");
  const [apKPIName, setApKPIName] = useState(idea.apKPIName || "");
  const [apKPIBaseline, setApKPIBaseline] = useState(idea.apKPIBaseline || "");
  const [apKPITarget, setApKPITarget] = useState(idea.apKPITarget || "");
  const [apFinancialTranslation, setApFinancialTranslation] = useState(idea.apFinancialTranslation || "");
  const [apSuccessThreshold, setApSuccessThreshold] = useState<number>(idea.apSuccessThreshold ?? 80);
  const [apPartialThreshold, setApPartialThreshold] = useState<number>(idea.apPartialThreshold ?? 50);
  const [apQualitativeBenefits, setApQualitativeBenefits] = useState(idea.apQualitativeBenefits || "");
  const [apPrerequisites, setApPrerequisites] = useState(idea.apPrerequisites || "");
  const [apMilestoneRows, setApMilestoneRows] = useState<{ description: string; date: string }[]>(
    idea.apMilestones?.length === 3 ? idea.apMilestones : [{ description: "", date: "" }, { description: "", date: "" }, { description: "", date: "" }]
  );
  const [apRisks, setApRisks] = useState(idea.apRisks || "");
  const [apResources, setApResources] = useState(idea.apResources || "");
  const [actionPlanFileName, setActionPlanFileName] = useState("ActionPlan_Step2_Draft.pdf");

  // C-POC IRC Commissioning configurations
  const [useDefaultIRC, setUseDefaultIRC] = useState(idea.useDefaultIRCCouncil !== undefined ? idea.useDefaultIRCCouncil : true);
  const [customIRCEmails, setCustomIRCEmails] = useState(idea.ircCouncilAssignedEmails && idea.ircCouncilAssignedEmails.length > 0 ? idea.ircCouncilAssignedEmails.join(", ") : "advisor@ionexchange.com, advisor1@ionexchange.com");
  const [reviewerSearch, setReviewerSearch] = useState("");
  
  // Threshold: 17/25 (5 criteria × max 5, scaled to /25)
  const [scoresThreshold, setScoresThreshold] = useState(() => {
    if (idea.ircScoresThreshold !== undefined) {
      return idea.ircScoresThreshold;
    }
    return 17;
  });
  const [scoreMin, setScoreMin] = useState(idea.ircScoreMin || 1);
  const [scoreMax, setScoreMax] = useState(idea.ircScoreMax || 5);
  const [evaluationCycle, setEvaluationCycle] = useState(idea.ircEvaluationCycle || "Monthly Cycle");

  const [meetingDate, setMeetingDate] = useState(idea.meetingIrcProposerDate || new Date().toISOString().split('T')[0]);
  const [bypassedIRCMembers, setBypassedIRCMembers] = useState<string[]>(idea.bypassedIRCMembers || []);

  // Step 8: FH Action Plan Evaluation
  const [fhPlanRemarks, setFHPlanRemarks] = useState("");
  const [fhPlanChoice, setFhPlanChoice] = useState<"" | "Approve" | "Send-back" | "Reject">("");

  // Step 9: Project Lead Final Report (full spec — Sections A + B)
  const [rptPilotDescription, setRptPilotDescription] = useState(idea.rptPilotDescription || idea.finalReportObjectivesMet || "");
  const [rptActualKPI, setRptActualKPI] = useState(idea.rptActualKPI || "");
  const [rptMeasurementPeriod, setRptMeasurementPeriod] = useState(idea.rptMeasurementPeriod || "");
  const [rptPctTarget, setRptPctTarget] = useState<number>(idea.rptPctTargetAchieved ?? 0);
  const [rptActualFinancialImpact, setRptActualFinancialImpact] = useState(idea.rptActualFinancialImpact || "");
  const [rptCalcMethodology, setRptCalcMethodology] = useState(idea.rptCalculationMethodology || "");
  const [rptImpactTypes, setRptImpactTypes] = useState<string[]>(idea.rptImpactTypes || []);
  const [rptRecurringType, setRptRecurringType] = useState<"Annual recurring" | "One-time" | "Mix" | "">(idea.rptRecurringType || "");
  const [rptAssumptions, setRptAssumptions] = useState(idea.rptAssumptions || "");
  const [rptEvidenceSource, setRptEvidenceSource] = useState(idea.rptEvidenceSource || "");
  const [rptImplCost, setRptImplCost] = useState(idea.rptImplCost || "");
  const [rptOngoingCost, setRptOngoingCost] = useState(idea.rptOngoingCost || "");
  const [rptOverlapCheck, setRptOverlapCheck] = useState<"No overlap" | "Yes" | "">(idea.rptOverlapCheck || "");
  const [rptOverlapNote, setRptOverlapNote] = useState(idea.rptOverlapNote || "");
  const [rptIndirectBenefits, setRptIndirectBenefits] = useState(idea.rptIndirectBenefits || "");
  // kept for backward-compat (Finance step seeds from this)
  const [proposedSavings, setProposedSavings] = useState(1400000);

  // Step 10: FH Final Report Remarks + Decision
  const [fhReportRemarks, setFHReportRemarks] = useState("");
  const [fhReportChoice, setFhReportChoice] = useState<"" | "Approve" | "Send-back" | "Reject">("");

  // Step 11: Finance Evaluation Form
  const [finDecision, setFinDecision] = useState<"" | "Validate" | "Send-back" | "No quantifiable financial benefit">("");
  const [finCertifiedAmount, setFinCertifiedAmount] = useState<number>(idea.financeEvaluatedImpact ?? 0);
  const [finRewardSlab, setFinRewardSlab] = useState(idea.finRewardSlab || "");
  const [finAdjustmentNote, setFinAdjustmentNote] = useState(idea.finAdjustmentNote || "");
  const [finQualitativeNote, setFinQualitativeNote] = useState(idea.finQualitativeNote || "");
  const [finSBChecklist, setFinSBChecklist] = useState<string[]>([]);
  const [finExtraRemarks, setFinExtraRemarks] = useState("");

  // Map Functional Head Names to Emails for simulation
  const getFHEmail = (name: string) => {
    switch(name) {
      case "Dr. Alok Gupta": return "alok.gupta@ionexchange.com";
      case "Anil Sharma": return "anil.sharma@ionexchange.com";
      case "Sunita Roy": return "sunita.roy@ionexchange.com";
      case "Vikram Malhotra": return "vikram.m@ionexchange.com";
      case "Prakash Iyer": return "prakash.iyer@ionexchange.com";
      case "Meera Patel": return "meera.patel@ionexchange.com";
      default: return "functional.head@ionexchange.com";
    }
  };

  // call Gemini to do score counseling or draft evaluation feedback
  const handleConsultGeminiReviewer = async () => {
    setIsAiEvaluating(true);
    setAiEvalError("");
    try {
      const response = await fetch("/api/gemini/evaluate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: idea.title,
          problemStatement: idea.problemStatement,
          proposedSolution: idea.proposedSolution,
          expectedImpact: idea.expectedImpact,
          areaOfImpact: idea.areaOfImpact,
          stage: "CIRC" // Uses CIRC format
        })
      });

      if (!response.ok) throw new Error(`AI consultation failed with status ${response.status}`);
      const result = await response.json();

      if (result.scores) {
        const mapToRange = (val: number) => {
          if (val > 5) {
            return Math.min(5, Math.max(1, Math.round(val / 20)));
          }
          return Math.min(5, Math.max(1, val));
        };
        setIrcScores(prev => ({
          ...prev,
          innovation:        mapToRange(result.scores.novelty       || 80),
          feasibility:       mapToRange(result.scores.feasibility   || 75),
          businessValue:     mapToRange(result.scores.impactOrMarket || 80),
          scalability:       mapToRange(result.scores.scalability   || 80),
          alignmentPriority: mapToRange(result.scores.novelty       || 75),
          riskDependency:    mapToRange(result.scores.feasibility   || 70),
        }));
      }
      if (result.feedback) {
        setIRCComments(result.feedback);
      }
    } catch (err: any) {
      setAiEvalError(err.message || "Failed to contact Gemini evaluation service.");
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // 1. C-POC Quality Vetting Action (Annexure 2)
  const handleCPOCVetting = () => {
    const firstName = idea.employeeName.split(" ")[0];
    const sendBackAtLimit = idea.vettingSendBackCount >= 2;

    if (!vettingDecision) {
      alert("Please select a decision: Approve, Send-back, or Reject.");
      return;
    }

    // ── APPROVE ───────────────────────────────────────────────────────────────
    if (vettingDecision === "Approve") {
      const updated: Idea = {
        ...idea,
        status: IdeaStatus.ApprovedByCPOC,
        vettingComments: vettingComments || "Proposal clarity meets the bar for IRC evaluation.",
        vettingDate: new Date().toISOString(),
        cpocVettedBy: persona.name,
      };
      onUpdateIdea(updated);
      onAddNotification(
        idea.employeeEmail,
        `RIPPLE — Your idea has cleared vetting (${idea.id})`,
        `Hi ${firstName}, thank you for your idea submission (${idea.id} - ${idea.title}).\n\nWe are pleased to confirm that your submission has cleared the initial vetting stage and will now be reviewed by the Idea Review Committee (IRC).\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      setVettingDecision(""); setVettingComments("");
      alert("Idea approved — moving to IRC evaluation stage.");
      return;
    }

    // ── REJECT ────────────────────────────────────────────────────────────────
    if (vettingDecision === "Reject") {
      if (!rejectReason) {
        alert("Please select a reject reason.");
        return;
      }
      const rejectBody = rejectReason === "scope"
        ? `Hi ${firstName}, thank you for reaching out through Ripple. On review, this submission appears to be a grievance, query, or feedback rather than a process or workplace improvement idea, which is what Ripple is designed for. We'd encourage you to share this with your reporting manager or HR representative, and to continue using Ripple for improvement ideas going forward.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
        : `Hi ${firstName}, thank you for your continued engagement with this idea and for the additional details shared. After review, we feel the submission still needs more clarity and supporting information for the committee to evaluate it effectively. We'd encourage you to revisit this idea with more data or detail in a future submission.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`;

      const updated: Idea = {
        ...idea,
        status: IdeaStatus.VettingLimitExceeded,
        vettingComments: vettingComments || rejectReason,
        vettingDate: new Date().toISOString(),
        cpocVettedBy: persona.name,
      };
      onUpdateIdea(updated);
      onAddNotification(
        idea.employeeEmail,
        `RIPPLE — Update on your idea submission (${idea.id})`,
        rejectBody
      );
      setVettingDecision(""); setRejectReason(""); setVettingComments("");
      alert("Idea rejected and employee notified.");
      return;
    }

    // ── SEND-BACK ─────────────────────────────────────────────────────────────
    if (sendBackAtLimit) {
      alert("Send-back limit reached (2/2). Please Approve or Reject.");
      return;
    }
    const tickedKeys = (["B", "C", "D", "F"] as const).filter(k => sendBackSections[k]);
    if (tickedKeys.length === 0) {
      alert("Please tick at least one section that needs more detail before sending back.");
      return;
    }

    const sectionParagraphs: Record<string, string> = {
      B: "We'd like to understand the problem area a little better. Could you add more detail on what the opportunity is?",
      C: "Your proposed idea would benefit from a bit more detail — particularly on what would change (before vs after).",
      D: "For the proposed idea we would like you to provide more details on the possible risks associated with the implementation.",
      F: "We noticed an estimated financial impact was shared, but the basis for this figure was not included. Could you share a brief calculation or assumption behind this number?",
    };
    const bodyParagraphs = tickedKeys.map(s => sectionParagraphs[s]).join("\n\n");
    const mailBody = `Hi ${firstName}, thank you for your idea submission (${idea.id} - ${idea.title}). Before this can move to the Idea Review Committee, we need a little more information:\n\n${bodyParagraphs}\n\nPlease update your submission on the Ripple platform at your earliest convenience. If you have any questions, feel free to reach out to the Ripple team.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`;

    const newCount = idea.vettingSendBackCount + 1;
    const updated: Idea = {
      ...idea,
      vettingSendBackCount: newCount,
      vettingComments: vettingComments || tickedKeys.map(s => `Section ${s} needs more detail`).join("; "),
      status: IdeaStatus.ReturnedToEmployee,
    };
    onUpdateIdea(updated);
    onAddNotification(
      idea.employeeEmail,
      `RIPPLE — Additional information requested for your idea (${idea.id})`,
      mailBody
    );
    setSendBackSections({ B: false, C: false, D: false, F: false });
    setVettingDecision(""); setVettingComments("");
    alert(`Send-back recorded (${newCount}/2). Employee notified via auto-mail.`);
  };

  // 2. Employee Resubmission
  const handleEmployeeResubmit = () => {
    if (!resubTitle || !resubProblem || !resubSolution) {
      alert("Please fill in all mandatory fields before resubmitting.");
      return;
    }

    const updated: Idea = {
      ...idea,
      title: resubTitle,
      problemStatement: resubProblem,
      proposedSolution: resubSolution,
      expectedImpact: resubImpact,
      status: IdeaStatus.Submitted,
      submissionDate: new Date().toISOString()
    };

    onUpdateIdea(updated);

    onAddNotification(
      "c-poc@ionexchange.com",
      `System Update: Employee Resubmitted Idea ${idea.id}`,
      `Dear C-POC,\n\nAssociate ${idea.employeeName} has updated and resubmitted idea ${idea.id} for professional vetting. Please review on the waiting tab.`
    );

    alert("Your revised proposal has been submitted successfully to C-POC.");
  };

  // 3. C-POC Schedule Presentation
  const handlePublishMeeting = () => {
    if (!meetingDetails) {
      alert("Please provide the connection schedule details.");
      return;
    }

    const assignedEmails = useDefaultIRC
      ? ["advisor@ionexchange.com", "advisor1@ionexchange.com"]
      : customIRCEmails.split(",").map(e => e.trim()).filter(e => e.includes("@"));

    if (assignedEmails.length === 0) {
      alert("Please specify at least one valid IRC committee email address.");
      return;
    }

    const updated: Idea = {
      ...idea,
      proposerIrcMeetingDetails: meetingDetails,
      ircCouncilAssignedEmails: assignedEmails,
      ircScoresThreshold: scoresThreshold,
      ircScoreMin: scoreMin,
      ircScoreMax: scoreMax,
      ircEvaluationCycle: evaluationCycle,
      useDefaultIRCCouncil: useDefaultIRC,
      meetingIrcProposerDate: meetingDate,
      status: IdeaStatus.UnderIRCEvaluation
    };

    onUpdateIdea(updated);

    // Notifications
    onAddNotification(
      idea.employeeEmail,
      `Microsoft Teams Pitch Invitation Issued - ${idea.id}`,
      `Dear ${idea.employeeName},\n\nYour RIPPLE incu-meeting connection details are published:\n\nSchedule Date: ${meetingDate}\n${meetingDetails}\n\nPlease prepare your 5-slide PDF presentation pitch deck.`
    );

    // Notify all assigned IRC members as well!
    assignedEmails.forEach(email => {
      onAddNotification(
        email,
        `New Jury Review Assigned - Pitch Session Scheduled: ${idea.id}`,
        `Dear Advisor,\n\nYou are appointed to the evaluation committee for proposal "${idea.title}".\n\nSchedule Date: ${meetingDate}\nDetails: ${meetingDetails}\n\nPlease attend the presentation and evaluate the candidate in the Task Center.`
      );
    });

    alert("Teams session details published. IRC scoring portal is now unlocked and notifications dispatched to committee advisors!");
  };

  // 4. IRC Scoring Action (Annexure 4 — 6 criteria)
  const handleIRCScoring = () => {
    const { alignmentPriority, feasibility, businessValue, innovation, scalability, riskDependency } = ircScores;
    const allScored = [alignmentPriority, feasibility, businessValue, innovation, scalability, riskDependency].every(s => s >= 1);
    if (!allScored) {
      alert("Please score all 6 evaluation criteria (1–5) before submitting.");
      return;
    }
    if (!ircRecommendedFH) {
      alert("Please select a Recommended Functional Head (Block 1 — mandatory).");
      return;
    }

    // Score scaled to /25 (6 criteria × max 5 = 30, normalised: × 25/30)
    const aggregate = parseFloat(((alignmentPriority + feasibility + businessValue + innovation + scalability + riskDependency) * 25 / 30).toFixed(2));

    const newReview: IRCReview = {
      reviewerName:  persona.name,
      reviewerEmail: persona.email,
      scores: { alignmentPriority, feasibility, businessValue, innovation, scalability, riskDependency },
      rationale: { ...ircRationale },
      recommendedFH: ircRecommendedFH,
      improvementSuggestions: ircImprovements,
      implementationFlags:    ircFlags,
      aggregateScore: aggregate,
      comments: ircComments || "Evaluation submitted.",
      dateSubmitted: new Date().toISOString(),
    };

    const filteredReviews = (idea.ircReviews || []).filter(r => r.reviewerEmail !== persona.email);
    const updated: Idea = { ...idea, ircReviews: [...filteredReviews, newReview] };
    onUpdateIdea(updated);

    onAddNotification(
      "c-poc@ionexchange.com",
      `Jury Scorecard Logged: ${idea.id} by ${persona.name}`,
      `Dear C-POC,\n\nAdvisor ${persona.name} has submitted their Annexure 4 evaluation for idea ${idea.id}.\n\nScore: ${aggregate.toFixed(2)}/25\nRecommended FH: ${ircRecommendedFH}`
    );
    alert(`Score of ${aggregate.toFixed(2)}/25 locked. Recommended FH: ${ircRecommendedFH}`);
  };

  // 5. C-POC Input Functional Head Details
  const handleCPOCAssignFH = () => {
    if (!selectedFH) {
      alert("Please select a Functional Head.");
      return;
    }

    const fhEmail = getFHEmail(selectedFH);

    const updated: Idea = {
      ...idea,
      assignedFHName: selectedFH,
      assignedFHEmail: fhEmail,
      fhAssignmentComments: fhAssignmentComments,
      status: IdeaStatus.WithFunctionalHead
    };

    onUpdateIdea(updated);

    onAddNotification(
      fhEmail,
      `Task Pending: Incubation Project Assignment Review Required - ${idea.id}`,
      `Dear ${selectedFH},\n\nUnder RIPPLE governance, the project "${idea.title}" has cleared IRC evaluation and is assigned to your business division.\n\nPlease log in to review technical parameters, confirm team allocations, and nominate a Project Lead/Plan Owner.`
    );

    alert(`Handoff logged! Transitioned to: ${IdeaStatus.WithFunctionalHead}`);
  };

  // 6. FH Decision Action (Annexure 7)
  const handleFHSubmit = () => {
    if (!fhDecisionChoice) {
      alert("Please select a decision: Accept or Reject.");
      return;
    }

    // ── REJECT ───────────────────────────────────────────────────────────────────────────
    if (fhDecisionChoice === "Reject") {
      if (!declineReason.trim()) {
        alert("Please provide a reason for not proceeding (mandatory on Reject).");
        return;
      }
      const updated: Idea = {
        ...idea,
        fhDecision: 'Decline',
        fhDeclineFeedback: declineReason,
        status: IdeaStatus.DeclinedByFH,
        fhDecisionDate: new Date().toISOString(),
      };
      onUpdateIdea(updated);

      // 1 — Internal record to C-POC
      onAddNotification(
        "c-poc@ionexchange.com",
        `[Annexure 7] FH Reject — Implementation path discontinued for ${idea.id}`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} has decided not to take forward the implementation of idea "${idea.title}" (${idea.id}).\n\nInternal reason on record: "${declineReason}"\n\nStatus: Closed — Declined by Functional Head.\nNote: The employee’s IRC selection recognition and rewards (Certificate of Idea Selection + Rs. 2,000 voucher) remain fully intact and unaffected.`
      );

      // 2 — Loop-closure mail to Idea Owner (neutral, dignity-preserving per spec Block 9)
      const firstName = (idea.employeeName || "").split(" ")[0];
      onAddNotification(
        idea.employeeEmail,
        `[Annexure 7] An update on your Ripple idea ${idea.id}`,
        `Hi ${firstName},\n\nWe wanted to share a brief update on your idea "${idea.title}" (${idea.id}).\n\nYour idea was reviewed and selected by the Idea Review Committee — that recognition stands, and your Certificate of Idea Selection and associated reward remain fully intact.\n\nAfter the IRC selection stage, Ripple routes ideas to the relevant Functional Head for an assessment of implementation feasibility. On this occasion, the implementation path for your idea could not be taken forward at this time, due to factors such as current priorities, resourcing, or existing initiatives in the area.\n\nThis is not a reflection of the quality or merit of your idea. We encourage you to continue engaging with Ripple and bring forward new ideas or a refined version in a future cycle.\n\nThank you for your continued contribution to Ion Exchange.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );

      alert(`Decision recorded. C-POC notified with internal reason. Loop-closure mail sent to ${idea.employeeName}.`);
      return;
    }

    // ── ACCEPT ───────────────────────────────────────────────────────────────────────────
    const validTeam = teamRows.filter(r => r.name.trim() && r.email.trim());
    if (validTeam.length === 0) {
      alert("Please add at least one implementation team member (Name + Email).");
      return;
    }
    if (!nominatedOwner) {
      alert("Please nominate a Plan Owner from the team.");
      return;
    }
    if (!rewardConfirmed) {
      alert("Please confirm the team reward eligibility checkbox before submitting.");
      return;
    }

    const ownerRow = validTeam.find(r => r.name === nominatedOwner);
    const ownerEmail = ownerRow?.email || idea.assignedFHEmail || "plan.owner@ionexchange.com";
    const updated: Idea = {
      ...idea,
      fhDecision: 'Accept',
      fhProjectTitle: fhProjectTitle || idea.title,
      projectLeadName: nominatedOwner,
      projectLeadEmail: ownerEmail,
      allocatedTeamMembers: validTeam.map(r => r.name),
      status: IdeaStatus.AwaitingActionPlan,
      fhDecisionDate: new Date().toISOString(),
    };
    onUpdateIdea(updated);

    // 1 — Notify C-POC: Step 1 complete, Step 2 initiated
    onAddNotification(
      "c-poc@ionexchange.com",
      `[Annexure 7] Step 1 Complete — Action Plan Initiated for ${idea.id}`,
      `Dear C-POC,\n\nFunctional Head ${persona.name} has accepted idea "${idea.title}" (${idea.id}) for implementation.\n\nProject Title: ${fhProjectTitle || idea.title}\nNominated Plan Owner: ${nominatedOwner} (${ownerEmail})\nTeam: ${validTeam.map(r => r.name).join(", ")}\n\nStep 2 (Action Plan) has been initiated. The Plan Owner has been notified. Expected submission: within 3 working days.`
    );

    // 2 — Notify Nominated Plan Owner: Step 2 task assigned
    onAddNotification(
      ownerEmail,
      `[Annexure 7] Action Required — Submit Action Plan (Step 2) for ${idea.id}`,
      `Dear ${nominatedOwner},\n\nFunctional Head ${persona.name} has nominated you as the Plan Owner for project "${fhProjectTitle || idea.title}" (${idea.id}).\n\nYour task: Please log in to RIPPLE and submit the Step 2 Action Plan within 3 working days.\n\nThe Action Plan should cover: project objectives, phased milestones, team allocation, and estimated budget.\n\nFor questions, contact your Functional Head or the Ripple C-POC team.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
    );

    alert(`Step 1 complete! ${nominatedOwner} notified as Plan Owner. C-POC informed. Status: Awaiting Action Plan.`);
  };

  // 7. Project Lead submits action plan
  // 7. Plan Owner submits Action Plan (Step 2 — Pilot Project spec)
  const handleActionPlanSubmission = () => {
    if (!apKRA.trim()) { alert("Please fill in the KRA (what this pilot will improve)."); return; }
    if (!apKPIName.trim()) { alert("Please provide the Primary KPI metric name."); return; }
    if (!apKPIBaseline.trim()) { alert("Please provide the current KPI baseline."); return; }
    if (!apKPITarget.trim()) { alert("Please provide the KPI target."); return; }
    if (!apFinancialTranslation.trim()) { alert("Please provide the financial translation."); return; }
    if (!apPrerequisites.trim()) { alert("Please fill in what needs to be true for this to work."); return; }
    if (apMilestoneRows.some(m => !m.description.trim() || !m.date)) { alert("Please complete all 3 milestone rows (description + date)."); return; }
    if (!apResources.trim()) { alert("Please describe the resources committed."); return; }

    const updated: Idea = {
      ...idea,
      actionPlanTitle,
      actionPlanObjectives: apKRA,
      actionPlanMilestones: apMilestoneRows.map((m, i) => `(${i + 1}) ${m.description} — by ${m.date}`).join('\n'),
      actionPlanDocumentName: actionPlanFileName,
      apKRA, apKPIName, apKPIBaseline, apKPITarget, apFinancialTranslation,
      apSuccessThreshold, apPartialThreshold, apQualitativeBenefits,
      apPrerequisites, apMilestones: apMilestoneRows, apRisks, apResources,
      status: IdeaStatus.ActionPlanSubmitted,
    };
    onUpdateIdea(updated);

    onAddNotification(
      idea.assignedFHEmail || "functional.head@ionexchange.com",
      `[Step 2] Action Plan Submitted for Review — ${idea.id}`,
      `Dear ${idea.assignedFHName || 'Functional Head'},\n\nPlan Owner ${idea.projectLeadName} has submitted the Step 2 Action Plan for "${actionPlanTitle}" (${idea.id}).\n\nKRA: ${apKRA}\nPrimary KPI: ${apKPIName} | Baseline: ${apKPIBaseline} → Target: ${apKPITarget}\nSuccess Threshold: ≥${apSuccessThreshold}%\n\nPlease review and approve / send-back / reject in the Task Center.`
    );
    const isResubmit = idea.status === IdeaStatus.ActionPlanRevision;
    onAddNotification(
      "c-poc@ionexchange.com",
      isResubmit
        ? `[Step 2 Resubmit] Revised Action Plan Submitted — Pending FH Approval (${idea.id})`
        : `[Step 2] Action Plan Submitted — Pending FH Approval (${idea.id})`,
      isResubmit
        ? `Dear C-POC,\n\nPlan Owner ${idea.projectLeadName} has resubmitted the revised Step 2 Action Plan for "${actionPlanTitle}" (${idea.id}) following Functional Head send-back.\n\nStatus: Awaiting Functional Head (${idea.assignedFHName || 'FH'}) final decision (Approve or Reject). If no response within 3 working days, please follow up manually.`
        : `Dear C-POC,\n\nPlan Owner ${idea.projectLeadName} has submitted the Step 2 Action Plan for "${actionPlanTitle}" (${idea.id}).\n\nStatus: Awaiting Functional Head (${idea.assignedFHName || 'FH'}) approval. If no response within 3 working days, please follow up manually.`
    );
    alert(isResubmit ? "Revised Action Plan resubmitted to Functional Head. C-POC notified." : "Action Plan submitted to Functional Head for review. C-POC notified.");
  };

  // 8. FH Action Plan Review (Step 2 FH Approval)
  const handleActionPlanReview = (decision: 'Approve' | 'Send-back' | 'Reject') => {
    const sendBackCount = idea.apSendBackCount || 0;
    if (decision === 'Send-back') {
      if (sendBackCount >= 1) { alert("Send-back limit reached (1/1). Please Approve or Reject."); return; }
      if (!fhPlanRemarks.trim()) { alert("Please provide revision feedback before sending back."); return; }
    }
    if (decision === 'Reject' && !fhPlanRemarks.trim()) { alert("Please provide a reject reason."); return; }

    const nextStatus = decision === 'Approve' ? IdeaStatus.ActionPlanApproved
      : decision === 'Send-back' ? IdeaStatus.ActionPlanRevision
      : IdeaStatus.ActionPlanRejected;

    const updated: Idea = {
      ...idea,
      fhPlanDecision: decision,
      fhPlanRejectReason: fhPlanRemarks,
      apSendBackCount: decision === 'Send-back' ? sendBackCount + 1 : sendBackCount,
      status: nextStatus,
    };
    onUpdateIdea(updated);

    if (decision === 'Approve') {
      onAddNotification(
        idea.projectLeadEmail || idea.employeeEmail,
        `[Step 2 Approved] Action Plan Locked — Implementation Starts Now (${idea.id})`,
        `Dear ${idea.projectLeadName},\n\nYour Action Plan for "${idea.actionPlanTitle || idea.title}" (${idea.id}) has been approved by Functional Head ${persona.name}.\n\nThe plan is now locked and forms the baseline for:\n• Monthly milestone tracking\n• Final project report\n\nImplementation has formally started.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      if (idea.employeeEmail !== idea.projectLeadEmail) {
        onAddNotification(
          idea.employeeEmail,
          `[Step 2 Approved] Your project pilot has officially started — ${idea.id}`,
          `Dear ${idea.employeeName},\n\nThe Action Plan for your idea "${idea.title}" (${idea.id}) has been approved and implementation has formally started.\n\nYour Plan Owner (${idea.projectLeadName}) is leading the pilot. You will receive updates on milestones and completion.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
        );
      }
      onAddNotification(
        "c-poc@ionexchange.com",
        `[Step 2 Approved] Action Plan Locked — Pilot Active (${idea.id})`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} has approved the Action Plan for "${idea.actionPlanTitle || idea.title}" (${idea.id}). Implementation has formally started. This idea is now tracked under monthly milestone tracking.`
      );
      onAddNotification(
        idea.assignedFHEmail || persona.email,
        `[Step 2 Approved] Action Plan Locked — ${idea.id}`,
        `Dear ${idea.assignedFHName || persona.name},\n\nYour approval of the Action Plan for "${idea.actionPlanTitle || idea.title}" (${idea.id}) has been recorded.\n\nThe plan is now locked and forms the baseline for:\n• Monthly milestone tracking (Block 8b)\n• Final project report (Block 8c)\n\nImplementation has formally started under Plan Owner ${idea.projectLeadName}.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      alert(`Action Plan approved and locked! Implementation has formally started. All stakeholders notified.`);
    } else if (decision === 'Send-back') {
      onAddNotification(
        idea.projectLeadEmail || idea.employeeEmail,
        `[Step 2 Send-back] Action Plan Revision Required (${idea.id})`,
        `Dear ${idea.projectLeadName},\n\nFunctional Head ${persona.name} has sent back the Action Plan for revision.\n\nFeedback: "${fhPlanRemarks}"\n\nPlease revise and resubmit. Note: This is the final revision round — the next decision will be Approve or Reject only.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      onAddNotification(
        "c-poc@ionexchange.com",
        `[Step 2 Send-back] FH Sent Back Action Plan (${idea.id})`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} sent back the Action Plan for ${idea.id}. Plan Owner ${idea.projectLeadName} has been notified.\n\nFeedback: "${fhPlanRemarks}"`
      );
      alert(`Send-back recorded. ${idea.projectLeadName} notified with feedback.`);
    } else {
      const firstName = (idea.employeeName || "").split(" ")[0];
      onAddNotification(
        "c-poc@ionexchange.com",
        `[Step 2 Reject] FH Rejected Action Plan — Idea Closed (${idea.id})`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} has rejected the Action Plan for ${idea.id}.\n\nReason: "${fhPlanRemarks}"\n\nStatus: Closed — Action Plan Rejected. Loop-closure mail sent to Idea Owner.`
      );
      onAddNotification(
        idea.employeeEmail,
        `An update on your Ripple project ${idea.id}`,
        `Hi ${firstName},\n\nWe wanted to share an update regarding your idea "${idea.title}" (${idea.id}).\n\nYour idea was selected by the IRC and entered the implementation phase. After review of the project plan, the Functional Head has determined that implementation cannot proceed at this stage.\n\nYour IRC selection recognition (Certificate of Idea Selection + Rs. 2,000 voucher) remains fully intact.\n\nWe encourage you to continue contributing through Ripple.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      alert(`Action Plan rejected. ${idea.employeeName} notified. Idea closed.`);
    }
  };

  // 9. Project Lead report submission
  const handleReportSubmission = () => {
    // Section A validation
    if (!rptPilotDescription.trim()) { alert("Section A: Please describe what was done in the pilot."); return; }
    if (!rptActualKPI.trim()) { alert("Section A: Please provide the actual KPI achieved."); return; }
    if (!rptMeasurementPeriod.trim()) { alert("Section A: Please state the time period measured and annualization basis."); return; }
    // Section B validation
    if (!rptActualFinancialImpact.trim()) { alert("Section B: Please state the actual financial impact (₹)."); return; }
    if (!rptCalcMethodology.trim()) { alert("Section B: Calculation methodology is mandatory — show the step-by-step calculation."); return; }
    if (rptImpactTypes.length === 0) { alert("Section B: Please select at least one type of impact."); return; }
    if (!rptRecurringType) { alert("Section B: Please specify whether the impact is annual recurring, one-time, or a mix."); return; }
    if (!rptAssumptions.trim()) { alert("Section B: Please list the key assumptions used in the calculation."); return; }
    if (!rptEvidenceSource.trim()) { alert("Section B: Please state the evidence / data source for the actuals."); return; }
    if (!rptImplCost.trim()) { alert("Section B: Please enter the one-time implementation cost (or '0' / 'None')."); return; }
    if (!rptOngoingCost.trim()) { alert("Section B: Please enter ongoing / recurring costs (or '0' / 'None')."); return; }
    if (!rptOverlapCheck) { alert("Section B: Please confirm whether any financial impact is already counted elsewhere."); return; }
    if (rptOverlapCheck === "Yes" && !rptOverlapNote.trim()) { alert("Section B: Please explain the overlap and how double-counting is avoided."); return; }

    const updated: Idea = {
      ...idea,
      finalReportObjectivesMet: rptPilotDescription,
      finalReportSubmissionDate: new Date().toISOString(),
      rptPilotDescription, rptActualKPI, rptMeasurementPeriod,
      rptPctTargetAchieved: rptPctTarget,
      rptActualFinancialImpact, rptCalculationMethodology: rptCalcMethodology,
      rptImpactTypes, rptRecurringType: rptRecurringType || undefined,
      rptAssumptions, rptEvidenceSource,
      rptImplCost, rptOngoingCost,
      rptOverlapCheck: rptOverlapCheck || undefined, rptOverlapNote, rptIndirectBenefits,
      status: IdeaStatus.ReportSubmitted,
    };
    onUpdateIdea(updated);

    onAddNotification(
      idea.assignedFHEmail || "functional.head@ionexchange.com",
      `[Project Report] Submitted for Approval — ${idea.id}`,
      `Dear ${idea.assignedFHName || 'Functional Head'},\n\nPlan Owner ${idea.projectLeadName} has submitted the Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}).\n\nSection A — Actual KPI: ${rptActualKPI}\n% of target achieved: ${rptPctTarget}%\n\nSection B — Financial Impact: ${rptActualFinancialImpact}\nImpact type(s): ${rptImpactTypes.join(', ')} · ${rptRecurringType}\n\nPlease review and Approve / Send-back / Reject in the Task Center.`
    );
    onAddNotification(
      "coe@ionexchange.com",
      `[Project Report] Submitted — Pending FH Approval (${idea.id})`,
      `Dear C-POC,\n\nPlan Owner ${idea.projectLeadName} has submitted the Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}).\n\nStatus: Awaiting Functional Head (${idea.assignedFHName || 'FH'}) approval.\nPilot outcome: ${rptPctTarget}% of KPI target achieved. Financial impact: ${rptActualFinancialImpact}.`
    );
    alert("Project Report submitted to Functional Head for review. C-POC notified.");
  };

  // 10. FH Final Report Action
  const handleFHReportReview = (decision: 'Approve' | 'Send-back' | 'Reject') => {
    const sendBackCount = idea.rptSendBackCount || 0;
    if (decision === 'Send-back') {
      if (sendBackCount >= 1) { alert("Send-back limit reached (1/1). Please Approve or Reject."); return; }
      if (!fhReportRemarks.trim()) { alert("Please provide revision feedback before sending back."); return; }
    }
    if (decision === 'Reject' && !fhReportRemarks.trim()) { alert("Please provide a reject reason."); return; }

    const nextStatus = decision === 'Approve' ? IdeaStatus.PendingFinanceEvaluation
      : decision === 'Send-back' ? IdeaStatus.ReportRevision
      : IdeaStatus.ReportRejected;

    const updated: Idea = {
      ...idea,
      fhReportDecision: decision,
      fhReportRemarks,
      rptSendBackCount: decision === 'Send-back' ? sendBackCount + 1 : sendBackCount,
      status: nextStatus,
    };
    onUpdateIdea(updated);

    if (decision === 'Approve') {
      onAddNotification(
        idea.projectLeadEmail || idea.employeeEmail,
        `[Project Report Approved] Routed to Finance — ${idea.id}`,
        `Dear ${idea.projectLeadName},\n\nFunctional Head ${persona.name} has approved your Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}).\n\nThe report is now locked and routed to the Finance team for financial impact vetting (Block 12).\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      if (idea.employeeEmail !== idea.projectLeadEmail) {
        onAddNotification(
          idea.employeeEmail,
          `[Project Report Approved] Finance evaluation now pending — ${idea.id}`,
          `Dear ${idea.employeeName},\n\nThe Project Report for your idea "${idea.title}" (${idea.id}) has been approved by the Functional Head and routed to Finance for evaluation.\n\nYou will be notified once Finance completes their review.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
        );
      }
      onAddNotification(
        "coe@ionexchange.com",
        `[Project Report Approved] Routed to Finance — ${idea.id}`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} has approved the Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}). Status moved to Pending Finance Evaluation.`
      );
      onAddNotification(
        idea.assignedFHEmail || persona.email,
        `[Project Report Approved] Approval recorded — ${idea.id}`,
        `Dear ${idea.assignedFHName || persona.name},\n\nYour approval of the Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}) is confirmed. The report is now with the Finance team for impact vetting.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      onAddNotification(
        "finance@ionexchange.com",
        `[Block 12] Project Report for Finance Vetting — ${idea.id}`,
        `Dear Finance Team,\n\nProject Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}) is approved and ready for financial impact vetting.\n\nPlan Owner: ${idea.projectLeadName}\nActual Financial Impact Claimed: ${idea.rptActualFinancialImpact || '—'}\nCalculation: ${idea.rptCalculationMethodology || '—'}\nImpact Types: ${(idea.rptImpactTypes || []).join(', ') || '—'}\nRecurring: ${idea.rptRecurringType || '—'}\n\nPlease review, validate assumptions, and certify the net annual savings.`
      );
      alert("Project Report approved! Routed to Finance. All stakeholders notified.");
    } else if (decision === 'Send-back') {
      onAddNotification(
        idea.projectLeadEmail || idea.employeeEmail,
        `[Project Report Send-back] Revision Required — ${idea.id}`,
        `Dear ${idea.projectLeadName},\n\nFunctional Head ${persona.name} has sent back the Project Report for revision.\n\nFeedback: "${fhReportRemarks}"\n\nPlease revise the relevant sections and resubmit. Note: This is the final revision round — the next FH decision will be Approve or Reject only.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      onAddNotification(
        "coe@ionexchange.com",
        `[Project Report Send-back] Revision Requested — ${idea.id}`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} sent back the Project Report for ${idea.id}. Plan Owner ${idea.projectLeadName} has been notified.\n\nFeedback: "${fhReportRemarks}"`
      );
      alert(`Send-back recorded. ${idea.projectLeadName} notified with feedback.`);
    } else {
      const firstName = (idea.employeeName || "").split(" ")[0];
      onAddNotification(
        "coe@ionexchange.com",
        `[Project Report Rejected] Report Closed — ${idea.id}`,
        `Dear C-POC,\n\nFunctional Head ${persona.name} has rejected the Project Report for ${idea.id}.\n\nReason: "${fhReportRemarks}"\n\nStatus: Closed — Project Report Rejected. The pilot did not deliver reportable outcomes. Reward will not be processed. Loop-closure mail sent to Idea Owner.`
      );
      onAddNotification(
        idea.employeeEmail,
        `An update on your Ripple project ${idea.id}`,
        `Hi ${firstName},\n\nWe wanted to share a final update regarding your idea "${idea.title}" (${idea.id}).\n\nYour idea was selected by the IRC and a pilot was run. After review of the project completion report, the Functional Head has determined that the pilot outcomes do not meet the threshold for financial impact recognition at this stage.\n\nYour IRC selection recognition (Certificate of Idea Selection + Rs. 2,000 voucher) remains fully intact.\n\nThank you for your innovation contribution. We encourage you to continue contributing through Ripple.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      alert(`Project Report rejected. ${idea.employeeName} notified. Idea closed.`);
    }
  };

  const FINANCE_SB_FEEDBACK: Record<string, string> = {
    "Calculation methodology unclear / not reproducible": "We were unable to fully follow the calculation behind the claimed financial impact. Could you lay out the steps clearly — which actuals, which rates/multipliers, and over what period — so the figure can be reproduced?",
    "Assumptions not justified or unrealistic": "Some of the assumptions used (rates, headcount, or volumes) need to be revisited as they don't align with current Finance figures. Could you review and revise these, or share the basis for the values used?",
    "Evidence / data source insufficient": "The financial claim needs stronger supporting evidence. Could you share the underlying data source (system reports, payroll data, invoices, time study, etc.) that the actuals are drawn from?",
    "Costs not fully accounted (gross vs net)": "The net impact needs to account for all associated costs. Could you confirm/add any one-time or ongoing costs (license, maintenance, training, vendor support) so we can arrive at the net figure?",
    "Annualization basis unclear": "The basis for annualizing the figure isn't clear to us. Could you state the measurement period and how the annual number was derived from it?",
    "Freed-up-time benefit not substantiated": "Where the impact comes from time/effort saved, we need to understand whether this translates into an actual cost reduction. Could you clarify what happens to the freed-up time (headcount/overtime/vendor reduction vs absorbed into workload)?",
    "Possible overlap with another initiative": "Part of this impact may already be captured under another initiative or savings target. Could you confirm there is no double-counting, or clarify how this impact is incremental?",
  };

  // 11. Finance impact evaluation
  const handleFinanceEvaluation = (decision: 'Validate' | 'Send-back' | 'No quantifiable financial benefit') => {
    const sendBackCount = idea.financeSendBackCount || 0;

    if (decision === 'Send-back') {
      if (sendBackCount >= 2) { alert("Send-back limit reached (2/2). Please Validate or mark No quantifiable financial benefit."); return; }
      if (finSBChecklist.length === 0) { alert("Please tick at least one item from the send-back checklist."); return; }
      if (!finQualitativeNote.trim()) { alert("Overall qualitative note is mandatory for all decisions."); return; }

      const compiledFeedback = finSBChecklist
        .map(item => `• ${item}\n  ${FINANCE_SB_FEEDBACK[item] || ''}`)
        .join('\n\n')
        + (finExtraRemarks.trim() ? `\n\nAdditional remarks: ${finExtraRemarks}` : '');

      const newCount = sendBackCount + 1;
      const updated: Idea = {
        ...idea,
        financeSendBackCount: newCount,
        financeFeedback: compiledFeedback,
        financeDecision: 'Send-back',
        finSendBackChecklist: finSBChecklist,
        finQualitativeNote,
        status: IdeaStatus.FinanceRevision,
      };
      onUpdateIdea(updated);

      const roundNote = newCount >= 2
        ? `\n\n⚠️ This is the final revision round (${newCount}/2). On your next submission, Finance will Validate or mark No quantifiable financial benefit — no further send-backs.`
        : `\n\nYou have ${2 - newCount} revision round(s) remaining.`;

      onAddNotification(
        idea.projectLeadEmail || idea.employeeEmail,
        `[Finance Send-back ${newCount}/2] Financial Impact Revision Required — ${idea.id}`,
        `Dear ${idea.projectLeadName},\n\nFinance has reviewed the financial impact section of the Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}) and has flagged the following for revision:\n\n${compiledFeedback}${roundNote}\n\nPlease revise the relevant financial fields and resubmit from the Task Center.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      onAddNotification(
        "coe@ionexchange.com",
        `[Finance Send-back ${newCount}/2] Revision Requested — ${idea.id}`,
        `Dear C-POC,\n\nFinance sent back the financial impact section for ${idea.id} (round ${newCount}/2).\n\nPlan Owner ${idea.projectLeadName} has been notified.\nChecklist items flagged: ${finSBChecklist.join(', ')}`
      );
      alert(`Send-back ${newCount}/2 recorded. ${idea.projectLeadName} notified with compiled feedback.`);
      return;
    }

    if (decision === 'No quantifiable financial benefit') {
      if (!finQualitativeNote.trim()) { alert("Overall qualitative note is mandatory."); return; }
      const updated: Idea = {
        ...idea,
        financeDecision: 'No quantifiable financial benefit',
        finQualitativeNote,
        status: IdeaStatus.NoQuantifiableFinancialBenefit,
      };
      onUpdateIdea(updated);

      const firstName = (idea.employeeName || "").split(" ")[0];
      onAddNotification(
        "coe@ionexchange.com",
        `[Finance] No Quantifiable Financial Benefit — ${idea.id}`,
        `Dear C-POC,\n\nFinance has reviewed the Project Report for "${idea.fhProjectTitle || idea.title}" (${idea.id}) and determined that there is no defensible annualized ₹ impact to certify at this stage.\n\nFinance rationale: "${finQualitativeNote}"\n\nNote: The selection-stage recognition (₹2,000 voucher + Certificate of Idea Selection) from Block 6 remains intact. No financial-slab reward will be processed.`
      );
      onAddNotification(
        idea.assignedFHEmail || "functional.head@ionexchange.com",
        `[Finance Review] No Quantifiable Financial Benefit — ${idea.id}`,
        `Dear ${idea.assignedFHName || 'Functional Head'},\n\nFinance has completed the financial impact review for "${idea.fhProjectTitle || idea.title}" (${idea.id}) and has determined there is no defensible net annualized ₹ figure to certify.\n\nFinance rationale: "${finQualitativeNote}"\n\nThe IRC selection recognition for the Idea Owner remains intact. No financial-slab reward will be triggered.`
      );
      onAddNotification(
        idea.employeeEmail,
        `An update on your Ripple project ${idea.id}`,
        `Hi ${firstName},\n\nWe wanted to share a final update on your idea "${idea.title}" (${idea.id}).\n\nYour idea was selected by the IRC and a pilot was successfully completed. After Finance's review of the project report, the financial impact from the pilot could not be quantified to a defensible annualized ₹ figure at this stage — this does not diminish the value of what was achieved.\n\nYour recognition from the idea-selection stage (Certificate of Idea Selection + Rs. 2,000 voucher) is fully intact and was processed at Block 6.\n\nThank you for your contribution to Ripple. We encourage you to continue innovating.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
      );
      alert("Marked as No Quantifiable Financial Benefit. All stakeholders notified. Selection-stage recognition remains intact.");
      return;
    }

    // Validate
    if (!finCertifiedAmount || finCertifiedAmount <= 0) { alert("Please enter the validated net annualized ₹ impact (must be > 0)."); return; }
    if (!finQualitativeNote.trim()) { alert("Overall qualitative note is mandatory."); return; }

    const proposerReward = Math.round(finCertifiedAmount * 0.25);
    const teamCount = idea.allocatedTeamMembers.length > 0 ? idea.allocatedTeamMembers.length : 1;
    const teamRewardPerMember = Math.round((finCertifiedAmount * 0.75) / teamCount);

    const updated: Idea = {
      ...idea,
      financeDecision: 'Validate',
      finCertifiedAmount,
      finRewardSlab: finRewardSlab || undefined,
      finAdjustmentNote: finAdjustmentNote || undefined,
      finQualitativeNote,
      financeEvaluatedImpact: finCertifiedAmount,
      calculatedRewardIdeaOwner: proposerReward,
      calculatedRewardTeamMembers: teamRewardPerMember,
      status: IdeaStatus.PendingCFOSignOff,
    };
    onUpdateIdea(updated);

    onAddNotification(
      "cfo@ionexchange.com",
      `[Block 13] Finance Certified — Payout Approval Pending — ${idea.id}`,
      `Dear CFO / Finance Head,\n\nFinance has certified the financial impact for "${idea.fhProjectTitle || idea.title}" (${idea.id}).\n\nCertified Net Annualized Impact: ₹${finCertifiedAmount.toLocaleString()}\nReward Slab: ${finRewardSlab || '—'}\n${finAdjustmentNote ? `Adjustments: ${finAdjustmentNote}\n` : ''}Finance Rationale: ${finQualitativeNote}\n\nReward split: Idea Owner (25%) = ₹${proposerReward.toLocaleString()} | Team (75% equal) = ₹${teamRewardPerMember.toLocaleString()}/head\n\nPlease sign off to authorise reward disbursement.`
    );
    onAddNotification(
      idea.projectLeadEmail || idea.employeeEmail,
      `[Finance Validated] Routed to CFO for Payout Sign-Off — ${idea.id}`,
      `Dear ${idea.projectLeadName},\n\nFinance has certified the financial impact of your project "${idea.fhProjectTitle || idea.title}" (${idea.id}).\n\nCertified Net Impact: ₹${finCertifiedAmount.toLocaleString()}${finAdjustmentNote ? `\nNote: ${finAdjustmentNote}` : ''}\n\nThe case is now with the CFO / Finance Head for final reward sign-off (Block 13).\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
    );
    onAddNotification(
      "coe@ionexchange.com",
      `[Finance Validated] Certified ₹${finCertifiedAmount.toLocaleString()} — CFO Approval Pending — ${idea.id}`,
      `Dear C-POC,\n\nFinance has certified ₹${finCertifiedAmount.toLocaleString()} net annual impact for ${idea.id}. Case is pending CFO sign-off for reward disbursement.\n\nFinance rationale: "${finQualitativeNote}"`
    );
    onAddNotification(
      idea.assignedFHEmail || "functional.head@ionexchange.com",
      `[Finance Validated] Certified figure locked — ${idea.id}`,
      `Dear ${idea.assignedFHName || 'Functional Head'},\n\nFinance has certified the financial impact for "${idea.fhProjectTitle || idea.title}" (${idea.id}) at ₹${finCertifiedAmount.toLocaleString()} net annual impact. Pending CFO sign-off for disbursement.`
    );
    alert(`Finance validated! Certified: ₹${finCertifiedAmount.toLocaleString()}. Routed to CFO for sign-off.`);
  };

  // 11b. Plan Owner resubmits financial report to Finance
  const handleFinanceResubmit = () => {
    if (!rptActualFinancialImpact.trim()) { alert("Please update the actual financial impact (₹)."); return; }
    if (!rptCalcMethodology.trim()) { alert("Calculation methodology is mandatory."); return; }
    const updated: Idea = {
      ...idea,
      rptActualFinancialImpact, rptCalculationMethodology: rptCalcMethodology,
      rptImpactTypes, rptRecurringType: rptRecurringType || undefined,
      rptAssumptions, rptEvidenceSource,
      rptImplCost, rptOngoingCost,
      rptOverlapCheck: rptOverlapCheck || undefined, rptOverlapNote, rptIndirectBenefits,
      status: IdeaStatus.PendingFinanceEvaluation,
    };
    onUpdateIdea(updated);
    onAddNotification(
      "finance@ionexchange.com",
      `[Finance Revision Resubmitted] Round ${(idea.financeSendBackCount || 0) + 1} — ${idea.id}`,
      `Dear Finance Team,\n\nPlan Owner ${idea.projectLeadName} has revised and resubmitted the financial impact section for "${idea.fhProjectTitle || idea.title}" (${idea.id}).\n\nUpdated Financial Impact: ${rptActualFinancialImpact}\nUpdated Calculation: ${rptCalcMethodology}\n\nPlease review in the Task Center.`
    );
    onAddNotification(
      "coe@ionexchange.com",
      `[Finance Revision Resubmitted] ${idea.id} back with Finance`,
      `Dear C-POC,\n\nPlan Owner ${idea.projectLeadName} has resubmitted the financial report for ${idea.id} after Finance send-back. Now awaiting Finance validation.`
    );
    alert("Financial report resubmitted to Finance. Awaiting validation.");
  };

  // 12. CFO Sign-off
  const handleCFOSignOff = () => {
    const updated: Idea = {
      ...idea,
      cfoSignOffDate: new Date().toISOString(),
      status: IdeaStatus.Completed
    };

    onUpdateIdea(updated);

    onAddNotification(
      "disbursements@ionexchange.com",
      `Payroll Instruction Issued for RIPPLE Incu-Reward - ${idea.id}`,
      `Dear Rewards Payroll,\n\nCFO has authorized final reward disbursements for project "${idea.title}":\n\n1. Proposer Share (25%): Rs. ${(idea.calculatedRewardIdeaOwner || 0).toLocaleString()} to ${idea.employeeName}\n2. Team Share (75% equal): Rs. ${(idea.calculatedRewardTeamMembers || 0).toLocaleString()} each to ${idea.allocatedTeamMembers.join(", ") || 'nominated team members'}`
    );

    // Final glory certificate to proposer and team
    onAddNotification(
      idea.projectLeadEmail || idea.employeeEmail,
      `RIPPLE WINNER - Certificate of Contribution & Payouts Activated! - ${idea.id}`,
      `Dear Winner and strategic co-menders,\n\nOur CFO & Board is proud to issue you the Certificate of Incubation Excellence.\n\nFinal reward split is credited to your mapped corporate bank accounts.\n\nThank you for fueling innovation!`,
      `CERTIFICATE_CONTRIBUTION_WINNER_${idea.id}.pdf`,
      "Contribution Excellence Certificate"
    );

    alert("CFO final sign-off registered! Incubation journey is completed.");
  };

  // helper to check if current user matches the role that must do action
  const isAuthorizedRole = () => {
    const status = idea.status;
    if (status === IdeaStatus.Submitted) return persona.role === 'C-POC';
    if (status === IdeaStatus.ReturnedToEmployee) return persona.role === 'Employee';
    if (status === IdeaStatus.ApprovedByCPOC) return persona.role === 'C-POC';
    if (status === IdeaStatus.UnderIRCEvaluation) return persona.role === 'IRC Member';
    if (status === IdeaStatus.SelectedByIRC) return persona.role === 'C-POC';
    if (status === IdeaStatus.WithFunctionalHead) return persona.role === 'Functional Head';
    if (status === IdeaStatus.AwaitingActionPlan || status === IdeaStatus.ActionPlanRevision) return persona.role === 'Plan Owner';
    if (status === IdeaStatus.ActionPlanSubmitted) return persona.role === 'Functional Head';
    if (status === IdeaStatus.ActionPlanApproved || status === IdeaStatus.ReportRevision) return persona.role === 'Plan Owner';
    if (status === IdeaStatus.ReportSubmitted) return persona.role === 'Functional Head';
    if (status === IdeaStatus.PendingFinanceEvaluation) return persona.role === 'Finance';
    if (status === IdeaStatus.FinanceRevision) return persona.role === 'Plan Owner';
    if (status === IdeaStatus.PendingCFOSignOff) return persona.role === 'CFO';
    return false;
  };

  // get the role needed for this status
  const getRequiredRoleForStatus = () => {
    const status = idea.status;
    if (status === IdeaStatus.Submitted) return 'C-POC';
    if (status === IdeaStatus.ReturnedToEmployee) return 'Employee';
    if (status === IdeaStatus.ApprovedByCPOC) return 'C-POC';
    if (status === IdeaStatus.UnderIRCEvaluation) return 'IRC Member';
    if (status === IdeaStatus.SelectedByIRC) return 'C-POC';
    if (status === IdeaStatus.WithFunctionalHead) return 'Functional Head';
    if (status === IdeaStatus.AwaitingActionPlan || status === IdeaStatus.ActionPlanRevision) return 'Plan Owner (Project Lead)';
    if (status === IdeaStatus.ActionPlanSubmitted) return 'Functional Head';
    if (status === IdeaStatus.ActionPlanApproved || status === IdeaStatus.ReportRevision) return 'Plan Owner (Project Lead)';
    if (status === IdeaStatus.ReportSubmitted) return 'Functional Head';
    if (status === IdeaStatus.PendingFinanceEvaluation) return 'Finance';
    if (status === IdeaStatus.FinanceRevision) return 'Plan Owner (Project Lead)';
    if (status === IdeaStatus.PendingCFOSignOff) return 'CFO';
    return '';
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 card-shadow space-y-6">
      
      {/* Workflow Header details */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 pb-4">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
            Active RIPPLE Incu-Workspace Project
          </span>
          <h3 className="font-display font-black text-sm text-slate-900">
            {idea.title} ({idea.id})
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-500 font-bold uppercase">Workflow Status:</span>
          <span className="bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            {idea.status}
          </span>
        </div>
      </div>

      {/* RIPPLE Live Progress Flowchart */}
      <WorkflowMap idea={idea} />

      {/* Role Warnings */}
      <div className="p-4 bg-indigo-50/60 border border-indigo-150/50 rounded-2xl text-[11px] text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="leading-relaxed text-slate-800">
          Current Interactive Persona: <strong className="text-slate-950">{persona.name}</strong> (<span className="font-bold underline text-indigo-700">{persona.role}</span>)
        </span>
        {getRequiredRoleForStatus() && (
          <span className="bg-white/80 border border-indigo-200 text-indigo-950 px-2.5 py-1 rounded-full font-mono font-bold text-[10px]">
            Requires Action By: {getRequiredRoleForStatus()}
          </span>
        )}
      </div>

      {/* Enterprise Proposal Submission Dossier (Complete Proposal visibility) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <button
          onClick={() => setIsDossierExpanded(!isDossierExpanded)}
          className="w-full px-5 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between text-left focus:outline-hidden hover:bg-slate-100 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black font-display tracking-wider text-slate-900 uppercase">
                Original Proposal Submission &amp; Employee Dossier
              </h3>
              <p className="text-[9.5px] text-slate-500 font-sans mt-0.5">
                Complete system record, attachments, and dynamic metadata fields submitted by proposer.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8.5px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100 uppercase">
              Secure Audit Record
            </span>
            {isDossierExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {isDossierExpanded && (
          <div className="p-5 space-y-6 divide-y divide-slate-100">
            {/* Row 1: Employee Details */}
            <div className="space-y-3">
              <span className="text-[9.5px] uppercase font-mono font-black text-slate-450 tracking-wider block">
                Proposer / Employee Identification
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Employee Name</span>
                  <span className="text-slate-800 font-bold text-xs mt-0.5 block">{idea.employeeName}</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Email Address</span>
                  <span className="text-slate-800 font-mono text-[11px] mt-0.5 block break-all">{idea.employeeEmail}</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Employee ID</span>
                  <span className="text-slate-800 font-mono text-[11px] mt-0.5 block font-bold">{idea.employeeId || "ION-EMP-2026-081"}</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">HR Department</span>
                  <span className="text-slate-800 text-xs mt-0.5 block">{idea.department || "Process Engineering & Design"}</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Corporate Designation</span>
                  <span className="text-slate-800 text-xs mt-0.5 block">{idea.designation || "Senior Process Engineer"}</span>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Business Unit / Division</span>
                  <span className="text-slate-800 text-xs mt-0.5 block">{idea.businessUnit}</span>
                </div>
              </div>
            </div>

            {/* Row 2: Proposal Details */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] uppercase font-mono font-black text-slate-455 tracking-wider block">
                  Core Proposal Parameters
                </span>
                <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-sans">
                  Theme: {idea.areaOfImpact}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Description / Problem Statement</span>
                  <div className="text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed font-sans text-[11px] whitespace-pre-wrap border border-slate-200">
                    {idea.problemStatement}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Proposed Solution &amp; Business Justification</span>
                  <div className="text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed font-sans text-[11px] whitespace-pre-wrap border border-slate-200">
                    {idea.proposedSolution}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Expected Quantifiable Impact / Business ROI</span>
                <div className="text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed font-sans text-[11px] whitespace-pre-wrap border border-slate-200">
                  {idea.expectedImpact || "No direct quantifiable metrics provided."}
                </div>
              </div>
            </div>

            {/* Row 3: Dynamic Template Custom Fields */}
            {idea.customFields && idea.customFields.length > 0 && (
              <div className="space-y-3 pt-4">
                <span className="text-[9.5px] uppercase font-mono font-black text-slate-450 tracking-wider block">
                  Dynamic Form Template Parameters &amp; Indicators
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {idea.customFields.map((field, idx) => (
                    <div key={idx} className="bg-indigo-50/25 border border-indigo-100 p-3 rounded-xl">
                      <span className="text-[8.5px] uppercase font-bold text-indigo-900/60 tracking-wider block font-mono">
                        {field.label}
                      </span>
                      <span className="text-slate-800 font-bold text-[11.5px] mt-0.5 block font-sans">
                        {field.value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 4: Supporting Files & Attachments */}
            <div className="space-y-3 pt-4">
              <span className="text-[9.5px] uppercase font-mono font-black text-slate-450 tracking-wider block">
                Supporting Files &amp; Annexure Documents
              </span>
              {idea.uploadedFiles && idea.uploadedFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {idea.uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="font-bold text-slate-700 truncate text-[10.5px]">{file.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono flex-shrink-0">({file.size})</span>
                      </div>
                      <span className="text-[8px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 tracking-widest font-mono select-none">
                        Read Secure
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center text-[10px] text-slate-450 italic">
                  No additional supporting files or schematic annexures uploaded.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RENDER DYNAMIC INCUBATION STEPS */}
      
      {/* If current persona does not match required role, show a reminder but let them bypass if they click a button */}
      {!isAuthorizedRole() && getRequiredRoleForStatus() !== "" && (
        <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-2xl space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wide">Action Pending in Another Persona View</h4>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                This incubation stage requires action from the <strong>{getRequiredRoleForStatus()}</strong> panel. 
                Switch your active persona in the dropdown above to continue, or view current state metrics below!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Submitted -> C-POC Idea Vetting Guideline (Annexure 2) */}
      {idea.status === IdeaStatus.Submitted && persona.role === "C-POC" && (() => {
        const sendBackAtLimit = idea.vettingSendBackCount >= 2;
        const firstName = idea.employeeName.split(" ")[0];
        const sectionParagraphs: Record<string, string> = {
          B: "We'd like to understand the problem area a little better. Could you add more detail on what the opportunity is?",
          C: "Your proposed idea would benefit from a bit more detail — particularly on what would change (before vs after).",
          D: "For the proposed idea we would like you to provide more details on the possible risks associated with the implementation.",
          F: "We noticed an estimated financial impact was shared, but the basis for this figure was not included. Could you share a brief calculation or assumption behind this number?",
        };
        const tickedKeys = (["B", "C", "D", "F"] as const).filter(k => sendBackSections[k]);
        const mailBodyLines = tickedKeys.map(s => sectionParagraphs[s]);
        const mailPreview = mailBodyLines.length > 0
          ? `Hi ${firstName}, thank you for your idea submission (${idea.id} - ${idea.title}). Before this can move to the Idea Review Committee, we need a little more information:\n\n${mailBodyLines.join("\n\n")}\n\nPlease update your submission on the Ripple platform at your earliest convenience. If you have any questions, feel free to reach out to the Ripple team.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`
          : "";

        return (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-5 h-5 text-white" />
                <div>
                  <h4 className="font-bold text-sm text-white leading-none">Idea Vetting Guideline</h4>
                  <p className="text-indigo-200 text-[10px] mt-0.5">Annexure 2 · C-POC Quality Gate</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                sendBackAtLimit
                  ? "bg-rose-100 text-rose-700"
                  : "bg-white/20 text-white border border-white/30"
              }`}>
                Send-back: {idea.vettingSendBackCount}/2{sendBackAtLimit ? " — Limit reached" : ""}
              </span>
            </div>

            <div className="p-5 space-y-5">

              {/* Block 1 – Guiding principles (collapsible) */}
              <details className="group bg-slate-50 border border-slate-200 rounded-xl">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none list-none">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Block 1 — Guiding Principles</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 pt-1 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {[
                      { label: "Your purpose",          text: "Check whether the idea is described clearly enough for the IRC to evaluate it — nothing more." },
                      { label: "You are NOT judging",    text: "Whether the idea is good, feasible, or will be selected is the committee's job. You only check clarity." },
                      { label: "Nothing arrives blank",  text: "All mandatory fields are validated at submission. What you may see is a field filled but too vague." },
                      { label: "Where vagueness hides",  text: "Only free-text sections B, C, D, and F (if a ₹ figure is given) can be vague. Dropdowns and ratings cannot." },
                      { label: "Your decision options",  text: "Approve, Send-back (tick sections below), or Reject. Send-back is locked after 2 uses." },
                      { label: "SLA",                    text: "Complete vetting within 3 working days of submission." },
                    ].map(({ label, text }) => (
                      <div key={label} className="bg-white p-2.5 rounded-lg border border-slate-150">
                        <span className="font-semibold text-xs text-slate-800 block">{label}</span>
                        <span className="text-xs text-slate-500">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {/* Block 2 – Decision selector */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-slate-500 block">Block 2 — Decision</span>
                <div className="flex flex-wrap gap-2">
                  {(["Approve", "Send-back", "Reject"] as const).map((opt) => {
                    const isDisabled = opt === "Send-back" && sendBackAtLimit;
                    return (
                      <button
                        key={opt} type="button"
                        disabled={isDisabled}
                        onClick={() => setVettingDecision(vettingDecision === opt ? "" : opt)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          isDisabled
                            ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                            : "cursor-pointer " + (
                              vettingDecision === opt
                                ? opt === "Approve"
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                  : opt === "Send-back"
                                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                                  : "bg-rose-600 border-rose-600 text-white shadow-sm"
                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"
                            )
                        }`}
                      >
                        {opt === "Approve" && "✓ Approve — idea is clear enough for committee review"}
                        {opt === "Send-back" && (sendBackAtLimit ? "↩ Send-back (locked — 2/2 used)" : `↩ Send-back — one or more sections need more detail (${idea.vettingSendBackCount}/2 used)`)}
                        {opt === "Reject" && "✕ Reject — out of scope or still inadequate after 2 send-backs"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Block 3 – Send-back checklist */}
              {vettingDecision === "Send-back" && !sendBackAtLimit && (
                <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-amber-800 block">Block 3 — Send-back Checklist</span>
                    <span className="text-[9px] text-amber-600">Tick the sections needing more detail</span>
                  </div>
                  <div className="space-y-2">
                    {([
                      { key: "B" as const, label: "B. Opportunity Identification",  question: "Is the opportunity properly articulated by the idea proposer?" },
                      { key: "C" as const, label: "C. Proposed Idea",               question: "Is the proposed solution properly articulated by the idea proposer?" },
                      { key: "D" as const, label: "D. Risk Awareness",              question: "Are the potential risks related to implementation properly stated?" },
                      { key: "F" as const, label: "F. Financial Estimate",          question: "If a ₹ figure is given, is the basis of calculation also provided? (Skip if no ₹ figure — Section F is optional.)" },
                    ]).map(({ key, label, question }) => (
                      <label
                        key={key}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                          sendBackSections[key]
                            ? "bg-white border-amber-400 shadow-sm"
                            : "bg-white border-slate-200 hover:border-amber-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sendBackSections[key]}
                          onChange={(e) => setSendBackSections(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="mt-0.5 accent-amber-600 w-4 h-4 shrink-0 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">{label}</span>
                          <span className="text-xs text-slate-500">{question}</span>
                          {sendBackSections[key] && (
                            <span className="text-amber-700 text-[10px] italic block mt-1">
                              Auto-mail para: "{sectionParagraphs[key]}"
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Auto-mail preview */}
                  {tickedKeys.length > 0 && (
                    <div className="bg-white border border-amber-200 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider">Auto-mail preview (assembled by platform)</span>
                      <pre className="text-[10px] text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">{mailPreview}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Block 5 – Reject reasons */}
              {vettingDecision === "Reject" && (
                <div className="space-y-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-rose-800 block">Block 5 — Reject Reason</span>
                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                      rejectReason === "scope" ? "bg-white border-rose-400 shadow-sm" : "bg-white border-slate-200 hover:border-rose-300"
                    }`}>
                      <input type="radio" name="rejectReason" value="scope"
                        checked={rejectReason === "scope"}
                        onChange={() => setRejectReason("scope")}
                        className="mt-0.5 accent-rose-600 w-4 h-4 shrink-0 cursor-pointer" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 block">Not aligned with Ripple's scope</span>
                        <span className="text-xs text-slate-500">Submission is a complaint, wrongly filled, or out of Ripple scope — not a process or workplace improvement idea.</span>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                      rejectReason === "revision" ? "bg-white border-rose-400 shadow-sm" : "bg-white border-slate-200 hover:border-rose-300"
                    }`}>
                      <input type="radio" name="rejectReason" value="revision"
                        checked={rejectReason === "revision"}
                        onChange={() => setRejectReason("revision")}
                        className="mt-0.5 accent-rose-600 w-4 h-4 shrink-0 cursor-pointer" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 block">Data quality not met after revisions</span>
                        <span className="text-xs text-slate-500">Select on 3rd review (after 2 send-backs) if the same sections are still vague.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Optional internal notes */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Internal vetting notes <span className="text-slate-400 font-normal">(optional — not shared with employee)</span>
                </label>
                <textarea
                  rows={2}
                  value={vettingComments}
                  onChange={(e) => setVettingComments(e.target.value)}
                  placeholder="Optional: note any internal rationale or observation..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl text-xs font-sans resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                <button
                  onClick={handleCPOCVetting}
                  disabled={!vettingDecision}
                  className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${
                    !vettingDecision
                      ? "bg-slate-400 cursor-not-allowed"
                      : vettingDecision === "Approve"
                      ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                      : vettingDecision === "Send-back"
                      ? "bg-amber-500 hover:bg-amber-600 cursor-pointer"
                      : "bg-rose-600 hover:bg-rose-700 cursor-pointer"
                  }`}
                >
                  {vettingDecision === "Approve"    && <><CheckCircle className="w-3.5 h-3.5" /> Confirm Approval</>}
                  {vettingDecision === "Send-back"  && <><RefreshCcw className="w-3.5 h-3.5" /> Send Back to Proposer</>}
                  {vettingDecision === "Reject"     && <><XCircle className="w-3.5 h-3.5" /> Confirm Rejection</>}
                  {!vettingDecision                 && "Select a decision above"}
                </button>
                <span className="text-[10px] text-slate-400">SLA: complete vetting within 3 working days</span>
              </div>

            </div>
          </div>
        );
      })()}

      {/* STEP 2: ReturnedToEmployee -> Employee Resubmission Screen */}
      {idea.status === IdeaStatus.ReturnedToEmployee && persona.role === "Employee" && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5 text-indigo-750">
            <RefreshCcw className="w-4 h-4" />
            Empower Idea Revision Loop (Annexure 2)
          </h4>

          <div className="bg-rose-50 border border-rose-150 p-4 rounded-xl text-[11px] text-rose-950">
            <strong>C-POC Return Reason:</strong> "{idea.vettingComments}"
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-1.5">Revised Title</label>
              <input type="text" value={resubTitle} onChange={(e) => setResubTitle(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs font-semibold" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-1.5">Revised Problem Statement</label>
              <textarea value={resubProblem} onChange={(e) => setResubProblem(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs h-24" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-1.5">Revised Proposed Solution</label>
              <textarea value={resubSolution} onChange={(e) => setResubSolution(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs h-24" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-1.5">Revised Estimated Benefits</label>
              <textarea value={resubImpact} onChange={(e) => setResubImpact(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs" />
            </div>
          </div>

          <button
            onClick={handleEmployeeResubmit}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-widest rounded-xl uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            Resubmit Refined Proposal
          </button>
        </div>
      )}

      {/* STEP 3: ApprovedByCPOC -> C-POC publishes Proposer-IRC presentation Connection details */}
      {idea.status === IdeaStatus.ApprovedByCPOC && persona.role === "C-POC" && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Arrange Proposer-IRC Incu-Pitch Meeting (Offline Track)
          </h4>

          <p className="text-[11px] text-slate-600 leading-relaxed font-sans max-w-xl">
            Input localized meeting invitations. Submitting here triggers in-app alerts and email dispatches to 
            evaluation advisors, unlocking their scoring panel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-1">
                Offline Pitch Presentation Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 rounded-xl text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-1">
                IRC Passing Score Threshold (Out of 100)
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={scoresThreshold}
                onChange={(e) => setScoresThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <span className="text-[9.5px] uppercase font-mono font-bold text-slate-500 block">IRC Jury Board Assignment:</span>
            
            <div className="flex gap-6 flex-wrap items-center bg-white p-3 rounded-xl border border-slate-150">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                <input
                  type="radio"
                  checked={useDefaultIRC}
                  onChange={() => setUseDefaultIRC(true)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="flex flex-col">
                  <span className="font-extrabold text-indigo-950">Option 1: Default Committee</span>
                  <span className="text-[10px] text-slate-550 font-normal">Automatically assign predefined senior board advisors</span>
                </span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                <input
                  type="radio"
                  checked={!useDefaultIRC}
                  onChange={() => setUseDefaultIRC(false)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="flex flex-col">
                  <span className="font-extrabold text-indigo-950">Option 2: Manual Selection</span>
                  <span className="text-[10px] text-slate-550 font-normal">Select specific experts by ID, Email, or Department</span>
                </span>
              </label>
            </div>

            {useDefaultIRC ? (
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[10px] text-indigo-950 font-mono space-y-1.5">
                <p className="font-bold uppercase text-indigo-900 tracking-wider">Default Committee Appointees (3 Members):</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  <div className="p-2 bg-white rounded-lg border border-indigo-100">
                    <span className="block font-sans font-bold text-[10.5px]">advisor@ionexchange.com</span>
                    <span className="text-[9px] text-slate-500">Senior Technical Advisor</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-indigo-100">
                    <span className="block font-sans font-bold text-[10.5px]">council1@ionexchange.com</span>
                    <span className="text-[9px] text-slate-500">Advisory Council SPOC</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-indigo-100">
                    <span className="block font-sans font-bold text-[10.5px]">council2@ionexchange.com</span>
                    <span className="text-[9px] text-slate-500">Operations &amp; CoE Representative</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 bg-white p-4 border border-slate-200 rounded-xl">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase tracking-widest text-[9px]">
                    1. Search & Select Reviewers (by ID, Email, or Department)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      value={reviewerSearch}
                      onChange={(e) => setReviewerSearch(e.target.value)}
                      placeholder="Type Employee ID (e.g. EMP-2384), Email, or Department (e.g. Membrane CoE)..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-sans transition-all"
                    />
                  </div>
                </div>

                {/* Available filtered reviewers directory */}
                <div className="space-y-1.5">
                  <span className="text-[8.5px] uppercase font-mono font-bold text-slate-400 block">Matching Personnel Directory:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_ENTERPRISE_REVIEWERS.filter((rev) => {
                      const q = reviewerSearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        rev.id.toLowerCase().includes(q) ||
                        rev.email.toLowerCase().includes(q) ||
                        rev.name.toLowerCase().includes(q) ||
                        rev.department.toLowerCase().includes(q)
                      );
                    }).map((rev) => {
                      const isSelected = customIRCEmails
                        .split(",")
                        .map((e) => e.trim().toLowerCase())
                        .includes(rev.email.toLowerCase());

                      return (
                        <div
                          key={rev.id}
                          onClick={() => {
                            const current = customIRCEmails
                              .split(",")
                              .map((e) => e.trim())
                              .filter((e) => e.length > 0);
                            
                            if (isSelected) {
                              const next = current.filter((e) => e.toLowerCase() !== rev.email.toLowerCase());
                              setCustomIRCEmails(next.join(", "));
                            } else {
                              const next = [...current, rev.email];
                              setCustomIRCEmails(next.join(", "));
                            }
                          }}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-indigo-50/50 border-indigo-250 ring-1 ring-indigo-500/20"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[10.5px] text-slate-900 truncate">{rev.name}</span>
                              <span className="font-mono text-[8px] bg-slate-200/80 px-1 rounded text-slate-600">{rev.id}</span>
                            </div>
                            <span className="block font-mono text-[9px] text-indigo-700 truncate">{rev.email}</span>
                            <span className="block text-[8.5px] text-slate-500 font-sans truncate">{rev.department}</span>
                          </div>

                          <div className={`p-1 rounded-full ${isSelected ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-250"}`}>
                            {isSelected ? (
                              <UserCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current selections tags display */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                    2. Active Jury Roster (Comma-separated List)
                  </label>
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {customIRCEmails
                      .split(",")
                      .map((e) => e.trim())
                      .filter((e) => e.length > 0)
                      .map((email) => {
                        const matched = AVAILABLE_ENTERPRISE_REVIEWERS.find((r) => r.email.toLowerCase() === email.toLowerCase());
                        return (
                          <div
                            key={email}
                            className="bg-indigo-50 border border-indigo-150 text-indigo-900 px-2 py-0.5 rounded-lg text-[9.5px] font-mono flex items-center gap-1.5"
                          >
                            <span>{matched ? `${matched.name} (${email})` : email}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = customIRCEmails
                                  .split(",")
                                  .map((e) => e.trim())
                                  .filter((e) => e.length > 0);
                                const next = current.filter((e) => e.toLowerCase() !== email.toLowerCase());
                                setCustomIRCEmails(next.join(", "));
                              }}
                              className="text-indigo-400 hover:text-indigo-700 font-black cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    {customIRCEmails.split(",").map((e) => e.trim()).filter((e) => e.length > 0).length === 0 && (
                      <span className="text-[10px] text-amber-650 italic">No members selected yet. Search and click above to populate list.</span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={customIRCEmails}
                    onChange={(e) => setCustomIRCEmails(e.target.value)}
                    placeholder="Alternatively, type comma-separated custom emails directly..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px]">
              Connection Schedule & Teams invites
            </label>
            <textarea
              value={meetingDetails}
              onChange={(e) => setMeetingDetails(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 rounded-xl text-xs font-mono"
            />
          </div>

          <button
            onClick={handlePublishMeeting}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold tracking-widest rounded-xl uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Dispatch Connection Details
          </button>
        </div>
      )}

      {/* STEP 4: UnderIRCEvaluation -> IRC Evaluation Template (Annexure 4) */}
      {idea.status === IdeaStatus.UnderIRCEvaluation && persona.role === "IRC Member" && (() => {
        const FH_LIST = ["Dr. Alok Gupta", "Anil Sharma", "Sunita Roy", "Vikram Malhotra", "Prakash Iyer", "Meera Patel"];
        const CRITERIA: Array<{
          key: keyof typeof ircScores;
          label: string;
          nudge: string;
          anchors: Record<number, string>;
        }> = [
          {
            key: "alignmentPriority",
            label: "1. Alignment to Organization's Priority",
            nudge: "Which specific organizational / BU priority does this support?",
            anchors: {
              1: "No clear link to any stated BU/organizational priority.",
              2: "Weak or indirect link; connection requires a stretch to justify.",
              3: "Loosely supports a priority area but connection is indirect.",
              4: "Clearly supports a priority area, though not the central focus of it.",
              5: "Directly and clearly advances a specific stated BU/organizational priority.",
            },
          },
          {
            key: "feasibility",
            label: "2. Feasibility",
            nudge: "What's the biggest obstacle to piloting this, and is it manageable?",
            anchors: {
              1: "Requires major investment, new technology, or org-wide change before a pilot could even start.",
              2: "Significant new resources or approvals needed; pilot start would be slow and effortful.",
              3: "Pilot is possible but needs meaningful new resources, approvals, or coordination.",
              4: "Pilot is largely possible with existing resources, with only minor approvals or adjustments needed.",
              5: "Can be piloted using existing resources/teams with minimal additional approvals.",
            },
          },
          {
            key: "businessValue",
            label: "3. Business Value / Impact",
            nudge: "What's the expected before-vs-after delta, and how would we measure it?",
            anchors: {
              1: "Benefit is unclear, marginal, or unlikely to be noticeable.",
              2: "Some plausible benefit, but small in scale or highly uncertain.",
              3: "Moderate, plausible improvement in cost, productivity, quality, safety, or experience — but hard to quantify.",
              4: "Good improvement expected, reasonably well-supported, though not transformational.",
              5: "Clear, meaningful improvement in cost, revenue, productivity, quality, safety, or customer/employee experience, with a reasonable basis for the estimate.",
            },
          },
          {
            key: "innovation",
            label: "4. Innovation & Originality",
            nudge: "Has anything similar been tried at ION or elsewhere? What makes this different?",
            anchors: {
              1: "Already standard practice at ION or a straightforward repeat of a known idea.",
              2: "Minor variation on an existing approach; limited new thinking.",
              3: "A reasonable adaptation or combination of existing approaches, applied in a new context at ION.",
              4: "A fairly novel approach for ION, even if similar ideas exist elsewhere.",
              5: "A genuinely new approach for ION — or a creative reapplication of an idea from elsewhere that hasn't been tried here.",
            },
          },
          {
            key: "scalability",
            label: "5. Scalability",
            nudge: "Which other BUs/clusters could realistically adopt this, if any?",
            anchors: {
              1: "Relevant only to one specific team/location; not replicable elsewhere.",
              2: "Limited replicability; would need substantial rework to apply elsewhere.",
              3: "Could potentially be adapted to a few similar units, with some rework.",
              4: "Reasonably portable to most similar units with modest adaptation.",
              5: "Can be readily replicated across multiple BUs/clusters with little to no modification.",
            },
          },
          {
            key: "riskDependency",
            label: "6. Risk & Dependency Assessment",
            nudge: "What's the main risk or dependency, and what would mitigate it?",
            anchors: {
              1: "Significant risk or dependency identified, with no clear way to manage it; benefits do not clearly outweigh the risk.",
              2: "Notable risk or dependency exists; mitigation is unclear or demanding.",
              3: "Some risk or dependency exists, but appears manageable with reasonable planning.",
              4: "Minor risk or dependency; mitigation is fairly straightforward.",
              5: "Minimal risk; any dependencies are well understood and easily addressed; benefits clearly outweigh the risk.",
            },
          },
        ];

        const liveAvg = (() => {
          const vals = (Object.values(ircScores) as number[]).filter(v => v > 0);
          return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        })();

        const myReview = idea.ircReviews?.find(r => r.reviewerEmail === persona.email);

        return (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-white" />
                <div>
                  <h4 className="font-bold text-sm text-white leading-none">Idea Evaluation Template</h4>
                  <p className="text-indigo-200 text-[10px] mt-0.5">Annexure 4 · IRC Advisor Scorecard</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full">Jury Stage</span>
            </div>

            {myReview ? (
              /* Already scored — confirmation panel */
              <div className="p-6 space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <strong className="text-emerald-900 text-sm">Evaluation Submitted</strong>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Your score of <strong className="font-mono">{myReview.aggregateScore.toFixed(2)}/25</strong> has been recorded.
                    Recommended FH: <strong>{myReview.recommendedFH || "—"}</strong>
                  </p>
                  <p className="text-[10px] text-slate-500">Awaiting remaining advisors. C-POC will run the averaging calculation to finalise Stage Gate 2.</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {CRITERIA.map(c => (
                    <div key={c.key} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500 mb-1 truncate">{c.label.split(". ")[1]}</div>
                      <div className="text-lg font-black text-indigo-700 font-mono">{myReview.scores[c.key] ?? "—"}</div>
                      <div className="text-[8px] text-slate-400">/ 5</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-5">

                {/* AI assist */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <strong className="text-indigo-900 text-xs block mb-0.5">Need a draft from Gemini AI?</strong>
                    <span className="text-[10px] text-slate-500">Auto-suggests scores based on the idea content.</span>
                  </div>
                  <button
                    onClick={handleConsultGeminiReviewer}
                    disabled={isAiEvaluating}
                    className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700 disabled:opacity-40 shrink-0"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {isAiEvaluating ? "Thinking..." : "Co-Consult Gemini"}
                  </button>
                </div>
                {aiEvalError && <p className="text-rose-600 text-[10px] font-mono">{aiEvalError}</p>}

                {/* Block 1 — Header (auto-filled + FH) */}
                <div className="space-y-3">
                  <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-slate-500 block">Block 1 — Header</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Idea ID",       value: idea.id },
                      { label: "Idea Title",    value: idea.title },
                      { label: "Area of Impact", value: idea.areaOfImpact },
                      { label: "Advisor Name",  value: persona.name },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">{label}</span>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recommended Functional Head <span className="text-rose-500">*</span>
                      <span className="text-slate-400 font-normal ml-1 text-[10px]">— mandatory; platform tallies votes across all advisors</span>
                    </label>
                    <select
                      required
                      value={ircRecommendedFH}
                      onChange={e => setIrcRecommendedFH(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 rounded-xl text-sm cursor-pointer"
                    >
                      <option value="">Select Functional Head...</option>
                      {FH_LIST.map(fh => <option key={fh} value={fh}>{fh}</option>)}
                    </select>
                  </div>
                </div>

                {/* Live average score */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Live Average Score (Block 3 — auto-computed)</span>
                  <span className={`text-xl font-black font-mono ${liveAvg >= 3.5 ? "text-emerald-600" : liveAvg >= 2 ? "text-amber-600" : liveAvg > 0 ? "text-rose-500" : "text-slate-300"}`}>
                    {liveAvg > 0 ? liveAvg.toFixed(2) : "—"} <span className="text-sm font-normal text-slate-400">/ 5</span>
                  </span>
                </div>

                {/* Block 2 — Evaluation Criteria */}
                <div className="space-y-4">
                  <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-slate-500 block">Block 2 — Evaluation Criteria</span>
                  {CRITERIA.map((c) => {
                    const score = ircScores[c.key];
                    const anchor = score > 0 ? c.anchors[score] : null;
                    return (
                      <div key={c.key} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                        {/* Criterion header */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{c.label}</span>
                          <span className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg ${
                            score > 0 ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "text-slate-300"
                          }`}>
                            {score > 0 ? `${score}/5` : "—/5"}
                          </span>
                        </div>

                        {/* 1-5 rating buttons */}
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n} type="button"
                              onClick={() => setIrcScores(prev => ({ ...prev, [c.key]: n }))}
                              title={c.anchors[n]}
                              className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                score === n
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm scale-105"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-300"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>

                        {/* Inline anchor for selected score */}
                        {anchor && (
                          <div className="text-[10px] text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 leading-relaxed">
                            <strong>Score {score}:</strong> {anchor}
                          </div>
                        )}

                        {/* Nudge question rationale */}
                        <div>
                          <label className="block text-[10px] text-slate-500 italic mb-1">{c.nudge}</label>
                          <textarea
                            rows={2}
                            placeholder="Your rationale..."
                            value={ircRationale[c.key as keyof typeof ircRationale]}
                            onChange={e => setIrcRationale(prev => ({ ...prev, [c.key]: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 rounded-lg text-xs font-sans resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Block 4 — Overall Qualitative */}
                <div className="space-y-3">
                  <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-slate-500 block">Block 4 — Overall Qualitative Feedback</span>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">What would make this idea even better?</label>
                    <textarea
                      rows={3}
                      placeholder="Forward-looking — any refinement, addition, or adjacent opportunity you see, regardless of the scores above..."
                      value={ircImprovements}
                      onChange={e => setIrcImprovements(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 rounded-xl text-xs font-sans resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Any flags for the implementation team?</label>
                    <textarea
                      rows={3}
                      placeholder="Anything not captured by scores/nudges above — e.g. timing considerations, a team/person to involve, a related ongoing initiative..."
                      value={ircFlags}
                      onChange={e => setIrcFlags(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 rounded-xl text-xs font-sans resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleIRCScoring}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Lock Evaluation Scorecard
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {/* C-POC IRC Board Governance & Averaging Calculation Panel */}
      {idea.status === IdeaStatus.UnderIRCEvaluation && persona.role === "C-POC" && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm" id="cpoc-governance-panel">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
            <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5 text-indigo-950">
              <Users className="w-4 h-4 text-indigo-600" />
              IRC Board Jury Governance &amp; Averaging Console
            </h4>
            <span className="bg-slate-100 text-[10px] px-2 py-0.5 rounded-full text-slate-650 font-bold font-mono">C-POC View</span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
            Monitor advisor scoring progress, bypass unavailable members (contingency protocol), configure the active passing threshold, and execute the final board score averaging calculation to determine if the idea advances to local trials.
          </p>

          {/* Assigned Advisors status */}
          <div className="space-y-3">
            <span className="text-[9.5px] uppercase font-mono font-bold text-slate-500 block">Active Jury Members Status:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(idea.ircCouncilAssignedEmails || ["advisor@ionexchange.com", "advisor1@ionexchange.com"]).map((email) => {
                const isBypassed = bypassedIRCMembers.includes(email);
                const review = idea.ircReviews?.find((r) => r.reviewerEmail === email);
                const hasScored = !!review;

                return (
                  <div key={email} className={`p-3 border rounded-xl flex items-center justify-between gap-4 ${
                    isBypassed ? "bg-slate-50 border-slate-200 opacity-60" :
                    hasScored ? "bg-emerald-50/40 border-emerald-150" : "bg-amber-50/30 border-amber-150"
                  }`}>
                    <div className="min-w-0">
                      <span className="font-mono text-[10.5px] font-bold text-slate-700 block truncate">{email}</span>
                      <div className="flex items-center gap-1.5 mt-1 font-mono text-[8.5px]">
                        {isBypassed ? (
                          <span className="text-slate-500 font-extrabold uppercase">⛔ Bypassed (Contingency)</span>
                        ) : hasScored ? (
                          <>
                            <span className="text-emerald-700 font-extrabold uppercase">✓ Completed</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-indigo-700 font-extrabold">Score: {review.aggregateScore.toFixed(1)}/25</span>
                          </>
                        ) : (
                          <span className="text-amber-700 font-extrabold uppercase">⌛ Awaiting Score</span>
                        )}
                      </div>
                    </div>

                    {!isBypassed && !hasScored && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedBypassed = [...bypassedIRCMembers, email];
                          setBypassedIRCMembers(updatedBypassed);
                          onUpdateIdea({
                            ...idea,
                            bypassedIRCMembers: updatedBypassed
                          });
                          alert(`Bypassed ${email} successfully.`);
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-250 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Bypass Advisor
                      </button>
                    )}

                    {isBypassed && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedBypassed = bypassedIRCMembers.filter((e) => e !== email);
                          setBypassedIRCMembers(updatedBypassed);
                          onUpdateIdea({
                            ...idea,
                            bypassedIRCMembers: updatedBypassed
                          });
                          alert(`Restored ${email} successfully.`);
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-250 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Restore Advisor
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3.3 Configurable Threshold, ranges, and cycle settings form */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
            <span className="text-[10px] uppercase font-mono font-black text-indigo-950 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Configure Committee Evaluation Standards &amp; Thresholds
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-1">Pass Threshold</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={scoreMin}
                    max={scoreMax}
                    step="0.1"
                    value={scoresThreshold}
                    onChange={(e) => setScoresThreshold(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-indigo-900 bg-white border border-indigo-150 px-1.5 py-0.5 rounded">{scoresThreshold.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-1">Score Range (Min / Max)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scoreMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setScoreMin(val);
                      if (scoresThreshold < val) setScoresThreshold(val);
                    }}
                    className="w-12 text-center p-1 border rounded text-[11px] font-mono bg-white"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={scoreMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setScoreMax(val);
                      if (scoresThreshold > val) setScoresThreshold(val);
                    }}
                    className="w-12 text-center p-1 border rounded text-[11px] font-mono bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-1">Evaluation Cycle Settings</label>
                <select
                  value={evaluationCycle}
                  onChange={(e) => setEvaluationCycle(e.target.value)}
                  className="w-full p-1.5 border rounded text-[11px] bg-white"
                >
                  <option value="Monthly Cycle">Monthly Cycle</option>
                  <option value="Quarterly Cycle">Quarterly Cycle</option>
                  <option value="Bi-Annual Cycle">Bi-Annual Cycle</option>
                  <option value="Ad-hoc Pitch Cycle">Ad-hoc Pitch Cycle</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onUpdateIdea({
                    ...idea,
                    ircScoresThreshold: scoresThreshold,
                    ircScoreMin: scoreMin,
                    ircScoreMax: scoreMax,
                    ircEvaluationCycle: evaluationCycle
                  });
                  alert(`Evaluation standards updated successfully!\n\nPass Threshold: ${scoresThreshold}\nScore Range: ${scoreMin} - ${scoreMax}\nCycle: ${evaluationCycle}`);
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                Apply Standards
              </button>
            </div>
          </div>

          {/* Configuration and action panel */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-medium">Active Threshold: <strong className="text-slate-800 font-mono">{(idea.ircScoresThreshold || scoresThreshold).toFixed(1)}</strong></div>
              <div className="text-[10px] text-slate-500 font-medium">
                Reviews Collected: <strong className="text-slate-850 font-mono">{idea.ircReviews?.length || 0}</strong> / {(idea.ircCouncilAssignedEmails || []).filter(e => !bypassedIRCMembers.includes(e)).length} Active
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Active Cycle: <strong className="text-slate-850 font-mono">{idea.ircEvaluationCycle || evaluationCycle}</strong></div>
            </div>

            <button
              type="button"
              onClick={() => {
                const completedReviews = idea.ircReviews || [];
                // Count all submitted reviews that are not explicitly bypassed
                const reviewsToAverage = completedReviews.filter((r) => !bypassedIRCMembers.includes(r.reviewerEmail));

                if (reviewsToAverage.length === 0) {
                  alert("No scoring reviews have been submitted yet. Please wait for at least one advisor to complete their evaluation.");
                  return;
                }

                const sum = reviewsToAverage.reduce((acc, r) => acc + r.aggregateScore, 0);
                const avg = sum / reviewsToAverage.length;
                const threshold = idea.ircScoresThreshold || scoresThreshold;
                const isSelected = avg >= threshold;

                const nextStatus = isSelected ? IdeaStatus.SelectedByIRC : IdeaStatus.RejectedByIRC;

                const updated: Idea = {
                  ...idea,
                  averageIrcScore: avg,
                  ircSelectionStatus: isSelected ? "Selected" : "Rejected",
                  status: nextStatus,
                  selectionVoucherReleased: isSelected,
                  selectionCertificateUrl: isSelected ? `CERTIFICATE_INC_SELECTION_${idea.id}.pdf` : undefined,
                  bypassedIRCMembers: bypassedIRCMembers,
                  ircScoresThreshold: threshold,
                  ircScoreMin: scoreMin,
                  ircScoreMax: scoreMax,
                  ircEvaluationCycle: evaluationCycle
                };

                onUpdateIdea(updated);

                // Dispatches notification
                if (isSelected) {
                  onAddNotification(
                    idea.employeeEmail,
                    `CONGRATULATIONS! Your Idea has been Selected by RIPPLE IRC - ${idea.id}`,
                    `Dear ${idea.employeeName},\n\nWe are ecstatic to share that our ${evaluationCycle} panel of Senior Advisors has selected your presentation "${idea.title}" with an average score of ${avg.toFixed(2)}/25 (passing threshold: ${threshold.toFixed(1)}/25)!\n\nAwards Triggered:\n1. Digital Certificate of Idea Selection is generated.\n2. Rs. 2,000 corporate voucher is dispatched to Finance for payouts.\n\nNext Step: C-POC is identifying matching Functional Heads to deploy local trials.`,
                    `CERTIFICATE_INC_SELECTION_${idea.id}.pdf`
                  );
                  alert(`IRC Selection Complete! Average Score: ${avg.toFixed(2)}/25 is above passing threshold of ${threshold.toFixed(1)}/25. Idea SELECTED! Selection voucher & selection certificate unlocked.`);
                } else {
                  // Annexure 5 — Idea Not Selected Mail to Employee
                  const firstName = (idea.employeeName || "").split(" ")[0] || idea.employeeName;
                  const annex5Body =
                    `Hi ${firstName},\n\nThank you for taking the time to share your idea on Ripple. We genuinely appreciate every contribution — the thinking, the effort, and the commitment to making Ion Exchange better.\n\nAfter careful evaluation by the Idea Review Committee, your idea "${idea.title}" (${idea.id}) was not selected for implementation in this cycle.\n\nThis does not mean the idea lacks merit — evaluation is always contextual, and timing, feasibility, and current priorities all play a role. We encourage you to revisit and resubmit this idea, or bring a new one, in the next Ripple cycle.\n\nThank you for being part of Ripple.\n\nWarm regards,\nTeam Ripple | Talent Management & OD`;
                  onAddNotification(
                    idea.employeeEmail,
                    `[Annexure 5] Your Ripple idea ${idea.id} — update from the review committee`,
                    annex5Body
                  );
                  alert(`IRC Evaluation Finished! Average Score: ${avg.toFixed(2)}/25 is below the threshold of ${threshold.toFixed(1)}/25. Idea NOT SELECTED. Annexure 5 appreciative mail dispatched to ${idea.employeeEmail}.`);
                }
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold tracking-widest rounded-xl uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5" />
              Calculate Average & Conclude Stage Gate 2
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SelectedByIRC -> C-POC enters matching Functional Head assignment */}
      {idea.status === IdeaStatus.SelectedByIRC && persona.role === "C-POC" && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            IRC Handover - Assign Functional Head (Annexure 11)
          </h4>

          <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-[11px] text-emerald-950 leading-relaxed">
            🏆 <strong>Selection Complete:</strong> Selection Voucher of **Rs. 2,000** has been generated and dispatched to local Finance automatically!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-2">Matching Functional Head (FH)</label>
              <select
                value={selectedFH}
                onChange={(e) => setSelectedFH(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white rounded-xl transition-all text-xs"
              >
                <option value="Dr. Alok Gupta">Dr. Alok Gupta (R&D Centre Head)</option>
                <option value="Anil Sharma">Anil Sharma (Industrial Water VP)</option>
                <option value="Sunita Roy">Sunita Roy (Chemical Division head)</option>
                <option value="Vikram Malhotra">Vikram Malhotra (Home Solutions head)</option>
                <option value="Prakash Iyer">Prakash Iyer (Municipal Infrastructure director)</option>
                <option value="Meera Patel">Meera Patel (Services & O&M chief)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-widest text-[9.5px] mb-2">Handoff Instructions / Scope Details</label>
              <input
                type="text"
                value={fhAssignmentComments}
                onChange={(e) => setFhAssignmentComments(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleCPOCAssignFH}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold tracking-widest rounded-xl uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            File Handoff Mail to FH
          </button>
        </div>
      )}

      {/* STEP 6: WithFunctionalHead -> FH Decision (Annexure 7) */}
      {idea.status === IdeaStatus.WithFunctionalHead && persona.role === "Functional Head" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-900 to-blue-900 px-5 py-4 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-300 flex-shrink-0" />
            <div>
              <p className="text-white font-black text-[11px] uppercase tracking-widest">Step 1 — Acceptance &amp; Team Assignment</p>
              <p className="text-indigo-300 text-[9.5px] mt-0.5">Annexure 7 · Idea to Project Implementation Decision · Functional Head</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Block 1: Auto-filled read-only */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Auto-Filled — Read Only</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea ID</span>
                  <span className="font-mono font-bold text-slate-800">{idea.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Area of Impact</span>
                  <span className="text-slate-700">{idea.areaOfImpact}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea Title (Original)</span>
                  <span className="text-slate-800 font-medium">&ldquo;{idea.title}&rdquo;</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea Owner (Submitter)</span>
                    <span className="text-slate-800 font-medium">{idea.employeeName}</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-bold rounded uppercase tracking-wide mt-3">25% reward recipient</span>
                </div>
              </div>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Project Title <span className="text-rose-500">*</span>
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(Confirm or refine for implementation — max 80 chars)</span>
              </label>
              <input
                type="text"
                value={fhProjectTitle}
                maxLength={80}
                onChange={e => setFhProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <p className="text-right text-[9px] text-slate-400 mt-0.5">{fhProjectTitle.length}/80</p>
            </div>

            {/* Decision toggle */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Decision <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-3">
                {(["Accept", "Reject"] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFhDecisionChoice(opt)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                      fhDecisionChoice === opt
                        ? opt === "Accept"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {opt === "Accept" ? "✓ Accept" : "✕ Reject"}
                  </button>
                ))}
              </div>
            </div>

            {/* Reject: reason textarea */}
            {fhDecisionChoice === "Reject" && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                <label className="block text-[9.5px] font-bold uppercase tracking-widest text-rose-700">
                  Reason for Not Proceeding <span className="text-rose-500">*</span>
                  <span className="ml-1 text-rose-400 normal-case font-normal tracking-normal">(~50 words — internal record only)</span>
                </label>
                <textarea
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Resource constraints, doesn't fit current priorities, technically not feasible right now, overlaps with an existing initiative..."
                  className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-rose-300 focus:outline-none resize-none"
                />
                <p className="text-[9.5px] text-rose-600 italic">
                  The employee-facing closure mail is carefully worded — it confirms IRC selection stands and explains in neutral terms that the implementation path could not proceed.
                </p>
              </div>
            )}

            {/* Accept: team rows + plan owner + reward checkbox */}
            {fhDecisionChoice === "Accept" && (
              <div className="space-y-5">

                {/* Implementation team */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9.5px] font-bold uppercase tracking-widest text-slate-500">
                      Implementation Team <span className="text-rose-500">*</span>
                      <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(Name + Business Email per row)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setTeamRows(prev => [...prev, { name: "", email: "" }])}
                      className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-bold rounded-lg uppercase tracking-wider hover:bg-indigo-100 transition-all cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" /> Add Row
                    </button>
                  </div>
                  <div className="space-y-2">
                    {teamRows.map((row, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => {
                            const u = [...teamRows];
                            const old = u[i].name;
                            u[i] = { ...u[i], name: e.target.value };
                            setTeamRows(u);
                            if (nominatedOwner === old) setNominatedOwner(e.target.value);
                          }}
                          placeholder="Full Name"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        />
                        <input
                          type="email"
                          value={row.email}
                          onChange={e => {
                            const u = [...teamRows];
                            u[i] = { ...u[i], email: e.target.value };
                            setTeamRows(u);
                          }}
                          placeholder="business@ionexchange.com"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        />
                        {teamRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const u = teamRows.filter((_, idx) => idx !== i);
                              setTeamRows(u);
                              if (nominatedOwner === row.name) setNominatedOwner("");
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nominated Plan Owner */}
                <div>
                  <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Nominated Plan Owner <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(will draft &amp; submit Step 2 Action Plan — can be the FH)</span>
                  </label>
                  <select
                    value={nominatedOwner}
                    onChange={e => setNominatedOwner(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="">— Select from team above —</option>
                    {teamRows.filter(r => r.name.trim()).map((r, i) => (
                      <option key={i} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* Reward confirmation */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rewardConfirmed}
                      onChange={e => setRewardConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-amber-600 flex-shrink-0"
                    />
                    <span className="text-[11px] text-amber-800 leading-relaxed">
                      I confirm the team listed above is eligible for the <strong>75% team reward pool</strong> on successful completion.
                      The Idea Owner (<strong>{idea.employeeName}</strong>) will receive the <strong>25% individual share</strong> per Ripple&rsquo;s reward structure.
                    </span>
                  </label>
                </div>

              </div>
            )}

            {/* Submit button */}
            {fhDecisionChoice && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleFHSubmit}
                  className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                    fhDecisionChoice === "Accept"
                      ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      : "bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white"
                  }`}
                >
                  {fhDecisionChoice === "Accept"
                    ? "✓ Submit Step 1 — Confirm Acceptance & Assign Team"
                    : "✕ Submit Decision — Reject & Close FH Path"}
                </button>
                {fhDecisionChoice === "Accept" && (
                  <p className="text-center text-[9.5px] text-slate-400 mt-1.5">
                    Step 2 (Action Plan) must be submitted by the Plan Owner within 3 working days.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* STEP 7: Plan Owner submits Action Plan (Step 2 — Pilot Project spec) */}
      {(idea.status === IdeaStatus.AwaitingActionPlan || idea.status === IdeaStatus.ActionPlanRevision) && persona.role === "Plan Owner" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-linear-to-r from-emerald-900 to-teal-800 px-5 py-4 flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-white font-black text-[11px] uppercase tracking-widest">Step 2 — Pilot Project Action Plan</p>
              <p className="text-emerald-300 text-[9.5px] mt-0.5">Nominated Plan Owner · Expected: ~20–30 min · Submit within 3 working days of Step 1</p>
            </div>
          </div>
          <div className="p-5 space-y-5">
            {idea.status === IdeaStatus.ActionPlanRevision && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900">
                <strong>FH Revision Feedback:</strong> &ldquo;{idea.fhPlanRejectReason}&rdquo;
                <p className="text-amber-700 text-[9.5px] mt-1">Note: This is your final revision round — the next FH decision will be Approve or Reject only.</p>
              </div>
            )}

            {/* Auto-filled header */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Auto-Filled — Read Only</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px]">
                <div className="col-span-2">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Project Title</span>
                  <span className="text-slate-800 font-medium">{idea.fhProjectTitle || idea.actionPlanTitle || idea.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea Owner</span>
                  <span className="text-slate-700">{idea.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Implementation Team</span>
                  <span className="text-slate-700">{(idea.allocatedTeamMembers || []).join(", ") || idea.projectLeadName}</span>
                </div>
              </div>
            </div>

            {/* KRA */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                KRA — What this pilot will improve <span className="text-rose-500">*</span>
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(one line)</span>
              </label>
              <input type="text" value={apKRA} onChange={e => setApKRA(e.target.value)}
                placeholder="e.g. Reduce manual effort in monthly attendance reconciliation across cluster plants."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
            </div>

            {/* Primary KPI */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-[9.5px] font-bold uppercase tracking-widest text-slate-500">Primary KPI</p>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Metric Name <span className="text-rose-500">*</span></label>
                <input type="text" value={apKPIName} onChange={e => setApKPIName(e.target.value)}
                  placeholder="e.g. Time taken per attendance reconciliation cycle (days)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-300 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Baseline <span className="text-rose-500">*</span></label>
                  <input type="text" value={apKPIBaseline} onChange={e => setApKPIBaseline(e.target.value)}
                    placeholder="e.g. 3 working days per cycle"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-300 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target <span className="text-rose-500">*</span></label>
                  <input type="text" value={apKPITarget} onChange={e => setApKPITarget(e.target.value)}
                    placeholder="e.g. 1 working day per cycle"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-300 focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Financial translation */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Financial Translation <span className="text-rose-500">*</span>
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(show the calculation ~60 words — or write &lsquo;Primarily non-financial&rsquo; and explain)</span>
              </label>
              <textarea value={apFinancialTranslation} onChange={e => setApFinancialTranslation(e.target.value)} rows={3}
                placeholder="e.g. 2 days saved × 2 people × ₹2,000/day × 12 cycles/year = ~₹9.6L/year."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
            </div>

            {/* Success threshold */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-[9.5px] font-bold uppercase tracking-widest text-indigo-700 mb-3">
                Success Threshold <span className="text-rose-500">*</span>
                <span className="ml-1 text-indigo-400 normal-case font-normal tracking-normal">(basis for Block 12 reward assessment)</span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-indigo-500 mb-1">✓ Success ≥ (%)</label>
                  <input type="number" value={apSuccessThreshold} min={1} max={100} onChange={e => setApSuccessThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-mono text-indigo-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-amber-600 mb-1">~ Partial ≥ (%)</label>
                  <input type="number" value={apPartialThreshold} min={1} max={100} onChange={e => setApPartialThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-mono text-amber-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-rose-600 mb-1">✕ Did not work</label>
                  <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-mono text-rose-800 text-center">&lt; {apPartialThreshold}%</div>
                </div>
              </div>
            </div>

            {/* Qualitative benefits */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Qualitative / Secondary Benefits
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(optional — ~40 words)</span>
              </label>
              <textarea value={apQualitativeBenefits} onChange={e => setApQualitativeBenefits(e.target.value)} rows={2}
                placeholder="e.g. Reduces compliance risk; improves employee experience in reporting cycles..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                What needs to be true for this to work? <span className="text-rose-500">*</span>
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(2–3 bullets, ~60 words)</span>
              </label>
              <textarea value={apPrerequisites} onChange={e => setApPrerequisites(e.target.value)} rows={3}
                placeholder={"e.g.\n• IT will provide data access by Week 2\n• Team members available 2 days/week\n• Process adopted across at least 3 of the 4 plants"}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
            </div>

            {/* Milestones — 3 rows */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Key Milestones <span className="text-rose-500">*</span>
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(3 phase-level checkpoints + target dates)</span>
              </label>
              <div className="space-y-2">
                {apMilestoneRows.map((m, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-[9px] font-bold text-slate-400 w-5 flex-shrink-0">({i + 1})</span>
                    <input type="text" value={m.description}
                      onChange={e => { const u = [...apMilestoneRows]; u[i] = { ...u[i], description: e.target.value }; setApMilestoneRows(u); }}
                      placeholder={i === 0 ? "Process designed & team aligned" : i === 1 ? "Pilot live & mid-point review" : "Pilot complete & report submitted"}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-300 focus:outline-none" />
                    <input type="date" value={m.date}
                      onChange={e => { const u = [...apMilestoneRows]; u[i] = { ...u[i], date: e.target.value }; setApMilestoneRows(u); }}
                      className="w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-300 focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Risks / Dependencies to Flag
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(optional, top 1–2, ~40 words)</span>
              </label>
              <textarea value={apRisks} onChange={e => setApRisks(e.target.value)} rows={2}
                placeholder="e.g. IT system access may be delayed; one team member on leave in Month 2..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
            </div>

            {/* Resources committed */}
            <div>
              <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Resources Committed <span className="text-rose-500">*</span>
                <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(people-time, budget, tools, approvals — ~40 words)</span>
              </label>
              <textarea value={apResources} onChange={e => setApResources(e.target.value)} rows={2}
                placeholder="e.g. 3 engineers × 2 days/week for 3 months; pilot budget Rs. 1.5L approved; IT sandbox access confirmed."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-slate-100">
              <button type="button" onClick={handleActionPlanSubmission}
                className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm">
                Submit Action Plan to Functional Head
              </button>
              <p className="text-center text-[9.5px] text-slate-400 mt-1.5">Functional Head and C-POC notified automatically on submit.</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: ActionPlanSubmitted -> FH Evaluates Action Plan (Step 2 FH Approval) */}
      {idea.status === IdeaStatus.ActionPlanSubmitted && persona.role === "Functional Head" && (() => {
        const sendBackCount = idea.apSendBackCount || 0;
        const canSendBack = sendBackCount < 1;
        return (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-900 to-indigo-800 px-5 py-4 flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-blue-300 flex-shrink-0" />
              <div>
                <p className="text-white font-black text-[11px] uppercase tracking-widest">Step 2 Review — Functional Head Approval</p>
                <p className="text-blue-300 text-[9.5px] mt-0.5">Approve · Send-back · Reject{!canSendBack ? " · Send-back limit reached" : ""}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {/* Plan summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-[11px]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Submitted Plan</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2"><strong>Project:</strong> {idea.actionPlanTitle || idea.fhProjectTitle || idea.title}</div>
                  <div><strong>Plan Owner:</strong> {idea.projectLeadName}</div>
                  <div><strong>Team:</strong> {(idea.allocatedTeamMembers || []).join(", ")}</div>
                </div>
                {idea.apKRA && <div><strong>KRA:</strong> {idea.apKRA}</div>}
                {idea.apKPIName && (
                  <div className="grid grid-cols-3 gap-3 bg-white border border-slate-100 rounded-lg p-3 text-[10px]">
                    <div><span className="text-[8.5px] text-slate-400 block uppercase tracking-wider mb-0.5">KPI</span>{idea.apKPIName}</div>
                    <div><span className="text-[8.5px] text-slate-400 block uppercase tracking-wider mb-0.5">Baseline</span>{idea.apKPIBaseline}</div>
                    <div><span className="text-[8.5px] text-slate-400 block uppercase tracking-wider mb-0.5">Target</span><strong className="text-emerald-700">{idea.apKPITarget}</strong></div>
                  </div>
                )}
                {idea.apFinancialTranslation && <div><strong>Financial impact:</strong> {idea.apFinancialTranslation}</div>}
                {idea.apSuccessThreshold !== undefined && (
                  <div className="flex gap-2 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">Success ≥ {idea.apSuccessThreshold}%</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">Partial ≥ {idea.apPartialThreshold}%</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold">Did not work &lt; {idea.apPartialThreshold}%</span>
                  </div>
                )}
                {idea.apMilestones && (
                  <div>
                    <strong>Milestones:</strong>
                    <div className="mt-1 space-y-1">
                      {idea.apMilestones.map((m, i) => (
                        <div key={i} className="flex gap-2 text-[10px]">
                          <span className="text-slate-400">({i + 1})</span>
                          <span>{m.description}</span>
                          <span className="ml-auto font-mono text-slate-500">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {idea.apPrerequisites && <div><strong>Prerequisites:</strong> <span className="whitespace-pre-line text-slate-600">{idea.apPrerequisites}</span></div>}
                {idea.apResources && <div><strong>Resources:</strong> {idea.apResources}</div>}
                {idea.apRisks && <div><strong>Risks flagged:</strong> <span className="text-amber-700">{idea.apRisks}</span></div>}
                {idea.apQualitativeBenefits && <div><strong>Qualitative benefits:</strong> {idea.apQualitativeBenefits}</div>}
              </div>

              {/* Decision toggle */}
              <div>
                <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Decision <span className="text-rose-500">*</span>
                  {!canSendBack && <span className="ml-2 text-amber-600 normal-case font-normal tracking-normal">(Send-back limit reached — Approve or Reject only)</span>}
                </label>
                <div className="flex gap-3 flex-wrap">
                  {(["Approve", ...(canSendBack ? ["Send-back"] : []), "Reject"] as ("Approve" | "Send-back" | "Reject")[]).map(opt => (
                    <button key={opt} type="button" onClick={() => setFhPlanChoice(opt)}
                      className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                        fhPlanChoice === opt
                          ? opt === "Approve" ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : opt === "Send-back" ? "bg-amber-500 text-white border-amber-500 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                      }`}>
                      {opt === "Approve" ? "✓ Approve" : opt === "Send-back" ? "↩ Send-back" : "✕ Reject"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional feedback */}
              {(fhPlanChoice === "Send-back" || fhPlanChoice === "Reject") && (
                <div className={`border rounded-xl p-4 space-y-2 ${fhPlanChoice === "Send-back" ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200"}`}>
                  <label className={`block text-[9.5px] font-bold uppercase tracking-widest ${fhPlanChoice === "Send-back" ? "text-amber-700" : "text-rose-700"}`}>
                    {fhPlanChoice === "Send-back" ? "Revision Feedback" : "Reject Reason"} <span className="text-rose-500">*</span>
                  </label>
                  <textarea value={fhPlanRemarks} onChange={e => setFHPlanRemarks(e.target.value)} rows={3}
                    placeholder={fhPlanChoice === "Send-back" ? "What specifically needs to be revised or clarified..." : "Why this plan cannot proceed at this stage..."}
                    className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none resize-none" />
                  {fhPlanChoice === "Reject" && <p className="text-[9.5px] text-rose-600 italic">The employee-facing closure mail confirms IRC selection stands; this is for internal record.</p>}
                </div>
              )}

              {/* Submit */}
              {fhPlanChoice && (
                <div className="pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => handleActionPlanReview(fhPlanChoice as "Approve" | "Send-back" | "Reject")}
                    className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                      fhPlanChoice === "Approve" ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      : fhPlanChoice === "Send-back" ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      : "bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white"
                    }`}>
                    {fhPlanChoice === "Approve" ? "✓ Approve Action Plan — Lock & Start Implementation"
                    : fhPlanChoice === "Send-back" ? "↩ Send Back for Revision"
                    : "✕ Reject Action Plan"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* STEP 9: Plan Owner — Project Report (full spec, Sections A + B) */}
      {(idea.status === IdeaStatus.ActionPlanApproved || idea.status === IdeaStatus.ReportRevision) && persona.role === "Plan Owner" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-linear-to-r from-slate-800 to-slate-700 px-5 py-4 flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-300 flex-shrink-0" />
            <div>
              <p className="text-white font-black text-[11px] uppercase tracking-widest">Project Report — Pilot Completion</p>
              <p className="text-slate-400 text-[9.5px] mt-0.5">Submit when pilot is complete. FH reviews before routing to Finance.</p>
            </div>
          </div>
          <div className="p-5 space-y-5">

            {/* FH send-back feedback */}
            {idea.status === IdeaStatus.ReportRevision && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900">
                <strong>FH Revision Feedback:</strong> &ldquo;{idea.fhReportRemarks}&rdquo;
                {(idea.rptSendBackCount || 0) >= 1 && (
                  <p className="text-amber-700 text-[9.5px] mt-1">This is your final revision round — the next FH decision will be Approve or Reject only.</p>
                )}
              </div>
            )}

            {/* Auto-filled header */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Auto-Filled Header — Read Only</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[10.5px]">
                <div className="col-span-2">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Project Title</span>
                  <span className="text-slate-800 font-medium">{idea.fhProjectTitle || idea.actionPlanTitle || idea.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea ID</span>
                  <span className="text-slate-700 font-mono">{idea.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea Owner</span>
                  <span className="text-slate-700">{idea.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Functional Head</span>
                  <span className="text-slate-700">{idea.assignedFHName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Plan Owner</span>
                  <span className="text-slate-700">{idea.projectLeadName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Implementation Team</span>
                  <span className="text-slate-700">{(idea.allocatedTeamMembers || []).join(', ') || '—'}</span>
                </div>
                {idea.apKRA && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">KRA (committed)</span>
                    <span className="text-slate-700">{idea.apKRA}</span>
                  </div>
                )}
                {idea.apKPIName && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">KPI — Metric / Baseline / Target</span>
                    <span className="text-slate-700">{idea.apKPIName} | Baseline: {idea.apKPIBaseline} → Target: {idea.apKPITarget}</span>
                  </div>
                )}
                {idea.apFinancialTranslation && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Financial Impact Target (committed)</span>
                    <span className="text-slate-700">{idea.apFinancialTranslation}</span>
                  </div>
                )}
                {idea.apSuccessThreshold !== undefined && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-1">Success Thresholds (committed)</span>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9.5px] font-bold">Success ≥ {idea.apSuccessThreshold}%</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9.5px] font-bold">Partial ≥ {idea.apPartialThreshold}%</span>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9.5px] font-bold">Did not work &lt; {idea.apPartialThreshold}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION A: Pilot Outcome */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-700 px-4 py-2.5">
                <p className="text-white font-bold text-[10px] uppercase tracking-widest">A. Pilot Outcome</p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Brief description of what was done <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(~80 words — approach, location, team)</span>
                  </label>
                  <textarea value={rptPilotDescription} onChange={e => setRptPilotDescription(e.target.value)} rows={4}
                    placeholder="Summarize the approach taken in the pilot — what was actually implemented, where, with whom. ~80 words."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Actual KPI achieved <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" value={rptActualKPI} onChange={e => setRptActualKPI(e.target.value)}
                    placeholder={`e.g. Reconciliation time: 1.2 days per cycle (against target of ${idea.apKPITarget || '—'})`}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Time period measured + annualization basis <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" value={rptMeasurementPeriod} onChange={e => setRptMeasurementPeriod(e.target.value)}
                    placeholder="e.g. Measured over last 3 months (Apr–Jun 2026), 4 plant cycles; annualized by multiplying quarterly figure ×4."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-indigo-700 mb-2">
                    % of KPI target achieved <span className="text-rose-500">*</span>
                    <span className="ml-1 text-indigo-400 normal-case font-normal tracking-normal">(Actual ÷ Target × 100; override if qualitative)</span>
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input type="number" value={rptPctTarget} min={0} max={200}
                      onChange={e => setRptPctTarget(Number(e.target.value))}
                      className="w-28 px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-mono font-bold text-indigo-900 focus:outline-none" />
                    <span className="text-[10.5px] text-indigo-700 font-bold">%</span>
                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                      rptPctTarget >= (idea.apSuccessThreshold ?? 80) ? 'bg-emerald-100 text-emerald-700'
                      : rptPctTarget >= (idea.apPartialThreshold ?? 50) ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                    }`}>
                      {rptPctTarget >= (idea.apSuccessThreshold ?? 80) ? '✓ Success'
                        : rptPctTarget >= (idea.apPartialThreshold ?? 50) ? '~ Partial Success'
                        : '✕ Did not work'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: Financial Impact */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-700 px-4 py-2.5">
                <p className="text-white font-bold text-[10px] uppercase tracking-widest">B. Financial Impact</p>
              </div>
              <div className="bg-amber-50/60 border-b border-amber-100 px-4 py-2.5 text-[9.5px] text-amber-800">
                This section will be vetted by Finance in Block 12. Be specific — vague claims will be sent back. The reward depends on this being defensible.
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Actual financial impact achieved (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" value={rptActualFinancialImpact} onChange={e => setRptActualFinancialImpact(e.target.value)}
                    placeholder="e.g. Approx ₹8.5L per annum (against target of ₹9.6L per annum)."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Calculation methodology <span className="text-rose-500">*</span>
                    <span className="ml-1 text-rose-400 normal-case font-normal tracking-normal">MANDATORY — step-by-step, ~80 words</span>
                  </label>
                  <textarea value={rptCalcMethodology} onChange={e => setRptCalcMethodology(e.target.value)} rows={3}
                    placeholder={"e.g. 1.8 days saved per cycle × 2 people × ₹2,000/day × 12 cycles/year = ~₹8.5L/year. Finance will validate this."}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Type of impact <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(select all that apply)</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['Cost saving', 'Cost avoidance', 'Revenue gain', 'Productivity reallocation'].map(t => (
                      <button key={t} type="button"
                        onClick={() => setRptImpactTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                          rptImpactTypes.includes(t)
                            ? 'bg-slate-700 text-white border-slate-700'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                        }`}>
                        {rptImpactTypes.includes(t) ? '✓ ' : ''}{t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5">Cost saving = reduces existing spend · Cost avoidance = prevents future spend · Revenue gain = new income · Productivity reallocation = hours freed.</p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Recurring or one-time? <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(reward slab is sensitive to this)</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {(['Annual recurring', 'One-time', 'Mix'] as const).map(r => (
                      <button key={r} type="button" onClick={() => setRptRecurringType(r)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                          rptRecurringType === r
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                        }`}>
                        {rptRecurringType === r ? '● ' : '○ '}{r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Key assumptions used in the calculation <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(rates, headcount, volumes — ~60 words, bullets)</span>
                  </label>
                  <textarea value={rptAssumptions} onChange={e => setRptAssumptions(e.target.value)} rows={3}
                    placeholder={"e.g.\n• Avg cost per resource hour = ₹250 (blended)\n• Plant cycles per year = 12\n• 2 people involved in reconciliation"}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Evidence / data source for actuals <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(~50 words — Finance will ask for this)</span>
                  </label>
                  <textarea value={rptEvidenceSource} onChange={e => setRptEvidenceSource(e.target.value)} rows={2}
                    placeholder="e.g. HRMS attendance reports for Apr–Jun 2026; time study conducted by HR team in May 2026; cross-checked with payroll input cycles."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                      One-time implementation cost <span className="text-rose-500">*</span>
                    </label>
                    <input type="text" value={rptImplCost} onChange={e => setRptImplCost(e.target.value)}
                      placeholder="e.g. ₹25,000 or '0' / 'None'"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                      Ongoing / recurring costs <span className="text-rose-500">*</span>
                    </label>
                    <input type="text" value={rptOngoingCost} onChange={e => setRptOngoingCost(e.target.value)}
                      placeholder="e.g. ₹12,000/year (software) or '0' / 'None'"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Overlap check — is any of this impact already counted elsewhere? <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    {(['No overlap', 'Yes'] as const).map(o => (
                      <button key={o} type="button" onClick={() => setRptOverlapCheck(o)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                          rptOverlapCheck === o
                            ? o === 'No overlap' ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                        }`}>
                        {rptOverlapCheck === o ? '● ' : '○ '}{o}
                      </button>
                    ))}
                  </div>
                  {rptOverlapCheck === 'Yes' && (
                    <textarea value={rptOverlapNote} onChange={e => setRptOverlapNote(e.target.value)} rows={2}
                      placeholder="Name the initiative and explain how this avoids double-counting…"
                      className="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none" />
                  )}
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Indirect / adjacent benefits not claimed above
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(optional — ~40 words)</span>
                  </label>
                  <textarea value={rptIndirectBenefits} onChange={e => setRptIndirectBenefits(e.target.value)} rows={2}
                    placeholder="e.g. Error reduction, compliance improvement, employee experience, customer satisfaction, safety…"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-slate-100">
              <button type="button" onClick={handleReportSubmission}
                className="w-full py-3 bg-linear-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm">
                Submit Project Report to Functional Head
              </button>
              <p className="text-center text-[9.5px] text-slate-400 mt-1.5">Functional Head and C-POC notified automatically on submit.</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 10: ReportSubmitted -> FH reviews Project Report */}
      {idea.status === IdeaStatus.ReportSubmitted && persona.role === "Functional Head" && (() => {
        const rptSBCount = idea.rptSendBackCount || 0;
        const canSendBack = rptSBCount < 1;
        return (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-linear-to-r from-slate-800 to-indigo-900 px-5 py-4 flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-slate-300 flex-shrink-0" />
              <div>
                <p className="text-white font-black text-[11px] uppercase tracking-widest">Project Report Review — Functional Head</p>
                <p className="text-slate-400 text-[9.5px] mt-0.5">Approve · Send-back · Reject{!canSendBack ? " · Send-back limit reached" : ""}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {/* Report summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-[11px]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Submitted Report</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Plan Owner:</strong> {idea.projectLeadName}</div>
                  <div><strong>% Target achieved:</strong> <span className={`font-bold ${(idea.rptPctTargetAchieved ?? 0) >= (idea.apSuccessThreshold ?? 80) ? 'text-emerald-700' : (idea.rptPctTargetAchieved ?? 0) >= (idea.apPartialThreshold ?? 50) ? 'text-amber-700' : 'text-rose-700'}`}>{idea.rptPctTargetAchieved ?? '—'}%</span></div>
                </div>
                {idea.rptPilotDescription && <div><strong>What was done:</strong> <span className="text-slate-600">{idea.rptPilotDescription}</span></div>}
                {idea.rptActualKPI && <div><strong>Actual KPI:</strong> {idea.rptActualKPI}</div>}
                {idea.rptMeasurementPeriod && <div><strong>Period / Annualization:</strong> {idea.rptMeasurementPeriod}</div>}
                {idea.rptActualFinancialImpact && <div><strong>Financial impact:</strong> {idea.rptActualFinancialImpact}</div>}
                {idea.rptCalculationMethodology && <div><strong>Calculation:</strong> <span className="text-slate-600">{idea.rptCalculationMethodology}</span></div>}
                {(idea.rptImpactTypes || []).length > 0 && (
                  <div className="flex gap-1.5 flex-wrap items-center">
                    {(idea.rptImpactTypes || []).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-bold">{t}</span>
                    ))}
                    {idea.rptRecurringType && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold">{idea.rptRecurringType}</span>
                    )}
                  </div>
                )}
                {idea.rptImplCost && <div><strong>Impl. cost:</strong> {idea.rptImplCost} · <strong>Ongoing:</strong> {idea.rptOngoingCost}</div>}
                {idea.rptOverlapCheck && <div><strong>Overlap:</strong> {idea.rptOverlapCheck}{idea.rptOverlapNote ? ` — ${idea.rptOverlapNote}` : ''}</div>}
                {idea.rptAssumptions && <div><strong>Assumptions:</strong> <span className="whitespace-pre-line text-slate-600">{idea.rptAssumptions}</span></div>}
                {idea.rptEvidenceSource && <div><strong>Evidence source:</strong> {idea.rptEvidenceSource}</div>}
                {idea.rptIndirectBenefits && <div><strong>Indirect benefits:</strong> {idea.rptIndirectBenefits}</div>}
              </div>

              {/* Decision toggle */}
              <div>
                <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Decision <span className="text-rose-500">*</span>
                  {!canSendBack && <span className="ml-2 text-amber-600 normal-case font-normal tracking-normal">(Send-back limit reached — Approve or Reject only)</span>}
                </label>
                <div className="flex gap-3 flex-wrap">
                  {(["Approve", ...(canSendBack ? ["Send-back"] : []), "Reject"] as ("Approve" | "Send-back" | "Reject")[]).map(opt => (
                    <button key={opt} type="button" onClick={() => setFhReportChoice(opt)}
                      className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                        fhReportChoice === opt
                          ? opt === "Approve" ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : opt === "Send-back" ? "bg-amber-500 text-white border-amber-500 shadow-md"
                          : "bg-rose-600 text-white border-rose-600 shadow-md"
                          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                      }`}>
                      {opt === "Approve" ? "✓ Approve" : opt === "Send-back" ? "↩ Send-back" : "✕ Reject"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional feedback */}
              {(fhReportChoice === "Send-back" || fhReportChoice === "Reject") && (
                <div className={`border rounded-xl p-4 space-y-2 ${fhReportChoice === "Send-back" ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200"}`}>
                  <label className={`block text-[9.5px] font-bold uppercase tracking-widest ${fhReportChoice === "Send-back" ? "text-amber-700" : "text-rose-700"}`}>
                    {fhReportChoice === "Send-back" ? "Revision Feedback" : "Reject Reason"} <span className="text-rose-500">*</span>
                  </label>
                  <textarea value={fhReportRemarks} onChange={e => setFHReportRemarks(e.target.value)} rows={3}
                    placeholder={fhReportChoice === "Send-back" ? "Which section(s) need revision, and what specifically…" : "Why this report cannot be routed to Finance…"}
                    className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none resize-none" />
                  {fhReportChoice === "Reject" && <p className="text-[9.5px] text-rose-600 italic">Rejection closes this report. C-POC and IRC are notified that the pilot did not deliver and reward will not be processed.</p>}
                </div>
              )}

              {/* Submit */}
              {fhReportChoice && (
                <div className="pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => handleFHReportReview(fhReportChoice as "Approve" | "Send-back" | "Reject")}
                    className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                      fhReportChoice === "Approve" ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      : fhReportChoice === "Send-back" ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      : "bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white"
                    }`}>
                    {fhReportChoice === "Approve" ? "✓ Approve Report — Route to Finance"
                    : fhReportChoice === "Send-back" ? "↩ Send Back for Revision"
                    : "✕ Reject Project Report"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* STEP 11a: FinanceRevision -> Plan Owner revises financial report */}
      {idea.status === IdeaStatus.FinanceRevision && persona.role === "Plan Owner" && (
        <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden">
          <div className="bg-linear-to-r from-amber-600 to-orange-600 px-5 py-4 flex items-center gap-2.5">
            <Landmark className="w-4 h-4 text-amber-100 flex-shrink-0" />
            <div>
              <p className="text-white font-black text-[11px] uppercase tracking-widest">Finance Financial Review — Revision Required</p>
              <p className="text-amber-100 text-[9.5px] mt-0.5">Finance has reviewed the financial section of your report. Please revise and resubmit.</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* Finance feedback */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900">
              <strong>Finance Send-back — Round {idea.financeSendBackCount}/2</strong>
              {(idea.finSendBackChecklist || []).length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {(idea.finSendBackChecklist || []).map(item => (
                    <p key={item} className="text-[10px] font-bold text-amber-800">• {item}</p>
                  ))}
                </div>
              )}
              {idea.financeFeedback && <p className="mt-2 whitespace-pre-line text-[10px]">{idea.financeFeedback}</p>}
              {idea.financeSendBackCount >= 2 && (
                <p className="mt-2 text-amber-700 font-bold text-[9.5px]">⚠ This is the final revision round — Finance will Validate or mark No Quantifiable Financial Benefit on your next submission.</p>
              )}
            </div>

            {/* Section B — editable financial fields */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-700 px-4 py-2.5">
                <p className="text-white font-bold text-[10px] uppercase tracking-widest">B. Financial Impact — Revision</p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Actual financial impact achieved (₹) <span className="text-rose-500">*</span></label>
                  <input type="text" value={rptActualFinancialImpact} onChange={e => setRptActualFinancialImpact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Calculation methodology <span className="text-rose-500">*</span> <span className="text-rose-400 normal-case font-normal tracking-normal">step-by-step</span></label>
                  <textarea value={rptCalcMethodology} onChange={e => setRptCalcMethodology(e.target.value)} rows={3}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Key assumptions</label>
                    <textarea value={rptAssumptions} onChange={e => setRptAssumptions(e.target.value)} rows={2}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Evidence / data source</label>
                    <textarea value={rptEvidenceSource} onChange={e => setRptEvidenceSource(e.target.value)} rows={2}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">One-time implementation cost</label>
                    <input type="text" value={rptImplCost} onChange={e => setRptImplCost(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Ongoing / recurring costs</label>
                    <input type="text" value={rptOngoingCost} onChange={e => setRptOngoingCost(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Overlap check</label>
                  <div className="flex gap-2 mb-2">
                    {(['No overlap', 'Yes'] as const).map(o => (
                      <button key={o} type="button" onClick={() => setRptOverlapCheck(o)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${rptOverlapCheck === o ? o === 'No overlap' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-300'}`}>
                        {rptOverlapCheck === o ? '● ' : '○ '}{o}
                      </button>
                    ))}
                  </div>
                  {rptOverlapCheck === 'Yes' && (
                    <textarea value={rptOverlapNote} onChange={e => setRptOverlapNote(e.target.value)} rows={2}
                      placeholder="Explain overlap and how double-counting is avoided…"
                      className="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs resize-none" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button type="button" onClick={handleFinanceResubmit}
                className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm">
                Resubmit Financial Report to Finance
              </button>
              <p className="text-center text-[9.5px] text-slate-400 mt-1.5">Finance and C-POC notified automatically on resubmit.</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 11: PendingFinanceEvaluation -> Finance validates financial impact */}
      {idea.status === IdeaStatus.PendingFinanceEvaluation && persona.role === "Finance" && (() => {
        const sbCount = idea.financeSendBackCount || 0;
        const canSendBack = sbCount < 2;
        return (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-linear-to-r from-teal-800 to-teal-700 px-5 py-4 flex items-center gap-2.5">
              <Landmark className="w-4 h-4 text-teal-300 flex-shrink-0" />
              <div>
                <p className="text-white font-black text-[11px] uppercase tracking-widest">Financial Impact Validation — Finance</p>
                <p className="text-teal-300 text-[9.5px] mt-0.5">Finance certifies the net annualized ₹ impact. The project is already approved — Finance only validates the figure for the reward slab.</p>
              </div>
            </div>
            <div className="p-5 space-y-5">

              {/* Revision notice */}
              {sbCount > 0 && (
                <div className={`border rounded-xl p-3.5 text-[10.5px] ${sbCount >= 2 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                  {sbCount >= 2
                    ? `⚠ Send-back limit reached (2/2). You can only Validate or mark No quantifiable financial benefit — no further send-backs.`
                    : `Round ${sbCount + 1} of max 2. Plan Owner has revised and resubmitted — please review the updated financial figures below.`}
                </div>
              )}

              {/* Auto-filled section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Under Validation — From Project Report (Read Only)</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[10.5px]">
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Project Title</span>
                    <span className="text-slate-800 font-medium">{idea.fhProjectTitle || idea.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Idea ID</span>
                    <span className="font-mono text-slate-700">{idea.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Plan Owner</span>
                    <span className="text-slate-700">{idea.projectLeadName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Functional Head</span>
                    <span className="text-slate-700">{idea.assignedFHName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Team</span>
                    <span className="text-slate-700">{(idea.allocatedTeamMembers || []).join(', ') || '—'}</span>
                  </div>
                  {idea.rptActualFinancialImpact && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Claimed Actual ₹ Impact</span>
                      <span className="text-slate-800 font-bold">{idea.rptActualFinancialImpact}</span>
                    </div>
                  )}
                  {idea.rptCalculationMethodology && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Calculation Methodology</span>
                      <span className="text-slate-700 whitespace-pre-line">{idea.rptCalculationMethodology}</span>
                    </div>
                  )}
                  {idea.rptAssumptions && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Key Assumptions</span>
                      <span className="text-slate-700 whitespace-pre-line">{idea.rptAssumptions}</span>
                    </div>
                  )}
                  {idea.rptEvidenceSource && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Evidence / Data Source</span>
                      <span className="text-slate-700">{idea.rptEvidenceSource}</span>
                    </div>
                  )}
                  {idea.rptImplCost && (
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">One-time Impl. Cost</span>
                      <span className="text-slate-700">{idea.rptImplCost}</span>
                    </div>
                  )}
                  {idea.rptOngoingCost && (
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Ongoing / Recurring Cost</span>
                      <span className="text-slate-700">{idea.rptOngoingCost}</span>
                    </div>
                  )}
                  {idea.rptIndirectBenefits && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Indirect / Freed-up Time Benefits</span>
                      <span className="text-slate-700">{idea.rptIndirectBenefits}</span>
                    </div>
                  )}
                  {idea.rptOverlapCheck && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Overlap Check</span>
                      <span className="text-slate-700">{idea.rptOverlapCheck}{idea.rptOverlapNote ? ` — ${idea.rptOverlapNote}` : ''}</span>
                    </div>
                  )}
                  {idea.rptMeasurementPeriod && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Annualization Basis</span>
                      <span className="text-slate-700">{idea.rptMeasurementPeriod}</span>
                    </div>
                  )}
                  {((idea.rptImpactTypes || []).length > 0 || idea.rptRecurringType) && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-1">Type of Impact + Recurring</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {(idea.rptImpactTypes || []).map(t => (
                          <span key={t} className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-bold">{t}</span>
                        ))}
                        {idea.rptRecurringType && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold">{idea.rptRecurringType}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {idea.rptPctTargetAchieved !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">% of KPI Target Achieved</span>
                      <span className="font-bold text-slate-800">{idea.rptPctTargetAchieved}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decision toggle */}
              <div>
                <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Finance Decision <span className="text-rose-500">*</span>
                  {!canSendBack && <span className="ml-2 text-amber-600 normal-case font-normal tracking-normal">(Send-back limit reached)</span>}
                </label>
                <div className="flex gap-3 flex-wrap">
                  {(["Validate", ...(canSendBack ? ["Send-back"] : []), "No quantifiable financial benefit"] as ("Validate" | "Send-back" | "No quantifiable financial benefit")[]).map(opt => (
                    <button key={opt} type="button" onClick={() => setFinDecision(opt)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold border-2 transition-all cursor-pointer ${
                        finDecision === opt
                          ? opt === "Validate" ? "bg-teal-600 text-white border-teal-600 shadow-md"
                          : opt === "Send-back" ? "bg-amber-500 text-white border-amber-500 shadow-md"
                          : "bg-slate-600 text-white border-slate-600 shadow-md"
                          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                      }`}>
                      {opt === "Validate" ? "✓ Validate" : opt === "Send-back" ? "↩ Send-back" : "○ No Quantifiable Financial Benefit"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validate fields */}
              {finDecision === "Validate" && (
                <div className="border border-teal-200 bg-teal-50/30 rounded-xl p-4 space-y-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-teal-700">Certification Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                        Validated Net Annualized ₹ Impact <span className="text-rose-500">*</span>
                      </label>
                      <input type="number" value={finCertifiedAmount || ""} onChange={e => setFinCertifiedAmount(Number(e.target.value))}
                        placeholder="e.g. 850000"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-teal-400 focus:outline-none" />
                      {finCertifiedAmount > 0 && (
                        <p className="text-[9.5px] text-teal-700 mt-1 font-bold">
                          ₹{finCertifiedAmount.toLocaleString()} → Owner (25%): ₹{Math.round(finCertifiedAmount * 0.25).toLocaleString()} · Team ({idea.allocatedTeamMembers.length || 1} head): ₹{Math.round((finCertifiedAmount * 0.75) / (idea.allocatedTeamMembers.length || 1)).toLocaleString()}/head
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                        Reward Slab
                        <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(optional — enter slab/policy ref)</span>
                      </label>
                      <input type="text" value={finRewardSlab} onChange={e => setFinRewardSlab(e.target.value)}
                        placeholder="e.g. Slab B — ₹5L–₹15L → ₹50,000 total"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                      Adjustments made vs claimed figure
                      <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">(optional — if figure differs from Plan Owner's claim)</span>
                    </label>
                    <textarea value={finAdjustmentNote} onChange={e => setFinAdjustmentNote(e.target.value)} rows={2}
                      placeholder="e.g. Reduced blended rate from ₹2,000 to ₹1,750/day per Finance standard; applied 50% productivity discount as freed time is redeployed. Net certified: ₹8.5L/year."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none resize-none" />
                  </div>
                </div>
              )}

              {/* Send-back checklist */}
              {finDecision === "Send-back" && (
                <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4 space-y-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-amber-700">Send-back Checklist <span className="text-rose-500">*</span> — tick all items that apply</p>
                  <div className="space-y-2">
                    {Object.keys(FINANCE_SB_FEEDBACK).map(item => (
                      <label key={item} className="flex items-start gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={finSBChecklist.includes(item)}
                          onChange={() => setFinSBChecklist(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer flex-shrink-0" />
                        <div>
                          <p className="text-[10.5px] font-bold text-slate-700 group-hover:text-amber-700 transition-colors">{item}</p>
                          {finSBChecklist.includes(item) && (
                            <p className="text-[9.5px] text-amber-700 mt-0.5 leading-relaxed">{FINANCE_SB_FEEDBACK[item]}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Additional remarks <span className="text-slate-400 normal-case font-normal tracking-normal">(optional)</span></label>
                    <textarea value={finExtraRemarks} onChange={e => setFinExtraRemarks(e.target.value)} rows={2}
                      placeholder="Any additional context for the Plan Owner…"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none resize-none" />
                  </div>
                </div>
              )}

              {/* Qualitative note — mandatory for all decisions */}
              {finDecision && (
                <div>
                  <label className="block text-[9.5px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">
                    Overall Qualitative Note <span className="text-rose-500">*</span>
                    <span className="ml-1 text-slate-400 normal-case font-normal tracking-normal">mandatory for all decisions — Finance's key rationale</span>
                  </label>
                  <textarea value={finQualitativeNote} onChange={e => setFinQualitativeNote(e.target.value)} rows={3}
                    placeholder="Finance's overall assessment of the financial claim — key reasoning, any caveats, or why the figure was adjusted / cannot be certified."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none" />
                </div>
              )}

              {/* Submit */}
              {finDecision && (
                <div className="pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => handleFinanceEvaluation(finDecision as "Validate" | "Send-back" | "No quantifiable financial benefit")}
                    className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                      finDecision === "Validate" ? "bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
                      : finDecision === "Send-back" ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      : "bg-linear-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
                    }`}>
                    {finDecision === "Validate" ? "✓ Certify & Route to CFO for Sign-Off"
                    : finDecision === "Send-back" ? "↩ Send Back for Revision"
                    : "○ Mark No Quantifiable Financial Benefit"}
                  </button>
                  {finDecision === "No quantifiable financial benefit" && (
                    <p className="text-center text-[9.5px] text-slate-400 mt-1.5">Selection-stage recognition (₹2,000 voucher + Certificate from Block 6) remains intact. No financial-slab reward will be processed.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* STEP 12: PendingCFOSignOff -> CFO final payout signoff */}
      {idea.status === IdeaStatus.PendingCFOSignOff && persona.role === "CFO" && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-indigo-600" />
              CFO Incu-Payout Worksheet Clearance (Annexure 18)
            </h4>
            <span className="bg-yellow-50 text-yellow-700 font-mono text-[9px] px-2.5 py-0.5 rounded-full font-bold">Payout Lock</span>
          </div>

          <div className="p-5 bg-indigo-50 border border-indigo-150 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-800 text-[11px]">
            <div className="space-y-2 font-mono">
              <h5 className="font-sans font-bold text-indigo-950 uppercase text-[10px] tracking-wider mb-2">Audited Value</h5>
              <p>✔ Verified Net savings: <strong className="text-slate-900">Rs. {(idea.financeEvaluatedImpact || 0).toLocaleString()}</strong></p>
              <p>✔ Corporate Division: <span className="font-sans font-bold">{idea.businessUnit}</span></p>
              <p>✔ Assigned FH: <span className="font-sans font-bold text-slate-900">{idea.assignedFHName}</span></p>
              <p>✔ Project Lead: <span className="font-sans font-bold">{idea.projectLeadName}</span></p>
              <p>✔ Co-Menders Team: <span className="font-sans text-slate-600 break-all">{idea.allocatedTeamMembers.join(", ") || "No team assigned"}</span></p>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-indigo-200 pt-3 md:pt-0 md:pl-5 font-sans">
              <h5 className="font-bold text-indigo-950 uppercase text-[10px] tracking-wider mb-2">Dynamic Rewards Split (25 / 75 Policy)</h5>
              
              <div className="p-3 bg-white border border-indigo-100 rounded-xl space-y-1.5 shadow-2xs">
                <p className="flex justify-between font-mono text-xs">
                  <span className="text-slate-500 font-bold text-[9.5px] uppercase">Owner (25% Split):</span>
                  <strong className="text-indigo-800">Rs. {(idea.calculatedRewardIdeaOwner || 0).toLocaleString()}</strong>
                </p>
                <div className="text-[10px] text-slate-500 leading-snug">Disbursed to: {idea.employeeName}</div>
              </div>

              <div className="p-3 bg-white border border-indigo-100 rounded-xl space-y-1.5 shadow-2xs">
                <p className="flex justify-between font-mono text-xs">
                  <span className="text-slate-500 font-bold text-[9.5px] uppercase">Team (75% equal split):</span>
                  <strong className="text-indigo-800">Rs. {(idea.calculatedRewardTeamMembers || 0).toLocaleString()} / head</strong>
                </p>
                <div className="text-[10px] text-slate-500 leading-snug">Credited to team co-menders.</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCFOSignOff}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-bold tracking-widest rounded-xl uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <CheckSquare className="w-4 h-4 text-indigo-200" />
            Approve Final Disbursement & Sign Payouts
          </button>
        </div>
      )}

      {/* STEP 13: Completed -> Complete success page */}
      {idea.status === IdeaStatus.Completed && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl text-center space-y-5">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 border border-indigo-150 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-9 h-9" />
          </div>
          
          <div className="max-w-xl mx-auto space-y-2">
            <h4 className="font-display font-black text-slate-900 text-sm uppercase tracking-widest">
              Incubation Excellence Complete!
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              This project has successfully completed the entire 12-week RIPPLE Incubation cycle with certified savings 
              realized and payout rewards locked into payroll. Standard audit logs are signed by all authorized stakeholders.
            </p>
          </div>

          <div className="p-5 bg-indigo-50/60 max-w-xl mx-auto rounded-2xl border text-left font-mono text-[10.5px] space-y-2">
            <div className="grid grid-cols-2 border-b pb-1 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <span>Stakeholder Action</span>
              <span>Audit Signature Status</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">Idea Submitter ({idea.employeeName})</span>
              <span className="text-emerald-700 font-bold">✔ Submitted</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">C-POC Vetting Panel</span>
              <span className="text-emerald-700 font-bold">✔ Approved</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">IRC Jury evaluation</span>
              <span className="text-emerald-700 font-bold">✔ Approved Selection Score: {idea.averageIrcScore?.toFixed(1) || 86}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">Functional Head ({idea.assignedFHName})</span>
              <span className="text-emerald-700 font-bold">✔ Accepted & Team Allocated</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">Action Plan submission</span>
              <span className="text-emerald-700 font-bold">✔ Approved by FH</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">Incubation Final savings report</span>
              <span className="text-emerald-700 font-bold">✔ Vetted by FH</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-slate-600 font-sans">Finance audited Valuation</span>
              <span className="text-emerald-700 font-bold">✔ Certified Rs. {(idea.financeEvaluatedImpact || 0).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 font-bold text-slate-900 font-sans">
              <span>CFO payouts Sign-off</span>
              <span className="text-indigo-700 font-mono font-black">✔ Cleared</span>
            </div>
          </div>
        </div>
      )}

      {/* Gaps & Limitations Warning */}
      {idea.status === IdeaStatus.VettingLimitExceeded && (
        <div className="bg-white p-6 border border-slate-200 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
            <XCircle className="w-6 h-6" />
          </div>
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest">Resubmission limit breached</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
            Following corporate incubation governance, since the C-POC quality return limit has been exceeded, the idea has closed.
          </p>
        </div>
      )}

      {idea.status === IdeaStatus.DeclinedByFH && (
        <div className="bg-white p-6 border border-slate-200 rounded-2xl text-center space-y-3">
          <div className="w-11 h-11 bg-rose-50 text-rose-600 border rounded-full flex items-center justify-center mx-auto shadow-2xs">
            <XCircle className="w-6 h-6" />
          </div>
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest">Implementation Declined</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
            The assigned Functional Head, <strong>{idea.assignedFHName}</strong>, declined implementation due to: "{idea.fhDeclineFeedback}". 
            This feedback is filed to standard audits and shared with C-POC & IRC coordinators.
          </p>
        </div>
      )}

      {idea.status === IdeaStatus.ActionPlanRejected && (
        <div className="bg-white p-6 border border-slate-200 rounded-2xl text-center space-y-3">
          <div className="w-11 h-11 bg-rose-50 text-rose-600 border rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-widest">Action Plan Rejected</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
            The Action Plan proposed was Rejected by Functional Head with remarks: "{idea.fhPlanRejectReason}". 
            This incubation cycle is closed.
          </p>
        </div>
      )}

    </div>
  );
};
