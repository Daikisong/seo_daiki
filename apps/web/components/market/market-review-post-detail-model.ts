import type { MarketPostView } from "@/lib/market/market-data-types";
import {
  checkedAtSentence,
  checklistLabel,
  comparisonToolsLabel,
  comparisonToolsSentence,
  decisionCriteriaLabel,
  decisionCriteriaSentence,
  defaultFitSentence,
  evidenceSetLabel,
  quickAnswerLabel,
  readerPathAnswerDetail,
  readerPathChecklistDetail,
  readerPathCompareDetail,
  readerPathSourcesDetail,
  readerPathStepLabel,
  reviewPeriodLabel,
  scoreNoteLabel,
  sourceCountLabel,
  sourcesLabel
} from "./market-review-post-detail-labels";

export interface ReviewSectionAnchor {
  body: string;
  heading: string;
  id: string;
}

export interface ReviewTrustCard {
  label: string;
  value: string;
  icon: "shield" | "search" | "refresh" | "users";
}

export interface ReviewReaderPathItem {
  label: string;
  title: string;
  detail: string;
  href: string;
}

export function anchorId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/gi, "-")
    .replace(/^-|-$/g, "");
}

export function paragraphs(value: string): string[] {
  return value.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
}

export function quickAnswerParagraphs(post: MarketPostView, answerSection: { body: string }): string[] {
  if (post.verdictBox?.body) {
    return [post.verdictBox.body];
  }
  return paragraphs(answerSection.body).slice(0, 1);
}

export function buildReviewSummary(post: MarketPostView, language: string) {
  const rawScore = post.seoReadinessScore ? post.seoReadinessScore / 10 : 8.7;
  const score = Math.max(7.8, Math.min(8.7, rawScore)).toFixed(1);
  return {
    verdictLabel: normalizedVerdictLabel(post.verdictBox?.label, language),
    verdictBody: post.verdictBox?.body ?? post.summary,
    score,
    scoreNote: scoreNoteLabel(language),
    highlights: post.keyTakeaways.slice(0, 3)
  };
}

export function buildFitItems(post: MarketPostView, language: string): Array<{ text: string; tone: "positive" | "caution" }> {
  const positives = (post.prosCons?.pros ?? []).slice(0, 4).map((text) => ({ text, tone: "positive" as const }));
  const cautions = (post.prosCons?.cons ?? []).slice(0, 1).map((text) => ({ text, tone: "caution" as const }));
  const fallback = post.keyTakeaways.slice(0, 4).map((text) => ({ text, tone: "positive" as const }));
  const items = positives.length > 0 ? [...positives, ...cautions] : fallback;
  if (items.length === 0) {
    return [{ text: defaultFitSentence(language), tone: "positive" }];
  }
  return items;
}

export function isPublicQuickFact(label: string, value: string): boolean {
  const combined = `${label} ${value}`.toLowerCase();
  return !["index-ready", "index ready", "ready after editor", "editor checks", "공개 준비"].some((phrase) => combined.includes(phrase));
}

export function buildTrustCards(post: MarketPostView, language: string): ReviewTrustCard[] {
  return [
    {
      label: reviewPeriodLabel(language),
      value: checkedAtSentence(language, post.articleMeta.checkedAt),
      icon: "shield"
    },
    {
      label: evidenceSetLabel(language),
      value: sourceCountLabel(language, post.sourceLinks.length),
      icon: "search"
    },
    {
      label: comparisonToolsLabel(language),
      value: comparisonToolsSentence(language),
      icon: "refresh"
    },
    {
      label: decisionCriteriaLabel(language),
      value: decisionCriteriaSentence(language),
      icon: "users"
    }
  ];
}

// These links target section containers, not headings, so sticky header offset works consistently.
export function buildReaderPathItems(
  post: MarketPostView,
  answerSection: { heading: string; id: string } | undefined,
  bodySections: Array<{ heading: string; id: string }>,
  language: string
): ReviewReaderPathItem[] {
  const items: ReviewReaderPathItem[] = [];
  if (answerSection) {
    items.push({
      label: readerPathStepLabel(language, 1),
      title: quickAnswerLabel(language),
      detail: readerPathAnswerDetail(language),
      href: `#${answerSection.id}`
    });
  }
  if (post.checklist.length > 0) {
    items.push({
      label: readerPathStepLabel(language, 2),
      title: checklistLabel(language),
      detail: readerPathChecklistDetail(language),
      href: "#checklist"
    });
  }
  if (post.comparisonTable) {
    items.push({
      label: readerPathStepLabel(language, 3),
      title: post.comparisonTable.title,
      detail: readerPathCompareDetail(language),
      href: "#comparison"
    });
  } else if (bodySections[0]) {
    items.push({
      label: readerPathStepLabel(language, 3),
      title: bodySections[0].heading,
      detail: readerPathCompareDetail(language),
      href: `#${bodySections[0].id}`
    });
  }
  if (post.sourceLinks.length > 0) {
    items.push({
      label: readerPathStepLabel(language, 4),
      title: sourcesLabel(language),
      detail: readerPathSourcesDetail(language),
      href: "#sources"
    });
  }
  return items.slice(0, 4);
}

export function buildRelatedLinks(post: MarketPostView, bodySections: Array<{ heading: string; id: string }>, language: string): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = [];
  if (bodySections[0]) {
    links.push({ label: bodySections[0].heading, href: `#${bodySections[0].id}` });
  }
  if (post.checklist.length > 0) {
    links.push({ label: checklistLabel(language), href: "#checklist" });
  }
  if (post.comparisonTable) {
    links.push({ label: post.comparisonTable.title, href: "#comparison" });
  }
  if (post.sourceLinks.length > 0) {
    links.push({ label: sourcesLabel(language), href: "#sources" });
  }
  return links.slice(0, 4);
}

function normalizedVerdictLabel(label: string | undefined, language: string): string {
  if (label && !/^verdict$/i.test(label.trim())) {
    return label;
  }
  if (language === "ko") return "추천";
  return "Recommended";
}
