맞아. 여기서는 방향을 조금 수정하는 게 맞아.

**“테스트 안 했습니다”를 매번 강조하는 쪽으로 가면 안 돼.**
그건 방어는 되지만, 매거진처럼 보이는 힘이 약해져. 정답은 네 말대로 **직접 테스트했다는 말을 안 하면 되는 것**이고, 대신 UI/글 구조는 **Ideal Home처럼 편집형 구매가이드 매거진**으로 밀어붙이면 돼.

즉 공개 문구는 이렇게 가야 해.

```text
나쁜 방향:
We did not test this product.
We are not a testing lab.
This is desk research.

좋은 방향:
Editor’s verdict
Why it’s in the list
Specifications
Today’s best routes
Reasons to buy
Reasons to avoid
Buyer notes
Source review
Repeated buyer complaints
```

“테스트 안 함”은 **Method / Quality Gate 내부 원칙**에만 남기고, 독자가 보는 화면에서는 그냥 **편집자가 고른 구매 판단 글**처럼 보여야 해. 기존 피드백의 hard gate도 본질은 “직접 테스트하지 않았는데 테스트했다고 쓰지 말라”는 것이지, 공개 본문마다 테스트 안 했다고 고백하라는 뜻이 아니었어.

---

# 1. Ideal Home 벤치마킹 핵심

Ideal Home portable AC 페이지는 단순히 예쁜 게 아니라, **상위 쇼핑 매거진 문법**을 거의 다 갖고 있어.

상단부터 보면 구조가 이렇다.

```text
메가 네비게이션
→ Trending
→ Jump to category
→ Breadcrumb
→ H1
→ 짧은 dek
→ 작성자 / 업데이트일 / 기여자
→ 제휴 고지
→ Hero image
→ Jump to category 반복
→ Share / Newsletter / Google preferred source
→ Recent updates
→ 현재 재고/구매처 안내
→ The quick list
→ 제품 상세 섹션
→ 비교표
→ 구매 시점/고르는 법/테스트 방식
→ 관련글/작성자/카테고리 클러스터
```

Ideal Home의 article 상단은 H1, byline, last updated, contributors, affiliate disclosure가 한 덩어리로 붙어 있고, 그 직후 hero image와 jump navigation이 이어진다. 이 구조가 “글”이 아니라 “편집된 구매가이드”처럼 보이게 만든다. ([Ideal Home][1])

또 좋았던 건 **Recent updates → 재고/구매처 → quick list** 순서야. 해당 페이지는 6월 26일 업데이트로 재고 부족 상황을 먼저 설명하고, Amazon, Appliances Direct, 대체상품 같은 구매 루트를 제시한 뒤, 바로 “The quick list”로 넘어간다. 즉 검색자가 지금 가장 급한 문제인 “지금 어디서 살 수 있나?”를 상품 상세보다 먼저 해결한다. ([Ideal Home][1])

제품 블록도 매우 강하다. “Best overall” 섹션은 제품 이미지 여러 장, 제품명, 한 줄 포지션, expert review link, Amazon 평균 리뷰, specifications, Today’s Best Deals, Reasons to buy, Reasons to avoid, 상세 설명, full review link, 가격 위젯으로 구성된다. 이게 바로 우리가 가져와야 할 UI 문법이다. 단, TrendBrief는 `Our expert review`나 `we tested` 표현만 피하고, 그 자리에 `Editor’s verdict`, `Source review`, `Buyer notes`, `Review signals`를 넣으면 된다. ([Ideal Home][1])

Ideal Home 전체 사이트도 홈/룸/가든/리노베이션/House Manual/What to buy/Browse 같은 큰 정보 구조가 있고, `What to buy` 아래에 By Product, By Brand, How We Test Products가 분리되어 있다. 이건 SEO적으로도 “이 사이트는 구매가이드 카테고리를 진짜 운영한다”는 표면이 된다. ([Ideal Home][1])

