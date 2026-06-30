# iGood deep reference analysis - 2026-06-30

## Scope

This document is a reference teardown of iGood (`https://igood.tw/`) for TREND - Jacob. It focuses on the public site shape, article structure, HTML/CSS signals, author/persona system, footer trust layer, and the detailed article `https://igood.tw/posts/2358`.

The goal is not to copy iGood. The useful reference is the system: a broad shopping guide site that turns categories, expert/editor personas, public research, comparison tables, and product schema into reader-facing buying decisions.

Primary pages inspected:

| Page | URL | Why it matters |
| --- | --- | --- |
| Home | `https://igood.tw/` | Homepage layout, navigation, category system, ranking sections, footer |
| Water cooling fan article | `https://igood.tw/posts/2358` | Full product guide article structure, table blocks, product schema, FAQ |
| About | `https://igood.tw/about` | Brand promise, editorial positioning, company identity |
| Team | `https://igood.tw/our-team` | Multi-author/persona system |
| Recommendation method | `https://igood.tw/how-we-recommend` | Public trust/methodology page |
| Reviews category | `https://igood.tw/categories/reviews` | Archive/listing UX for review content |
| Author page | `https://igood.tw/author/louise` | Author profile and author archive pattern |

## High-level identity

iGood positions itself as a Taiwan shopping decision site, not only a coupon or deal site. Its homepage meta description frames the site as a shopping encyclopedia: product knowledge, purchase considerations, product comparisons, review recommendations, and high CP value shopping.

The visible promise is simple:

- many product choices create confusion;
- iGood reduces that confusion with selection knowledge and comparisons;
- articles cover category knowledge, product picks, online opinion, review recommendations, and practical shopping context;
- the reader should leave knowing what fits their need and budget.

This is close to the site direction we want, but our public positioning should be more precise:

- TREND - Jacob is not a direct-test lab like Wired or a heavy hands-on review outlet.
- TREND - Jacob should be a review, spec, price, warranty, seller, and complaint-pattern buying decision site.
- The reader-facing promise should be: "I compare public specs, live/known price context, warranty/return paths, seller information, and repeated user-review complaints so readers can avoid the confusing parts of buying."

## Site architecture

### Header and main navigation

iGood uses a broad category navigation model. The homepage exposes a logo, a price-radar link, a category menu, and an about menu.

Top-level shopping/category routes:

| Label | Route pattern | Role |
| --- | --- | --- |
| `iGood 降價雷達` | `/categories/igood-radar` | Deal/price radar entry |
| `3C 用品` | `/categories/techs` | Electronics and tech |
| `傢俱寢具` | `/categories/furniture-bedding` | Furniture and bedding |
| `商品快報` | `/categories/product-news` | Fast product news |
| `家電` | `/categories/appliances` | Appliances |
| `寵物` | `/categories/pet-supplies` | Pet products |
| `廚房用品` | `/categories/kitchenwares` | Kitchenware |
| `日用品` | `/categories/daily-necessities` | Daily necessities |
| `母嬰用品` | `/categories/baby-care-products` | Baby and childcare |
| `生活小物` | `/categories/lifestyles` | Small lifestyle products |
| `生活知識` | `/categories/knowledge` | Practical knowledge and issue-led articles |
| `編輯提案` | `/categories/ideas` | Editorial curation |
| `美妝保養` | `/categories/beauty-care` | Beauty and skincare |
| `開箱評測` | `/categories/reviews` | Unboxing/reviews |
| `食品` | `/categories/foods` | Food |

About/company routes:

| Label | Route |
| --- | --- |
| `關於我們` | `/about` |
| `我們的團隊` | `/our-team` |
| `產品推薦方式` | `/how-we-recommend` |
| `最新消息` | `/categories/news` |

The important reference is that iGood does not hide category breadth. It makes broad lifestyle/product categories explicit. For us, this supports a global trend guide taxonomy, but our labels should stay product-decision focused, for example:

- Trends
- Electronics
- Home
- Beauty
- Health
- Food
- Travel
- Outdoor
- Deals
- Buying Guides
- Reviews

