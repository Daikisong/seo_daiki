# Current Market Trend Top-5 SEO Comparison

Date: 2026-06-02  
Scope: 18 enabled markets in `data/config/markets.json`  
Trend source: Google Trends public Trending RSS by market  
Search method: live web search result review plus official/primary page confirmation. No raw Google HTML scraping.

## Short Verdict

우리 웹사이트는 **SEO 구조의 방향은 좋다.** 특히 다음은 상위권 사이트의 기본 형식과 맞다.

```text
시장별 silo
review/news 분기
상단 신뢰 정보
바로 답 / 핵심 요약
목차
체크리스트
비교표
출처 카드
내부 연구 문구 비공개
```

하지만 지금 상태가 바로 “여러 나라 트렌드 상위권 사이트급”은 아니다.

가장 큰 차이는 이것이다.

```text
상위 사이트:
  공식 데이터, 실시간성, 브랜드 권위, 오래 쌓인 내부 링크, 주제별 콘텐츠 깊이가 있음.

우리 사이트:
  화면 구조는 좋아졌지만 실제 게시물은 7개, 커버 마켓은 5개뿐이고,
  18개 마켓별 topical authority와 실시간 데이터/공식 연동은 아직 부족함.
```

쉽게 예를 들면, `KBO 올스타 팬투표` 글을 우리도 예쁘게 쓸 수는 있다. 하지만 KBO 공식 사이트, 네이버 스포츠, 연합뉴스 같은 사이트는 이미 공식성/속보성/링크 권위가 있다. 그래서 우리는 그런 사이트를 그대로 이기려 하기보다, “후보 확인 방법 + 일정 + 투표 전 체크할 것 + 공식 링크”처럼 **정리형 보조 검색 의도**를 먹는 쪽이 현실적이다.

## Our Current Site Baseline

Local verification from `data/exports/seo_article_quality_report.json`:

```text
seo:article-quality passed: true
minimum article quality score: 100
test articles: 7
review articles: 4
news articles: 3
covered markets: br/pt-br, es/es, jp/ja, kr/ko, us/en
```

Current public route examples:

```text
/kr/ko/reviews/
/kr/ko/news/
/jp/ja/reviews/
```

Current strengths:

- Review detail pages have hero image, review summary, method strip, reader path, checklist, comparison table, source cards, and Article JSON-LD.
- News detail pages have focused news layout, key points, table of contents, source/correction block, and NewsArticle JSON-LD.
- Market pages are split into review and news sections, so product-review content and information/news content are not mixed.
- Public pages hide internal SERP/trend workflow wording.

Current weaknesses:

- 18 markets exist as routes, but not all 18 have real current articles.
- The site has no historical authority, backlinks, user signals, or brand trust yet.
- Many top-ranking topics need live data modules: weather, TV schedule, stock price, sports fixture, flight status, gold price.
- Official-source topics are hard to outrank directly. We need summary/checklist/verification intent rather than pretending to be the primary source.
- Many articles are still test/noindex by policy. Noindex pages cannot rank until promoted.

## Market-by-Market Comparison

### 1. US / en

