import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";

export type TrendBlogArticleType = "trend" | "buyer_guide" | "deal_watch" | "ingredient_guide";

export interface TrendBlogArticleSpec {
  group: string;
  id: string;
  productId?: string;
  locale: Locale;
  slug: string;
  type: TrendBlogArticleType;
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  evidenceIds: string[];
  headings: string[];
  affiliateLabel?: string;
  affiliateHref?: string;
}

export interface TrendBlogArticleContext {
  updatedAt: string;
  internalLinks: (locale: Locale) => InternalLink[];
  sections: (headings: string[], evidenceIds: string[]) => ArticleSection[];
}