### Search

Structured data includes a Website `SearchAction` route using `/search/{search_term_string}`. This means site search is part of the SEO and UX model, not only a visual control.

For TREND - Jacob, search should eventually index:

- article titles;
- product names;
- category tags;
- marketplace names;
- use cases;
- repeated complaint terms.

## Homepage structure

iGood's homepage is a magazine-style shopping portal. It is not a landing page with a large hero pitch. It is content-first.

Observed homepage flow:

| Section | What it does | Reference value |
| --- | --- | --- |
| Header/navigation | Logo, category menu, about links, price radar | Makes site scope obvious |
| Featured/current cards | Top row of current product-led posts | Fast freshness signal |
| `開箱評測` | Review/unboxing cards with image, category, title, excerpt, more link | Shows product experience content early |
| `熱門文章` | Ranked popular articles from 1 to 8 | Strong internal discovery and social proof |
| `近期文章` | Recent article grid/list | Freshness and crawl depth |
| `生活知識` | Issue and knowledge-led articles that bridge to product needs | Very relevant to our trend-to-product model |
| `好特務` | Sponsored/campaign-like section | Monetization/content partnership slot |
| Footer | Disclosure, about links, policy links, group links | Trust and compliance layer |

The strongest pattern for our homepage:

1. Current trend-led article list.
2. Popular buyer guides.
3. Recent posts.
4. Category sections.
5. Short footer trust/disclosure and legal links.

iGood proves that a shopping guide homepage can be dense and content-forward without needing many decorative cards. It uses repeated article cards, ranked lists, and clear section headings.

## Footer and trust layer

iGood's footer is doing more than copyright. It is a trust, disclosure, corporate, policy, and network layer.

Footer elements observed and requested for tracking:

| Footer item | Public meaning |
| --- | --- |
| `隨時關注好物推薦` | Follow/subscribe social prompt |
| `聯繫我們` | Contact entry |
| `關於iGood` | About group heading |
| `關於我們` | About page |
| `最新消息` | News/category updates |
| `產品推薦方式` | Methodology/trust page |
| `我們的團隊` | Team/persona proof |
| `集團介紹` | Corporate group page |
| `加入我們` | Recruiting |
| `合作洽談` | Partnership/business contact |
| `條款與政策` | Policy group heading |
| `隱私條款` | Privacy policy |
| `使用條款` | Terms of use |
| `廣告內容政策` | Advertising content policy |
| `逛逛iGood` | Browse group heading |
| `熱門文章` | Popular posts archive |
| `開箱評測` | Reviews category |
| `近期文章` | Recent posts archive |
| `使用者觀點` | User perspective content |
| `tnl media group` | Parent/network trust signal |
| `© 2026 Polydice, Inc. & TNL Mediagene` | Corporate copyright |
| `Business Insider Taiwan` | Network link |
| `Cool3c` | Network link |
| `iGood` | Current brand link |
| `INSIDE` | Network link |
| `ROOMIE Taiwan` | Network link |
| `愛料理` | Network link |
| `運動視界` | Network link |
| `關鍵評論網` | Network link |

iGood also places an affiliate/commercial disclosure in the footer. The practical point is not to make the disclosure huge inside every article. The footer can carry site-wide disclosure, while article-level outbound buttons can carry concise wording when needed.

For TREND - Jacob:

- Footer should include `About Jacob`, `How recommendations work`, `Contact`, `Privacy Policy`, `Terms of Use`, `Advertising and Affiliate Policy`, `Popular Posts`, `Reviews`, `Recent Posts`.
- We do not need a fake media group layer.
- If no real company/group exists, do not invent one.
- Affiliate disclosure should be concise and reader-facing, for example: "Price buttons may be affiliate links."

## About page model

iGood's about page has a clear public story:

