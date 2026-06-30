import path from "node:path";
import { fileURLToPath } from "node:url";

import { runTrendToAffiliatePipelineDryRun } from "../lib/trend-site/pipeline-runner";
import { writePipelineArtifacts } from "../lib/trend-site/pipeline-writer";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const outputRoot = path.join(repoRoot, "output", "pipeline-runs");

const artifacts = runTrendToAffiliatePipelineDryRun();
const runDirectory = await writePipelineArtifacts(artifacts, outputRoot);

console.log(`Pipeline dry-run artifacts written to ${runDirectory}`);
console.log(`Quality gate: ${artifacts.quality_gate_report.status}`);
console.log(
  `Publish candidate: canPublish=${artifacts.publish_candidate.canPublish}, manualReviewReady=${artifacts.publish_candidate.manualReviewReady}, manualOnly=${artifacts.publish_candidate.manualOnly}, sitemapAction=${artifacts.publish_candidate.sitemapAction}`
);
