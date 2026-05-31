from __future__ import annotations

from typing import Any


def section_plan(keyword: str, opportunity: dict[str, Any], rows: list[dict[str, Any]]) -> list[dict[str, str]]:
    missing = []
    content_gap = opportunity.get("contentGapJson") if isinstance(opportunity, dict) else {}
    if isinstance(content_gap, dict):
        missing = [str(item) for item in content_gap.get("missingAngles", [])]
    plan = [
        {"heading": "Quick answer", "purpose": "Give the reader the practical answer first."},
        {"heading": "Why it matters now", "purpose": "Explain the current user need in plain language."},
        {"heading": "What to check", "purpose": "Turn the topic into a useful reader checklist."},
        {"heading": "Common mistakes", "purpose": "Warn readers about likely wrong assumptions."},
    ]
    if missing:
        plan.append({"heading": "Details that are easy to miss", "purpose": "; ".join(missing[:4])})
    if any(row.get("comparisonTablePresent") for row in rows):
        plan.append({"heading": "How to compare options", "purpose": "Explain the criteria readers should use before deciding."})
    plan.append({"heading": "Sources to verify", "purpose": "Point readers to official or primary sources."})
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
    reader_sections = reader_facing_article_sections(strategy)
    if reader_sections:
        return reader_sections

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


def article_summary(strategy: dict[str, Any]) -> str:
    topic = topic_key(strategy)
    summaries = {
        "samsung_s90f": (
            "A practical US buying guide for Samsung S90F OLED deals: check the exact size, panel notes, gaming needs, "
            "return policy, and whether the discount is still real before buying."
        ),
        "renta_2025": (
            "Guía rápida para entender los avisos de la AEAT en la Renta 2025, revisar errores comunes y saber qué "
            "comprobar antes de corregir una declaración."
        ),
        "iphone_16_br": (
            "Guia para decidir se uma promoção do iPhone 16 no Brasil vale a pena, com foco em preço real, garantia, "
            "nota fiscal, armazenamento e alternativas."
        ),
        "iphone_18_jp": (
            "iPhone 18の噂を、確定情報と未確認情報に分けて整理し、日本で買う前に確認すべき発売時期、キャリア販売、下取り条件、今すぐ買うべきか待つべきかの判断軸をまとめます。"
        ),
        "kr_admission_bullying": (
            "2026학년도 대입에서 학교폭력 조치사항이 어떻게 반영되는지, 학생과 학부모가 대학별 모집요강에서 확인해야 할 전형별 반영 방식, 감점·지원 제한 가능성, 상담 전 체크리스트를 정리합니다."
        ),
    }
    return summaries.get(topic) or str(strategy.get("recommendedAngle") or "")


