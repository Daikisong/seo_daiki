import type { Prisma } from "./generated/prisma/client";

export const topicStatuses = ["candidate", "briefed", "drafted", "published", "rejected"] as const;
export const contentBriefStatuses = ["draft", "approved", "rejected", "converted"] as const;
export const publishingJobStatuses = ["queued", "running", "done", "failed", "blocked"] as const;

export type TopicStatus = (typeof topicStatuses)[number];
export type ContentBriefStatus = (typeof contentBriefStatuses)[number];
export type PublishingJobStatus = (typeof publishingJobStatuses)[number];

export interface MerchantMutationInput {
  id?: string;
  name: string;
  slug: string;
  domain: string;
  merchantType: string;
  allowedDomains: string[];
  defaultRel?: string;
  healthSensitive?: boolean;
  enabled?: boolean;
}

export interface OfferMutationInput {
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
}

export function boundedTrendSignalLimit(limit = 100) {
  return Math.min(Math.max(limit, 1), 500);
}

export function merchantMutationData(input: MerchantMutationInput) {
  return {
    name: input.name,
    slug: input.slug,
    domain: input.domain,
    merchantType: input.merchantType,
    allowedDomains: toJson(input.allowedDomains),
    defaultRel: input.defaultRel || "sponsored nofollow",
    healthSensitive: input.healthSensitive ?? false,
    enabled: input.enabled ?? true
  };
}

export function offerMutationData(input: OfferMutationInput) {
  return {
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
}

export function adminOperationAction(input: { id?: string }) {
  return input.id ? "update" : "create";
}

export function merchantAuditSummary(input: { id?: string }, slug: string) {
  return `${input.id ? "Updated" : "Created"} merchant ${slug}.`;
}

export function offerAuditSummary(input: { id?: string }, title: string) {
  return `${input.id ? "Updated" : "Created"} offer ${title}.`;
}

export function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
