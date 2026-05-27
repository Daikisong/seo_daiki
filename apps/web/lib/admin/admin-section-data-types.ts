export interface AffiliatePlacementCandidateRow {
  id: string;
  topicId: string;
  briefId: string;
  articleId: string;
  offerId: string;
  merchantSlug: string;
  placementType: string;
  anchorText: string;
  rel: string;
  disclosureShown: boolean;
  status: string;
  humanApprovalRequired: boolean;
  offerScore: number;
  reason: string;
  scoreBreakdown: Record<string, number>;
}
