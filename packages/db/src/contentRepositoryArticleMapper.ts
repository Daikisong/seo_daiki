import type {
  Article,
  ArticleSection,
  ArticleType,
  IndexStatus,
  InternalLink,
  Locale,
  PublishStatus
} from "@global-import-lab/types";
import { affiliateLinksFromJson, type ArticleAffiliatePlacementRow } from "./contentRepositoryAffiliateLinks";
import {
  jsonArray,
  jsonObject,
  localizationDepthScoreFromJson,
  translationStatusFromJson,
  type JsonValue
} from "./contentRepositoryJson";

type Nullable<T> = T | null | undefined;

export type DbArticleRow = {
  id: string;
  productId: Nullable<string>;
  locale: string;
  slug: string;
  type: string;
  title: string;
  h1: Nullable<string>;
  metaDescription: Nullable<string>;
  summary: Nullable<string>;
  contentMdx: string;
  sections: JsonValue;
  jsonLd: JsonValue;
  qualityScore: number;
  indexStatus: string;
  publishStatus: string;
  healthSensitivity: string;
  complianceStatus: string;
  complianceJson: JsonValue;
  canonicalUrl: Nullable<string>;
  hreflangMap: JsonValue;
  internalLinks: JsonValue;
  affiliateLinks: JsonValue;
  evidenceIds: JsonValue;
  lastUpdated: Nullable<Date>;
  updatedAt: Date;
  affiliatePlacements: ArticleAffiliatePlacementRow[];
};

export function mapDbArticle(row: DbArticleRow): Article {
  return {
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
  };
}
