export function publishingJobOutputLabel(job: { error?: string | null; outputSummary?: string | null }) {
  return job.error || job.outputSummary || "-";
}

export function canRetryPublishingJob(job: { dbBacked: boolean; status: string }) {
  return job.dbBacked && job.status !== "running";
}