그리고 네가 말한 작성자 구조도 맞아. Ideal Home은 홈페이지에서 여러 명의 전문가/에디터를 노출하고, 작성자 페이지에는 직함, 담당 분야, 경력, 개인 소개, 최신 글 목록이 붙는다. Sarah Handley 페이지를 보면 “Renovation and Home Energy Editor”라는 역할과 담당 영역, 최신 글 archive가 명확하다. ([Ideal Home][2])

---

# 2. 지금 우리 레포와 비교하면

현재 레포는 방향은 잘 잡혔지만, **Ideal Home식 매거진 표면은 아직 약하다.**

README 기준으로 TrendBrief는 이미 “fast-moving trends buyer notes” 브랜드로 정의되어 있고, Jacob이 operator/author로 되어 있다. 그런데 이 구조는 아직 개인 블로그 느낌이 강하다. 네가 말한 것처럼 **TrendBrief 팀 + 카테고리별 편집자 + Jacob은 마켓플레이스/트렌드 리서치 담당**으로 바꾸는 게 더 자연스럽다. ([GitHub][3])

현재 `ArticlePage.tsx`도 H1, Updated, By Jacob, summary, affiliate disclosure 정도가 상단에 잡히는 구조라서, Ideal Home처럼 byline/contributors/jump/recent update/hero/quick list가 촘촘하게 쌓인 매거진형 상단은 아직 아니다. ([GitHub][4])

반면 데이터 모델은 이미 꽤 좋다. `Article`에는 trendSignalBox, marketplaceRule, countryBuyingRoutes, avoidList, sections, faqs, expertCopy 같은 필드가 있고, `Product`에는 exactVariant, sourceUrl, reviewSourceUrl, priceState, regionFit, returnRisk, evidenceLevel, repeatedComplaints, editorialPros/Cons 같은 구매 판단 필드가 충분히 들어가 있다. 즉 **데이터는 이미 매거진형 UI를 만들 재료가 있고, presentation layer만 Ideal Home식으로 갈아엎으면 된다.** ([GitHub][5])

`article-type-content-parts.tsx`에도 TrendSignalBox, MarketplaceRule, TopThreeRecommendations 같은 조각은 이미 있다. 다만 현재는 Ideal Home의 “The quick list → product detail card → Today's best deals → reasons to buy/avoid” 같은 강한 commerce magazine rhythm으로 정리되지는 않은 상태야. ([GitHub][6])

---

# 3. SEO 상위권 조건을 Ideal Home식으로 풀면

SEO 상위 조건은 “글이 길다/깔끔하다/광고가 많다”가 아니고, 아래가 겹치는 거야.

```text
1. 검색 의도와 정확히 맞는 제목/H1
2. 상단에서 바로 답을 주는 quick answer
3. 작성자/편집자/기여자 신뢰 표면
4. 최신 업데이트와 재고/가격/구매처 정보
5. quick list로 빠른 판단 제공
6. 제품별 specs / deals / pros / cons / 상세 판단
7. 비교표
8. 구매 가이드와 FAQ
9. 관련글/카테고리 내부링크
10. 작성자 페이지와 카테고리별 전문 archive
```

Ideal Home이 강한 이유도 이 조합이야. portable AC 페이지 하나 안에 재고 업데이트, 구매처, quick list, 제품 상세, 비교표, 고르는 법, 관련 내부링크가 붙어 있고, 작성자 페이지는 같은 카테고리 글들을 계속 축적한다. ([Ideal Home][1])

---

# 4. 우리가 가져갈 문법

핵심은 이거야.

```text
Ideal Home:
Our expert review
Tried and tested
Our tester found
How we test

TrendBrief:
Editor’s verdict
Source review
Buyer notes
Specs checked
Review signals
Today’s best routes
Reasons to buy
Reasons to avoid
```

