/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum IdeaStatus {
  Submitted = "Pending C-POC Vetting",
  ReturnedToEmployee = "Returned to Employee",
  VettingLimitExceeded = "Closed — Resubmission Limit Exceeded (Rejected)",
  ApprovedByCPOC = "Vetted — Awaiting Proposer-IRC Meeting",
  UnderIRCEvaluation = "Under IRC Evaluation",
  RejectedByIRC = "Closed — Rejected by IRC",
  SelectedByIRC = "Selected — Selected by IRC",
  WithFunctionalHead = "Awaiting Functional Head Decision",
  DeclinedByFH = "Closed — Declined by Functional Head",
  AwaitingActionPlan = "Awaiting Action Plan Submission",
  ActionPlanSubmitted = "Action Plan Submitted — Pending Approval",
  ActionPlanRevision = "Action Plan — Revision Required",
  ActionPlanRejected = "Closed — Action Plan Rejected",
  ActionPlanApproved = "Action Plan Approved — C-POC Offline Tracker",
  ReportSubmitted = "Project Report Submitted — Pending Review",
  ReportRevision = "Project Report — Revision Required",
  ReportRejected = "Closed — Project Report Rejected by FH",
  PendingFinanceEvaluation = "Awaiting Finance Impact Evaluation",
  FinanceRevision = "Finance Impact — Revision Required",
  FinanceRevisionLimitExceeded = "Closed — Finance Revision Limit Exceeded",
  NoQuantifiableFinancialBenefit = "Closed — No Quantifiable Financial Benefit",
  PendingCFOSignOff = "Awaiting CFO / Finance Head Sign-Off",
  Completed = "Journey Complete — Rewards Distributed"
}

export interface UserPersona {
  role: 'Employee' | 'C-POC' | 'IRC Member' | 'Functional Head' | 'Project Lead' | 'Finance' | 'CFO' | 'Super Admin';
  name: string;
  email: string;
  businessUnit?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  grade?: string;
  cadre?: string;
}

export interface Idea {
  id: string; // Format: ION-2026-####
  status: IdeaStatus;
  createdAt: string;

  // Annexure 1 & 2: Employee Submission
  employeeName: string;
  employeeEmail: string;
  businessUnit: string;
  areaOfImpact: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  expectedImpact: string;
  uploadedFileName?: string;
  uploadedFilesSize?: string;
  uploadedFiles?: { name: string; size: string }[];
  submissionDate: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  grade?: string;
  cadre?: string;

  // Annexure 3 & 4: C-POC Vetting
  cpocVettedBy?: string;
  vettingDate?: string;
  vettingComments?: string;
  vettingSendBackCount: number; // Returns limit: 2+ returns -> Reject
  proposerIrcMeetingDetails?: string;

  // Offline Meetings Tracking
  meetingIrcProposerDate?: string;
  meetingFhProposerDate?: string;
  meetingFhFinanceDate?: string;

  // Annexure 5 & 7: IRC Review
  ircReviews: IRCReview[];
  averageIrcScore?: number;
  ircSelectionStatus?: 'Selected' | 'Rejected'; // 'Selected' or 'Rejected'
  ircCouncilAssignedEmails?: string[]; // CPOC assigned jury emails
  ircScoresThreshold?: number; // CPOC custom threshold
  useDefaultIRCCouncil?: boolean; // toggle default committee vs custom list
  bypassedIRCMembers?: string[]; // list of bypassed advisor emails for contingency calculations
  ircScoreMin?: number; // e.g. 1
  ircScoreMax?: number; // e.g. 5
  ircEvaluationCycle?: string; // e.g. "Monthly Cycle"

  // Monthly incu-progress tracker
  monthlyTrackers?: {
    month: string;
    progress?: string;
    status: 'On Track' | 'Delayed' | 'Completed' | 'On Hold';
    achievements: string;
    dateSubmitted: string;
    filename?: string;
    completionPercentage?: number;
    expectedCompletionDate?: string;
    milestones?: string;
    risks?: string;
    delays?: string;
    issues?: string;
    comments?: string;
  }[];

  // Annexure 9: C-POC Monthly Progress Tracker entries (one per month per idea)
  cpocMonthlyEntries?: {
    month: string;
    milestoneActivities: string;
    progressAchieved: string;
    status: 'On Track' | 'Delayed' | 'On Hold' | 'Completed';
    remarks: string;
    updatedAt: string;
  }[];

  // Annexure 8, 9, 10: Selection Rewards
  selectionVoucherReleased?: boolean;
  selectionCertificateUrl?: string;

  // Annexure 7 & 11 & 12a: Functional Head Assignment & Decision
  assignedFHName?: string;
  assignedFHEmail?: string;
  fhAssignmentComments?: string;
  fhDecisionDate?: string;
  fhDecision?: 'Accept' | 'Decline';
  fhDeclineFeedback?: string;
  fhProjectTitle?: string;         // Annexure 7: refined project title from FH
  projectLeadName?: string;
  projectLeadEmail?: string;
  allocatedTeamMembers: string[];

