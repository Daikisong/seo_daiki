import type {
  SearchConsoleInternalLinkCandidate,
  SearchConsoleMissingSection
} from "./search-console-report";

export function topInternalLinkCandidates(
  candidates: SearchConsoleInternalLinkCandidate[] | undefined,
  limit = 3
) {
  return candidates?.slice(0, limit) ?? [];
}

export function topMissingSections(sections: SearchConsoleMissingSection[] | undefined, limit = 2) {
  return sections?.slice(0, limit) ?? [];
}

export function topActions(actions: string[] | undefined, limit = 3) {
  return actions?.slice(0, limit) ?? [];
}

export function persistedLinkSummary(candidates: SearchConsoleInternalLinkCandidate[] | undefined, limit = 3) {
  const paths = topInternalLinkCandidates(candidates, limit).map((candidate) => candidate.path);
  return paths.length ? `Links: ${paths.join(", ")}` : undefined;
}
