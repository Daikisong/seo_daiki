import type { Article } from "@global-import-lab/types";

export type JsonValue = unknown;

export function jsonArray<T>(value: JsonValue): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function jsonObject<T extends Record<string, unknown> = Record<string, unknown>>(value: JsonValue): T {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as T) : ({} as T);
}

export function localizationDepthScoreFromJson(value: JsonValue) {
  const json = jsonObject(value);
  const raw = json.localizationDepthScore;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : undefined;
}

export function translationStatusFromJson(value: JsonValue): Article["translationStatus"] {
  const json = jsonObject(value);
  const raw = json.translationStatus;
  return raw === "draft" || raw === "localized" || raw === "approved" || raw === "published" ? raw : undefined;
}