  // Annexure 12b & 13: Project Plan Submission
  actionPlanTitle?: string;
  actionPlanObjectives?: string;
  actionPlanMilestones?: string; // Textarea
  actionPlanBudget?: number;
  actionPlanTimelineStart?: string;
  actionPlanTimelineEnd?: string;
  actionPlanDocumentName?: string;
  actionPlanRemarks?: string;
  fhPlanDecision?: 'Approve' | 'Reject' | 'Send-back';
  fhPlanRejectReason?: string;
  // Step 2 Action Plan — Pilot Project spec
  apKRA?: string;
  apKPIName?: string;
  apKPIBaseline?: string;
  apKPITarget?: string;
  apFinancialTranslation?: string;
  apSuccessThreshold?: number;
  apPartialThreshold?: number;
  apQualitativeBenefits?: string;
  apPrerequisites?: string;
  apMilestones?: { description: string; date: string }[];
  apRisks?: string;
  apResources?: string;
  apSendBackCount?: number;

  // Annexure 14: Project execution & final report (full spec fields)
  finalReportObjectivesMet?: string;
  finalReportDocumentName?: string;
  finalReportSubmissionDate?: string;
  fhReportDecision?: 'Approve' | 'Send-back' | 'Reject';
  fhReportRemarks?: string;
  rptSendBackCount?: number;
  // Section A — Pilot Outcome
  rptPilotDescription?: string;
  rptActualKPI?: string;
  rptMeasurementPeriod?: string;
  rptPctTargetAchieved?: number;
  // Section B — Financial Impact
  rptActualFinancialImpact?: string;
  rptCalculationMethodology?: string;
  rptImpactTypes?: string[];
  rptRecurringType?: 'Annual recurring' | 'One-time' | 'Mix';
  rptAssumptions?: string;
  rptEvidenceSource?: string;
  rptImplCost?: string;
  rptOngoingCost?: string;
  rptOverlapCheck?: 'No overlap' | 'Yes';
  rptOverlapNote?: string;
  rptIndirectBenefits?: string;

  // Annexure 15: Finance Evaluation
  financeEvaluatedImpact?: number;
  financeSendBackCount: number; // Max 2x
  financeFeedback?: string;
  financeDecision?: 'Validate' | 'Send-back' | 'No quantifiable financial benefit';
  finCertifiedAmount?: number;
  finRewardSlab?: string;
  finAdjustmentNote?: string;
  finQualitativeNote?: string;
  finSendBackChecklist?: string[];

  // Annexure 16, 17, 18: CFO sign-off & rewards split
  cfoSignOffDate?: string;
  calculatedRewardIdeaOwner?: number; // 25% Proposer
  calculatedRewardTeamMembers?: number; // 75% divided among team members (equally)
  customFields?: { id: string; label: string; value: string; type: string }[];
}

export interface IRCReview {
  reviewerName: string;
  reviewerEmail: string;
  // Annexure 4 — 6 evaluation criteria (each 1-5)
  scores: {
    alignmentPriority: number;
    feasibility: number;
    businessValue: number;
    innovation: number;
    scalability: number;
    riskDependency: number;
    // legacy fields (kept for backward compat with existing mock data)
    impact?: number;
    financialRoi?: number;
    sustainability?: number;
  };
  // Nudge question rationale per criterion
  rationale?: {
    alignmentPriority?: string;
    feasibility?: string;
    businessValue?: string;
    innovation?: string;
    scalability?: string;
    riskDependency?: string;
  };
  // Block 1 — recommended FH vote
  recommendedFH?: string;
  // Block 4 — qualitative fields
  improvementSuggestions?: string;
  implementationFlags?: string;
  aggregateScore: number;
  comments: string;
  dateSubmitted: string;
}

export interface MDCEOScores {
  innovation: number;
  businessImpact: number;
  executionEfficiency: number;
  relevancy: number;
  futurePotential: number;
  customerValue: number;
}

export interface NotificationLog {
  id: string;
  ideaId: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  attachmentName?: string;
  attachmentType?: string;
}

// Predefined Themes & Business Units
export const AREA_OF_IMPACT_THEMES = [
  "Water Recycling & Circular Economy",
  "Zero Liquid Discharge (ZLD) Systems",
  "Process Water Purification Efficiency",
  "Industrial Wastewater Recovery",
  "Smart Water Grids & IoT Systems",
  "Chemical Consumption Minimization",
  "Membrane Lifespan Research",
  "Municipal Drinking Water Quality",
  "Waste-to-Energy Innovations",
  "Carbon Footprint Reduction",
  "Process Safety & Automation",
  "Decentralized Sewage Solutions"
];

export const BUSINESS_UNITS = [
  "Industrial Water Division",
  "Chemical Division",
  "Home Water Solutions",
  "Municipal Infrastructure Group",
  "Services & O&M Division",
  "R&D Centre of Excellence",
  "Engineering & Project Management"
];

export interface BPOCBU_Mapping {
  [bu: string]: { name: string; email: string };
}