1. The market has too many products.
2. Readers do not know how to choose.
3. iGood identifies shopping pain points.
4. Editors use product knowledge, comparison, review evaluation, and recommendations.
5. It covers 10+ categories and many recommended items.
6. It emphasizes clear text and tables.
7. It says recommendations are editorially independent and collaborations are disclosed.
8. It uses best-seller data, forum comments, and real-use opinion.
9. It offers recommendations, unboxing/testing, and expert interviews.
10. It anchors the company to Polydice and TNL Mediagene.

For us, the equivalent page should avoid claiming direct testing unless we actually tested. A better TREND - Jacob about frame:

> TREND - Jacob tracks fast-moving search interest and turns it into practical buying guides. Jacob compares public specs, price changes, seller terms, marketplace differences, warranty routes, and repeated user-review complaints so readers can decide what to buy, what to skip, and what to verify before clicking a price button.

## Recommendation-method page model

iGood has a dedicated public methodology page. This matters because it lets individual article pages stay useful and not overstuffed with process explanations.

Observed methodology themes:

| Theme | What iGood says publicly | How we should adapt |
| --- | --- | --- |
| Clear principles | Product articles explain what to check before the picks | Our article intros and checklists should explain the actual buyer variables |
| Readability | Tables and text make the buying decision easier | Keep comparison tables tight and scannable |
| Consistency | Article sections follow a repeatable guide structure | Use stable article fields, but prose must be generated per post |
| Buzz/popularity | Forums, ecommerce rankings, and online opinions inform candidates | Use SERP, trend, marketplace, review, and complaint signals internally |
| User opinions | Real user comments are referenced | Summarize repeated complaints and praise patterns |
| Order is not pure ranking | Products are grouped by feature/use case | Our ranking can be explicit, but every rank needs a reason |
| Editorial independence | Commercial links do not directly decide recommendations | Keep affiliate matching separate from suitability scoring |
| First-hand experience | iGood uses user interviews/blogger unboxing for some content | We should be transparent if our basis is public specs/reviews rather than hands-on tests |

Important boundary for our project:

- Public articles should not say "we checked SERP/provider/Search Console/LLM signals."
- Those are internal inputs.
- Public articles should show the outcome: price, specs, who fits, who should avoid, complaints, warranty, return risk, seller/marketplace fit.

## Team and author/persona system

iGood's strongest reference point is the multi-persona editorial system. The team page is not just a list of names; it gives each writer a visible domain angle.

Team groups:

| Group | Examples | Function |
| --- | --- | --- |
| Founders | dlackty, Fox | Company/founding credibility |
| Official editorial identities | `愛好物編輯`, `商品快報`, `精選轉載`, `精選書摘` | Non-personal publishing channels |
| iGood editors | Celia, Chi, Clare, Fannie, Jourdan, Krystina, Louise, Luna, Mina, Phoebe, Sofia, Sophie, Stella, Ting, Yang | Distinct editor/persona proof |
| Resident writers | Food, travel, family, kitchen, lifestyle creators | Specialist and real-life-use personas |
| External media | Cool3C, every little d, health media, Roomie, Stacker | Syndication and authority extension |
| Sponsored/partner identity | `好特務` | Commercial/sponsored content channel |

Persona examples worth adapting conceptually:

| Persona type | iGood example pattern | Useful takeaway |
| --- | --- | --- |
| Budget/student buyer | Student/small-budget perspective | Good for low-cost gadget, dorm, travel posts |
| Category researcher | Editor who researches before buying | Good for spec/review synthesis persona |
| Kitchen/home expert | Homemaker/mother/kitchen appliance angle | Good for appliance and household content |
| Sleep/product specialist | Years of sleep product research | Good for category expertise pages |
| Forum-heavy buyer | Editor who checks forums before buying | Good for complaint-pattern articles |
| Ecommerce/marketing editor | Ecommerce integration and unboxing experience | Good for marketplace risk and sales-copy skepticism |

For TREND - Jacob:

- Jacob can be the lead brand persona.
- Category sub-personas can exist as content-generation voices, but they should not be fake named experts unless we intentionally build those profiles.
- Safer model: "Jacob, electronics buying editor", "Jacob, home cooling guide", "Jacob, supplement label guide" as category modes.
- If we add author pages, each author/persona page must state evidence basis clearly: public specs, price snapshots, warranty/return terms, marketplace listing checks, review-pattern analysis.

