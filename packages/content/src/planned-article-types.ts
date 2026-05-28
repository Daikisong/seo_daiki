import type { ArticleSection, InternalLink, Locale, Product } from "@global-import-lab/types";

export interface PlannedArticleContext {
  products: Product[];
  updatedAt: string;
  internalLinks: (locale: Locale) => InternalLink[];
  sections: (headings: string[], evidenceIds: string[]) => ArticleSection[];
}
