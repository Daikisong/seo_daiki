import assert from "node:assert/strict";
import {
  MerchantsSection,
  OfferMatchingSection,
  OffersSection,
  PlacementsSection
} from "../apps/web/app/admin/[section]/MonetizationSections";
import { MerchantsSection as DirectMerchantsSection } from "../apps/web/app/admin/[section]/MerchantsSection";
import { OfferMatchingSection as DirectOfferMatchingSection } from "../apps/web/app/admin/[section]/OfferMatchingSection";
import { OffersSection as DirectOffersSection } from "../apps/web/app/admin/[section]/OffersSection";
import { PlacementsSection as DirectPlacementsSection } from "../apps/web/app/admin/[section]/PlacementsSection";

assert.equal(MerchantsSection, DirectMerchantsSection);
assert.equal(OffersSection, DirectOffersSection);
assert.equal(OfferMatchingSection, DirectOfferMatchingSection);
assert.equal(PlacementsSection, DirectPlacementsSection);

for (const section of [MerchantsSection, OffersSection, OfferMatchingSection, PlacementsSection]) {
  assert.equal(typeof section, "function");
}

console.log("Admin monetization section module export tests passed");
