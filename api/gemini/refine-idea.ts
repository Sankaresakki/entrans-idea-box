import { refineTitle, refineProblem, refineSolution, refineImpact, generateSuggestions } from "../_helpers.js";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { title, problemStatement, proposedSolution, expectedImpact, areaOfImpact } = req.body;

  if (!title || !problemStatement || !proposedSolution) {
    return res.status(400).json({ error: "Title, problem statement, and proposed solution are required." });
  }

  const area = areaOfImpact || "General Innovation";

  return res.json({
    title:            refineTitle(title, area),
    problemStatement: refineProblem(problemStatement, area),
    proposedSolution: refineSolution(proposedSolution, area),
    expectedImpact:   refineImpact(expectedImpact, area),
    aiSuggestions:    generateSuggestions(area),
  });
}
