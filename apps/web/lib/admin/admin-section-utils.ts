import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { SearchConsoleInternalLinkCandidate, SearchConsoleMissingSection } from "./search-console-report";

export function normalizeActionList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (value && typeof value === "object") {
    return [JSON.stringify(value)];
  }
  return value ? [String(value)] : [];
}

export function normalizeRefreshSuggestionPayload(value: unknown) {
  if (!isRecord(value)) {
    return {
      actions: normalizeActionList(value),
      priority: 0,
      titleCandidate: "",
      metaDescriptionCandidate: "",
      missingSections: [] as SearchConsoleMissingSection[],
      internalLinkCandidates: [] as SearchConsoleInternalLinkCandidate[]
    };
  }

  return {
    actions: normalizeActionList(value.action ?? value.actions),
    priority: numberFromUnknown(value.priority),
    titleCandidate: stringFromUnknown(value.title_candidate ?? value.titleCandidate),
    metaDescriptionCandidate: stringFromUnknown(value.meta_description_candidate ?? value.metaDescriptionCandidate),
    missingSections: normalizePersistedMissingSections(value.missing_sections ?? value.missingSections),
    internalLinkCandidates: normalizePersistedInternalLinks(value.internal_link_candidates ?? value.internalLinkCandidates)
  };
}

export function normalizePersistedMissingSections(value: unknown): SearchConsoleMissingSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return item.trim() ? [{ heading: item.trim() }] : [];
    }
    if (!isRecord(item)) {
      return [];
    }
    const heading = stringFromUnknown(item.heading);
    if (!heading) {
      return [];
    }
    return [
      {
        heading,
        why: stringFromUnknown(item.why) || undefined,
        intent: stringFromUnknown(item.intent) || undefined,
        recommended_details: Array.isArray(item.recommended_details)
          ? item.recommended_details.map((detail) => String(detail))
          : undefined
      }
    ];
  });
}

export function normalizePersistedInternalLinks(value: unknown): SearchConsoleInternalLinkCandidate[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const path = stringFromUnknown(item.path ?? item.href);
    if (!path) {
      return [];
    }
    return [
      {
        path,
        href: stringFromUnknown(item.href) || path,
        type: stringFromUnknown(item.type) || undefined,
        anchor: stringFromUnknown(item.anchor) || undefined,
        reason: stringFromUnknown(item.reason) || undefined,
        score: numberFromUnknown(item.score),
        score_breakdown: isRecord(item.score_breakdown)
          ? Object.fromEntries(Object.entries(item.score_breakdown).map(([key, score]) => [key, numberFromUnknown(score)]))
          : undefined
      }
    ];
  });
}

export function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function summarizeJson(value: unknown) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }
  if (isRecord(value)) {
    return Object.keys(value).slice(0, 5).join(", ");
  }
  return String(value);
}

export function complianceIssuesFromJson(value: unknown) {
  if (!isRecord(value)) {
    return [];
  }
  const issues = value.issues ?? value.blockers ?? value.healthBlockers ?? value.localizationBlockers;
  return stringArrayFromUnknown(issues);
}

export function numericRecord(value: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, numberFromUnknown(item)]));
}

export function outlineHeadings(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (typeof item === "string") {
      return item.trim() ? [item.trim()] : [];
    }
    if (!isRecord(item)) {
      return [];
    }
    const heading = stringFromUnknown(item.heading);
    return heading ? [heading] : [];
  });
}

export function scoreBreakdownSummary(value: Record<string, number>) {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return "-";
  }
  return entries
    .slice(0, 4)
    .map(([key, item]) => `${key.replace(/Score$/, "")} ${item}`)
    .join(", ");
}

export function stringFromSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function stringFromUnknown(value: unknown) {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value);
}

export function stringArrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value.flatMap((item) => (typeof item === "string" ? [item] : [])) : [];
}

export function numberFromUnknown(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}
