맞아. **지금 이미 방향은 잘 되어 있는 편**이야.
내가 봤을 때 지금 더 필요한 건 “조잡하게 더 붙이는 것”이 아니라, **Ideal Home 같은 편집형 쇼핑 매거진의 신뢰 표면을 추가하는 것**이야.

즉 디자인을 더 복잡하게 만들자는 게 아니라, 사용자가 들어왔을 때 이렇게 느끼게 해야 해.

> “아, 이건 그냥 AI가 만든 상품 추천글이 아니라, TrendBrief라는 편집팀이 카테고리별로 맡아서 관리하는 구매 판단 매거진이구나.”

네가 말한 **작성자/편집자/기고자 구조**는 꽤 중요해. 특히 TrendBrief가 Jacob 개인 블로그처럼 보이면 18개국·여러 카테고리 운영과 스케일이 안 맞아 보일 수 있어. 브랜드는 **TrendBrief 팀**, Jacob은 창립 편집자/마켓플레이스 리서치 담당자, 카테고리별 필자는 각 영역 담당자로 가는 게 더 자연스럽다.

---

## 1. 지금 더 필요한 건 “디자인”보다 “편집 시스템의 표면화”야

현재까지 만든 시스템의 핵심은 이미 좋아.
네 피드백 문서에도 품질 게이트가 잘 잡혀 있어. 실제 트렌드 근거, 구매 문제, 상업 연결성, 현지성, 제품 근거, 반복 불만, thin affiliate 방지, 기존 글과의 유사성, 독자가 이 글만 보고 구매 판단을 쉽게 할 수 있는지까지 본다.

그러니까 지금 사이트가 부족해 보인다면, 그건 “정보 구조가 약해서”라기보다 **그 구조가 사용자 눈에 신뢰 가능한 편집 시스템으로 보이느냐**의 문제야.

Ideal Home이 강한 이유도 비슷해. 그 페이지는 그냥 제품을 나열하지 않는다. 상단에 작성자, 업데이트 날짜, 기고자, 제휴 고지, 점프 링크, 최근 업데이트, 재고 상황, quick list, 제품별 상세, 비교표, 구매처, 고르는 법, 테스트 방식, 작성자 프로필, 관련글 클러스터까지 이어진다. ([Ideal Home][1])

이걸 TrendBrief식으로 번역하면:

```text
TrendBrief 팀
→ 카테고리 담당 편집자
→ 글별 작성자/리서처/편집자
→ Evidence Level
→ Review-backed / Specs-first / Direct-use 구분
→ 작성자 페이지
→ 작성자별 최신 글
→ 카테고리별 전문 영역
→ 방법론 페이지
→ 관련 허브 글
```

이 레이어가 붙으면 “잘 정리된 글 하나”에서 “편집 매거진”으로 올라가.

---

## 2. Ideal Home에서 진짜 베낄 건 UI보다 “페이지의 순서”야

네가 마음에 든 Ideal Home 페이지는 구조가 아주 좋다. 이 페이지는 H1 바로 아래에 byline, last updated, contributions, affiliate disclosure를 보여주고, 그 다음 점프 링크와 hero 이미지를 배치한다. 그리고 “Recent updates”로 현재 재고/품절 상황을 먼저 말한 뒤, 어디서 살 수 있는지, quick list, 제품별 상세로 내려간다. ([Ideal Home][1])

TrendBrief도 이 순서가 좋다.

```text
1. Breadcrumb
2. H1
3. Dek / 짧은 설명
4. Byline
   By [Category Editor]
   Research by [Marketplace Researcher]
   Edited by [TrendBrief Editors]
5. Last updated
6. Affiliate disclosure
7. Jump to
8. Recent update / Trend signal
9. Stock or marketplace route
10. Quick list
11. Product details
12. Comparison table
13. Buying guide
14. Review/source methodology
15. Author box
16. Related articles
```

이건 겉보기 UI보다 훨씬 중요해.
사용자는 맨 위 10초 동안 “이 글이 살아있는 글인지, 누가 썼는지, 지금 살 수 있는지, 어디로 내려가면 되는지”를 판단한다.

