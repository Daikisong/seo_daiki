import type { SearchConsoleInternalLinkCandidate } from "./search-console-report";
import { isRecord, numberFromUnknown, stringFromUnknown } from "./admin-value-utils";

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
