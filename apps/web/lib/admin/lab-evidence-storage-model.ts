import { extname } from "node:path";

export const defaultMaxBytes = 10 * 1024 * 1024;

export interface StoredLabEvidenceFile {
  fileName: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
}

export interface RemoteUploadInput {
  bytes: Buffer;
  checksumSha256: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
}

export function sanitizeFileName(value: string) {
  const extension = extname(value).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = value
    .slice(0, extension ? -extension.length : undefined)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${base || "lab-evidence"}${extension || ".bin"}`;
}

export function sanitizeStorageKey(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "");
}

export function sanitizePrefix(value: string) {
  return value
    .split("/")
    .map((part) => sanitizeStorageKey(part))
    .filter(Boolean)
    .join("/");
}

export function mimeFromExtension(fileName: string) {
  const extension = extname(fileName).toLowerCase();
  if (extension === ".csv") return "text/csv";
  if (extension === ".json") return "application/json";
  if (extension === ".pdf") return "application/pdf";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  if (extension === ".txt" || extension === ".md") return "text/plain";
  return "application/octet-stream";
}
