import type { PreviewSearchParams } from "./page-loader-rules";

export interface ArticleRouteParams {
  locale: string;
  slug: string;
}

export type PreviewSearchParamsPromise = Promise<PreviewSearchParams> | undefined;
