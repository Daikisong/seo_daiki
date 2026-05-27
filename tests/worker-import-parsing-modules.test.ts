import assert from "node:assert/strict";
import {
  claimKey,
  dateValue,
  inferBrand,
  isRecord,
  numberValue,
  parseCableIncluded,
  parsePlugType,
  parseWattage,
  priceKey,
  refreshSuggestionPayload,
  riskKey,
  signalKey,
  slugify,
  stringValue,
  uniqueRows,
  variantKey,
  verifiedClaimKey
} from "../packages/db/src/workerImportParsing";
import {
  claimKey as directClaimKey,
  priceKey as directPriceKey,
  riskKey as directRiskKey,
  signalKey as directSignalKey,
  uniqueRows as directUniqueRows,
  variantKey as directVariantKey,
  verifiedClaimKey as directVerifiedClaimKey
} from "../packages/db/src/workerImportDeduplication";
import {
  inferBrand as directInferBrand,
  parseCableIncluded as directParseCableIncluded,
  parsePlugType as directParsePlugType,
  parseWattage as directParseWattage,
  slugify as directSlugify
} from "../packages/db/src/workerImportProductParsing";
import { refreshSuggestionPayload as directRefreshSuggestionPayload } from "../packages/db/src/workerImportSearchConsoleParsing";
import {
  dateValue as directDateValue,
  isRecord as directIsRecord,
  numberValue as directNumberValue,
  stringValue as directStringValue
} from "../packages/db/src/workerImportValueParsing";

assert.equal(stringValue, directStringValue);
assert.equal(numberValue, directNumberValue);
assert.equal(isRecord, directIsRecord);
assert.equal(dateValue, directDateValue);

assert.equal(uniqueRows, directUniqueRows);
assert.equal(variantKey, directVariantKey);
assert.equal(claimKey, directClaimKey);
assert.equal(verifiedClaimKey, directVerifiedClaimKey);
assert.equal(signalKey, directSignalKey);
assert.equal(priceKey, directPriceKey);
assert.equal(riskKey, directRiskKey);

assert.equal(slugify, directSlugify);
assert.equal(inferBrand, directInferBrand);
assert.equal(parseWattage, directParseWattage);
assert.equal(parsePlugType, directParsePlugType);
assert.equal(parseCableIncluded, directParseCableIncluded);

assert.equal(refreshSuggestionPayload, directRefreshSuggestionPayload);

console.log("Worker import parsing module tests passed");
