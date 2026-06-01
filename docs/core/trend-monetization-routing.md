# Trend Monetization Routing Architecture

이 문서는 트렌드 주제를 두 가지 공개 콘텐츠 분기로 나누는 worker 구조를 설명한다.

## 두 분기

```text
informational_explainer
  정보성 설명형 글.
  예: 세금, 입시, 정부 신청, 스포츠 일정, 공식 안내.
  상품 후보 분석과 수익 링크 삽입을 하지 않는다.

review_comparison
  구매/비교 의도가 있는 제품형 글.
  예: OLED TV 할인, 게이밍 모니터 추천, iPhone 구매 비교, AI 편집 도구 비교.
  테스트 글 이후 product candidate analysis를 허용한다.
```

쉽게 말하면, `KBO 올스타 투표 일정`은 정보형 뉴스고, `게이밍 모니터 추천`은 리뷰/비교형 글이다.

## 파일 구조

```text
workers/python/intelligence/trend_monetization_router.py
  기존 public facade다.
  route_trend_monetization, route_records, route_decision을 제공한다.
  파일 입출력과 최종 route record 조립을 담당한다.

workers/python/intelligence/trend_monetization_constants.py
  route 이름, localization 정책 이름, buyer/product/informational/health 용어 사전을 보관한다.

workers/python/intelligence/trend_monetization_signals.py
  article, SERP opportunity, strategy에서 신호를 뽑고 점수를 계산한다.
  route_signals, commerce_score, informational_score가 여기에 있다.

workers/python/intelligence/trend_monetization_policy.py
  route별 다음 단계, 차단 단계, localization 정책, summary를 담당한다.

workers/python/intelligence/trend_monetization_matching.py
  article, SERP opportunity, strategy를 market/language/slug/keywordId 기준으로 매칭한다.
```

## 수정 위치 예시

새로운 제품형 키워드를 추가하고 싶다:

```text
trend_monetization_constants.py
```

예: `mechanical keyboard`, `무선 이어폰`, `電動歯ブラシ` 같은 구매 의도 term.

제품형 점수 기준을 바꾸고 싶다:

```text
trend_monetization_signals.py
```

예: `commerce_score >= 35` 전 단계에서 buyer term 가중치를 바꾸는 식.

정보형 글에서 product candidate discovery를 막는 정책을 바꾸고 싶다:

```text
trend_monetization_policy.py
```

article과 SERP opportunity가 잘못 연결된다:

```text
trend_monetization_matching.py
```

CLI 출력 JSON 형태나 route record 필드를 바꾸고 싶다:

```text
trend_monetization_router.py
```

## Guardrail

`review_comparison`이어도 자동 수익 링크 삽입은 막는다.

```text
allowed:
  ProductCandidateDiscovery
  ProductCandidateAnalysisBlock

blocked:
  AutomaticAffiliateLinkInsertion
```

건강/영양제 신호가 있는 리뷰형 주제는 `health_claim_guard`가 붙는다.

```text
magnesium sleep supplement
  -> review_comparison
  -> requiredGuards: ["health_claim_guard"]
```

## 검증 명령

```bash
PYTHONPATH=. pytest workers/python/tests/test_trend_monetization_router.py workers/python/tests/test_product_candidate_engine_modules.py workers/python/tests/test_market_content_strategy_modules.py workers/python/tests/test_market_test_article_modules.py -q
python -m py_compile workers/python/intelligence/trend_monetization_router.py workers/python/intelligence/trend_monetization_constants.py workers/python/intelligence/trend_monetization_signals.py workers/python/intelligence/trend_monetization_policy.py workers/python/intelligence/trend_monetization_matching.py
```
