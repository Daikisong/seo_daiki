import type { Article, ArticleType } from "./types";
import { isIndexableLocale } from "./locales";

export const trendSiteName = "TrendBrief";
export const trendAuthorName = "Jacob";
export const trendContentUnitName = "Brief";
export const trendContentUnitPlural = "Briefs";
export const trendSiteDescription = "Buyer notes for fast-moving trends";
export const trendContactEmail = "contact@trendbrief.com";

export const trendHomeDescription = trendSiteDescription;

export const trendArticleTypes = new Set<ArticleType>(["trend"]);

export type TrendCategory = {
  label: string;
  slug: string;
  href: string;
  keywords: readonly string[];
  isPublic?: boolean;
};

export const trendCategories = [
  {
    label: "Home Briefs",
    slug: "home-trends",
    href: "/category/home-trends/",
    isPublic: true,
    keywords: [
      "home",
      "kitchen",
      "cleaner",
      "humidifier",
      "fan",
      "air conditioner",
      "organizer",
      "steam",
    ],
  },
  {
    label: "Garden Briefs",
    slug: "garden-trends",
    href: "/category/garden-trends/",
    isPublic: false,
    keywords: [
      "garden",
      "yard",
      "lawn",
      "outdoor light",
      "pruning",
      "leaf",
      "pressure washer",
    ],
  },
  {
    label: "Auto Briefs",
    slug: "auto-trends",
    href: "/category/auto-trends/",
    isPublic: false,
    keywords: [
      "car",
      "auto",
      "dash cam",
      "jump starter",
      "tire",
      "vehicle",
      "compressor",
    ],
  },
  {
    label: "Outdoor Briefs",
    slug: "outdoor-trends",
    href: "/category/outdoor-trends/",
    isPublic: false,
    keywords: [
      "camping",
      "outdoor",
      "tent",
      "sleeping bag",
      "solar",
      "portable power",
      "hiking",
    ],
  },
  {
    label: "Tool Briefs",
    slug: "tool-trends",
    href: "/category/tool-trends/",
    isPublic: false,
    keywords: [
      "tool",
      "drill",
      "soldering",
      "multimeter",
      "welder",
      "chainsaw",
      "oscilloscope",
    ],
  },
  {
    label: "Electronics Briefs",
    slug: "electronics-trends",
    href: "/category/electronics-trends/",
    isPublic: true,
    keywords: [
      "charger",
      "gan",
      "usb-c",
      "cable",
      "power bank",
      "adapter",
      "monitor",
      "electronics",
    ],
  },
  {
    label: "Personal Mobility Briefs",
    slug: "personal-mobility-trends",
    href: "/category/personal-mobility-trends/",
    isPublic: false,
    keywords: [
      "bike",
      "scooter",
      "wheelset",
      "mobility",
      "ebike",
      "electric bike",
    ],
  },
] as const satisfies readonly TrendCategory[];

export const visibleTrendCategories = trendCategories.filter(
  (category) => category.isPublic,
);

export function trendCategoryBySlug(slug: string) {
  return trendCategories.find((category) => category.slug === slug);
}

export function isPublicTrendCategory(category: TrendCategory) {
  return Boolean(category.isPublic);
}

export function trendCategoryForArticle(article: Article): TrendCategory {
  if (article.categorySlug) {
    return trendCategoryBySlug(article.categorySlug) ?? trendCategories[0];
  }

  const haystack =
    `${article.title} ${article.h1} ${article.slug} ${article.summary} ${article.contentMdx}`.toLowerCase();
  const categoryPool =
    trendCategories.length > 0 ? trendCategories : [trendCategories[0]];
  const initialScore: { category: TrendCategory; score: number } = {
    category: categoryPool[0],
    score: 0,
  };
  return categoryPool.reduce<{ category: TrendCategory; score: number }>(
    (best, category) => {
      const score = category.keywords.reduce(
        (count, keyword) => count + keywordMatchCount(haystack, keyword),
        0,
      );
      return score > best.score ? { category, score } : best;
    },
    initialScore,
  ).category;
}

function keywordMatchCount(haystack: string, keyword: string) {
  const normalizedKeyword = keyword.toLowerCase();
  if (!normalizedKeyword) {
    return 0;
  }
  return haystack.split(normalizedKeyword).length - 1;
}

export function visibleTrendArticles(articles: Article[]) {
  return articles
    .filter(
      (article) =>
        isIndexableLocale(article.locale) &&
        trendArticleTypes.has(article.type),
    )
    .filter(
      (article) =>
        article.publishStatus === "published" &&
        article.indexStatus === "index",
    )
    .filter((article) =>
      isPublicTrendCategory(trendCategoryForArticle(article)),
    );
}

export function sortTrendArticles(a: Article, b: Article) {
  return Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated);
}
