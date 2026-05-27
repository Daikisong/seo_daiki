import type { Product } from "@global-import-lab/types";

export interface ArticleTranslationGroupFixture {
  id: string;
  sourceArticleId: string;
  variants: ArticleTranslationVariantFixture[];
}

export interface ArticleTranslationVariantFixture {
  id: string;
  articleId: string;
  locale: string;
  sourceLocale?: string;
  localizationDepthScore: number;
  status: "published" | "draft";
}

export interface ArticleAssemblyOptions {
  products: Product[];
  siteUrl: string;
  xDefaultPath?: string;
}
