import {
  mapDbComplianceArticleRow,
  mapDbContentBriefRow,
  mapDbLocalizationGroupRow,
  mapDbPublishingJobRow,
  mapDbTopicRow,
  mapDbTrendSignalRow
} from "./admin-section-db-mappers";
import { matchesTrendFilters } from "./admin-section-normalizers";

type OperationsAdmin = typeof import("@global-import-lab/db/operations-admin");

export type TrendRowFilters = { country?: string; locale?: string; source?: string };

async function readOperationsRows<T>(
  label: string,
  loader: (operations: OperationsAdmin) => Promise<T[]>
): Promise<T[] | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const operations = await import("@global-import-lab/db/operations-admin");
    return await loader(operations);
  } catch (error) {
    console.warn(`${label} unavailable.`, error);
    return null;
  }
}

export async function readDbTrendRows(filters: TrendRowFilters) {
  return readOperationsRows("Trend signals", async (operations) => {
    const rows = await operations.listTrendSignals();
    return rows.map(mapDbTrendSignalRow).filter((row) => matchesTrendFilters(row, filters));
  });
}

export async function readDbTopicRows() {
  return readOperationsRows("Topics", async (operations) => {
    const rows = await operations.listTopics();
    return rows.map(mapDbTopicRow);
  });
}

export async function readDbContentBriefRows() {
  return readOperationsRows("Content briefs", async (operations) => {
    const rows = await operations.listContentBriefs();
    return rows.map(mapDbContentBriefRow);
  });
}

export async function readDbPublishingJobRows() {
  return readOperationsRows("Publishing jobs", async (operations) => {
    const rows = await operations.listPublishingJobs();
    return rows.map(mapDbPublishingJobRow);
  });
}

export async function readDbComplianceRows() {
  return readOperationsRows("Compliance rows", async (operations) => {
    const rows = await operations.listComplianceArticles();
    return rows.map(mapDbComplianceArticleRow);
  });
}

export async function readDbLocalizationRows() {
  return readOperationsRows("Localization groups", async (operations) => {
    const rows = await operations.listLocalizationGroups();
    return rows.map(mapDbLocalizationGroupRow);
  });
}
