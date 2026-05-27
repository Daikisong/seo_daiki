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
import {
  readAffiliateMerchants,
  readAffiliateOffers,
  readAffiliatePlacements,
  readAuditLogs,
  readLabEvidenceAssets,
  readPersistedRefreshSuggestions
} from "../apps/web/lib/admin/admin-section-data";
import {
  readAffiliateMerchants as directReadAffiliateMerchants,
  readAffiliateOffers as directReadAffiliateOffers,
  readAffiliatePlacements as directReadAffiliatePlacements
} from "../apps/web/lib/admin/admin-affiliate-db-data";
import { readAuditLogs as directReadAuditLogs } from "../apps/web/lib/admin/admin-audit-db-data";
import { readLabEvidenceAssets as directReadLabEvidenceAssets } from "../apps/web/lib/admin/admin-lab-evidence-db-data";
import { readPersistedRefreshSuggestions as directReadPersistedRefreshSuggestions } from "../apps/web/lib/admin/admin-refresh-db-data";

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

assert.equal(readAffiliateMerchants, directReadAffiliateMerchants);
assert.equal(readAffiliateOffers, directReadAffiliateOffers);
assert.equal(readAffiliatePlacements, directReadAffiliatePlacements);
assert.equal(readAuditLogs, directReadAuditLogs);
assert.equal(readLabEvidenceAssets, directReadLabEvidenceAssets);
assert.equal(readPersistedRefreshSuggestions, directReadPersistedRefreshSuggestions);

runSectionDbDataAssertions().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function runSectionDbDataAssertions() {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    assert.deepEqual(await readAffiliateMerchants(), []);
    assert.deepEqual(await readAffiliateOffers(), []);
    assert.deepEqual(await readAffiliatePlacements(), []);
    assert.deepEqual(await readAuditLogs(), []);
    assert.deepEqual(await readLabEvidenceAssets(), []);
    assert.deepEqual(await readPersistedRefreshSuggestions(), []);
  } finally {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }

  console.log("Admin content workflow data module tests passed");
}
