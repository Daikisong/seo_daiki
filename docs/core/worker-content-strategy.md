# Worker Content Strategy Architecture

이 문서는 trend -> SERP -> strategy -> test article 흐름에서 글 전략과 테스트 글을 만드는 Python worker 구조를 설명한다.

## 핵심 원칙

기존 import 경로는 유지한다.

```python
from workers.python.writers.content_strategy_rules import article_sections
```

호출하는 쪽은 위 경로를 계속 사용해도 된다. 내부 구현만 여러 파일로 나뉘었다.

예를 들면 식당으로 보면 `content_strategy_rules.py`는 주문 창구이고, 실제 재료 창고는 `reader_sections`, `experience`, `localization`, `topics`로 나뉜 상태다.

## 파일 구조

```text
workers/python/writers/content_strategy_rules.py
  기존 public API를 유지하는 facade다.
  section_plan, evidence_needed, title_for, article_sections, brief_markdown, markdown_article를 직접 제공한다.
  큰 데이터/번역/토픽 판별 함수는 아래 모듈에서 가져온다.

workers/python/writers/content_strategy_topics.py
  strategy row에서 topic key를 판별한다.
  예: samsung_s90f, runway_aleph_jp, kr_gaming_monitor.

workers/python/writers/content_strategy_reader_sections.py
  독자가 실제로 읽는 article summary와 section body를 담당한다.
  예: 게이밍 모니터 글의 빠른 결론, 체크리스트형 본문.

workers/python/writers/content_strategy_experience.py
  article experience facade다.
  topic별 화면 데이터와 SERP 형식 데이터를 합쳐 TestArticle에 들어갈 최종 experience payload를 만든다.

workers/python/writers/content_strategy_article_experience_records.py
  topic별 독자 화면 데이터를 담당한다.
  heroImage, quickFacts, checklist, comparisonTable, sourceLinks 같은 실제 글 보강 데이터를 둔다.

workers/python/writers/content_strategy_serp_format_records.py
  SERP 분석에서 가져온 형식 데이터를 담당한다.
  articleMeta, keyTakeaways, verdictBox, prosCons, serpReferences를 둔다.

workers/python/writers/content_strategy_experience_helpers.py
  seoReadinessScore와 market 내부 링크 helper를 담당한다.

workers/python/writers/content_strategy_localization.py
  SERP gap, evidence, competitor pattern을 언어별 문장으로 바꾼다.
  summarize_competitors, localized_list_phrase, translate_phrase, localized_section_copy가 여기에 있다.

workers/python/writers/market_test_article_records.py
  ContentStrategy 한 건을 TestArticle row로 만든다.
  기본값은 pending/noindex이고 affiliateLinks는 빈 배열이다.

workers/python/writers/market_test_articles.py
  파일 입출력 facade다.
  data/exports/content_strategies.json을 읽고 data/exports/test_articles.json을 쓴다.
```

## 수정 위치 예시

게이밍 모니터 글 본문을 고치고 싶다:

```text
content_strategy_reader_sections.py
```

게이밍 모니터 글의 이미지, 체크리스트, 비교표, 출처를 고치고 싶다:

```text
content_strategy_article_experience_records.py
```

게이밍 모니터 글의 `확인한 상위 글`, `요약 박스`, `장단점` 같은 SERP 기반 형식 데이터를 고치고 싶다:

```text
content_strategy_serp_format_records.py
```

SEO 준비 점수 계산이나 market 내부 링크를 고치고 싶다:

```text
content_strategy_experience_helpers.py
```

새로운 topic key를 추가하고 싶다:

```text
content_strategy_topics.py
```

스페인어/일본어/한국어 fallback 문장을 고치고 싶다:

```text
content_strategy_localization.py
```

테스트 글이 noindex로 생성되는 기본값을 확인하고 싶다:

```text
market_test_article_records.py
```

## pytest 주의점

일부 production helper는 과거 CLI/API 호환 때문에 `test_article_record`, `test_article_records`처럼 `test_` 이름을 유지한다.

pytest가 이 함수들을 테스트로 오인하지 않도록 함수 객체에 다음 속성을 붙인다.

```python
test_article_record.__test__ = False
```

이 속성은 런타임 동작을 바꾸지 않고, pytest 수집만 막는다.

## 검증 명령

이 영역을 고친 뒤 최소한 다음을 실행한다.

```bash
PYTHONPATH=. pytest workers/python/tests/test_content_strategy_rules.py workers/python/tests/test_market_content_strategy_modules.py workers/python/tests/test_market_test_article_modules.py -q
pnpm typecheck
pnpm build
```

SEO 관련 public output까지 바뀔 수 있으면 다음도 실행한다.

```bash
pnpm seo:market-audit
pnpm seo:validate
```