Selected trend: `Fortnite`  
Trend RSS: `https://trends.google.com/trending/rss?geo=US`  
Search query used: `Fortnite current update guide best weapons 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Fortnite News](https://www.fortnite.com/news) | Official source, newest updates, images, strong brand authority. |
| [Epic Games Fortnite Support](https://www.epicgames.com/help/en-US/c-202300000001636) | Official troubleshooting answers, structured support taxonomy. |
| [Epic Developer Community Fortnite docs](https://dev.epicgames.com/documentation/en-us/fortnite) | Deep release notes, developer-specific long-tail coverage. |
| [IGN Fortnite Wiki](https://www.ign.com/wikis/fortnite) | Long-lived guide hub, internal links, evergreen explainers. |
| [Dexerto Fortnite](https://www.dexerto.com/fortnite/) | Fast news cadence, gaming audience authority, guide/news mix. |

Gap vs us:

- We can match guide layout, but not official patch authority.
- Needed: update timeline, official source cards, “what changed / what to do now” blocks, game-specific screenshots.
- Best route: `news` or `guide`, not affiliate review.

### 2. GB / en

Selected trend: `ITVX`  
Trend RSS: `https://trends.google.com/trending/rss?geo=GB`  
Search query used: `ITVX TV guide how to watch live schedule UK 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [ITVX TV Guide](https://www.itv.com/watch/tv-guide) | Official schedule, live utility, exact user intent. |
| [ITVX Categories](https://www.itv.com/watch/categories) | Official browsing UX, strong internal linking. |
| [ITVX Help](https://help.itv.com/hc/en-us) | Troubleshooting and account/device intent coverage. |
| [Radio Times TV Listings](https://www.radiotimes.com/tv/tv-listings/) | TV guide authority, updated listings, strong UK brand. |
| [TVGuide.co.uk](https://www.tvguide.co.uk/) | Dense schedule data, channel filtering, daily repeat use. |

Gap vs us:

- Top pages win with live schedule data. A static article is weaker.
- Needed: schedule table or “where to watch today” module.
- Best route: `news`/utility guide. Product links are unnatural.

### 3. CA / en

Selected trend: `TSX`  
Trend RSS: `https://trends.google.com/trending/rss?geo=CA`  
Search query used: `TSX today market news Canada stock market June 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [TMX Money](https://money.tmx.com/) | Primary market data, live quotes, official market ecosystem. |
| [Toronto Stock Exchange](https://www.tsx.com/) | Exchange authority and official listings context. |
| [The Globe and Mail Markets](https://www.theglobeandmail.com/investing/markets/) | Finance authority, market commentary, watchlists. |
| [BNN Bloomberg](https://www.bnnbloomberg.ca/) | Financial news brand, fast updates, expert framing. |
| [Investing.com Canada TSX](https://ca.investing.com/indices/s-p-tsx-composite) | Live chart, data tables, technical indicators. |

Gap vs us:

- Finance topics need live numbers and disclaimers.
- We should not publish stale “TSX today” without timestamps.
- Best route: market explainer with source links, not price prediction.

### 4. AU / en

Selected trend: `Cook Islands`  
Trend RSS: `https://trends.google.com/trending/rss?geo=AU`  
Search query used: `Cook Islands travel guide 2026 best time itinerary`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Cook Islands Official Tourism](https://www.cookislands.travel/) | Official destination authority, visual planning cards. |
| [Smartraveller Cook Islands](https://www.smartraveller.gov.au/destinations/pacific/cook-islands) | Official Australian travel advice and safety updates. |
| [Lonely Planet Cook Islands](https://www.lonelyplanet.com/cook-islands) | Destination authority, things-to-do hierarchy. |
| [Australian Traveller Cook Islands](https://www.australiantraveller.com/oceania/cook-islands/) | AU-local angle, visual travel editorial format. |
| [Tripadvisor Cook Islands](https://www.tripadvisor.com/Tourism-g294328-Cook_Islands-Vacations.html) | Reviews, hotel/activity data, user-generated trust. |

Gap vs us:

- Travel content needs images, maps, itinerary tables, safety/advice links.
- We can compete on “first-time checklist from Australia” long-tail, not official destination hub.

### 5. ES / es

Selected trend: `Iberia`  
Trend RSS: `https://trends.google.com/trending/rss?geo=ES`  
Search query used: `Iberia baggage flight status guide Spain 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Iberia Equipaje](https://www.iberia.com/es/equipajes/) | Official rules, baggage categories, direct booking context. |
| [Iberia Estado de vuelos](https://www.iberia.com/es/estado-vuelos/) | Official flight status utility. |
| [Iberia Gestiona tu reserva](https://www.iberia.com/es/gestion-de-reservas/) | Official account/action path. |
| [AENA Vuelos](https://www.aena.es/es/pasajeros/vuelos.html) | Airport authority, live flight data. |
| [Skyscanner ES](https://www.skyscanner.es/noticias/) | Travel search authority, explanatory guides. |

Gap vs us:

- Official airline/airport utilities dominate.
- Our useful angle: “what to check before leaving” checklist with official links.
- Needs Spanish labels, baggage table, airport/flight-status source cards.

### 6. MX / es

Selected trend: `VivaAerobus / Volaris`  
Trend RSS: `https://trends.google.com/trending/rss?geo=MX`  
Search query used: `VivaAerobus Volaris equipaje de mano 2026 México guía`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Viva Aerobus Equipaje](https://www.vivaaerobus.com/es-mx/informacion-para-tu-viaje/equipaje) | Official baggage rules and upsell path. |
| [Volaris Equipaje](https://www.volaris.com/informacion-de-viaje/equipaje/) | Official baggage dimensions and policy. |
| [Aeromexico Equipaje](https://aeromexico.com/es-mx/informacion-de-viaje/equipaje) | Official airline authority and comparison context. |
| [Skyscanner México](https://www.espanol.skyscanner.com/noticias/) | Travel advice authority, comparison-style explainers. |
| [KAYAK México Travel Guides](https://www.kayak.com.mx/news/) | Travel search authority, practical user intent. |

Gap vs us:

- This is a strong review/comparison candidate.
- Needed: airline baggage comparison table, fee warnings, official checked date.
- Product links are secondary; travel accessories could be suggested only after article proves demand.

### 7. BR / pt-br

Selected trend: `Pluto TV`  
Trend RSS: `https://trends.google.com/trending/rss?geo=BR`  
Search query used: `Pluto TV Brasil canais grátis 2026 guia`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Pluto TV Brasil](https://pluto.tv/br/live-tv) | Official streaming service and channel grid. |
| [Canaltech](https://canaltech.com.br/) | Strong tech authority and explainers. |
| [TechTudo](https://www.techtudo.com.br/) | Brazilian consumer-tech SEO authority. |
| [TudoCelular](https://www.tudocelular.com/) | App/device news authority. |
| [TV Channel Lists Pluto TV Brazil](https://www.tvchannellists.com/) | Long channel-list reference format. |

Gap vs us:

- Top pages either have official channel grid or strong tech brand.
- Our angle: device setup guide + channel categories + free/legal explanation.
- Needs screenshots or visual channel cards.

### 8. PT / pt

Selected trend: `greve geral`  
Trend RSS: `https://trends.google.com/trending/rss?geo=PT`  
Search query used: `greve geral Portugal 2026 o que saber`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [RTP Notícias](https://www.rtp.pt/noticias/) | Public broadcaster authority, fast updates. |
| [Observador](https://observador.pt/) | Live/news analysis format, Portugal audience. |
| [Público](https://www.publico.pt/) | Newspaper authority and deep reporting. |
| [SIC Notícias](https://sicnoticias.pt/) | Broadcast news authority and live coverage. |
| [CNN Portugal](https://cnnportugal.iol.pt/) | Breaking news format and recognisable brand. |

Gap vs us:

- We cannot beat live news on speed/authority.
- Possible angle: “what services are affected + what to check before travel/work” with official links.
- Best route: `news`, no affiliate.

### 9. FR / fr

Selected trend: `Antigua`  
Trend RSS: `https://trends.google.com/trending/rss?geo=FR`  
Search query used: `Antigua et Barbuda voyage guide 2026 français`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [France Diplomatie - Antigua-et-Barbuda](https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/antigua-et-barbuda/) | Official French travel safety advice. |
| [Le Routard Antigua-et-Barbuda](https://www.routard.com/) | French travel guide authority and local categories. |
| [Petit Futé Antigua-et-Barbuda](https://www.petitfute.com/) | French guidebook authority, destination cards. |
| [Lonely Planet France](https://www.lonelyplanet.fr/) | Travel authority, itinerary hierarchy. |
| [Tripadvisor Antigua](https://www.tripadvisor.fr/) | Review depth, hotel/activity data. |

Gap vs us:

- Travel needs image-first guide, safety source, weather/season, budget table.
- We can compete on “quick planning checklist in French” long-tail.

### 10. DE / de

Selected trend: `iPhone 18`  
Trend RSS: `https://trends.google.com/trending/rss?geo=DE`  
Search query used: `iPhone 18 rumors release date specs 2026 Germany`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [MacRumors iPhone 18](https://www.macrumors.com/roundup/iphone-18/) | Apple rumor authority, updated roundup format. |
| [9to5Mac](https://9to5mac.com/) | Apple news authority and fast updates. |
| [heise online](https://www.heise.de/) | German tech authority and editorial trust. |
| [GIGA](https://www.giga.de/) | German consumer-tech explainer format. |
| [Computer Bild](https://www.computerbild.de/) | German mainstream tech authority. |

Gap vs us:

- Good product-review/comparison candidate, but rumor safety matters.
- Needed: rumor vs confirmed table, source confidence labels, German retail context.
- Product links should wait until product/offer exists.

### 11. IT / it

Selected trend: `meteo Brescia`  
Trend RSS: `https://trends.google.com/trending/rss?geo=IT`  
Search query used: `meteo Brescia oggi previsioni 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [ilMeteo Brescia](https://www.ilmeteo.it/meteo/Brescia) | Weather-specialist authority, hourly forecast tables. |
| [3B Meteo Brescia](https://www.3bmeteo.com/meteo/brescia) | Local weather dashboard, maps, warnings. |
| [Meteo.it Brescia](https://www.meteo.it/meteo/brescia) | Weather brand, day/hour modules. |
| [ARPA Lombardia](https://www.arpalombardia.it/) | Official regional weather/environment source. |
| [AccuWeather Brescia](https://www.accuweather.com/) | Global weather data, hourly/daily UX. |

Gap vs us:

- Weather ranking needs live data and forecast modules.
- Our site should avoid generic weather pages unless it has a provider/data contract.
- Best use: explain impacts/checklist around a weather event, not replace weather dashboard.

### 12. NL / nl

Selected trend: `tv gids`  
Trend RSS: `https://trends.google.com/trending/rss?geo=NL`  
Search query used: `tv gids vandaag Nederland programma overzicht`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [TVgids.nl](https://www.tvgids.nl/) | Daily TV schedule database and channel filters. |
| [Gids.tv](https://www.gids.tv/) | Current listings plus news/explainers. |
| [Veronica Superguide](https://www.veronicasuperguide.nl/tv-gids) | TV guide brand and schedule UX. |
| [Ziggo TV Gids](https://www.ziggo.nl/televisie/tv-gids) | Provider authority and channel data. |
| [NPO Start Gids](https://www.npostart.nl/gids) | Public broadcaster schedule and official streaming path. |

Gap vs us:

- TV guide intent is utility/database intent.
- Static article can only win “how to use / where to watch” long-tail.
- Needs schedule feed or links to official schedule pages.

### 13. PL / pl

Selected trend: `program tv`  
Trend RSS: `https://trends.google.com/trending/rss?geo=PL`  
Search query used: `program tv dzisiaj Polska przewodnik`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Program TV Onet](https://programtv.onet.pl/) | Big Polish portal, daily schedule data. |
| [Teleman](https://www.teleman.pl/) | Dedicated TV listings and filters. |
| [WP Program TV](https://programtv.wp.pl/) | Major portal authority and listings. |
| [TVP Program](https://www.tvp.pl/program-tv) | Official broadcaster schedule. |
| [Polsat Program TV](https://www.polsat.pl/program-tv/) | Official broadcaster schedule. |

Gap vs us:

- Same as NL: data utility beats article.
- Our realistic article: “where to check today’s schedule + platform comparison.”

### 14. TR / tr

Selected trend: `Anadolu Efes`  
Trend RSS: `https://trends.google.com/trending/rss?geo=TR`  
Search query used: `Anadolu Efes Fenerbahçe final serisi 2026 ne zaman`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Anadolu Efes official](https://www.anadoluefessk.org/) | Club authority, fixtures, roster/news. |
| [Türkiye Basketbol Federasyonu](https://www.tbf.org.tr/) | Official league/federation authority. |
| [SofaScore Anadolu Efes](https://www.sofascore.com/) | Live score/stat utility. |
| [Fanatik](https://www.fanatik.com.tr/) | Turkish sports news authority. |
| [NTV Spor](https://www.ntvspor.net/) | Sports news authority and live updates. |

Gap vs us:

- Sports trend needs fixture, score, roster, TV info.
- We can make a “schedule/where to watch/checklist” explainer, but not beat live-score pages.

### 15. ID / id

Selected trend: `harga emas Antam`  
Trend RSS: `https://trends.google.com/trending/rss?geo=ID`  
Search query used: `harga emas Antam hari ini 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Logam Mulia Antam](https://www.logammulia.com/) | Official gold price source. |
| [Pegadaian Harga Emas](https://www.pegadaian.co.id/) | Financial service authority and current price tables. |
| [CNBC Indonesia](https://www.cnbcindonesia.com/market) | Finance news authority and price context. |
| [Bisnis.com](https://market.bisnis.com/) | Business-news authority and updated market pages. |
| [Kontan](https://investasi.kontan.co.id/) | Indonesian investing/market authority. |

Gap vs us:

- Needs live price timestamp and official source.
- We can compete with “how to read Antam price / buyback / spread” explainer, not live price page.

### 16. JP / ja

Selected trend: `ファミマ`  
Trend RSS: `https://trends.google.com/trending/rss?geo=JP`  
Search query used: `ファミマ 新商品 2026 6月 おすすめ`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [ファミリーマート 新商品](https://www.family.co.jp/goods/newgoods.html) | Official product list, freshness, images. |
| [ファミリーマート キャンペーン](https://www.family.co.jp/campaign.html) | Official campaign/source authority. |
| [えん食べ](https://entabe.jp/) | Japanese food-news authority, product photos. |
| [もぐナビ](https://mognavi.jp/) | User review database and food product listings. |
| [ASCII.jp](https://ascii.jp/) | Japanese tech/lifestyle news authority, product coverage. |

Gap vs us:

- Product/news mix is strong, but we need images and real product data.
- Good route: `news` for campaign/new items, `review` only after product comparison exists.

### 17. KR / ko

Selected trend: `KBO 올스타 투표`  
Trend RSS: `https://trends.google.com/trending/rss?geo=KR`  
Search query used: `KBO 올스타 팬투표 2026 후보 일정 공식`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [KBO 공식 사이트](https://www.koreabaseball.com/) | Official schedule, player, event authority. |
| [네이버 스포츠 KBO](https://sports.news.naver.com/kbaseball/index) | Huge sports portal authority and live news. |
| [연합뉴스 스포츠](https://www.yna.co.kr/sports/all) | News authority and fast syndication. |
| [SPOTV NEWS](https://www.spotvnews.co.kr/) | Sports media authority and event coverage. |
| [OSEN](https://www.osen.co.kr/) | Sports/entertainment news authority and headline freshness. |

Gap vs us:

- We cannot beat official portal or Naver on raw event/news authority.
- Our best angle: concise checklist, dates, voting method, official links, common confusion.
- No product monetization.

### 18. IN / en

Selected trend: `Oracle share price`  
Trend RSS: `https://trends.google.com/trending/rss?geo=IN`  
Search query used: `Oracle share price today India live chart analysis 2026`

Observed top/primary pages:

| Page | Why it can rank |
|---|---|
| [Yahoo Finance ORCL](https://finance.yahoo.com/quote/ORCL/) | Live quote, chart, news, financial data. |
| [Nasdaq ORCL](https://www.nasdaq.com/market-activity/stocks/orcl) | Exchange/market authority and quote history. |
| [Google Finance ORCL](https://www.google.com/finance/quote/ORCL:NYSE) | Live quote utility and market graph. |
| [The Economic Times Markets](https://economictimes.indiatimes.com/markets) | India finance authority and local investor context. |
| [Moneycontrol Markets](https://www.moneycontrol.com/) | Indian market audience, charts, news, watchlists. |

Gap vs us:

- Finance query needs live quote, chart, legal caveat, timestamp.
- Our safe angle: “why Indian users are searching ORCL today + where to verify price.”
- Avoid financial advice or target-price claims.

## Cross-Market Patterns From Top Sites

Across these 18 markets, top pages repeatedly win for six reasons.

### 1. Official or primary data source

Examples:

```text
Iberia baggage / flight status
KBO official
Antam official gold price
ITVX TV guide
TMX market data
FamilyMart new products
```

Our implication:

```text
We should not pretend to be the primary source.
We should link to primary sources and explain what to check.
```

### 2. Freshness and timestamp

Top pages expose current date, update time, live score, current price, or latest schedule.

Our implication:

```text
Every trend article needs:
- checked date
- source checked date
- what changed
- what is still unknown
```

### 3. Utility modules beat plain prose

Top pages use:

```text
weather cards
TV schedules
flight status widgets
stock charts
gold price tables
route maps
fixture tables
channel grids
```

Our implication:

```text
Plain article pages are not enough for all trends.
For utility-intent trends, either add a module or target a narrower explainer query.
```

### 4. Strong visual evidence

Travel, retail, gaming, convenience-store, and product pages use images heavily.

Our implication:

```text
Our review page direction is good, but news pages need optional image/media slots too.
```

### 5. Topical authority and internal links

Top sites have clusters:

```text
Fortnite news -> weapons -> patch notes -> support
ITVX -> schedule -> shows -> help
Travel -> destination -> itinerary -> safety -> hotels
Finance -> quote -> chart -> news -> analysis
```

Our implication:

```text
One article per market is not enough.
Each trend needs 3-5 supporting pages or at least internal links to related guides.
```

### 6. Clear branch selection

Top pages are not all the same shape.

```text
Review/comparison:
  product, airline baggage, iPhone rumor, travel gear

News/information:
  strike, KBO vote, weather, TV guide, stock price, public service
```

Our implication:

```text
The current review/news branch is correct.
But branch-specific templates need deeper modules.
```

## Our Site Score Against Top-Site Patterns

| Area | Current score | Reason |
|---|---:|---|
| Market silo SEO structure | 8/10 | 18 market routes exist and structure is clean. |
| Review article format | 8/10 | Good hero, table, checklist, trust strip, source cards. |
| News article format | 6.5/10 | Clean, but needs optional image, status card, timeline/table modules. |
| Current trend coverage | 3/10 | Only 7 articles across 5 markets. |
| Topical authority | 2/10 | Not enough content clusters yet. |
| Official/live data integration | 2/10 | Most trend categories need live or primary-source data. |
| Localization | 6.5/10 | UI labels improved, but every market needs real local articles. |
| E-E-A-T / trust | 5/10 | Source cards and dates exist, but no real brand/history/backlinks. |
| Index readiness | 4/10 | Quality is good, but test/noindex policy means ranking cannot start yet. |
| Overall SEO competitiveness today | 5/10 | Good foundation, not yet a top-site competitor. |

## What To Fix Before Trying To Rank

### P0: Pick realistic search intent per trend

Do not write generic pages for primary-source queries.

Examples:

```text
Bad:
  "TSX today" without live data

Better:
  "TSX가 오늘 검색되는 이유와 확인해야 할 공식 지표"

Bad:
  "meteo Brescia" without forecast data

Better:
  "Brescia 날씨 경보가 있을 때 출근/여행 전 확인할 곳"
```

### P0: Add branch-specific modules

News needs:

```text
status card
timeline
official links box
what changed / what to check
affected users
source freshness
```

Review needs:

```text
comparison table
buyer checklist
score/method
product image
source/price checked date
alternatives
```

Utility trends need:

```text
schedule table
price table
weather/source widget
flight status links
map/route card
```

### P1: Build content clusters per market

Minimum practical cluster:

```text
1 main trend article
2 supporting explainers
1 official-source checklist
1 comparison/FAQ page if product-like
```

Example for KR KBO:

```text
/kr/ko/news/kbo-allstar-vote-2026/
/kr/ko/news/kbo-allstar-vote-how-to-check-candidates/
/kr/ko/news/kbo-allstar-game-schedule/
/kr/ko/news/kbo-app-voting-guide/
```

### P1: Expand real articles to all 18 markets

Current article coverage is too small.

```text
Need:
  at least 1 current article per market
  then 3-5 related articles for promising markets
```

### P1: Add source refresh discipline

Every public article should show:

```text
last checked
primary source
what changed
what is still unconfirmed
when to re-check
```

## Final Assessment

현재 우리 웹사이트는 **SEO 상위권 사이트처럼 보이기 위한 구조는 많이 갖췄다.**

하지만 실제로 상위에 올라가려면 다음이 더 필요하다.

```text
1. 18개 마켓 전체에 실제 트렌드 글 확보
2. 각 트렌드별 상위 사이트가 가진 유틸리티 요소 따라잡기
3. 공식/라이브 데이터 출처를 더 강하게 연결
4. 주제별 internal cluster 만들기
5. noindex 테스트 글을 promotion 기준 통과 후 index 가능 상태로 전환
```

즉 결론은:

```text
SEO 구조: 좋음
디자인/형식: 리뷰형은 좋아짐, 뉴스형은 추가 모듈 필요
실제 상위 경쟁력: 아직 부족
다음 작업: 18개 마켓별 current trend article + branch-specific modules
```
