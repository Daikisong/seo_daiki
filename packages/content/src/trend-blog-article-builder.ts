import type { ArticleDraft } from "./article-draft-types";
import type { TrendBlogArticleContext, TrendBlogArticleSpec } from "./trend-blog-article-types";
import type { AffiliateLink } from "@global-import-lab/types";

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
    affiliateLinks: affiliateLinksForSpec(input),
    evidenceIds: input.evidenceIds,
    lastUpdated: context.updatedAt
  };
}

function affiliateLinksForSpec(input: TrendBlogArticleSpec): AffiliateLink[] {
  if (!input.affiliateLabel || !input.affiliateHref) {
    return [];
  }

  return [
    {
      label: input.affiliateLabel,
      href: input.affiliateHref,
      rel: "sponsored nofollow",
      ...trustedMerchantMetadata(input.id, input.affiliateHref)
    }
  ];
}

function trustedMerchantMetadata(articleId: string, href: string): Partial<AffiliateLink> {
  const merchant = merchantForHref(href);
  if (!merchant) {
    return {};
  }

  return {
    placementId: `${articleId}-${merchant.slug}-placement`,
    placementStatus: "approved",
    disclosureShown: true,
    offerStatus: "active",
    merchantSlug: merchant.slug,
    merchantAllowedDomains: merchant.allowedDomains
  };
}

function merchantForHref(href: string) {
  try {
    const hostname = new URL(href).hostname.replace(/^www\./, "");
    if (hostname === "aliexpress.com" || hostname.endsWith(".aliexpress.com")) {
      return {
        slug: "aliexpress",
        allowedDomains: ["aliexpress.com", "www.aliexpress.com"]
      };
    }
    if (hostname === "iherb.com" || hostname.endsWith(".iherb.com")) {
      return {
        slug: "iherb",
        allowedDomains: ["iherb.com", "www.iherb.com"]
      };
    }
  } catch {
    return undefined;
  }

  return undefined;
}
