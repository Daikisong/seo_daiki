import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { labEvidenceUploadDir } from "./lab-evidence-storage-config";
import {
  mimeFromExtension,
  sanitizeStorageKey,
  type RemoteUploadInput,
  type StoredLabEvidenceFile
} from "./lab-evidence-storage-model";

export async function storeLocalLabEvidenceFile(input: RemoteUploadInput): Promise<StoredLabEvidenceFile> {
  const uploadDir = labEvidenceUploadDir();
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, input.storageKey), input.bytes);

  return {
    fileName: input.fileName,
    storageKey: input.storageKey,
    publicUrl: `/api/lab-evidence-file/${input.storageKey}`,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    checksumSha256: input.checksumSha256
  };
}

export async function readLocalLabEvidenceFile(storageKey: string) {
  const safeKey = sanitizeStorageKey(storageKey);
  if (safeKey !== storageKey) {
    throw new Error("Invalid lab evidence key.");
  }

  const path = join(labEvidenceUploadDir(), safeKey);
  const body = await readFile(path);
  return {
    body,
    mimeType: mimeFromExtension(safeKey),
    fileName: safeKey
  };
}
