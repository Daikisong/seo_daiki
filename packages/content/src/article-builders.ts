import { absoluteUrl, articlePath } from "@global-import-lab/seo";
import type { Article } from "@global-import-lab/types";
import type { ArticleDraft } from "./article-draft-types";
import type { ArticleAssemblyOptions } from "./article-assembly-types";
import { buildArticleHreflangMap } from "./article-hreflang-map";
import { buildProgrammaticInternalLinks } from "./internal-linking";

export function buildArticlesFromDrafts(drafts: ArticleDraft[], options: ArticleAssemblyOptions): Article[] {
  return drafts.map((draft) => buildArticleFromDraft(draft, drafts, options));
}

export function buildArticleFromDraft(draft: ArticleDraft, drafts: ArticleDraft[], options: ArticleAssemblyOptions): Article {
  const { group, ...article } = draft;

  return {
    ...article,
    internalLinks: buildProgrammaticInternalLinks(draft, drafts, options.products),
    canonicalUrl: absoluteUrl(articlePath(article), options.siteUrl),
    hreflangMap: buildArticleHreflangMap(draft, drafts, options.siteUrl, options.xDefaultPath)
  };
}
