import { articleTranslationGroups, articles, evidencePacks } from "@global-import-lab/content";
import type { Article } from "@global-import-lab/types";
import { affiliateLinksWithPlacementIds } from "./seedAffiliateModel";
import type { SeedDbClient } from "./seedTypes";
import { toSeedJson } from "./seedTypes";

type SeedEvidencePack = (typeof evidencePacks)[number];
type SeedTranslationGroup = (typeof articleTranslationGroups)[number];

export async function seedEvidencePacks(db: SeedDbClient, packs: SeedEvidencePack[] = evidencePacks) {
  await db.evidencePack.deleteMany({});
  for (const pack of packs) {
    await db.evidencePack.create({
      data: {
        id: pack.id,
        productId: pack.productId,
        locale: pack.locale,
        packJson: toSeedJson(pack.packJson),
        createdAt: new Date(pack.createdAt)
      }
    });
  }
}

export async function seedArticles(db: SeedDbClient, seedArticles: Article[] = articles) {
  await db.article.deleteMany({});
  for (const article of seedArticles) {
    const affiliateLinks = affiliateLinksWithPlacementIds(article);
    await db.article.create({
      data: {
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
      }
    });
  }
}

export async function seedTranslationGroups(
  db: SeedDbClient,
  groups: SeedTranslationGroup[] = articleTranslationGroups
) {
  for (const group of groups) {
    await db.translationGroup.create({
      data: {
        id: group.id,
        sourceArticleId: group.sourceArticleId,
        variants: {
          create: group.variants.map((variant) => ({
            id: variant.id,
            articleId: variant.articleId,
            locale: variant.locale,
            sourceLocale: variant.sourceLocale,
            localizationDepthScore: variant.localizationDepthScore,
            status: variant.status
          }))
        }
      }
    });
  }
}
