import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";

export function buildBasePendingReviewDrafts({
  updatedAt,
  internalLinks,
  sections
}: BaseDraftArticleContext): ArticleDraft[] {
  return [
    {
      group: "pending-review-ugreen",
      id: "art-en-review-ugreen-pending",
      productId: "prod-ugreen-100w",
      locale: "en",
      slug: "ugreen-100w-gan-charger-output",
      type: "review",
      title: "Ugreen 100W GaN Charger Output Notes",
      h1: "Ugreen 100W GaN charger output notes",
      metaDescription: "Pending review page waiting for more variant and locale-risk evidence.",
      summary: "This draft is intentionally pending because it needs more local risk and review signal evidence.",
      contentMdx: "variant evidence price pending",
      sections: sections(["Draft notes", "Missing evidence", "Next checks"], ["vc-ugreen-output", "sc-ugreen-100w-title"]),
      qualityScore: 66,
      indexStatus: "pending",
      publishStatus: "draft",
      internalLinks: internalLinks("en").slice(0, 3),
      affiliateLinks: [
        {
          label: "Check current AliExpress price",
          href: "https://example.com/go/ugreen-100w",
          rel: "sponsored nofollow"
        }
      ],
      evidenceIds: ["vc-ugreen-output", "sc-ugreen-100w-title"],
      lastUpdated: updatedAt
    }
  ];
}
