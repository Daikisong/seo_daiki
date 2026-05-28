import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { englishCategoryHubDraft } from "./sample-base-hub-draft-builder";
import type { EnglishCategoryHubDraftInput } from "./sample-base-hub-draft-types";

export const englishCategoryHubDraftInputs: EnglishCategoryHubDraftInput[] = [
  {
    id: "art-en-hub-usb-c-cables",
    slug: "usb-c-cables",
    title: "USB-C Cable Verification Hub",
    summary:
      "A category hub for USB-C cables that focuses on e-marker evidence, wattage labels, length variants, and import price risk.",
    evidenceIds: ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "risk-essager-us"]
  },
  {
    id: "art-en-hub-power-banks",
    slug: "power-banks",
    title: "Power Bank Verification Hub",
    summary:
      "A category hub for imported power banks that separates claimed mAh, usable Wh, USB-C output, shipping cost, and return risk.",
    evidenceIds: [
      "vc-zmi-20000-power-bank-primary",
      "sc-zmi-20000-power-bank-primary",
      "sc-zmi-20000-power-bank-bundle",
      "risk-zmi-20000-power-bank-en"
    ]
  },
  {
    id: "art-en-hub-electric-screwdrivers",
    slug: "electric-screwdrivers",
    title: "Electric Screwdriver Verification Hub",
    summary:
      "A pending category hub for imported electric screwdriver kits where accessory-only options can be mistaken for full kits.",
    evidenceIds: [
      "vc-hoto-screwdriver-kit-primary",
      "sc-hoto-screwdriver-kit-primary",
      "sc-hoto-screwdriver-kit-bundle",
      "risk-hoto-screwdriver-kit-en"
    ],
    indexStatus: "pending",
    qualityScore: 72
  },
  {
    id: "art-en-hub-smart-home-sensors",
    slug: "smart-home-sensors",
    title: "Smart Home Sensor Verification Hub",
    summary:
      "A pending category hub for imported smart-home sensors where Wi-Fi and Zigbee options can share one listing.",
    evidenceIds: [
      "vc-tuya-zigbee-sensor-primary",
      "sc-tuya-zigbee-sensor-primary",
      "sc-tuya-zigbee-sensor-bundle",
      "risk-tuya-zigbee-sensor-en"
    ],
    indexStatus: "pending",
    qualityScore: 72
  }
];

export function buildEnglishCategoryHubDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return englishCategoryHubDraftInputs.map((input) => englishCategoryHubDraft(context, input));
}
