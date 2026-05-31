from __future__ import annotations

from typing import Any


def section_plan(keyword: str, opportunity: dict[str, Any], rows: list[dict[str, Any]]) -> list[dict[str, str]]:
    missing = []
    content_gap = opportunity.get("contentGapJson") if isinstance(opportunity, dict) else {}
    if isinstance(content_gap, dict):
        missing = [str(item) for item in content_gap.get("missingAngles", [])]
    plan = [
        {"heading": "Direct answer", "purpose": "Answer the market user's query first."},
        {"heading": "Why this is trending in this market", "purpose": "Separate local signal from global noise."},
        {"heading": "What top pages already cover", "purpose": "Summarize patterns without copying wording."},
        {"heading": "What to verify before buying or recommending", "purpose": "List evidence and risk checks."},
    ]
    if missing:
        plan.append({"heading": "Gaps this test post should fill", "purpose": "; ".join(missing[:4])})
    if any(row.get("comparisonTablePresent") for row in rows):
        plan.append({"heading": "Comparison criteria to add later", "purpose": "Prepare a future table without product links."})
    plan.append({"heading": "Product candidate analysis pending", "purpose": "Make monetization deferral explicit."})
    return plan


def evidence_needed(keyword: str, rows: list[dict[str, Any]]) -> list[str]:
    needs = ["SERP source URLs and summaries", "Market-specific availability context", "Freshness/date checks"]
    text = keyword.lower()
    if any(term in text for term in ["magnesium", "gut", "health", "sleep"]):
        needs.append("HealthClaimGuard review and conservative evidence sources")
    if any(term in text for term in ["charger", "power bank", "adapter"]):
        needs.append("Spec verification checklist and safety/certification notes")
    if not any(row.get("originalDataPresent") for row in rows):
        needs.append("Original data or testing plan before claiming superiority")
    return needs


def title_for(keyword: str, market: Any, opportunity: dict[str, Any], language: str = "en") -> str:
    cleaned = keyword.strip()
    lowered = cleaned.lower()
    if "samsung s90f" in lowered:
        return "Samsung S90F OLED deal: what US buyers should verify first"
    if "iphone 16" in lowered and language == "pt-br":
        return "iPhone 16 em promoção no Brasil: o que verificar antes de comprar"
    if "iphone 18" in lowered and language == "ja":
        return "iPhone 18の噂: 日本で確認すべきポイント"
    if "renta 2025" in lowered and language == "es":
        return "Renta 2025 y AEAT: qué comprobar antes de corregir una declaración"
    if "대입" in cleaned and language == "ko":
        return "2026 대입 학폭 반영: 학생과 학부모가 먼저 확인할 점"
    if language == "es":
        return f"{cleaned}: qué comprobar antes de actuar en {str(market).upper()}"
    if language == "pt-br":
        return f"{cleaned}: o que verificar antes de decidir no {str(market).upper()}"
    if language == "ja":
        return f"{cleaned}: 日本で確認すべきポイント"
    if language == "ko":
        return f"{cleaned}: 한국에서 먼저 확인할 점"
    if opportunity.get("recommendedArticleType") == "comparison_test_post":
        return f"{cleaned.title()}: What to Compare Before Choosing in {str(market).upper()}"
    return f"{cleaned.title()}: Market Test Guide for {str(market).upper()}"


