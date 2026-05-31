# Live Trending Frontend Format Analysis - 100+ Top Sites

Date: 2026-05-31

This audit starts from real country-level Google Trends RSS seeds, not prefilled sample topics.

## Scope

- Live trend groups: 21
- Top/primary sites reviewed: 105
- Required minimum: 20 trend groups x 5 sites = 100 pages
- Markets covered: br, ca, de, es, gb, in, it, kr, nl, pl, pt, tr, us
- Trend snapshot: [data/raw/google-trends-rss-snapshot-2026-05-31-frontend-100.json](/home/eorb915/projects/seo_daiki/data/raw/google-trends-rss-snapshot-2026-05-31-frontend-100.json)
- Structured evidence: [data/research/live-trending-frontend-top-sites-2026-05-31.json](/home/eorb915/projects/seo_daiki/data/research/live-trending-frontend-top-sites-2026-05-31.json)

## Method

Start from live country-level Google Trends RSS seeds, select frontend-relevant trend groups, then review five high-ranking or primary pages per trend for information architecture and UI pattern only. No raw Google HTML scraping.

Important limitation: rankings move by location, device, personalization, and freshness. This file stores the query context and the observed/primary pages used for frontend pattern analysis. It does not promise permanent rank positions.

## Live Trend Groups

| Market | RSS trend | RSS rank | Approx traffic | Search query | Why selected |
|---|---|---:|---:|---|---|
| us/en | criminal defense attorney | 7 | 200+ | criminal defense attorney how to choose guide 2026 | US legal-service trend where top pages use checklists, evaluation criteria, and clear next steps. |
| us/en | israel day parade | 8 | 1000+ | Israel Day Parade 2026 guide route schedule NYC | US event trend where top pages prioritize route, schedule, access points, closures, and security notes. |
| gb/en | mortgages | 3 | 200+ | UK mortgage rates 2026 guide best deals compare | UK finance trend where pages win with rate freshness, comparison tables, calculators, and fee warnings. |
| gb/en | savings | 4 | 200+ | UK savings account guide best rates 2026 | UK savings trend where strong pages expose current rates, tax wrapper caveats, and safety limits. |
| gb/en | insurance | 5 | 200+ | UK insurance guide compare 2026 | UK insurance trend where top UX is dominated by comparison cards, calculators, exclusions, and policy warnings. |
| gb/en | marks and spencer uk | 7 | 1000+ | Marks and Spencer UK sale guide returns delivery | UK retail trend where useful pages foreground sale policy, delivery, return windows, and product fit. |
| ca/en | bike for brain health | 1 | 500+ | Bike for Brain Health Toronto 2026 route guide | Canada event trend where route maps, transport disruption, rider kits, and start-line instructions dominate UX. |
| ca/en | weather montreal | 5 | 100+ | weather Montreal forecast guide Environment Canada MeteoMedia | Canada weather trend where top pages use current-condition cards, warning status, hourly tabs, and map modules. |
| es/es | moto gp hoy | 1 | 1000+ | moto gp hoy horario donde ver guia 2026 España | Spain sports-viewing trend where pages win with schedule, channel, streaming, and race context blocks. |
| br/pt-br | pluto tv | 1 | 500+ | Pluto TV Brasil guia canais gratis 2026 | Brazil streaming trend where top pages combine channel lists, free/legal explanation, and device instructions. |
| pt/pt | fisco | 2 | 500+ | fisco Portugal IRS guia 2026 alerta email fraudulento | Portugal tax/security trend where pages foreground warnings, official action, and phishing avoidance. |
| pt/pt | herança | 3 | 200+ | herança Portugal guia imposto selo partilhas | Portugal inheritance trend where strong UX needs legal caveats, calculators, service steps, and official documents. |
| de/de | azoren | 3 | 200+ | Azores travel guide 2026 best islands itinerary | Germany travel trend where guide pages win with itinerary tables, map-like structure, and island-by-island fit. |
| de/de | olympia hamburg | 5 | 500+ | Olympia Hamburg 2026 referendum guide | Germany civic trend where official pages use accessibility links, voting steps, downloads, and side navigation. |
| it/it | bali | 7 | 100+ | Bali travel guide 2026 guida Bali | Italy travel trend where top travel pages use visual hero media, budget boxes, entry checklist, and itinerary sections. |
| nl/nl | nl alert | 6 | 100+ | NL Alert test Netherlands what to do guide | Netherlands public-warning trend where official pages lead with immediate action and accessibility. |
| pl/pl | wizzair | 1 | 100+ | Wizz Air baggage guide 2026 Poland | Poland airline trend where top pages win with baggage dimensions, fee tables, and exception warnings. |
| tr/tr | ozempic | 5 | 200+ | Ozempic nedir yan etkileri rehber Türkiye 2026 | Turkey health trend where safe UX needs medical review, contraindications, and no unsupported weight-loss claims. |
| kr/ko | 백화점 | 3 | 500+ | 백화점 세일 2026 쇼핑 가이드 | Korea retail trend where useful pages clarify sale period, participating stores, returns, and shopping decision cues. |
| in/en | pm kisan | 3 | 200+ | PM Kisan status check official guide 2026 | India government-scheme trend where useful pages must separate official portal actions from unofficial guides. |
| in/en | voter card | 2 | 100+ | Election Commission India voter card apply online official guide 2026 | India voter-service trend where top pages combine official routes, form numbers, document lists, and status tracking. |