def reader_facing_article_sections(strategy: dict[str, Any]) -> list[dict[str, str]]:
    topic = topic_key(strategy)
    sections: dict[str, list[tuple[str, str]]] = {
        "samsung_s90f": [
            (
                "The Short Answer",
                "A Samsung S90F OLED deal is worth a closer look if the discount applies to the exact size you want, comes from a retailer with a clear return window, and still leaves the TV cheaper than the LG C-series or Samsung S95F alternatives you are considering. Do not judge the deal from the headline price alone. The S90F is a strong OLED for gaming and movies, but the right purchase depends on room brightness, panel details by size, warranty, and whether you need Dolby Vision support.",
            ),
            (
                "What To Check Before You Buy",
                "Start with the model number, screen size, seller, return period, delivery method, and final checkout price. Many TV deal pages lead with a price that can change quickly or apply only to one size. Before paying, confirm whether the seller is the retailer itself or a marketplace seller, whether installation or haul-away is included, and whether the return policy covers dead pixels, shipping damage, or buyer remorse after opening the box.",
            ),
            (
                "Why The S90F Is Getting Attention",
                "The S90F sits in the upper-middle part of Samsung's OLED line: more premium than entry OLED sets, but usually cheaper than the flagship S95F. Reviews from TV specialists focus on its OLED contrast, strong gaming feature set, high refresh support, and bright-room performance for its class. That makes discounts attractive, especially for buyers who want a premium gaming TV without paying flagship pricing.",
            ),
            (
                "The Panel Detail Most Buyers Miss",
                "Do not assume every S90F size behaves exactly the same. Reviewers have flagged that Samsung OLED model families can differ by size and region, including panel-type differences. That does not automatically make a deal bad, but it means a 48-inch, 55-inch, 65-inch, 77-inch, or 83-inch listing should be checked separately. If a review tested one size, use it as guidance rather than proof that every listing performs identically.",
            ),
            (
                "Who Should Buy It",
                "The S90F makes the most sense for people who play console or PC games, watch a lot of movies in a controlled-light room, and want OLED contrast with premium gaming features. It is less obvious for someone who mainly leaves static daytime TV on in a very bright room, wants Dolby Vision specifically, or can find an LG C-series OLED with a better return policy and lower final price.",
            ),
            (
                "Deal Checklist",
                "Buy only after these checks line up: the price is current at checkout; the size is the one reviewed or the one you actually want; the retailer return policy is clear; the warranty is valid in the US; the panel and gaming features match your use case; delivery risk is acceptable; and competing OLEDs are not cheaper after tax, shipping, and coupons.",
            ),
            (
                "Sources To Verify",
                "Use the deal page only for the current offer. Use RTINGS, Tom's Guide, and TechRadar-style reviews for performance context. Use Samsung or the retailer listing for exact model numbers, warranty language, and included services. If those three sources disagree, trust the checkout page for price, the retailer for return terms, and measurement-based reviews for performance.",
            ),
        ],
        "renta_2025": [
            (
                "Respuesta rápida",
                "Si la AEAT te muestra un aviso sobre la Renta 2025, no significa automáticamente que vayas a recibir una sanción. Significa que hay un dato que conviene revisar antes de presentar, modificar o dejar cerrada la declaración. Lo importante es entrar por la Sede electrónica o la app oficial, comprobar el motivo del aviso y corregir solo aquello que puedas justificar con documentos.",
            ),
            (
                "Qué avisos pueden aparecer",
                "Los avisos suelen estar relacionados con diferencias entre tus datos fiscales y lo que has incluido en la declaración: ingresos que faltan, deducciones autonómicas mal aplicadas, datos familiares, vivienda, rendimientos de capital, alquileres o cambios que has hecho sobre el borrador. Un aviso no es una acusación; es una alerta para que revises antes de que la declaración quede mal presentada.",
            ),
            (
                "Fechas que no debes perder",
                "La campaña de Renta 2025 se presenta en 2026. La Agencia Tributaria abrió la presentación por internet el 8 de abril de 2026. La atención telefónica del plan Le Llamamos comienza el 6 de mayo y la atención presencial en oficinas empieza el 1 de junio, con el final general de campaña el 30 de junio. Si domicilias el pago, revisa el plazo específico porque puede terminar antes.",
            ),
            (
                "Cómo revisar un error sin empeorarlo",
                "No corrijas a ciegas. Primero descarga o revisa tus datos fiscales, localiza qué casilla o dato provoca el aviso, compara con certificados de empresa, banco, alquiler, donativos o deducciones, y guarda justificantes. Si el aviso está relacionado con una deducción autonómica o una situación familiar, comprueba también la norma de tu comunidad autónoma.",
            ),
            (
                "Cuándo pedir ayuda",
                "Conviene pedir cita o consultar a un asesor si el aviso afecta a importes relevantes, actividades económicas, alquileres, ventas de acciones, criptomonedas, herencias, residencia fiscal o deducciones que no entiendes. También merece la pena pedir ayuda si el borrador parece correcto pero la AEAT insiste en una diferencia que no sabes explicar.",
            ),
            (
                "Errores habituales",
                "Los errores más comunes son confiar en que el borrador siempre está completo, presentar sin mirar avisos amarillos o rojos, aplicar deducciones sin cumplir requisitos, olvidar ingresos pequeños, modificar datos sin justificante y esperar al último día para corregir. La regla práctica es simple: si no puedes explicar un cambio con un documento, no lo trates como seguro.",
            ),
            (
                "Fuentes a consultar",
                "Comprueba siempre la Sede de la Agencia Tributaria, el calendario oficial de la campaña, las notas del Ministerio de Hacienda y los avisos que aparecen dentro de Renta WEB o la app. Los artículos de medios ayudan a entender el problema, pero la decisión final debe apoyarse en la información oficial y en tus documentos.",
            ),
        ],
        "iphone_16_br": [
            (
                "Resposta rápida",
                "Uma promoção do iPhone 16 no Brasil só vale a pena se o preço final estiver realmente abaixo do histórico recente, se a loja emitir nota fiscal, se a garantia for válida no país e se o modelo atender ao seu uso por pelo menos alguns anos. O desconto do anúncio é apenas o começo da análise; o que decide a compra é o preço no checkout, a procedência e o custo comparado com iPhone 15, iPhone 16e, iPhone 17 e modelos Android equivalentes.",
            ),
            (
                "O que conferir antes de pagar",
                "Confira armazenamento, cor, vendedor, prazo de entrega, nota fiscal, garantia, política de devolução e forma de pagamento. Promoções no Pix podem parecer melhores, mas parcelamento sem juros muda a conta para muita gente. Também verifique se o cupom ainda funciona e se o preço anunciado não subiu no carrinho.",
            ),
            (
                "Quando o iPhone 16 faz sentido",
                "Ele faz sentido para quem quer continuar no ecossistema Apple, usa iCloud, AirPods, Apple Watch ou Mac, quer câmera consistente e pretende ficar vários anos com o aparelho. Também pode fazer sentido para quem sai de um iPhone 11, 12 ou 13 e quer um salto claro de desempenho, bateria e recursos de câmera.",
            ),
            (
                "Quando é melhor esperar",
                "Espere se o preço estiver próximo de modelos mais novos, se você precisa de tela com recursos mais avançados, se o armazenamento de 128 GB já parece curto para seu uso ou se a loja não deixa claro quem vende e quem entrega. Também vale comparar com o iPhone 16e e com promoções do iPhone 17, porque a diferença de preço pode mudar rápido em períodos de cupom.",
            ),
            (
                "Preço bom não é só desconto alto",
                "Um desconto grande pode ser calculado sobre preço de lançamento ou preço cheio, não sobre o menor valor real do mercado. Para avaliar, compare com histórico de ofertas, preço oficial da Apple Brasil, varejistas grandes e marketplaces. Se a diferença para uma loja mais confiável for pequena, a segurança da compra pode valer mais que economizar pouco.",
            ),
            (
                "Checklist de compra segura",
                "Antes de comprar, confirme: nota fiscal em seu CPF; garantia válida no Brasil; vendedor bem avaliado; produto lacrado; compatibilidade com operadoras brasileiras; armazenamento suficiente; prazo de arrependimento; custo final com frete; e se o pagamento por Pix compensa perder flexibilidade de parcelamento.",
            ),
            (
                "Fontes para verificar",
                "Use páginas de ofertas como sinal de preço, mas confirme especificações no site da Apple Brasil e compare análises de compra em veículos como Canaltech e Tecnoblog. Para preço, confie no valor final do carrinho, não no título da matéria.",
            ),
        ],
        "iphone_18_jp": [
            (
                "結論",
                "iPhone 18の噂は、今すぐ買うべき機種を決めるための確定情報ではありません。現時点で見るべきなのは、どの噂が複数の信頼できるApple系メディアで繰り返されているか、どれが単なる色やデザインの話か、そして日本での発売時期・キャリア販売・下取りに影響するかです。",
            ),
            (
                "いま出ている主な噂",
                "MacRumorsや9to5Mac、Macworld系の記事では、iPhone 18 Pro系の発売時期、チップ、カメラ、通信モデム、色、折りたたみiPhoneとの同時期展開などが話題になっています。ただしAppleが正式発表した内容ではないため、スペック表として受け取るのは早すぎます。",
            ),
            (
                "Proモデルと標準モデルを分けて考える",
                "注意したいのは、iPhone 18という名前で語られていても、噂の中心がiPhone 18 Pro/Pro Maxなのか、標準のiPhone 18なのかで意味が違うことです。複数の噂ではPro系が2026年秋、標準モデルは別時期になる可能性も語られています。買い替え判断ではここを混同しないことが重要です。",
            ),
            (
                "日本で確認すべきこと",
                "日本の読者は、米国発の噂をそのまま購入判断に使わず、日本での価格、キャリアの端末購入プログラム、SIM/eSIM対応、下取り条件、Apple Storeと量販店の在庫、保証サービスを確認する必要があります。海外記事の価格や発売予想は、日本の実売価格とは別物です。",
            ),
            (
                "待つべき人",
                "今のiPhoneに不満が少なく、カメラやAI処理、通信性能の大きな進化を待ちたい人は、正式発表まで待つ価値があります。特にProモデルを狙う人、下取り価格を見ながら買いたい人、キャリアの分割施策を使う人は、噂だけで予約準備を進めるより発表後の条件を見た方が安全です。",
            ),
            (
                "待たなくていい人",
                "バッテリー劣化や故障で今すぐ必要な人、最新Pro機能にこだわらない人、セール中の現行モデルで十分な人は、iPhone 18の噂を理由に無理に待つ必要はありません。噂を待っている間にも、現行モデルの在庫や下取り条件は変わります。",
            ),
            (
                "情報の見分け方",
                "Apple公式発表、複数メディアで一致するサプライチェーン情報、単独リーク、SNS投稿を分けて読みましょう。色やデザインの噂は変わりやすく、発売時期やチップの話も正式発表までは確定ではありません。この記事では、噂は噂として扱い、購入判断は日本での正式条件が出てから行う前提で整理します。",
            ),
        ],
        "kr_admission_bullying": [
            (
                "핵심 정리",
                "2026학년도 대입부터 학교폭력 조치사항은 모든 대입 전형에서 확인해야 하는 요소가 됐습니다. 학생부교과, 학생부종합, 논술, 수능, 실기·실적 전형처럼 전형 유형이 달라도 대학은 학폭 조치사항을 반영해야 합니다. 다만 모든 대학이 똑같이 감점하거나 똑같이 탈락시키는 것은 아니므로, 최종 판단은 반드시 지원 대학의 2026학년도 모집요강과 전형 시행계획으로 확인해야 합니다.",
            ),
            (
                "학생과 학부모가 먼저 봐야 할 것",
                "가장 먼저 확인할 것은 학생부에 어떤 조치사항이 기재되어 있는지, 해당 기록이 대입 자료에 제공되는지, 지원하려는 대학이 그 기록을 어떤 방식으로 반영하는지입니다. 같은 조치라도 대학에 따라 정량 감점, 정성평가 반영, 지원 자격 제한처럼 방식이 달라질 수 있습니다.",
            ),
            (
                "전형별로 어떻게 달라질 수 있나",
                "학생부종합전형에서는 학폭 조치사항이 학교생활 전반의 평가 맥락에서 검토될 수 있고, 학생부교과전형이나 정시에서는 감점표처럼 정량 반영되는 대학도 있습니다. 논술이나 실기 전형도 예외라고 보면 안 됩니다. 2026학년도에는 전 전형 반영이 핵심이므로, ‘정시는 괜찮다’거나 ‘논술은 상관없다’고 단정하면 위험합니다.",
            ),
            (
                "조치 번호만 보고 결론 내리면 안 되는 이유",
                "학교폭력 조치사항은 1호부터 9호까지 있지만, 번호 하나만으로 모든 대학의 결과를 예측할 수는 없습니다. 어떤 대학은 낮은 조치도 평가에 반영할 수 있고, 어떤 대학은 높은 조치에 대해 더 큰 감점이나 지원 제한을 둘 수 있습니다. 그래서 인터넷 표 하나로 결론을 내리기보다, 대학별 반영 기준을 직접 확인해야 합니다.",
            ),
            (
                "지원 전 체크리스트",
                "지원 전에는 다섯 가지를 확인하세요. 첫째, 학생부 기록과 삭제·보존 여부. 둘째, 지원 대학의 학폭 조치사항 반영 방식. 셋째, 전형별 감점 또는 지원 제한 기준. 넷째, 검정고시·자퇴·졸업생 등 본인 상황에 대한 제출 서류. 다섯째, 이의신청이나 소명 절차가 가능한지 여부입니다.",
            ),
            (
                "검색 글을 볼 때 주의할 점",
                "검색 상단의 정리 글만 보고 불안해할 필요는 없지만, 반대로 가볍게 넘겨서도 안 됩니다. 블로그형 총정리 글은 흐름을 이해하는 데 도움이 되고, 실제 지원 판단은 대학별 모집요강과 대교협·교육부 자료를 기준으로 해야 합니다. 특히 ‘무조건 불합격’이나 ‘전혀 영향 없음’처럼 단정적인 말은 믿기 어렵습니다.",
            ),
            (
                "어디서 확인해야 하나",
                "가장 중요한 출처는 지원 대학의 2026학년도 모집요강, 대학입학전형 시행계획, 한국대학교육협의회와 교육부가 안내한 2026학년도 대입 기본사항 및 학폭 반영 가이드라인입니다. 입시기관 글은 이해를 돕는 자료로 쓰고, 최종 지원 전략은 공식 자료와 학교 상담을 함께 확인하는 방식이 안전합니다.",
            ),
        ],
    }
    return [{"heading": heading, "body": body} for heading, body in sections.get(topic, [])]


