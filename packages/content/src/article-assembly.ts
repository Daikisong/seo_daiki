import { absoluteUrl, articlePath, hreflangKeyForArticle } from "@global-import-lab/seo";
import type { Article, HreflangMap, Product } from "@global-import-lab/types";
import type { ArticleDraft } from "./article-draft-types";
import { buildProgrammaticInternalLinks } from "./internal-linking";

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

export function buildArticleTranslationGroups(drafts: ArticleDraft[]): ArticleTranslationGroupFixture[] {
  return Object.values(groupDraftsByTranslationGroup(drafts))
    .filter((groupArticles) => new Set(groupArticles.map((article) => article.locale)).size > 1)
    .map((groupArticles) => {
      const source = groupArticles.find((article) => article.locale === "en") ?? groupArticles[0];
      return {
        id: `tg-${fixtureSlug(source.group)}`,
        sourceArticleId: source.id,
        variants: groupArticles.map((article) => ({
          id: `tv-${article.id}`,
          articleId: article.id,
          locale: article.locale,
          sourceLocale: article.id === source.id ? undefined : source.locale,
          localizationDepthScore: article.id === source.id ? 100 : article.indexStatus === "index" ? 84 : 55,
          status: article.publishStatus === "published" && article.indexStatus === "index" ? "published" : "draft"
        }))
      };
    });
}

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

export function fixtureSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function groupDraftsByTranslationGroup(drafts: ArticleDraft[]) {
  return drafts.reduce<Record<string, ArticleDraft[]>>((groups, article) => {
    groups[article.group] = [...(groups[article.group] ?? []), article];
    return groups;
  }, {});
}
