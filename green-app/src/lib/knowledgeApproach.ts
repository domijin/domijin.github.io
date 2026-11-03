/** The two proposed extensions in the author's 2023 sketch, applied to a prompt. */
export const KNOWLEDGE_PRESETS = [
  "What does a gravitational-wave standard siren let us measure?",
  "Count the binary black holes with 8 < m₁ < 12 M☉ in this cluster.",
  "What are the latest LISA mission updates?",
];

export function formulateApproach(
  prompt: string,
  hasMatch: boolean,
  modality: boolean,
  symbolic: boolean,
) {
  const needsEvidence = !hasMatch || /\b(current|currently|latest|now|today|recent|recently|newest|this week|this month)\b/i.test(prompt);
  const needsComputation = /\b(count|how many|number of|sum|total|calculate|compute|between|list all|list every)\b/i.test(prompt);
  const missing = [
    ...(needsEvidence && !modality ? ["evidence from the world"] : []),
    ...(needsComputation && !symbolic ? ["an explicit computation"] : []),
  ];

  return {
    needsEvidence,
    needsComputation,
    missing,
    headline: missing.length
      ? `This prompt needs ${missing.join(" and ")}`
      : modality || symbolic
        ? "A plan to check the answer"
        : "Start with the related concepts",
    steps: [
      hasMatch
        ? "Use the highlighted concepts to frame a candidate explanation. Relevance alone does not establish that it is true."
        : "No strong match in this small concept map. Identify the missing concepts before attempting an answer.",
      modality
        ? "Query a source, dataset, sensor, or experiment. Record where the evidence came from and when it was observed."
        : needsEvidence
          ? "Add a data modality: this prompt needs observations beyond the stored concepts."
          : "Identify the source and assumptions behind the candidate explanation.",
      symbolic
        ? "Translate the task into explicit rules or code. Check units, filters, and boundary conditions, then run it on the evidence."
        : needsComputation
          ? "Add symbolic learning / tools: define the counting or calculation rule and execute it against the data."
          : "Check the reasoning against the source; mark any claim that still needs a calculation or test.",
      "Compare the result with an independent check. Feed confirmed findings back into the knowledge graph; keep unresolved claims open.",
    ],
  };
}
