내 판단은 명확해.
**티스토리/일반 블로그형으로 가면 안 되고, 워드프레스 단독도 최선은 아니야.**

네가 원하는 건 “글 자동 발행”이 아니라 **글로벌 제품 검증 검색엔진**에 가까워. 그러면 플랫폼 선택부터 달라진다.

최종 추천은 이거야.

```text
Next.js 커스텀 사이트 + PostgreSQL 제품 DB + Python 수집/분석 파이프라인 + 로컬/클라우드 LLM 생성기

워드프레스: 선택사항. 초반에는 안 씀.
티스토리: 탈락.
```

이유는 간단해. 구글 상위 노출의 엣지는 “블로그 글쓰기 편의성”이 아니라 **페이지 구조, 다국어 URL, hreflang, canonical, schema, 제품 DB, 내부링크, 실험 데이터, 가격/옵션/국가 리스크 페이지를 마음대로 설계할 수 있느냐**에서 나온다. 티스토리는 Open API가 2024년 2월까지 순차 종료됐고, 외부에서 글 작성·수정·파일 첨부 등을 할 수 없게 된다고 공지했다. 자동화 파이프라인의 중심으로는 맞지 않는다. ([TISTORY][1])

워드프레스는 REST API로 `POST /wp/v2/posts`를 통해 글 생성·수정·draft/pending/publish 상태 관리가 가능하니까 자동 발행기는 될 수 있다. 그런데 네 프로젝트의 핵심은 “포스트”가 아니라 “제품 엔티티/variant/claim/evidence/locale risk/price snapshot”이다. 워드프레스 단독은 이걸 억지로 커스텀 필드와 플러그인으로 구겨 넣게 된다. ([WordPress Developer Resources][2])

---

# 1. 최종 형태: “Global Import Product Intelligence Engine”

사이트 콘셉트는 이렇게 잡아야 해.

```text
AliExpress Affiliate Blog ❌
Global Import Product Intelligence Engine ✅
```

겉으로는 블로그처럼 보이지만, 내부는 제품 DB다.

```text
상품 후보 수집
  ↓
동일 상품/유사 상품/판매자/옵션 묶기
  ↓
판매자 주장 스펙 추출
  ↓
가격/배송/옵션/리뷰 신호 저장
  ↓
직접 측정 또는 확인 가능한 evidence 연결
  ↓
국가별 구매 리스크 계산
  ↓
제품/비교/문제해결/국가별 페이지 자동 생성
  ↓
SEO 품질 게이트
  ↓
index 가능 페이지와 noindex 페이지 분리
  ↓
Search Console 반응으로 재작성
```

구글은 얇은 제휴 페이지를 명확히 경계한다. 특히 원 판매자 설명과 리뷰를 복사한 제휴 페이지는 thin affiliation으로 볼 수 있고, 좋은 제휴 페이지의 예시로 가격 정보, 독창 리뷰, 엄격한 테스트, 제품 비교, 카테고리 탐색 같은 추가 가치를 든다. 네 사이트의 설계 핵심도 바로 이쪽이어야 한다. ([Google for Developers][3])

---

# 2. 플랫폼 선택

## 결론

```text
1순위: Next.js + PostgreSQL + Python workers
2순위: Headless WordPress + Next.js
3순위: WordPress 단독
탈락: 티스토리, 네이버블로그, 블로그스팟류
```

## 비교표

| 선택지                          | 판단        | 이유                                                                     |
| ---------------------------- | --------- | ---------------------------------------------------------------------- |
| **Next.js 커스텀**              | **최종 추천** | 다국어 URL, schema, 제품 DB, 비교표, 내부링크, sitemap, hreflang, 성능 최적화를 전부 제어 가능 |
| Headless WordPress + Next.js | 가능하지만 복잡  | WordPress는 편집 CMS로만 쓰고 실제 SEO 페이지는 Next가 렌더링. 초반엔 과함                   |
| WordPress 단독                 | 쉬우나 한계    | 플러그인 많고 빠르게 시작 가능하지만, 제품 intelligence engine으로 커지면 구조가 꼬임              |
| Tistory                      | 탈락        | Open API 종료. 글로벌 다국어 자동화/구조화/대량 관리에 부적합                                |
| Ghost                        | 깔끔하지만 부족  | 글 CMS로는 좋지만 제품 DB/SEO 자동화는 결국 커스텀 필요                                   |
| Shopify/WooCommerce          | 목적 불일치    | 직접 판매 쇼핑몰이 아니라 제휴/리뷰/검증 사이트라 과함                                        |

Next.js를 추천하는 이유는 App Router에서 metadata, sitemap, i18n 라우팅을 코드로 제어하기 좋기 때문이다. Next.js는 `generateMetadata`로 페이지별 메타데이터를 생성할 수 있고, `sitemap.xml` 파일 컨벤션도 제공한다. 다국어 라우팅도 공식 가이드가 있다. ([Next.js][4])

---

# 3. 기술 스택 최종안

## 웹사이트

```text
Framework: Next.js App Router
Language: TypeScript
Styling: Tailwind CSS
Content: DB-driven pages + MDX for editorial sections
SEO: custom metadata, JSON-LD, hreflang, sitemap index
Hosting: Vercel or Cloudflare Pages/Workers
Images: Cloudflare R2 or S3-compatible storage
Analytics: Google Search Console + GA4 + affiliate click tracking
```

## 데이터/백엔드

```text
Database: PostgreSQL
ORM: Prisma
Local DB: Docker PostgreSQL
Production DB: Neon / Supabase / managed Postgres
Queue v1: simple CLI jobs + cron
Queue v2: Redis + BullMQ or Celery
```

