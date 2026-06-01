from __future__ import annotations

from typing import Any

def summarize_competitors(competitors: list[dict[str, Any]], language: str) -> str:
    if not competitors:
        return "manual SERP summaries were unavailable for this keyword"
    titles = [str(row.get("title") or "").strip() for row in competitors if row.get("title")]
    signals = []
    if any(row.get("hasComparisonTable") for row in competitors):
        signals.append(translate_phrase("comparison tables", language))
    if any(row.get("hasProductLinks") for row in competitors):
        signals.append(translate_phrase("product or commerce links", language))
    if not any(row.get("hasOriginalData") for row in competitors):
        signals.append(translate_phrase("limited original data", language))
    if not signals:
        signals.append(translate_phrase("standard explanatory coverage", language))
    pattern_label = {"es": "Patrón", "pt-br": "Padrão", "ja": "傾向", "ko": "패턴"}.get(language, "Pattern")
    return f"{'; '.join(titles[:3])}. {pattern_label}: {', '.join(signals)}"


def list_phrase(items: list[str], fallback: str) -> str:
    clean_items = [item for item in items if item and item.lower() not in {"none", "null"}]
    return "; ".join(clean_items[:5]) if clean_items else fallback


def localized_list_phrase(items: list[str], fallback: str, language: str) -> str:
    clean_items = [item for item in items if item and item.lower() not in {"none", "null"}]
    translated = [translate_phrase(item, language) for item in clean_items]
    unique = list(dict.fromkeys([item for item in translated if item]))
    if unique:
        return "; ".join(unique[:5])
    return translate_phrase(fallback, language)


def translate_phrase(value: str, language: str) -> str:
    text = value.strip()
    lower = text.lower()
    translations = {
        "SERP source URLs and summaries": {
            "es": "URLs y resúmenes de las fuentes SERP",
            "pt-br": "URLs e resumos das fontes da SERP",
            "ja": "SERPで確認したURLと要約",
            "ko": "SERP 출처 URL과 요약",
        },
        "Market-specific availability context": {
            "es": "contexto específico de disponibilidad en el mercado",
            "pt-br": "contexto de disponibilidade no mercado local",
            "ja": "市場ごとの入手性",
            "ko": "시장별 적용 가능성",
        },
        "Freshness/date checks": {
            "es": "revisión de fechas y vigencia",
            "pt-br": "checagem de data e validade",
            "ja": "日付と最新性の確認",
            "ko": "날짜와 최신성 확인",
        },
        "Original data or testing plan before claiming superiority": {
            "es": "datos propios o plan de prueba antes de afirmar superioridad",
            "pt-br": "dados próprios ou plano de teste antes de dizer que é melhor",
            "ja": "優位性を断定する前の独自データまたは検証計画",
            "ko": "우수하다고 말하기 전 필요한 자체 데이터나 검증 계획",
        },
    }
    if text in translations and language in translations[text]:
        return translations[text][language]

    keyword_translations = [
        ("common mistakes", {"es": "errores comunes", "pt-br": "erros comuns", "ja": "よくある誤解", "ko": "자주 생기는 오해"}),
        ("deadline", {"es": "plazos", "pt-br": "prazos", "ja": "期限", "ko": "마감일"}),
        ("mobile notice", {"es": "avisos en móvil", "pt-br": "avisos no celular", "ja": "スマホ通知", "ko": "모바일 알림"}),
        ("notification", {"es": "tipos de aviso", "pt-br": "tipos de aviso", "ja": "通知の種類", "ko": "알림 유형"}),
        ("brazil warranty", {"pt-br": "garantia no Brasil"}),
        ("warranty", {"es": "garantía", "pt-br": "garantia", "ja": "保証", "ko": "보증"}),
        ("expired deal", {"es": "oferta vencida", "pt-br": "oferta expirada", "ja": "終了したセール", "ko": "종료된 할인"}),
        ("current deal", {"es": "oferta vigente", "pt-br": "oferta atual", "ja": "現在のセール", "ko": "현재 할인"}),
        ("price", {"es": "precio", "pt-br": "preço", "ja": "価格", "ko": "가격"}),
        ("installment", {"pt-br": "parcelamento", "es": "pago a plazos", "ja": "分割払い", "ko": "할부 조건"}),
        ("independent drawbacks", {"es": "desventajas independientes", "pt-br": "pontos negativos independentes", "ja": "独立した弱点確認", "ko": "독립적인 단점 확인"}),
        ("japan buyer context", {"ja": "日本の購入者向け文脈"}),
        ("japan carrier", {"ja": "日本の通信キャリア事情"}),
        ("japan release", {"ja": "日本での発売時期"}),
        ("avoid certainty", {"ja": "未確認情報を断定しない"}),
        ("avoid headline overclaim", {"ja": "見出しだけで過度に断定しない"}),
        ("official", {"es": "fuente oficial", "pt-br": "fonte oficial", "ja": "公式情報", "ko": "공식 근거"}),
        ("original data/testing", {"es": "pocos datos propios o pruebas", "pt-br": "poucos dados próprios ou testes", "ja": "独自データや検証が少ない", "ko": "자체 데이터나 검증 부족"}),
        ("universal penalty", {"ko": "대학별 차이를 무시한 일괄 감점 표현 금지"}),
        ("university-specific differences", {"ko": "대학별 반영 차이"}),
        ("latest 2026", {"ko": "최신 2026 기준"}),
        ("student action", {"ko": "학생·학부모 확인 목록"}),
        ("student-parent checklist", {"ko": "학생·학부모 확인 목록"}),
        ("comparison tables", {"es": "tablas comparativas", "pt-br": "tabelas comparativas", "ja": "比較表", "ko": "비교표"}),
        ("product or commerce links", {"es": "enlaces comerciales", "pt-br": "links comerciais", "ja": "商品・商用リンク", "ko": "상품 또는 상업 링크"}),
        ("limited original data", {"es": "pocos datos propios", "pt-br": "poucos dados próprios", "ja": "独自データが少ない", "ko": "자체 데이터 부족"}),
        ("standard explanatory coverage", {"es": "explicación estándar", "pt-br": "explicação padrão", "ja": "標準的な解説", "ko": "일반 설명형 구성"}),
        ("market-specific verification", {"es": "verificación específica del mercado", "pt-br": "checagem do mercado local", "ja": "市場別の確認", "ko": "시장별 확인"}),
        ("source freshness checks", {"es": "comprobación de vigencia de fuentes", "pt-br": "checagem de atualização das fontes", "ja": "情報の新しさ確認", "ko": "출처 최신성 확인"}),
        ("expected sections and user intent", {"es": "secciones esperadas e intención de búsqueda", "pt-br": "seções esperadas e intenção do usuário", "ja": "期待される構成と検索意図", "ko": "기대 섹션과 검색 의도"}),
    ]
    for needle, localized in keyword_translations:
        if needle in lower and language in localized:
            return localized[language]
    return text


