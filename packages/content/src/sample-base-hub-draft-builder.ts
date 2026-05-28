import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import type { EnglishCategoryHubDraftInput, HubDraftSpec } from "./sample-base-hub-draft-types";

export function buildHubDraft(
  { updatedAt, internalLinks, sections }: BaseDraftArticleContext,
  spec: HubDraftSpec
): ArticleDraft {
  return {
    group: spec.group,
    id: spec.id,
    locale: spec.locale,
    slug: spec.slug,
    type: "hub",
    title: spec.title,
    h1: spec.h1 ?? spec.title,
    metaDescription: spec.metaDescription,
    summary: spec.summary,
    contentMdx: spec.contentMdx,
    sections: sections(spec.sectionHeadings, spec.evidenceIds),
    qualityScore: spec.qualityScore ?? 84,
    indexStatus: spec.indexStatus ?? "index",
    publishStatus: "published",
    internalLinks: internalLinks(spec.locale),
    affiliateLinks: [],
    evidenceIds: spec.evidenceIds,
    lastUpdated: updatedAt
  };
}

export function englishCategoryHubDraft(
  context: BaseDraftArticleContext,
  { id, slug, title, summary, evidenceIds, indexStatus = "index", qualityScore = 84 }: EnglishCategoryHubDraftInput
): ArticleDraft {
  return buildHubDraft(context, {
    group: `hub-${slug}`,
    id,
    locale: "en",
    slug,
    type: "hub",
    title,
    metaDescription: `${title} with seller claims, verified evidence, variant traps, price truth, and import risk notes.`,
    summary,
    contentMdx: "category hub product evidence variant price verified market risk methodology data lab guide compare",
    sectionHeadings: ["What this category verifies", "Products under watch", "Common traps", "Data, lab, and guides"],
    evidenceIds,
    indexStatus,
    qualityScore
  });
}
