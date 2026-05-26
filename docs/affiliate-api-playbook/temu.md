# Temu API Playbook

Status: manual-offer-only until official API or feed documentation is verified.

Rules:

- No automatic crawling.
- No automatic price or availability refresh unless an official source exists.
- Require admin approval for every candidate.
- Treat all Temu live integration work as later phase.

Future adapter:

- `TemuLiveAdapter`
- disabled now with clear not-implemented errors

Data needed:

- product title
- public URL
- market availability
- price/availability source timestamp
- merchant policy note
- disclosure requirements
