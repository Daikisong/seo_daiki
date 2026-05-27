import { prisma } from "./client";
import {
  contentBriefStatusUpdatedAuditData,
  publishingJobCreatedAuditData,
  publishingJobRetryAuditData,
  topicStatusUpdatedAuditData
} from "./operationsAdminAuditPayloads";
import { toJson, type ContentBriefStatus, type TopicStatus } from "./operationsAdminModel";

export async function createPublishingJob(input: {
  topicId?: string;
  articleId?: string;
  locale: string;
  jobType: string;
  inputJson?: unknown;
  actor?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const row = await tx.publishingJob.create({
      data: {
        topicId: input.topicId || null,
        articleId: input.articleId || null,
        locale: input.locale,
        jobType: input.jobType,
        status: "queued",
        inputJson: input.inputJson === undefined ? undefined : toJson(input.inputJson)
      }
    });

    await tx.auditLog.create({
      data: publishingJobCreatedAuditData({ row, jobType: input.jobType, actor: input.actor })
    });

    return row;
  });
}

export async function updateTopicStatus(input: { id: string; status: TopicStatus; actor?: string }) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.topic.findUnique({ where: { id: input.id } });
    if (!before) {
      throw new Error(`Topic ${input.id} was not found.`);
    }
    const after = await tx.topic.update({ where: { id: input.id }, data: { status: input.status } });
    await tx.auditLog.create({
      data: topicStatusUpdatedAuditData({ ...input, before, after })
    });
    return after;
  });
}

export async function updateContentBriefStatus(input: { id: string; status: ContentBriefStatus; actor?: string }) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.contentBrief.findUnique({ where: { id: input.id } });
    if (!before) {
      throw new Error(`ContentBrief ${input.id} was not found.`);
    }
    const after = await tx.contentBrief.update({ where: { id: input.id }, data: { status: input.status } });
    await tx.auditLog.create({
      data: contentBriefStatusUpdatedAuditData({ ...input, before, after })
    });
    return after;
  });
}

export async function retryPublishingJob(input: { id: string; actor?: string }) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.publishingJob.findUnique({ where: { id: input.id } });
    if (!before) {
      throw new Error(`PublishingJob ${input.id} was not found.`);
    }
    const after = await tx.publishingJob.update({
      where: { id: input.id },
      data: { status: "queued", error: null }
    });
    await tx.auditLog.create({
      data: publishingJobRetryAuditData({ ...input, before, after })
    });
    return after;
  });
}
