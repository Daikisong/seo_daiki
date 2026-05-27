import { scoreBreakdownSummary, stringFromSearchParam } from "./admin-section-utils";

export type AdminSearchParams = Record<string, string | string[] | undefined>;

export function contentWorkflowTrendFilters(filters: AdminSearchParams) {
  return {
    locale: stringFromSearchParam(filters.locale),
    country: stringFromSearchParam(filters.country),
    source: stringFromSearchParam(filters.source)
  };
}

export function trendLocaleLabel(trend: { country?: string | null; locale: string }) {
  return `${trend.locale}${trend.country ? `/${trend.country}` : ""}`;
}

export function trendScoreLabel(trend: {
  affiliateFitScore: number;
  commercialScore: number;
  evidenceFitScore: number;
  growthScore: number;
}) {
  return `growth ${trend.growthScore}, commercial ${trend.commercialScore}, evidence ${trend.evidenceFitScore}, affiliate ${trend.affiliateFitScore}`;
}

export function topicIntentLabel(topic: { healthSensitive: boolean; intent: string }) {
  return `${topic.intent}${topic.healthSensitive ? " / health" : ""}`;
}

export function topicScoreBreakdownLabel(scoreBreakdown: Record<string, number>) {
  return scoreBreakdownSummary(scoreBreakdown);
}

export function topicRowCountLabel(topic: { briefCount: number; offerCount: number; signalCount: number }) {
  return `${topic.signalCount} signals, ${topic.briefCount} briefs, ${topic.offerCount} offers`;
}

export function briefLocaleTypeLabel(brief: { articleType: string; locale: string }) {
  return `${brief.locale}/${brief.articleType}`;
}

export function previewList(items: string[], limit: number) {
  return items.slice(0, limit).join(", ");
}

export function publishingJobOutputLabel(job: { error?: string | null; outputSummary?: string | null }) {
  return job.error || job.outputSummary || "-";
}

export function canRetryPublishingJob(job: { dbBacked: boolean; status: string }) {
  return job.dbBacked && job.status !== "running";
}