## Author pages

The Louise author page shows a useful pattern:

- breadcrumb: Home > Team > Author;
- author image;
- role label;
- author name;
- short bio;
- article archive by that author;
- same site sidebar/footer system as other pages.

This gives every article a credibility path. The author card in `posts/2358` links readers back to Louise's profile.

For our site:

- Article pages should show an author card for Jacob.
- Author card should be short and factual.
- It should not overclaim "tested everything."
- It should say Jacob compares public product evidence, marketplace information, and review patterns.
- Author page should list Jacob's posts by category and recent updates.

## Category and archive pages

The `開箱評測` category page is a standard archive with:

- breadcrumb;
- category title;
- short category description;
- article cards with image, category, title, excerpt, and tags;
- ad/content slots interleaved;
- sidebar sections such as popular/recent posts;
- footer.

The category description is important. It tells readers what kind of content belongs there. For us, category pages should explain the buying decision frame, for example:

- Electronics: chargers, batteries, smart devices, fake specs, connector/compatibility checks.
- Home: cooling, cleaning, small appliances, size/noise/warranty checks.
- Beauty: ingredient claims, skin type fit, review complaints, seller authenticity.
- Health/iHerb: label, dosage, third-party testing, contraindication warnings, not medical advice.
- Travel: adapters, bags, portable gear, airline/region compatibility.

## Technical HTML/CSS observations

### Rendering stack signals

Observed technical signals:

| Signal | Observation | Interpretation |
| --- | --- | --- |
| Framework | Next.js script chunks include route-level app chunks such as `/app/posts/[postId]/page` | Likely Next.js App Router frontend |
| `__NEXT_DATA__` | Not found in inspected post HTML | Uses newer app/router/RSC-style payload rather than classic pages data |
| Sentry markers | Hundreds of Sentry-related markers in rendered HTML/scripts | Production error monitoring is integrated |
| WordPress traces | CSS and classes such as `wp-table-builder`, `wp-block`, uploads paths | Content likely comes from WordPress/editorial CMS blocks or migrated WP content |
| Product links | Many `momoshop` links in article HTML/schema | Marketplace monetization is embedded |
| JSON-LD | Organization, Website/SearchAction, Article, Breadcrumb, Product schemas | Strong structured-data layer |

### CSS files

The post page loads several CSS resources:

| CSS file | Approx. size | Purpose inferred |
| --- | ---: | --- |
| `/_next/static/css/1ab1fc1868cad013.css` | 34 KB | App/global layout and utilities |
| `/_next/static/css/8b699656505cf4b3.css` | 21 KB | Post/content specific styles |
| `/css/blocks.style.build.css` | 76 KB | WordPress block styles |
| `/css/wp-table-builder-frontend.css` | 14 KB | Product/comparison table builder styles |

Frequent class families:

| Class/pattern | Meaning |
| --- | --- |
| `wptb-*` | WP Table Builder product-card and comparison-table layout |
| `wp-block-*` | WordPress block content |
| `post-content` | Article body styling boundary |
| `post-recommendation` | Product recommendation area |
| `ub_table-of-contents` | Table-of-contents block |
| Tailwind-like utilities | Layout spacing, flex, text size, border, rounded controls |

Reference lesson:

- iGood's article detail pages are not just freeform prose.
- Product articles are block-driven content.
- Tables, cards, FAQ, product schema, author cards, and sidebars are modular.
- Our React components should render structured fields, but the actual recommendation prose must come from the article data layer.

## Structured data

The inspected article exposes multiple JSON-LD objects:

| Schema type | What it covers | Why it matters |
| --- | --- | --- |
| Organization | `寶利拾股份有限公司` / Polydice, parent group TNL Mediagene | Entity trust |
| Website | Site URL and search action | Search integration |
| Article | Headline, description, URL, published/modified dates, article body | Article indexing |
| BreadcrumbList | Home > category > article | Site hierarchy |
| Product | Each recommended product with brand/name/image/offer | Product-rich result eligibility and machine-readable picks |

