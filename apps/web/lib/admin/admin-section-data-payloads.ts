import { isRecord } from "./admin-section-utils";

export function adminPayloadArray(payload: unknown, key: string) {
  return isRecord(payload) && Array.isArray(payload[key]) ? payload[key] : [];
}

export function trendSignalPayloadRows(payload: unknown) {
  return adminPayloadArray(payload, "signals");
}

export function topicScorePayloadRows(payload: unknown) {
  return adminPayloadArray(payload, "topics");
}

export function contentBriefPayloadRows(payload: unknown) {
  return adminPayloadArray(payload, "briefs");
}

export function publishingGatePayloadRows(payload: unknown) {
  return adminPayloadArray(payload, "results");
}

export function localizedArticlePayloadRows(payload: unknown) {
  return adminPayloadArray(payload, "articles");
}

export function affiliatePlacementCandidatePayloadRows(payload: unknown) {
  return adminPayloadArray(payload, "placementCandidates");
}
