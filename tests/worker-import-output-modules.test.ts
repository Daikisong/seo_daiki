import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  importRefreshSuggestions as facadeImportRefreshSuggestions,
  importSearchConsoleSnapshot as facadeImportSearchConsoleSnapshot,
  importWorkerEvidence as facadeImportWorkerEvidence
} from "../packages/db/src/importWorkerOutputs";
import { importWorkerEvidence } from "../packages/db/src/workerEvidenceImporter";
import {
  defaultExistingPath,
  loadWorkerEvidencePacks,
  readJsonFile
} from "../packages/db/src/workerImportPaths";
import {
  importRefreshSuggestions,
  importSearchConsoleSnapshot
} from "../packages/db/src/workerSearchConsoleImporter";

assert.equal(facadeImportWorkerEvidence, importWorkerEvidence);
assert.equal(facadeImportSearchConsoleSnapshot, importSearchConsoleSnapshot);
assert.equal(facadeImportRefreshSuggestions, importRefreshSuggestions);

const root = mkdtempSync(join(tmpdir(), "seo-daiki-worker-import-"));
try {
  mkdirSync(join(root, "data/evidence_packs"), { recursive: true });
  mkdirSync(join(root, "data/snapshots"), { recursive: true });
  writeFileSync(join(root, "data/evidence_packs/pack.json"), JSON.stringify([{ product_id: "prod-1" }]));
  writeFileSync(join(root, "data/evidence_packs/readme.txt"), "ignored");
  writeFileSync(join(root, "data/snapshots/search_console_sample.json"), JSON.stringify([{ query: "sample" }]));

  assert.deepEqual(readJsonFile(join(root, "data/evidence_packs/pack.json")), [{ product_id: "prod-1" }]);
  assert.deepEqual(loadWorkerEvidencePacks(root), [{ product_id: "prod-1" }]);
  assert.equal(defaultExistingPath(root, ["missing.json", "data/snapshots/search_console_sample.json"]), join(root, "data/snapshots/search_console_sample.json"));
  assert.throws(() => defaultExistingPath(root, ["missing-a.json", "missing-b.json"]), /None of these files exist/);
} finally {
  rmSync(root, { recursive: true, force: true });
}

console.log("Worker import output module tests passed");
