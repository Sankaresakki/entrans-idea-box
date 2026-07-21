import { generateEvalScores, generateFeedback } from "../_helpers.js";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { title: _title, problemStatement, proposedSolution, expectedImpact, areaOfImpact, stage } = req.body;

  const area = areaOfImpact || "General Innovation";
  const scores = generateEvalScores(problemStatement, proposedSolution, expectedImpact, area);
  const feedback = generateFeedback(scores, area, stage || "CIRC");

  return res.json({ scores, feedback });
}
