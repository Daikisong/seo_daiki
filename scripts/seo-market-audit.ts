import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  absoluteUrl,
  buildExistingMarketContentHreflangMap,
  canonicalForMarketPath,
  getSiteUrl,
  marketPath,
  type MarketContentHreflangVariant
} from "../packages/seo/src";
import { enabledMarkets } from "../apps/web/lib/market/config";
import {
  marketContentHreflangVariants,
  readMarketContentBySection
} from "../apps/web/lib/market/market-data";
import type { MarketContentSection } from "../apps/web/lib/market/market-data-types";
import { labelsForLanguage, supportedUiLabelLanguages } from "../apps/web/lib/market/ui-labels";
import {
  includeEmptyMarketsInSitemap,
  marketHomeSitemapEligibility,
  shouldNoindexMarketHome
} from "../apps/web/lib/seo/market-index-policy";

type AuditIssue = {
  code: string;
  message: string;
  path?: string;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://seo-daiki.example";
const issues: AuditIssue[] = [];
const warnings: AuditIssue[] = [];
const markets = enabledMarkets();
const researchSections: MarketContentSection[] = ["trends", "keywords", "serp", "briefs", "posts"];
const requiredUiLanguages = ["en", "es", "pt-br", "pt", "fr", "de", "it", "nl", "pl", "tr", "id", "ja", "ko"];

checkSiteUrlPolicy();
checkRobotsSitemapPolicy();
checkResearchNoindexSource();
checkMarketCanonicals();
checkMarketSitemapEligibility();
checkUiLabelCoverage();
checkHreflangVariants();

const report = {
  summary: {
    passed: issues.length === 0,
    issues: issues.length,
    warnings: warnings.length,
    markets: markets.length,
    researchSections
  },
  marketSitemapEligibility: markets.map((market) => ({
    market: market.market,
    language: market.language,
    pathPrefix: market.pathPrefix,
    noindexHome: shouldNoindexMarketHome(market, {}),
    ...marketHomeSitemapEligibility(market, {})
  })),
  issues,
  warnings
};

const reportPath = path.join(repoRoot, "data/exports/seo_market_audit.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (issues.length > 0) {
  console.error(`SEO market audit failed with ${issues.length} issue(s).`);
  for (const issue of issues) {
    console.error(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ""}`);
  }
  process.exit(1);
}

console.log(`SEO market audit passed for ${markets.length} markets.`);
console.log(`Report written to ${path.relative(repoRoot, reportPath)}.`);

function checkSiteUrlPolicy() {
  const developmentFallback = getSiteUrl({ NODE_ENV: "development" });
  if (developmentFallback !== "http://localhost:3000") {
    issues.push({
      code: "site_url_dev_fallback_wrong",
      message: `Expected development fallback http://localhost:3000, got ${developmentFallback}.`
    });
  }

  try {
    getSiteUrl({ NODE_ENV: "production" });
    issues.push({
      code: "site_url_production_missing_env_allowed",
      message: "Production getSiteUrl() must throw when NEXT_PUBLIC_SITE_URL is missing."
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("NEXT_PUBLIC_SITE_URL")) {
      issues.push({
        code: "site_url_production_wrong_error",
        message: "Production getSiteUrl() threw an unexpected error."
      });
    }
  }
}
function checkRobotsSitemapPolicy() {
  const robotsPath = path.join(repoRoot, "apps/web/app/robots.ts");
  const robotsSource = fs.readFileSync(robotsPath, "utf8");
  if (robotsSource.includes("/sitemaps/index.xml")) {
    issues.push({
      code: "robots_missing_sitemap_index_reference",
      message: "robots.ts must not reference /sitemaps/index.xml unless that route exists.",
      path: "apps/web/app/robots.ts"
    });
  }
  if (!robotsSource.includes("/sitemap.xml")) {
    issues.push({
      code: "robots_sitemap_xml_missing",
      message: "robots.ts must reference /sitemap.xml.",
      path: "apps/web/app/robots.ts"
    });
  }
  if (!fs.existsSync(path.join(repoRoot, "apps/web/app/sitemap.ts"))) {
    issues.push({
      code: "sitemap_route_missing",
      message: "apps/web/app/sitemap.ts must exist."
    });
  }
}

function checkResearchNoindexSource() {
  const routeFiles = [
    "apps/web/app/[market]/[language]/trends/[slug]/page.tsx",
    "apps/web/app/[market]/[language]/keywords/[slug]/page.tsx",
    "apps/web/app/[market]/[language]/serp/[slug]/page.tsx",
    "apps/web/app/[market]/[language]/briefs/[slug]/page.tsx",
    "apps/web/app/[market]/[language]/calendar/page.tsx",
    "apps/web/app/[market]/[language]/posts/[slug]/page.tsx"
  ];

  for (const routeFile of routeFiles) {
    const source = fs.readFileSync(path.join(repoRoot, routeFile), "utf8");
    if (!source.includes("marketResearchMetadata")) {
      issues.push({
        code: "research_route_noindex_helper_missing",
        message: "Research and test routes must use marketResearchMetadata().",
        path: routeFile
      });
    }
  }
}