def localized_section_copy(
    language: str,
    keyword: str,
    market: str,
    angle: str,
    competitor_line: str,
    gap_line: str,
    evidence_line: str,
    pattern_line: str,
) -> list[tuple[str, str]]:
    if language == "es":
        return [
            ("Respuesta rápida", f"Para {keyword}, la decisión práctica es esta: {angle}"),
            ("Por qué importa ahora", "La búsqueda suele aparecer cuando el usuario necesita actuar pronto. Conviene separar datos confirmados de titulares rápidos y comprobar la fuente antes de decidir."),
            ("Qué revisar", f"Los puntos clave son: {gap_line}. También conviene comparar la información con fuentes oficiales o primarias."),
            ("Errores comunes", "No conviene confiar solo en un titular, una captura o un resumen. Revisa fecha, contexto, requisitos y si el dato aplica a tu situación concreta."),
            ("Fuentes a consultar", f"Comprueba al menos: {evidence_line}."),
        ]
    if language == "pt-br":
        return [
            ("Resposta rápida", f"Para {keyword}, a decisão prática é: {angle}"),
            ("Por que isso importa agora", "A busca indica que o leitor quer decidir ou confirmar algo rapidamente. O ideal é separar notícia, oferta ou rumor de dados verificáveis."),
            ("O que revisar", f"Os pontos principais são: {gap_line}. Confira também se a informação vale para o seu mercado e para o seu caso."),
            ("Erros comuns", "Evite decidir por título, desconto aparente ou resumo sem data. Confirme prazo, condição, fonte e detalhes que podem mudar no checkout ou no documento oficial."),
            ("Fontes para conferir", f"Verifique pelo menos: {evidence_line}."),
        ]
    if language == "ja":
        return [
            ("結論", f"{keyword} について、まず見るべきポイントは「{angle}」です。"),
            ("いま確認したい理由", "検索している人は、速報、購入判断、予定確認のどれかを急いでいます。確定情報と未確認情報を分けて読むことが重要です。"),
            ("確認ポイント", f"見落としやすい点は {gap_line} です。自分の地域、購入条件、公式情報に当てはまるか確認してください。"),
            ("よくある誤解", "見出しだけで確定と判断したり、海外情報をそのまま日本の条件に置き換えたりするのは危険です。"),
            ("確認する情報源", f"少なくとも {evidence_line} を確認してください。"),
        ]
    if language == "ko":
        return [
            ("바로 답", f"{keyword}에 대해 먼저 확인할 핵심은 다음입니다: {angle}"),
            ("왜 지금 확인해야 하나", "검색하는 사람은 일정, 정책, 구매, 신청처럼 곧바로 판단해야 할 가능성이 높습니다. 그래서 최신성, 적용 대상, 공식 근거를 함께 봐야 합니다."),
            ("확인할 점", f"놓치기 쉬운 부분은 다음입니다: {gap_line}. 본인 상황에 실제로 적용되는지도 함께 확인해야 합니다."),
            ("자주 하는 실수", "제목만 보고 단정하거나, 다른 사람 사례를 그대로 자기 상황에 적용하거나, 오래된 글을 최신 기준처럼 믿는 것이 가장 위험합니다."),
            ("확인할 출처", f"최소한 다음 자료를 확인하세요: {evidence_line}."),
        ]
    return [
        ("Quick Answer", f"For {keyword}, the practical takeaway is: {angle}"),
        ("Why It Matters Now", "The query usually means the reader needs to act, compare, or verify something soon. Treat fast-moving claims carefully and check the date."),
        ("What To Check", f"Key details to verify: {gap_line}."),
        ("Common Mistakes", "Do not decide from a headline, a stale price, or a single summary. Check the source, timing, terms, and whether it applies to your exact situation."),
        ("Sources To Verify", f"Use these checks before acting: {evidence_line}."),
    ]
