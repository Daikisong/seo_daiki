import type { SearchConsoleInternalLinkCandidate, SearchConsoleMissingSection } from "./search-console-report";
import { normalizeActionList } from "./admin-refresh-action-list";
import { normalizePersistedInternalLinks } from "./admin-refresh-internal-links";
import { normalizePersistedMissingSections } from "./admin-refresh-missing-sections";
import { isRecord, numberFromUnknown, stringFromUnknown } from "./admin-value-utils";

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