## 수집/분석

```text
Python workers
- AliExpress API wrapper
- price snapshot
- product normalization
- review signal extraction
- evidence pack builder
- LLM draft generator
```

AliExpress 쪽은 무단 차단 우회 크롤링을 중심에 두지 말고, 가능한 공식 API/제휴 API 기반으로 간다. 공개된 `python-aliexpress-api` 레포는 AliExpress Open Platform API wrapper이고, 상품 정보, 제휴 링크, 상품 검색, hot products, 카테고리 호출 예제가 있다. 이건 수집 배관으로 쓸 만하다. ([GitHub][5])

## LLM

```text
v1:
- Ollama/local LLM: extraction, clustering, 초안 생성
- 필요 시 클라우드 LLM: 최종 영어/스페인어/포르투갈어 품질 보강

v2:
- provider interface로 OpenAI/Gemini/Claude/Ollama 교체 가능하게 설계
```

여기서 중요한 건 모델명이 아니라 구조다.
`LLMProvider` 인터페이스를 만들고, 나중에 모델을 갈아끼울 수 있게 해야 한다.

---

# 4. 사이트 URL 구조

처음부터 ccTLD 여러 개로 나누지 말고 `.com` 하나에 subdirectory로 간다.

```text
example.com/
  en/
  es/
  pt-br/
  fr/
  de/
  id/
  data/
  lab/
```

초기에는 이렇게만 연다.

```text
/en/
/es/
/pt-br/
/data/
/lab/
```

구글은 다국어 사이트에서 언어별로 다른 URL을 쓰고, `hreflang`으로 언어/지역 버전을 알려주라고 권장한다. 또한 쿠키나 브라우저 설정으로 같은 URL의 언어만 바꾸는 것보다 다른 URL을 쓰는 쪽을 권장한다. ([Google for Developers][6])

subdirectory 방식은 `example.com/de/`처럼 한 호스트에서 관리하므로 유지보수가 쉽다. 구글도 subdirectory with gTLD 구조의 장점으로 쉬운 설정과 낮은 유지보수를 든다. ([Google for Developers][6])

---

# 5. 자동 언어 이동은 하지 말 것

홈페이지에 들어온 사용자를 IP나 브라우저 언어로 강제 리다이렉트하면 안 된다.
대신 “추천 배너”만 띄운다.

```text
Looks like you may prefer Português (Brasil).
[Switch to Portuguese] [Stay here]
```

구글은 사용자의 언어를 추정해 자동으로 다른 언어 페이지로 리다이렉트하지 말고, 사용자가 직접 언어를 선택할 수 있는 링크를 제공하라고 권장한다. Googlebot이 모든 언어 변형을 제대로 크롤링하지 못할 수 있기 때문이다. ([Google for Developers][6])

---

# 6. 페이지 타입 설계

여기가 진짜 엣지다.
일반 제휴 사이트는 “상품 리뷰 글”만 만든다. 우리는 **검색 의도별 페이지 계층**을 만든다.

## 6-1. 최상위 허브

```text
/en/usb-c-chargers/
/en/usb-c-cables/
/en/power-banks/
/en/electric-screwdrivers/
/en/smart-home-sensors/
```

역할:

```text
이 카테고리에서 무엇을 검증하는지 설명
테스트 방법 연결
추천/비추천 기준 설명
상위 제품 비교표
국가별 주의점
문제해결 글로 내부링크
```

## 6-2. Lab/Data 페이지

```text
/en/lab/65w-gan-charger-real-output-test/
/en/data/usb-c-cable-100w-verification-table/
/en/data/power-bank-claimed-mah-vs-real-wh/
```

역할:

```text
검색엔진과 사용자에게 “이 사이트는 데이터가 있다”는 신호
외부에서 인용될 수 있는 원천 자산
제품 리뷰 페이지들의 근거 창고
```

## 6-3. 제품 리뷰 페이지

```text
/en/reviews/baseus-65w-gan-charger/
/es/resenas/cargador-gan-65w-baseus/
/pt-br/analises/carregador-gan-65w-baseus/
```

구조:

```text
1. 제휴 표시
2. 30초 결론
3. 사도 되는 사람 / 피해야 할 사람
4. 판매자 주장 vs 확인된 사실
5. 옵션 함정 지도
6. 테스트 결과
7. 리뷰 신호 요약
8. 국가별 구매 리스크
9. 대체품
10. 가격 기준
11. 최종 판단
12. 업데이트 로그
```

구글의 고품질 리뷰 가이드는 사용자 관점 평가, 전문성, 시각자료 같은 직접 경험 증거, 정량 측정, 경쟁 제품과의 차이, 장단점, 용도별 선택을 강조한다. 이 페이지 구조는 그 기준에 맞춰야 한다. ([Google for Developers][7])

## 6-4. 문제 해결 페이지

```text
/en/guides/aliexpress-65w-charger-not-charging-laptop/
/en/guides/aliexpress-charger-fake-watts/
/en/guides/aliexpress-usb-c-cable-not-100w/
/en/guides/wrong-plug-option-aliexpress/
```

이게 초반 SEO에서 중요하다.
“best aliexpress gadget”은 너무 세고, “65w charger not charging laptop” 같은 문제형 롱테일은 검색 의도가 날카롭다.

## 6-5. 비교 페이지

```text
/en/compare/baseus-65w-vs-ugreen-65w/
/en/compare/aliexpress-65w-chargers-vs-amazon-alternatives/
/en/compare/65w-vs-100w-gan-charger/
```

