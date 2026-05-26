# Trend Scoring

Formula:

```text
trend_score =
  velocityScore * 0.22
+ sourceCorroborationScore * 0.18
+ marketSpecificityScore * 0.16
+ contentOpportunityScore * 0.16
+ commercialHintScore * 0.10
+ evidenceHintScore * 0.10
+ freshnessScore * 0.08
- noisePenalty
- compliancePenalty
```

Example:

US magnesium sleep can score well because velocity and specificity are high, but it may still receive a compliance penalty because wellness claims need stricter review.

The score decides whether a trend becomes a SERP keyword candidate. It does not decide monetization.
