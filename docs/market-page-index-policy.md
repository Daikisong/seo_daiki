# Market Page Index Policy

The default rule is simple:

```text
Public user page -> may be indexable
Research/workflow page -> noindex
Empty market page -> noindex and not in sitemap
```

## Indexable By Default

These can be indexable when they contain useful public content:

- `/global/`
- `/global/trend-map/`
- `/global/topics/`
- `/global/methodology/`
- `/global/markets/`
- market homes only when sitemap eligibility is met
- legacy indexed article routes that already pass article SEO gates

## Noindex By Default

These routes are internal research or test publishing surfaces:

- `/[market]/[language]/trends/[slug]/`
- `/[market]/[language]/keywords/[slug]/`
- `/[market]/[language]/serp/[slug]/`
- `/[market]/[language]/briefs/[slug]/`
- `/[market]/[language]/calendar/`
- `/[market]/[language]/posts/[slug]/`

Example:

```text
/kr/ko/serp/gut-health/
```

This page can help an editor decide what to write, but it is not yet a public article. It stays `noindex, follow`.

## Market Home Eligibility

A market home can enter sitemap only when:

- the market is enabled, and
- it has at least 3 trend clusters, or
- it has at least 3 SERP opportunities, or
- it has at least 1 public-ready post.

The override is explicit:

```bash
INCLUDE_EMPTY_MARKETS_IN_SITEMAP=true
```

The default remains false.

## UI Language Safety

Every initial market language has a UI label pack in:

```text
data/config/ui-labels.json
```

If a language falls back to incomplete English labels, the market home is treated as noindex.