공개 화면에서 “우리는 테스트 안 했다”고 반복하지 말고, 그냥 **테스트 claim을 하지 않는다.**
그리고 외부 실제 리뷰가 있으면 “Read source review”로 연결해주면 된다.

---

# 5. Codex에 줄 Goal Prompt

아래 그대로 넘기면 돼.

````markdown
# Goal: Rebuild TrendBrief Article UI Into an Ideal Home-Inspired Shopping Magazine Layout

## Objective

Rework the TrendBrief article experience so it feels much closer to Ideal Home’s buying guide layout and editorial commerce style, especially:

- Ideal Home portable air conditioner buying guide
- Ideal Home homepage / experts / author pages
- Ideal Home-style product sections with quick list, specs, deal buttons, reasons to buy/avoid, and full-review/source links

Important:
Do not make TrendBrief keep saying “we did not test this.”  
The public site should simply avoid direct testing claims unless direct-use evidence exists.

TrendBrief should feel like an editorial shopping magazine, not a minimalist SaaS blog and not a fake testing lab.

---

## 0. Benchmark Summary

Use Ideal Home as the structural benchmark, not as a visual clone.

Observed Ideal Home patterns to replicate in TrendBrief’s own style:

1. Large editorial header/navigation
   - broad category nav
   - What to buy
   - By Product
   - By Brand
   - How we test / methodology
   - Newsletter / Subscribe / Search

2. Article top structure
   - breadcrumb
   - H1
   - dek / short standfirst
   - author avatar
   - byline
   - last updated
   - contributors
   - affiliate disclosure
   - hero image
   - jump-to navigation

3. Live shopping context
   - Recent updates near the top
   - stock / marketplace route section
   - “where to buy now” before product details

4. Quick list
   - short-on-time summary
   - product image
   - badge
   - rank
   - product name
   - short verdict
   - multiple CTA links
   - “Read more below” anchor

5. Product detail sections
   - product image/gallery
   - rank and badge
   - product name
   - one-line verdict
   - source review / full review link
   - average marketplace review where available
   - specifications block
   - Today’s best deals/routes
   - reasons to buy
   - reasons to avoid
   - body copy
   - full source review link
   - price/deal widget

6. Trust surface
   - author pages
   - category editors
   - contributors
   - author latest articles
   - methodology/about pages
   - related articles
   - category clusters

Do not copy Ideal Home CSS, assets, names, or exact text.
Implement a TrendBrief-native version of the same editorial commerce grammar.

---

## 1. Brand / Editorial Position

Change public positioning from “Jacob-only blog” to “TrendBrief editorial team.”

Public model:

- Brand: TrendBrief
- Content unit: Briefs
- Editorial desk: TrendBrief Editors
- Jacob: Marketplace Research Editor
- Future category editors:
  - Home & Climate Editor
  - Electronics Editor
  - Beauty & Supplements Editor
  - Travel & Outdoor Editor
  - Fashion & Lifestyle Editor

Public copy should not over-explain that TrendBrief is not a testing lab.
Instead:

- do not use direct testing claims unless true
- use editor-style verdicts
- cite source reviews where useful
- present specs, routes, review signals, complaints, and buyer risks confidently

Allowed public phrases:

- Editor’s verdict
- Why it’s in the list
- Buyer notes
- Source review
- Specs checked
- Review signals
- Today’s best routes
- Reasons to buy
- Reasons to avoid
- What to check before buying
- Full source review

Avoid unless direct-use evidence exists:

- We tested
- Tried and tested
- Our tester found
- Our expert review
- Hands-on tested by TrendBrief
- In-house product testing

---

## 2. Author / Editor System

Add a real author/editor model.

Create:

apps/web/lib/trend-site/authors.ts

Types:

