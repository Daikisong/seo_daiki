import assert from "node:assert/strict";
import {
  labEvidenceStorageDriver,
  mimeFromExtension,
  requiredEnv,
  sanitizeFileName,
  sanitizePrefix,
  sanitizeStorageKey
} from "../apps/web/lib/admin/lab-evidence-storage";
import { mimeFromExtension as splitMimeFromExtension } from "../apps/web/lib/admin/lab-evidence-storage-model";

assert.equal(mimeFromExtension, splitMimeFromExtension);
assert.equal(sanitizeFileName("Load Test 65W.PDF"), "load-test-65w.pdf");
assert.equal(sanitizeFileName(""), "lab-evidence.bin");
assert.equal(sanitizeStorageKey("bad/key ../name.csv"), "badkey..name.csv");
assert.equal(sanitizePrefix(" lab / evidence? /2026 "), "lab/evidence/2026");
assert.equal(mimeFromExtension("result.csv"), "text/csv");
assert.equal(mimeFromExtension("image.webp"), "image/webp");
assert.equal(mimeFromExtension("unknown.file"), "application/octet-stream");

const previousDriver = process.env.LAB_EVIDENCE_STORAGE_DRIVER;
delete process.env.LAB_EVIDENCE_STORAGE_DRIVER;
assert.equal(labEvidenceStorageDriver(), "local");
process.env.LAB_EVIDENCE_STORAGE_DRIVER = "S3";
assert.equal(labEvidenceStorageDriver(), "s3");
if (previousDriver === undefined) {
  delete process.env.LAB_EVIDENCE_STORAGE_DRIVER;
} else {
  process.env.LAB_EVIDENCE_STORAGE_DRIVER = previousDriver;
}

assert.throws(() => requiredEnv("__MISSING_LAB_EVIDENCE_TEST_ENV__"), /required for remote lab evidence storage/);

console.log("Lab evidence storage module tests passed");