---

## 3. Ideal Home식으로 바꿀 때 핵심 블록

### A. 상단 byline을 강화

지금은 Jacob 하나로 가면 작아 보여. 이렇게 가는 게 좋아.

```text
By Maya Chen
Home & Climate Editor

Research by Jacob Park
Marketplace Risk & Trend Signals

Edited by TrendBrief Editors

Last updated 30 June 2026
```

실제 사람이 아직 없으면 가짜 사람을 만들면 안 된다. 대신 초반에는 이렇게 갈 수 있어.

```text
By TrendBrief Editors
Research by Jacob
```

나중에 카테고리 담당자를 실제로 나눌 때:

```text
Home & Climate Editor
Electronics & Charging Editor
Beauty & Supplements Editor
Travel & Outdoor Editor
Fashion & Lifestyle Editor
```

각 작성자 페이지에는 담당 카테고리, 검토 방식, 최신 글, 직접 사용/자료 기반 구분 원칙이 있어야 한다.

Google의 Article 구조화 데이터 예시에도 `author`에 `name`과 `url`을 넣는 형태가 나오고, author URL을 통해 작성자를 명시할 수 있다. 즉 작성자 페이지를 만드는 건 “순위 치트키”가 아니라, 글과 작성자 엔티티를 명확히 연결하는 기본 신뢰 구조에 가깝다. ([Google for Developers][2])

---

### B. 작성자 페이지를 진짜 매거진처럼 만들기

Ideal Home의 Sarah Handley 페이지를 보면 이름, 직함, 분야 설명, 경력, 개인적 배경, “Latest articles by Sarah Handley” 목록이 있다. 심지어 해당 작성자의 에어컨/팬/홈 에너지 관련 글들이 계속 이어져 있어서 “이 사람이 이 카테고리를 오래 다뤘구나”라는 느낌이 난다. ([Ideal Home][3])

TrendBrief도 이렇게 해야 해.

```text
/authors/jacob/
  Jacob Park
  Marketplace Research Editor

  Covers:
  - marketplace risk
  - AliExpress / Temu / Amazon / iHerb product routes
  - trend-to-buyer-problem mapping
  - evidence ledger review

  How Jacob works:
  - checks official specs
  - compares marketplace listings
  - flags repeated buyer complaints
  - separates direct-use products from review-backed products

  Latest articles by Jacob:
  - Europe heatwave portable AC brief
  - Travel GaN charger fake wattage brief
  - etc.
```

카테고리별 필자가 생기면:

```text
/authors/home-climate-editor/
/authors/electronics-editor/
/authors/beauty-supplements-editor/
```

ProfilePage 구조화 데이터도 쓸 수 있다. Google은 ProfilePage markup이 크리에이터/프로필 정보를 Google이 이해하는 데 도움을 줄 수 있고, Article 구조화 데이터의 author도 프로필 페이지와 연결될 수 있다고 설명한다. ([Google for Developers][4])

단, 여기서 중요한 건 **가짜 전문가처럼 만들면 안 된다**는 거야.
“전문가”라고 주장할 게 아니라, “이 카테고리를 어떤 기준으로 담당하는 편집자”인지 보여주면 된다.

---

### C. “Contributions from” 구조 도입

Ideal Home은 메인 작성자 외에 contributors를 따로 보여준다. 해당 portable AC 글도 Sarah Handley가 작성하고 Jenny McFarlane, Amy Lockwood가 기여자로 표시된다. ([Ideal Home][1])

TrendBrief는 직접 테스트팀이 아니니까 이렇게 바꾸면 좋아.

```text
By Home & Climate Editor
Research by Marketplace Desk
Reviewed for evidence by TrendBrief Editors
```

또는:

```text
Written by Jacob Park
Product evidence compiled by TrendBrief Marketplace Desk
Edited by TrendBrief Editors
```

이게 있으면 “Jacob 혼자 18개국을 다 쓰는 느낌”이 줄어든다.

---