```ts
export type AuthorRole =
  | "editorial-desk"
  | "marketplace-research-editor"
  | "category-editor"
  | "contributor";

export type AuthorProfile = {
  id: string;
  slug: string;
  name: string;
  role: string;
  roleType: AuthorRole;
  avatarUrl: string;
  shortBio: string;
  longBio: string;
  expertiseAreas: string[];
  coveredCategorySlugs: string[];
  localeCoverage: string[];
  methodologyNote: string;
  directUsePolicy?: string;
  sameAs?: string[];
  profilePath: string;
};
```
````

Initial authors:

```ts
trendbrief-editors
- name: TrendBrief Editors
- role: Editorial Desk
- owns final article standards, evidence labels, affiliate policy, and buyer-decision format

jacob
- name: Jacob Park
- role: Marketplace Research Editor
- covers trend signals, marketplace routes, exact variants, price status, repeated buyer complaints, shipping/return risk
```

Do not invent fake personal credentials, fake professional licenses, fake testing history, or fake photos.

---

## 3. Author Pages

Add routes:

```text
/authors/[slug]/
```

Initial pages:

```text
/authors/jacob/
/authors/trendbrief-editors/
```

Each author page must include:

- avatar
- name
- role
- short bio
- long bio
- covered categories
- how this author evaluates products
- latest published/indexable articles by this author
- related categories
- author JSON-LD / Person or ProfilePage schema where appropriate

Example Jacob positioning:

```text
Jacob Park
Marketplace Research Editor

Jacob tracks fast-moving product trends and turns them into buyer-decision briefs. His work focuses on marketplace routes, exact model variants, price status, repeated buyer complaints, shipping delays, warranty paths, and when a product should be treated as an accessory rather than a main recommendation.
```

---

## 4. Article Data Model Changes

Extend `Article` with editorial ownership.

Add:

```ts
authorId: string;
contributorIds?: string[];
editorIds?: string[];
primaryEditorId?: string;
reviewSourcePolicy?: "source-backed" | "direct-use" | "mixed" | "specs-first";
recentUpdate?: {
  date: string;
  body: string;
};
jumpLinks?: Array<{
  label: string;
  targetId: string;
}>;
relatedArticleIds?: string[];
latestCategoryArticleIds?: string[];
```

Rules:

- every public article must have `authorId`
- public author profile must exist
- contributor IDs must resolve
- author archive must only show published/indexable articles
- JSON-LD author must include author URL

---

## 5. Article Header Redesign

Replace the current simple header with an Ideal Home-inspired editorial header.

Current problem:
`ArticlePage.tsx` currently renders a minimal H1, updated line, byline, summary, and disclosure.

Target structure:

```tsx
<ArticleShell>
  <SiteHeader />
  <ArticleHeroHeader>
    <Breadcrumb />
    <ArticleLabel /> // Buying Guide / Trend Brief / Deals
    <H1 />
    <Dek />
    <BylineBlock />
    <AffiliateDisclosureInline />
    <HeroImage />
    <JumpToNav />
  </ArticleHeroHeader>
  <ArticleBodyLayout>
    <MainColumn />
    <RightRail />
  </ArticleBodyLayout>
</ArticleShell>
```

BylineBlock should display:

```text
By Jacob Park
Marketplace Research Editor

Product evidence by TrendBrief Editors
Last updated 30 June 2026
```

Affiliate disclosure should appear near byline, like:

```text
When you purchase through links on TrendBrief, we may earn a commission. Here’s how our links work.
```

Do not bury disclosure at the bottom.

---

## 6. Top-of-Article Flow

Implement this order for buying guide articles:

1. Breadcrumb
2. H1
3. Dek / standfirst
4. Byline / updated / contributors
5. Affiliate disclosure
6. Hero image
7. Jump-to nav
8. Recent update block
9. Trend signal block
10. Stock / marketplace route block
11. The quick list
12. Product detail sections
13. Comparison table
14. How to choose / buyer guide
15. What to avoid
16. FAQ
17. Update log
18. Author bio box
19. Related articles
20. Latest in category

---

## 7. Recent Update Block