## Repeated Frontend Patterns

- **answer_or_status_first**: High-performing guide, public-service, finance, event, and health pages put the usable answer or current status before deep explanation.
  - Apply: Keep the direct-answer block above summaries, tables, and body prose.
- **trust_near_the_top**: Top pages surface reviewed date, official-source basis, author/reviewer, route/source map, or medical/financial caveat near the hero.
  - Apply: Keep the trust strip directly under the hero facts and make it visible on every article route.
- **reader_path_before_dense_content**: The clearest sites give readers a short path: check the current fact, compare the options, then verify the source.
  - Apply: Add a compact reader-path strip between trust evidence and the article body.
- **tables_for_comparison**: Finance, travel, baggage, TV, health, and policy pages rely on tables or compact grids for decisions users compare quickly.
  - Apply: Keep comparison tables prominent and avoid hiding them below long prose.
- **checklists_for_action**: Event, government-service, shopping, health, and travel pages convert uncertainty into checklists or step lists.
  - Apply: Keep checklist UI above the long body and make items visually scannable.
- **public_pages_hide_research_notes**: Public pages do not expose SERP-analysis wording; they turn research into instructions, sources, and caveats.
  - Apply: Keep SERP references internal and do not render research/status language on public article pages.

쉽게 말하면, 상위권/대표 페이지는 예쁜 장식보다 "지금 뭘 확인해야 하는지"를 먼저 보여줍니다. 예를 들어 날씨 페이지는 현재 경보와 시간대별 예보를 먼저 보여주고, 모기지 페이지는 금리 표와 수수료 경고를 먼저 보여줍니다. 우리 글도 같은 방식으로 답, 검토 근거, 다음 행동, 체크리스트, 비교표, 출처 순서가 되어야 합니다.

## Apply / Remove Decisions

### Apply Now

- Keep a direct answer above every dense block.
- Keep the trust strip near the hero.
- Add a reader-path strip: answer -> checklist -> comparison/source verification.
- Use comparison tables and checklists as first-class UI, not as afterthoughts.
- Keep official or primary sources visible in source cards.
- Use market-specific labels and avoid English workflow labels on non-English pages.

### Remove / Avoid

- Do not render SERP-analysis notes publicly.
- Do not show internal trend/status language such as "test_published" or "product candidate pending."
- Do not add affiliate CTAs during this phase.
- Do not use stale deal prices as current facts.
- Do not bury safety/legal/official caveats below long prose.

## 105-Site Inventory