구조:

```text
비교표
실측/claim/evidence 차이
가격대
사야 할 조건
피해야 할 조건
국가별 추천 차이
```

## 6-6. 국가별 리스크 페이지

```text
/en-us/guides/aliexpress-chargers-us-buyers/
/en-gb/guides/aliexpress-chargers-uk-buyers/
/es-es/guias/cargadores-aliexpress-espana/
/pt-br/guias/carregadores-aliexpress-brasil/
```

이 페이지는 단순 번역이 아니라 현지 구매 리스크를 다룬다.

```text
미국: 안전인증/반품/아마존 대체품
EU: EU plug/CE 표기/VAT
브라질: 관세/배송 지연/플러그
인도네시아: 배송/현지 마켓 대체품
```

---

# 7. 핵심 데이터 모델

Codex에게 이 DB부터 만들게 하면 된다.

```prisma
model Product {
  id                String   @id @default(cuid())
  canonicalName     String
  slug              String   @unique
  category          String
  brandClaim        String?
  identityConfidence Float   @default(0)
  imageHash         String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  variants          Variant[]
  sellerClaims      SellerClaim[]
  verifiedClaims    VerifiedClaim[]
  reviewSignals     ReviewSignal[]
  priceSnapshots    PriceSnapshot[]
  marketRisks       MarketRisk[]
  articles          Article[]
}

model Variant {
  id             String   @id @default(cuid())
  productId      String
  product        Product  @relation(fields: [productId], references: [id])
  sourceSku      String?
  optionName     String
  wattageClaim   Int?
  plugType       String?
  cableIncluded  Boolean?
  sourceUrl      String
  affiliateUrl   String?
  sellerName     String?
  sellerId       String?
  riskFlags      Json?
  createdAt      DateTime @default(now())
}

model SellerClaim {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  claimType   String
  claimValue  String
  rawText     String?
  sourceUrl   String?
  capturedAt  DateTime @default(now())
  confidence  Float    @default(0.5)
}

model VerifiedClaim {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  testType    String
  resultValue String
  unit        String?
  method      String
  evidenceUrl String?
  confidence  Float    @default(0.8)
  testedAt    DateTime?
}

model ReviewSignal {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  locale      String
  topic       String
  sentiment   String
  count       Int
  confidence  Float
  window      String?
  capturedAt  DateTime @default(now())
}

model PriceSnapshot {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  variantId   String?
  country     String?
  currency    String
  price       Decimal
  shipping    Decimal?
  coupon      Decimal?
  finalPrice  Decimal?
  capturedAt  DateTime @default(now())
}

model MarketRisk {
  id                  String  @id @default(cuid())
  productId            String
  product              Product @relation(fields: [productId], references: [id])
  locale               String
  country              String?
  plugRisk             String?
  customsRisk          String?
  certificationRisk    String?
  returnRisk           String?
  localAlternativeNote String?
  score                Float   @default(0.5)
}

model EvidencePack {
  id          String   @id @default(cuid())
  productId   String?
  locale      String
  packJson    Json
  createdAt   DateTime @default(now())
}

model Article {
  id              String   @id @default(cuid())
  productId        String?
  product          Product? @relation(fields: [productId], references: [id])
  locale           String
  slug             String
  type             String
  title            String
  metaDescription  String?
  contentMdx       String
  jsonLd           Json?
  qualityScore     Int      @default(0)
  indexStatus      String   @default("pending")
  publishStatus    String   @default("draft")
  canonicalUrl     String?
  hreflangMap      Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@unique([locale, slug])
}

model AffiliateClick {
  id          String   @id @default(cuid())
  articleId   String?
  productId   String?
  variantId   String?
  locale      String?
  targetUrl   String
  clickedAt   DateTime @default(now())
  referrer    String?
  utm         Json?
}
```

중요한 건 `Article`이 중심이 아니라 `Product`, `Variant`, `SellerClaim`, `VerifiedClaim`, `MarketRisk`가 중심이라는 점이다. 글은 데이터의 그림자다.

---

# 8. SEO 우선순위 설계

## 8-1. 모든 페이지를 index하지 않는다

자동화로 500개를 만들 수 있어도, 전부 index하면 안 된다.
각 페이지에는 `indexStatus`를 둔다.

```text
index
noindex
pending
refresh_needed
merge_candidate
```

발행 조건:

```text
index 가능:
- 고유 데이터 있음
- evidence pack 있음
- 내부링크 5개 이상
- locale별 현지화 있음
- thin affiliate score 통과

noindex:
- 상품 데이터만 있음
- 설명 재작성 수준
- 가격/옵션만 있고 검증 없음
- 중복 제품 후보
```

구글은 대량 자동 생성 페이지가 사용자를 돕기보다 검색 순위 조작 목적일 때 scaled content abuse로 본다. 그래서 “대량 생성” 자체보다 “index 가능한 품질 게이트”가 더 중요하다. ([Google for Developers][3])

## 8-2. 내부링크는 알고리즘으로 설계한다

모든 페이지는 외로운 섬이면 안 된다.

제품 리뷰 페이지는 반드시:

```text
카테고리 허브로 링크
테스트 방법 페이지로 링크
원본 data row로 링크
비교 페이지 2개로 링크
대체품 3개로 링크
문제 해결 페이지 2개로 링크
언어 전환 링크
```

카테고리 허브는:

```text
상위 제품 10개
문제 해결 글 10개
비교 글 5개
데이터 페이지 3개
국가별 가이드 3개
```

이렇게 묶는다.

내부링크 알고리즘은 이렇게 계산한다.

