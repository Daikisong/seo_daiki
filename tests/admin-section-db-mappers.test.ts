import assert from "node:assert/strict";
import {
  mapAuditLogRow,
  mapDbComplianceArticleRow,
  mapDbContentBriefRow,
  mapDbLocalizationGroupRow,
  mapDbPublishingJobRow,
  mapDbTopicRow,
  mapDbTrendSignalRow,
  mapLabEvidenceAssetRow
} from "../apps/web/lib/admin/admin-section-db-mappers";

const audit = mapAuditLogRow({
  id: "audit-1",
  entityType: "Article",
  entityId: "article-1",
  action: "update",
  actor: "editor",
  summary: "Changed publish status",
  createdAt: new Date("2026-05-27T01:02:03.000Z")
});
assert.equal(audit.createdAt, "2026-05-27T01:02:03.000Z");
assert.equal(audit.summary, "Changed publish status");

const trend = mapDbTrendSignalRow({
  id: "trend-1",
  locale: "en",
  country: "US",
  query: "magnesium sleep",
  topicRaw: "magnesium sleep",
  growthScore: 81,
  commercialScore: 52,
  evidenceFitScore: 70,
  affiliateFitScore: 30,
  source: { name: "manual_csv" }
});
assert.equal(trend.sourceName, "manual_csv");
assert.equal(trend.growthScore, 81);

const topic = mapDbTopicRow({
  id: "topic-1",
  canonicalTopic: "USB C charger",
  slug: "usb-c-charger",
  intent: "commercial",
  healthSensitive: false,
  primaryLocale: "es",
  status: "scored",
  score: 78.2,
  scoreBreakdown: { growthScore: "70", evidenceScore: 55, ignored: "bad" },
  _count: { topicSignals: 3, contentBriefs: 2, offers: 1 }
});
assert.equal(topic.dbBacked, true);
assert.deepEqual(topic.scoreBreakdown, { growthScore: 70, evidenceScore: 55, ignored: 0 });
assert.equal(topic.signalCount, 3);
assert.equal(topic.briefCount, 2);
assert.equal(topic.offerCount, 1);

const brief = mapDbContentBriefRow({
  id: "brief-1",
  topicId: "topic-1",
  topic: { canonicalTopic: "Magnesium sleep" },
  locale: "en",
  articleType: "trend",
  titleCandidate: "Magnesium sleep guide",
  searchIntent: "informational",
  outlineJson: ["Direct answer", { heading: "Evidence limits" }, { title: "ignored" }],
  requiredEvidence: ["SERP summary", 42, "Health claim review"],
  status: "draft"
});
assert.equal(brief.topicLabel, "Magnesium sleep");
assert.deepEqual(brief.outline, ["Direct answer", "Evidence limits"]);
assert.deepEqual(brief.requiredEvidence, ["SERP summary", "Health claim review"]);

const fallbackBrief = mapDbContentBriefRow({
  id: "brief-2",
  topicId: "topic-2",
  topic: null,
  locale: "en",
  articleType: "trend",
  titleCandidate: "Fallback",
  searchIntent: "informational",
  outlineJson: [],
  requiredEvidence: [],
  status: "draft"
});
assert.equal(fallbackBrief.topicLabel, "topic-2");

assert.equal(
  mapDbPublishingJobRow({
    id: "job-1",
    locale: "en",
    jobType: "post",
    status: "queued",
    articleId: "article-1",
    topicId: "topic-1",
    article: { title: "Article title wins" },
    topic: { canonicalTopic: "Topic fallback" },
    outputJson: { one: 1, two: 2 },
    error: null
  }).targetLabel,
  "Article title wins"
);
assert.equal(
  mapDbPublishingJobRow({
    id: "job-2",
    locale: "en",
    jobType: "post",
    status: "queued",
    articleId: "article-2",
    topicId: "topic-2",
    article: null,
    topic: { canonicalTopic: "Topic fallback" },
    outputJson: ["a", "b"],
    error: "failed"
  }).targetLabel,
  "Topic fallback"
);
assert.equal(
  mapDbPublishingJobRow({
    id: "job-3",
    locale: "en",
    jobType: "post",
    status: "queued",
    articleId: "article-3",
    topicId: null,
    article: null,
    topic: null,
    outputJson: null,
    error: null
  }).targetLabel,
  "article-3"
);
assert.equal(
  mapDbPublishingJobRow({
    id: "job-4",
    locale: "en",
    jobType: "post",
    status: "queued",
    articleId: null,
    topicId: "topic-4",
    article: null,
    topic: null,
    outputJson: null,
    error: null
  }).targetLabel,
  "topic-4"
);
assert.equal(
  mapDbPublishingJobRow({
    id: "job-5",
    locale: "en",
    jobType: "post",
    status: "queued",
    articleId: null,
    topicId: null,
    article: null,
    topic: null,
    outputJson: null,
    error: null
  }).targetLabel,
  "-"
);

const compliance = mapDbComplianceArticleRow({
  id: "article-1",
  title: "Health article",
  locale: "en",
  type: "trend",
  slug: "health-article",
  publishStatus: "pending",
  indexStatus: "noindex",
  healthSensitivity: "high",
  complianceStatus: "blocked",
  complianceJson: { blockers: ["health_claim", "missing_disclosure"] }
});
assert.deepEqual(compliance.issues, ["health_claim", "missing_disclosure"]);

const localization = mapDbLocalizationGroupRow({
  id: "group-1",
  canonicalTopic: { canonicalTopic: "USB C charger" },
  sourceArticle: { locale: "en", type: "trend", slug: "usb-c-charger" },
  variants: [{ locale: "es", status: "localized", localizationDepthScore: 82 }]
});
assert.equal(localization.topicLabel, "USB C charger");
assert.equal(localization.sourceLabel, "en/trend/usb-c-charger");
assert.equal(localization.variants[0]?.localizationDepthScore, 82);

const fallbackLocalization = mapDbLocalizationGroupRow({
  id: "group-2",
  canonicalTopic: null,
  sourceArticle: null,
  variants: []
});
assert.equal(fallbackLocalization.topicLabel, "translation group");
assert.equal(fallbackLocalization.sourceLabel, "-");

const asset = mapLabEvidenceAssetRow({
  id: "asset-1",
  productId: "product-1",
  verifiedClaimId: null,
  measurementType: "thermal",
  fileName: "thermal.csv",
  publicUrl: "/api/lab-evidence-file/thermal.csv",
  sizeBytes: 1200,
  uploadedAt: new Date("2026-05-27T04:05:06.000Z")
});
assert.equal(asset.uploadedAt, "2026-05-27T04:05:06.000Z");
assert.equal(asset.verifiedClaimId, null);

console.log("Admin section DB mapper unit tests passed");
