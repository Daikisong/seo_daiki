export function reviewHomeCopy(language: string) {
  if (language === "ko") {
    return {
      featured: "대표 리뷰",
      guide: "가이드",
      listEyebrow: "상품 목록",
      listTitle: "상품 리뷰 목록",
      sidebar: "리뷰 바로가기",
      quickNav: "바로가기",
      rankings: "랭킹 보기",
      tips: "읽는 법"
    };
  }
  if (language === "ja") {
    return {
      featured: "注目レビュー",
      guide: "ガイド",
      listEyebrow: "商品リスト",
      listTitle: "商品レビュー一覧",
      sidebar: "レビューのショートカット",
      quickNav: "ショートカット",
      rankings: "ランキングを見る",
      tips: "読み方"
    };
  }
  if (language === "es") {
    return {
      featured: "Reseña destacada",
      guide: "Guía",
      listEyebrow: "Productos",
      listTitle: "Reseñas de producto",
      sidebar: "Accesos de reseñas",
      quickNav: "Accesos rápidos",
      rankings: "Ver ranking",
      tips: "Cómo leer"
    };
  }
  if (language === "pt-br" || language === "pt") {
    return {
      featured: "Review em destaque",
      guide: "Guia",
      listEyebrow: "Produtos",
      listTitle: "Reviews de produto",
      sidebar: "Atalhos de reviews",
      quickNav: "Atalhos",
      rankings: "Ver ranking",
      tips: "Como ler"
    };
  }
  if (language === "fr") {
    return {
      featured: "Avis à la une",
      guide: "Guide",
      listEyebrow: "Produits",
      listTitle: "Avis produits",
      sidebar: "Accès aux avis",
      quickNav: "Raccourcis",
      rankings: "Voir le classement",
      tips: "Comment lire"
    };
  }
  if (language === "de") {
    return {
      featured: "Top-Bewertung",
      guide: "Ratgeber",
      listEyebrow: "Produkte",
      listTitle: "Produktbewertungen",
      sidebar: "Bewertungslinks",
      quickNav: "Schnellzugriff",
      rankings: "Rangliste ansehen",
      tips: "So liest du"
    };
  }
  if (language === "it") {
    return {
      featured: "Recensione in evidenza",
      guide: "Guida",
      listEyebrow: "Prodotti",
      listTitle: "Recensioni prodotto",
      sidebar: "Scorciatoie recensioni",
      quickNav: "Scorciatoie",
      rankings: "Vedi classifica",
      tips: "Come leggere"
    };
  }
  if (language === "nl") {
    return {
      featured: "Uitgelichte review",
      guide: "Gids",
      listEyebrow: "Producten",
      listTitle: "Productreviews",
      sidebar: "Reviewlinks",
      quickNav: "Snelkoppelingen",
      rankings: "Bekijk ranking",
      tips: "Zo lees je"
    };
  }
  if (language === "pl") {
    return {
      featured: "Wyróżniona recenzja",
      guide: "Poradnik",
      listEyebrow: "Produkty",
      listTitle: "Recenzje produktów",
      sidebar: "Skróty recenzji",
      quickNav: "Skróty",
      rankings: "Zobacz ranking",
      tips: "Jak czytać"
    };
  }
  if (language === "tr") {
    return {
      featured: "Öne çıkan inceleme",
      guide: "Rehber",
      listEyebrow: "Ürünler",
      listTitle: "Ürün incelemeleri",
      sidebar: "İnceleme kısayolları",
      quickNav: "Kısayollar",
      rankings: "Sıralamayı gör",
      tips: "Nasıl okunur"
    };
  }
  if (language === "id") {
    return {
      featured: "Ulasan unggulan",
      guide: "Panduan",
      listEyebrow: "Produk",
      listTitle: "Ulasan produk",
      sidebar: "Pintasan ulasan",
      quickNav: "Pintasan",
      rankings: "Lihat peringkat",
      tips: "Cara membaca"
    };
  }
  return {
    featured: "Featured review",
    guide: "Guide",
    listEyebrow: "Products",
    listTitle: "Product reviews",
    sidebar: "Review shortcuts",
    quickNav: "Shortcuts",
    rankings: "View rankings",
    tips: "How to read"
  };
}
