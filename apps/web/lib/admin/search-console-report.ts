import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

export interface SearchConsoleRow {
  page: string;
  query: string;
  country?: string;
  device?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleSuggestion {
  page: string;
  query?: string;
  country?: string;
  device?: string;
  reason?: string;
  priority?: number;
  title_candidate?: string;
  meta_description_candidate?: string;
  diagnostics?: Record<string, unknown>;
  missing_sections?: SearchConsoleMissingSection[];
  internal_link_candidates?: SearchConsoleInternalLinkCandidate[];
  action: string[];
}

export interface SearchConsoleMissingSection {
  heading: string;
  why?: string;
  intent?: string;
  recommended_details?: string[];
}

export interface SearchConsoleInternalLinkCandidate {
  path: string;
  href: string;
  type?: string;
  anchor?: string;
  reason?: string;
  score?: number;
  score_breakdown?: Record<string, number>;
}

export async function readSearchConsoleReport() {
  const root = findProjectRoot();
  const rows = await readFirstJson<SearchConsoleRow[]>([
    join(root, "data/snapshots/search_console_rows.json"),
    join(root, "data/snapshots/search_console_sample.json")
  ]);
  const suggestions = await readFirstJson<SearchConsoleSuggestion[]>([
    join(root, "data/exports/search_console_suggestions.json")
  ]);

  return {
    rows: rows.map(normalizeRow),
    suggestions: suggestions.map(normalizeSuggestion)
  };
}

function normalizeRow(row: Partial<SearchConsoleRow>): SearchConsoleRow {
  return {
    page: String(row.page ?? ""),
    query: String(row.query ?? ""),
    country: row.country ? String(row.country) : undefined,
    device: row.device ? String(row.device) : undefined,
    clicks: numberValue(row.clicks),
    impressions: numberValue(row.impressions),
    ctr: numberValue(row.ctr),
    position: numberValue(row.position)
  };
}

function normalizeSuggestion(row: Partial<SearchConsoleSuggestion>): SearchConsoleSuggestion {
  const action = Array.isArray(row.action) ? row.action.map((item) => String(item)) : [];
  const missingSections = Array.isArray(row.missing_sections)
    ? row.missing_sections.map(normalizeMissingSection).filter((item) => item.heading)
    : [];
  const internalLinks = Array.isArray(row.internal_link_candidates)
    ? row.internal_link_candidates.map(normalizeInternalLink).filter((item) => item.path)
    : [];
  return {
    page: String(row.page ?? ""),
    query: row.query ? String(row.query) : undefined,
    country: row.country ? String(row.country) : undefined,
    device: row.device ? String(row.device) : undefined,
    reason: row.reason ? String(row.reason) : undefined,
    priority: numberValue(row.priority),
    title_candidate: row.title_candidate ? String(row.title_candidate) : undefined,
    meta_description_candidate: row.meta_description_candidate ? String(row.meta_description_candidate) : undefined,
    diagnostics: isRecord(row.diagnostics) ? row.diagnostics : undefined,
    missing_sections: missingSections,
    internal_link_candidates: internalLinks,
    action
  };
}

function normalizeMissingSection(item: unknown): SearchConsoleMissingSection {
  if (typeof item === "string") {
    return { heading: item };
  }
  if (!isRecord(item)) {
    return { heading: "" };
  }
  return {
    heading: String(item.heading ?? ""),
    why: item.why ? String(item.why) : undefined,
    intent: item.intent ? String(item.intent) : undefined,
    recommended_details: Array.isArray(item.recommended_details)
      ? item.recommended_details.map((detail) => String(detail))
      : undefined
  };
}

function normalizeInternalLink(item: unknown): SearchConsoleInternalLinkCandidate {
  if (!isRecord(item)) {
    return { path: "", href: "" };
  }
  const path = String(item.path ?? item.href ?? "");
  return {
    path,
    href: String(item.href ?? path),
    type: item.type ? String(item.type) : undefined,
    anchor: item.anchor ? String(item.anchor) : undefined,
    reason: item.reason ? String(item.reason) : undefined,
    score: numberValue(item.score),
    score_breakdown: normalizeScoreBreakdown(item.score_breakdown)
  };
}

function normalizeScoreBreakdown(value: unknown) {
  if (!isRecord(value)) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(value).map(([key, score]) => [key, numberValue(score)]));
}

async function readFirstJson<T>(paths: string[]): Promise<T> {
  for (const path of paths) {
    if (existsSync(path)) {
      return JSON.parse(await readFile(path, "utf-8")) as T;
    }
  }
  return [] as T;
}

function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
