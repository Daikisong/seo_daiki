import type { ArticleDraft } from "./article-draft-types";
import type { TrendBlogArticleContext, TrendBlogArticleSpec } from "./trend-blog-article-types";

export function buildTrendBlogDraftArticles(
  context: TrendBlogArticleContext,
  specs: TrendBlogArticleSpec[]
): ArticleDraft[] {
  return specs.map((spec) => buildTrendBlogArticle(spec, context));
}

export function buildTrendBlogArticle(input: TrendBlogArticleSpec, context: TrendBlogArticleContext): ArticleDraft {
  return {
    group: input.group,
    id: input.id,
    productId: input.productId,
    locale: input.locale,
    slug: input.slug,
    type: input.type,
    title: input.title,
    h1: input.h1,
    metaDescription: input.metaDescription,
    summary: input.summary,
    contentMdx: input.contentMdx,
    sections: context.sections(input.headings, input.evidenceIds),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    healthSensitivity: input.type === "ingredient_guide" ? "high" : "none",
    complianceStatus: input.type === "ingredient_guide" ? "passed" : "unchecked",
    complianceJson:
      input.type === "ingredient_guide"
        ? {
            manualApproval: true,
            disclaimerRequired: true,
            healthClaimGuard: "passed"
          }
        : undefined,
    internalLinks: context.internalLinks(input.locale),
    affiliateLinks:
      input.affiliateLabel && input.affiliateHref
        ? [
            {
              label: input.affiliateLabel,
              href: input.affiliateHref,
              rel: "sponsored nofollow"
            }
          ]
        : [],
    evidenceIds: input.evidenceIds,
    lastUpdated: context.updatedAt
  };
}
