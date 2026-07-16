/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Idea, IdeaStatus } from "./types";
import type { OfflineMeeting } from "./components/MeetingManagementModule";

export const MOCK_MEETINGS: OfflineMeeting[] = [
  {
    id: "MEET-0001",
    ideaId: "ION-2026-0002",
    ideaTitle: "Nanocoated Biofouling-Resistant RO Membranes",
    meetingType: "IRC_Proposer",
    meetingTypeLabel: "IRC \u2194 Idea Proposer Meeting",
    date: "2026-06-22",
    time: "10:00",
    participants: "Anita Desai, TM & OD CoE Lead, IRC Senior Advisory Panel, C-POC coordinator",
    agenda: "Technical presentation of \"Nanocoated Biofouling-Resistant RO Membranes\" to the central IRC Advisory Jury to clarify scaling feasibility.",
    mom: "Anita Desai presented the concept clearly. The IRC panel raised questions on CAPEX for coating infrastructure. A revised cost model to be submitted within 5 days.",
    decisions: "Idea shortlisted for full IRC evaluation. Proposer to submit revised financial model.",
    actionItems: "1. Anita Desai to share revised CAPEX estimate by 27-Jun-2026\n2. C-POC to schedule full IRC evaluation within 10 days\n3. TM&OD to circulate MoM to all participants",
    followUpStatus: "Pending Action",
    dateCreated: "2026-06-22T10:45:00Z"
  },
  {
    id: "MEET-0002",
    ideaId: "ION-2026-0005",
    ideaTitle: "Auto-Calibrated pH Dosing via Inline Sensor Feedback Loop",
    meetingType: "IRC_FH_Selection",
    meetingTypeLabel: "IRC \u2194 Functional Head Selection",
    date: "2026-06-28",
    time: "14:00",
    participants: "IRC Panel, C-POC Coordinator, Dr. Alok Gupta, TM & OD CoE Lead",
    agenda: "IRC panel deliberation on selection of Functional Head for implementing \"Auto-Calibrated pH Dosing\" and confirming the implementation path.",
    mom: "IRC panel unanimously agreed Dr. Alok Gupta (Chemical Division Head) is the appropriate Functional Head given the sensor calibration scope. Implementation pathway confirmed.",
    decisions: "Dr. Alok Gupta formally assigned as Functional Head. Pilot implementation to begin in Q3 FY2026.",
    actionItems: "1. C-POC to formally notify Dr. Alok Gupta of assignment\n2. Update platform status to WithFunctionalHead\n3. Schedule FH-Proposer alignment meeting within 2 weeks",
    followUpStatus: "Resolved",
    dateCreated: "2026-06-28T14:55:00Z"
  },
  {
    id: "MEET-0003",
    ideaId: "ION-2026-0003",
    ideaTitle: "AI-Driven Smart Dosage Coagulant Injector",
    meetingType: "FH_Proposer",
    meetingTypeLabel: "Functional Head \u2194 Idea Proposer Presentation",
    date: "2026-07-04",
    time: "11:30",
    participants: "Aditi Rao, Dr. Ravi Sharma, Project Pilot Lead (Kavita Sharma)",
    agenda: "Reviewing 6-Month Pilot Implementation timeline, trial parameters, and milestone checkpoints for \"AI-Driven Smart Dosage Coagulant Injector\".",
    mom: "Pilot plan reviewed. Milestone 1 (sensor installation) set for Aug-2026. Milestone 2 (AI model training data collection) set for Oct-2026.",
    decisions: "Pilot approved. Action plan to be submitted by Aditi Rao by 10-Jul-2026.",
    actionItems: "1. Aditi Rao to submit formal action plan by 10-Jul-2026\n2. Dr. Ravi Sharma to arrange lab access for sensor installation team\n3. Monthly tracker to be updated by 5th of each month",
    followUpStatus: "In Progress",
    dateCreated: "2026-07-04T12:15:00Z"
  },
  {
    id: "MEET-0004",
    ideaId: "ION-2026-0004",
    ideaTitle: "Municipal Waste-to-Energy Anaerobic Digester Monitor",
    meetingType: "FH_Finance",
    meetingTypeLabel: "Functional Head \u2194 Finance Discussion",
    date: "2026-07-10",
    time: "15:00",
    participants: "Dr. Pradeep Nair, Central Finance Admin, Corporate Treasury Auditor",
    agenda: "Audit evaluation of verified utilities savings and cash equivalent calculations for final CFO disbursement.",
    mom: "Finance team reviewed the verified savings report. Confirmed ₹4.2L in annual utility cost reduction. CFO sign-off to be obtained within 7 days.",
    decisions: "Financial impact confirmed. Pending CFO formal sign-off for reward distribution.",
    actionItems: "1. Finance Admin to prepare CFO briefing note by 14-Jul-2026\n2. CFO to sign off by 17-Jul-2026\n3. C-POC to initiate reward distribution post sign-off",
    followUpStatus: "Pending Action",
    dateCreated: "2026-07-10T15:45:00Z"
  }
];

