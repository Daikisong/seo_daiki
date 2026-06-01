from __future__ import annotations

from typing import Any

def serp_format_experience(topic: str, language: str) -> dict[str, Any]:
    checked_at = "2026-05-31"
    common_basis = {
        "en": "Sources checked",
        "es": "Fuentes revisadas",
        "pt-br": "Fontes verificadas",
        "ja": "確認済み情報",
        "ko": "확인한 자료",
    }.get(language, "Sources checked")
    reading_time = {"es": "6 min de lectura", "pt-br": "6 min de leitura", "ja": "約6分", "ko": "약 6분"}.get(language, "6 min read")
    reviewer = {
        "es": "Equipo editorial de Guía de reseñas",
        "pt-br": "Equipe editorial do Guia de reviews",
        "ja": "レビューガイド編集部",
        "ko": "리뷰 가이드 편집팀",
    }.get(language, "Review Guide editorial team")

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
                "Un aviso fiscal sirve para revisar datos; no significa automáticamente una multa.",
                "Para actuar, las páginas oficiales de la AEAT y Hacienda pesan más que cualquier resumen externo.",
                "Comprueba fechas, tipo de aviso y justificantes antes de modificar la declaración.",
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
                "Antes de considerar a promoção, confira preço final, cupom, data e vendedor.",
                "O artigo precisa separar a oferta do momento dos critérios duráveis de compra.",
                "Antes de clicar em qualquer loja, o leitor precisa de veredito rápido, especificações importantes e sinais de alerta.",
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
                "噂は、要点、発売時期、個別情報を分けて確認する必要がある。",
                "日本の読者には、世界的な噂に加えて日本価格、キャリア、下取り、発売時期の確認が必要。",
                "リークをApple公式発表のように扱わず、確度を分けて読むことが大切。",
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
                    "formatPattern": "Launch timeline hook, report source confirmation, concise section analysis.",
                },
                {
                    "rank": "4",
                    "label": "Tom's Guide iPhone 18 rumor guide",
                    "url": "https://www.tomsguide.com/phones/iphones/iphone-18-rumors-everything-we-know-so-far",
                    "formatPattern": "Guide-style rumor roundup with updated date, scannable sections, and practical buyer context.",
                },
            ],
        },
        "runway_aleph_jp": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "Runway Aleph 2.0は既存動画の修正用途で評価すると判断しやすい。",
                "料金は月額だけでなくクレジット消費と失敗出力のコストを見る必要がある。",
                "CapCutやAdobe系ツールと同じ素材で比較してから制作フローに入れるべき。",
            ],
            "verdictBox": {
                "label": "判断",
                "body": "短尺動画や生成素材の修正が多いチームは試す価値あり。ただし商用利用、料金、クレジット、権利確認なしで本番投入しない。",
            },
            "prosCons": {
                "pros": ["既存動画の編集用途が明確", "生成と修正を同じ流れで扱える", "日本でもAI動画編集への関心が出ている"],
                "cons": ["料金とクレジット消費が読みづらい", "細部修正は一発で決まらない可能性", "長尺編集は既存ソフト併用が現実的"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "Ledge.ai Runway Aleph 2.0",
                    "url": "https://ledge.ai/articles/runway_aleph_2_edit_studio",
                    "formatPattern": "Japanese trend-news headline, feature summary, Edit Studio explanation, quick product context.",
                },
                {
                    "rank": "2",
                    "label": "Runway official Aleph page",
                    "url": "https://runwayml.com/product/aleph-2",
                    "formatPattern": "Official product hero, feature sections, demo-led capability framing, model positioning.",
                },
                {
                    "rank": "3",
                    "label": "Runway Help Edit Studio",
                    "url": "https://help.runwayml.com/hc/en-us/articles/44720423850131-Edit-Studio",
                    "formatPattern": "Help-center guide, step-by-step feature sections, practical workflow instructions.",
                },
                {
                    "rank": "4",
                    "label": "TECH NOISY Runway MCP",
                    "url": "https://tech-noisy.com/2026/05/29/runway-mcp-gen-4-5-veo-integration/",
                    "formatPattern": "Tech-blog explainer, integration headline, tool workflow context, ChatGPT and Claude angle.",
                },
            ],
        },
        "kr_gaming_monitor": {
            "articleMeta": shared_meta,
            "keyTakeaways": [
                "대부분의 게이머는 QHD 144~180Hz급을 기준으로 비교하면 실패 확률이 낮다.",
                "OLED는 반응성과 명암이 강점이지만 가격, 밝기, 번인 보증을 같이 봐야 한다.",
                "제품 링크를 붙이기 전에는 실제 가격, AS, 세부 모델명, 단자 구성을 다시 확인해야 한다.",
            ],
            "verdictBox": {
                "label": "추천",
                "body": "처음 고르는 게이밍 모니터라면 27형 QHD 144~180Hz IPS 계열을 기준으로 두고, 예산과 게임 장르에 따라 OLED나 4K로 올리는 방식이 가장 안전합니다.",
            },
            "prosCons": {
                "pros": ["구매 의도가 분명해 비교표와 체크리스트가 잘 맞음", "제품 후보를 나중에 붙이기 쉬움", "가격대별 선택 기준이 명확함"],
                "cons": ["가격과 재고가 자주 바뀜", "모델명과 세부 코드가 복잡함", "스펙 표기만으로 실제 잔상을 판단하기 어려움"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "똑체크 게이밍 모니터 추천",
                    "url": "https://ddokcheck.com/gaming-monitor-recommendation-top5/",
                    "formatPattern": "추천 목록, 제품 카드, 핵심 스펙 표, 구매 기준, 빠른 비교표를 보여주는 구성.",
                },
                {
                    "rank": "2",
                    "label": "Tomorrow Bliss 게이밍 모니터 추천",
                    "url": "https://tomorrowbliss.com/%EA%B2%8C%EC%9D%B4%EB%B0%8D-%EB%AA%A8%EB%8B%88%ED%84%B0-%EC%B6%94%EC%B2%9C/",
                    "formatPattern": "가격대와 사양을 나누어 설명하고, 입문자가 읽기 쉬운 guide 섹션과 checklist 구성.",
                },
                {
                    "rank": "3",
                    "label": "CARESIDE 게이밍 모니터 추천",
                    "url": "https://careside.co.kr/best-gaming-monitor/",
                    "formatPattern": "목록형 비교, 장단점, 구매 전 checklist, ranking 형태를 결합한 구성.",
                },
                {
                    "rank": "4",
                    "label": "MSI 게이밍 모니터 가이드",
                    "url": "https://kr.msi.com/blog/how-to-choose-a-gaming-monitor",
                    "formatPattern": "official 제조사 guide 섹션으로 해상도, 주사율, 패널 spec을 설명하는 구성.",
                },
            ],
        },
        "kr_kbo_all_star_vote": {
            "articleMeta": {
                "checkedAt": "2026-06-02",
                "readingTime": reading_time,
                "reviewer": reviewer,
                "basis": common_basis,
            },
            "keyTakeaways": [
                "KR Google Trends RSS에서 KBO 올스타 투표와 KBO 검색 관심이 함께 확인됐다.",
                "핵심은 후보 120명 발표, 팬투표 시작, 잠실구장 마지막 올스타전이라는 세 가지 맥락이다.",
                "투표 전에는 후보표, 기간, 앱 참여 방식, 최종 선정 방식을 공식 안내로 다시 확인해야 한다.",
            ],
            "verdictBox": {
                "label": "요약",
                "body": "지금 필요한 글은 승부 예측보다 팬이 바로 확인할 일정, 후보 명단, 투표 방식, 관람 준비를 한 번에 정리하는 뉴스 설명형 글입니다.",
            },
            "prosCons": {
                "pros": ["실시간 검색 관심과 실제 보도가 맞물림", "팬이 바로 행동할 수 있는 일정형 주제", "후보·투표 방식·관람 준비로 구조화하기 좋음"],
                "cons": ["투표 기간과 세부 방식은 공식 안내로 재확인 필요", "선수 후보 관련 이슈는 팬덤 반응과 사실을 구분해야 함", "티켓 일정은 별도 공지가 필요할 수 있음"],
            },
            "serpReferences": [
                {
                    "rank": "1",
                    "label": "연합뉴스 KBO 올스타 후보 발표",
                    "url": "https://www.yna.co.kr/view/AKR20260601143900007",
                    "formatPattern": "핵심 사실을 먼저 제시하고 후보 발표, 투표 시작, 일정 맥락을 짧게 정리하는 뉴스형 구조.",
                },
                {
                    "rank": "2",
                    "label": "디지털투데이 KBO 팬투표 시작",
                    "url": "https://www.digitaltoday.co.kr/en/view/59476/shinhan-bank-to-open-kbo-all-star-game-fan-voting-on-june-1",
                    "formatPattern": "투표 시작일과 앱 참여 경로를 중심으로 정리하는 공지형 뉴스 구조.",
                },
                {
                    "rank": "3",
                    "label": "조선일보 류현진 후보 제외 이슈",
                    "url": "https://www.chosun.com/sports/baseball/2026/06/02/G5RDIMBWMRQTMOBYGIZTSNLCGI/",
                    "formatPattern": "팬 관심이 큰 선수 누락 이슈를 중심으로 후보 명단 확인 수요를 끌어내는 스포츠 뉴스 구조.",
                },
                {
                    "rank": "4",
                    "label": "Daum KBO 올스타 후보 보도",
                    "url": "https://v.daum.net/v/20260601180700261",
                    "formatPattern": "잠실구장 마지막 올스타전이라는 배경과 후보 발표를 묶는 포털 뉴스형 구조.",
                },
            ],
        },
    }
    return formats.get(topic, {"articleMeta": shared_meta, "keyTakeaways": [], "serpReferences": []})
