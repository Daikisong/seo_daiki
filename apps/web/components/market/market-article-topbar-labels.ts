export interface MarketArticleTopbarLabels {
  brand: string;
  tagline: string;
  navigation: string;
  reviews: string;
  rankings: string;
  news: string;
  tips: string;
  community: string;
  search: string;
  subscribe: string;
  marketSwitch: string;
}

export function topbarLabels(language: string): MarketArticleTopbarLabels {
  if (language === "ko") {
    return {
      brand: "리뷰 가이드",
      tagline: "객관적 테스트 & 현명한 소비",
      navigation: "주요 메뉴",
      reviews: "상품 리뷰",
      rankings: "랭킹",
      news: "뉴스",
      tips: "팁 & 노하우",
      community: "커뮤니티",
      search: "검색",
      subscribe: "구독하기",
      marketSwitch: "국가/언어"
    };
  }
  if (language === "ja") {
    return {
      brand: "レビューガイド",
      tagline: "客観的テスト & 賢い消費",
      navigation: "メインメニュー",
      reviews: "商品レビュー",
      rankings: "ランキング",
      news: "ニュース",
      tips: "ヒント",
      community: "コミュニティ",
      search: "検索",
      subscribe: "購読",
      marketSwitch: "国・言語"
    };
  }
  if (language === "es") {
    return {
      brand: "Guía de reseñas",
      tagline: "Pruebas objetivas & consumo inteligente",
      navigation: "Navegación principal",
      reviews: "Reseñas de producto",
      rankings: "Ranking",
      news: "Noticias",
      tips: "Consejos",
      community: "Comunidad",
      search: "Buscar",
      subscribe: "Suscribirse",
      marketSwitch: "País/idioma"
    };
  }
  if (language === "pt-br" || language === "pt") {
    return {
      brand: "Guia de reviews",
      tagline: "Testes objetivos & consumo inteligente",
      navigation: "Navegação principal",
      reviews: "Reviews de produto",
      rankings: "Ranking",
      news: "Notícias",
      tips: "Dicas",
      community: "Comunidade",
      search: "Buscar",
      subscribe: "Assinar",
      marketSwitch: "País/idioma"
    };
  }
  if (language === "fr") {
    return {
      brand: "Guide d'avis",
      tagline: "Tests objectifs & choix plus avisés",
      navigation: "Navigation principale",
      reviews: "Avis produits",
      rankings: "Classements",
      news: "Actualités",
      tips: "Conseils",
      community: "Communauté",
      search: "Recherche",
      subscribe: "S'abonner",
      marketSwitch: "Pays/langue"
    };
  }
  if (language === "de") {
    return {
      brand: "Bewertungsratgeber",
      tagline: "Objektive Tests & klüger kaufen",
      navigation: "Hauptnavigation",
      reviews: "Produktbewertungen",
      rankings: "Ranglisten",
      news: "Neuigkeiten",
      tips: "Tipps",
      community: "Gemeinschaft",
      search: "Suche",
      subscribe: "Abonnieren",
      marketSwitch: "Land/Sprache"
    };
  }
  if (language === "it") {
    return {
      brand: "Guida recensioni",
      tagline: "Test oggettivi & acquisti migliori",
      navigation: "Navigazione principale",
      reviews: "Recensioni prodotto",
      rankings: "Classifiche",
      news: "Notizie",
      tips: "Consigli",
      community: "Comunità",
      search: "Cerca",
      subscribe: "Abbonati",
      marketSwitch: "Paese/lingua"
    };
  }
  if (language === "nl") {
    return {
      brand: "Reviewgids",
      tagline: "Objectieve tests & slimmer kopen",
      navigation: "Hoofdnavigatie",
      reviews: "Productreviews",
      rankings: "Ranglijsten",
      news: "Nieuws",
      tips: "Tips",
      community: "Gemeenschap",
      search: "Zoeken",
      subscribe: "Abonneren",
      marketSwitch: "Land/taal"
    };
  }
  if (language === "pl") {
    return {
      brand: "Przewodnik recenzji",
      tagline: "Obiektywne testy & mądre zakupy",
      navigation: "Nawigacja główna",
      reviews: "Recenzje produktów",
      rankings: "Rankingi",
      news: "Aktualności",
      tips: "Porady",
      community: "Społeczność",
      search: "Szukaj",
      subscribe: "Subskrybuj",
      marketSwitch: "Kraj/język"
    };
  }
  if (language === "tr") {
    return {
      brand: "İnceleme Rehberi",
      tagline: "Nesnel testler & akıllı tüketim",
      navigation: "Ana gezinme",
      reviews: "Ürün incelemeleri",
      rankings: "Sıralamalar",
      news: "Haberler",
      tips: "İpuçları",
      community: "Topluluk",
      search: "Ara",
      subscribe: "Abone ol",
      marketSwitch: "Ülke/dil"
    };
  }
  if (language === "id") {
    return {
      brand: "Panduan Ulasan",
      tagline: "Tes objektif & belanja lebih cerdas",
      navigation: "Navigasi utama",
      reviews: "Ulasan produk",
      rankings: "Peringkat",
      news: "Berita",
      tips: "Tips",
      community: "Komunitas",
      search: "Cari",
      subscribe: "Berlangganan",
      marketSwitch: "Negara/bahasa"
    };
  }
  return {
    brand: "Review Guide",
    tagline: "Objective tests & smarter buying",
    navigation: "Main navigation",
    reviews: "Product reviews",
    rankings: "Rankings",
    news: "News",
    tips: "Tips",
    community: "Community",
    search: "Search",
    subscribe: "Subscribe",
    marketSwitch: "Market/language"
  };
}
