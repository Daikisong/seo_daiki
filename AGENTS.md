# AGENTS.md

## Trend SEO Content Rules

This project is a reader-facing trend and product brief site. SEO research,
SERP analysis, trend detection, product scoring, affiliate matching, and risk
checks are important, but they are internal workflow inputs. Do not expose
internal workflow language in public article copy unless the user explicitly
asks for a methodology page.

## Core Positioning

TrendBrief is a trend-led buyer decision site. Do not position the site as a
large testing lab, newsroom, or full-time product test team unless that evidence
actually exists. The public position is:

> Buyer notes for fast-moving trends.

The public brand is TrendBrief. The operator and author is Jacob. The content
unit is a Brief or Briefs. Public navigation, metadata, CTAs, archive labels,
and reader-facing copy should use those names instead of older names such as
TREND - Jacob, Trend Picks, generic guide language, or post/article labels where
Brief is more accurate.

The practical editorial promise is:

> TrendBrief compresses the research a buyer would otherwise do across specs,
> marketplace listings, prices, warranties, return terms, seller signals, and
> repeated user-review complaints.

Do not claim direct testing unless the product was actually used by Jacob or a
real named collaborator. If the evidence is public specs, third-party reviews,
marketplace listings, or review-pattern analysis, explain the checkable evidence
positively instead of repeating defensive phrases like "not a lab" or "not
tested in a lab" in public copy.

Do not overcorrect by filling public articles with phrases like "we did not
test this directly." The reader-facing page should simply avoid unsupported
hands-on claims and show the positive evidence layer instead: specs checked,
review-backed, marketplace route, repeated complaints, price checked date,
variant risk, and return path.

The model is closer to an honest small editorial desk than a large lab. The
site can still be expert and useful by making the buying decision clearer than
thin affiliate pages:

- what the product category is and is not
- why the issue or trend creates a buying problem
- which alternative categories should be compared first
- which exact variant/SKU/listing details matter
- who should buy
- who should skip
- which repeated complaints matter
- what warranty, return, delivery, import, or marketplace risk can break the
  recommendation

## iGood-Inspired Buyer Journey Compression

iGood ranks because it compresses a searcher's buying journey into one page,
not because every post is a laboratory test. Use that insight, but adapt it
honestly for TrendBrief.

Preferred article flow:

1. H1 with year, product category, and the current issue/search situation.
2. Intro: the real-world problem moving now.
3. Quick answer: what product category solves the problem and what it cannot
   solve.
4. Top 10 practical picks.
5. Full comparison table with shared fields.
6. Selection criteria and review-signal warnings that readers need before the
   product notes.
7. In-depth product notes.
8. Top 3 recommendation summary.
9. Final thoughts: when to buy, wait, or choose another category.
10. Supporting clarification sections for SEO and reader protection:
    product/category misunderstanding, adjacent-category comparison, and avoid
    lists.
11. Before-you-buy checklist.
12. FAQ.
13. Reader-facing update log: price checked date, product changed date, and
    why a product was added/removed when relevant.

Do not publish a generic Top 10 list that jumps straight from trend headline to
affiliate products. The page must answer the searcher's actual research path:
"what is this, is it right for my situation, what are the alternatives, what
goes wrong in reviews, and what should I verify before clicking?"

## Region Fit and Trend Signal Standard

When an article is anchored to a current issue, the public page should show the
reader-facing evidence signal near the top: what is happening, why it affects
buyers, and what mistake it can create. Do not expose SERP, provider, LLM,
ranking, or Search Console process language. A good signal box says that demand,
stock, weather, regulation, or media attention changed the buyer problem.

If the title names a region or country, the article and product table must match
that region. For example, a Europe heatwave article must address:

- 220-240 V and plug type
- country-specific model suffixes
- local retailer routes and delivery timing
- window or installation fit
- warranty territory
- bulky-item return path
- when a US product is only a benchmark and not a direct local recommendation

Do not let a page say "Europe" while the product evidence reads like a generic
US Amazon list. If the product list uses US benchmark models, label that
honestly and point readers to local equivalents or local-stock routes.

## Source Stack Standard

For review-pattern and specs-first product cards, include a reader-facing source
stack when possible:

- spec checked
- review signal
- marketplace or price route checked
- price checked date

These labels should help readers verify the product class and exact variant.
They should not become outbound-link clutter, and they should not say internal
process terms like "SERP checked", "LLM evidence", or "Search Console signal".

## Avoid Lists for Confusing Product Categories

