import type { BasePendingReviewDraftSpec } from "./sample-base-pending-review-draft-types";

export const basePendingReviewDraftSpecs: BasePendingReviewDraftSpec[] = [
  {
    group: "pending-review-ugreen",
    id: "art-en-review-ugreen-pending",
    productId: "prod-ugreen-100w",
    locale: "en",
    slug: "ugreen-100w-gan-charger-output",
    title: "Ugreen 100W GaN Charger Output Notes",
    h1: "Ugreen 100W GaN charger output notes",
    metaDescription: "Pending review page waiting for more variant and locale-risk evidence.",
    summary: "This draft is intentionally pending because it needs more local risk and review signal evidence.",
    contentMdx: "variant evidence price pending",
    sectionHeadings: ["Draft notes", "Missing evidence", "Next checks"],
    evidenceIds: ["vc-ugreen-output", "sc-ugreen-100w-title"],
    qualityScore: 66,
    internalLinkLimit: 3,
    affiliateLabel: "Check current AliExpress price",
    affiliateHref: "https://example.com/go/ugreen-100w"
  }
];
