# TrendBrief buyer decision operating model

Date: 2026-06-30

## Position

TrendBrief should not compete with TechRadar, WIRED, Food & Wine, or People as a fake testing lab. The site should compete as a small, honest buyer-decision desk.

Public position:

> TrendBrief compresses the research a buyer would normally do across product specs, marketplace listings, price snapshots, warranty routes, seller terms, and repeated review complaints.

This is closer to the useful part of iGood: a page that turns a broad product question into a clear buying path.

## Why iGood works

iGood is not only ranking because it looks like a product blog. It works because one article answers the whole buying journey:

- what the product category is
- what it is not
- why people are searching now
- what alternatives are confused with it
- how to choose
- which products are popular or worth comparing
- what each product costs
- what specs matter
- what FAQ questions block the purchase
- why some readers should avoid the category

That is the part TrendBrief should adapt.

## What we should not copy

Do not copy:

- fake team/tester claims
- direct-use language without actual use
- generic Top 10 affiliate lists
- repeated "best value" prose
- product cards where every item has the same warnings
- public sections that explain internal SEO workflow

## Article flow

Use this reader-facing flow:

1. Title: year + product category + current issue.
2. Intro: what is happening and why readers care.
3. Quick answer: how the issue becomes a product decision.
4. Top 10 practical picks.
5. Quick comparison table.
6. How to choose and review-signal warnings needed before product notes.
7. In-depth notes on all 10 picks.
8. Top 3 recommendations.
9. Final thoughts.
10. Supporting clarification: what this product is not, alternative
    comparison, and avoid list.
11. Before-you-buy checklist.
12. FAQ.
13. Update log.

## Required product block

Each product block needs generated editorial judgment:

- Evidence level
- Reader-facing evidence note
- Why recommend
- Best for
- Skip if
- Pros
- Repeated complaints to check
- Key check
- Spec snapshot
- Review pattern
- Warranty / return
- Marketplace note
- Cons
- Price action

The renderer should not write this prose. It should render generated fields.

## Recommendation strength levels

Direct-use notes

- Jacob or a real collaborator used the product.
- The exact variant and usage window should be stated.

Review-backed picks

- Public specs plus review coverage, marketplace reviews, community discussion, price snapshots, seller terms, and repeated complaints.
- This is the default level for many TrendBrief guides.

Specs-first comparisons

- Specs and listings are clear, but review depth is thin.
- Recommendation strength should be conservative.

Not enough evidence

- Product should not be recommended yet.

## Hard rule

No public prose fallback.

If `whyRecommend`, `whoFits`, `whoShouldSkip`, `repeatedComplaints`, `warrantyReturnNote`, or `marketplaceNote` is missing, the article should fail validation. Components must not generate generic text from category, rank, risk enum, or product name.

Static demo data may contain generated-looking fields, but those fields represent pipeline/CMS/LLM output. They are not component templates.

## Competitive angle

iGood often summarizes reviews, but TrendBrief should make the review signal more decision-grade:

- repeated praise
- repeated complaints
- variant traps
- return friction
- warranty territory
- final shipped price
- "who should skip this"

The goal is not to sound bigger than we are. The goal is to make the buyer's next click safer.

## 2026-06-30 feedback hardening

The heatwave dry-run showed that a good iGood-style skeleton is not enough if
the evidence and local fit feel thin. Future trend pages should add these layers
before publication:

- A reader-facing trend signal box near the top when the article starts from a
  live issue such as weather, regulation, shortage, media attention, or safety
  concern.
- Product tables that match the region named in the title. If a page says
  Europe, it must discuss local voltage, plug, warranty territory, retailer
  routes, model suffixes, window fit, delivery timing, and bulky returns.
- A product source stack for spec source, review signal, marketplace or price
  route, and price-check date. These should be labels, not distracting outbound
  source links.
- A short avoid list when readers can confuse adjacent product classes, such as
  compressor ACs versus fans, evaporative coolers, smart controllers, and USB
  mini coolers. This is supporting SEO and reader-protection content, so place
  it after final thoughts instead of interrupting the main Top 10 and product
  note flow.
- Public navigation should expose only categories with real published content.
  Future categories can stay internal until there are enough articles to make
  the site look intentionally edited instead of hollow.