Add `RecentUpdateBlock`.

Placement:

- after JumpToNav
- before TrendSignalBox

Design:

- compact bordered card
- small label: “Recent update”
- date in bold
- short body
- optional links

Example:

```text
Recent update
30/6: Heatwave stock is moving quickly in the UK, Germany, and France. We moved heavy compressor ACs toward local-retailer routes and kept AliExpress/Temu mainly for accessories.
```

This should not be the same as the full update log at the bottom.

---

## 8. Stock / Marketplace Route Block

Add a section inspired by Ideal Home’s “Where to find in-stock portable air conditioners.”

For TrendBrief:

```text
Where to check first
```

For each article, use the article’s `countryBuyingRoutes` and marketplace rules.

Design:

- short intro
- route list cards
- merchant buttons if available
- warning note

Example:

```text
UK
Check Amazon UK, Currys, Argos, AO, Screwfix, and manufacturer-direct pages before importing a heavy AC.

Germany
Check Amazon.de, MediaMarkt, Saturn, Bauhaus, OBI, and local manufacturer pages. Verify plug, window fit, and return pickup.
```

This should appear before product details.

---

## 9. Quick List Module

Replace or upgrade current Top 3/Top 10 summary with an Ideal Home-style “The quick list.”

Component:

```tsx
<QuickList />
```

Inputs:

- top 6–10 product recommendations
- rank
- badge
- image
- product name
- short verdict
- primary CTA
- optional secondary CTA
- read-more anchor

Design:

- dense card list
- mobile: stacked cards
- desktop: 2-column cards or vertical editorial list
- product image left/top
- badge above product name
- CTA button visible
- “Read more below” anchor

Public label:

```text
The quick list
Short on time? These are the most practical routes for this trend.
```

Each item:

```text
Best overall
1. Midea PortaSplit
Best for EU buyers who want real compressor cooling with local support.

View route
Read more below
```

Do not say “tested” unless the product evidence level is direct-use.

---

## 10. Product Detail Module

Rebuild product detail sections to match Ideal Home’s product block grammar.

Component:

```tsx
<ProductDetailSection />
```

Structure:

```text
## Best portable AC overall

[Image/gallery]

### 1. Product name
The best overall route for this trend

Editor’s verdict:
[source review link or summary]

Average marketplace review:
if available

Specifications:
- Cooling capacity
- Recommended room size
- Noise
- Dimensions
- Weight
- Power consumption
- Functions
- Window kit
- Voltage / plug
- Return risk

Today’s best routes:
- View at Amazon
- View at local retailer
- Check accessories on AliExpress
- Check accessories on Temu

Reasons to buy
+ ...
+ ...
+ ...

Reasons to avoid
- ...
- ...
- ...

Buyer notes:
2–4 short paragraphs

Repeated buyer complaints:
- ...
- ...
- ...

Full source review:
Read the external review / source page
```

Use TrendBrief language:

- `Editor’s verdict`, not `Our expert review`
- `Source review`, not `Our review`, unless TrendBrief actually did the review
- `Buyer notes`, not `Testing notes`, unless direct-use
- `Review signals`, not `test result`, unless direct-use evidence exists

---

## 11. Product Card / Deal Button UI

Create a dedicated deal-route card.

Component:

```tsx
<ProductRouteCard />
```

Fields:

- merchant label
- priceLabel
- priceState
- offerStatus
- CTA label
- linkType
- country/region fit
- delivery/return note

Design:

- white card
- subtle border
- merchant label left
- price bold
- CTA button right
- mobile stacked
- direct outbound links only
- `rel="sponsored nofollow"` for affiliate links

Do not route primary CTA through `/api/affiliate-click`.

---

## 12. Specifications Block

Ideal Home uses a clear specifications block.

Create:

```tsx
<SpecificationList />
```

For non-cooling categories, use category-specific spec labels.

Portable AC fields:

