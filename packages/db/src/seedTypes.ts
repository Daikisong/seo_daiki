import type { Prisma } from "./generated/prisma/client";
import type { prisma } from "./client";

export type SeedDbClient = typeof prisma;

export function toSeedJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