```text
same_category_score
same_claim_score
same_problem_score
same_locale_score
alternative_price_band_score
risk_overlap_score
```

## 8-3. sitemap을 쪼갠다

```text
/sitemap.xml
/sitemaps/en-products.xml
/sitemaps/en-guides.xml
/sitemaps/en-lab.xml
/sitemaps/es-products.xml
/sitemaps/pt-br-products.xml
```

구글은 sitemap이 사이트의 페이지와 파일 관계를 알려주고, 새 사이트나 외부 링크가 적은 사이트에서 Google이 페이지를 발견하는 데 도움이 될 수 있다고 설명한다. ([Google for Developers][8])

---

# 9. hreflang/canonical 규칙

각 언어 페이지는 자기 자신을 canonical로 둔다.

```html
<link rel="canonical" href="https://example.com/es/resenas/cargador-gan-65w-baseus/" />
```

각 언어 버전은 서로 연결한다.

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/reviews/baseus-65w-gan-charger/" />
<link rel="alternate" hreflang="es" href="https://example.com/es/resenas/cargador-gan-65w-baseus/" />
<link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-br/analises/carregador-gan-65w-baseus/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

주의:

```text
/en-us/와 /en-gb/가 거의 같으면 만들지 말 것
진짜 국가별 차이가 있을 때만 region page 생성
번역만 된 페이지는 index 보류
```

구글은 페이지의 보이는 콘텐츠로 언어를 판단하고, 한 페이지 안에 side-by-side 번역이나 boilerplate만 다른 번역을 피하라고 한다. ([Google for Developers][6])

---

# 10. JSON-LD / 구조화 데이터

네 사이트는 직접 판매 쇼핑몰이 아니라 제휴 리뷰 사이트다.
따라서 기본은 **Product snippet + Review + Article + BreadcrumbList**다.

Google Product structured data 문서는 “사람들이 해당 페이지에서 직접 구매할 수 없는 제품 페이지”에는 Product snippets가 맞고, editorial product review page에서는 pros/cons 같은 리뷰 정보 지정이 가능하다고 설명한다. Product structured data는 가격, 재고, 리뷰, 배송 같은 정보를 검색 결과에 더 풍부하게 표시하는 데 도움을 줄 수 있다. ([Google for Developers][9])

페이지별 JSON-LD:

```text
카테고리 허브:
- CollectionPage
- BreadcrumbList
- ItemList

제품 리뷰:
- Article
- Product
- Review
- BreadcrumbList

비교 페이지:
- Article
- ItemList
- Product 여러 개
- BreadcrumbList

데이터 페이지:
- Dataset
- Article
- BreadcrumbList

방법론 페이지:
- Article
- HowTo는 조심해서 사용
```

제휴 링크는 반드시:

```html
<a href="..." rel="sponsored nofollow">
```

구글은 광고·유료 배치 링크에 `rel="sponsored"`를 권장하고, `nofollow`도 허용한다고 설명한다. ([Google for Developers][10])

---

# 11. 페이지 컴포넌트 설계

Codex에게 이런 컴포넌트를 만들게 해.

```text
components/seo/
  JsonLd.tsx
  HreflangLinks.tsx
  Breadcrumbs.tsx
  AffiliateDisclosure.tsx
  UpdateLog.tsx

components/product/
  VerdictCard.tsx
  BuyAvoidCard.tsx
  SellerClaimTable.tsx
  VerifiedClaimTable.tsx
  VariantTrapMap.tsx
  PriceTruthCard.tsx
  ReviewSignalSummary.tsx
  MarketRiskMatrix.tsx
  AlternativesGrid.tsx
  EvidenceList.tsx
  TestMethodBlock.tsx

components/compare/
  ProductComparisonTable.tsx
  ScoreBreakdown.tsx
  UseCaseRecommendation.tsx

components/data/
  BenchmarkTable.tsx
  SortableMetricTable.tsx
  DatasetDownload.tsx
```

이 컴포넌트 구조가 SEO 엣지다.
그냥 글이 아니라 “검색자가 판단을 끝내는 화면”이 된다.

---

# 12. 품질 게이트

Codex에게 `publish_gate.ts` 또는 `quality_gate.py`를 만들게 한다.

```text
총점 100점

1. 검색 의도 명확성: 10
2. 원 판매자 페이지에 없는 정보: 20
3. evidence pack 연결: 15
4. 직접 측정/검증/비교 데이터: 20
5. 옵션 함정 설명: 10
6. 국가별 현지 리스크: 10
7. 내부링크 구조: 5
8. schema/hreflang/canonical 정상: 5
9. 제휴 표시/link rel 정상: 5

80점 이상: index 가능
65~79점: draft 유지
64점 이하: noindex
```

## 차단 조건

```text
- 숫자/스펙이 evidence에 없음
- 직접 테스트하지 않았는데 “we tested” 사용
- 리뷰 원문 복사
- 상품 설명 재작성뿐
- 같은 템플릿 반복
- 번역만 있고 locale risk 없음
- affiliate disclosure 없음
- sponsored/nofollow 없음
- internal links 3개 이하
```

구글은 도움되는 콘텐츠 평가에서 “원본 정보/리포팅/연구/분석이 있는가”, “다른 소스를 단순 복사/재작성하지 않는가”, “대량 생산처럼 보이지 않는가”, “직접 경험과 깊은 지식을 보여주는가”를 묻는다. 이 질문들을 코드 게이트로 바꿔야 한다. ([Google for Developers][11])

---

# 13. 콘텐츠 생성 파이프라인

## 단계 1: 상품 후보 수집

