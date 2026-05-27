import assert from "node:assert/strict";
import {
  briefLocaleTypeLabel,
  canRetryPublishingJob,
  contentWorkflowTrendFilters,
  previewList,
  publishingJobOutputLabel,
  topicIntentLabel,
  topicRowCountLabel,
  topicScoreBreakdownLabel,
  trendLocaleLabel,
  trendScoreLabel
} from "../apps/web/lib/admin/admin-content-workflow-model";
import {
  briefLocaleTypeLabel as directBriefLocaleTypeLabel,
  previewList as directPreviewList
} from "../apps/web/lib/admin/admin-content-workflow-brief-labels";
import {
  contentWorkflowTrendFilters as directContentWorkflowTrendFilters
} from "../apps/web/lib/admin/admin-content-workflow-filters";
import {
  canRetryPublishingJob as directCanRetryPublishingJob,
  publishingJobOutputLabel as directPublishingJobOutputLabel
} from "../apps/web/lib/admin/admin-content-workflow-job-labels";
import {
  topicIntentLabel as directTopicIntentLabel,
  topicRowCountLabel as directTopicRowCountLabel,
  topicScoreBreakdownLabel as directTopicScoreBreakdownLabel
} from "../apps/web/lib/admin/admin-content-workflow-topic-labels";
import {
  trendLocaleLabel as directTrendLocaleLabel,
  trendScoreLabel as directTrendScoreLabel
} from "../apps/web/lib/admin/admin-content-workflow-trend-labels";

assert.equal(contentWorkflowTrendFilters, directContentWorkflowTrendFilters);
assert.equal(trendLocaleLabel, directTrendLocaleLabel);
assert.equal(trendScoreLabel, directTrendScoreLabel);
assert.equal(topicIntentLabel, directTopicIntentLabel);
assert.equal(topicRowCountLabel, directTopicRowCountLabel);
assert.equal(topicScoreBreakdownLabel, directTopicScoreBreakdownLabel);
assert.equal(briefLocaleTypeLabel, directBriefLocaleTypeLabel);
assert.equal(previewList, directPreviewList);
assert.equal(publishingJobOutputLabel, directPublishingJobOutputLabel);
assert.equal(canRetryPublishingJob, directCanRetryPublishingJob);

assert.deepEqual(
  contentWorkflowTrendFilters({ locale: ["en", "es"], country: "US", source: undefined }),
  { locale: "en", country: "US", source: "" }
);

assert.equal(trendLocaleLabel({ locale: "en", country: "US" }), "en/US");
assert.equal(trendLocaleLabel({ locale: "es" }), "es");
assert.equal(
  trendScoreLabel({
    affiliateFitScore: 20,
    commercialScore: 30,
    evidenceFitScore: 40,
    growthScore: 50
  }),
  "growth 50, commercial 30, evidence 40, affiliate 20"
);

assert.equal(topicIntentLabel({ intent: "commercial", healthSensitive: true }), "commercial / health");
assert.equal(topicIntentLabel({ intent: "informational", healthSensitive: false }), "informational");
assert.equal(topicRowCountLabel({ signalCount: 3, briefCount: 2, offerCount: 1 }), "3 signals, 2 briefs, 1 offers");
assert.equal(topicScoreBreakdownLabel({ velocity: 20, freshness: 10 }), "velocity 20, freshness 10");

assert.equal(briefLocaleTypeLabel({ locale: "pt-br", articleType: "guide" }), "pt-br/guide");
assert.equal(previewList(["one", "two", "three", "four"], 3), "one, two, three");
assert.equal(previewList([], 3), "");

assert.equal(publishingJobOutputLabel({ error: "failed", outputSummary: "done" }), "failed");
assert.equal(publishingJobOutputLabel({ outputSummary: "done" }), "done");
assert.equal(publishingJobOutputLabel({}), "-");
assert.equal(canRetryPublishingJob({ dbBacked: true, status: "failed" }), true);
assert.equal(canRetryPublishingJob({ dbBacked: true, status: "running" }), false);
assert.equal(canRetryPublishingJob({ dbBacked: false, status: "failed" }), false);

console.log("Admin content workflow model unit tests passed");
