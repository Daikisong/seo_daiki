import { prisma } from "./client";
import type { Prisma } from "./generated/prisma/client";

export const topicStatuses = ["candidate", "briefed", "drafted", "published", "rejected"] as const;
export const contentBriefStatuses = ["draft", "approved", "rejected", "converted"] as const;
export const publishingJobStatuses = ["queued", "running", "done", "failed", "blocked"] as const;

export type TopicStatus = (typeof topicStatuses)[number];
export type ContentBriefStatus = (typeof contentBriefStatuses)[number];
export type PublishingJobStatus = (typeof publishingJobStatuses)[number];

export async function listTrendSignals(limit = 100) {
  return prisma.trendSignal.findMany({
    orderBy: { capturedAt: "desc" },
    take: Math.min(Math.max(limit, 1), 500),
    include: { source: true }
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

export async function upsertMerchant(input: {
  id?: string;
  name: string;
  slug: string;
  domain: string;
  merchantType: string;
  allowedDomains: string[];
  defaultRel?: string;
  healthSensitive?: boolean;
  enabled?: boolean;
}) {
  const data = {
    name: input.name,
    slug: input.slug,
    domain: input.domain,
    merchantType: input.merchantType,
    allowedDomains: toJson(input.allowedDomains),
    defaultRel: input.defaultRel || "sponsored nofollow",
    healthSensitive: input.healthSensitive ?? false,
    enabled: input.enabled ?? true
  };

  return prisma.$transaction(async (tx) => {
    const before = input.id ? await tx.merchant.findUnique({ where: { id: input.id } }) : null;
    const after = input.id
      ? await tx.merchant.update({ where: { id: input.id }, data })
      : await tx.merchant.create({ data });
    await tx.auditLog.create({
      data: {
        entityType: "merchant",
        entityId: after.id,
        action: input.id ? "update" : "create",
        actor: "admin",
        summary: `${input.id ? "Updated" : "Created"} merchant ${after.slug}.`,
        beforeJson: before ? toJson(before) : undefined,
        afterJson: toJson(after)
      }
    });
    return after;
  });
}

export async function upsertOffer(input: {
  id?: string;
  merchantId: string;
  programId?: string;
  productId?: string;
  topicId?: string;
  title: string;
  description?: string;
  url: string;
  affiliateUrl: string;
  price?: string;
  currency?: string;
  locale?: string;
  country?: string;
  category: string;
  evidenceLevel?: string;
  healthSensitive?: boolean;
  lastCheckedAt?: string;
  status?: string;
}) {
  const data = {
    merchantId: input.merchantId,
    programId: input.programId || null,
    productId: input.productId || null,
    topicId: input.topicId || null,
    title: input.title,
    description: input.description || null,
    url: input.url,
    affiliateUrl: input.affiliateUrl,
    price: input.price || null,
    currency: input.currency || null,
    locale: input.locale || null,
    country: input.country || null,
    category: input.category,
    evidenceLevel: input.evidenceLevel || "merchant_claim",
    healthSensitive: input.healthSensitive ?? false,
    lastCheckedAt: input.lastCheckedAt ? new Date(input.lastCheckedAt) : null,
    status: input.status || "active"
  };

  return prisma.$transaction(async (tx) => {
    const before = input.id ? await tx.offer.findUnique({ where: { id: input.id } }) : null;
    const after = input.id
      ? await tx.offer.update({ where: { id: input.id }, data })
      : await tx.offer.create({ data });
    await tx.auditLog.create({
      data: {
        entityType: "offer",
        entityId: after.id,
        action: input.id ? "update" : "create",
        actor: "admin",
        summary: `${input.id ? "Updated" : "Created"} offer ${after.title}.`,
        beforeJson: before ? toJson(before) : undefined,
        afterJson: toJson(after)
      }
    });
    return after;
  });
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
