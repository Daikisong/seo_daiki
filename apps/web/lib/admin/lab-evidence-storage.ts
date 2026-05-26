import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const defaultMaxBytes = 10 * 1024 * 1024;

export interface StoredLabEvidenceFile {
  fileName: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
}

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

  if (labEvidenceStorageDriver() !== "local") {
    return storeRemoteLabEvidenceFile({
      bytes,
      checksumSha256,
      fileName: safeName,
      mimeType,
      sizeBytes: file.size,
      storageKey
    });
  }

  const uploadDir = labEvidenceUploadDir();
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, storageKey), bytes);

  return {
    fileName: safeName,
    storageKey,
    publicUrl: `/api/lab-evidence-file/${storageKey}`,
    mimeType,
    sizeBytes: file.size,
    checksumSha256
  };
}

export async function readLabEvidenceFile(storageKey: string) {
  if (labEvidenceStorageDriver() !== "local") {
    throw new Error("Remote lab evidence files are served from their stored publicUrl.");
  }

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

interface RemoteUploadInput {
  bytes: Buffer;
  checksumSha256: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
}

async function storeRemoteLabEvidenceFile(input: RemoteUploadInput): Promise<StoredLabEvidenceFile> {
  const config = remoteStorageConfig();
  const objectKey = config.prefix ? `${config.prefix}/${input.storageKey}` : input.storageKey;
  const client = new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    region: config.region
  });

  await client.send(
    new PutObjectCommand({
      Body: input.bytes,
      Bucket: config.bucket,
      CacheControl: "private, max-age=0",
      ContentDisposition: `attachment; filename="${input.fileName}"`,
      ContentType: input.mimeType,
      Key: objectKey,
      Metadata: {
        checksum_sha256: input.checksumSha256
      }
    })
  );

  return {
    fileName: input.fileName,
    storageKey: objectKey,
    publicUrl: `${config.publicBaseUrl.replace(/\/$/, "")}/${objectKey}`,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    checksumSha256: input.checksumSha256
  };
}

function remoteStorageConfig() {
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

function labEvidenceUploadDir() {
  return process.env.LAB_EVIDENCE_UPLOAD_DIR
    ? resolve(process.env.LAB_EVIDENCE_UPLOAD_DIR)
    : join(findProjectRoot(), "data", "uploads", "lab");
}

function labEvidenceStorageDriver() {
  return (process.env.LAB_EVIDENCE_STORAGE_DRIVER || "local").toLowerCase();
}

function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}

function sanitizeFileName(value: string) {
  const extension = extname(value).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = value
    .slice(0, extension ? -extension.length : undefined)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${base || "lab-evidence"}${extension || ".bin"}`;
}

function sanitizeStorageKey(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "");
}

function sanitizePrefix(value: string) {
  return value
    .split("/")
    .map((part) => sanitizeStorageKey(part))
    .filter(Boolean)
    .join("/");
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for remote lab evidence storage.`);
  }
  return value;
}

function mimeFromExtension(fileName: string) {
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