| Market | Trend seed | Position | Page type | Site/page | Frontend signals |
|---|---|---:|---|---|---|
| us/en | criminal defense attorney | 1 | legal guide | How to Choose the Right Criminal Defense Attorney - LegalClarity | plain-language title; need assessment sections; decision checklist |
| us/en | criminal defense attorney | 2 | legal explainer | Choosing the Right Criminal Lawyer: Practical Tips for Defendants - Simpli.com | question headings; bulleted consultation checklist; jurisdiction caveat |
| us/en | criminal defense attorney | 3 | sponsored guide | What to Look for When Picking a Criminal Defense Lawyer - LA Progressive | hero image; author/date; step-by-step selection criteria |
| us/en | criminal defense attorney | 4 | local legal guide | Local Criminal Attorneys: How to Choose the Right Defense - Simpli.com | local relevance framing; verification checklist; realistic expectations |
| us/en | criminal defense attorney | 5 | legal guide | How to Choose a Criminal Defense Lawyer - LegalClarity | direct guide promise; directory/source path; final decision section |
| us/en | israel day parade | 1 | event guide | Record turnout expected at NYC Israel Day Parade - CBS New York | route map; time block; security section |
| us/en | israel day parade | 2 | event explainer | Israel Day Parade 2026: Parade details, road closures and how to watch - FOX 5 NY | what-we-know block; road closures; watch instructions |
| us/en | israel day parade | 3 | event listing | 2026 CELEBRATE ISRAEL PARADE - Uniformed Firefighters Association | date/time details; venue metadata; organizer contact |
| us/en | israel day parade | 4 | official map PDF | Celebrate Israel Parade Route Map - NYC DOT | map-first utility; route/dispersal labels; official source |
| us/en | israel day parade | 5 | local explainer | Israel Day Parade will feature tight security but no Mamdani - NY1 | what-you-need-to-know bullets; image; security context |
| gb/en | mortgages | 1 | finance guide | Mortgage Rates UK 2026 \| Best Deals & How to Compare | rate table; updated month; total-cost warning |
| gb/en | mortgages | 2 | comparison guide | Best UK Mortgage Deals 2026 - Forbes Advisor UK | ranked cards; methodology; editorial ratings |
| gb/en | mortgages | 3 | finance guide | Best Mortgage Rates UK 2026 - PocketWise | rate bands; buyer-type sections; plain-language caveats |
| gb/en | mortgages | 4 | calculator-led guide | UK Mortgage Guide 2026 | calculator context; fee comparison; repayment examples |
| gb/en | mortgages | 5 | broker comparison | Best Mortgage Rates UK - Mortgage Genie | current-rate timestamp; comparison CTA; eligibility framing |
| gb/en | savings | 1 | finance guide | The best cash ISAs - MoneyWeek | rate freshness; tax allowance explanation; in-brief summary |
| gb/en | savings | 2 | finance comparison | Best UK Savings Accounts 2026/27 | table of sections; FSCS note; review date |
| gb/en | savings | 3 | rate guide | Best savings accounts in the UK 2026 - APYData | rate-led headline; account-type comparison; short summary |
| gb/en | savings | 4 | finance guide | Best Savings Rates UK 2026 - PocketWise | rate overview; account-type sections; risk caveats |
| gb/en | savings | 5 | comparison guide | Best Instant Access Savings Accounts In 2026 - Forbes Advisor UK | ranked provider cards; methodology; editorial review |
| gb/en | insurance | 1 | insurance comparison | Best Car Insurance Companies - Forbes Advisor UK | ranked table; review criteria; policy caveats |
| gb/en | insurance | 2 | comparison landing page | Car Insurance - MoneySuperMarket | quote CTA; benefit bullets; trust stats |
| gb/en | insurance | 3 | comparison landing page | Compare Car Insurance - Compare the Market | form-first layout; coverage explanation; FAQ accordion |
| gb/en | insurance | 4 | comparison landing page | Car Insurance - Go.Compare | step-by-step quote path; coverage cards; support FAQs |
| gb/en | insurance | 5 | consumer advice hub | Insurance guides - Which? | category hub; expert advice; buyer protection framing |
| gb/en | marks and spencer uk | 1 | retail help page | Returns and Refunds - M&S | policy answer first; sale return exception; FAQ structure |
| gb/en | marks and spencer uk | 2 | retail help page | Delivery - M&S | delivery option cards; exceptions; support hierarchy |
| gb/en | marks and spencer uk | 3 | retail category page | Sale - M&S | category filters; sale navigation; product grid |
| gb/en | marks and spencer uk | 4 | shopping guide | Marks and Spencer coats - Woman & Home | expert intro; product roundup; return-policy context |
| gb/en | marks and spencer uk | 5 | support hub | M&S Help and Support | topic hub; search/help entry; clear service categories |
| ca/en | bike for brain health | 1 | official event page | Mattamy Homes Bike for Brain Health | route maps; registration CTA; cause explanation |
| ca/en | bike for brain health | 2 | route map | Bike for Brain Health 2026 - Trailforks | map-first route; distance/difficulty metadata; local trail context |
| ca/en | bike for brain health | 3 | event listing | Bike for Brain Health - Festivals Toronto | date/location summary; short description; city-event format |
| ca/en | bike for brain health | 4 | rider PDF | Bike for Brain Health Rider Kit | pre-event checklist; route plan; participant instructions |
| ca/en | bike for brain health | 5 | local service explainer | Toronto weekend road and transit closures - CBC | closure list; event context; practical planning |
| ca/en | weather montreal | 1 | official weather page | Montreal Forecast - Environment Canada | current conditions; alerts; forecast table |
| ca/en | weather montreal | 2 | weather dashboard | Montreal Weather - The Weather Network | hourly/daily tabs; map modules; condition cards |
| ca/en | weather montreal | 3 | weather dashboard | Montreal Weather - MétéoMédia | localized forecast; warning modules; visual cards |
| ca/en | weather montreal | 4 | local weather impact page | Tour la Nuit called off as severe weather hits Montreal - Montreal Gazette | event impact first; updated status; local context |
| ca/en | weather montreal | 5 | alert explainer | Severe thunderstorm warning issued for Montreal area - CTV News | warning first; timing; safety context |
| es/es | moto gp hoy | 1 | viewing guide | Horario Moto GP hoy - LOS40 | time answer first; where-to-watch section; race context |
| es/es | moto gp hoy | 2 | official schedule | HORARIOS: Gran Premio Estrella Galicia 0,0 de España - MotoGP | official source; schedule table; event framing |
| es/es | moto gp hoy | 3 | streaming guide | MotoGP 2026: Horarios, TV y dónde ver - ADSLZone | platform comparison; season-wide guidance; FAQ structure |
| es/es | moto gp hoy | 4 | sports guide | GP de Italia de MotoGP: canal TV, horarios, cómo y dónde ver - AS | channel/time blocks; live context; event-specific headline |
| es/es | moto gp hoy | 5 | specialist guide | Horario MotoGP del GP de España 2026 - Motorbike Magazine | event schedule; how-to-watch; enthusiast context |
| br/pt-br | pluto tv | 1 | streaming guide | Pluto TV: Como assistir séries e filmes grátis oficialmente - Tecnoup | updated guide; legal/free explanation; device instructions |
| br/pt-br | pluto tv | 2 | consumer guide | Pluto TV é GRÁTIS? - Minha Conexão | answer-first title; channel examples; updated date |
| br/pt-br | pluto tv | 3 | catalog update | Pluto TV lança seis novos canais - TV Pop | new-channel list; catalog context; date freshness |
| br/pt-br | pluto tv | 4 | reference list | List of channels on Pluto TV Brazil - TV Channel Lists | long channel table; categorized listing; reference format |
| br/pt-br | pluto tv | 5 | official app page | Pluto TV Brasil | live channel grid; watch CTA; visual browsing |
| pt/pt | fisco | 1 | public-service news explainer | Fisco alerta para e-mail fraudulento - RTP | warning first; source quote; what not to do |
| pt/pt | fisco | 2 | fraud explainer | Fisco alerta para e-mails e SMS falsos - RTP | risk summary; official-source basis; prevention steps |
| pt/pt | fisco | 3 | public-service explainer | Fisco alerta para mensagens fraudulentas - Diário de Notícias | short alert format; fraud warning; official attribution |
| pt/pt | fisco | 4 | official alert PDF | Portal das Finanças phishing alert PDF | official warning; security checklist; source authority |
| pt/pt | fisco | 5 | tax-scam reference | A deeper dive into the Dirty Dozen - IRS | scam taxonomy; action bullets; official public-service layout |
| pt/pt | herança | 1 | official service page | Pedir a partilha e registo da herança - gov.pt | eligibility questions; documents section; service CTA |
| pt/pt | herança | 2 | calculator tool | Simulador de Heranças - Orçamento Fácil | input-driven UI; legal basis; reviewed date |
| pt/pt | herança | 3 | finance/legal guide | Quem é obrigado a pagar o imposto sobre herança? - ComparaJá | answer-first topic; exceptions; plain-language examples |
| pt/pt | herança | 4 | professional PDF guide | Guia Prático Heranças - OCC | FAQ format; official/professional source; procedural detail |
| pt/pt | herança | 5 | calculator tool | Inheritance tax calculator - Partida Final | calculator first; stamp-duty explanation; scenario output |
| de/de | azoren | 1 | travel itinerary guide | Complete Azores Island Hopping Guide - Travel Azores | itinerary blocks; island-by-island grouping; route logistics |
| de/de | azoren | 2 | travel guide | Which Islands to Visit in the Azores? - Geeky Explorer | style-based recommendations; island comparison; updated date |
| de/de | azoren | 3 | official destination hub | Visit Azores | visual destination cards; official navigation; planning categories |
| de/de | azoren | 4 | travel hub | Azores Getaways | package-oriented UX; destination overview; visual itinerary cards |
| de/de | azoren | 5 | destination guide | The Azores - Lonely Planet | overview first; things-to-do sections; travel planning hierarchy |
| de/de | olympia hamburg | 1 | official referendum page | Informationen zum Olympia-Referendum 2026 - hamburg.de | official date/time; download block; accessibility links |
| de/de | olympia hamburg | 2 | official notice | Wichtige Hinweise vor der Abstimmung - hamburg.de | action timing; threshold explanation; contact path |
| de/de | olympia hamburg | 3 | official campaign explainer | Ihre Stimme für Olympia und Paralympics in Hamburg - hamburg.de | how-to-vote section; plain-language support; official story flow |
| de/de | olympia hamburg | 4 | civic explainer | Olympia-Bewerbung: Deine Stadt, deine Stimme, deine Spiele - hamburg.de | public participation framing; benefit sections; official visuals |
| de/de | olympia hamburg | 5 | reference page | Bürgerschaftsreferendum von 2026 - Wikipedia | structured reference; context links; neutral chronology |
| it/it | bali | 1 | travel guide | Bali Travel Guide 2026 | budget planner; itinerary map mention; long table of contents |
| it/it | bali | 2 | resident guide | Viajar a Bali en 2026 - En Bali | updated label; local expertise; planning checklist |
| it/it | bali | 3 | destination guide | Bali travel guide - Lonely Planet | visual destination hub; things to do; planning hierarchy |
| it/it | bali | 4 | destination guide | Bali Travel Guide - Travel + Leisure | hero image; best-time sections; where-to-stay flow |
| it/it | bali | 5 | local travel guide | Bali Holiday Secrets | local tips; destination navigation; planning cards |
| nl/nl | nl alert | 1 | official public-warning hub | NL-Alert Home | current/test message; what to do; app/support blocks |
| nl/nl | nl alert | 2 | official FAQ | Wat moet ik doen als de sirene gaat? - Rijksoverheid | question title; step-by-step instructions; accessibility read-aloud |
| nl/nl | nl alert | 3 | official FAQ | What should I do when the public warning siren sounds? - Government.nl | English alternate; action bullets; official answer |
| nl/nl | nl alert | 4 | official factsheet PDF | Factsheet NL-Alert | one-page summary; visual warning example; test-message explanation |
| nl/nl | nl alert | 5 | reference page | NL-Alert - Wikipedia | history/context; usage explanation; neutral structure |
| pl/pl | wizzair | 1 | travel insurance guide | Wizz Air bagaż podręczny i rejestrowany - Rankomat | dimension answer first; reviewer/author; important-info bullets |
| pl/pl | wizzair | 2 | baggage reference | Wizz Air 2026 Zasady bagażowe - BaggyOne | allowance data; airline-specific route; compact rules |
| pl/pl | wizzair | 3 | baggage guide | Wizz Air Cabin Baggage & Hand Luggage Allowance | 2026 guide label; FAQ answers; packing advice |
| pl/pl | wizzair | 4 | baggage guide | Wizz Air bagaż 2026 - Meteoreporter | how to avoid fees; dimensions; fee warnings |
| pl/pl | wizzair | 5 | official airline guide | Wizz Air Baggage | official policy; fee/allowance modules; service hierarchy |
| tr/tr | ozempic | 1 | hospital health guide | GLP-1 İlaçlar Ozempic gibi Nedir? - Anadolu Sağlık | medical publication board; update date; general-information disclaimer |
| tr/tr | ozempic | 2 | doctor-authored guide | Semaglutid Ozempic Nedir? - Prof. Dr. Mustafa Özdoğan | approval status; side-effect profile; contraindication warnings |
| tr/tr | ozempic | 3 | medically reviewed health guide | Ozempic Side Effects - Healthline | medical reviewer; key takeaways; warning sections |
| tr/tr | ozempic | 4 | drug reference | Ozempic Side Effects to Watch For - Drugs.com | official answer format; review date; side-effect bullets |
| tr/tr | ozempic | 5 | drug reference | Ozempic Side Effects: Common, Serious and Long Term - Drugs.com | long side-effect list; review attribution; severity grouping |
| kr/ko | 백화점 | 1 | retail event explainer | 백화점 3사 봄 세일 돌입 - 네이트 뉴스 | sale dates; brand participation; event context |
| kr/ko | 백화점 | 2 | retail trend explainer | 트렌드+ 봄날엔 쇼핑 - Daum | campaign image; store comparison; seasonal shopping context |
| kr/ko | 백화점 | 3 | retail event explainer | 백화점 3사, 봄 정기 세일 돌입 - Daum | date answer; department-store comparison; promotion summary |
| kr/ko | 백화점 | 4 | shopping guide | 2026 백화점 가을세일 가격 보장 및 환불 교환 팁 | tips headline; refund/exchange focus; consumer decision framing |
| kr/ko | 백화점 | 5 | shopping blog guide | 백화점 아기옷 브랜드 완벽 가이드 2026 | category guide; brand comparison; consumer checklist potential |
| in/en | pm kisan | 1 | official scheme page | PM-Kisan Samman Nidhi | official status; beneficiary tools; eligibility notices |
| in/en | pm kisan | 2 | scheme guide | How to Check PM Kisan Beneficiary Status by Mobile Number - SMC Insurance | step-by-step path; installment context; last updated date |
| in/en | pm kisan | 3 | scheme guide | PM Kisan Status Check by Aadhaar & Mobile - Kisan Portal | official-channel warning; problem diagnosis; step list |
| in/en | pm kisan | 4 | citizen guide | How to check PM-KISAN beneficiary status - RTI Wiki | official portal instruction; status history; disclaimer |
| in/en | pm kisan | 5 | status guide | PM Kisan Beneficiary Status | status CTA; installment summary; beneficiary-list framing |
| in/en | voter card | 1 | citizen service guide | New Voter Card Apply Online - WBCareer | step-by-step title; official website path; verification status |
| in/en | voter card | 2 | service guide | Voter ID Card 2026 - ClearTax | document requirements; status tracking; application process |
| in/en | voter card | 3 | official service portal | Voters' Services Portal | form/service navigation; login/service CTA; official authority |
| in/en | voter card | 4 | official hub | Election Commission of India | official notices; navigation hierarchy; download resources |
| in/en | voter card | 5 | official PDF guide | Voter Guide Booklet - Maharashtra CEO | official guidebook; registration path; download format |
