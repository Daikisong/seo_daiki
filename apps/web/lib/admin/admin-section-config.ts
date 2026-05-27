export const adminSections = [
  "products",
  "articles",
  "evidence",
  "quality",
  "search-console",
  "audit",
  "trends",
  "topics",
  "briefs",
  "merchants",
  "offers",
  "placements",
  "offer-matching",
  "publishing-jobs",
  "compliance",
  "localization"
] as const;

export type AdminSection = (typeof adminSections)[number];

export const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"];
export const publishStatuses = ["draft", "pending", "published"];
export const refreshSuggestionStatuses = ["open", "planned", "applied", "dismissed"];
export const topicStatuses = ["candidate", "briefed", "drafted", "published", "rejected"];
export const contentBriefStatuses = ["draft", "approved", "rejected", "converted"];
export const adminLocales = ["en", "es", "pt-br"];
