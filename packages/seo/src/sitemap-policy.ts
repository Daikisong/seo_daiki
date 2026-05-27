import type { Article } from "@global-import-lab/types";

export function shouldIncludeInSitemap(article: Article) {
  return article.publishStatus === "published" && article.indexStatus === "index";
}

export function sitemapChangeFrequency(article: Article): "weekly" | "monthly" {
  return ["data", "lab", "trend", "deal_watch"].includes(article.type) ? "weekly" : "monthly";
}

export function sitemapPriority(article: Article) {
  if (article.type === "hub") {
    return 0.9;
  }
  if (["review", "buyer_guide", "trend"].includes(article.type)) {
    return 0.8;
  }
  if (["deal_watch", "ingredient_guide"].includes(article.type)) {
    return 0.75;
  }
  return 0.7;
}
