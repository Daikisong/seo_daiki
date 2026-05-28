import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";

export interface BaseDraftArticleContext {
  updatedAt: string;
  internalLinks: (locale: Locale) => InternalLink[];
  sections: (headings: string[], evidenceIds: string[]) => ArticleSection[];
}

export type BuildBaseDraftArticlesOptions = BaseDraftArticleContext;