```text
input:
- category keyword
- AliExpress API result
- hot products
- manual seed URLs

output:
- raw_product_candidates
```

저장 필드:

```text
source_url
product_id
title
image_url
price
currency
seller
orders
rating
category
raw_json
captured_at
```

## 단계 2: product identity graph

같은 상품을 묶는다.

```text
title similarity
image hash
brand token
spec token
seller overlap
model number
```

출력:

```text
canonical product
aliases
duplicate candidates
confidence
```

## 단계 3: variant trap detector

옵션 함정 추출:

```text
wattage mismatch
plug type
cable included
bundle difference
model generation
color-only option vs spec option
```

예시:

```text
Title says 65W, but selected option is 45W.
Cable not included in cheapest option.
EU plug image differs from selected SKU.
```

## 단계 4: seller claim ledger

판매자 주장을 claim으로 바꾼다.

```json
{
  "claim_type": "max_output",
  "claim_value": "65W",
  "source": "seller_title",
  "confidence": 0.7
}
```

## 단계 5: review signal intelligence

리뷰 원문을 복사하지 말고 신호만 저장한다.

```json
{
  "topic": "wrong plug",
  "sentiment": "negative",
  "count": 17,
  "locale": "es",
  "confidence": 0.72
}
```

## 단계 6: price truth engine

```text
normal price
sale price
shipping included price
coupon adjusted price
buy zone
wait zone
avoid zone
```

예시:

```text
Buy under $18 shipped.
Wait above $24.
Avoid if title says 65W but selected SKU is 45W.
```

## 단계 7: locale risk matrix

```json
{
  "locale": "pt-BR",
  "country": "BR",
  "customsRisk": "high",
  "plugRisk": "medium",
  "returnRisk": "high",
  "localAlternativeNote": "Compare with Mercado Livre if final price exceeds..."
}
```

## 단계 8: evidence pack 생성

LLM은 이 파일만 보고 글을 써야 한다.

```json
{
  "product": {},
  "variants": [],
  "seller_claims": [],
  "verified_claims": [],
  "review_signals": [],
  "price_snapshots": [],
  "market_risks": [],
  "allowed_claims": [],
  "forbidden_claims": []
}
```

## 단계 9: article draft

글 생성 규칙:

```text
evidence에 없는 수치 금지
직접 검증 없으면 검증 표현 금지
판매자 표기와 확인 사실 분리
비추천 조건을 먼저 말하기
국가별 리스크 반영
대체품 제시
업데이트 로그 포함
```

## 단계 10: validators

```text
claim_evidence_validator
thin_affiliate_validator
locale_depth_validator
schema_validator
hreflang_validator
internal_link_validator
duplicate_similarity_validator
affiliate_link_validator
```

---

# 14. 첫 카테고리 전략

무조건 하나만 판다.

```text
USB-C charging ecosystem
```

포함:

```text
65W GaN chargers
100W GaN chargers
USB-C cables
power banks
USB-C testers
travel adapters
```

이 카테고리가 좋은 이유:

```text
가격 낮음
직접 테스트 가능
스펙 과장 많음
전세계 수요 있음
국가별 플러그/인증/배송 차이 있음
비교표 만들기 좋음
문제형 검색어가 많음
```

초기 콘텐츠 맵:

```text
/en/usb-c-chargers/
 /en/lab/65w-gan-charger-real-output-test/
 /en/data/65w-gan-charger-output-table/
 /en/guides/aliexpress-charger-fake-watts/
 /en/guides/aliexpress-charger-not-charging-laptop/
 /en/guides/aliexpress-charger-wrong-plug-option/
 /en/compare/65w-vs-100w-gan-charger/
 /en/compare/aliexpress-charger-vs-amazon-alternative/
 /en/reviews/product-a/
 /en/reviews/product-b/
 /en/reviews/product-c/

/es/cargadores-usb-c/
 /es/guias/cargador-aliexpress-no-carga-portatil/
 /es/guias/cargador-aliexpress-watts-falsos/
 /es/resenas/product-a/

/pt-br/carregadores-usb-c/
 /pt-br/guias/carregador-aliexpress-nao-carrega-notebook/
 /pt-br/guias/carregador-aliexpress-watts-falsos/
 /pt-br/analises/product-a/
```

처음부터 1,000개 글이 아니라 **데이터 있는 60~120개 URL**을 만든다. 단, index는 30~50개만 허용하고 나머지는 `pending/noindex`로 둔다.

---

# 15. SEO에서 우선순위가 잡히게 만드는 구조

구글이 이 사이트를 이해해야 하는 순서는 이거야.

```text
이 사이트는 알리 추천글 사이트다 ❌
이 사이트는 USB-C 충전 제품을 검증하는 사이트다 ✅
```

그래서 첫 90일은 이렇게 설계한다.

## 1단계: 주제 집중

```text
site focus = import electronics verification
initial cluster = USB-C charging
```

## 2단계: 방법론 페이지

```text
/en/methodology/how-we-test-usb-c-chargers/
/en/methodology/how-we-score-aliexpress-products/
/en/methodology/price-truth-score/
```

## 3단계: 데이터 페이지

```text
/en/data/65w-gan-charger-output-table/
/en/data/usb-c-cable-100w-verification-table/
```

## 4단계: 허브 페이지

```text
/en/usb-c-chargers/
/en/usb-c-cables/
/en/power-banks/
```

## 5단계: 리뷰 페이지

```text
/en/reviews/...
```

## 6단계: 문제 해결 페이지

