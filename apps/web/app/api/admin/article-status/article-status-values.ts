export const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"] as const;
export const publishStatuses = ["draft", "pending", "published"] as const;

export type AdminArticleIndexStatus = (typeof indexStatuses)[number];
export type AdminArticlePublishStatus = (typeof publishStatuses)[number];

export interface ParsedArticleStatusValue<T> {
  ok: true;
  value?: T;
}

export interface InvalidArticleStatusValue {
  ok: false;
  error: string;
}

export type ArticleStatusValueResult<T> = ParsedArticleStatusValue<T> | InvalidArticleStatusValue;

export function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseOptionalIndexStatus(value: string): ArticleStatusValueResult<AdminArticleIndexStatus> {
  if (!value) {
    return { ok: true };
  }
  if (!indexStatuses.includes(value as AdminArticleIndexStatus)) {
    return { ok: false, error: `Invalid indexStatus: ${value}` };
  }
  return { ok: true, value: value as AdminArticleIndexStatus };
}

export function parseOptionalPublishStatus(value: string): ArticleStatusValueResult<AdminArticlePublishStatus> {
  if (!value) {
    return { ok: true };
  }
  if (!publishStatuses.includes(value as AdminArticlePublishStatus)) {
    return { ok: false, error: `Invalid publishStatus: ${value}` };
  }
  return { ok: true, value: value as AdminArticlePublishStatus };
}

export function parseQualityScore(value: string): ArticleStatusValueResult<number> {
  if (value === "") {
    return { ok: true };
  }

  const qualityScore = Number(value);
  if (!Number.isInteger(qualityScore) || qualityScore < 0 || qualityScore > 100) {
    return { ok: false, error: "qualityScore must be an integer from 0 to 100." };
  }

  return { ok: true, value: qualityScore };
}
