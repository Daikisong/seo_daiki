import type {
  AffiliateLink,
  Article,
  ArticleSection,
  ArticleType,
  EvidencePack,
  IndexStatus,
  InternalLink,
  Locale,
  MarketRisk,
  PriceSnapshot,
  Product,
  PublishStatus,
  ReviewSignal,
  SellerClaim,
  Variant,
  VerifiedClaim
} from "@global-import-lab/types";
import { prisma } from "./client";

type JsonValue = unknown;

export async function getDbArticles(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: { archivedAt: null },
    include: {
      affiliatePlacements: {
        include: {
          offer: {
            include: {
              merchant: true
            }
          }
        }
      }
    },
    orderBy: [{ locale: "asc" }, { type: "asc" }, { slug: "asc" }]
  });

  return rows.map((row) => ({
    id: row.id,
    productId: row.productId ?? undefined,
    locale: row.locale as Locale,
    slug: row.slug,
    type: row.type as ArticleType,
    title: row.title,
    h1: row.h1 ?? row.title,
    metaDescription: row.metaDescription ?? "",
    summary: row.summary ?? row.metaDescription ?? "",
    contentMdx: row.contentMdx,
    sections: jsonArray<ArticleSection>(row.sections),
    jsonLd: jsonObject(row.jsonLd),
    qualityScore: row.qualityScore,
    indexStatus: row.indexStatus as IndexStatus,
    publishStatus: row.publishStatus as PublishStatus,
    healthSensitivity: row.healthSensitivity as Article["healthSensitivity"],
    complianceStatus: row.complianceStatus as Article["complianceStatus"],
    complianceJson: jsonObject(row.complianceJson),
    localizationDepthScore: localizationDepthScoreFromJson(row.complianceJson),
    translationStatus: translationStatusFromJson(row.complianceJson),
    canonicalUrl: row.canonicalUrl ?? undefined,
    hreflangMap: jsonObject(row.hreflangMap),
    internalLinks: jsonArray<InternalLink>(row.internalLinks),
    affiliateLinks: affiliateLinksFromJson(row.affiliateLinks, row.affiliatePlacements),
    evidenceIds: jsonArray<string>(row.evidenceIds),
    lastUpdated: (row.lastUpdated ?? row.updatedAt).toISOString().slice(0, 10)
  }));
}

export async function getDbProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { archivedAt: null },
    include: {
      variants: { where: { archivedAt: null } },
      sellerClaims: { where: { archivedAt: null } },
      verifiedClaims: { where: { archivedAt: null } },
      reviewSignals: true,
      priceSnapshots: true,
      marketRisks: { where: { archivedAt: null } }
    },
    orderBy: { canonicalName: "asc" }
  });

  return rows.map((row) => ({
    id: row.id,
    canonicalName: row.canonicalName,
    slug: row.slug,
    category: row.category,
    brandClaim: row.brandClaim ?? undefined,
    identityConfidence: row.identityConfidence,
    imageHash: row.imageHash ?? undefined,
    variants: row.variants.map((variant): Variant => ({
      id: variant.id,
      productId: variant.productId,
      sourceSku: variant.sourceSku ?? undefined,
      optionName: variant.optionName,
      wattageClaim: variant.wattageClaim ?? undefined,
      plugType: variant.plugType ?? undefined,
      cableIncluded: variant.cableIncluded ?? undefined,
      sourceUrl: variant.sourceUrl,
      affiliateUrl: variant.affiliateUrl ?? undefined,
      sellerName: variant.sellerName ?? undefined,
      sellerId: variant.sellerId ?? undefined,
      riskFlags: jsonArray<string>(variant.riskFlags)
    })),
    sellerClaims: row.sellerClaims.map((claim): SellerClaim => ({
      id: claim.id,
      productId: claim.productId,
      claimType: claim.claimType,
      claimValue: claim.claimValue,
      rawText: claim.rawText ?? undefined,
      sourceUrl: claim.sourceUrl ?? undefined,
      capturedAt: claim.capturedAt.toISOString().slice(0, 10),
      confidence: claim.confidence
    })),
    verifiedClaims: row.verifiedClaims.map((claim): VerifiedClaim => ({
      id: claim.id,
      productId: claim.productId,
      testType: claim.testType,
      resultValue: claim.resultValue,
      unit: claim.unit ?? undefined,
      method: claim.method,
      evidenceUrl: claim.evidenceUrl ?? undefined,
      confidence: claim.confidence,
      testedAt: claim.testedAt?.toISOString().slice(0, 10)
    })),
    reviewSignals: row.reviewSignals.map((signal): ReviewSignal => ({
      id: signal.id,
      productId: signal.productId,
      locale: signal.locale as Locale,
      topic: signal.topic,
      sentiment: signal.sentiment as ReviewSignal["sentiment"],
      count: signal.count,
      confidence: signal.confidence,
      window: signal.window ?? undefined
    })),
    priceSnapshots: row.priceSnapshots.map((snapshot): PriceSnapshot => ({
      id: snapshot.id,
      productId: snapshot.productId,
      variantId: snapshot.variantId ?? undefined,
      country: snapshot.country ?? undefined,
      currency: snapshot.currency,
      price: Number(snapshot.price),
      shipping: snapshot.shipping === null ? undefined : Number(snapshot.shipping),
      coupon: snapshot.coupon === null ? undefined : Number(snapshot.coupon),
      finalPrice: snapshot.finalPrice === null ? undefined : Number(snapshot.finalPrice),
      capturedAt: snapshot.capturedAt.toISOString().slice(0, 10)
    })),
    marketRisks: row.marketRisks.map((risk): MarketRisk => ({
      id: risk.id,
      productId: risk.productId,
      locale: risk.locale as Locale,
      country: risk.country ?? undefined,
      plugRisk: risk.plugRisk ?? undefined,
      customsRisk: risk.customsRisk ?? undefined,
      certificationRisk: risk.certificationRisk ?? undefined,
      returnRisk: risk.returnRisk ?? undefined,
      localAlternativeNote: risk.localAlternativeNote ?? undefined,
      score: risk.score
    }))
  }));
}

