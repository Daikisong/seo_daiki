# Outreach Compliance

Outreach is allowed only as human-reviewed relationship work.

Allowed:

- qualifying a relevant page from a manual CSV
- suggesting a data, lab, methodology, guide, comparison, or hub asset
- drafting a polite email or contact-form message
- requiring human approval before any send
- honoring suppression entries before contact
- including opt-out wording and a physical-address field in outbound copy

Not allowed:

- paid dofollow language
- optimized anchor text demands
- automatic backlink creation
- comment/forum/profile posting
- bulk sends without approval
- contacting spam-risk domains

Example safe message:

```text
We maintain an evidence-focused resource that may help as a source.
No paid placement or anchor text request is intended.
```

That keeps the system focused on useful citations, not link manipulation.

Suppression entries live in `data/seeds/suppression-list.csv` for sample mode. The outreach worker checks the list while importing prospects, scoring prospects, drafting messages, approving messages, and preparing send reports.

Example: if `directory-submit.test` is in the suppression CSV, a matching prospect is marked `suppressed`, no outreach draft is created, and an already approved message is reported as `blocked_suppressed` before any send adapter can run.
