# Distribution Rules

Distribution rules live in `data/seeds/distribution-rules.csv` for local/sample mode.

Columns:

- `platform`
- `locale`
- `max_posts_per_day`
- `requires_human_approval`
- `allow_direct_link`
- `require_disclosure`
- `enabled`

The default checked-in rules enable owned-channel drafts for X, LinkedIn, Pinterest, YouTube, and Discord. Reddit is disabled and draft-only.

The worker intentionally does not:

- auto-post to Reddit or third-party communities
- create accounts
- bypass approvals
- use direct affiliate links
- send without an explicitly configured adapter

When generating generic owned-channel drafts, the worker now ranks data, lab, methodology, guide, comparison, and hub URLs ahead of buyer guides, deal watches, and review-style pages. A specific `--article-id` can still be drafted intentionally, but the default batch prefers linkable editorial assets over affiliate-heavy URLs.

This is like preparing social post drafts in a notebook. Nothing is published until a person approves and a real owned-channel adapter is configured.
