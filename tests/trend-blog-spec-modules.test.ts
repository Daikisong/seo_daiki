import assert from "node:assert/strict";
import { gan65wDealWatchSpecs } from "../packages/content/src/trend-blog-65w-deal-watch-specs";
import { trendBlogArticleSpecs } from "../packages/content/src/trend-blog-article-fixtures";
import { magnesiumIngredientGuideSpecs } from "../packages/content/src/trend-blog-magnesium-ingredient-specs";
import { travelGanBuyerGuideSpecs } from "../packages/content/src/trend-blog-travel-gan-buyer-guide-specs";
import { travelGanTrendSpecs } from "../packages/content/src/trend-blog-travel-gan-trend-specs";

const modules = [
  {
    specs: travelGanTrendSpecs,
    group: "trend-travel-gan-charger",
    type: "trend"
  },
  {
    specs: travelGanBuyerGuideSpecs,
    group: "buyer-guide-travel-gan",
    type: "buyer_guide"
  },
  {
    specs: gan65wDealWatchSpecs,
    group: "deal-watch-65w-gan",
    type: "deal_watch"
  },
  {
    specs: magnesiumIngredientGuideSpecs,
    group: "ingredient-magnesium-glycinate",
    type: "ingredient_guide"
  }
];

for (const module of modules) {
  assert.equal(module.specs.length, 3);
  assert.deepEqual(module.specs.map((spec) => spec.locale), ["en", "es", "pt-br"]);
  assert.equal(module.specs.every((spec) => spec.group === module.group), true);
  assert.equal(module.specs.every((spec) => spec.type === module.type), true);
}

assert.deepEqual(trendBlogArticleSpecs, [
  ...travelGanTrendSpecs,
  ...travelGanBuyerGuideSpecs,
  ...gan65wDealWatchSpecs,
  ...magnesiumIngredientGuideSpecs
]);

assert.equal(new Set(trendBlogArticleSpecs.map((spec) => spec.id)).size, 12);
assert.equal(new Set(trendBlogArticleSpecs.map((spec) => spec.slug)).size, 12);
assert.deepEqual(
  trendBlogArticleSpecs.map((spec) => spec.group),
  [
    "trend-travel-gan-charger",
    "trend-travel-gan-charger",
    "trend-travel-gan-charger",
    "buyer-guide-travel-gan",
    "buyer-guide-travel-gan",
    "buyer-guide-travel-gan",
    "deal-watch-65w-gan",
    "deal-watch-65w-gan",
    "deal-watch-65w-gan",
    "ingredient-magnesium-glycinate",
    "ingredient-magnesium-glycinate",
    "ingredient-magnesium-glycinate"
  ]
);

console.log("Trend blog spec module unit tests passed");
