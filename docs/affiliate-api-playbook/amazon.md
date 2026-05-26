# Amazon API Playbook

Status: documentation only. Do not implement now.

Requirements later:

- Amazon Associates approval
- approved Product Advertising API or approved creator/API path
- compliance review for price, rating, review, image, and availability display

Rules:

- Do not show stale prices without required timestamp/disclaimer.
- Do not reuse reviews, ratings, or images outside allowed terms.
- Do not insert links without human approval.
- Enforce `rel="sponsored nofollow"`.

Future adapter:

- `AmazonLiveAdapter`
- disabled now with clear not-implemented errors