export const MOCK_IDEAS: Idea[] = [
  {
    id: "ION-2026-0001",
    status: IdeaStatus.Submitted,
    createdAt: "2026-06-15T10:15:00Z",
    employeeName: "Sathya Kumar",
    employeeEmail: "sathyakumar@entrans.io",
    businessUnit: "Industrial Water Division",
    areaOfImpact: "Water Recycling & Circular Economy",
    title: "Eco-Loop Solar-Powered Modular ZLD System",
    problemStatement: "Small-to-medium manufacturing plants generate highly toxic saline wastewater but cannot afford the massive footprint and capital expenditure required by standard Zero Liquid Discharge (ZLD) plants.",
    proposedSolution: "Develop a decentralized, prefabricated, trailer-mounted 'ZLD-on-wheels' incorporating solar-thermal auxiliary evaporation and high-flux forward osmosis membranes.",
    expectedImpact: "Recover 94% of process water on-site, reduce greenhouse emissions by 40% compared to standard coal-backed evaporators, and decrease industrial water procurement expenses by Rs. 8 Lakhs per plant annually.",
    submissionDate: "2026-06-15T10:15:00Z",
    vettingSendBackCount: 0,
    ircReviews: [],
    allocatedTeamMembers: [],
    financeSendBackCount: 0
  },
  {
    id: "ION-2026-0002",
    status: IdeaStatus.UnderIRCEvaluation,
    createdAt: "2026-06-10T08:30:00Z",
    employeeName: "Anita Desai",
    employeeEmail: "anita.d@ionexchange.com",
    businessUnit: "R&D Centre of Excellence",
    areaOfImpact: "Membrane Lifespan Research",
    title: "Nanocoated Biofouling-Resistant RO Membranes",
    problemStatement: "Reverse osmosis membranes in industrial wastewater reclamation suffer rapid biofouling, resulting in a 30% increase in energy consumption and expensive biocide expenditures within 6 months.",
    proposedSolution: "Utilize a customized atomic layer deposition of metal oxide nanocoatings on standard polyamide thin-film composite membranes to prevent biological adhesion.",
    expectedImpact: "Increase membrane lifespan by 120%, reduce clean-in-place (CIP) frequency from bi-weekly to bi-monthly, and save an estimated Rs. 4 Lakhs per unit in chemical consumption.",
    submissionDate: "2026-06-10T08:30:00Z",
    vettingSendBackCount: 0,
    proposerIrcMeetingDetails: "Teams Meeting scheduled for 25th June, 2:00 PM.",
    ircReviews: [
      {
        reviewerName: "Ramesh Chawla (Sr Scientist)",
        reviewerEmail: "ramesh@ionexchange.com",
        scores: { alignmentPriority: 4, feasibility: 4, businessValue: 5, innovation: 4, scalability: 4, riskDependency: 4 },
        aggregateScore: 4.25,
        comments: "Very strong novelty, though scaling the gas deposition chamber can present a slight bottleneck initially.",
        dateSubmitted: "2026-06-12T14:10:00Z"
      }
    ],
    allocatedTeamMembers: [],
    financeSendBackCount: 0
  },

  // ── TEST SEED: Annexure 7 — FH Decision (log in as Functional Head to see Step 1 form) ──
  {
    id: "ION-2026-0005",
    status: IdeaStatus.WithFunctionalHead,
    createdAt: "2026-06-28T09:00:00Z",
    employeeName: "Priya Mehta",
    employeeEmail: "priya.mehta@ionexchange.com",
    businessUnit: "Chemical Division",
    department: "Process Engineering",
    designation: "Senior Process Engineer",
    areaOfImpact: "Chemical Consumption Minimization",
    title: "Auto-Calibrated pH Dosing via Inline Sensor Feedback Loop",
    problemStatement: "Manual pH correction in chemical dosing leads to over-dosing by ~18%, increasing chemical costs and discharge non-compliance risk.",
    proposedSolution: "Deploy an inline pH sensor array with a PLC feedback loop to auto-calibrate dosing pump output in real time, replacing manual operator adjustments.",
    expectedImpact: "Reduce chemical over-dosing by 18%, cut annual chemical spend by Rs. 6.2 Lakhs, and improve discharge compliance from 87% to 99%.",
    submissionDate: "2026-06-28T09:00:00Z",
    vettingSendBackCount: 0,
    cpocVettedBy: "Kavita Sharma",
    vettingDate: "2026-06-29T10:00:00Z",
    averageIrcScore: 20.83,
    ircSelectionStatus: "Selected",
    selectionVoucherReleased: true,
    selectionCertificateUrl: "CERTIFICATE_INC_SELECTION_ION-2026-0005.pdf",
    assignedFHName: "Dr. Alok Gupta",
    assignedFHEmail: "alok.gupta@ionexchange.com",
    fhAssignmentComments: "Assigned to Chemical Division for feasibility trial under FY2026-27 capex window.",
    ircReviews: [
      {
        reviewerName: "Advisory Expert A",
        reviewerEmail: "advisor@ionexchange.com",
        scores: { alignmentPriority: 4, feasibility: 5, businessValue: 4, innovation: 4, scalability: 4, riskDependency: 4 },
        aggregateScore: 4.2,
        comments: "Strong feasibility. Recommend fast-track pilot.",
        dateSubmitted: "2026-06-30T14:00:00Z"
      }
    ],
    allocatedTeamMembers: [],
    financeSendBackCount: 0
  },

  {
    id: "ION-2026-0003",
    status: IdeaStatus.ActionPlanApproved,
    createdAt: "2026-06-02T11:00:00Z",
    employeeName: "Aditi Rao",
    employeeEmail: "aditi.rao@ionexchange.com",
    businessUnit: "Chemical Division",
    areaOfImpact: "Chemical Consumption Minimization",
    title: "AI-Driven Smart Dosage Coagulant Injector",
    problemStatement: "Manual or timer-based coagulant dosage causes over-injection by up to 25% during high-turbidity influxes, resulting in excess sludge volume and chemical expenses.",
    proposedSolution: "Implement a digital-twin closed-loop sensor rig using live turbidity and pH feeds to dynamically regulate variable-speed dosing pumps via a smart predictive algorithm.",
    expectedImpact: "Achieve a 20% savings in chemical usage, 15% reduction in sludge volume, and maintain 100% compliant discharge water quality.",
    submissionDate: "2026-06-02T11:00:00Z",
    vettingSendBackCount: 0,
    ircReviews: [
      { reviewerName: "Advisor 1", reviewerEmail: "adv1@ionexchange.com", scores: { alignmentPriority: 4, feasibility: 4, businessValue: 4, innovation: 4, scalability: 4, riskDependency: 4 }, aggregateScore: 20.0, comments: "Highly viable pilot project.", dateSubmitted: "2026-06-04" },
      { reviewerName: "Advisor 2", reviewerEmail: "adv2@ionexchange.com", scores: { alignmentPriority: 4, feasibility: 4, businessValue: 5, innovation: 4, scalability: 4, riskDependency: 4 }, aggregateScore: 20.83, comments: "Sound logic behind physical dosage adjustments.", dateSubmitted: "2026-06-04" }
    ],
    averageIrcScore: 20.42,
    ircSelectionStatus: "Selected",
    selectionVoucherReleased: true,
    assignedFHName: "Dr. Alok Gupta",
    assignedFHEmail: "alok.gupta@ionexchange.com",
    fhDecision: "Accept",
    projectLeadName: "Kavita Sharma",
    projectLeadEmail: "kavita.s@ionexchange.com",
    allocatedTeamMembers: ["Suresh Babboo", "Padmini G."],
    actionPlanTitle: "Chemical Division Smart Coagulant Ingestion Pilot",
    actionPlanObjectives: "Deploy variable-speed pumps with turbidity sensors at the Chem Lab skid.",
    actionPlanMilestones: "Phase 1: Procurement (Month 1)\nPhase 2: Sensor calibration (Month 2)\nPhase 3: Real test (Month 3-5)",
    actionPlanBudget: 150000,
    actionPlanTimelineStart: "2026-07-01",
    actionPlanTimelineEnd: "2026-12-31",
    actionPlanDocumentName: "ActionPlan_ION_0003.pdf",
    fhPlanDecision: "Approve",
    financeSendBackCount: 0
  },
  {
    id: "ION-2026-0004",
    status: IdeaStatus.Completed,
    createdAt: "2026-05-10T09:00:00Z",
    employeeName: "Sanjay Deshmukh",
    employeeEmail: "sanjay.deshmukh@ionexchange.com",
    businessUnit: "Municipal Infrastructure Group",
    areaOfImpact: "Waste-to-Energy Innovations",
    title: "Municipal Waste-to-Energy Anaerobic Digester Monitor",
    problemStatement: "Biogas yield in municipal sewage anaerobic digesters fluctuates wildly due to organic loading rates variations, resulting in low power capture efficiency and waste release.",
    proposedSolution: "Retrofit automated biochemical oxygen demand (BOD) sensors and micro-turbines guided by continuous thermal profiling to capture peak methane flow.",
    expectedImpact: "Boost power recovery efficiency by 35% and offset factory electricity needs by 110MWh annually, equating to Rs. 14 Lakhs in cash value.",
    submissionDate: "2026-05-10T09:00:00Z",
    vettingSendBackCount: 0,
    ircReviews: [
      { reviewerName: "Senior Advisor A", reviewerEmail: "advA@ionexchange.com", scores: { alignmentPriority: 5, feasibility: 4, businessValue: 5, innovation: 4, scalability: 4, riskDependency: 4 }, aggregateScore: 21.67, comments: "Extremely strategic move for municipal sewage plants.", dateSubmitted: "2026-05-12" }
    ],
    averageIrcScore: 21.67,
    ircSelectionStatus: "Selected",
    selectionVoucherReleased: true,
    assignedFHName: "Dr. Alok Gupta",
    assignedFHEmail: "alok.gupta@ionexchange.com",
    fhDecision: "Accept",
    projectLeadName: "John Doe",
    projectLeadEmail: "john.doe@ionexchange.com",
    allocatedTeamMembers: ["Kavita Sharma", "Ramesh Chawla"],
    actionPlanTitle: "Municipal Digester Thermal Profiling Installation",
    actionPlanObjectives: "Install BOD sensors at the Municipal trial skid.",
    actionPlanMilestones: "Phase 1: Installation (Month 1)\nPhase 2: Methane monitoring (Month 2-6)",
    actionPlanBudget: 220000,
    actionPlanTimelineStart: "2026-06-01",
    actionPlanTimelineEnd: "2026-11-30",
    actionPlanDocumentName: "Digester_ActionPlan.docx",
    fhPlanDecision: "Approve",
    finalReportObjectivesMet: "Methane flow increased by 38% under high organic load. Total savings calculated correctly.",
    finalReportDocumentName: "Final_Evaluation_Report.pdf",
    finalReportSubmissionDate: "2026-06-20",
    financeEvaluatedImpact: 1400000,
    financeSendBackCount: 0,
    calculatedRewardIdeaOwner: 350000, // 25% of 14 Lakhs
    calculatedRewardTeamMembers: 525000, // 75% divide equally (each team member gets 525K)
    cfoSignOffDate: "2026-06-22T12:00:00Z"
  }
];
