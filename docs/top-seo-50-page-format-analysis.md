# Top SEO Page Format Analysis

Date: 2026-05-31

This audit answers the user's specific question: not "what Google says in theory," but what repeatedly appears in currently visible, high-ranking guide, review, comparison, blog, and official-reference pages for the same topic families as our test posts.

## Scope

- Total pages analyzed: 55
- Markets/languages: US/en, BR/pt-br, ES/es, JP/ja, KR/ko
- Topic families: Samsung S90F OLED, iPhone 16 Brazil buying decision, Spain Renta 2025/AEAT, iPhone 18 rumors in Japan, Korea 2026 university admissions school-violence policy
- Exclusions: Reddit/forum threads and pure news-only pages were not used when a guide, review, explainer, blog, or official source was available.
- Storage rule: only structure and format observations are stored; no article body is copied.
- Ranking evidence: every row in the JSON file includes `serpEvidence.searchQuery`, market/language/country, `serpLocale`, device, captured timestamp, and observed result position from the captured search result set.
- Important limitation: search rankings can move by location, device, personalization, and freshness. This document preserves the exact query context used for format analysis; it is not a promise that every URL is permanently in the same position.

The structured source list is in [top-seo-page-format-analysis.json](/home/eorb915/projects/seo_daiki/data/research/top-seo-page-format-analysis.json).

## What Actually Repeats

The top pages are not visually complicated. They are usually dense, but the winning pattern is simple:

1. A direct answer or verdict appears early.
2. A trust signal appears near the top: author, reviewer, updated date, method, "why trust us," or official-source basis.
3. Navigation appears as jump links or sticky contents, but it does not replace the answer.
4. Tables, checklists, scorecards, or side-by-side comparisons support scanning.
5. Public pages do not show their SERP research notes. They turn the research into reader-facing advice.
6. Product/deal pages separate "live deal" from durable buying criteria.
7. Policy/tax/admission pages lead with official sources, then use blogs/explainers for readability.
8. Rumor pages label uncertainty and separate confirmed, likely, and unconfirmed claims.

쉽게 말하면, 상위 글은 "내가 상위 글을 분석했다"라고 보여주지 않는다. 대신 독자가 바로 쓸 수 있게 "먼저 확인할 것", "주의할 것", "공식 출처"로 바꿔서 보여준다.

## Page Inventory

