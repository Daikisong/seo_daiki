# Merchant Adapter Contract

Interface:

```text
MerchantAdapter:
  validateCredentials()
  searchCandidates(query, market, language)
  normalizeCandidate(raw)
  buildAffiliateUrl(candidate, tracking)
  refreshOffer(candidateId)
  validatePolicy(candidate)
  getRequiredDisclosures()
```

Implemented now:

- `ManualCsvMerchantAdapter`
- `ExistingProductDbAdapter`

Documentation-only or disabled placeholders:

- `AliExpressLiveAdapter`
- `TemuLiveAdapter`
- `AmazonLiveAdapter`
- `IHerbLiveAdapter`

Rules:

- Live adapters must throw clear not-implemented errors.
- Candidate discovery can produce product candidates.
- Candidate discovery cannot insert monetized links.
- Affiliate URL generation requires human approval in a later phase.
