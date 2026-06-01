import { existsSync } from "node:fs";
import type { AuditCheck } from "./types";

export function rendererChecks(articleSource: string): AuditCheck[] {
  return [
    { name: "renders hero image", pass: articleSource.includes("<img") && articleSource.includes("heroImage") },
    { name: "renders article metadata", pass: articleSource.includes("articleMeta") && articleSource.includes("<time") },
    { name: "renders review-guide article topbar", pass: articleSource.includes("MarketArticleTopbar") && articleSource.includes("market-article-topbar") },
    { name: "renders quick verdict, score, and highlight panel", pass: articleSource.includes("market-article-review-summary") && articleSource.includes("buildReviewSummary") },
    { name: "renders four-card review method strip", pass: articleSource.includes("market-article-trust-strip") && articleSource.includes("buildTrustCards") && articleSource.includes("methodDisclosureLabel") },
    { name: "renders quick navigation chips from article sections", pass: articleSource.includes("market-article-reader-path") && articleSource.includes("buildReaderPathItems") },
    { name: "uses quick navigation instead of duplicate jump-link clutter", pass: !articleSource.includes("market-article-quick-jumps") && !articleSource.includes("buildQuickJumpLinks") },
    { name: "renders key takeaways", pass: articleSource.includes("keyTakeaways") },
    { name: "renders verdict box", pass: articleSource.includes("verdictBox") },
    { name: "renders fit card from pros/cons without old signal-grid clutter", pass: articleSource.includes("market-article-fit-card") && articleSource.includes("buildFitItems") && !articleSource.includes("market-article-signal-grid") },
    { name: "keeps SERP references internal", pass: !articleSource.includes("market-article-reviewed-pages") },
    { name: "renders table of contents", pass: articleSource.includes("Article table of contents") },
    { name: "renders checklist with action controls", pass: articleSource.includes("post.checklist") && articleSource.includes("market-article-checkmark") && articleSource.includes("checkActionLabel") },
    { name: "renders comparison table", pass: articleSource.includes("comparisonTable") && articleSource.includes("<table") },
    { name: "renders source links", pass: articleSource.includes("sourceLinks") && articleSource.includes("noopener noreferrer") },
    { name: "does not render public research links", pass: !articleSource.includes("publicInternalLinks") && !articleSource.includes("internalLinks.map") },
    { name: "renders answer before checklist and fit blocks", pass: articleSource.indexOf("market-article-answer") > -1 && articleSource.indexOf("market-article-answer") < articleSource.indexOf("market-article-decision-grid") },
    { name: "renders reviewer metadata", pass: articleSource.includes("reviewedBy") && articleSource.includes("articleMeta.reviewer") },
    { name: "renders Article JSON-LD", pass: articleSource.includes("@type") && articleSource.includes("Article") }
  ];
}

export function visualChecks(articleSource: string, cssSource: string, selectedUiReferencePath: string): AuditCheck[] {
  return [
    { name: "uses editorial hero layout", pass: articleSource.includes("market-article-hero") && cssSource.includes(".market-article-hero") },
    { name: "uses selected Image #1 single-column review reading frame", pass: articleSource.includes("market-article-shell") && cssSource.includes("grid-template-columns: minmax(0, 1fr)") && cssSource.includes(".market-article-right-rail") && cssSource.includes("display: none") },
    { name: "does not use dashboard-like three-column shell", pass: !cssSource.includes("210px minmax(0, 720px) 270px") && !articleSource.includes("market-article-left-rail") },
    { name: "uses top reference method strip not old fact rail", pass: !articleSource.includes("market-article-fact-rail") && cssSource.includes("grid-template-columns: repeat(4, minmax(0, 1fr))") },
    { name: "uses dedicated prose styling", pass: articleSource.includes("market-article-prose") && cssSource.includes(".market-article-prose p") },
    { name: "uses compact answer, verdict, and score blocks", pass: articleSource.includes("market-article-answer") && cssSource.includes(".market-article-answer") && cssSource.includes(".market-article-review-summary") },
    { name: "styles review summary, method strip, quick nav, and side-card patterns", pass: cssSource.includes(".market-article-review-summary") && cssSource.includes(".market-article-trust-strip") && cssSource.includes(".market-article-reader-path") && cssSource.includes(".market-article-side-card") },
    { name: "renders checklist and fit cards as first decision blocks", pass: articleSource.includes("market-article-decision-grid") && cssSource.includes(".market-article-decision-grid") && cssSource.includes(".market-article-fit-card") },
    { name: "keeps primary content visually dominant", pass: cssSource.includes("max-width: 1180px") && cssSource.includes("market-article-main") },
    { name: "uses selected Image #1 reference file", pass: existsSync(selectedUiReferencePath) },
    { name: "uses responsive mobile rules", pass: cssSource.includes("@media (max-width: 860px)") && cssSource.includes("@media (max-width: 560px)") },
    { name: "does not scale font size with viewport width", pass: !/font-size:\s*[^;]*(vw|clamp\()/i.test(cssSource) }
  ];
}