| # | Topic | Page Type | URL | Repeated Format Signal | Apply To Our Site |
|---:|---|---|---|---|---|
| 1 | Samsung S90F | Lab review | https://www.rtings.com/tv/reviews/samsung/s90f-oled | verdict, methodology, dense test tables | use verdict + data table, avoid lab dashboard |
| 2 | Samsung S90F | Expert review | https://www.techradar.com/televisions/samsung-s90f-review | why-trust, jump links, two-minute review | add compact trust strip and jump links |
| 3 | Samsung S90F | Expert review | https://www.tomsguide.com/tvs/oled-tvs/samsung-s90f-oled-tv-review | hero image, test results, how-we-test | keep image and reviewer/date high |
| 4 | Samsung S90F | Regional review | https://www.tomsguide.com/uk/tvs/oled-tvs/samsung-s90f-oled-tv-review | regional caveats | keep market-specific caveats |
| 5 | Samsung S90F | Brand specialist | https://www.sammobile.com/reviews/samsung-s90f-oled-tv-review-unreal-value-for-money/ | value angle, size caveats | add size/region warnings |
| 6 | Samsung S90F | Blog review | https://www.tech-logie.com/reviews/samsung-s90f-oled-review | gaming angle, pros/cons, readable sections | focus each article on one reader intent |
| 7 | Samsung S90F | Enthusiast review | https://hometheaterreview.com/the-oled-id-buy-samsung-s90f-review/ | scenario framing | add "who this is for" cues |
| 8 | Samsung S90F | Comparison tool | https://www.rtings.com/tv/tools/compare/lg-c5-oled-samsung-s90f-oled/88602/92237 | side-by-side specs | keep comparison table |
| 9 | Samsung S90F | Face-off guide | https://www.tomsguide.com/tvs/lg-c5-oled-vs-samsung-s90f-which-mid-range-oled-tv-is-right-for-you | specs/design/performance/verdict | table before long prose |
| 10 | OLED TV | Best list | https://www.rtings.com/tv/reviews/best/by-type/oled | best-for categories | add reader-fit summaries |
| 11 | OLED TV | Best list | https://www.tomsguide.com/tvs/oled-tvs/best-oled-tvs | why buy/avoid, how tested | use checklist and trust explanation |
| 12 | OLED TV | Best list | https://www.techradar.com/televisions/the-best-oled-tvs | budget segments | market/price segment context |
| 13 | OLED TV | Buying guide | https://specdb.net/en/reviews/oled-tv-buying-guide-2026 | FAQ headings, criteria | add question-style sections |
| 14 | OLED TV | Buying guide | https://thetechsearch.com/best-oled-tvs-2026 | ranked picks, specs | avoid unsupported rankings |
| 15 | OLED TV | Buying guide | https://displayreviewz.com/oled-tv-buying-guide/ | criteria before products | criteria first, product later |
| 16 | iPhone 16 BR | Price guide | https://canaltech.com.br/smartphone/quanto-vale-a-pena-pagar-no-iphone-16-em-2026/ | price threshold and historic low | add price freshness caveat |
| 17 | iPhone 16 BR | Comparison | https://www.oficinadanet.com.br/comparativos/66367-iphone-16-vs-iphone-15-qual-vale-a-pena | index + categories + conclusion | keep comparison sections |
| 18 | iPhone 16 BR | Blog review | https://codeiot.com.br/iphone-16-review-vale-a-pena/ | scorecard, pros/cons, updated date | compact score/verdict possible |
| 19 | iPhone 16 BR | Buyer guide | https://digitalcomum.com.br/iphone-16-vale-a-pena-2026/ | reader profiles, alternatives | add "who should act" language |
| 20 | iPhone BR | Buying guide | https://www.inevitavel.com.br/artigo/melhor-iphone-comprar-2026-guia-completo.html | model comparison, price range | local price bands |
| 21 | iPhone 16 BR | Blog review | https://reviewdopepe.com/2026/iphone-16-ainda-vale-a-pena-em-2026-review-completo/ | direct yes/no answer | answer first |
| 22 | iPhone 16 BR | Finance guide | https://www.melhorescartoes.com.br/vale-a-pena-comprar-um-iphone-16.html | resale/payment context | total-cost framing |
| 23 | iPhone 16 BR | Tech comparison | https://tecnoblog.net/guias/comparativo-apple-iphone-15-vs-iphone-16/ | question headings and specs | question-led sections |
| 24 | iPhone 16 BR | Price guide | https://plusdin.com.br/valor-iphone-16/ | updated price and local explanation | checked date on price |
| 25 | iPhone BR | Buying guide | https://ideiasportal.com.br/melhor-iphone-para-comprar-2026/ | budget bands | segment by budget/use |
| 26 | iPhone 16 BR | Buyer guide | https://melhorportal.com.br/iphone-16-e-bom-vale-a-pena-comprar/ | price/camera/battery sections | practical decision headings |
| 27 | iPhone 16 BR | Deal blog | https://macmagazine.com.br/post/2026/03/03/oferta-iphone-16-128gb-por-r4-348-no-pix/ | price first, discount math | never show stale price as current |
| 28 | iPhone 16 BR | Deal explainer | https://igmais.ig.com.br/2026-02-23/oferta-relampago-tem-iphone-16-por-quase-r--4-mil--vale-a-pena-.html | urgency + spec recap | avoid urgency without verification |
| 29 | iPhone 16 BR | Deal guide | https://www.promosnap.com.br/vale-a-pena/vale-a-pena-iphone-16 | yes/no + price caveat | profile fit and price threshold |
| 30 | iPhone guide | Retailer guide | https://ioutlet.pt/que-iphone-comprar-modelos-recomendados-2/ | direct answer, use-case mapping | include condition/battery caveats |
| 31 | Renta ES | Practical explainer | https://www.xataka.com/basics/avisos-hacienda-antes-multarte-renta-2025-estos-que-recibes-hay-errores-tu-declaracion-2026/amp | notice types, dated guide | plain-language warning |
| 32 | Renta ES | Calendar guide | https://www.xataka.com/basics/guia-renta-2025-calendario-pasos-previos-como-prepararte-para-declaracion-2026 | calendar + preparation | dates table/checklist |
| 33 | Renta ES | How-to | https://www.xataka.com/basics/borrador-renta-2025-como-entrar-presentar-online-tu-declaracion-2026-web-agencia-tributaria | step-by-step official path | official path first |
| 34 | Renta ES | Finance guide | https://www.helpmycash.com/guias/203/guia-de-la-declaracion-de-la-renta/ | guide hub, deadline summary | deadline/action summary |
| 35 | Renta ES | Tax service guide | https://taxdown.es/como-hacer-declaracion-renta/como-saber-obligado-hacer-declarar-renta | eligibility question | decision-tree wording |
| 36 | Renta ES | Finance blog | https://www.rankia.com/blog/irpf-declaracion-renta/6726868-como-hacer-declaracion-renta | common errors, obligation rules | add common-mistake section |
| 37 | Renta ES | Calculator guide | https://calculafinanzas.es/guias/declaracion-renta-2025-2026 | step-by-step + deadlines | action sequence |
| 38 | Renta ES | Official source | https://www3.agenciatributaria.gob.es/Sede/Renta.html | official hub | official source first |
| 39 | Renta ES | Official source | https://www.hacienda.gob.es/es-ES/Prensa/Noticias/paginas/2026/20260408-np-aeat-campana-renta-2025.aspx | dates and warnings | do not call notices penalties |
| 40 | Renta ES | Publisher guide | https://elpais.com/economia/2026-03-20/guia-rapida-quien-esta-obligado-a-presentar-la-declaracion-de-la-renta-en-2026-y-quien-no.html | quick eligibility guide | quick eligibility answer |
| 41 | iPhone 18 | Rumor guide | https://www.phonearena.com/iphone-18-release-date-price-features-news | updated date, price/date estimates | confidence labels |
| 42 | iPhone 18 JP | Blog guide | https://apple-gadget.jp/iphone18/ | date/price table, model split | model/date table |
| 43 | iPhone 18 JP | Guide | https://all-connect.co.jp/magazine/iphone_18/ | not-announced caveat | uncertainty warning |
| 44 | iPhone 18 JP | Buying guide | https://www.goodsense.co.jp/iphone/iphone18-matome/ | carrier/reservation context | Japan carrier context |
| 45 | iPhone 18 JP | Mobile guide | https://news.mynavi.jp/sim-mobile/iphone18-release/ | wait-or-buy framing | wait-or-buy section |
| 46 | iPhone 18 | Rumor roundup | https://www.tomsguide.com/phones/iphones/iphone-18-rumors-everything-we-know-so-far | work-in-progress caveat | rumor grouping |
| 47 | iPhone 18 | Rumor explainer | https://www.techradar.com/phones/iphone/iphone-18-rumored-release-schedule-explained-why-there-probably-wont-be-an-iphone-18-this-year-and-when-to-expect-the-iphone-18-pro-iphone-air-2-and-more | schedule explainer | explain confusion plainly |
| 48 | iPhone 18 | Rumor blog | https://www.appleheadlines.com/iphone-18-rumors/ | feature buckets | feature bucket table |
| 49 | iPhone 18 | Rumor guide | https://www.apfelpatient.de/en/generally/iphone-18-all-rumors-at-a-glance | at-a-glance summary | at-a-glance table |
| 50 | iPhone 18 | Consumer guide | https://www.whathifi.com/smartphones-tablets/smartphones/iphone-18-price-and-release-date-predictions-spec-rumours-and-everything-we-know-so-far | prediction labels | local price caveat |
| 51 | KR admission | Korean blog guide | https://ystudy200708.tistory.com/33 | 총정리, 대학별 비교, 표 | 대학별 차이 표 |
| 52 | KR admission | Korean blog guide | https://study-duck.tistory.com/entry/2026-%EB%8C%80%EC%9E%85-%ED%95%99%EA%B5%90%ED%8F%AD%EB%A0%A5-%EA%B8%B0%EB%A1%9D%EC%9D%B4-%EB%8B%B9%EB%9D%BD%EC%9D%84-%EA%B2%B0%EC%A0%95%ED%95%9C%EB%8B%A4-%EB%B0%98%EC%98%81-%EB%B0%A9%EC%8B%9D%EA%B3%BC-%EC%A3%BC%EC%9D%98%EC%A0%90-%EC%B4%9D%EC%A0%95%EB%A6%AC | 질문형 제목, 주의점 | 공포 조장 없이 주의점 |
| 53 | KR admission | Legal blog guide | https://blog.sugar.legal/%ED%95%99%EA%B5%90%ED%8F%AD%EB%A0%A5-%EC%83%9D%EA%B8%B0%EB%B6%80-%EA%B8%B0%EB%A1%9D-2027-%EB%8C%80%EC%9E%85%EC%97%90%EC%84%9C-%EC%96%B4%EB%94%94%EA%B9%8C%EC%A7%80-%EB%B6%88%EB%A6%AC%ED%95%A0%EA%B9%8C-%EC%8B%A4%EC%A0%9C-%ED%83%88%EB%9D%BD-%EA%B8%B0%EC%A4%80-%EC%A0%95%EB%A6%AC-88964 | 법률 리스크, 실제 기준 | 전문가 상담 필요 지점 |
| 54 | KR admission | Education publisher | https://edu.donga.com/news/articleView.html?idxno=84852 | 전형/조치별 차이 | 전형별 확인표 |
| 55 | KR admission | Education publisher | https://www.veritas-a.com/news/articleView.html?idxno=470532 | 전형계획 항목 | 모집요강 확인 항목 |

