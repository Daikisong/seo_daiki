import type { Article, EvidencePack, Locale } from "@global-import-lab/types";
import { affiliateLinksWithPlacementIds } from "./seedAffiliateModel";
import { toSeedJson } from "./seedTypes";

export type SeedTranslationGroupRecord = {
  id: string;
  sourceArticleId: string;
  variants: Array<{
    articleId: string;
    id: string;
    locale: string;
    localizationDepthScore: number;
    sourceLocale?: string;
    status: string;
  }>;
};

export function seedEvidencePackCreateData(pack: EvidencePack) {
  return {
    id: pack.id,
    productId: pack.productId,
    locale: pack.locale,
    packJson: toSeedJson(pack.packJson),
    createdAt: new Date(pack.createdAt)
  };
}

export function seedArticleCreateData(article: Article) {
  const affiliateLinks = affiliateLinksWithPlacementIds(article);
  return {
    id: article.id,
    productId: article.productId,
    locale: article.locale,
    slug: article.slug,
    type: article.type,
    title: article.title,
    h1: article.h1,
    metaDescription: article.metaDescription,
    summary: article.summary,
    contentMdx: article.contentMdx,
    sections: toSeedJson(article.sections),
    internalLinks: toSeedJson(article.internalLinks),
    affiliateLinks: toSeedJson(affiliateLinks),
    evidenceIds: toSeedJson(article.evidenceIds),
    jsonLd: toSeedJson(article.jsonLd ?? {}),
    qualityScore: article.qualityScore,
    indexStatus: article.indexStatus,
    publishStatus: article.publishStatus,
    healthSensitivity: article.healthSensitivity ?? "none",
    complianceStatus: article.complianceStatus ?? "unchecked",
    complianceJson: article.complianceJson === undefined ? undefined : toSeedJson(article.complianceJson),
    canonicalUrl: article.canonicalUrl,
    hreflangMap: toSeedJson(article.hreflangMap),
    lastUpdated: new Date(article.lastUpdated)
  };
}

export function seedTranslationGroupCreateData(group: SeedTranslationGroupRecord) {
  return {
    id: group.id,
    sourceArticleId: group.sourceArticleId,
    variants: {
      create: group.variants.map((variant) => ({
        id: variant.id,
        articleId: variant.articleId,
        locale: variant.locale as Locale,
        sourceLocale: variant.sourceLocale as Locale | undefined,
        localizationDepthScore: variant.localizationDepthScore,
        status: variant.status
      }))
    }
  };
}
