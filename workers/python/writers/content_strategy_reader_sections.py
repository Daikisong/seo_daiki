from __future__ import annotations

from typing import Any

from workers.python.writers.content_strategy_topics import topic_key

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
        "runway_aleph_jp": (
            "Runway Aleph 2.0とEdit Studioの新機能を、既存動画の編集で何が変わるのか、料金とクレジットをどう見るべきか、CapCutやAdobe系ツールと比較する前に何を確認すべきかまで整理します。"
        ),
        "kr_gaming_monitor": (
            "한국에서 게임 관심이 다시 올라온 흐름에 맞춰, 게이밍 모니터를 살 때 먼저 정해야 할 해상도, 주사율, 패널, 응답속도, AS와 가격대 기준을 한 번에 비교합니다."
        ),
        "kr_kbo_all_star_vote": (
            "2026 KBO 올스타전 팬투표가 시작된 흐름을 바탕으로, 후보 확인 방법과 투표 일정, 잠실구장 마지막 올스타전이라는 맥락, 팬이 헷갈리기 쉬운 확인사항을 정리합니다."
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
        "runway_aleph_jp": [
            (
                "結論",
                "Runway Aleph 2.0は、AIで動画を一から作るというより、既存動画をあとから直すための編集モデルとして見ると判断しやすいツールです。背景や人物の見え方、画角、スタイル、細かな修正をテキスト指示で変えたいクリエイターには試す価値があります。ただし、商用案件で使う前に料金、クレジット消費、権利、修正精度、代替ツールとの差を確認する必要があります。",
            ),
            (
                "なぜ今話題なのか",
                "日本のGoogle Trends RSSでは、2026年5月31日に「チャット」関連の上昇検索としてRunway Aleph 2.0とEdit Studioの話題が出ていました。Ledge.aiは既存動画の一部編集を全体に反映するEdit Studioを紹介し、SlashGear Japan系の記事ではRunway MCPを通じてClaudeやChatGPTから動画生成モデルを呼び出す文脈も扱われています。つまり読者の関心は、単なる発表ニュースではなく、AI編集を実際の制作フローに入れられるかに移っています。",
            ),
            (
                "Aleph 2.0で何ができるのか",
                "Aleph 2.0の中心は、動画内の要素を後から変える、雰囲気や被写体の見え方を調整する、既存素材に編集をかけるという用途です。従来の動画生成AIが「新しい映像を作る」方向に寄っていたのに対し、Aleph 2.0は撮影済み素材や生成済み動画を修正する場面で価値が出ます。SNS広告、商品紹介、短尺動画、社内プレゼン素材では、最初から撮り直すより速い可能性があります。",
            ),
            (
                "試す前に比較すべき相手",
                "比較対象はRunwayだけではありません。短尺SNSならCapCut系のAI編集、プロ案件ならAdobe Premiere ProやAfter EffectsのAI機能、画像や短い素材中心ならCanvaや他の生成AI動画ツールも候補になります。Runwayを選ぶ理由は、単に新しいからではなく、既存動画の修正、生成映像との連携、チームでの制作、出力品質が自分の案件に合うかどうかです。",
            ),
            (
                "料金とクレジットで見るポイント",
                "AI動画ツールは月額だけで判断すると失敗します。確認すべきなのは、動画生成や編集でどれだけクレジットを使うか、失敗出力にもコストがかかるか、商用利用できるプランか、チーム共有が必要か、納品解像度や書き出し制限があるかです。特にクライアントワークでは、試行錯誤の回数がそのままコストになります。",
            ),
            (
                "向いている人と向いていない人",
                "向いているのは、短尺動画を頻繁に作るマーケター、撮影素材を再利用したい制作者、AI動画の修正に時間を取られているチームです。逆に、長尺編集、厳密な字幕管理、音声整音、複雑なタイムライン編集が中心なら、Runwayだけで完結させるより既存編集ソフトと組み合わせる方が現実的です。",
            ),
            (
                "導入前チェックリスト",
                "試す前に、使う素材の権利、商用利用条件、必要な解像度、クレジット上限、修正回数、チーム共有、納品先の品質基準を決めてください。1本だけのデモで判断せず、同じ素材でRunway、CapCut、Adobe系ツールを比べると、自分のワークフローに合うかが見えます。",
            ),
            (
                "確認した資料",
                "トレンド元はGoogle Trends RSS JPの上昇検索です。内容確認にはLedge.aiのRunway Aleph 2.0記事、Runway公式ページ、Runway HelpのEdit Studio説明、TECH NOISYのRunway MCP記事を使いました。ニュース見出しだけで断定せず、公式情報と制作ワークフロー目線の比較に分けて整理しています。",
            ),
        ],
        "kr_gaming_monitor": [
            (
                "빠른 결론",
                "2026년에 게이밍 모니터를 새로 산다면 먼저 QHD 해상도와 144~180Hz급 주사율을 기준으로 잡는 편이 가장 무난합니다. FPS를 오래 한다면 24~27형, QHD 이상 RPG나 콘솔 게임을 많이 한다면 27~32형이 편합니다. OLED는 화면 반응과 명암이 뛰어나지만 가격, 번인 보증, 밝은 방 사용성을 꼭 같이 확인해야 합니다.",
            ),
            (
                "왜 지금 다시 보는가",
                "한국 Google Trends RSS에서 2026년 6월 1일 기준으로 '게임' 관심 흐름이 잡혔고, 실제 구매 의도는 모니터, 키보드, 헤드셋 같은 주변기기 비교로 이어질 가능성이 큽니다. 그중 모니터는 가격대가 넓고 사양 표기가 복잡해서 독자가 구매 전 정리된 기준을 가장 필요로 하는 품목입니다.",
            ),
            (
                "먼저 정할 사양",
                "해상도는 FHD, QHD, 4K 중에서 정하고, 주사율은 최소 144Hz 이상을 봅니다. 그래픽카드가 중급이면 QHD 144~180Hz가 균형이 좋고, 고사양 PC나 콘솔을 쓴다면 4K 120Hz 이상도 후보가 됩니다. 패널은 IPS가 색감과 범용성이 좋고, VA는 명암비가 강하며, OLED는 반응속도와 암부 표현이 좋지만 가격과 보증 조건을 더 봐야 합니다.",
            ),
            (
                "게임 장르별 선택법",
                "발로란트, 오버워치, 배틀그라운드처럼 빠른 움직임이 많은 게임은 24~27형, 144Hz 이상, 낮은 응답 지연을 우선합니다. 로스트아크, 콘솔 RPG, 오픈월드 게임을 많이 한다면 27~32형 QHD 또는 4K가 더 만족스럽습니다. 영상 편집과 게임을 같이 한다면 색역, 밝기, 스탠드 조절, USB-C 입력까지 함께 보면 좋습니다.",
            ),
            (
                "실구매 전 체크리스트",
                "상세페이지의 1ms 표기만 보지 말고 실제 리뷰에서 잔상, 오버슈트, 입력 지연을 확인하세요. 또한 HDMI 2.1 여부, DP 버전, VRR 또는 G-Sync/FreeSync 호환, 스탠드 높낮이 조절, 무상보증 기간, 패널 교환 정책, 불량화소 기준을 함께 봐야 합니다. 같은 모델명처럼 보여도 세부 코드와 출시 연식이 다를 수 있습니다.",
            ),
            (
                "가격대별 현실적인 기준",
                "20만 원대는 FHD 144~180Hz나 입문형 QHD를 보는 구간입니다. 30~50만 원대는 27형 QHD 고주사율 제품이 많아 가장 대중적인 선택지가 됩니다. 70만 원 이상부터는 4K 고주사율, 미니 LED, OLED 같은 프리미엄 기능을 비교하게 되며, 이때는 성능보다 AS와 장기 사용 리스크까지 함께 따지는 편이 안전합니다.",
            ),
            (
                "확인한 자료",
                "이번 글은 오늘 확인한 한국 관심 흐름과 국내 구매 가이드형 페이지들의 공통 구성을 바탕으로 만들었습니다. 제품 순위 자체를 단정하지 않고, 해상도, 주사율, 패널, 단자, 보증, 가격대처럼 어떤 모델에도 적용되는 구매 기준을 먼저 정리했습니다.",
            ),
        ],
        "kr_kbo_all_star_vote": [
            (
                "빠른 결론",
                "2026 KBO 올스타전 팬투표는 6월 1일 후보 공개와 함께 본격적으로 관심이 오른 주제입니다. 독자가 먼저 확인할 것은 세 가지입니다. 투표가 언제 시작되는지, 베스트12 후보가 어떤 기준으로 나뉘는지, 그리고 내가 응원하는 선수가 후보 명단에 실제로 포함됐는지입니다. 올해는 잠실구장 마지막 올스타전이라는 상징성까지 있어 팬 관심이 더 크게 붙었습니다.",
            ),
            (
                "왜 지금 검색이 늘었나",
                "한국 Google Trends RSS에서 2026년 6월 1일 기준으로 'kbo 올스타 투표'와 'kbo'가 함께 잡혔습니다. 관련 기사들은 KBO가 베스트12 팬투표 후보 120명을 발표했다는 점, 신한은행 SOL뱅크 앱을 통한 팬투표가 시작된다는 점, 그리고 잠실구장 마지막 올스타전이라는 맥락을 함께 다루고 있습니다. 단순 경기 결과가 아니라 팬 참여 일정과 후보 명단 확인 수요가 동시에 생긴 흐름입니다.",
            ),
            (
                "팬이 먼저 확인할 일정",
                "가장 먼저 볼 것은 투표 시작일과 마감일입니다. 기사 기준으로 팬투표는 6월 1일부터 시작되는 흐름으로 보도됐고, 최종 베스트12는 투표 결과와 선수단 투표 등을 거쳐 정해지는 구조입니다. 정확한 기간과 방식은 KBO 공식 안내와 투표가 열리는 앱 화면을 다시 확인하는 것이 안전합니다. 기사 제목만 보고 바로 투표했다고 판단하면 일정이나 방식이 바뀐 세부 조건을 놓칠 수 있습니다.",
            ),
            (
                "후보 명단을 볼 때 헷갈리는 점",
                "올스타 후보는 포지션과 구단, 리그 구분에 따라 나뉩니다. 팬 입장에서는 '왜 이 선수가 없지?'라고 느낄 수 있지만, 후보 선정 기준이나 포지션 배정, 팀별 후보 구성에 따라 명단이 달라질 수 있습니다. 특히 류현진처럼 화제성이 큰 선수가 후보에 없다는 식의 기사도 함께 나오기 때문에, 특정 선수의 누락 여부는 공식 후보표와 기사 맥락을 같이 봐야 합니다.",
            ),
            (
                "투표 전에 체크할 것",
                "투표 전에는 내가 사용하는 앱이나 계정으로 실제 참여가 가능한지, 1일 투표 횟수 제한이 있는지, 포지션별로 몇 명을 선택해야 하는지, 중복 투표나 변경이 가능한지 확인해야 합니다. 팬투표는 응원팀 선수만 고르는 이벤트처럼 보이지만, 실제 결과는 구단별 팬덤 규모와 포지션 경쟁 구도에 따라 크게 달라질 수 있습니다.",
            ),
            (
                "올스타전 관람을 생각한다면",
                "올스타전 자체에 관심이 있다면 투표만 볼 것이 아니라 장소, 티켓 오픈, 예매 일정, 좌석, 교통도 따로 확인해야 합니다. 올해는 잠실구장 마지막 올스타전이라는 보도가 붙어 있어 티켓 관심이 평소보다 커질 수 있습니다. 투표 결과 발표와 티켓 예매는 다른 일정일 수 있으니, KBO와 예매처 공지를 따로 보는 편이 안전합니다.",
            ),
            (
                "확인한 자료",
                "이번 글은 2026년 6월 1일 한국 Google Trends RSS에서 확인한 상승 검색어와, 연합뉴스·디지털투데이·조선일보 등 관련 보도에서 공통으로 반복된 정보를 기준으로 정리했습니다. 기사 문장을 따라 쓰지 않고, 팬이 실제로 확인해야 할 일정, 후보 명단, 투표 방식, 관람 준비 항목으로 다시 구성했습니다.",
            ),
        ],
    }
    return [{"heading": heading, "body": body} for heading, body in sections.get(topic, [])]
