import type { ReviewSignal } from "@global-import-lab/types";

export const baseusReviewSignals: ReviewSignal[] = [
  {
    id: "rs-baseus-wrong-plug-en",
    productId: "prod-baseus-65w",
    locale: "en",
    topic: "wrong plug option",
    sentiment: "negative",
    count: 17,
    confidence: 0.72,
    window: "90d"
  },
  {
    id: "rs-baseus-laptop-en",
    productId: "prod-baseus-65w",
    locale: "en",
    topic: "laptop charging inconsistent on cheapest option",
    sentiment: "negative",
    count: 11,
    confidence: 0.68,
    window: "90d"
  },
  {
    id: "rs-baseus-compact-es",
    productId: "prod-baseus-65w",
    locale: "es",
    topic: "compact travel size",
    sentiment: "positive",
    count: 24,
    confidence: 0.76,
    window: "90d"
  },
  {
    id: "rs-baseus-customs-pt",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    topic: "tax and delivery delay concern",
    sentiment: "negative",
    count: 19,
    confidence: 0.7,
    window: "90d"
  }
];