For TREND - Jacob, the structured-data target should be:

- Organization or Person, depending legal setup;
- Website with SearchAction;
- Article or BlogPosting;
- BreadcrumbList;
- ItemList for top 10 picks;
- Product schema only where product information is sufficiently stable and not misleading;
- Offer data only when price, currency, availability, and destination URL are controlled or refreshed.

## Detailed article teardown: `posts/2358`

Article title:

`2026年10款水冷扇推薦：夏日避暑好夥伴！省電、清涼、好移動的水冷扇都在這`

The article is a "best 10 product guide" for water-cooling fans. It is a good reference because it combines:

- an issue context: hot summer and cooling needs;
- category education: what a water-cooling fan is;
- comparison against a nearby category: portable AC;
- buyer criteria;
- top 10 product picks;
- product blocks;
- a master comparison table;
- FAQ;
- limiting conclusion;
- author card;
- related/popular/recent content;
- footer trust layer.

### Article flow

| Order | Section | Function |
| ---: | --- | --- |
| 1 | H1 title | Search-targeted title with year, quantity, category, benefit |
| 2 | Intro | Frames summer heat, fan weakness, AC electricity concern, water-cooling fan as option |
| 3 | `什麼是水冷扇？跟移動式冷氣差在哪？` | Explains category and compares with portable AC |
| 4 | Comparison table | Water-cooling fan vs portable AC: pros, cons, suitable environment |
| 5 | `水冷扇怎麼挑？4 個選購眉角看這邊` | Buyer criteria before product list |
| 6 | Criteria h3 sections | Size, tank capacity/removable tank, modes, mobility |
| 7 | `精選 10 款清涼水冷扇推薦` | Product recommendation entry |
| 8 | `普通水冷扇推薦` | Segment: normal-size units |
| 9 | Six product blocks | Product cards with image, rank, title, model, price, links, narrative, specs |
| 10 | `桌上型／迷你型水冷扇推薦` | Segment: desktop/mini units |
| 11 | Four product blocks | Same product-card pattern |
| 12 | `10 款水冷扇推薦一覽表` | Full comparison table |
| 13 | `水冷扇常見問題` | FAQ objections and maintenance questions |
| 14 | `小結：水冷扇降溫能力有限` | Final caveat and realistic expectation |
| 15 | Author card | Louise bio and author link |
| 16 | Tags/sidebar/footer | Internal discovery and trust layer |

### Heading map

Important headings:

| Heading | Role |
| --- | --- |
| `什麼是水冷扇？跟移動式冷氣差在哪？` | Category definition and adjacent-category comparison |
| `水冷扇怎麼挑？4 個選購眉角看這邊` | Buying checklist before recommendations |
| `1.留意體積大小` | Size/use-space criterion |
| `2.水箱容量、水箱可不可拆` | Tank and maintenance criterion |
| `3.有沒有多樣化的功能模式` | Modes/features criterion |
| `4.移動便利性` | Portability criterion |
| `精選 10 款清涼水冷扇推薦` | Top-list entry |
| `普通水冷扇推薦` | Segment heading |
| `桌上型／迷你型水冷扇推薦` | Segment heading |
| `10 款水冷扇推薦一覽表` | Full comparison table |
| `水冷扇常見問題` | FAQ |
| `小結：水冷扇降溫能力有限` | Final caveat |

This flow is important because it teaches before it sells. The article does not open directly with a grid of products. It first tells the reader what the category can and cannot do.

## Product block anatomy

Each product recommendation is built like a mini landing block.

Observed fields:

| Field | Example role |
| --- | --- |
| Product image | Visual identification |
| Rank number | Creates top 10 structure |
| Product title | Brand/product name |
| Model | Exact model identifier |
| Price | Price anchor |
| Purchase links | Marketplace/official outbound actions |
| Short subtitle | One-line reason or positioning |
| Narrative paragraph | Why this product is included |
| Spec bullets | Water tank, power, size, weight, origin, warranty, functions/accessories |
| Link button/anchor | Monetization path |

