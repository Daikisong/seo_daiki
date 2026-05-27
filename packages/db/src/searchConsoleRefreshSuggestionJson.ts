import type { Prisma } from "./generated/prisma/client";

export function toRefreshSuggestionJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
