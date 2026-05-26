# Monetization Human Approval

Flow:

```text
ProductCandidateAnalysisBlock
  -> MonetizationReview pending
  -> human approves candidates
  -> MonetizedPlacementDraft created
  -> article revision generated
  -> human final approval
  -> links inserted
```

Rules:

- Product discovery cannot insert links.
- Placement drafts require human approval.
- Final apply requires final approval.
- `rel="sponsored nofollow"` is enforced.
