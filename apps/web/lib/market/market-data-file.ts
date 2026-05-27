import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const dataRoot = existsSync(resolve(process.cwd(), "data"))
  ? resolve(process.cwd(), "data")
  : resolve(process.cwd(), "../../data");

export function readMarketJson<T>(path: string, fallback: T): T {
  const fullPath = resolve(dataRoot, path);
  if (!existsSync(fullPath)) {
    return fallback;
  }
  return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}

export function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function text(value: unknown) {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

export function number(value: unknown) {
  return typeof value === "number" ? value : Number(value) || 0;
}

export function slugFromText(value: unknown) {
  return text(value).toLowerCase().replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/gi, "-").replace(/^-|-$/g, "");
}
