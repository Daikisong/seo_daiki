import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import type { BaseRiskDraftSpec } from "./sample-base-risk-draft-types";

export function buildBaseRiskDraft(context: BaseDraftArticleContext, spec: BaseRiskDraftSpec): ArticleDraft {
  return {
    group: spec.group,
    id: spec.id,
    productId: spec.productId,
    locale: spec.locale,
    slug: spec.slug,
    type: "risk",
    title: spec.title,
    h1: spec.h1,
    metaDescription: spec.metaDescription,
    summary: spec.summary,
    contentMdx: spec.contentMdx,
    sections: context.sections(spec.sectionHeadings, spec.evidenceIds),
    qualityScore: spec.qualityScore,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: context.internalLinks(spec.locale),
    affiliateLinks: [],
    evidenceIds: spec.evidenceIds,
    lastUpdated: context.updatedAt
  };
}
