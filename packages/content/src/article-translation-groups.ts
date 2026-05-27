import type { ArticleDraft } from "./article-draft-types";
import type { ArticleTranslationGroupFixture } from "./article-assembly-types";
import { fixtureSlug } from "./article-assembly-slug";

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

function groupDraftsByTranslationGroup(drafts: ArticleDraft[]) {
  return drafts.reduce<Record<string, ArticleDraft[]>>((groups, article) => {
    groups[article.group] = [...(groups[article.group] ?? []), article];
    return groups;
  }, {});
}
