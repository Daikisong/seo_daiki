import { absoluteUrl, articlePath, hreflangKeyForArticle } from "@global-import-lab/seo";
import type { HreflangMap } from "@global-import-lab/types";
import type { ArticleDraft } from "./article-draft-types";

export function buildArticleHreflangMap(
  draft: ArticleDraft,
  drafts: ArticleDraft[],
  siteUrl: string,
  xDefaultPath = "/"
): HreflangMap {
  const alternates = drafts
    .filter((candidate) => candidate.group === draft.group)
    .reduce<HreflangMap>((map, candidate) => {
      map[hreflangKeyForArticle(candidate)] = absoluteUrl(articlePath(candidate), siteUrl);
      return map;
    }, {});

  return {
    ...alternates,
    "x-default": absoluteUrl(xDefaultPath, siteUrl)
  };
}