## 4. Ideal Home식 제품 블록을 TrendBrief식으로 바꾸기

Ideal Home 제품 블록은 강하다. 제품별로 이미지, “Our expert review”, Amazon 평균 리뷰, specifications, Today’s Best Deals, reasons to buy, reasons to avoid, 본문 평가, full review link가 있다. ([Ideal Home][1])

우리는 직접 리뷰가 아니니까 이렇게 바꿔야 해.

```text
Product title
Best overall / Best affordable / Best for small rooms

Evidence:
Review-backed + official specs + marketplace data

Source review:
Read external review / See source review
또는
Review signal: Ideal Home / TechRadar / Amazon verified buyer reviews

Specifications:
Cooling capacity
Room size
Noise
Weight
Power
Window kit
Voltage / plug
Return risk

Best routes:
Amazon
AliExpress
Temu
iHerb
Local retailer

Reasons to consider:
+
+
+

Reasons to skip:
-
-
-

TrendBrief note:
이 제품은 이런 사람에게 맞고, 이런 상황에서는 피해야 함.

Repeated complaints:
- short ducting
- bulky return
- noisy on high mode
```

이렇게 하면 Ideal Home의 문법을 가져오면서도 “우리가 직접 테스트했다”는 거짓말은 피할 수 있다.

Google의 고품질 리뷰 가이드도 사용자 관점 평가, 전문성 입증, 성능 항목별 정량 정보, 경쟁 제품과의 차이, 특정 용도별 적합성, 장단점, 여러 판매처 링크를 권장한다. 특히 “best overall” 같은 추천에는 왜 그렇게 판단했는지 근거가 있어야 한다고 설명한다. ([Google for Developers][5])

---

## 5. “Our expert review” 대신 이렇게 써야 함

Ideal Home은 직접 테스트했기 때문에 “Our expert review”를 쓸 수 있다. 해당 글은 집에서 최소 2주 이상 테스트하고, 온도 변화와 소음 같은 데이터를 본다고 설명한다. ([Ideal Home][1])

TrendBrief는 이렇게 쓰면 안 돼.

```text
Our expert review
We tested
Tried and tested
Our tester found
```

대신 이렇게 써야 한다.

```text
Evidence note
Review-backed pick
Specs-first pick
Marketplace-risk pick
Direct-use pick
External review source
Full review source
```

예시:

```text
Evidence note:
Review-backed. Official specs, current marketplace route, and repeated buyer complaints support this pick.

Full review source:
Read Ideal Home’s hands-on review
```

이렇게 하면 오히려 정직해 보여.
사용자는 “아 얘네가 직접 테스트한 척하지 않고, 외부 리뷰와 마켓 데이터를 정리하는구나”라고 이해한다.

---

## 6. SEO 상위 조건을 현실적으로 정리하면

상위 조건은 하나가 아니야.
Ideal Home 같은 페이지는 다음이 겹쳐져 있다.

### 콘텐츠 조건

```text
검색 의도와 정확히 맞음
상단에서 답을 빨리 줌
제품별 추천 이유가 분명함
비추천 이유도 있음
비교표가 있음
구매 시점/재고/가격 정보가 있음
FAQ와 구매 가이드가 있음
업데이트 로그가 있음
```

Ideal Home은 heatwave로 품절이 발생한 상황을 먼저 설명하고, 재고가 있는 곳과 기다릴 제품, 대체 제품을 제시한다. 이건 단순 제품 추천보다 훨씬 강한 현재성이다. ([Ideal Home][1])

### 신뢰 조건

```text
작성자 표시
작성자 직함
기여자 표시
작성자 페이지
방법론 페이지
제휴 고지
업데이트 날짜
관련글 클러스터
```

Ideal Home은 byline, contributors, affiliate disclosure, author profile, latest articles by author까지 갖추고 있다. ([Ideal Home][1])

### 구조 조건

```text
breadcrumb
jump links
quick list
product cards
specification table
pros/cons
best deals
comparison table
how to choose
how we test / how we selected
related articles
latest in category
```