When a trend creates confusion between similar-looking product classes, add a
short buyer-facing avoid list. Examples:

- USB mini coolers are not room air conditioners.
- Smart AC controllers do not cool a room by themselves.
- Fan-only towers should not be treated as compressor ACs.
- Wrong-voltage heavy imports can become bad purchases even when cheap.

The avoid list should protect the reader from the mistake the trend creates. It
is not a place to show methodology. Avoid lists are supporting clarification
content, not the primary buying flow; place them after final thoughts and before
the final checklist/FAQ unless the user explicitly asks otherwise.

## Public Navigation Should Not Look Empty

Do not expose broad empty categories in the public header, sidebar, sitemap, or
static category routes before there is enough real content for them. Keep future
categories internal until there are published articles, otherwise the site looks
like a thin AI affiliate shell.

Current pre-launch staging intentionally shows the planned category menu so the
site shape can be reviewed before the domain opens. Do not hide those category
labels again just because the local mockup has only one article. Before a public
domain/indexing launch, each visible category should have at least one real
localized brief or be held back/noindexed again.

## Multilingual and Multi-Regional SEO Rules

TrendBrief is a country-triggered buyer-decision site, not a translation
farm. The model is:

```text
country trend signal
-> local searcher problem
-> buyer decision
-> local marketplace/retailer fit
-> specs, price, shipping, returns, warranty, and repeated complaints
```

Use one global domain and fixed locale subdirectories. Do not serve different
languages from the same URL based on IP, cookies, or browser language.

Supported target locale codes live in
`apps/web/lib/trend-site/locales.ts`. Do not invent locale strings in article
data, routes, sitemap code, tests, or generation scripts. If the 18-locale set
changes, update that one file first.

The current planned locale set is:

```text
en, en-us, en-gb, de-de, fr-fr, it-it, es-es, ko-kr, ja-jp, zh-tw,
zh-hk, pt-br, nl-nl, pl-pl, sv-se, tr-tr, th-th, vi-vn
```

Adding a locale to this set is not the same as opening it to Google. A locale
becomes public only when its central config status changes to `indexable`, and
that change should come with tests proving it appears in sitemap/static params
only after real localized content exists.

Current launch rule:

- only `status: "indexable"` locales can appear in sitemap and public article
  static params
- planned locales can exist in the config, but they must not have indexable
  placeholder pages
- empty locale homes, empty categories, draft locale pages, and thin generated
  pages must stay hidden or noindex
- do not add a locale to public navigation until it has enough real localized
  content

Each localized page must use one primary language for title, H1, body,
navigation, product cards, CTA text, FAQ, and schema text. Product names, brand
names, source titles, and necessary search terms can stay in their native form.

Localization is not translation. For a country-targeted trend page, adapt:

- search intent and local phrasing
- title keywords
- currency and price route
- local retailers and marketplaces
- shipping and return route
- voltage, plug, sizing, ingredients, compliance, or compatibility issues
- local review sources where possible
- local reader reason for caring about the trend

Do not publish an article that simply translates the English copy while keeping
US products, US prices, US retailers, or US assumptions for another country.

### Hreflang Rules

Do not generate hreflang automatically by category, product type, or broad topic.
Use hreflang only when pages are true localized alternatives:

1. same core trend or event
2. substantially same buyer decision
3. intentionally localized variants
4. every variant is complete, published, and indexable
5. every variant has a self-referencing canonical
6. every variant can list every other variant reciprocally

Do not use hreflang when articles cover different local trends or answer
different buyer problems. For example, a Korea rainy-season dehumidifier page
and a Germany heatwave AC page are not hreflang alternatives just because both
belong to cooling/home trends.

Never use invalid hreflang codes such as `en-eu`, `en-uk`, `EU`, `UK`, or
country-only codes. General English uses `en`; the United Kingdom uses `en-gb`.
Europe can appear in a slug or article topic, but not as a hreflang region code.

Each localized article canonical must point to itself. Do not canonical a
German, Korean, Japanese, or French page to the English page.

### Language Switcher Rules

Do not auto-redirect users by IP or browser language. When a true localized
variant exists, show a visible reader choice such as "Reading from Germany? See
the German guide." If there is only one completed article, do not create fake
language switcher links.

### Sitemap Rules

Sitemaps must contain only indexable canonical URLs. Do not include empty
country folders, planned locale placeholders, noindex pages, draft articles,
hidden categories, or broken affiliate redirect URLs. If hreflang is later
implemented in sitemap instead of HTML metadata, every URL in that cluster must
be reciprocal and complete.