export const BPOC_MAPPING: BPOCBU_Mapping = {
  "Industrial Water Division": { name: "Anil Sharma", email: "anil.sharma@ionexchange.com" },
  "Chemical Division": { name: "Sunita Roy", email: "sunita.roy@ionexchange.com" },
  "Home Water Solutions": { name: "Vikram Malhotra", email: "vikram.m@ionexchange.com" },
  "Municipal Infrastructure Group": { name: "Prakash Iyer", email: "prakash.iyer@ionexchange.com" },
  "Services & O&M Division": { name: "Meera Patel", email: "meera.patel@ionexchange.com" },
  "R&D Centre of Excellence": { name: "Dr. Sandeep Jha", email: "sandeep.jha@ionexchange.com" },
  "Engineering & Project Management": { name: "Rajesh Nair", email: "rajesh.nair@ionexchange.com" }
};

/**
 * Enforces strict segregration of duties (SoD) by filtering the ideas list based on role.
 * - Employee: Only sees ideas that they submitted with their email.
 * - Non-CFO admins: Only see ideas related to their active stage/roles.
 * - CFO: Sees all admin stages in the roster, but has no access to employee private workspace.
 */
export function getAuthorizedIdeasForRole(ideas: Idea[], persona: UserPersona): Idea[] {
  const role = persona.role;
  const email = persona.email.toLowerCase();

  if (role === "Employee") {
    return ideas.filter(idea => idea.employeeEmail.toLowerCase() === email);
  }

  if (role === "CFO" || role === "Super Admin") {
    // CFO and Super Admin see all ideas across the system.
    return ideas;
  }

  // Enterprise Roster Admins: Locked to their specific stage-gates
  return ideas.filter(idea => {
    switch (role) {
      case "C-POC":
        return [
          IdeaStatus.Submitted,
          IdeaStatus.ReturnedToEmployee,
          IdeaStatus.VettingLimitExceeded,
          IdeaStatus.ApprovedByCPOC, 
          IdeaStatus.UnderIRCEvaluation,
          IdeaStatus.SelectedByIRC, 
          IdeaStatus.RejectedByIRC,
          IdeaStatus.WithFunctionalHead,
          IdeaStatus.DeclinedByFH,
          IdeaStatus.AwaitingActionPlan,
          IdeaStatus.ActionPlanSubmitted,
          IdeaStatus.ActionPlanRevision,
          IdeaStatus.ActionPlanRejected,
          IdeaStatus.ActionPlanApproved,
          IdeaStatus.ReportSubmitted,
          IdeaStatus.ReportRevision,
          IdeaStatus.ReportRejected,
          IdeaStatus.PendingFinanceEvaluation,
          IdeaStatus.FinanceRevision,
          IdeaStatus.FinanceRevisionLimitExceeded,
          IdeaStatus.NoQuantifiableFinancialBenefit,
          IdeaStatus.PendingCFOSignOff,
          IdeaStatus.Completed
        ].includes(idea.status);
      case "IRC Member":
        return [
          IdeaStatus.ApprovedByCPOC,
          IdeaStatus.UnderIRCEvaluation, 
          IdeaStatus.RejectedByIRC,
          IdeaStatus.SelectedByIRC
        ].includes(idea.status);
      case "Functional Head":
        return [
          IdeaStatus.WithFunctionalHead, 
          IdeaStatus.DeclinedByFH,
          IdeaStatus.AwaitingActionPlan,
          IdeaStatus.ActionPlanSubmitted, 
          IdeaStatus.ActionPlanRevision,
          IdeaStatus.ActionPlanRejected,
          IdeaStatus.ActionPlanApproved,
          IdeaStatus.ReportSubmitted,
          IdeaStatus.ReportRevision,
          IdeaStatus.ReportRejected,
          IdeaStatus.PendingFinanceEvaluation,
          IdeaStatus.FinanceRevision,
          IdeaStatus.PendingCFOSignOff,
          IdeaStatus.Completed
        ].includes(idea.status);
      case "Project Lead":
        return [
          IdeaStatus.AwaitingActionPlan, 
          IdeaStatus.ActionPlanRevision,
          IdeaStatus.ActionPlanApproved,
          IdeaStatus.ReportRevision,
          IdeaStatus.ReportSubmitted,
          IdeaStatus.ReportRejected,
          IdeaStatus.FinanceRevision
        ].includes(idea.status);
      case "Finance":
        return [
          IdeaStatus.PendingFinanceEvaluation, 
          IdeaStatus.FinanceRevision,
          IdeaStatus.FinanceRevisionLimitExceeded
        ].includes(idea.status);
      default:
        return false;
    }
  });
}

export interface OfflineMeeting {
  id: string;
  ideaId: string;
  ideaTitle: string;
  meetingType: 'IRC_Proposer' | 'FH_Proposer' | 'FH_Finance';
  date: string;
  participants: string[];
  agenda: string;
  mom: string;
  decisions: string;
  actionItems: string;
  followUpStatus: string;
  dateCreated: string;
  organizerEmail: string;
}