Ideal Home은 “Quick list”에서 시간 없는 사용자를 잡고, 제품별 상세에서 더 깊게 설명하며, 뒤쪽에는 비교표와 구매처, 고르는 법을 둔다. ([Ideal Home][1])

### 사이트 조건

```text
카테고리 허브
작성자 아카이브
관련글 내부링크
브랜드/팀 페이지
정책 페이지
뉴스레터
카테고리별 담당자
정기 업데이트
```

Ideal Home의 메뉴는 Room Decor, Garden, Renovation, House Manual, What to buy, Buying Guides, Deals, Advice, News, Reviews 같은 큰 정보 구조를 가진다. `What to buy` 안에는 제품별, 브랜드별, How We Test Products가 따로 있다. ([Ideal Home][1])

---

## 7. 지금 TrendBrief에 추가할 것

컨텐츠가 적은 건 문제 아니라고 했으니, “글 더 채우기” 말고 **시스템/컴포넌트 기준**으로 말하면 이거야.

### 1. Author system

```text
AuthorProfile
- name
- role
- avatar
- bio
- expertiseAreas
- coveredCategories
- methodologyNote
- sameAs links
- latestArticles
- directUsePolicy
- locale coverage
```

라우트:

```text
/authors/jacob/
/authors/trendbrief-editors/
/authors/home-climate-editor/
```

초반엔 사람을 억지로 늘리지 말고:

```text
Jacob Park — Marketplace Research Editor
TrendBrief Editors — Editorial Desk
```

이 두 개만 있어도 충분하다. 나중에 실제 카테고리가 생기면 담당자를 나누면 된다.

---

### 2. Article byline module

각 글 상단에 이런 모듈.

```text
By Jacob Park
Marketplace Research Editor

Product evidence by TrendBrief Editors
Last updated 30 June 2026

Affiliate disclosure:
When you purchase through links on our site, we may earn a commission. Here’s how we work.
```

Ideal Home도 구매 링크를 통해 수수료를 받을 수 있음을 byline 근처에 표시한다. ([Ideal Home][1])

---

### 3. Recent update module

Ideal Home처럼 상단에 최근 업데이트를 아주 선명하게.

```text
Recent update
30/6: Several portable AC listings now show delayed delivery in the UK and Germany. We moved heavy compressor ACs to local-retailer routes and kept AliExpress/Temu for accessories only.
```

이게 트렌드 사이트에서는 엄청 중요해.
트렌드는 살아있는 생물이라, 날짜가 없으면 죽은 글처럼 보인다.

---

### 4. In-stock / marketplace route module

Ideal Home은 “Where to find in-stock portable air conditioners”를 제품 추천보다 먼저 둔다. 품절/재고가 검색자의 가장 급한 문제였기 때문이야. ([Ideal Home][1])

TrendBrief도 트렌드에 따라 이걸 바꿔야 해.

```text
Where to buy safely right now
- Amazon: fastest route, check seller and delivery date
- AliExpress/Temu: better for accessories, avoid heavy compressor units
- Local retailer: safer for bulky returns and warranty
- iHerb: check storage, expiry, customs
```

이건 네 사이트의 차별점이 될 수 있다.

---

### 5. Quick list를 Ideal Home식으로

현재 Top 10이 있다면 그 앞에 “The quick list”를 더 잡아줘야 해.

```text
The quick list

1. Best overall
Midea PortaSplit
Best for EU buyers who want real compressor cooling and local support.

2. Best UK route
De’Longhi Pinguino
Best for UK shoppers who want local retailer warranty.

3. Best accessory route
Window seal kit
Best if you already own a portable AC but are losing cooling through the window.

4. Avoid panic buy
USB mini cooler
Not a real AC. Use only as personal airflow.
```

“Read more below” 같은 내부 anchor도 붙이면 좋다.

---

### 6. Product detail module

Ideal Home 문법을 TrendBrief식으로 변형.