- cooling capacity
- room size
- noise
- dimensions
- weight
- power
- functions
- window kit
- voltage / plug
- return risk

Electronics fields:

- wattage
- ports
- protocol
- cable included
- plug type
- certification
- size / weight
- heat complaints
- return risk

Beauty/iHerb fields:

- active ingredient
- serving size
- storage risk
- expiry risk
- country shipping
- claim risk
- suitability warning

---

## 13. Reasons To Buy / Reasons To Avoid

Create a reusable two-column module.

Component:

```tsx
<ProsCons />
```

Design:

- two cards
- green/positive left
- amber/red/neutral warning right
- plus and minus markers
- short bullets only
- no long paragraphs

Copy:

- use “Reasons to buy”
- use “Reasons to avoid”
- do not over-disclaim

---

## 14. Comparison Table Upgrade

Make comparison table feel more like a serious shopping guide.

Columns:

- Rank
- Product
- Badge
- Evidence/source type
- Best for
- Key spec
- Price / route
- Return risk
- Repeated complaint
- CTA

Portable AC-specific:

- cooling type
- BTU
- room size
- noise
- voltage/plug
- window kit

Design:

- desktop: full table
- mobile: horizontal scroll or stacked comparison cards
- sticky first column if easy
- visible CTA
- price checked date in small text

---

## 15. Right Rail / Utility Rail

Add an optional desktop right rail inspired by magazine sites.

Right rail should include:

- Jump to category
- Trending briefs
- Newsletter signup
- Related buying guides
- Method link
- small affiliate disclosure / how links work

Rules:

- no intrusive ads
- no sticky element covering content
- hide or move below content on mobile
- do not expose empty related links

---

## 16. Site Header / Navigation

Upgrade header toward an editorial shopping magazine feel.

Current header is simple:

- Home
- visible categories
- Method
- About TrendBrief
- search

Target header:

Top utility row:

- TrendBrief logo
- Search
- Newsletter
- About
- Method

Primary nav row:

- Trends
- What to buy
- Deals
- Guides
- Electronics
- Home & Climate
- Beauty & Supplements
- Travel & Outdoor
- Fashion & Lifestyle

Mega menu behavior can be simple for now:

- desktop hover/click dropdown optional
- mobile hamburger menu required

Do not expose empty categories publicly.
If a category has no indexable articles, hide it.

---

## 17. Homepage Layout

Make homepage closer to an editorial magazine front page.

Sections:

1. Hero / lead story

   - main trend article
   - image
   - headline
   - dek
   - CTA

2. Trending now

   - 4–6 compact article cards

3. What to buy

   - category cards by product type

4. Latest briefs

   - chronological article list

5. TrendBrief Editors

   - Jacob
   - TrendBrief Editors
   - future category editors

6. Newsletter card

   - non-intrusive

7. Method / How we work link

Do not wait for many articles to implement the sections; only render sections with published/indexable items.

---

## 18. Author Bio Box

Add article bottom author box.

Component:

```tsx
<AuthorBioBox />
```

Content:

- avatar
- name
- role
- short bio
- covered categories
- link to author page
- latest articles by author

Example:

```text
About the author

Jacob Park
Marketplace Research Editor

Jacob tracks fast-moving product trends and turns them into buyer-decision briefs. His work focuses on marketplace routes, exact variants, price status, repeated buyer complaints, shipping delays, warranty paths, and when a product should be treated as an accessory rather than a main recommendation.

See all articles by Jacob
```

---

## 19. Related Articles / Latest In Category

Add:

```tsx
<RelatedArticles />
<LatestInCategory />
```

Rules:

- only show published/indexable articles
- no placeholder links
- no empty category pages
- if fewer than 2 links, hide section

Example section labels:

- Read more
- Latest in Home & Climate
- More cooling briefs
- More marketplace buying guides

---

## 20. Schema

Update JSON-LD:

Article:

