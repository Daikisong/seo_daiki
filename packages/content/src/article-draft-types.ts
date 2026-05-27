import type { Article, ArticleType, Locale } from "@global-import-lab/types";

export type ArticleDraft = Omit<Article, "canonicalUrl" | "hreflangMap"> & { group: string };

export type UrlPlanRow = {
  locale: Locale;
  type: ArticleType;
  count: number;
  indexTarget: number;
  cluster: string;
};
