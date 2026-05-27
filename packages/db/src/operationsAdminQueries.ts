import { prisma } from "./client";
import { boundedTrendSignalLimit } from "./operationsAdminModel";

export async function listTrendSignals(limit = 100) {
  return prisma.trendSignal.findMany({
    orderBy: { capturedAt: "desc" },
    take: boundedTrendSignalLimit(limit),
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
