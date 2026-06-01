from __future__ import annotations

from typing import Any

def seo_readiness_score(experience: dict[str, Any]) -> int:
    score_value = 70
    if experience.get("heroImage"):
        score_value += 5
    if experience.get("articleMeta"):
        score_value += 4
    if len(experience.get("keyTakeaways", [])) >= 3:
        score_value += 5
    if experience.get("verdictBox"):
        score_value += 4
    if experience.get("prosCons"):
        score_value += 4
    if len(experience.get("serpReferences", [])) >= 3:
        score_value += 5
    if len(experience.get("quickFacts", [])) >= 4:
        score_value += 3
    if len(experience.get("checklist", [])) >= 5:
        score_value += 4
    if experience.get("comparisonTable"):
        score_value += 3
    if len(experience.get("sourceLinks", [])) >= 3:
        score_value += 4
    if len(experience.get("internalLinks", [])) >= 2:
        score_value += 2
    return min(score_value, 100)

def localized_internal_links(language: str, market: str, slug: str) -> list[dict[str, str]]:
    if language == "es":
        return [
            {"label": "Portada del mercado", "href": f"/{market}/{language}/", "note": "Ver la cola editorial de este mercado."},
            {"label": "Señal de tendencia", "href": f"/{market}/{language}/trends/{slug}/", "note": "Revisar el origen del tema."},
            {"label": "Análisis SERP", "href": f"/{market}/{language}/serp/{slug}/", "note": "Ver patrones y huecos de los resultados revisados."},
            {"label": "Mapa global", "href": "/global/trend-map/", "note": "Comparar señales entre mercados."},
        ]
    if language == "pt-br":
        return [
            {"label": "Página do mercado", "href": f"/{market}/{language}/", "note": "Ver a fila editorial deste mercado."},
            {"label": "Sinal de tendência", "href": f"/{market}/{language}/trends/{slug}/", "note": "Revisar a origem do tema."},
            {"label": "Análise SERP", "href": f"/{market}/{language}/serp/{slug}/", "note": "Ver padrões e lacunas dos resultados revisados."},
            {"label": "Mapa global", "href": "/global/trend-map/", "note": "Comparar sinais entre mercados."},
        ]
    if language == "ja":
        return [
            {"label": "市場ページ", "href": f"/{market}/{language}/", "note": "この市場の編集キューを見る。"},
            {"label": "トレンド信号", "href": f"/{market}/{language}/trends/{slug}/", "note": "テーマの発生元を確認する。"},
            {"label": "SERP分析", "href": f"/{market}/{language}/serp/{slug}/", "note": "参照結果の傾向と不足点を見る。"},
            {"label": "グローバルマップ", "href": "/global/trend-map/", "note": "市場間の傾向を比較する。"},
        ]
    if language == "ko":
        return [
            {"label": "시장 홈", "href": f"/{market}/{language}/", "note": "이 시장의 편집 큐를 봅니다."},
            {"label": "트렌드 신호", "href": f"/{market}/{language}/trends/{slug}/", "note": "주제가 어디서 시작됐는지 확인합니다."},
            {"label": "SERP 분석", "href": f"/{market}/{language}/serp/{slug}/", "note": "참조 결과의 패턴과 빈틈을 봅니다."},
            {"label": "글로벌 트렌드 맵", "href": "/global/trend-map/", "note": "시장 간 신호를 비교합니다."},
        ]
    return [
        {"label": "Market trend desk", "href": f"/{market}/{language}/", "note": "See this market's current trend queue."},
        {"label": "Trend signal", "href": f"/{market}/{language}/trends/{slug}/", "note": "Review where this topic came from."},
        {"label": "SERP analysis", "href": f"/{market}/{language}/serp/{slug}/", "note": "See reviewed result patterns and gaps."},
        {"label": "Global trend map", "href": "/global/trend-map/", "note": "Compare patterns across markets."},
    ]
