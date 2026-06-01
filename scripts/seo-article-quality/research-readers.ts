import { existsSync, readFileSync } from "node:fs";

export type TopSeoAnalysisSummary = {
  pageCount: number;
  uniqueUrlCount: number;
  groups: Set<string>;
  reproducibleEvidenceCount: number;
};

export type LiveFrontendAnalysisSummary = {
  groupCount: number;
  topSiteCount: number;
  marketCount: number;
  groupsWithFiveSites: number;
  groupsWithRssEvidence: number;
};

export function readTopSeoAnalysis(path: string): TopSeoAnalysisSummary {
  if (!existsSync(path)) {
    return { pageCount: 0, uniqueUrlCount: 0, groups: new Set(), reproducibleEvidenceCount: 0 };
  }

  const payload = JSON.parse(readFileSync(path, "utf8")) as {
    pages?: Array<{
      url?: string;
      queryGroup?: string;
      serpEvidence?: {
        searchQuery?: string;
        searchEngine?: string;
        capturedAt?: string;
        serpLocale?: string;
        device?: string;
        observedResultPosition?: number;
      };
    }>;
  };
  const pages = Array.isArray(payload.pages) ? payload.pages : [];

  return {
    pageCount: pages.length,
    uniqueUrlCount: new Set(pages.map((page) => page.url).filter(Boolean)).size,
    groups: new Set(pages.map((page) => page.queryGroup).filter(Boolean) as string[]),
    reproducibleEvidenceCount: pages.filter((page) =>
      Boolean(
        page.serpEvidence?.searchQuery &&
          page.serpEvidence.searchEngine &&
          page.serpEvidence.capturedAt &&
          page.serpEvidence.serpLocale &&
          page.serpEvidence.device &&
          page.serpEvidence.observedResultPosition
      )
    ).length
  };
}

export function readLiveFrontendAnalysis(path: string): LiveFrontendAnalysisSummary {
  if (!existsSync(path)) {
    return { groupCount: 0, topSiteCount: 0, marketCount: 0, groupsWithFiveSites: 0, groupsWithRssEvidence: 0 };
  }

  const payload = JSON.parse(readFileSync(path, "utf8")) as {
    groups?: Array<{
      market?: string;
      searchQuery?: string;
      trendEvidence?: {
        rssUrl?: string;
        rssRank?: number;
        approxTraffic?: string;
        snapshotCapturedAt?: string;
      };
      topSites?: Array<{ url?: string; signals?: unknown[]; observedPosition?: number }>;
    }>;
  };
  const groups = Array.isArray(payload.groups) ? payload.groups : [];

  return {
    groupCount: groups.length,
    topSiteCount: groups.reduce((total, group) => total + (group.topSites?.length ?? 0), 0),
    marketCount: new Set(groups.map((group) => group.market).filter(Boolean)).size,
    groupsWithFiveSites: groups.filter((group) =>
      Boolean(
        group.searchQuery &&
          group.topSites?.length === 5 &&
          group.topSites.every((site) => site.url?.startsWith("http") && site.observedPosition && (site.signals ?? []).length >= 2)
      )
    ).length,
    groupsWithRssEvidence: groups.filter((group) =>
      Boolean(
        group.trendEvidence?.rssUrl?.startsWith("https://trends.google.com/trending/rss") &&
          group.trendEvidence.rssRank &&
          group.trendEvidence.approxTraffic &&
          group.trendEvidence.snapshotCapturedAt
      )
    ).length
  };
}
