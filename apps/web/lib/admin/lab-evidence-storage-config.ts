import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { sanitizePrefix } from "./lab-evidence-storage-model";

export function remoteStorageConfig() {
  const driver = labEvidenceStorageDriver();
  if (driver === "r2") {
    const accountId = requiredEnv("CLOUDFLARE_R2_ACCOUNT_ID");
    return {
      accessKeyId: requiredEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
      bucket: requiredEnv("CLOUDFLARE_R2_BUCKET"),
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      prefix: sanitizePrefix(process.env.LAB_EVIDENCE_REMOTE_PREFIX ?? "lab-evidence"),
      publicBaseUrl: requiredEnv("CLOUDFLARE_R2_PUBLIC_URL"),
      region: "auto"
    };
  }

  if (driver === "s3") {
    return {
      accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY"),
      bucket: requiredEnv("S3_BUCKET"),
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      prefix: sanitizePrefix(process.env.LAB_EVIDENCE_REMOTE_PREFIX ?? "lab-evidence"),
      publicBaseUrl: requiredEnv("S3_PUBLIC_URL"),
      region: process.env.S3_REGION || "us-east-1"
    };
  }

  throw new Error(`Unsupported LAB_EVIDENCE_STORAGE_DRIVER: ${driver}`);
}

export function labEvidenceUploadDir() {
  return process.env.LAB_EVIDENCE_UPLOAD_DIR
    ? resolve(process.env.LAB_EVIDENCE_UPLOAD_DIR)
    : join(findProjectRoot(), "data", "uploads", "lab");
}

export function labEvidenceStorageDriver() {
  return (process.env.LAB_EVIDENCE_STORAGE_DRIVER || "local").toLowerCase();
}

export function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}

export function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for remote lab evidence storage.`);
  }
  return value;
}
