from __future__ import annotations

from typing import Any

def article_experience_record(topic: str, internal_links: list[dict[str, str]]) -> dict[str, Any]:
    common_internal_links = internal_links
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
                {"label": "Technobezz deal context", "url": "https://www.technobezz.com/best/samsung-class-s90f-smart-tv-with-nq4-processor-drops-to-179799", "note": "Deal context; verify the current price and retailer terms before buying."},
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
                {"label": "Para quién", "value": "Contribuyentes que ven avisos de la AEAT antes de presentar o corregir"},
                {"label": "Riesgo principal", "value": "Confundir un aviso preventivo con una multa o ignorar mensajes oficiales"},
                {"label": "Comprobar", "value": "Sede electrónica, Renta WEB, calendario y justificantes"},
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
                {"label": "Agencia Tributaria - Renta 2025", "url": "https://www3.agenciatributaria.gob.es/Sede/Renta.html", "note": "Entrada oficial de la campaña y trámites."},
                {"label": "Ministerio de Hacienda - campaña Renta", "url": "https://www.hacienda.gob.es/es-ES/Prensa/Noticias/paginas/2026/20260408-np-aeat-campana-renta-2025.aspx", "note": "Fechas oficiales y contexto de asistencia."},
                {"label": "PDF oficial de la AEAT", "url": "https://sede.agenciatributaria.gob.es/static_files/Sede/Actualidad/Notas_prensa/2026/NP_Inicio_Campana_renta_2025.pdf", "note": "Notas oficiales sobre avisos preventivos y ayuda de campaña."},
                {"label": "Guía de Xataka sobre avisos de Hacienda", "url": "https://www.xataka.com/basics/avisos-hacienda-antes-multarte-renta-2025-estos-que-recibes-hay-errores-tu-declaracion-2026/amp", "note": "Explicación en lenguaje claro para comparar la intención del lector."},
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
                {"label": "Para quem", "value": "Compradores no Brasil avaliando se uma promoção do iPhone 16 vale a pena"},
                {"label": "Risco principal", "value": "Cupom expirado, marketplace, garantia pouco clara ou armazenamento insuficiente"},
                {"label": "Verificar", "value": "Preço final, nota fiscal, garantia, vendedor, armazenamento e devolução"},
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
                {"label": "Tecnoblog - sinal de oferta do iPhone 16", "url": "https://tecnoblog.net/achados/iphone-16-atinge-menor-preco-desde-marco-com-44-off-em-promocao/", "note": "Fonte de oferta; o preço precisa ser conferido novamente."},
                {"label": "Canaltech - contexto de preço do iPhone 16", "url": "https://canaltech.com.br/smartphone/quanto-vale-a-pena-pagar-no-iphone-16-em-2026/", "note": "Referência para avaliar faixa de preço e alternativas."},
                {"label": "Apple Brasil - iPhone 16", "url": "https://www.apple.com/br/iphone-16/", "note": "Especificações oficiais e detalhes do modelo."},
                {"label": "Tecnoblog - contexto de preço no Brasil", "url": "https://tecnoblog.net/noticias/iphone-16-fica-ate-13-mais-barato-no-brasil-veja-os-novos-precos/", "note": "Contexto de reajuste e preço oficial no mercado brasileiro."},
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
                {"label": "対象", "value": "iPhone 18を待つべきか迷っている日本の読者"},
                {"label": "主なリスク", "value": "Proモデルの噂、標準モデルの時期、日本の販売条件を混同すること"},
                {"label": "確認すること", "value": "Apple公式発表、日本価格、キャリア施策、下取り、モデル別時期"},
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
                {"label": "MacRumors - iPhone 18機能まとめ", "url": "https://www.macrumors.com/2026/05/09/iphone-18-pro-10-new-features/", "note": "機能に関する噂を確認するためのApple系情報源。"},
                {"label": "9to5Mac - iPhone 18発売時期", "url": "https://9to5mac.com/2026/01/30/iphone-18-isnt-launching-until-next-year-new-report-reaffirms/", "note": "発売時期とラインアップ分割の文脈。"},
                {"label": "Tom's Guide - iPhone 18噂ガイド", "url": "https://www.tomsguide.com/phones/iphones/iphone-18-rumors-everything-we-know-so-far", "note": "噂の整理、要約、信頼度の見せ方を確認。"},
                {"label": "Macworld - カラー噂の例", "url": "https://www.macworld.com/article/3151620/new-leak-confirms-new-iphone-18-pro-dark-cherry-light-blue-colors.html", "note": "限定的な噂の例。購入判断では慎重に扱う。"},
            ],
            "internalLinks": common_internal_links,
        },
        "runway_aleph_jp": {
            "heroImage": {
                "src": "/images/trend-articles/runway-aleph-ai-video-editor.png",
                "alt": "AI動画編集のタイムライン画面を表示した制作デスク",
                "caption": "AI動画編集ツールはデモ映像だけでなく、料金、権利、修正精度、制作フローで比較する必要があります。",
            },
            "quickFacts": [
                {"label": "対象", "value": "AIで既存動画を直したい制作者、マーケター、短尺動画チーム"},
                {"label": "主なリスク", "value": "料金とクレジット消費、商用利用条件、意図通りに直らない出力"},
                {"label": "比較対象", "value": "Runway、CapCut、Adobe Premiere Pro/After Effects、Canva系AI動画ツール"},
            ],
            "checklist": [
                "既存動画のどこをAIで直したいのかを決める。",
                "商用利用できるプランか確認する。",
                "月額だけでなくクレジット消費を確認する。",
                "失敗出力や再生成のコストを見積もる。",
                "CapCutやAdobe系ツールでも同じ作業を試す。",
                "納品解像度、透かし、チーム共有、素材権利を確認する。",
            ],
            "comparisonTable": {
                "title": "AI動画編集ツール比較の見方",
                "columns": ["比較軸", "Runway Aleph 2.0で見る点", "代替ツールで見る点"],
                "rows": [
                    ["既存動画の修正", "テキスト指示で映像全体の整合性を保てるか", "手動編集やテンプレ編集で十分か"],
                    ["料金", "月額とクレジット消費の両方", "買い切り、月額、無料枠の制限"],
                    ["商用利用", "プラン別の利用条件と素材権利", "広告案件で使えるか"],
                    ["制作フロー", "生成から修正まで一体化できるか", "既存編集ソフトとの連携しやすさ"],
                ],
            },
            "sourceLinks": [
                {"label": "Google Trends RSS JP", "url": "https://trends.google.com/trending/rss?geo=JP", "note": "2026-05-31の上昇検索でRunway Aleph 2.0関連ニュースを確認。"},
                {"label": "Ledge.ai - Runway Aleph 2.0", "url": "https://ledge.ai/articles/runway_aleph_2_edit_studio", "note": "日本語トレンド元ニュース。Edit StudioとAleph 2.0の概要確認。"},
                {"label": "Runway公式 - Aleph", "url": "https://runwayml.com/product/aleph-2", "note": "公式機能説明。実際の可否や仕様は公式情報を優先。"},
                {"label": "Runway Help - Edit Studio", "url": "https://help.runwayml.com/hc/en-us/articles/44720423850131-Edit-Studio", "note": "Edit Studioの使い方と機能範囲の確認。"},
                {"label": "TECH NOISY - Runway MCP", "url": "https://tech-noisy.com/2026/05/29/runway-mcp-gen-4-5-veo-integration/", "note": "ChatGPT/Claudeからの利用文脈を確認。"},
            ],
            "internalLinks": common_internal_links,
        },
        "kr_gaming_monitor": {
            "heroImage": {
                "src": "/images/trend-articles/gaming-monitor-korea-2026.png",
                "alt": "밝은 책상 위에 놓인 게이밍 모니터와 키보드",
                "caption": "게이밍 모니터는 해상도, 주사율, 패널, 보증 조건을 함께 봐야 장기 만족도가 높습니다.",
            },
            "quickFacts": [
                {"label": "추천 기준", "value": "대부분의 PC 게이머는 27형 QHD 144~180Hz부터 비교"},
                {"label": "주요 리스크", "value": "1ms 표기만 보고 잔상, 입력 지연, 보증을 놓치는 것"},
                {"label": "먼저 확인", "value": "해상도, 주사율, 패널, HDMI/DP, VRR, AS 정책"},
                {"label": "가격 기준", "value": "30~50만 원대는 QHD 고주사율 제품 비교가 가장 현실적"},
            ],
            "checklist": [
                "내 그래픽카드가 QHD 고주사율을 안정적으로 낼 수 있는지 확인한다.",
                "게임 장르에 맞게 24형, 27형, 32형 중 화면 크기를 먼저 고른다.",
                "상세페이지의 1ms 문구보다 실제 잔상과 입력 지연 평가를 확인한다.",
                "HDMI 2.1, DP 버전, VRR, G-Sync/FreeSync 호환을 확인한다.",
                "스탠드 높낮이, 피벗, 베사홀, 책상 깊이까지 함께 본다.",
                "불량화소와 패널 보증, OLED 번인 보증 조건을 확인한다.",
            ],
            "comparisonTable": {
                "title": "게이밍 모니터 선택 기준표",
                "columns": ["사용자 유형", "우선 사양", "주의할 점"],
                "rows": [
                    ["FPS 위주", "24~27형, 144Hz 이상, 낮은 입력 지연", "큰 화면보다 반응성과 시야 확보가 중요"],
                    ["RPG/콘솔 위주", "27~32형 QHD 또는 4K, HDR, 명암비", "그래픽카드 성능과 콘솔 주사율 지원 확인"],
                    ["작업 겸용", "IPS/QHD, 색역, 밝기, 스탠드 조절", "게임 성능만 보고 색 정확도를 놓치지 않기"],
                    ["프리미엄 OLED", "빠른 응답, 높은 명암, 번인 보증", "가격과 장기 보증 조건을 반드시 확인"],
                ],
            },
            "sourceLinks": [
                {"label": "Google Trends RSS KR", "url": "https://trends.google.com/trending/rss?geo=KR", "note": "2026-06-01에 한국 시장의 게임 관련 관심 흐름을 확인."},
                {"label": "똑체크 게이밍 모니터 추천", "url": "https://ddokcheck.com/gaming-monitor-recommendation-top5/", "note": "제품 카드와 구매 기준 구성 확인."},
                {"label": "Tomorrow Bliss 게이밍 모니터 추천", "url": "https://tomorrowbliss.com/%EA%B2%8C%EC%9D%B4%EB%B0%8D-%EB%AA%A8%EB%8B%88%ED%84%B0-%EC%B6%94%EC%B2%9C/", "note": "해상도, 주사율, 가격대 설명 흐름 확인."},
                {"label": "CARESIDE 게이밍 모니터 추천", "url": "https://careside.co.kr/best-gaming-monitor/", "note": "목록형 비교, 장단점, 구매 전 확인 항목 구성 확인."},
            ],
            "internalLinks": common_internal_links,
        },
        "kr_kbo_all_star_vote": {
            "heroImage": {
                "src": "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1400&q=80",
                "alt": "야구장 관중석과 그라운드",
                "caption": "올스타 팬투표는 후보 명단, 투표 기간, 앱 안내를 공식 공지와 함께 확인해야 합니다.",
            },
            "quickFacts": [
                {"label": "트렌드 확인", "value": "KR Google Trends RSS에서 2026-06-01 기준 KBO 올스타 투표 관심 확인"},
                {"label": "핵심 이슈", "value": "베스트12 후보 120명 발표와 팬투표 시작"},
                {"label": "팬 체크", "value": "후보 명단, 투표 기간, 앱 참여 방식, 최종 발표 일정"},
                {"label": "주의점", "value": "선수 누락 이슈는 공식 후보표와 포지션 기준을 함께 확인"},
            ],
            "checklist": [
                "KBO 공식 안내에서 팬투표 기간을 다시 확인한다.",
                "신한 SOL뱅크 등 투표 앱에서 실제 참여 가능 여부를 확인한다.",
                "후보 명단을 포지션별로 보고 응원 선수 포함 여부를 확인한다.",
                "1일 투표 횟수, 중복 선택, 변경 가능 여부를 확인한다.",
                "최종 베스트12 발표 방식과 선수단 투표 반영 여부를 확인한다.",
                "올스타전 관람 예정이면 티켓 공지와 예매 일정을 별도로 확인한다.",
            ],
            "comparisonTable": {
                "title": "KBO 올스타 팬투표 확인표",
                "columns": ["확인 항목", "먼저 볼 곳", "놓치기 쉬운 점"],
                "rows": [
                    ["후보 명단", "KBO 공식 안내와 관련 보도", "포지션과 구단별 후보 구분"],
                    ["투표 방식", "투표 앱 화면", "1일 투표 횟수와 변경 가능 여부"],
                    ["선수 누락 이슈", "공식 후보표", "화제성 기사와 실제 후보 기준 구분"],
                    ["관람 준비", "KBO/예매처 공지", "투표 일정과 티켓 일정은 별도일 수 있음"],
                ],
            },
            "sourceLinks": [
                {
                    "label": "Google Trends RSS KR",
                    "url": "https://trends.google.com/trending/rss?geo=KR",
                    "note": "2026-06-01 기준 'kbo 올스타 투표'와 'kbo' 상승 검색 확인.",
                    "checkedAt": "2026-06-02",
                },
                {
                    "label": "연합뉴스 - KBO 올스타 팬투표 후보 발표",
                    "url": "https://www.yna.co.kr/view/AKR20260601143900007",
                    "note": "팬투표 후보 120명 발표 보도.",
                    "checkedAt": "2026-06-02",
                },
                {
                    "label": "디지털투데이 - KBO 올스타 팬투표 시작",
                    "url": "https://www.digitaltoday.co.kr/en/view/59476/shinhan-bank-to-open-kbo-all-star-game-fan-voting-on-june-1",
                    "note": "신한은행 SOL뱅크 KBO 올스타 팬투표 시작 보도.",
                    "checkedAt": "2026-06-02",
                },
                {
                    "label": "조선일보 - 류현진 후보 제외 이슈",
                    "url": "https://www.chosun.com/sports/baseball/2026/06/02/G5RDIMBWMRQTMOBYGIZTSNLCGI/",
                    "note": "후보 명단 확인 시 팬들이 헷갈릴 수 있는 선수 누락 이슈 확인.",
                    "checkedAt": "2026-06-02",
                },
            ],
            "internalLinks": common_internal_links,
        },
    }

    return experiences.get(topic, {})
