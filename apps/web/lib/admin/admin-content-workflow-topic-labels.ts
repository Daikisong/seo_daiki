import { scoreBreakdownSummary } from "./admin-section-utils";

export function topicIntentLabel(topic: { healthSensitive: boolean; intent: string }) {
  return `${topic.intent}${topic.healthSensitive ? " / health" : ""}`;
}

export function topicScoreBreakdownLabel(scoreBreakdown: Record<string, number>) {
  return scoreBreakdownSummary(scoreBreakdown);
}

export function topicRowCountLabel(topic: { briefCount: number; offerCount: number; signalCount: number }) {
  return `${topic.signalCount} signals, ${topic.briefCount} briefs, ${topic.offerCount} offers`;
}
