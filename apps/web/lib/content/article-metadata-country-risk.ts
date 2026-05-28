import type { Metadata } from "next";
import { regionalRiskRouteForPath } from "@global-import-lab/seo";
import type { PreviewSearchParamsPromise } from "./page-loader-types";
import { getArticle } from "./repository";
import { metadataForRenderableArticle } from "./article-metadata-renderer";

export async function generateCountryRiskGuideMetadata(
  paramsPromise: Promise<{ slug: string }>,
  routeLocale: string,
  section: "guides" | "guias",
  searchParamsPromise?: PreviewSearchParamsPromise
): Promise<Metadata> {
  const params = await paramsPromise;
  const route = regionalRiskRouteForPath(routeLocale, section, params.slug);
  if (!route) {
    return {};
  }

  return metadataForRenderableArticle(
    await getArticle(route.contentLocale, "risk", route.slug),
    searchParamsPromise
  );
}