- headline
- image
- datePublished
- dateModified
- inLanguage
- author with name and url
- publisher
- mainEntityOfPage

Author pages:

- Person or ProfilePage schema where appropriate

Do not add `reviewedBy` unless there is a real identifiable reviewing process.

Do not add ProductReview schema unless the article is a real product review with appropriate evidence.

---

## 21. CSS / Design Tokens

Implement a TrendBrief shopping magazine design system.

Use CSS variables or Tailwind tokens.

Suggested tokens:

```css
--tb-ink: #111827;
--tb-muted: #6b7280;
--tb-border: #e5e7eb;
--tb-paper: #ffffff;
--tb-soft: #f7f3ee;
--tb-blue: #0ea5e9;
--tb-blue-dark: #0369a1;
--tb-yellow: #facc15;
--tb-warning-soft: #fff7ed;
--tb-positive-soft: #ecfdf5;
```

Typography:

- H1: strong editorial serif or bold sans, 42–56 desktop, 32–38 mobile
- H2: 28–34 desktop, 24–28 mobile
- H3 product headings: 22–28
- Body: 17–18px desktop, 16px mobile
- Line height: 1.65–1.75 for article prose
- Product card text: tighter, 1.4–1.55

Layout:

- max page width: 1180–1240px
- main column: 720–780px
- right rail: 300–320px
- gap: 32–48px
- mobile: single column

Cards:

- border: 1px solid var(--tb-border)
- border-radius: 0 or 8px; Ideal Home feel is more editorial than SaaS-rounded
- product cards should feel dense, not airy
- use badges and strong section dividers
- use subtle cream/blue/yellow accents

Avoid:

- glassmorphism
- glow effects
- SaaS landing page gradients
- huge hero image pushing content too far down
- over-rounded cards
- excessive whitespace

````

---

## 22. Copy Rules

Do not overuse “we did not test.”

Public copy should be confident and editorial.

Allowed:
```text
Editor’s verdict
Why it’s in the list
Source review
Specs checked
Buyer notes
Review signals
Reasons to buy
Reasons to avoid
Today’s best routes
````

Only Method/About pages should explain the distinction between direct-use, source-backed, specs-first, and review-pattern evidence.

Hard gate remains:
If the page says “we tested,” direct-use evidence is required.

---

## 23. Quality Gate Additions

Add gates:

1. Every public article must have:

   - authorId
   - existing author page
   - updated date
   - affiliate disclosure near byline
   - jump links
   - recent update block for trend articles
   - quick list for Top 10 buying guides
   - product detail sections
   - comparison table
   - related links if available

2. Every product detail must have:

   - specs block
   - best route/deal card
   - reasons to buy
   - reasons to avoid
   - buyer notes
   - repeated complaints
   - source review or source/spec link

3. Direct-use claim gate:

   - block “we tested,” “our tester,” “tried and tested,” “our expert review” unless evidenceLevel is direct-use and direct-use evidence exists.

4. External review wording:

   - allow “Source review” or “Read source review”
   - do not imply TrendBrief performed the review

5. Author gate:

   - public author page required
   - author JSON-LD URL required
   - author archive only shows published/indexable articles

6. Layout gate:

   - no product article should render as plain prose-only layout
   - if productCategory exists, QuickList + ProductDetailSections + ComparisonTable required

---

## 24. Implementation Targets

Likely files to update/add:

New:

- `apps/web/lib/trend-site/authors.ts`
- `apps/web/app/authors/[slug]/page.tsx`
- `apps/web/components/layout/ArticleHeroHeader.tsx`
- `apps/web/components/layout/ArticleByline.tsx`
- `apps/web/components/layout/JumpToNav.tsx`
- `apps/web/components/layout/RecentUpdateBlock.tsx`
- `apps/web/components/layout/QuickList.tsx`
- `apps/web/components/layout/ProductDetailSection.tsx`
- `apps/web/components/layout/SpecificationList.tsx`
- `apps/web/components/layout/ProsCons.tsx`
- `apps/web/components/layout/ProductRouteCard.tsx`
- `apps/web/components/layout/RightRail.tsx`
- `apps/web/components/layout/AuthorBioBox.tsx`
- `apps/web/components/layout/RelatedArticles.tsx`
- `apps/web/components/layout/LatestInCategory.tsx`

Update:

- `ArticlePage.tsx`
- `ArticleTypeContent.tsx`
- `article-type-content-parts.tsx`
- `types.ts`
- `seo.ts`
- `categories.ts`
- `data.ts`
- `quality-gate.ts`
- `app/page.tsx`
- `SiteHeader.tsx`
- `globals.css`

---

## 25. Acceptance Criteria

Run:

```bash
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm smoke
```

Visual acceptance:

- Article page feels like an editorial shopping magazine, not a minimalist blog.
- Above the fold has H1, dek, byline, updated date, affiliate disclosure, hero image, jump links.
- Recent update and marketplace route appear before product details.
- The quick list appears before detailed notes.
- Product detail sections include specs, routes, reasons to buy/avoid, buyer notes, repeated complaints, and source review links.
- Author page exists and links from byline.
- Author archive lists published/indexable articles.
- Related/latest sections hide when empty.
- No public copy says TrendBrief tested products unless direct-use evidence exists.
- No public copy over-repeats “we did not test.”
- Primary product CTAs remain direct outbound links with `rel="sponsored nofollow"`.
- Hidden categories remain hidden.
- Planned locales remain noindex/hidden.

````

---

# 6. 최종 정리

너 말이 맞아. **테스트 안 했다는 방향으로 계속 과하게 패치하면 사이트가 약해져.**
이제는 방어 문구를 줄이고, **편집형 매거진의 신뢰 표면**을 올릴 차례야.

핵심은 이거야.

```text
테스트 claim은 하지 않는다.
하지만 구매 판단은 자신 있게 말한다.