```text
/en/guides/fake-watts/
/en/guides/wrong-plug/
/en/guides/not-charging-laptop/
```

이 순서가 중요하다. 리뷰만 먼저 깔면 제휴 냄새가 난다.
방법론과 데이터가 먼저 있으면 “검증소” 냄새가 난다.

---

# 16. 화면 설계

## 제품 리뷰 페이지 상단

```text
[Affiliate disclosure]

Verdict:
Good cheap travel charger only if you choose the correct 65W variant.
Avoid for certified office use unless you can verify safety certification.

Best for:
- Travel backup
- Low-cost phone/tablet charging
- Users who understand plug/variant selection

Avoid if:
- You need guaranteed sustained laptop charging
- You need easy returns
- You need verified safety certification
```

## 핵심 표

```text
Seller claim vs verified status

Claim                 Status        Evidence
65W max output         Seller claim  seller title
PPS support            Unverified    no test data yet
Cable included         Variant only  variant map
EU plug                Option-based  SKU option
```

## 가격 진실 카드

```text
Current observed price: $21.40 shipped
Good buy zone: under $18
Wait zone: $22+
Avoid: if selected option is 45W
Last checked: 2026-05-25
```

## 국가별 리스크

```text
US: certification confidence is the main issue
EU: plug type is usually manageable, CE claim still unverified
BR: customs and shipping delay may erase the price advantage
```

## 제휴 버튼

```text
Check current AliExpress price
rel="sponsored nofollow"
```

이 버튼은 처음부터 “Buy now”보다 “Check current price”가 낫다. 제휴 냄새가 덜하고, 실제 가격 변동 구조와 맞다.

---

# 17. SEO 메타 규칙

## Title 패턴

나쁜 제목:

```text
Best AliExpress 65W Charger 2026
```

좋은 제목:

```text
AliExpress 65W GaN Charger Test: Real Output, Heat, Plug Options, and Variant Traps
```

## Meta description

```text
We map the seller claims, plug variants, price history, review signals, and buyer risks for this AliExpress 65W GaN charger. Check who should buy it and who should avoid it.
```

## H1

```text
AliExpress 65W GaN Charger Test: Which Variant Is Actually Worth Buying?
```

## Slug

```text
/en/reviews/aliexpress-65w-gan-charger-real-output/
```

---

# 18. 프로젝트 폴더 구조

Codex에게 이렇게 만들게 하면 된다.

```text
global-import-lab/
  apps/
    web/
      app/
        [locale]/
          page.tsx
          layout.tsx
          reviews/[slug]/page.tsx
          guides/[slug]/page.tsx
          compare/[slug]/page.tsx
          data/[slug]/page.tsx
          lab/[slug]/page.tsx
        sitemap.ts
        robots.ts
      components/
        seo/
        product/
        compare/
        data/
        layout/
      lib/
        seo/
        i18n/
        content/
        db/
      public/
      package.json

  packages/
    db/
      prisma/
        schema.prisma
        migrations/
      src/
        client.ts
    seo/
      src/
        jsonld.ts
        hreflang.ts
        sitemap.ts
        canonical.ts
    validators/
      src/
        qualityGate.ts
        thinAffiliate.ts
        claimEvidence.ts
        internalLinks.ts
        hreflangValidator.ts
    types/
      src/

  workers/
    python/
      collectors/
        aliexpress_api.py
        price_snapshot.py
        manual_seed_import.py
      intelligence/
        product_identity_graph.py
        variant_trap_detector.py
        seller_claim_extractor.py
        review_signal_extractor.py
        price_truth_engine.py
        locale_risk_matrix.py
      evidence/
        evidence_pack_builder.py
      writers/
        article_draft_generator.py
        localizer.py
      validators/
        claim_evidence_validator.py
        hallucination_guard.py
      cli.py
      requirements.txt

  data/
    seeds/
      usb-c-chargers.csv
    raw/
    snapshots/
    evidence_packs/
    drafts/
    exports/

  docs/
    architecture.md
    seo-rules.md
    content-types.md
    quality-gate.md
    codex-tasks.md

  docker-compose.yml
  pnpm-workspace.yaml
  package.json
  README.md
```

---

# 19. 환경 변수

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://example.com

ALIEXPRESS_APP_KEY=
ALIEXPRESS_APP_SECRET=
ALIEXPRESS_TRACKING_ID=

LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_PUBLIC_URL=

GA4_PROPERTY_ID=
GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:example.com
GOOGLE_APPLICATION_CREDENTIALS=
```

---

# 20. 빌드 순서

## Phase 0: Skeleton

```text
Next.js app 생성
PostgreSQL docker-compose
Prisma schema
locale routing
basic layout
sitemap/robots
JSON-LD helper
```

## Phase 1: Product DB

```text
Product/Variant/Claim/Price/Risk/Article 모델
seed importer
admin-like local CLI
sample data 10개
```

## Phase 2: SEO page rendering

```text
category hub page
review page
guide page
compare page
data page
lab page
breadcrumb
canonical
hreflang
sitemap
```

## Phase 3: Intelligence pipeline

```text
product identity graph
variant trap detector
claim extractor
price truth engine
locale risk matrix
evidence pack builder
```

## Phase 4: Article generation

```text
outline generator
draft generator
localizer
quality gate
index/noindex decision
```

## Phase 5: Analytics feedback

```text
Search Console API importer
query/page/country/device 저장
low CTR page detector
page expansion suggestions
refresh planner
```

Search Console API는 country, device, page, query 같은 dimension으로 검색 트래픽 데이터를 조회할 수 있고, 결과는 클릭 수 기준으로 정렬된다. 이걸 가져와서 “어떤 쿼리에서 노출은 있는데 클릭이 낮은가”를 자동으로 찾아야 한다. ([Google for Developers][12])

---

# 21. Codex 첫 프롬프트

이걸 그대로 Codex에 던지면 된다.

```text
You are building a monorepo called global-import-lab.