def article_sections(strategy: dict[str, Any]) -> list[dict[str, str]]:
    language = str(strategy.get("language") or "en")
    keyword = str(strategy.get("slug") or strategy.get("titleStrategy") or "this trend").replace("-", " ")
    market = str(strategy.get("market") or "").upper()
    angle = str(strategy.get("recommendedAngle") or "")
    competitors = [row for row in strategy.get("competitorSummaryJson", []) if isinstance(row, dict)]
    gaps = strategy.get("contentGapJson") if isinstance(strategy.get("contentGapJson"), dict) else {}
    missing_angles = [str(item) for item in gaps.get("missingAngles", [])] if isinstance(gaps, dict) else []
    evidence = [str(item) for item in strategy.get("evidenceNeededJson", [])]
    patterns = [str(item) for item in strategy.get("competitorPatternsJson", [])]

    competitor_line = summarize_competitors(competitors, language)
    gap_line = localized_list_phrase(missing_angles, "market-specific verification", language)
    evidence_line = localized_list_phrase(evidence, "source freshness checks", language)
    pattern_line = localized_list_phrase(patterns, "expected sections and user intent", language)

    localized = localized_section_copy(language, keyword, market, angle, competitor_line, gap_line, evidence_line, pattern_line)
    return [{"heading": heading, "body": body} for heading, body in localized]


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
            ("Respuesta directa", f"La señal de tendencia para {keyword} se seleccionó desde una revisión por país, no desde una lista prefijada. Para {market}, el enfoque recomendado es: {angle}"),
            ("Por qué importa ahora", "La consulta aparece ligada a una necesidad inmediata del usuario. El artículo debe resolver la acción siguiente y separar información verificada de titulares rápidos."),
            ("Qué cubren las páginas superiores", f"El análisis manual de SERP detectó: {competitor_line}. Patrones esperados: {pattern_line}."),
            ("Hueco editorial", f"Este post no debe repetir titulares. Debe cubrir lo que falta: {gap_line}."),
            ("Qué verificar antes de recomendar", f"Antes de publicar una versión indexable hay que comprobar: {evidence_line}. No se inventan precios, resultados ni datos legales."),
            ("Monetización", "Sin enlaces de afiliado. Cualquier producto, servicio o CTA comercial queda aplazado hasta revisión humana."),
        ]
    if language == "pt-br":
        return [
            ("Resposta direta", f"O tema {keyword} foi escolhido a partir de tendência por país, não de uma pauta pronta. Para {market}, o ângulo recomendado é: {angle}"),
            ("Por que isso está subindo agora", "A busca aponta uma decisão imediata do usuário. O post precisa separar oferta, rumor ou notícia de pontos verificáveis."),
            ("O que os resultados superiores já fazem", f"A análise manual da SERP encontrou: {competitor_line}. Padrões esperados: {pattern_line}."),
            ("Lacuna editorial", f"O diferencial deve ser preencher o que falta: {gap_line}."),
            ("O que verificar antes de recomendar", f"Antes de abrir indexação ou recomendação comercial, verificar: {evidence_line}. Sem preço inventado, disponibilidade inventada ou teste não realizado."),
            ("Monetização", "Sem links afiliados. Qualquer candidato comercial fica pendente de revisão humana."),
        ]
    if language == "ja":
        return [
            ("結論", f"{keyword} は、事前に決めたテーマではなく国別トレンド確認から選んだテーマです。{market} 向けの基本方針は「{angle}」です。"),
            ("いま伸びている理由", "検索意図は速報、確認、購入判断のいずれかに寄っています。本文では確定情報と噂を分けて扱います。"),
            ("上位ページの傾向", f"手動SERP分析では {competitor_line} が確認されました。期待される構成は {pattern_line} です。"),
            ("不足している視点", f"単なる要約ではなく、次を補います: {gap_line}。"),
            ("公開前に確認すること", f"index候補にする前に確認する材料: {evidence_line}。価格、発売日、実機テストは根拠なしに断定しません。"),
            ("収益化", "アフィリエイトリンクは入れません。商品候補や商用CTAは人の承認後に扱います。"),
        ]
    if language == "ko":
        return [
            ("바로 답", f"{keyword} 주제는 미리 정한 예시가 아니라 국가별 트렌드 확인 뒤에 고른 주제입니다. {market} 시장에서의 글 방향은 다음입니다: {angle}"),
            ("지금 뜨는 이유", "검색 의도는 빠른 확인, 일정 확인, 구매 판단, 정책 이해 중 하나로 좁혀집니다. 이 글은 뉴스 요약만 하지 않고 사용자가 다음에 확인할 일을 정리합니다."),
            ("상위 콘텐츠가 다루는 것", f"수동 SERP 분석에서 확인한 패턴은 다음과 같습니다: {competitor_line}. 기본적으로 기대되는 구성은 {pattern_line}입니다."),
            ("우리 글의 차별점", f"상위 글을 베끼지 않고 비어 있는 부분을 보강합니다: {gap_line}."),
            ("공개 전 확인할 근거", f"색인 후보로 올리기 전에 확인할 근거는 다음입니다: {evidence_line}. 가격, 순위, 정책, 건강/법률 효과는 근거 없이 단정하지 않습니다."),
            ("수익화 상태", "이 테스트 글에는 제휴 링크를 넣지 않습니다. 상품 후보나 상업 CTA는 별도 검토와 사람 승인 뒤에만 붙입니다."),
        ]
    return [
        ("Direct Answer", f"{keyword} was selected from country-level trend research, not from a prefilled topic list. For {market}, the recommended angle is: {angle}"),
        ("Why This Is Trending Now", "The query points to an immediate user need. The article should separate verified facts from fast-moving headlines, rumors, or deal claims."),
        ("What Top Pages Already Cover", f"Manual SERP review found: {competitor_line}. Expected patterns: {pattern_line}."),
        ("Editorial Gap", f"This test post should not rewrite competitors. It should fill these gaps: {gap_line}."),
        ("Evidence To Verify Before Recommending", f"Before any indexable or commercial version, verify: {evidence_line}. Do not invent prices, availability, testing, or outcomes."),
        ("Monetization Status", "No affiliate links are inserted. Product candidates, service CTAs, or monetized placements require human approval later."),
    ]


def brief_markdown(strategy: dict[str, Any]) -> str:
    lines = [
        f"# {strategy.get('titleStrategy')}",
        "",
        f"Angle: {strategy.get('recommendedAngle')}",
        "",
        "Monetization: deferred. Product links are forbidden in the first test post.",
        "",
        "## Outline",
    ]
    for section in strategy.get("sectionPlanJson", []):
        if isinstance(section, dict):
            lines.append(f"- {section.get('heading')}: {section.get('purpose')}")
    return "\n".join(lines)


def markdown_article(title: str, sections: list[dict[str, str]]) -> str:
    lines = [f"# {title}", "", "Product candidate analysis pending. Deal or affiliate links require human approval."]
    for section in sections:
        lines.extend(["", f"## {section['heading']}", section["body"]])
    return "\n".join(lines)
