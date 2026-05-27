import { toJson } from "./operationsAdminModel";
import type { ContentBriefStatus, TopicStatus } from "./operationsAdminModel";

export function publishingJobCreatedAuditData(input: {
  row: { id: string };
  jobType: string;
  actor?: string;
}) {
  return {
    entityType: "publishing-job",
    entityId: input.row.id,
    action: "create",
    actor: input.actor ?? "admin",
    summary: `Queued publishing job ${input.jobType}.`,
    afterJson: toJson(input.row)
  };
}

export function topicStatusUpdatedAuditData(input: {
  id: string;
  status: TopicStatus;
  actor?: string;
  before: unknown;
  after: unknown;
}) {
  return {
    entityType: "topic",
    entityId: input.id,
    action: "status_update",
    actor: input.actor,
    summary: `Marked topic as ${input.status}.`,
    beforeJson: toJson(input.before),
    afterJson: toJson(input.after)
  };
}

export function contentBriefStatusUpdatedAuditData(input: {
  id: string;
  status: ContentBriefStatus;
  actor?: string;
  before: unknown;
  after: unknown;
}) {
  return {
    entityType: "content-brief",
    entityId: input.id,
    action: "status_update",
    actor: input.actor,
    summary: `Marked content brief as ${input.status}.`,
    beforeJson: toJson(input.before),
    afterJson: toJson(input.after)
  };
}

export function publishingJobRetryAuditData(input: {
  id: string;
  actor?: string;
  before: unknown;
  after: unknown;
}) {
  return {
    entityType: "publishing-job",
    entityId: input.id,
    action: "retry",
    actor: input.actor,
    summary: "Queued publishing job for retry.",
    beforeJson: toJson(input.before),
    afterJson: toJson(input.after)
  };
}