### Writing Density Rule

Multi-country pages may be long, but they must be compressed. Prefer modular
buyer-decision blocks over long generic prose:

- quick answer
- trend signal box
- quick picks
- comparison table
- buying checklist
- product verdict
- repeated complaints
- FAQ
- update log

For specs-first or review-pattern articles, product notes should usually be
roughly 180-350 words per product unless direct-use evidence justifies more.
Long generic prose, repeated sentence rhythms, and identical warnings across
every product make the page feel like an AI affiliate draft.

## No Public Prose Fallbacks

Reader-facing product prose must be generated by the content/data layer before
rendering. React components and recommendation builders may render labels,
tables, buttons, schema, and structured fields, but they must not invent missing
article prose or product judgment.

Do not add code fallbacks that synthesize buyer-facing sentences such as:

- generic repeated complaints based on product category
- "best for" text derived from rank
- "who should skip" copied from the first con
- evidence basis inferred from review count
- warranty/return advice inferred only from a low/medium risk enum
- marketplace notes generated from merchant hostname

If a required public field is missing, the article should fail the publishing
gate or build-time validation in development. Missing generated copy should not
silently become a generic template.

Required generated product decision fields:

- evidence level
- reader-facing evidence note (it may be stored as `evidenceBasis`, but do not
  expose the storage key as a public article label)
- why recommend
- who fits
- who should skip
- repeated complaints
- warranty/return note
- marketplace note
- practical pros
- practical cons

These fields may be stored in static fixtures during local mockup work, but
they represent CMS/LLM-generated content. They should later come from the
pipeline output, not from React components or rule-based sentence generators.

### Keep Internal Process Internal

Do not write visible article sections that mainly say what the system did, such
as:

- "Search intent"
- "Evidence fit"
- "Local risk"
- "Backdata"
- "Trend context notes"
- "How we chose these picks"
- "Editorial method"
- "Evidence and update log"
- "Commercial search intent"
- "Source and evidence checks"
- "Monetization link available"
- "We followed Google helpful content guidance"
- "We checked SERP/provider/Search Console/LLM signals"

These can exist as data, comments, tests, metadata, admin views, or internal
generation logic. They should not appear as ordinary reader-facing body copy.

### Show Outcomes, Not Process

Reader-facing copy should show the useful result of the internal process:

- exact product variant or SKU caveats
- final shipped price
- plug type, wattage, compatibility, and included accessories
- seller return path and warranty route
- repeated buyer complaints
- shipping delay or import risk
- practical pros and cons
- which pick is best for which use case
- when to buy, wait, or avoid

Bad public copy:

> This recommendation qualifies because of commercial search intent, matching
> product evidence, and monetization link availability.

Better public copy:

> Skip this listing if the wattage, included cable, plug standard, seller return
> terms, or final shipped price do not match what you need.

### LLM Written Article Prose

Article prose should come from the content/data layer as LLM-written output, not
from rank-specific hardcoded sentences inside React components. Components may
render labels, headings, tables, links, and structured fields, but product
review paragraphs, expert takes, final thoughts, intros, and trend bridges
should be supplied by the article/recommendation model.

For detail article pages, treat Jacob as the product-category expert persona.
Except for FAQ blocks, reader-facing article prose should be generated by that
persona per post: intro, quick answer, product-list intro, comparison notes,
in-depth product takes, Top 3 recommendations, final thoughts, and buying
checklists. React components should not author those sentences; they should only
render the generated article fields.

For generated product takes, the LLM should use the available evidence fields as
inputs: review-signal patterns, output claims, final-price snapshots, variant
risk, return risk, marketplace fit, and the reader use case. The public copy
should read like a natural expert recommendation, not like a checklist template.

The same rule applies to product pros and cons. Do not let public `PROS` and
`CONS` sections be filled by repeated template bullets such as "output claim to
verify", "price snapshot available", or "return risk is low" on every product.
Those signals can feed the generation prompt, but the visible bullets should be
LLM/editorially judged per product: what is practically good, what is weak, who
should buy it, and when the recommendation breaks.

For review-pattern articles, the visible product block should feel like Jacob
read and organized the messy buyer research. Good public fields include:

- repeated praise
- repeated complaints
- variant traps
- final shipped price
- seller return route
- warranty territory
- "do not buy if..."
- local marketplace vs import marketplace fit

Bad product blocks repeat the same warning for every item or simply restate the
seller's spec sheet.

### Reader Emphasis Markup

