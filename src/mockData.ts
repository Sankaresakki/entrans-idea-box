/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Idea, IdeaStatus } from "./types";

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
    averageIrcScore: 4.2,
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
      { reviewerName: "Advisor 1", reviewerEmail: "adv1@ionexchange.com", scores: { alignmentPriority: 4, feasibility: 4, businessValue: 4, innovation: 4, scalability: 4, riskDependency: 4 }, aggregateScore: 4.0, comments: "Highly viable pilot project.", dateSubmitted: "2026-06-04" },
      { reviewerName: "Advisor 2", reviewerEmail: "adv2@ionexchange.com", scores: { alignmentPriority: 4, feasibility: 4, businessValue: 5, innovation: 4, scalability: 4, riskDependency: 4 }, aggregateScore: 4.17, comments: "Sound logic behind physical dosage adjustments.", dateSubmitted: "2026-06-04" }
    ],
    averageIrcScore: 4.125,
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
      { reviewerName: "Senior Advisor A", reviewerEmail: "advA@ionexchange.com", scores: { alignmentPriority: 5, feasibility: 4, businessValue: 5, innovation: 4, scalability: 4, riskDependency: 4 }, aggregateScore: 4.33, comments: "Extremely strategic move for municipal sewage plants.", dateSubmitted: "2026-05-12" }
    ],
    averageIrcScore: 4.5,
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
