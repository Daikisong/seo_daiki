export interface ProductCandidateRecord {
  id: string;
  articleId?: string;
  market: string;
  language: string;
  sourceMerchant: string;
  sourceMode: string;
  title: string;
  productUrl?: string;
  candidateUrl?: string;
  category?: string;
  priceText?: string;
  currency?: string;
  reason: string;
  relevanceScore: number;
  riskScore: number;
  evidenceNeededJson: string[];
  status: string;
}

export interface MonetizationReviewRecord {
  id: string;
  articleId: string;
  market: string;
  language: string;
  productAnalysisId: string;
  status: "pending_human_review" | "approved_candidates" | "final_approved" | "rejected";
  reviewerNotes?: string;
  approvedCandidateIdsJson: string[];
  rejectedCandidateIdsJson: string[];
}