## Reproducible Query Groups

| Group | Search query | Locale | Count |
|---|---|---:|---:|
| samsung_s90f_review | Samsung S90F OLED review guide should you buy pros cons 2026 | gl=us hl=en | 7 |
| samsung_s90f_comparison | Samsung S90F vs LG C5 OLED review comparison 2026 | gl=us hl=en | 2 |
| best_oled_tv | best OLED TV 2026 buying guide review RTINGS TechRadar Tom's Guide | gl=us hl=en | 6 |
| iphone_16_br | iPhone 16 vale a pena comprar em 2026 Brasil guia review preço | gl=br hl=pt-BR | 12 |
| iphone_16_br_deal | iPhone 16 promoção vale a pena Brasil 2026 cupom garantia loja | gl=br hl=pt-BR | 2 |
| iphone_buying_guide | melhor iPhone para comprar em 2026 Brasil guia | gl=br hl=pt-BR | 1 |
| renta_2025 | Renta 2025 Hacienda avisos antes de multarte guía Xataka OCU 2026 | gl=es hl=es | 10 |
| iphone_18 | iPhone 18 rumors guide everything we know 2026 | gl=us hl=en | 6 |
| iphone_18_jp | iPhone 18 rumors Japan guide 発売日 価格 2026 | gl=jp hl=ja | 4 |
| kr_gaming_monitor | 게이밍 모니터 추천 QHD 180Hz OLED | gl=kr hl=ko | 5 |

## Adopt / Remove Decisions

### Apply Now

- Add a compact trust strip near the top of public posts.
  - Example: "official sources first / checked date / no monetized links."
- Add inline jump links after the direct answer.
  - Example: "Checklist / comparison table / sources."
- Keep answer-first order.
- Keep tables and checklists, but make them support the answer instead of looking like dashboard widgets.
- Keep source cards, with official sources first for policy/tax/admission topics.
- Keep competitor/SERP references internal only.

### Do Not Add

- Public "top pages checked" panels.
- Public SERP-analysis notes.
- Old price/deal CTAs without current verification.
- Automatically inserted affiliate links.
- Dense lab-review dashboards for non-lab articles.

## Patch Criteria

The article renderer should pass these checks:

- At least 50 analyzed pages documented.
- Trust strip visible near article top.
- Inline jump links visible after answer.
- Answer appears before navigation in the DOM.
- Public page does not render SERP research blocks.
- Policy/tax/admission articles lead with official sources.
- Test posts remain noindex until explicit promotion.