```text
Best overall portable AC route

[Product image]

Product name
The best overall pick for this trend

Evidence:
Review-backed / official specs / marketplace route checked

Specifications:
- Cooling capacity
- Recommended room size
- Noise
- Weight
- Power
- Voltage
- Window kit
- Return risk

Best routes:
- View at Amazon
- View at local retailer
- Check AliExpress accessories

Reasons to consider:
+ real compressor cooling
+ local warranty route
+ window kit included

Reasons to skip:
- bulky return
- high price
- wrong choice if you cannot vent outside

TrendBrief note:
This is the right kind of product if you need actual room cooling. Do not confuse it with evaporative coolers or mini USB cooling boxes.
```

---

### 7. Comparison table 개선

Ideal Home 비교표는 model, cooling capacity, room size, weight, noise level, wattage, window kit included를 보여준다. ([Ideal Home][1])

TrendBrief는 거기에 더해 “구매 리스크”를 넣으면 된다.

```text
Product
Evidence level
Best for
Cooling type
Capacity
Noise
Weight
Voltage / plug
Return risk
Repeated complaint
Best route
```

이게 Ideal Home보다 네 사이트다운 포인트야.

---

### 8. Author box at bottom

글 하단에 작성자 박스.

```text
About the author

Jacob Park
Marketplace Research Editor

Jacob tracks fast-moving product trends and turns them into buyer-decision briefs. His work focuses on marketplace routes, repeated buyer complaints, exact model variants, shipping risks, and when a product is better treated as an accessory rather than a main recommendation.

See all articles by Jacob
```

Ideal Home도 글 하단에 Sarah Handley의 직함, 경력, 담당 분야, 기여자, 관련 글을 보여준다. ([Ideal Home][1])

---

### 9. Related articles / Latest in category

Ideal Home은 글 하단에 Read more, Latest in Air Quality, Latest in Buying Guides를 붙인다. 이게 내부링크 클러스터야. ([Ideal Home][1])

TrendBrief도 지금 글 수가 적어도 컴포넌트는 만들어야 해.

```text
Read more
- Portable AC vs evaporative cooler
- Window seal kits for portable AC
- Fans still in stock during heatwaves
- How to avoid fake BTU claims
```

글이 없으면 hidden/noindex 상태로 두고, 생기는 순간 자동 연결.

---

## 8. “카테고리별 기자”는 진짜 좋다

이건 꼭 넣는 게 좋아.
다만 “기자”라는 표현보다 **Editor / Contributor / Research Desk**가 더 안전해. 대형 뉴스룸 흉내보다는 작은 편집팀 느낌.

추천 구조:

```text
TrendBrief Editors
- final editorial desk
- methodology owner

Jacob Park
- marketplace research editor
- trend signal and evidence ledger

Home & Climate Editor
- cooling, heating, air quality, appliances

Electronics Editor
- chargers, gadgets, accessories, phone gear

Beauty & Supplements Editor
- iHerb, skincare, supplements
- stricter health-claim policy

Travel & Outdoor Editor
- luggage, cooling gear, travel accessories

Fashion & Lifestyle Editor
- trend products, viral items, styling-based buying guides
```

각 editor는 author page가 있고, 그 editor가 담당한 글 archive가 있어야 해.

중요한 원칙:

```text
가짜 경력 금지
가짜 사진 금지
직접 테스트한 척 금지
담당 영역과 검토 기준은 명확히
작성자마다 Evidence Level 정책 공유
```

이렇게 하면 신뢰도가 올라간다.

---

## 9. Ideal Home과 똑같이 가면 안 되는 지점

Ideal Home은 직접 테스트를 하기 때문에 이런 표현이 가능하다.

```text
tried and tested
our reviewer tested
our expert review
our in-house product testers
tested for at least two weeks
```

TrendBrief는 이 표현을 쓰면 안 된다.
대신 이렇게 간다.

```text
review-backed
source-backed
specs-first
marketplace route checked
repeated complaint pattern
direct-use only when actually used
```

즉 UI는 비슷하게 가도 되고, **claim language만 정확히 바꾸면 된다.**

---

## 10. Codex에 전달할 패치 지시서

아래 그대로 주면 돼.

