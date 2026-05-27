import assert from "node:assert/strict";
import { BriefsSection as DirectBriefsSection } from "../apps/web/app/admin/[section]/BriefsSection";
import {
  BriefsSection,
  PublishingJobsSection,
  TopicsSection,
  TrendsSection
} from "../apps/web/app/admin/[section]/ContentWorkflowSections";
import { PublishingJobsSection as DirectPublishingJobsSection } from "../apps/web/app/admin/[section]/PublishingJobsSection";
import { TopicsSection as DirectTopicsSection } from "../apps/web/app/admin/[section]/TopicsSection";
import { TrendsSection as DirectTrendsSection } from "../apps/web/app/admin/[section]/TrendsSection";

assert.equal(BriefsSection, DirectBriefsSection);
assert.equal(PublishingJobsSection, DirectPublishingJobsSection);
assert.equal(TopicsSection, DirectTopicsSection);
assert.equal(TrendsSection, DirectTrendsSection);

console.log("Admin content workflow section module export tests passed");
