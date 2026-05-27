import { prisma } from "./client";
import {
  adminOperationAction,
  boundedTrendSignalLimit,
  contentBriefStatuses,
  merchantAuditSummary,
  merchantMutationData,
  offerAuditSummary,
  offerMutationData,
  publishingJobStatuses,
  toJson,
  topicStatuses,
  type ContentBriefStatus,
  type MerchantMutationInput,
  type OfferMutationInput,
  type PublishingJobStatus,
  type TopicStatus
} from "./operationsAdminModel";

export {
  contentBriefStatuses,
  publishingJobStatuses,
  topicStatuses,
  type ContentBriefStatus,
  type PublishingJobStatus,
  type TopicStatus
};

export async function listTrendSignals(limit = 100) {
  return prisma.trendSignal.findMany({
    orderBy: { capturedAt: "desc" },
    take: boundedTrendSignalLimit(limit),
    include: { source: true }
  });
}

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
      data: {
        entityType: "publishing-job",
        entityId: row.id,
        action: "create",
        actor: input.actor ?? "admin",
        summary: `Queued publishing job ${input.jobType}.`,
        afterJson: toJson(row)
      }
    });

    return row;
  });
}

export async function listTopics() {
  return prisma.topic.findMany({
    orderBy: [{ status: "asc" }, { score: "desc" }],
    include: {
      _count: { select: { topicSignals: true, contentBriefs: true, offers: true, publishingJobs: true } }
    }
  });
}

export async function listContentBriefs() {
  return prisma.contentBrief.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      topic: { select: { canonicalTopic: true, slug: true, score: true } }
    }
  });
}

export async function listPublishingJobs() {
  return prisma.publishingJob.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      topic: { select: { canonicalTopic: true, slug: true } },
      article: { select: { title: true, slug: true, type: true } }
    }
  });
}

export async function listComplianceArticles() {
  return prisma.article.findMany({
    where: {
      OR: [
        { healthSensitivity: { not: "none" } },
        { complianceStatus: { in: ["blocked", "manual_required", "unchecked"] } },
        { indexStatus: { in: ["noindex", "pending"] } }
      ]
    },
    orderBy: [{ complianceStatus: "asc" }, { updatedAt: "desc" }],
    take: 100,
    select: {
      id: true,
      locale: true,
      slug: true,
      type: true,
      title: true,
      indexStatus: true,
      publishStatus: true,
      healthSensitivity: true,
      complianceStatus: true,
      complianceJson: true,
      updatedAt: true
    }
  });
}

export async function listLocalizationGroups() {
  return prisma.translationGroup.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      canonicalTopic: { select: { canonicalTopic: true, slug: true } },
      sourceArticle: { select: { title: true, locale: true, slug: true, type: true } },
      variants: {
        include: {
          article: { select: { title: true, slug: true, type: true, indexStatus: true, publishStatus: true } }
        },
        orderBy: { locale: "asc" }
      }
    }
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
      data: {
        entityType: "topic",
        entityId: input.id,
        action: "status_update",
        actor: input.actor,
        summary: `Marked topic as ${input.status}.`,
        beforeJson: toJson(before),
        afterJson: toJson(after)
      }
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
      data: {
        entityType: "content-brief",
        entityId: input.id,
        action: "status_update",
        actor: input.actor,
        summary: `Marked content brief as ${input.status}.`,
        beforeJson: toJson(before),
        afterJson: toJson(after)
      }
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
      data: {
        entityType: "publishing-job",
        entityId: input.id,
        action: "retry",
        actor: input.actor,
        summary: "Queued publishing job for retry.",
        beforeJson: toJson(before),
        afterJson: toJson(after)
      }
    });
    return after;
  });
}

export async function upsertMerchant(input: MerchantMutationInput) {
  const data = merchantMutationData(input);

  return prisma.$transaction(async (tx) => {
    const before = input.id ? await tx.merchant.findUnique({ where: { id: input.id } }) : null;
    const after = input.id
      ? await tx.merchant.update({ where: { id: input.id }, data })
      : await tx.merchant.create({ data });
    await tx.auditLog.create({
      data: {
        entityType: "merchant",
        entityId: after.id,
        action: adminOperationAction(input),
        actor: "admin",
        summary: merchantAuditSummary(input, after.slug),
        beforeJson: before ? toJson(before) : undefined,
        afterJson: toJson(after)
      }
    });
    return after;
  });
}

export async function upsertOffer(input: OfferMutationInput) {
  const data = offerMutationData(input);

  return prisma.$transaction(async (tx) => {
    const before = input.id ? await tx.offer.findUnique({ where: { id: input.id } }) : null;
    const after = input.id
      ? await tx.offer.update({ where: { id: input.id }, data })
      : await tx.offer.create({ data });
    await tx.auditLog.create({
      data: {
        entityType: "offer",
        entityId: after.id,
        action: adminOperationAction(input),
        actor: "admin",
        summary: offerAuditSummary(input, after.title),
        beforeJson: before ? toJson(before) : undefined,
        afterJson: toJson(after)
      }
    });
    return after;
  });
}