The full comparison table repeats normalized fields across all 10 products:

- product name;
- model;
- price;
- water tank capacity;
- power;
- dimensions and weight;
- origin;
- warranty;
- feature/accessory notes;
- purchase link.

### Products found in article schema

| Rank | Brand | Product/model | Listed price signal |
| ---: | --- | --- | ---: |
| 1 | 日虎 | `LA-3036 瞬冷移動 DC 變頻水冷扇` | 12800 |
| 2 | THOMSON | `TM-SAF16 極致美型空氣濾淨降溫微電腦水冷扇` | 4690 |
| 3 | HERAN 禾聯 | `HWF-07ND020 負離子移動式水冷扇` | 3590 |
| 4 | 尚朋堂 | `SPY-E200 微電腦觸控水冷扇` | 4290 |
| 5 | LAPOLO | `LA-6503 水冷扇` | 2990 |
| 6 | 勳風 | `AHF-K0098 冰晶水冷扇涼風扇移動式水冷氣-水冷+冰晶` | 2980 |
| 7 | 大家源 | `TCY-890101 桌上型 USB 冰涼水冷扇` | 2990 |
| 8 | Evapolar | `evaCHILL 第三代隨身個人冷氣機` | 4499 |
| 9 | KINYO | `UF-1908 復古冰冷風扇` | 999 |
| 10 | THOMSON | `TM-SAF15U 隨身移動式水冷扇` | 1690 |

The product schema is useful, but there is a risk for our site: product prices and availability change quickly. If we output `Product` and `Offer` schema, our pipeline needs a refresh rule or a clear snapshot date.

## FAQ and caveat strategy

iGood's FAQ covers the objections a buyer would naturally have:

- Why does a water-cooling fan not feel cold?
- Does it use much electricity?
- Is it noisy?
- Does it need maintenance?
- How should it be cleaned?
- Which environments are suitable or unsuitable?
- Does it purify air?
- How can the cooling effect improve?

The final conclusion is especially useful because it limits the claim. It says the category has limited cooling ability and is not a full replacement for stronger cooling in every environment.

For TREND - Jacob, every category guide should include this kind of "when this breaks" section. This is more useful than generic SEO filler.

Examples:

- Portable AC: do not buy if you cannot vent a hose or return shipping is expensive.
- GaN charger: do not buy if the listing hides port wattage split or certification is unclear.
- iHerb supplement: do not buy if dosage, interactions, or third-party testing are unclear.
- Beauty product: do not buy if the ingredient risk does not fit your skin type.

## What iGood does especially well

1. It makes broad shopping categories easy to browse.
2. It gives every article a category and tag context.
3. It uses author/team pages to create visible editorial identity.
4. It puts methodology on a separate page, keeping articles more reader-focused.
5. It uses tables heavily, which helps scanning.
6. It uses FAQ and conclusion sections to answer objections.
7. It exposes structured data for articles, breadcrumbs, website search, and products.
8. It has a footer with contact, methodology, privacy, terms, ad policy, team, and network links.
9. It mixes issue-led content and product-led content on the homepage.
10. It has archives for reviews, recent posts, popular posts, categories, and author pages.

## Gaps we can improve beyond iGood

iGood is a strong reference, but our site can be more useful in buyer-decision blocks.

Observed gaps/opportunities:

| Gap | Why it matters | Our improvement |
| --- | --- | --- |
| Product narratives often explain why included but do not always say who should avoid | Readers need negative-fit guidance | Add "Who should not buy this" |
| Repeated review complaints are not always isolated as a field | Review mining is a major buyer value | Add "Repeated complaints" per product |
| Warranty/return route exists in specs but is not always interpreted | Cross-market buying risk depends on return path | Add warranty/return explanation |
| Price is shown, but price movement/marketplace spread is limited | Affiliate products vary by country and marketplace | Add final shipped price, price snapshot, marketplace comparison |
| Product order can be category grouping rather than true ranking | Reader may misunderstand order | Make rank logic explicit or label by use case |
| Product schema includes offer prices that can age | SEO risk if stale | Add refresh date and data freshness controls |
| Direct testing language may not fit our model | We should not overclaim | Use public evidence/review-pattern disclosure |

