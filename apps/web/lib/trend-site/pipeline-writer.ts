import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { PipelineArtifacts } from "./pipeline-models";

export async function writePipelineArtifacts(
  artifacts: PipelineArtifacts,
  outputRoot: string,
) {
  const runDirectory = path.join(outputRoot, artifacts.run_id);
  await mkdir(runDirectory, { recursive: true });

  const files: Array<[string, unknown]> = [
    ["trend-candidate.json", artifacts.trend_candidate],
    ["keyword-expansion.json", artifacts.keyword_expansion],
    ["serp-observations.json", artifacts.serp_observations],
    ["serp-pattern-analysis.json", artifacts.serp_pattern_analysis],
    ["buyer-problem-map.json", artifacts.buyer_problem_map],
    ["commercial-fit-report.json", artifacts.commercial_fit_report],
    ["product-candidates.json", artifacts.product_candidates],
    ["evidence-ledger.json", artifacts.evidence_ledger],
    ["article-strategy.json", artifacts.article_strategy],
    ["article-draft.json", artifacts.article_draft],
    ["quality-gate-report.json", artifacts.quality_gate_report],
    ["repair-tasks.json", artifacts.repair_tasks],
    ["publish-candidate.json", artifacts.publish_candidate],
    ["run.json", artifacts],
  ];

  for (const [fileName, value] of files) {
    await writeFile(
      path.join(runDirectory, fileName),
      `${JSON.stringify(value, null, 2)}\n`,
      "utf8",
    );
  }

  return runDirectory;
}
