import assert from "node:assert/strict";
import {
  AdminPanel,
  AdminTokenInput,
  ContentBriefStatusForm,
  MerchantForm,
  OfferForm,
  PlacementStatusForm,
  PublishingJobRetryForm,
  QualityStat,
  QueuePublishingJobForm,
  RecordActionForm,
  RefreshSuggestionStatusForm,
  SaveButton,
  TextInput,
  TopicStatusForm
} from "../apps/web/app/admin/[section]/AdminForms";

assert.equal(typeof AdminPanel, "function");
assert.equal(typeof AdminTokenInput, "function");
assert.equal(typeof ContentBriefStatusForm, "function");
assert.equal(typeof MerchantForm, "function");
assert.equal(typeof OfferForm, "function");
assert.equal(typeof PlacementStatusForm, "function");
assert.equal(typeof PublishingJobRetryForm, "function");
assert.equal(typeof QualityStat, "function");
assert.equal(typeof QueuePublishingJobForm, "function");
assert.equal(typeof RecordActionForm, "function");
assert.equal(typeof RefreshSuggestionStatusForm, "function");
assert.equal(typeof SaveButton, "function");
assert.equal(typeof TextInput, "function");
assert.equal(typeof TopicStatusForm, "function");

console.log("Admin form module export tests passed");
