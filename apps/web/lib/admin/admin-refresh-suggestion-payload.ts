import type { SearchConsoleInternalLinkCandidate, SearchConsoleMissingSection } from "./search-console-report";
import { isRecord, numberFromUnknown, stringFromUnknown } from "./admin-value-utils";

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
