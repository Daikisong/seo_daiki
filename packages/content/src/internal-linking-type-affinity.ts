import type { InternalLinkArticle } from "./internal-linking-types";

export function typeAffinityScore(source: InternalLinkArticle, candidate: InternalLinkArticle) {
  if (candidate.type === "trend" && source.type !== "trend") {
    return 16;
  }

  if (candidate.type === "buyer_guide" && ["trend", "review", "compare", "deal_watch"].includes(source.type)) {
    return 16;
  }

  if (candidate.type === "deal_watch" && ["buyer_guide", "review", "compare", "trend"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "ingredient_guide" && ["trend", "buyer_guide"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "hub" && source.type !== "hub") {
    return 18;
  }

  if (candidate.type === "methodology" && source.type !== "methodology") {
    return 14;
  }

  if ((candidate.type === "data" || candidate.type === "lab") && ["review", "guide", "compare", "risk"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "risk" && ["review", "guide", "compare", "hub"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "compare" && ["review", "guide", "hub", "risk"].includes(source.type)) {
    return 10;
  }

  if (candidate.type === "guide" && ["review", "risk", "compare", "hub"].includes(source.type)) {
    return 10;
  }

  if (candidate.type === "review" && ["guide", "compare", "hub", "risk"].includes(source.type)) {
    return 8;
  }

  return 4;
}
