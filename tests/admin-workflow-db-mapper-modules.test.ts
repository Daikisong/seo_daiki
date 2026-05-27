import assert from "node:assert/strict";
import {
  mapDbComplianceArticleRow,
  mapDbContentBriefRow,
  mapDbLocalizationGroupRow,
  mapDbPublishingJobRow,
  mapDbTopicRow,
  mapDbTrendSignalRow
} from "../apps/web/lib/admin/admin-workflow-db-mappers";
import {
  mapDbContentBriefRow as mapSplitContentBriefRow,
  mapDbTopicRow as mapSplitTopicRow,
  mapDbTrendSignalRow as mapSplitTrendSignalRow
} from "../apps/web/lib/admin/admin-workflow-trend-db-mappers";
import {
  mapDbComplianceArticleRow as mapSplitComplianceArticleRow,
  mapDbLocalizationGroupRow as mapSplitLocalizationGroupRow,
  mapDbPublishingJobRow as mapSplitPublishingJobRow
} from "../apps/web/lib/admin/admin-workflow-publishing-db-mappers";

assert.equal(mapDbTrendSignalRow, mapSplitTrendSignalRow);
assert.equal(mapDbTopicRow, mapSplitTopicRow);
assert.equal(mapDbContentBriefRow, mapSplitContentBriefRow);
assert.equal(mapDbPublishingJobRow, mapSplitPublishingJobRow);
assert.equal(mapDbComplianceArticleRow, mapSplitComplianceArticleRow);
assert.equal(mapDbLocalizationGroupRow, mapSplitLocalizationGroupRow);

const topic = mapDbTopicRow({
  id: "topic-1",
  canonicalTopic: "USB C charger",
  slug: "usb-c-charger",
  intent: "commercial",
  healthSensitive: false,
  primaryLocale: "es",
  status: "scored",
  score: 78.2,
  scoreBreakdown: { growthScore: "70", evidenceScore: 55 },
  _count: { topicSignals: 3, contentBriefs: 2, offers: 1 }
});
assert.equal(topic.signalCount, 3);
assert.deepEqual(topic.scoreBreakdown, { growthScore: 70, evidenceScore: 55 });

const job = mapDbPublishingJobRow({
  id: "job-1",
  locale: "en",
  jobType: "post",
  status: "queued",
  articleId: null,
  topicId: "topic-1",
  article: null,
  topic: { canonicalTopic: "Topic fallback" },
  outputJson: { one: 1 },
  error: null
});
assert.equal(job.targetLabel, "Topic fallback");

console.log("Admin workflow DB mapper module tests passed");