```markdown
# Goal: Add Editorial Magazine Trust Layer Inspired by Ideal Home

## Objective

TrendBrief already has the core buyer-decision article structure. The next step is not to make the site cluttered, but to make it feel like a structured shopping magazine with visible editorial ownership, author expertise, category responsibility, and strong article modules.

Use Ideal Home’s buying guide structure as inspiration, but do not copy testing claims. TrendBrief should use evidence-level, source-backed, review-backed, and marketplace-risk language without repeatedly telling readers what was not tested.

---

## 1. Author / Editor System

Add an author system.

Required model fields:

- id
- name
- role
- avatar
- shortBio
- longBio
- expertiseAreas
- coveredCategories
- localeCoverage
- methodologyNote
- sameAs
- authorPagePath
- latestArticles
- directUsePolicy

Initial authors:

1. TrendBrief Editors
   - role: Editorial Desk
   - owns final editorial standards and methodology

2. Jacob Park
   - role: Marketplace Research Editor
   - covers trend signals, marketplace routes, product evidence, repeated complaint patterns, and buyer-risk notes

Future categories may add:

- Home & Climate Editor
- Electronics Editor
- Beauty & Supplements Editor
- Travel & Outdoor Editor
- Fashion & Lifestyle Editor

Do not invent fake credentials, fake testing claims, or fake professional backgrounds.

---

## 2. Author Pages

Create author profile pages:

/authors/jacob/
/authors/trendbrief-editors/

Each page should include:

- name
- role
- avatar
- bio
- areas covered
- how this author evaluates products
- evidence policy
- latest articles by this author
- category links
- author JSON-LD / ProfilePage or Person schema where appropriate

The page should make the author feel like a real editorial role, not a fake persona.

---

## 3. Article Byline Module

Add a strong byline module near the top of every article.

Example:

By Jacob Park
Marketplace Research Editor

Product evidence by TrendBrief Editors
Last updated 30 June 2026

Affiliate disclosure:
When you purchase through links on our site, we may earn a commission. Here’s how we work.

Rules:

- Main author required
- Optional contributor/researcher/editor allowed
- Link all authors to profile pages
- Show last updated date clearly
- Show affiliate disclosure near byline

---

## 4. Article Structure Upgrade

Update buying guide pages to follow this structure:

1. Breadcrumb
2. H1
3. Dek / short description
4. Byline module
5. Affiliate disclosure
6. Jump-to navigation
7. Recent update block
8. Trend signal block
9. Marketplace route / stock route block
10. The quick list
11. Product detail sections
12. Comparison table
13. How to choose
14. What to avoid
15. Methodology / how we selected
16. FAQ
17. Update log
18. Author bio box
19. Related articles
20. Latest in category

---

## 5. Recent Update Block

Add a visible Recent Update block near the top.

Example:

Recent update
30/6: Several portable AC listings now show delayed delivery in the UK and Germany. We moved heavy compressor ACs to local-retailer routes and kept AliExpress/Temu for accessories only.

This should be separate from the full update log.

---

## 6. Quick List Module

Add an Ideal Home-style “The quick list” before the detailed product notes.

Each quick pick should include:

- image
- ranking number
- badge
  - Best overall
  - Best affordable
  - Best for small rooms
  - Best accessory route
  - Avoid panic buy
- product name
- short verdict
- primary CTA
- “Read more below” anchor

Example:

Best overall
Midea PortaSplit
Best for EU buyers who need real compressor cooling with local support.

Read more below

---

## 7. Product Detail Module

Each product detail section should include:

- product image
- ranking number
- category badge
- product name
- one-line verdict
- evidence level
- source/review link
- specifications
- best routes / today’s best routes
- reasons to consider
- reasons to skip
- repeated complaints
- TrendBrief note
- CTA links
- full source review link if available

Use this language:

Allowed:

- Evidence note
- Review-backed
- Specs-first
- Marketplace route checked
- External review source
- Repeated buyer complaints
- Direct-use only when actually used

Not allowed unless actually true:

- Our expert review
- We tested
- Tried and tested
- Our tester found
- In-house product testing

---

## 8. Comparison Table Upgrade

Comparison table should include:

- Product
- Evidence level
- Best for
- Cooling / product type
- Capacity or key spec
- Noise / weight / size where relevant
- Voltage / compatibility
- Return risk
- Repeated complaint
- Best purchase route
- CTA

This table should be practical, not decorative.

---

## 9. Author Bio Box

Add an author bio box near the bottom of each article.

Example:

About the author

Jacob Park
Marketplace Research Editor

Jacob tracks fast-moving product trends and turns them into buyer-decision briefs. His work focuses on marketplace routes, repeated buyer complaints, exact model variants, shipping risks, and when a product is better treated as an accessory rather than a main recommendation.

See all articles by Jacob

---

## 10. Related Articles / Category Cluster

Add “Read more” and “Latest in [category]” blocks.

Examples:

- Portable AC vs evaporative cooler
- Window seal kits for portable AC
- Fans still in stock during heatwaves
- How to avoid fake BTU claims

If related articles are not yet published:

- do not expose empty pages
- use only published/indexable related links
- keep draft targets hidden

---

## 11. Schema

Article schema should include:

- headline
- image
- datePublished
- dateModified
- author with name and url
- publisher

Author/profile pages should use appropriate Person/ProfilePage schema where useful.

Do not add reviewedBy unless there is a real review/check process and an identifiable reviewer.

---

## 12. Quality Gate Additions

Add gates:

- article must have linked author page
- author page must exist for public author
- byline must show last updated date
- affiliate disclosure must appear near byline
- if article says “tested”, direct-use evidence is required
- if article uses review-backed language, source review link is required
- if author claims category expertise, author page must describe the actual editorial scope
- author archive must only show published/indexable articles

---

## 13. Tone

The target feel is:

- clean but dense
- shopping magazine, not SaaS landing page
- editorially owned, not anonymous AI blog
- practical, not over-polished
- strong product cards and comparison tables
- honest evidence labels

Do not make the site cluttered with ads. Increase editorial and commerce density through modules, not intrusive banners.
```

