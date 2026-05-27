import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { remoteStorageConfig } from "./lab-evidence-storage-config";
import type { RemoteUploadInput, StoredLabEvidenceFile } from "./lab-evidence-storage-model";

export async function storeRemoteLabEvidenceFile(input: RemoteUploadInput): Promise<StoredLabEvidenceFile> {
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