function checkMarketCanonicals() {
  for (const market of markets) {
    const canonical = canonicalForMarketPath(marketPath(market), siteUrl);
    if (canonical !== absoluteUrl(market.pathPrefix, siteUrl) && canonical !== absoluteUrl(`${market.pathPrefix}/`, siteUrl)) {
      issues.push({
        code: "market_home_canonical_mismatch",
        message: `${market.market}/${market.language} canonical is ${canonical}.`
      });
    }
  }
}

function checkMarketSitemapEligibility() {
  if (includeEmptyMarketsInSitemap({})) {
    issues.push({
      code: "include_empty_markets_default_true",
      message: "INCLUDE_EMPTY_MARKETS_IN_SITEMAP must default to false."
    });
  }

  for (const market of markets) {
    const eligibility = marketHomeSitemapEligibility(market, {});
    const hasUsefulContent =
      eligibility.counts.trends >= 3 ||
      eligibility.counts.serpOpportunities >= 3 ||
      eligibility.counts.publicReadyPosts >= 1;

    if (eligibility.eligible && !hasUsefulContent && !eligibility.includeEmptyMarketsOverride) {
      issues.push({
        code: "thin_market_home_sitemap_eligible",
        message: `${market.pathPrefix}/ is eligible without useful content.`
      });
    }

    if (!eligibility.eligible && !shouldNoindexMarketHome(market, {})) {
      issues.push({
        code: "thin_market_home_not_noindex",
        message: `${market.pathPrefix}/ is thin but market home noindex policy is not active.`
      });
    }
  }
}

function checkUiLabelCoverage() {
  const supported = new Set(supportedUiLabelLanguages());
  for (const language of requiredUiLanguages) {
    if (!supported.has(language)) {
      issues.push({
        code: "ui_label_language_missing",
        message: `Missing UI label pack for ${language}.`
      });
      continue;
    }

    const labelState = labelsForLanguage(language);
    if (!labelState.complete) {
      issues.push({
        code: "ui_label_keys_missing",
        message: `${language} is missing labels: ${labelState.missingKeys.join(", ")}.`
      });
    }
  }

  for (const market of markets) {
    const labelState = labelsForLanguage(market.language);
    if (!labelState.complete && !shouldNoindexMarketHome(market, {})) {
      issues.push({
        code: "market_missing_labels_not_noindex",
        message: `${market.pathPrefix}/ has incomplete UI labels but is not noindex.`
      });
    }
  }
}

function checkHreflangVariants() {
  for (const section of researchSections) {
    for (const market of markets) {
      const items = readMarketContentBySection(market, section);
      for (const item of items) {
        const variants = marketContentHreflangVariants(markets, section, item.slug);
        const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language);
        if (!currentVariant) {
          issues.push({
            code: "hreflang_current_variant_missing",
            message: `${market.pathPrefix}/${section}/${item.slug}/ does not have a current hreflang variant.`
          });
          continue;
        }
        checkHreflangMapDoesNotPointAtMissing(section, item.slug, variants, currentVariant);
        checkBidirectionalHreflang(section, item.slug, variants);
      }
    }
  }
}

function checkHreflangMapDoesNotPointAtMissing(
  section: MarketContentSection,
  slug: string,
  variants: MarketContentHreflangVariant[],
  currentVariant: MarketContentHreflangVariant
) {
  const validUrls = new Set(variants.map((variant) => absoluteUrl(variant.path, siteUrl)));
  const map = buildExistingMarketContentHreflangMap(variants, currentVariant, siteUrl);
  for (const [hreflang, url] of Object.entries(map)) {
    if (hreflang === "x-default") {
      continue;
    }
    if (!validUrls.has(url)) {
      issues.push({
        code: "hreflang_missing_variant_url",
        message: `${section}/${slug} emits ${hreflang}=${url}, but that variant does not exist.`
      });
    }
  }
}

function checkBidirectionalHreflang(section: MarketContentSection, slug: string, variants: MarketContentHreflangVariant[]) {
  const expected = JSON.stringify(buildExistingMarketContentHreflangMap(variants, variants[0], siteUrl));
  for (const variant of variants.slice(1)) {
    const actual = JSON.stringify(buildExistingMarketContentHreflangMap(variants, variant, siteUrl));
    if (actual !== expected) {
      issues.push({
        code: "hreflang_return_links_mismatch",
        message: `${section}/${slug} has a different hreflang set for ${variant.hreflang}.`
      });
    }
  }
}