def article_experience(strategy: dict[str, Any]) -> dict[str, Any]:
    topic = topic_key(strategy)
    market = str(strategy.get("market") or "")
    language = str(strategy.get("language") or "")
    slug = str(strategy.get("slug") or "")
    common_internal_links = localized_internal_links(language, market, slug)
    experiences: dict[str, dict[str, Any]] = {
        "samsung_s90f": {
            "heroImage": {
                "src": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1400&q=80",
                "alt": "OLED television in a living room setup",
                "caption": "Illustrative OLED TV setup. Verify exact Samsung S90F size and retailer terms before buying.",
            },
            "quickFacts": [
                {"label": "Best for", "value": "OLED movie and gaming buyers comparing a limited-time discount"},
                {"label": "Main risk", "value": "Headline price may apply to one size, seller, or expired deal"},
                {"label": "Must verify", "value": "Model number, size, return policy, warranty, final checkout price"},
                {"label": "Index-ready status", "value": "Ready after editor checks live price and image licensing"},
            ],
            "checklist": [
                "Confirm the exact screen size and model number.",
                "Check whether the seller is the retailer or a marketplace seller.",
                "Compare final checkout price after tax, shipping, and coupons.",
                "Confirm return policy for opened-box TV issues.",
                "Check whether the reviewed panel size matches the listing you plan to buy.",
                "Compare against LG C-series and Samsung S95F pricing before deciding.",
            ],
            "comparisonTable": {
                "title": "Samsung S90F deal decision table",
                "columns": ["Question", "Good sign", "Warning sign"],
                "rows": [
                    ["Price", "Still lower at checkout after tax and shipping", "Deal page price differs from cart price"],
                    ["Seller", "Sold by a major retailer with clear returns", "Marketplace seller with unclear support"],
                    ["Use case", "Gaming, movies, OLED contrast matter most", "Very bright room or Dolby Vision is a must"],
                    ["Evidence", "Review size matches listing size", "Only a different size was tested"],
                ],
            },
            "sourceLinks": [
                {"label": "RTINGS Samsung S90F OLED review", "url": "https://www.rtings.com/tv/reviews/samsung/s90f-oled", "note": "Measurement-heavy review and test data."},
                {"label": "Tom's Guide Samsung S90F review", "url": "https://www.tomsguide.com/tvs/oled-tvs/samsung-s90f-oled-tv-review", "note": "Hands-on review with pros, cons, and test results."},
                {"label": "TechRadar Samsung S90F review", "url": "https://www.techradar.com/televisions/samsung-s90f-review", "note": "Buyer-oriented review and size caveats."},
                {"label": "Technobezz deal signal", "url": "https://www.technobezz.com/best/samsung-class-s90f-smart-tv-with-nq4-processor-drops-to-179799", "note": "Trend/deal source; verify current price before publishing."},
            ],
            "internalLinks": common_internal_links,
        },
        "renta_2025": {
            "heroImage": {
                "src": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
                "alt": "Tax documents and calculator on a desk",
                "caption": "Tax campaign details change by date and personal situation. Use official AEAT sources for final action.",
            },
            "quickFacts": [
                {"label": "Best for", "value": "Spanish taxpayers checking AEAT warnings before filing or correcting"},
                {"label": "Main risk", "value": "Treating a warning as a fine or ignoring official messages"},
                {"label": "Must verify", "value": "Sede electrónica, Renta WEB, campaign dates, supporting documents"},
                {"label": "Index-ready status", "value": "Ready after editor confirms latest AEAT calendar dates"},
            ],
            "checklist": [
                "Entra solo por la Sede electrónica o app oficial.",
                "Identifica qué dato provoca el aviso.",
                "Compara con certificados de empresa, banco, alquiler o donativos.",
                "Revisa deducciones autonómicas antes de corregir.",
                "Guarda justificantes de cualquier cambio.",
                "Pide ayuda si afecta a importes relevantes o situaciones complejas.",
            ],
            "comparisonTable": {
                "title": "Qué hacer según el tipo de aviso",
                "columns": ["Aviso", "Qué revisar", "Qué no hacer"],
                "rows": [
                    ["Dato fiscal diferente", "Certificado o justificante original", "Cambiar la casilla sin documento"],
                    ["Deducción autonómica", "Requisitos de tu comunidad", "Copiar una guía genérica"],
                    ["Ingreso omitido", "Pagador, fecha e importe", "Presentar deprisa sin comparar"],
                    ["Cita o asistencia", "Calendario oficial AEAT", "Esperar al último día"],
                ],
            },
            "sourceLinks": [
                {"label": "Agencia Tributaria - Renta 2025", "url": "https://www3.agenciatributaria.gob.es/Sede/Renta.html", "note": "Official campaign entry point."},
                {"label": "Ministerio de Hacienda campaign note", "url": "https://www.hacienda.gob.es/es-ES/Prensa/Noticias/paginas/2026/20260408-np-aeat-campana-renta-2025.aspx", "note": "Official campaign timing and Renta Directa context."},
                {"label": "AEAT press PDF", "url": "https://sede.agenciatributaria.gob.es/static_files/Sede/Actualidad/Notas_prensa/2026/NP_Inicio_Campana_renta_2025.pdf", "note": "Official notes about preventive notices and campaign support."},
                {"label": "Xataka guide to Hacienda notices", "url": "https://www.xataka.com/basics/avisos-hacienda-antes-multarte-renta-2025-estos-que-recibes-hay-errores-tu-declaracion-2026/amp", "note": "Plain-language explainer used for reader intent comparison."},
            ],
            "internalLinks": common_internal_links,
        },
        "iphone_16_br": {
            "heroImage": {
                "src": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
                "alt": "Smartphone on a desk",
                "caption": "Illustrative smartphone image. Confirm exact iPhone 16 model, storage, seller, and Brazilian warranty.",
            },
            "quickFacts": [
                {"label": "Best for", "value": "Brazil buyers checking whether an iPhone 16 promotion is actually good"},
                {"label": "Main risk", "value": "Expired coupon, marketplace seller, unclear warranty, or weak storage fit"},
                {"label": "Must verify", "value": "Final cart price, nota fiscal, warranty, seller, storage, return window"},
                {"label": "Index-ready status", "value": "Ready after editor confirms live price and store terms"},
            ],
            "checklist": [
                "Confira o preço final no carrinho.",
                "Verifique se há nota fiscal em seu CPF.",
                "Confirme garantia válida no Brasil.",
                "Compare Pix e parcelamento sem juros.",
                "Cheque armazenamento, cor e vendedor.",
                "Compare com iPhone 15, iPhone 16e, iPhone 17 e Androids equivalentes.",
            ],
            "comparisonTable": {
                "title": "iPhone 16 promoção: vale a pena?",
                "columns": ["Critério", "Sinal positivo", "Sinal de alerta"],
                "rows": [
                    ["Preço", "Abaixo do histórico recente no carrinho", "Desconto calculado sobre preço cheio"],
                    ["Loja", "Vendedor confiável e nota fiscal clara", "Marketplace sem suporte claro"],
                    ["Uso", "Ecossistema Apple e anos de uso", "128 GB já é pouco para você"],
                    ["Alternativas", "Diferença boa contra modelos novos", "iPhone 17 ou 16e perto do mesmo preço"],
                ],
            },
            "sourceLinks": [
                {"label": "Tecnoblog iPhone 16 deal signal", "url": "https://tecnoblog.net/achados/iphone-16-atinge-menor-preco-desde-marco-com-44-off-em-promocao/", "note": "Trend/deal source; price must be rechecked."},
                {"label": "Canaltech iPhone 16 price context", "url": "https://canaltech.com.br/smartphone/quanto-vale-a-pena-pagar-no-iphone-16-em-2026/", "note": "Buying-threshold context."},
                {"label": "Apple Brasil iPhone 16", "url": "https://www.apple.com/br/iphone-16/", "note": "Official specs and model details."},
                {"label": "Tecnoblog official price cut context", "url": "https://tecnoblog.net/noticias/iphone-16-fica-ate-13-mais-barato-no-brasil-veja-os-novos-precos/", "note": "Brazil pricing context."},
            ],
            "internalLinks": common_internal_links,
        },
        "iphone_18_jp": {
            "heroImage": {
                "src": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1400&q=80",
                "alt": "Smartphone screen close-up",
                "caption": "Rumor coverage should not be treated as Apple confirmation. Japan pricing and carrier terms may differ.",
            },
            "quickFacts": [
                {"label": "Best for", "value": "Japan readers deciding whether to wait for iPhone 18 rumors"},
                {"label": "Main risk", "value": "Confusing Pro rumors, standard model timing, and Japan launch conditions"},
                {"label": "Must verify", "value": "Apple announcement, Japan price, carrier plan, trade-in, model timing"},
                {"label": "Index-ready status", "value": "Ready after editor updates latest rumor confidence levels"},
            ],
            "checklist": [
                "Proモデルの噂か標準モデルの噂か分けて読む。",
                "Apple公式発表とリーク情報を混同しない。",
                "日本価格、キャリア施策、下取り条件を確認する。",
                "今の端末のバッテリー状態と買い替え時期を比べる。",
                "単独リークより複数メディアで一致する情報を重視する。",
                "正式発表前に発売日や価格を断定しない。",
            ],
            "comparisonTable": {
                "title": "iPhone 18を待つべきか",
                "columns": ["状況", "待つ理由", "待たなくてよい理由"],
                "rows": [
                    ["Proモデル狙い", "カメラやチップ進化を待てる", "現行Proの割引が大きい"],
                    ["標準モデル狙い", "発売時期の噂を確認したい", "今の端末が故障・劣化している"],
                    ["キャリア購入", "施策や返却条件を見たい", "現行プランで十分安い"],
                    ["噂の信頼度", "複数媒体で一致している", "単独リークや色だけの話"],
                ],
            },
            "sourceLinks": [
                {"label": "MacRumors iPhone 18 feature roundup", "url": "https://www.macrumors.com/2026/05/09/iphone-18-pro-10-new-features/", "note": "Apple rumor source used for feature claims."},
                {"label": "9to5Mac iPhone 18 launch timing", "url": "https://9to5mac.com/2026/01/30/iphone-18-isnt-launching-until-next-year-new-report-reaffirms/", "note": "Launch timing and split-lineup context."},
                {"label": "Tom's Guide iPhone 18 rumor guide", "url": "https://www.tomsguide.com/phones/iphones/iphone-18-rumors-everything-we-know-so-far", "note": "Guide-style roundup used for sectioning, summary, and rumor confidence format."},
                {"label": "Macworld color leak coverage", "url": "https://www.macworld.com/article/3151620/new-leak-confirms-new-iphone-18-pro-dark-cherry-light-blue-colors.html", "note": "Narrow rumor example; treat cautiously."},
            ],
            "internalLinks": common_internal_links,
        },
        "kr_admission_bullying": {
            "heroImage": {
                "src": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
                "alt": "Students reviewing documents together",
                "caption": "대입 반영 방식은 대학별로 다릅니다. 최종 판단은 반드시 모집요강과 공식 자료로 확인하세요.",
            },
            "quickFacts": [
                {"label": "대상", "value": "2026학년도 대입 지원자와 학부모"},
                {"label": "핵심 위험", "value": "대학별 반영 방식 차이를 무시하고 단정하는 것"},
                {"label": "반드시 확인", "value": "학생부 기록, 대학별 모집요강, 전형별 감점/제한 기준"},
                {"label": "공개 준비 상태", "value": "공식 자료 링크와 대학별 예시 확인 뒤 index 전환 가능"},
            ],
            "checklist": [
                "학생부에 어떤 조치사항이 기재되어 있는지 확인한다.",
                "지원 대학의 2026학년도 모집요강을 직접 확인한다.",
                "전형별 감점, 정성평가, 지원 제한 여부를 나눠 본다.",
                "졸업생, 검정고시, 전학 등 본인 상황에 필요한 서류를 확인한다.",
                "오래된 입시 글과 2026학년도 기준을 구분한다.",
                "불확실하면 학교 상담 또는 대학 입학처에 확인한다.",
            ],
            "comparisonTable": {
                "title": "전형별 확인 포인트",
                "columns": ["전형", "확인할 점", "주의할 점"],
                "rows": [
                    ["학생부종합", "정성평가 반영 방식", "대학별 판단 기준이 다를 수 있음"],
                    ["학생부교과", "정량 감점표 여부", "점수 차이가 큰 모집단위는 영향이 커질 수 있음"],
                    ["정시/수능", "수능 전형 반영 방식", "정시는 괜찮다고 단정하면 위험"],
                    ["논술/실기", "지원 제한 또는 감점 여부", "전형명만 보고 예외로 판단하지 말 것"],
                ],
            },
            "sourceLinks": [
                {"label": "2026학년도 학폭 대입 반영 총정리", "url": "https://ystudy200708.tistory.com/33", "note": "블로그형 총정리 글의 대학별 비교표와 확인 항목 구조."},
                {"label": "법무법인 슈가스퀘어 대입 학폭 기준 정리", "url": "https://blog.sugar.legal/%ED%95%99%EA%B5%90%ED%8F%AD%EB%A0%A5-%EC%83%9D%EA%B8%B0%EB%B6%80-%EA%B8%B0%EB%A1%9D-2027-%EB%8C%80%EC%9E%85%EC%97%90%EC%84%9C-%EC%96%B4%EB%94%94%EA%B9%8C%EC%A7%80-%EB%B6%88%EB%A6%AC%ED%95%A0%EA%B9%8C-%EC%8B%A4%EC%A0%9C-%ED%83%88%EB%9D%BD-%EA%B8%B0%EC%A4%80-%EC%A0%95%EB%A6%AC-88964", "note": "블로그형 법률/입시 해설의 실제 기준 정리 방식."},
                {"label": "한국대학교육협의회 2026 기본사항", "url": "https://kcue.or.kr/news/sub02/sub01.php?at=view&idx=24138", "note": "공식 제도 근거와 대학별 자율 반영 원칙."},
                {"label": "정책브리핑 2026 대입 기본사항 자료", "url": "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156588049", "note": "교육부/대교협 자료와 가이드라인 파일 확인 경로."},
            ],
            "internalLinks": common_internal_links,
        },
    }
    selected = {**experiences.get(topic, {}), **serp_format_experience(topic, language)}
    for source in selected.get("sourceLinks", []):
        source.setdefault("checkedAt", "2026-05-31")
    return {
        "heroImage": selected.get("heroImage"),
        "articleMeta": selected.get("articleMeta", {}),
        "keyTakeaways": selected.get("keyTakeaways", []),
        "verdictBox": selected.get("verdictBox"),
        "prosCons": selected.get("prosCons"),
        "serpReferences": selected.get("serpReferences", []),
        "quickFacts": selected.get("quickFacts", []),
        "checklist": selected.get("checklist", []),
        "comparisonTable": selected.get("comparisonTable"),
        "sourceLinks": selected.get("sourceLinks", []),
        "internalLinks": selected.get("internalLinks", common_internal_links),
        "seoReadinessScore": seo_readiness_score(selected),
    }


