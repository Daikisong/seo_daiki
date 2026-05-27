import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  affiliatePlacementCandidatePayloadRows
} from "./admin-section-data-payloads";
import type { AffiliatePlacementCandidateRow } from "./admin-section-data-types";
import {
  duplicateCandidateCountsFromRows,
  normalizeAffiliatePlacementCandidateRows
} from "./admin-section-normalizers";
import { findProjectRoot } from "./admin-section-utils";

export async function readDuplicateCandidateCounts() {
  const path = join(findProjectRoot(), "data/snapshots/product_identity_graph.json");
  if (!existsSync(path)) {
    return {} as Record<string, number>;
  }

  try {
    const rows = JSON.parse(await readFile(path, "utf-8")) as unknown[];
    return duplicateCandidateCountsFromRows(rows);
  } catch (error) {
    console.warn("Product identity graph unavailable.", error);
    return {} as Record<string, number>;
  }
}

export async function readAffiliatePlacementCandidates(): Promise<AffiliatePlacementCandidateRow[]> {
  try {
    const payload = await readAdminJson("data/exports/affiliate_placement_candidates.json");
    return normalizeAffiliatePlacementCandidateRows(affiliatePlacementCandidatePayloadRows(payload));
  } catch (error) {
    console.warn("Affiliate placement candidates unavailable.", error);
    return [];
  }
}

export async function readAdminJson(relativePath: string) {
  try {
    const path = join(findProjectRoot(), relativePath);
    if (!existsSync(path)) {
      return {};
    }
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    console.warn(`Admin JSON unavailable: ${relativePath}`, error);
    return {};
  }
}
