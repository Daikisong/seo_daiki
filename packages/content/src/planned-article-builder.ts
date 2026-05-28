import type { ArticleDraft, UrlPlanRow } from "./article-draft-types";
import { plannedLocaleText, plannedTypeText } from "./planned-article-copy";
import { plannedEvidenceIds } from "./planned-article-evidence";
import { plannedSlug } from "./planned-article-slug";
import type { PlannedArticleContext } from "./planned-article-types";
import { initialUrlPlan } from "./planned-article-url-plan";

export function buildGeneratedDraftArticles(
  context: PlannedArticleContext,
  urlPlan: UrlPlanRow[] = initialUrlPlan
): ArticleDraft[] {
  return urlPlan.flatMap((row) => Array.from({ length: row.count }, (_, index) => buildPlannedArticle(row, index + 1, context)));
}

export function buildPlannedArticle(row: UrlPlanRow, ordinal: number, context: PlannedArticleContext): ArticleDraft {
  const indexable = ordinal <= row.indexTarget;
  const product = context.products[(ordinal - 1) % context.products.length];
  const localeText = plannedLocaleText(row.locale);
  const typeText = plannedTypeText(row.type, row.locale);
  const slug = plannedSlug(row, ordinal);
  const evidenceIds = plannedEvidenceIds(context.products, row.locale, product.id);
  const productId = row.type === "hub" || row.type === "methodology" ? undefined : product.id;
  const title = `${localeText.prefix} ${typeText.title} ${ordinal}: ${localeText.clusterName}`;
  const summary = `${localeText.summary} It maps seller claims, verified evidence, variant traps, price zones, internal links, and local buyer risk before the page can be indexed.`;

  return {
    group: `planned-${row.locale}-${row.type}-${ordinal}`,
    id: `art-planned-${row.locale}-${row.type}-${String(ordinal).padStart(2, "0")}`,
    productId,
    locale: row.locale,
    slug,
    type: row.type,
    title,
    h1: `${typeText.h1} ${ordinal}: ${localeText.clusterName}`,
    metaDescription: `${localeText.meta} This planned URL is generated from the USB-C evidence inventory and uses the index gate before search exposure.`,
    summary,
    contentMdx:
      "planned inventory variant option plug cable evidence price verified customs return alternative internal links locale risk quality gate",
    sections: context.sections(
      [
        localeText.sections[0],
        localeText.sections[1],
        localeText.sections[2],
        localeText.sections[3],
        localeText.sections[4]
      ],
      evidenceIds
    ),
    qualityScore: indexable ? 84 : 62,
    indexStatus: indexable ? "index" : "pending",
    publishStatus: indexable ? "published" : "draft",
    internalLinks: context.internalLinks(row.locale),
    affiliateLinks:
      row.type === "review"
        ? [
            {
              label: localeText.affiliateLabel,
              href: product.variants[0]?.affiliateUrl ?? "https://example.com/go/import-product",
              rel: "sponsored nofollow"
            }
          ]
        : [],
    evidenceIds,
    lastUpdated: context.updatedAt
  };
}
