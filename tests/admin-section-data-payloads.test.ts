import assert from "node:assert/strict";
import {
  adminPayloadArray,
  affiliatePlacementCandidatePayloadRows,
  contentBriefPayloadRows,
  localizedArticlePayloadRows,
  publishingGatePayloadRows,
  topicScorePayloadRows,
  trendSignalPayloadRows
} from "../apps/web/lib/admin/admin-section-data-payloads";

const payload = {
  signals: [{ id: "signal-1" }],
  topics: [{ id: "topic-1" }],
  briefs: [{ id: "brief-1" }],
  results: [{ id: "result-1" }],
  articles: [{ id: "article-1" }],
  placementCandidates: [{ id: "candidate-1" }],
  wrong: "not-array"
};

assert.deepEqual(trendSignalPayloadRows(payload), [{ id: "signal-1" }]);
assert.deepEqual(topicScorePayloadRows(payload), [{ id: "topic-1" }]);
assert.deepEqual(contentBriefPayloadRows(payload), [{ id: "brief-1" }]);
assert.deepEqual(publishingGatePayloadRows(payload), [{ id: "result-1" }]);
assert.deepEqual(localizedArticlePayloadRows(payload), [{ id: "article-1" }]);
assert.deepEqual(affiliatePlacementCandidatePayloadRows(payload), [{ id: "candidate-1" }]);

assert.deepEqual(adminPayloadArray(payload, "wrong"), []);
assert.deepEqual(adminPayloadArray([], "signals"), []);
assert.deepEqual(adminPayloadArray(null, "signals"), []);

console.log("Admin section data payload unit tests passed");