export async function getDbEvidencePacks(): Promise<EvidencePack[]> {
  const rows = await prisma.evidencePack.findMany({
    where: { archivedAt: null },
    orderBy: [{ locale: "asc" }, { createdAt: "desc" }]
  });

  return rows.map((row) => ({
    id: row.id,
    productId: row.productId ?? undefined,
    locale: row.locale as Locale,
    packJson: jsonObject(row.packJson) as EvidencePack["packJson"],
    createdAt: row.createdAt.toISOString().slice(0, 10)
  }));
}

function jsonArray<T>(value: JsonValue): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function jsonObject<T extends Record<string, unknown> = Record<string, unknown>>(value: JsonValue): T {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as T) : ({} as T);
}

type ArticleAffiliatePlacementRow = {
  id: string;
  anchorText: string;
  rel: string;
  disclosureShown: boolean;
  status: string;
  offer: {
    affiliateUrl: string;
    status: string;
    healthSensitive: boolean;
    merchant: {
      slug: string;
      allowedDomains: unknown;
    };
  };
};

function affiliateLinksFromJson(value: JsonValue, placements: ArticleAffiliatePlacementRow[]): AffiliateLink[] {
  const links = jsonArray<AffiliateLink>(value);
  if (placements.length === 0) {
    return links;
  }

  return links.map((link) => {
    const placement =
      (link.placementId ? placements.find((item) => item.id === link.placementId) : undefined) ??
      placements.find((item) => item.anchorText === link.label);

    if (!placement) {
      return link;
    }

    return {
      ...link,
      placementId: placement.id,
      placementStatus: placementStatus(placement.status),
      disclosureShown: placement.disclosureShown,
      offerStatus: offerStatus(placement.offer.status),
      merchantSlug: placement.offer.merchant.slug,
      merchantAllowedDomains: jsonArray<string>(placement.offer.merchant.allowedDomains),
      offerHealthSensitive: placement.offer.healthSensitive,
      rel: placement.rel,
      href: placement.offer.affiliateUrl
    };
  });
}

function localizationDepthScoreFromJson(value: JsonValue) {
  const json = jsonObject(value);
  const raw = json.localizationDepthScore;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : undefined;
}

function translationStatusFromJson(value: JsonValue): Article["translationStatus"] {
  const json = jsonObject(value);
  const raw = json.translationStatus;
  return raw === "draft" || raw === "localized" || raw === "approved" || raw === "published" ? raw : undefined;
}

function placementStatus(value: string): AffiliateLink["placementStatus"] {
  return value === "approved" || value === "disabled" || value === "rejected" || value === "draft" ? value : "draft";
}

function offerStatus(value: string): AffiliateLink["offerStatus"] {
  return value === "active" || value === "inactive" || value === "expired" || value === "draft" ? value : "draft";
}