def serp_format_experience(topic: str, language: str) -> dict[str, Any]:
    checked_at = "2026-05-31"
    common_basis = {
        "en": "Search top pages + primary sources",
        "es": "Páginas mejor posicionadas + fuentes oficiales",
        "pt-br": "Páginas bem posicionadas + fontes oficiais",
        "ja": "上位ページ + 公式/検証情報",
        "ko": "상위 검색 페이지 + 공식 근거",
    }.get(language, "Search top pages + primary sources")
    reading_time = {"es": "6 min de lectura", "pt-br": "6 min de leitura", "ja": "約6分", "ko": "약 6분"}.get(language, "6 min read")
    reviewer = {"es": "Revisión editorial", "pt-br": "Revisão editorial", "ja": "編集レビュー", "ko": "편집 검토"}.get(language, "Editorial review")

    shared_meta = {
        "checkedAt": checked_at,
        "readingTime": reading_time,
        "reviewer": reviewer,
        "basis": common_basis,
    }
    formats: dict[str, dict[str, Any]] = {
        "samsung_s90f": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "Treat the deal page as a live-price signal, not final proof of value.",
                "Compare the exact size, panel notes, return terms, and warranty before buying.",
                "Use measurement-heavy reviews to judge performance and deal pages only for current pricing.",
            ],
            "verdictBox": {
                "label": "Verdict",
                "body": "A strong S90F deal can be worth acting on, but only after the checkout price, seller, size, and panel evidence match your use case.",
            },
            "prosCons": {
                "pros": ["Strong OLED review consensus", "Clear gaming and movie use case", "Several expert reviews provide test context"],
                "cons": ["Deal prices expire quickly", "Panel and size caveats matter", "No Dolby Vision can be a drawback"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "Tom's Guide S90F review",
                    "url": "https://www.tomsguide.com/tvs/oled-tvs/samsung-s90f-oled-tv-review",
                    "formatPattern": "Hero image, verdict box, pros/cons, jump links, specs, test results.",
                },
                {
                    "rank": "2",
                    "label": "TechRadar S90F review",
                    "url": "https://www.techradar.com/televisions/samsung-s90f-review",
                    "formatPattern": "Verdict, price links, pros/cons, jump-to navigation, should-you-buy section.",
                },
                {
                    "rank": "3",
                    "label": "RTINGS S90F lab review",
                    "url": "https://www.rtings.com/tv/reviews/samsung/s90f-oled",
                    "formatPattern": "Specs, measurements, use-case scores, comparison-oriented review structure.",
                },
                {
                    "rank": "4",
                    "label": "Technobezz S90F deal signal",
                    "url": "https://www.technobezz.com/best/samsung-class-s90f-smart-tv-with-nq4-processor-drops-to-179799",
                    "formatPattern": "Deal-led headline, price hook, short buying context.",
                },
            ],
        },
        "renta_2025": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "A tax notice is a prompt to verify data; it is not automatically a fine.",
                "Official AEAT and Hacienda pages should outrank media summaries for final action.",
                "The safest format is: dates, notice types, what to check, and what not to change without proof.",
            ],
            "verdictBox": {
                "label": "Criterio práctico",
                "body": "Revisa el aviso dentro de canales oficiales, localiza el dato afectado y corrige solo con justificantes.",
            },
            "prosCons": {
                "pros": ["Hay fuentes oficiales claras", "La intención de búsqueda pide pasos concretos", "Las fechas y avisos se pueden ordenar en tabla"],
                "cons": ["Una guía genérica puede causar errores", "Los plazos cambian según forma de presentación", "Las deducciones dependen de cada comunidad"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "Xataka Basics aviso Hacienda",
                    "url": "https://www.xataka.com/basics/avisos-hacienda-antes-multarte-renta-2025-estos-que-recibes-hay-errores-tu-declaracion-2026/amp",
                    "formatPattern": "H1, subtitle, date, author, direct explainer intro, list of notice types.",
                },
                {
                    "rank": "2",
                    "label": "AEAT Renta 2025",
                    "url": "https://www3.agenciatributaria.gob.es/Sede/Renta.html",
                    "formatPattern": "Official campaign hub with service entry points and current campaign framing.",
                },
                {
                    "rank": "3",
                    "label": "Hacienda campaign release",
                    "url": "https://www.hacienda.gob.es/es-ES/Prensa/Noticias/paginas/2026/20260408-np-aeat-campana-renta-2025.aspx",
                    "formatPattern": "Official dates, assistance channels, campaign context.",
                },
                {
                    "rank": "4",
                    "label": "AEAT press PDF",
                    "url": "https://sede.agenciatributaria.gob.es/static_files/Sede/Actualidad/Notas_prensa/2026/NP_Inicio_Campana_renta_2025.pdf",
                    "formatPattern": "Primary-source campaign details, preventive notices, support notes.",
                },
            ],
        },
        "iphone_16_br": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "The winning format for deal intent starts with price, coupon, date, and seller checks.",
                "A useful article separates the live offer from durable buying criteria.",
                "The reader needs a quick verdict, specs that matter, and red flags before any store click.",
            ],
            "verdictBox": {
                "label": "Veredito rápido",
                "body": "A promoção só faz sentido se o preço final, a nota fiscal, a garantia no Brasil e o vendedor forem confirmados no carrinho.",
            },
            "prosCons": {
                "pros": ["Busca com intenção de compra clara", "Há páginas de oferta e guias de preço", "Especificações oficiais ajudam a confirmar o modelo"],
                "cons": ["Cupom pode expirar", "Marketplace e garantia exigem checagem", "Preço cheio pode inflar o desconto"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "Mobile Bit iPhone 16 deal",
                    "url": "https://www.mobilebit.com.br/produtos/2026/01/31/iphone-16-256-gb-sai-por-r-5-299-no-app-com-cupom-aplicado/",
                    "formatPattern": "Deal headline, discount subtitle, last updated date, author, reading time, hero image.",
                },
                {
                    "rank": "2",
                    "label": "Tecnoblog iPhone 16 deal",
                    "url": "https://tecnoblog.net/achados/iphone-16-atinge-menor-preco-desde-marco-com-44-off-em-promocao/",
                    "formatPattern": "Price-led deal post, coupon context, quick product reasons.",
                },
                {
                    "rank": "3",
                    "label": "Canaltech buying threshold",
                    "url": "https://canaltech.com.br/smartphone/quanto-vale-a-pena-pagar-no-iphone-16-em-2026/",
                    "formatPattern": "Buying-guide framing with price threshold and alternatives.",
                },
                {
                    "rank": "4",
                    "label": "Apple Brasil iPhone 16",
                    "url": "https://www.apple.com/br/iphone-16/",
                    "formatPattern": "Official specs and feature confirmation.",
                },
            ],
        },
        "iphone_18_jp": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "Top rumor roundups separate at-a-glance bullets, timeline, and individual rumor sections.",
                "Japan readers need local price, carrier, trade-in, and timing notes layered onto global rumors.",
                "The article should label confidence and avoid treating leaks as Apple confirmation.",
            ],
            "verdictBox": {
                "label": "判断",
                "body": "iPhone 18の噂は買い替え判断の材料にはなるが、正式発表前に価格・発売日・日本のキャリア条件を断定しない。",
            },
            "prosCons": {
                "pros": ["複数のApple系メディアで噂が整理されている", "発売時期とモデル分割が読者の判断軸になる", "日本向け確認事項を追加できる"],
                "cons": ["未確認情報が多い", "Proと標準モデルの噂が混ざりやすい", "日本価格は正式発表まで不明"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "MacRumors iPhone 18 roundup",
                    "url": "https://www.macrumors.com/roundup/iphone-18/",
                    "formatPattern": "At a glance bullets, rumored features, timeline, last updated note, sectioned roundup.",
                },
                {
                    "rank": "2",
                    "label": "MacRumors iPhone 18 Pro features",
                    "url": "https://www.macrumors.com/2026/05/09/iphone-18-pro-10-new-features/",
                    "formatPattern": "Feature list, rumor grouping, model-specific framing.",
                },
                {
                    "rank": "3",
                    "label": "9to5Mac iPhone 18 timing",
                    "url": "https://9to5mac.com/2026/01/30/iphone-18-isnt-launching-until-next-year-new-report-reaffirms/",
                    "formatPattern": "Launch timing hook, report confirmation, concise analysis.",
                },
                {
                    "rank": "4",
                    "label": "Tom's Guide iPhone 18 rumor guide",
                    "url": "https://www.tomsguide.com/phones/iphones/iphone-18-rumors-everything-we-know-so-far",
                    "formatPattern": "Guide-style rumor roundup with updated date, scannable sections, and practical buyer context.",
                },
            ],
        },
        "kr_admission_bullying": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "상위 글은 전 전형 반영, 대학별 차이, 조치사항별 불이익을 먼저 정리한다.",
                "독자는 검색 글보다 모집요강에서 무엇을 봐야 하는지 빠른 체크리스트가 필요하다.",
                "대학별 감점·지원 제한을 단정하지 않고 확인 경로를 분리해야 한다.",
            ],
            "verdictBox": {
                "label": "핵심 판단",
                "body": "2026 대입 학폭 반영은 모든 전형에서 확인해야 하지만, 실제 불이익 방식은 대학과 전형별 모집요강으로 따로 확인해야 합니다.",
            },
            "prosCons": {
                "pros": ["공식 제도 방향이 명확함", "대학별 차이를 표로 정리할 수 있음", "학생·학부모 행동 목록으로 전환 가능"],
                "cons": ["무조건 탈락처럼 단정하면 위험", "오래된 2024/2025 설명과 2026 기준이 섞일 수 있음", "대학별 모집요강 확인이 필수"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "Tistory 학폭 대입 반영 총정리",
                    "url": "https://ystudy200708.tistory.com/33",
                    "formatPattern": "총정리형 제목, 대학별 비교, 긴 체크리스트, 표 중심 구성.",
                },
                {
                    "rank": "2",
                    "label": "슈가스퀘어 학폭 생기부 대입 기준",
                    "url": "https://blog.sugar.legal/%ED%95%99%EA%B5%90%ED%8F%AD%EB%A0%A5-%EC%83%9D%EA%B8%B0%EB%B6%80-%EA%B8%B0%EB%A1%9D-2027-%EB%8C%80%EC%9E%85%EC%97%90%EC%84%9C-%EC%96%B4%EB%94%94%EA%B9%8C%EC%A7%80-%EB%B6%88%EB%A6%AC%ED%95%A0%EA%B9%8C-%EC%8B%A4%EC%A0%9C-%ED%83%88%EB%9D%BD-%EA%B8%B0%EC%A4%80-%EC%A0%95%EB%A6%AC-88964",
                    "formatPattern": "법률 블로그형 문제 정의, 실제 기준, 대학별 사례, 상담 전 확인 목록.",
                },
                {
                    "rank": "3",
                    "label": "정책브리핑 2026 기본사항",
                    "url": "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156588049",
                    "formatPattern": "공식 자료 허브, 첨부파일, 제도 요약, 근거 확인 경로.",
                },
                {
                    "rank": "4",
                    "label": "대입정보포털 대학별 전형 정보",
                    "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2026&unvCd=0000030",
                    "formatPattern": "대학별 전형 상세, 표 기반 확인, 모집요강 검증 흐름.",
                },
            ],
        },
    }
    return formats.get(topic, {"articleMeta": shared_meta, "keyTakeaways": [], "serpReferences": []})


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


