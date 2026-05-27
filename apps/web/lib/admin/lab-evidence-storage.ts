import { createHash, randomUUID } from "node:crypto";
import { labEvidenceStorageDriver } from "./lab-evidence-storage-config";
import { readLocalLabEvidenceFile, storeLocalLabEvidenceFile } from "./lab-evidence-storage-local";
import {
  defaultMaxBytes,
  mimeFromExtension,
  sanitizeFileName,
  type StoredLabEvidenceFile
} from "./lab-evidence-storage-model";
import { storeRemoteLabEvidenceFile } from "./lab-evidence-storage-remote";

export async function storeLabEvidenceFile(file: File): Promise<StoredLabEvidenceFile> {
  const maxBytes = Number(process.env.MAX_LAB_EVIDENCE_BYTES ?? defaultMaxBytes);
  if (file.size <= 0) {
    throw new Error("Upload file is empty.");
  }
  if (file.size > maxBytes) {
    throw new Error(`Upload file is too large. Max bytes: ${maxBytes}.`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const checksumSha256 = createHash("sha256").update(bytes).digest("hex");
  const safeName = sanitizeFileName(file.name || "lab-evidence.bin");
  const storageKey = `${Date.now()}-${randomUUID()}-${safeName}`;
  const mimeType = file.type || mimeFromExtension(safeName);
  const input = {
    bytes,
    checksumSha256,
    fileName: safeName,
    mimeType,
    sizeBytes: file.size,
    storageKey
  };

  if (labEvidenceStorageDriver() !== "local") {
    return storeRemoteLabEvidenceFile(input);
  }

  return storeLocalLabEvidenceFile(input);
}

export async function readLabEvidenceFile(storageKey: string) {
  if (labEvidenceStorageDriver() !== "local") {
    throw new Error("Remote lab evidence files are served from their stored publicUrl.");
  }

  return readLocalLabEvidenceFile(storageKey);
}

export {
  findProjectRoot,
  labEvidenceStorageDriver,
  labEvidenceUploadDir,
  remoteStorageConfig,
  requiredEnv
} from "./lab-evidence-storage-config";
export {
  readLocalLabEvidenceFile,
  storeLocalLabEvidenceFile
} from "./lab-evidence-storage-local";
export {
  defaultMaxBytes,
  mimeFromExtension,
  sanitizeFileName,
  sanitizePrefix,
  sanitizeStorageKey
} from "./lab-evidence-storage-model";
export type {
  RemoteUploadInput,
  StoredLabEvidenceFile
} from "./lab-evidence-storage-model";
export {
  storeRemoteLabEvidenceFile
} from "./lab-evidence-storage-remote";