---

## 최종 결론

응, **지금 이미 기본은 잘 되어 있어.**
더 필요한 건 “더 화려한 디자인”이 아니라 **편집자/기고자/카테고리 담당자/작성자 페이지/최근 업데이트/quick list/제품 상세 모듈/관련글 클러스터**야.

Ideal Home을 보면 답이 보여.
그들은 제품 추천글을 하나의 글로 끝내지 않고, 작성자 신뢰, 카테고리 전문성, 재고 업데이트, quick list, 상세 리뷰, 비교표, 구매 가이드, 테스트 방식, 작성자 아카이브, 관련글 클러스터까지 하나의 매거진 시스템으로 묶는다. ([Ideal Home][1])

TrendBrief도 그렇게 가면 된다.
단, 우리는 직접 테스트팀이 아니니까 claim만 바꿔야 해.

```text
Ideal Home:
tested / expert review / our tester

TrendBrief:
review-backed / source-backed / marketplace route checked / repeated complaints / evidence level
```

이렇게 가면 **Ideal Home 같은 구매가이드 UI 감성은 가져오고, 거짓 테스트 claim 없이 TrendBrief만의 정직한 편집형 구매 판단 사이트**가 된다.

[1]: https://www.idealhome.co.uk/buying-guide-reviews/best-portable-air-conditioner-281380 "Best portable air conditioners to cool and control humidity | Ideal Home"
[2]: https://developers.google.com/search/docs/appearance/structured-data/article "Learn About Article Schema Markup | Google Search Central  |  Documentation  |  Google for Developers"
[3]: https://www.idealhome.co.uk/author/sarah-handley "Articles by Sarah Handley | Ideal Home"
[4]: https://developers.google.com/search/docs/appearance/structured-data/profile-page "Profile Page (ProfilePage) Schema Markup | Google Search Central  |  Documentation  |  Google for Developers"
[5]: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews "How To Write Reviews | Google Search Central  |  Documentation  |  Google for Developers"
