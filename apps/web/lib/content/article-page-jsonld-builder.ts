import {
  absoluteUrl,
  articlePath,
  buildArticleJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd
} from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";
import { buildArticlePageBreadcrumbJsonLd } from "./article-page-jsonld-breadcrumbs";
import { internalLinkSchemaItems } from "./article-page-jsonld-links";
import { linkedProductSnippetJsonLd } from "./article-page-jsonld-products";
import { buildTrendPageQualityScore } from "./trend-page-quality-score";
import { buildTrendRecommendationModel } from "./trend-recommendations";

export function buildArticlePageJsonLd(article: Article, product: Product | undefined, allProducts: Product[], allArticles: Article[]) {
  const breadcrumbs = buildArticlePageBreadcrumbJsonLd(article);
  const articleJsonLd = buildArticleJsonLd(article);

  if (article.type === "data") {
    return [articleJsonLd, buildDatasetJsonLd(article), breadcrumbs];
  }

  if (article.type === "review" && product) {
    return [articleJsonLd, buildProductJsonLd(product, article), breadcrumbs];
  }

  if (article.type === "hub" || article.type === "compare") {
    const itemListLinks = internalLinkSchemaItems(article);

    if (article.type === "hub") {
      return [
        articleJsonLd,
        buildCollectionPageJsonLd(article, itemListLinks),
        buildItemListJsonLd(article.title, itemListLinks),
        breadcrumbs
      ];
    }

    return [
      articleJsonLd,
      buildItemListJsonLd(article.title, itemListLinks),
      ...linkedProductSnippetJsonLd(article, allProducts, allArticles),
      breadcrumbs
    ];
  }

  if (article.type === "trend") {
    const recommendationModel = buildTrendRecommendationModel(article, allProducts);
    const qualityScore = buildTrendPageQualityScore(article, allProducts);
    if (!qualityScore.sergAliBenchmarkReady || !recommendationModel.eligible || recommendationModel.recommendations.length === 0) {
      return [articleJsonLd, breadcrumbs];
    }

    const recommendationItems = recommendationModel.recommendations.map((item) => ({
      name: item.name,
      url: absoluteUrl(`${articlePath(article)}#trend-pick-${item.rank}`)
    }));
    return [
      articleJsonLd,
      buildItemListJsonLd(`${article.title} recommendations`, recommendationItems),
      buildTrendFaqJsonLd(article),
      breadcrumbs
    ];
  }

  return [articleJsonLd, breadcrumbs];
}

function buildTrendFaqJsonLd(article: Article) {
  const faqs = [
    {
      question: "Should every trend page include affiliate picks?",
      answer:
        "No. A trend should only become a buyer guide when the search intent, product evidence, approved merchant path, and local-risk checks all support recommendations."
    },
    {
      question: "How often should this guide be refreshed?",
      answer: `Refresh it whenever trend signals, seller availability, price snapshots, variant risk, or local rules change. This draft was last updated on ${article.lastUpdated}.`
    },
    {
      question: "What should readers verify before clicking a link?",
      answer:
        "Check the exact SKU or variant, final shipped price, plug or compatibility requirements, seller rating, low-star review patterns, return terms, and any local import or certification rules."
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}
