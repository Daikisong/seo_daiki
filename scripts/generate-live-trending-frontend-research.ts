import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { groups, repeatedPatterns, type GroupSeed, type TopSiteSeed } from "./live-trending-frontend/seeds";

const root = process.cwd();
const trendSnapshotFile = "data/raw/google-trends-rss-snapshot-2026-05-31-frontend-100.json";
const researchFile = "data/research/live-trending-frontend-top-sites-2026-05-31.json";
const docFile = "docs/live-trending-100-frontend-format-analysis.md";

function main() {
  const snapshot = JSON.parse(readFileSync(resolve(root, trendSnapshotFile), "utf8")) as {
    capturedAt: string;
    markets: Array<{
      geo: string;
      market: string;
      language: string;
      rssUrl: string;
      items: Array<{
        rank: number;
        title: string;
        approxTraffic: string;
        pubDate: string;
        newsItems?: Array<{ title: string; url: string; source: string }>;
      }>;
    }>;
  };

  const enrichedGroups = groups.map((group) => {
    const market = snapshot.markets.find((item) => item.geo === group.geo);
    const trend = market?.items.find((item) => item.title.toLocaleLowerCase() === group.trendSeed.toLocaleLowerCase());
    if (!market || !trend) {
      throw new Error(`Missing RSS evidence for ${group.id} (${group.trendSeed})`);
    }
    return {
      ...group,
      trendEvidence: {
        source: "Google Trends public Trending RSS endpoint",
        rssSnapshotFile: trendSnapshotFile,
        snapshotCapturedAt: snapshot.capturedAt,
        rssUrl: market.rssUrl,
        rssRank: trend.rank,
        approxTraffic: trend.approxTraffic,
        pubDate: trend.pubDate,
        relatedNewsItems: trend.newsItems ?? []
      },
      topSites: group.topSites.map((site, index) => ({
        observedPosition: index + 1,
        searchEngine: "web.search_query",
        capturedAt: "2026-05-31T21:45:00+09:00",
        reproducibilityNote:
          "Captured from live web search result sets and official/primary pages connected to the same Google Trends RSS seed. Rankings vary by user, locale, device, freshness, and personalization.",
        ...site
      }))
    };
  });

  const allSites = enrichedGroups.flatMap((group) => group.topSites);
  const payload = {
    generatedAt: "2026-05-31T21:45:00+09:00",
    method:
      "Start from live country-level Google Trends RSS seeds, select frontend-relevant trend groups, then review five high-ranking or primary pages per trend for information architecture and UI pattern only. No raw Google HTML scraping.",
    requirements: {
      minimumTrendGroups: 20,
      minimumTopSites: 100,
      requiredSitesPerGroup: 5,
      actualTrendGroups: enrichedGroups.length,
      actualTopSites: allSites.length,
      marketsCovered: Array.from(new Set(enrichedGroups.map((group) => group.market))).sort()
    },
    trendSnapshotFile,
    repeatedPatterns,
    groups: enrichedGroups
  };

  mkdirSync(dirname(resolve(root, researchFile)), { recursive: true });
  writeFileSync(resolve(root, researchFile), `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(resolve(root, docFile), buildDoc(payload));
  console.log(`Wrote ${allSites.length} top-site observations across ${enrichedGroups.length} live trend groups.`);
}

function buildDoc(payload: {
  generatedAt: string;
  method: string;
  requirements: {
    actualTrendGroups: number;
    actualTopSites: number;
    marketsCovered: string[];
  };
  trendSnapshotFile: string;
  repeatedPatterns: typeof repeatedPatterns;
  groups: Array<GroupSeed & { trendEvidence: { rssRank: number; approxTraffic: string; rssUrl: string; pubDate: string }; topSites: Array<TopSiteSeed & { observedPosition: number }> }>;
}): string {
  const inventoryRows = payload.groups.flatMap((group) =>
    group.topSites.map((site) =>
      `| ${md(group.market)}/${md(group.language)} | ${md(group.trendSeed)} | ${site.observedPosition} | ${md(site.pageType)} | ${md(site.title)} | ${md(site.signals.join("; "))} |`
    )
  );

  const groupRows = payload.groups.map((group) =>
    `| ${md(group.market)}/${md(group.language)} | ${md(group.trendSeed)} | ${group.trendEvidence.rssRank} | ${md(group.trendEvidence.approxTraffic)} | ${md(group.searchQuery)} | ${md(group.selectedBecause)} |`
  );

  const patternBullets = payload.repeatedPatterns
    .map((item) => `- **${item.pattern}**: ${item.finding}\n  - Apply: ${item.frontendDecision}`)
    .join("\n");

  return `# Live Trending Frontend Format Analysis - 100+ Top Sites

Date: 2026-05-31

This audit starts from real country-level Google Trends RSS seeds, not prefilled sample topics.

## Scope

- Live trend groups: ${payload.requirements.actualTrendGroups}
- Top/primary sites reviewed: ${payload.requirements.actualTopSites}
- Required minimum: 20 trend groups x 5 sites = 100 pages
- Markets covered: ${payload.requirements.marketsCovered.join(", ")}
- Trend snapshot: [${payload.trendSnapshotFile}](/home/eorb915/projects/seo_daiki/${payload.trendSnapshotFile})
- Structured evidence: [${researchFile}](/home/eorb915/projects/seo_daiki/${researchFile})

## Method

${payload.method}

Important limitation: rankings move by location, device, personalization, and freshness. This file stores the query context and the observed/primary pages used for frontend pattern analysis. It does not promise permanent rank positions.

## Live Trend Groups

| Market | RSS trend | RSS rank | Approx traffic | Search query | Why selected |
|---|---|---:|---:|---|---|
${groupRows.join("\n")}

## Repeated Frontend Patterns

${patternBullets}

쉽게 말하면, 상위권/대표 페이지는 예쁜 장식보다 "지금 뭘 확인해야 하는지"를 먼저 보여줍니다. 예를 들어 날씨 페이지는 현재 경보와 시간대별 예보를 먼저 보여주고, 모기지 페이지는 금리 표와 수수료 경고를 먼저 보여줍니다. 우리 글도 같은 방식으로 답, 검토 근거, 다음 행동, 체크리스트, 비교표, 출처 순서가 되어야 합니다.

## Apply / Remove Decisions

### Apply Now

- Keep a direct answer above every dense block.
- Keep the trust strip near the hero.
- Add a reader-path strip: answer -> checklist -> comparison/source verification.
- Use comparison tables and checklists as first-class UI, not as afterthoughts.
- Keep official or primary sources visible in source cards.
- Use market-specific labels and avoid English workflow labels on non-English pages.

### Remove / Avoid

- Do not render SERP-analysis notes publicly.
- Do not show internal trend/status language such as "test_published" or "product candidate pending."
- Do not add affiliate CTAs during this phase.
- Do not use stale deal prices as current facts.
- Do not bury safety/legal/official caveats below long prose.

## 105-Site Inventory

| Market | Trend seed | Position | Page type | Site/page | Frontend signals |
|---|---|---:|---|---|---|
${inventoryRows.join("\n")}
`;
}

function md(value: string): string {
  return value.replace(/\|/g, "\\|");
}

main();
