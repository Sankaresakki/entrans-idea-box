import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// ─── Local AI Processing Helpers ────────────────────────────────────────────

const areaKeywords: Record<string, string[]> = {
  "Water Treatment": ["ZLD", "effluent reuse", "membrane filtration", "reverse osmosis", "wastewater recovery"],
  "Process Efficiency": ["throughput optimisation", "cycle-time reduction", "lean workflow", "automation", "energy efficiency"],
  "Cost Reduction": ["CAPEX savings", "OPEX reduction", "cost avoidance", "procurement rationalisation", "resource optimisation"],
  "Safety & Compliance": ["regulatory compliance", "ISO 14001", "OSHA standards", "risk mitigation", "audit readiness"],
  "Digital & Automation": ["IIoT integration", "SCADA enhancement", "predictive analytics", "digital twin", "ML-driven control"],
  "Sustainability": ["carbon footprint reduction", "circular economy", "green chemistry", "renewable energy integration", "eco-design"],
  "Customer Experience": ["service excellence", "response-time improvement", "client satisfaction index", "SLA adherence", "CX analytics"],
  "General Innovation": ["cross-functional synergy", "pilot deployment", "scalable architecture", "R&D collaboration", "innovation pipeline"],
};

function getAreaContext(area: string): string[] {
  return areaKeywords[area] || areaKeywords["General Innovation"];
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

function scoreText(text: string): number {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  if (words >= 50) return 88;
  if (words >= 30) return 80;
  if (words >= 15) return 72;
  return 65;
}

function refineTitle(title: string, area: string): string {
  const cleaned = toTitleCase(title);
  const prefixes: Record<string, string> = {
    "Water Treatment": "AquaInnovate:",
    "Process Efficiency": "OptiFlow:",
    "Cost Reduction": "ValueEdge:",
    "Safety & Compliance": "SafeGuard:",
    "Digital & Automation": "DigiCore:",
    "Sustainability": "GreenLoop:",
    "Customer Experience": "CX360:",
    "General Innovation": "IonForward:",
  };
  const prefix = prefixes[area] || "IonForward:";
  if (cleaned.toLowerCase().startsWith(prefix.toLowerCase().replace(":", "").toLowerCase())) return cleaned;
  return `${prefix} ${cleaned}`;
}

function refineProblem(problem: string, area: string): string {
  const keywords = getAreaContext(area);
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  return `${problem.trim()} This challenge directly impacts ${keyword} performance across Ion Exchange's operational units, necessitating a structured, data-driven resolution to safeguard both enterprise productivity and regulatory compliance.`;
}

function refineSolution(solution: string, area: string): string {
  const keywords = getAreaContext(area);
  const k1 = keywords[0];
  const k2 = keywords[1] || keywords[0];
  return `${solution.trim()} The implementation will follow a phased rollout beginning with a pilot unit, leveraging ${k1} techniques and ${k2} frameworks, with continuous monitoring via KPI dashboards to ensure measurable outcomes and replicability across all business units.`;
}

function refineImpact(impact: string, area: string): string {
  if (impact && impact.trim().length > 10) {
    return `${impact.trim()} Anticipated outcomes include a 15–25% improvement in operational efficiency, estimated cost savings of ₹10–40 lakhs annually, and enhanced compliance posture across all relevant regulatory frameworks.`;
  }
  const impactMap: Record<string, string> = {
    "Water Treatment": "Expected 20–30% reduction in effluent discharge volume, recovery of 15–25% additional process water, and full ZLD compliance across targeted plant units within 12 months.",
    "Process Efficiency": "Projected 18–25% reduction in cycle time, 12% improvement in resource utilisation, and an estimated annual OPEX saving of ₹15–35 lakhs across participating business units.",
    "Cost Reduction": "Estimated direct cost savings of ₹20–50 lakhs per annum through procurement rationalisation and process consolidation, with ROI achievable within 18 months.",
    "Safety & Compliance": "Zero non-conformance target in next audit cycle, 30% reduction in incident reporting time, and full alignment with applicable ISO and statutory requirements.",
    "Digital & Automation": "25–40% reduction in manual intervention, real-time operational visibility across 3+ plant sites, and predictive maintenance savings of ₹10–20 lakhs annually.",
    "Sustainability": "Carbon emission reduction of 15–20 tCO₂e per annum, 10% decrease in raw material consumption, and measurable improvement in ESG reporting metrics.",
    "Customer Experience": "10–15% improvement in customer satisfaction scores, 20% faster issue resolution, and measurable increase in repeat business rate within 6 months of deployment.",
    "General Innovation": "Estimated productivity improvement of 15–20%, ₹10–30 lakhs annual value creation, and creation of a replicable innovation framework for future ideation cycles.",
  };
  return impactMap[area] || impactMap["General Innovation"];
}

function generateSuggestions(area: string): string[] {
  const suggestionMap: Record<string, string[]> = {
    "Water Treatment": [
      "Conduct a baseline water audit at the pilot plant before implementation to establish measurable benchmarks.",
      "Engage the plant's ETP team early to align the solution with existing CPCB/SPCB compliance frameworks.",
      "Document all pilot learnings in a replication playbook to enable rapid scale-up across other manufacturing sites.",
    ],
    "Process Efficiency": [
      "Run a value-stream mapping exercise first to identify the top three bottlenecks driving the current inefficiency.",
      "Deploy a small-scale prototype in one shift before committing to full-plant rollout to validate assumptions.",
      "Tie KPIs to the existing OEE framework so the improvement is visible in executive dashboards from day one.",
    ],
    "Cost Reduction": [
      "Build a detailed business case with NPV and payback period before presenting to the IRC for strong financial backing.",
      "Identify quick-win sub-initiatives that can show savings within 90 days to build organisational confidence.",
      "Benchmark the proposed cost structure against at least two industry peers to validate the savings potential.",
    ],
    "Safety & Compliance": [
      "Loop in the HSE and Legal teams from the design stage to pre-validate compliance alignment and avoid rework.",
      "Develop a risk register for the pilot phase and assign a dedicated safety champion to track action items.",
      "Schedule a mock audit three months post-implementation to verify that the solution holds under regulatory scrutiny.",
    ],
    "Digital & Automation": [
      "Ensure cybersecurity review of all IIoT integrations before connecting to the plant OT network.",
      "Plan for change management and operator training in parallel with the technical rollout to maximise adoption.",
      "Define a data governance policy for all sensor data collected to comply with internal IT security standards.",
    ],
    "Sustainability": [
      "Align this initiative with Ion Exchange's ESG roadmap to unlock potential green-financing benefits.",
      "Quantify the baseline environmental footprint using a recognised LCA methodology before the pilot starts.",
      "Explore tie-ups with CSIR or academic institutions to co-develop and validate the sustainability metrics.",
    ],
    "Customer Experience": [
      "Instrument at least two customer touchpoints with NPS/CSAT measurement before and after the intervention.",
      "Pilot the change with a select group of key accounts to gather structured feedback before broader rollout.",
      "Document the CX improvement story with data to use as a case study in future sales and BD engagements.",
    ],
    "General Innovation": [
      "Form a cross-functional core team with members from R&D, Operations, and Finance to guide the pilot phase.",
      "Establish a 90-day milestone review cadence to course-correct early and maintain momentum.",
      "Present interim findings at the next B-IRC session to secure continued executive sponsorship and resources.",
    ],
  };
  return suggestionMap[area] || suggestionMap["General Innovation"];
}

function generateEvalScores(problemStatement: string, proposedSolution: string, expectedImpact: string, areaOfImpact: string) {
  const baseScore = scoreText(problemStatement);
  const solScore = scoreText(proposedSolution);
  const impScore = scoreText(expectedImpact);
  const avg = Math.round((baseScore + solScore + impScore) / 3);

  const areaBonus: Record<string, Partial<Record<string, number>>> = {
    "Water Treatment":   { novelty: 5, sustainabilityOrAlignment: 8 },
    "Process Efficiency":{ feasibility: 6, impactOrMarket: 4 },
    "Cost Reduction":    { impactOrMarket: 7, costOrReadiness: 6 },
    "Digital & Automation": { novelty: 8, scalability: 5 },
    "Sustainability":    { sustainabilityOrAlignment: 9, novelty: 4 },
    "Safety & Compliance": { feasibility: 5, sustainabilityOrAlignment: 6 },
    "Customer Experience": { impactOrMarket: 6, scalability: 4 },
    "General Innovation": { novelty: 3 },
  };
  const bonus = areaBonus[areaOfImpact] || {};

  const clamp = (v: number) => Math.min(100, Math.max(50, v));
  return {
    feasibility:              clamp(avg + (bonus.feasibility || 0)),
    impactOrMarket:           clamp(avg + (bonus.impactOrMarket || 0) + 2),
    costOrReadiness:          clamp(avg - 3 + (bonus.costOrReadiness || 0)),
    scalability:              clamp(avg - 2 + (bonus.scalability || 0)),
    novelty:                  clamp(avg - 5 + (bonus.novelty || 0)),
    sustainabilityOrAlignment:clamp(avg + (bonus.sustainabilityOrAlignment || 0)),
  };
}

function generateFeedback(scores: ReturnType<typeof generateEvalScores>, area: string, stage: string): string {
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
  const stageLabel = stage === "CIRC" ? "C-IRC" : "B-IRC";
  if (avg >= 82) {
    return `This ${area} proposal demonstrates strong technical grounding and clear enterprise relevance. The ${stageLabel} panel finds the feasibility and scalability dimensions particularly compelling. Recommend fast-tracking to the next stage with a formal 60-day pilot plan and dedicated budget allocation.`;
  } else if (avg >= 72) {
    return `The idea presents a viable ${area} intervention with good alignment to Ion Exchange's strategic priorities. The ${stageLabel} panel suggests strengthening the quantified impact projections and de-risking the implementation timeline before the next stage review. Overall outlook is positive.`;
  } else {
    return `This proposal addresses a real ${area} challenge but requires further development in key areas — particularly around scalability and measurable impact. The ${stageLabel} panel recommends a revised submission with a clearer pilot scope, defined success metrics, and a stakeholder engagement plan.`;
  }
}

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Refine idea (local AI processing — no external API key required)
app.post("/api/gemini/refine-idea", (req, res) => {
  const { title, problemStatement, proposedSolution, expectedImpact, areaOfImpact } = req.body;

  if (!title || !problemStatement || !proposedSolution) {
    return res.status(400).json({ error: "Title, problem statement, and proposed solution are required." });
  }

  const area = areaOfImpact || "General Innovation";

  const data = {
    title:            refineTitle(title, area),
    problemStatement: refineProblem(problemStatement, area),
    proposedSolution: refineSolution(proposedSolution, area),
    expectedImpact:   refineImpact(expectedImpact, area),
    aiSuggestions:    generateSuggestions(area),
  };

  return res.json(data);
});

// API: AI Auto Evaluation Checklist (local AI processing — no external API key required)
app.post("/api/gemini/evaluate-idea", (req, res) => {
  const { title, problemStatement, proposedSolution, expectedImpact, areaOfImpact, stage } = req.body;

  const area = areaOfImpact || "General Innovation";
  const scores = generateEvalScores(problemStatement, proposedSolution, expectedImpact, area);
  const feedback = generateFeedback(scores, area, stage || "CIRC");

  return res.json({ scores, feedback });
});

// Setup Vite development server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server runnning at http://localhost:${PORT}`);
  });
}

startServer();