def topic_key(strategy: dict[str, Any]) -> str:
    text = " ".join(
        [
            str(strategy.get("slug") or ""),
            str(strategy.get("titleStrategy") or ""),
            str(strategy.get("recommendedAngle") or ""),
        ]
    ).lower()
    if "samsung-s90f" in text or "samsung s90f" in text:
        return "samsung_s90f"
    if "renta-2025" in text or "renta 2025" in text:
        return "renta_2025"
    if "iphone-16" in text or "iphone 16" in text:
        return "iphone_16_br"
    if "iphone-18" in text or "iphone 18" in text:
        return "iphone_18_jp"
    if "학폭" in text or "대입" in text:
        return "kr_admission_bullying"
    return "generic"


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


def brief_markdown(strategy: dict[str, Any]) -> str:
    lines = [
        f"# {strategy.get('titleStrategy')}",
        "",
        f"Reader angle: {strategy.get('recommendedAngle')}",
        "",
        "## Outline",
    ]
    for section in strategy.get("sectionPlanJson", []):
        if isinstance(section, dict):
            lines.append(f"- {section.get('heading')}: {section.get('purpose')}")
    return "\n".join(lines)


def markdown_article(title: str, sections: list[dict[str, str]]) -> str:
    lines = [f"# {title}"]
    for section in sections:
        lines.extend(["", f"## {section['heading']}", section["body"]])
    return "\n".join(lines)