## TREND - Jacob adaptation

### Site positioning

Recommended public positioning:

> TREND - Jacob tracks fast-moving search interest and turns it into practical buying guides. Jacob compares public specs, prices, warranty routes, seller terms, marketplace differences, and repeated review complaints so readers can decide what to buy, what to skip, and what to verify before checkout.

Avoid:

- claiming hands-on testing when we did not test;
- saying the public article was selected by SERP/LLM/provider workflow;
- exposing internal trend-scoring or affiliate-matching language;
- filling product notes with generic repeated template prose.

### Article flow for us

Recommended article page structure:

| Order | Section | Purpose |
| ---: | --- | --- |
| 1 | Title | Trend + buyer category + year or freshness |
| 2 | Intro | What issue is moving now, why readers care |
| 3 | Quick answer | Bridge issue to product decision |
| 4 | Top 10 practical picks | Immediate product direction |
| 5 | Quick comparison table | Rank, pick, best for, key check, price, action |
| 6 | In-depth notes on all 10 picks | Generated Jacob/category expert prose |
| 7 | Top 3 recommendations | Personal/editorial conclusion, with links |
| 8 | Final thoughts | Practical final guidance and caveats |
| 9 | Before-you-buy checklist | Buyer-facing checks only |
| 10 | FAQ | Stable category objections and marketplace questions |

This matches the user's desired flow:

1. detect country/trend;
2. create trend keywords;
3. inspect ranking pages and SEO blog structures internally;
4. analyze top structures internally;
5. decide product connection internally;
6. decide the article angle internally;
7. publish a reader-facing article that contains issue explanation, practical picks, comparison, product notes, and buying guidance;
8. upload/publish.

Only step 7 should be visible to readers.

### Product block model

Each product block should render structured data generated by the content/data layer.

Required public fields:

| Field | What it should answer |
| --- | --- |
| Rank/use-case label | Why this product appears in the list |
| Product name and exact variant | What exact listing/model the reader should compare |
| Price snapshot | What price range or final shipped price was observed |
| Best for | Who this fits |
| Why recommend | Practical reason to consider it |
| Who should not buy | Negative-fit guidance |
| Repeated complaints | Review-pattern summary, not raw review dump |
| Specs that matter | Only buyer-relevant specs |
| Warranty/return route | What happens if it fails or arrives wrong |
| Marketplace note | AliExpress/Temu/Amazon/iHerb/local marketplace fit |
| Action link | Opens in a new tab through our affiliate/outbound tracking route |

The four fields the user requested should be mandatory:

1. Why recommend this?
2. Who does it fit?
3. Who does it not fit?
4. What complaints repeat in reviews?

### Content generation rule

React components should not hardcode article prose. They should only render fields.

Generated per-post prose should include:

- intro;
- quick answer;
- product-list intro;
- comparison note;
- individual product takes;
- pros and cons;
- top 3 recommendations;
- final thoughts;
- buying checklist;
- FAQ answers, if not manually curated.

The LLM/category persona should write using evidence fields:

- public specs;
- output/benefit claims;
- current or snapshot price;
- marketplace and seller;
- warranty/return route;
- shipping/import risk;
- repeated positive review patterns;
- repeated complaints;
- known compatibility issues;
- use-case fit.

Visible text should sound like a natural buying editor, not like a checklist renderer.

### Author/persona model

Recommended minimal public author system:

| Page/element | Content |
| --- | --- |
| Author card | Jacob, TREND - Jacob editor, focuses on trend-led buying decisions using specs, price, seller terms, and review patterns |
| Author page | Bio, evidence basis, categories covered, recent articles |
| Method page | Explain how recommendations use public specs, marketplace data, user-review patterns, and price/return checks |
| Category mode | Electronics, Home, Beauty, Health, Food, Travel, Outdoor |