Goal:
Build a multilingual SEO product intelligence site for imported ecommerce products. This is not a generic affiliate blog. The core is a product evidence database that generates SEO pages only when there is enough unique data.

Tech:
- Next.js App Router + TypeScript + Tailwind for apps/web
- PostgreSQL + Prisma in packages/db
- Python workers in workers/python
- pnpm workspace
- docker-compose for local Postgres
- No WordPress, no Tistory
- No automatic publish to third-party blog platforms

SEO requirements:
- Locale subdirectories: /en, /es, /pt-br
- Self canonical per localized page
- hreflang alternates including x-default
- sitemap.ts that outputs only Article records with indexStatus = "index"
- robots.ts
- JSON-LD helpers for Article, Product, Review, BreadcrumbList, ItemList, Dataset
- Affiliate links must render rel="sponsored nofollow"
- Every page must include language switch links
- No automatic IP/language redirects

Data model:
Implement Prisma models:
Product, Variant, SellerClaim, VerifiedClaim, ReviewSignal, PriceSnapshot, MarketRisk, EvidencePack, Article, AffiliateClick.

Page types:
- /[locale]/
- /[locale]/reviews/[slug]
- /[locale]/guides/[slug]
- /[locale]/compare/[slug]
- /[locale]/data/[slug]
- /[locale]/lab/[slug]

Components:
- AffiliateDisclosure
- VerdictCard
- BuyAvoidCard
- SellerClaimTable
- VerifiedClaimTable
- VariantTrapMap
- PriceTruthCard
- ReviewSignalSummary
- MarketRiskMatrix
- AlternativesGrid
- EvidenceList
- UpdateLog
- JsonLd
- HreflangLinks
- Breadcrumbs

Quality gate:
Create packages/validators with:
- qualityGate.ts
- thinAffiliate.ts
- claimEvidence.ts
- internalLinks.ts
- hreflangValidator.ts
- affiliateLinkValidator.ts

Article index rule:
Only index if:
- qualityScore >= 80
- at least 3 evidence-backed claims
- affiliate disclosure exists
- all affiliate links have rel sponsored nofollow
- at least 5 internal links
- locale content is not boilerplate-only
Otherwise set indexStatus noindex or pending.

Python workers:
Create a CLI with commands:
- seed-products
- build-identity-graph
- detect-variant-traps
- extract-seller-claims
- snapshot-prices
- build-locale-risk
- build-evidence-pack
- generate-draft
- run-quality-gate

Provide sample seed data for USB-C chargers and render sample pages for en/es/pt-br.

Also create docs:
- docs/architecture.md
- docs/seo-rules.md
- docs/content-types.md
- docs/quality-gate.md
- docs/next-tasks.md

Run typecheck and provide setup instructions.
```

---

# 22. “엣지 포인트”를 코드 기능으로 박아넣기

## 22-1. Product Identity Graph

기능:

```text
같은 제품을 다른 판매자/다른 이름/다른 이미지에서 묶음
중복 리뷰 페이지 남발 방지
canonical product 생성
```

SEO 효과:

```text
중복 얇은 페이지 방지
상품군 지도 페이지 생성 가능
비교/대체품 내부링크 강화
```

## 22-2. Variant Trap Map

기능:

```text
45W/65W/100W 혼합
EU/US plug
cable included 여부
cheapest option trap
bundle trap
```

SEO 효과:

```text
구매 직전 불안 해결
롱테일 문제형 검색어 확보
전환율 상승
```

## 22-3. Claim Verification Ledger

기능:

```text
판매자 주장과 검증 사실 분리
확인 불가 항목 표시
claim마다 evidence_id 연결
```

SEO 효과:

```text
상품 설명 재작성과 차별화
신뢰 상승
환각 방지
```

## 22-4. Price Truth Engine

기능:

```text
buy zone
wait zone
avoid zone
normal observed price
sale price
shipping included price
```

SEO 효과:

```text
“is it actually a deal?” 검색 의도 공략
재방문 이유 생성
```

## 22-5. Locale Risk Matrix

기능:

```text
미국/스페인/브라질 등 국가별 구매 리스크
배송/관세/플러그/반품/인증/대체품
```

SEO 효과:

```text
단순 번역 페이지가 아니라 현지화된 판단 페이지
다국어 중복 위험 감소
```

## 22-6. Evidence-first LLM

기능:

```text
LLM은 evidence pack 밖의 사실 사용 금지
수치/스펙/가격은 evidence_id 없으면 출력 금지
```

SEO 효과:

```text
허위 스펙 방지
품질 일관성
```

## 22-7. Index Budget Controller

기능:

```text
생성은 많이 하되 index는 품질 높은 것만 허용
pending/noindex 상태 유지
```

SEO 효과:

```text
대량 저품질 색인 리스크 감소
사이트 전체 품질 보호
```

---

# 23. 초기 100개 URL 설계

너무 보수적으로 10개만 만들 필요는 없다.
다만 **index는 선별**한다.

## 영어 60개

```text
허브 5개
데이터/랩 10개
가이드 15개
비교 10개
제품 리뷰 20개
```

## 스페인어 25개

```text
허브 3개
가이드 8개
비교 4개
제품 리뷰 10개
```

## 브라질 포르투갈어 25개

```text
허브 3개
가이드 8개
비교 4개
제품 리뷰 10개
```

총 110개 생성.
초기 index 허용은 40~60개만.

```text
index: 데이터/랩/허브/고품질 리뷰
pending: evidence 부족 리뷰
noindex: 중복/옵션만 다른 페이지
```

---

# 24. 콘텐츠별 템플릿

## 제품 리뷰 템플릿

```mdx
<AffiliateDisclosure />

