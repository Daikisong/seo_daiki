import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import {
  readDbComplianceRows,
  readDbContentBriefRows,
  readDbLocalizationRows,
  readDbPublishingJobRows,
  readDbTopicRows,
  readDbTrendRows,
  type TrendRowFilters
} from "./admin-content-workflow-db-data";
import {
  readComplianceExportRows,
  readContentBriefExportRows,
  readLocalizationExportRows,
  readPublishingJobExportRows,
  readTopicExportRows,
  readTrendExportRows
} from "./admin-content-workflow-file-data";

export async function readTrendRows(filters: TrendRowFilters) {
  return (await readDbTrendRows(filters)) ?? readTrendExportRows(filters);
}

export async function readTopicRows() {
  return (await readDbTopicRows()) ?? readTopicExportRows();
}

export async function readContentBriefRows() {
  return (await readDbContentBriefRows()) ?? readContentBriefExportRows();
}

export async function readPublishingJobRows() {
  return (await readDbPublishingJobRows()) ?? readPublishingJobExportRows();
}

export async function readComplianceRows(
  sampleArticles: Article[],
  products: Product[],
  evidencePacks: EvidencePack[]
) {
  return (await readDbComplianceRows()) ?? readComplianceExportRows(sampleArticles, products, evidencePacks);
}

export async function readLocalizationRows() {
  return (await readDbLocalizationRows()) ?? readLocalizationExportRows();
}