When article prose has a genuinely important buyer-facing phrase, the
content/data layer may wrap only that phrase in Markdown-style emphasis:
`**important buyer phrase**`. The React renderer turns that into the
TrendBrief colored underline emphasis style.

Use this for short, high-value decision phrases only:

- the product class the reader must not confuse
- the main listing risk to verify
- the concrete reason to buy, wait, or avoid
- the exact compatibility, voltage, return, price, or variant caveat that can
  break the purchase

Do not use emphasis for internal workflow language, whole paragraphs, headings,
CTA labels, product names repeated on every row, or generic SEO filler. If
everything is highlighted, nothing is highlighted.

### Issue To Product Bridge

Not every trend starts as a product trend. Many articles should start from a
broader issue, event, search spike, regulation, weather pattern, lifestyle
change, safety concern, celebrity/media moment, or local problem. The public
intro should explain the issue briefly, then bridge it to the product decision
the reader can act on.

Use this shape for the intro:

1. What issue is moving now?
2. Why does a reader care?
3. What product category, buying problem, or marketplace choice does it create?
4. What will this guide compare or help the reader avoid?

Good issue-to-product bridge:

> Power outage searches are rising after the latest storm warnings, but the
> buying problem is not just finding any portable power station. Readers need
> to compare capacity, battery chemistry, recharge speed, return terms, and
> whether the unit can actually run the appliances they care about.

Bad bridge:

> This topic is trending, and our system found commercial search intent, so we
> selected affiliate products.

The article may begin with an issue, but it should not remain a general news
summary. It must connect the issue to a concrete buyer question before the Top
10, comparison table, and product notes.

### Intro And Quick Answer Roles

The paragraph directly under the title is the issue summary. It should explain
what is happening and why the reader should care, without exposing the research
workflow.

The `Quick answer` section is the bridge from issue to products. It should
state, in plain reader language, how the issue turns into a product/category
recommendation and what the guide will compare.

Use this pattern:

1. Title
2. Intro: summarize the issue and the reader problem
3. Quick answer: connect that issue to the product category and buying checks
4. Top 10 practical picks

Good intro:

> Heat-wave searches are rising as more renters look for room cooling options,
> but many cheap portable AC listings hide the real tradeoff: hose setup,
> window fit, noise, electricity use, and return costs.

Good quick answer:

> For this heat-wave issue, the useful products are not just the cheapest
> portable AC units. Compare cooling capacity, room size, hose/window fit,
> noise, shipped price, and return path before choosing a pick.

### Visible SEO Content Bar

Visible SEO content must help the reader make a decision. If a paragraph mainly
proves that the system did research, remove it from the public article or fold
the useful part into a buyer-facing checklist, FAQ, comparison note, or product
takeaway.

Preferred public article flow is the iGood-inspired buyer journey compression
flow defined above:

1. Intro with the current issue and reader problem.
2. Quick answer that bridges the issue to the product/category decision.
3. Top 10 practical picks.
4. Quick comparison table with shared fields.
5. Selection criteria and review-signal warnings.
6. In-depth notes on each pick.
7. Top 3 recommendation summary.
8. Final thoughts: buy, wait, avoid, or choose another category.
9. Supporting clarification sections: product/category misunderstanding,
   adjacent-category comparison, and avoid list.
10. Before-you-buy checklist.
11. FAQ.
12. Reader-facing update log when useful.

Affiliate disclosure should be clear but not treated as a bulky content section
unless the user asks for a dedicated disclosure block. Prefer a concise mention
near the buying FAQ or the relevant outbound-link context, written in reader
language such as:

> The AliExpress or Temu price buttons may be paid affiliate links.

Avoid adding large public sections after the product notes just to show internal
SEO work. Internal rigor should improve the rankings, comparisons, and warnings;
it should not become filler copy.

### Repeated Labels

Do not add repeated badges that appear on every product unless they communicate
a real distinction. A badge shown on every row usually has no information value.

Avoid repeated labels like:

- "Variant checked"
- "Evidence record"
- "SEO checked"
- "Qualified"

Use specific row data instead: output claim, price, key check, risk, return
path, best-for use case, and action.

### Google Guidance Interpretation

Use Google Search guidance as a quality constraint, not as public proof text.
The page should feel helpful because it answers the reader's product question
better, not because it says the site followed an SEO checklist.

When unsure, ask:

- Would a reader who came from Google care about this sentence?
- Does it help them choose, avoid, compare, or verify something?
- Is this an outcome, or just a description of our internal process?

If it is only internal process, keep it out of the public article.
