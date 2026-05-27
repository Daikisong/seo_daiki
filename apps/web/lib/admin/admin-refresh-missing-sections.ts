import type { SearchConsoleMissingSection } from "./search-console-report";
import { isRecord, stringFromUnknown } from "./admin-value-utils";

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
