export const monetizationReviewStatuses = [
  "pending_human_review",
  "approved_candidates",
  "final_approved",
  "rejected"
] as const;

export type MonetizationReviewStatus = (typeof monetizationReviewStatuses)[number];

export interface MonetizationReviewRow {
  id: string;
  articleId?: string;
  market?: string;
  language?: string;
  productAnalysisId?: string;
  status?: string;
  reviewerNotes?: string;
  approvedCandidateIdsJson?: unknown;
  rejectedCandidateIdsJson?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonetizationReviewPayload {
  reviews?: MonetizationReviewRow[];
}

export interface MonetizationReviewUpdate {
  id: string;
  status: MonetizationReviewStatus;
  reviewerNotes?: string;
  approvedCandidateIdsJson?: string[];
  rejectedCandidateIdsJson?: string[];
  updatedAt?: string;
}