Jacob 개인 블로그가 아니라 TrendBrief 팀으로 간다.
카테고리별 편집자/작성자 페이지를 만든다.

Ideal Home처럼:
byline
contributions
recent update
stock route
quick list
product specs
deals
pros/cons
source review
comparison table
author archive
related articles
````

즉, TrendBrief는 이렇게 보여야 해.

**“직접 실험실은 아니지만, 트렌드와 마켓플레이스 구매 판단을 카테고리별 편집자가 정리하는 쇼핑 매거진.”**

**완료조건**
완료는 UI에 대해서 참조에 있는 ideal home url에 UI와 UX가 서브에이전트 5명에게 99점이상 동일로 받아야 완료
브라우저유즈를 사용하면서 비교해보고 점수를 받고 패치도 할 것

필요한 이미지는 이미지젠2를 사용하여 프로젝트 에셋에 만든다음에 사용하여 거의 같게 만들 것
(먼저 벤치마킹 후 우리 색을 입힐 생각)

[1]: https://www.idealhome.co.uk/buying-guide-reviews/best-portable-air-conditioner-281380 "Best portable air conditioners to cool and control humidity | Ideal Home"
[2]: https://www.idealhome.co.uk/ "Ideal Home | Kitchen, Bedroom, Bathroom and Living Room Ideas"
[3]: https://github.com/Daikisong/seo_daiki "GitHub - Daikisong/seo_daiki: . · GitHub"
[4]: https://raw.githubusercontent.com/Daikisong/seo_daiki/main/apps/web/components/layout/ArticlePage.tsx "raw.githubusercontent.com"
[5]: https://raw.githubusercontent.com/Daikisong/seo_daiki/main/apps/web/lib/trend-site/types.ts "raw.githubusercontent.com"
[6]: https://raw.githubusercontent.com/Daikisong/seo_daiki/main/apps/web/components/layout/article-type-content-parts.tsx "raw.githubusercontent.com"
