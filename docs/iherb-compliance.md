# iHerb And Health Compliance

Phase 7 adds a stricter guard for iHerb, supplement, ingredient, and health-sensitive pages.

## Article Fields

`Article` now has:

- `healthSensitivity`: `none`, `low`, `medium`, or `high`
- `complianceStatus`: `unchecked`, `passed`, `blocked`, or `manual_required`
- `complianceJson`: structured audit details

`Topic`, `Offer`, and `Merchant` already carry health-sensitivity flags.

## Blockers

`HealthClaimGuard` blocks index eligibility for:

- disease cure, treatment, or prevention language without qualified evidence
- supplement dosage advice without qualified source context
- guaranteed outcomes
- unsupported doctor-recommended or clinically-proven claims
- medical advice language
- before/after or transformation claims
- replacing medicine, treatment, or professional consultation
- supplement/iHerb offers without an informational-only disclaimer
- missing consult-professional warning for pregnancy, medication, children, or chronic conditions
- high-sensitivity health pages trying to index before `complianceStatus = passed`

## Required Disclaimer

Supplement pages must visibly state that the content is informational and not medical advice, and that readers should consult a qualified professional when pregnancy, medication, chronic illness, or children are involved.

The `ingredient_guide` renderer includes a health notice near the top of the article. The quality gate also checks the article text and affiliate links, so a hidden or removed disclaimer still blocks indexing.

## Admin Gate

The admin index mutation uses the same quality gate. A high-sensitivity iHerb article cannot be manually set to `index` unless the health guard passes and the compliance status is approved.