Do not invent fake doctors, engineers, or direct-test specialists unless we have real collaborators.

### Footer model for us

Recommended footer groups:

| Group | Links |
| --- | --- |
| About TREND - Jacob | About Jacob, How recommendations work, Team/Authors if real, Contact |
| Policies | Privacy Policy, Terms of Use, Advertising and Affiliate Policy, Do Not Sell or Share if relevant |
| Browse | Trends, Popular Posts, Reviews, Recent Posts, Categories |
| Disclosure | Short affiliate disclosure and copyright |

Footer should be compact. It should not create a fake corporate network.

## UI/layout notes to carry forward

1. Homepage should be content-first: no oversized hero, no unnecessary marketing copy.
2. Category menu should be obvious and mobile-friendly.
3. Article cards need image, category, title, short excerpt, and tags.
4. Popular articles should be ranked visually.
5. Product guide pages need real tables, not decorative cards only.
6. Product detail blocks should be readable on mobile.
7. Top 3 recommendations can use medal/rank visuals and linked product names.
8. Pros and cons should be visually distinct.
9. Price/action buttons should open in a new tab.
10. Footer legal/disclosure links should be present from the first public version.

## Data model checklist for implementation

Article-level fields:

- `title`
- `slug`
- `category`
- `tags`
- `author`
- `publishedAt`
- `updatedAt`
- `trendIssueIntro`
- `quickAnswer`
- `productListIntro`
- `comparisonIntro`
- `topThreeIntro`
- `finalThoughts`
- `beforeYouBuyChecklist`
- `faq`
- `schemaMetadata`

Product-level fields:

- `rank`
- `productName`
- `exactVariant`
- `brand`
- `marketplaces`
- `primaryActionUrl`
- `imageUrl`
- `priceSnapshot`
- `currency`
- `snapshotDate`
- `bestFor`
- `keyFeatures`
- `whyRecommend`
- `whoFits`
- `whoDoesNotFit`
- `repeatedComplaints`
- `pros`
- `cons`
- `specs`
- `warranty`
- `returnPath`
- `sellerRisk`
- `shippingRisk`
- `affiliateDisclosure`

Internal-only fields:

- trend source;
- trend score;
- SERP provider;
- Brave API result IDs;
- Search Console signals;
- LLM generation prompt;
- affiliate fit score;
- monetization availability;
- evidence pack IDs.

These internal fields should not render as public article sections.

## Concrete article template inspired by iGood but adapted for us

```text
Title

Intro:
Explain the issue/search spike/weather/event/lifestyle change and why the reader has a buying problem now.

Quick answer:
Translate the issue into the product category and the exact checks that matter.

Top 10 practical picks:
Ranked list with product image, name, best-for, price snapshot, and action.

Quick comparison table:
Rank, pick, best for, key check, price, action.

In-depth notes on all 10 picks:
For each product:
- key features
- why recommend
- who fits
- who does not fit
- repeated complaints
- pros
- cons
- warranty/return note

My personal top 3 recommendations:
Short expert conclusion for #1, #2, #3 with linked product names.

Final thoughts:
When to buy, when to wait, when to choose another category.

Before-you-buy checklist:
Buyer-facing checks only.

FAQ:
Category and marketplace questions.
```

## Final reference conclusion

iGood's reference value is not only design. The real system is:

- broad category navigation;
- dense content-first homepage;
- public trust pages;
- author/persona pages;
- block-driven article detail pages;
- product schema;
- comparison tables;
- practical FAQ;
- final caveat section;
- footer policy and disclosure layer.

For TREND - Jacob, the winning adaptation is to keep the same reader-friendly guide structure, but improve product usefulness with sharper decision fields:

1. why recommend;
2. who fits;
3. who does not fit;
4. repeated review complaints;
5. exact variant;
6. final price or price snapshot;
7. warranty/return path;
8. marketplace risk;
9. concise action button.

That lets the site be honest about not being a direct-test lab while still giving stronger buying help than a generic affiliate list.