# {title}

<VerdictCard />

<BuyAvoidCard />

## Seller claims vs verified facts
<SellerClaimTable />

## Variant trap map
<VariantTrapMap />

## Price truth
<PriceTruthCard />

## Review signal summary
<ReviewSignalSummary />

## Market risk by country
<MarketRiskMatrix />

## Alternatives
<AlternativesGrid />

## Evidence
<EvidenceList />

## Update log
<UpdateLog />
```

## 문제 해결 가이드 템플릿

```mdx
# Why your AliExpress 65W charger may not charge your laptop

## 30-second answer

## Most common causes
- selected 45W variant
- cable not rated for 100W
- no PPS/PD profile
- heat throttling
- misleading seller title

## How to check before buying

## Products we flagged with this risk

## Safer alternatives

## Evidence and update log
```

## 데이터 페이지 템플릿

```mdx
# AliExpress 65W GaN Charger Output Test Table

## Methodology

## Full benchmark table
<BenchmarkTable />

## How to interpret the numbers

## Products with suspicious claim gaps

## Download dataset

## Update log
```

---

# 25. 자동화 명령어 설계

```bash
pnpm dev
pnpm db:migrate
pnpm db:seed
pnpm seo:validate
pnpm build

python workers/python/cli.py seed-products --file data/seeds/usb-c-chargers.csv
python workers/python/cli.py build-identity-graph
python workers/python/cli.py detect-variant-traps
python workers/python/cli.py build-evidence-pack --locale en
python workers/python/cli.py generate-draft --locale en --type review
python workers/python/cli.py run-quality-gate
```

---

# 26. 운영 대시보드

처음부터 거창한 admin 만들 필요는 없지만, `/admin`은 있으면 좋다.

```text
/admin/products
/admin/articles
/admin/evidence
/admin/quality
/admin/search-console
```

보여줄 것:

```text
제품별 evidence 개수
품질 점수
indexStatus
내부링크 수
hreflang 오류
affiliate rel 오류
중복 후보
검색 노출/클릭/CTR/position
```

---

# 27. Search Console 기반 개선 루프

매주 자동으로:

```text
Search Console API에서 page/query/country/device 가져오기
노출 많고 CTR 낮은 페이지 찾기
position 8~30 페이지 찾기
query와 본문 섹션 매칭
없는 섹션 추천
제목/meta 재작성 후보 생성
내부링크 보강 후보 생성
```

예시:

```text
Page: /en/guides/aliexpress-charger-fake-watts/
Query: "aliexpress charger not 65w"
Position: 14
Action:
- add section "How to spot fake 65W listings"
- add comparison table with 5 flagged products
- link from 65W charger hub
```

Google Search Console API는 검색 트래픽 데이터를 query, page, country, device 등의 dimension으로 그룹화해 볼 수 있으므로 이 루프에 적합하다. ([Google for Developers][12])

---

# 28. 왜 워드프레스가 최종답이 아닌가

워드프레스가 나쁜 건 아니다.
하지만 네 목표에는 중심이 아니다.

워드프레스가 좋은 경우:

```text
혼자 글을 수동으로 많이 쓰고 싶다
플러그인으로 SEO를 처리하고 싶다
CMS UI가 중요하다
빠르게 애드센스 블로그를 만들고 싶다
```

네 경우:

```text
제품 DB
variant map
claim ledger
price truth
locale risk
quality gate
programmatic internal links
data pages
sitemap index control
index/noindex policy
```

이걸 해야 한다. 워드프레스에서 하려면 결국 커스텀 플러그인 지옥으로 간다.
반면 Next.js + DB에서는 처음부터 데이터 구조대로 화면을 만들 수 있다.

---

# 29. 그래도 워드프레스를 쓴다면

차선책은 이거다.

```text
WordPress = editorial CMS
Next.js = SEO frontend
PostgreSQL = product intelligence DB
```

하지만 초반에는 복잡도만 늘어난다.
그래서 지금은 **WordPress 없이 시작**하는 게 좋다.

---

# 30. 최종 선택

```text
도메인:
새 .com 하나

플랫폼:
Next.js App Router

언어:
초기 en / es / pt-br

DB:
PostgreSQL + Prisma

수집:
Python + AliExpress API wrapper

콘텐츠:
DB-driven MDX pages

SEO:
self canonical
hreflang
sitemap index
Product/Review/Article/Breadcrumb/Dataset JSON-LD
noindex gate
internal link graph

발행:
자동 publish가 아니라 indexStatus gate 통과 시 노출

첫 카테고리:
USB-C charger/cable/power bank

첫 목표:
100개 생성
40~60개 index
Search Console 반응으로 확장
```

한 문장으로 정리하면:

**워드프레스 블로그를 만들지 말고, 구글이 “이 사이트는 알리 제품을 검증하는 데이터베이스”라고 이해할 수 있는 구조를 만들어야 해.**

이 구조면 경쟁자가 많아도 싸울 지점이 생긴다.
남들은 “추천템 10개”를 쓰고, 너는 “판매자 주장, 실제 검증, 옵션 함정, 가격 진실, 국가별 리스크”를 보여주는 사이트가 되는 거다.