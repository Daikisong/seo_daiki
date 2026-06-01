import type { MarketTopbarSection } from "@/lib/market/market-sections";

export function sectionCopy(language: string, section: MarketTopbarSection) {
  const ko: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "상품 검토", title: "상품 리뷰", description: "" },
    rankings: { kicker: "인기순", title: "랭킹", description: "" },
    news: { kicker: "뉴스", title: "뉴스", description: "" },
    tips: { kicker: "사용법", title: "팁 & 노하우", description: "" },
    community: { kicker: "참여", title: "커뮤니티", description: "" },
    search: { kicker: "찾기", title: "검색", description: "" },
    subscribe: { kicker: "알림", title: "구독하기", description: "새 아이템 요약과 비교 후보를 이메일로 받을 준비를 합니다." }
  };
  if (language === "ko") return ko[section];
  const ja: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "商品チェック", title: "商品レビュー", description: "" },
    rankings: { kicker: "人気順", title: "ランキング", description: "" },
    news: { kicker: "ニュース", title: "ニュース", description: "" },
    tips: { kicker: "使い方", title: "ヒント", description: "" },
    community: { kicker: "参加", title: "コミュニティ", description: "" },
    search: { kicker: "探す", title: "検索", description: "" },
    subscribe: { kicker: "通知", title: "購読", description: "新しいアイテム要約と比較候補をメールで受け取る準備をします。" }
  };
  if (language === "ja") return ja[section];
  const es: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Productos", title: "Reseñas de producto", description: "" },
    rankings: { kicker: "Más vistos", title: "Ranking", description: "" },
    news: { kicker: "Noticias", title: "Noticias", description: "" },
    tips: { kicker: "Cómo usarlo", title: "Consejos", description: "" },
    community: { kicker: "Solicitudes", title: "Comunidad", description: "" },
    search: { kicker: "Buscar", title: "Buscar", description: "" },
    subscribe: { kicker: "Alertas", title: "Suscribirse", description: "Prepárate para recibir resúmenes de nuevos artículos por email." }
  };
  if (language === "es") return es[section];
  const pt: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Produtos", title: "Reviews de produto", description: "" },
    rankings: { kicker: "Mais vistos", title: "Ranking", description: "" },
    news: { kicker: "Notícias", title: "Notícias", description: "" },
    tips: { kicker: "Como usar", title: "Dicas", description: "" },
    community: { kicker: "Pedidos", title: "Comunidade", description: "" },
    search: { kicker: "Buscar", title: "Buscar", description: "" },
    subscribe: { kicker: "Alertas", title: "Assinar", description: "Prepare-se para receber resumos de novos itens por email." }
  };
  if (language === "pt-br" || language === "pt") return pt[section];
  const fr: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Produits", title: "Avis produits", description: "" },
    rankings: { kicker: "Classement", title: "Classements", description: "" },
    news: { kicker: "Actualités", title: "Actualités", description: "" },
    tips: { kicker: "Conseils", title: "Conseils", description: "" },
    community: { kicker: "Participation", title: "Communauté", description: "" },
    search: { kicker: "Rechercher", title: "Recherche", description: "" },
    subscribe: { kicker: "Alertes", title: "S'abonner", description: "Recevez les nouveaux sujets et comparaisons quand ils sont prêts." }
  };
  if (language === "fr") return fr[section];
  const de: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Produkte", title: "Produktbewertungen", description: "" },
    rankings: { kicker: "Rangliste", title: "Ranglisten", description: "" },
    news: { kicker: "Neuigkeiten", title: "Neuigkeiten", description: "" },
    tips: { kicker: "Tipps", title: "Tipps", description: "" },
    community: { kicker: "Mitmachen", title: "Gemeinschaft", description: "" },
    search: { kicker: "Suchen", title: "Suche", description: "" },
    subscribe: { kicker: "Benachrichtigungen", title: "Abonnieren", description: "Erhalte neue Themen, Vergleiche und Kaufchecks per E-Mail." }
  };
  if (language === "de") return de[section];
  const it: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Prodotti", title: "Recensioni prodotto", description: "" },
    rankings: { kicker: "Classifica", title: "Classifiche", description: "" },
    news: { kicker: "Notizie", title: "Notizie", description: "" },
    tips: { kicker: "Consigli", title: "Consigli", description: "" },
    community: { kicker: "Partecipazione", title: "Comunità", description: "" },
    search: { kicker: "Cerca", title: "Cerca", description: "" },
    subscribe: { kicker: "Avvisi", title: "Abbonati", description: "Ricevi nuovi temi, confronti e controlli prima dell'acquisto via email." }
  };
  if (language === "it") return it[section];
  const nl: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Producten", title: "Productreviews", description: "" },
    rankings: { kicker: "Ranglijst", title: "Ranglijsten", description: "" },
    news: { kicker: "Nieuws", title: "Nieuws", description: "" },
    tips: { kicker: "Tips", title: "Tips", description: "" },
    community: { kicker: "Meedoen", title: "Gemeenschap", description: "" },
    search: { kicker: "Zoeken", title: "Zoeken", description: "" },
    subscribe: { kicker: "Meldingen", title: "Abonneren", description: "Ontvang nieuwe onderwerpen, vergelijkingen en koopchecks per e-mail." }
  };
  if (language === "nl") return nl[section];
  const pl: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Produkty", title: "Recenzje produktów", description: "" },
    rankings: { kicker: "Ranking", title: "Rankingi", description: "" },
    news: { kicker: "Aktualności", title: "Aktualności", description: "" },
    tips: { kicker: "Porady", title: "Porady", description: "" },
    community: { kicker: "Udział", title: "Społeczność", description: "" },
    search: { kicker: "Szukaj", title: "Szukaj", description: "" },
    subscribe: { kicker: "Powiadomienia", title: "Subskrybuj", description: "Otrzymuj nowe tematy, porównania i checklisty zakupowe e-mailem." }
  };
  if (language === "pl") return pl[section];
  const tr: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Ürünler", title: "Ürün incelemeleri", description: "" },
    rankings: { kicker: "Sıralama", title: "Sıralamalar", description: "" },
    news: { kicker: "Haberler", title: "Haberler", description: "" },
    tips: { kicker: "İpuçları", title: "İpuçları", description: "" },
    community: { kicker: "Katılım", title: "Topluluk", description: "" },
    search: { kicker: "Ara", title: "Ara", description: "" },
    subscribe: { kicker: "Bildirimler", title: "Abone ol", description: "Yeni konuları, karşılaştırmaları ve satın alma kontrollerini e-posta ile al." }
  };
  if (language === "tr") return tr[section];
  const id: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Produk", title: "Ulasan produk", description: "" },
    rankings: { kicker: "Peringkat", title: "Peringkat", description: "" },
    news: { kicker: "Berita", title: "Berita", description: "" },
    tips: { kicker: "Tips", title: "Tips", description: "" },
    community: { kicker: "Partisipasi", title: "Komunitas", description: "" },
    search: { kicker: "Cari", title: "Cari", description: "" },
    subscribe: { kicker: "Notifikasi", title: "Berlangganan", description: "Dapatkan topik baru, perbandingan, dan cek sebelum membeli lewat email." }
  };
  if (language === "id") return id[section];
  const en: Record<MarketTopbarSection, { kicker: string; title: string; description: string }> = {
    reviews: { kicker: "Product checks", title: "Product reviews", description: "" },
    rankings: { kicker: "Most watched", title: "Rankings", description: "" },
    news: { kicker: "News", title: "News", description: "" },
    tips: { kicker: "How to use", title: "Tips", description: "" },
    community: { kicker: "Requests", title: "Community", description: "" },
    search: { kicker: "Find", title: "Search", description: "" },
    subscribe: { kicker: "Alerts", title: "Subscribe", description: "Get ready to receive new item summaries by email." }
  };
  return en[section];
}

export function emptyCopy(language: string) {
  if (language === "ko") return "아직 이 시장에 공개할 상품 리뷰가 없습니다.";
  if (language === "ja") return "この市場で公開できる商品レビューはまだありません。";
  if (language === "es") return "Aún no hay reseñas de producto listas para este mercado.";
  if (language === "pt-br" || language === "pt") return "Ainda não há reviews de produto prontos para este mercado.";
  if (language === "fr") return "Aucun avis produit n'est encore prêt pour ce marché.";
  if (language === "de") return "Für diesen Markt sind noch keine Produktreviews bereit.";
  if (language === "it") return "Non ci sono ancora recensioni prodotto pronte per questo mercato.";
  if (language === "nl") return "Er zijn nog geen productreviews klaar voor deze markt.";
  if (language === "pl") return "Nie ma jeszcze gotowych recenzji produktów dla tego rynku.";
  if (language === "tr") return "Bu pazar için hazır ürün incelemesi yok.";
  if (language === "id") return "Belum ada review produk yang siap untuk pasar ini.";
  return "No product reviews are ready for this market yet.";
}
