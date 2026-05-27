import assert from "node:assert/strict";
import {
  readContentBriefRows,
  readLocalizationRows,
  readPublishingJobRows,
  readTopicRows,
  readTrendRows
} from "../apps/web/lib/admin/admin-content-workflow-data";
import {
  readDbContentBriefRows,
  readDbLocalizationRows,
  readDbPublishingJobRows,
  readDbTopicRows,
  readDbTrendRows
} from "../apps/web/lib/admin/admin-content-workflow-db-data";
import {
  readContentBriefExportRows,
  readLocalizationExportRows,
  readPublishingJobExportRows,
  readTopicExportRows,
  readTrendExportRows
} from "../apps/web/lib/admin/admin-content-workflow-file-data";

assert.equal(typeof readTrendRows, "function");
assert.equal(typeof readTopicRows, "function");
assert.equal(typeof readContentBriefRows, "function");
assert.equal(typeof readPublishingJobRows, "function");
assert.equal(typeof readLocalizationRows, "function");

assert.equal(typeof readDbTrendRows, "function");
assert.equal(typeof readDbTopicRows, "function");
assert.equal(typeof readDbContentBriefRows, "function");
assert.equal(typeof readDbPublishingJobRows, "function");
assert.equal(typeof readDbLocalizationRows, "function");

assert.equal(typeof readTrendExportRows, "function");
assert.equal(typeof readTopicExportRows, "function");
assert.equal(typeof readContentBriefExportRows, "function");
assert.equal(typeof readPublishingJobExportRows, "function");
assert.equal(typeof readLocalizationExportRows, "function");

console.log("Admin content workflow data module tests passed");
