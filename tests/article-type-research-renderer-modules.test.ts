import assert from "node:assert/strict";
import {
  CompareArticleContent,
  DataArticleContent,
  LabArticleContent,
  MethodologyArticleContent
} from "../apps/web/components/layout/article-type-evidence-renderers";
import {
  DefaultArticleContent,
  GuideArticleContent,
  IngredientGuideArticleContent,
  RiskArticleContent,
  TrendArticleContent
} from "../apps/web/components/layout/article-type-guidance-renderers";
import {
  CompareArticleContent as exportedCompareArticleContent,
  DataArticleContent as exportedDataArticleContent,
  DefaultArticleContent as exportedDefaultArticleContent,
  GuideArticleContent as exportedGuideArticleContent,
  IngredientGuideArticleContent as exportedIngredientGuideArticleContent,
  LabArticleContent as exportedLabArticleContent,
  MethodologyArticleContent as exportedMethodologyArticleContent,
  RiskArticleContent as exportedRiskArticleContent,
  TrendArticleContent as exportedTrendArticleContent
} from "../apps/web/components/layout/article-type-research-renderers";

assert.equal(exportedCompareArticleContent, CompareArticleContent);
assert.equal(exportedDataArticleContent, DataArticleContent);
assert.equal(exportedDefaultArticleContent, DefaultArticleContent);
assert.equal(exportedGuideArticleContent, GuideArticleContent);
assert.equal(exportedIngredientGuideArticleContent, IngredientGuideArticleContent);
assert.equal(exportedLabArticleContent, LabArticleContent);
assert.equal(exportedMethodologyArticleContent, MethodologyArticleContent);
assert.equal(exportedRiskArticleContent, RiskArticleContent);
assert.equal(exportedTrendArticleContent, TrendArticleContent);

console.log("Article type research renderer module tests passed");
