export function newsListCopy(language: string) {
  if (language === "ko") {
    return {
      newsArticle: "뉴스",
      feedEyebrow: "뉴스 목록",
      feedTitle: "최근 트렌드 뉴스",
      readAction: "읽기",
      articleCount: (count: number) => `${count}개 글`,
      sourceCount: (count: number) => `출처 ${count}개`
    };
  }
  if (language === "ja") {
    return {
      newsArticle: "ニュース",
      feedEyebrow: "ニュース一覧",
      feedTitle: "最新トレンドニュース",
      readAction: "読む",
      articleCount: (count: number) => `${count}件の記事`,
      sourceCount: (count: number) => `出典 ${count}件`
    };
  }
  if (language === "es") {
    return {
      newsArticle: "Noticias",
      feedEyebrow: "Lista de noticias",
      feedTitle: "Noticias recientes de tendencia",
      readAction: "Leer",
      articleCount: (count: number) => `${count} artículos`,
      sourceCount: (count: number) => `${count} fuentes`
    };
  }
  if (language === "pt-br" || language === "pt") {
    return {
      newsArticle: "Notícias",
      feedEyebrow: "Lista de notícias",
      feedTitle: "Notícias recentes de tendência",
      readAction: "Ler",
      articleCount: (count: number) => `${count} artigos`,
      sourceCount: (count: number) => `${count} fontes`
    };
  }
  if (language === "fr") {
    return {
      newsArticle: "Actualités",
      feedEyebrow: "Liste des actualités",
      feedTitle: "Actualités tendance récentes",
      readAction: "Lire",
      articleCount: (count: number) => `${count} articles`,
      sourceCount: (count: number) => `${count} sources`
    };
  }
  if (language === "de") {
    return {
      newsArticle: "Neuigkeiten",
      feedEyebrow: "Liste der Neuigkeiten",
      feedTitle: "Aktuelle Trendmeldungen",
      readAction: "Lesen",
      articleCount: (count: number) => `${count} Artikel`,
      sourceCount: (count: number) => `${count} Quellen`
    };
  }
  if (language === "it") {
    return {
      newsArticle: "Notizie",
      feedEyebrow: "Elenco notizie",
      feedTitle: "Notizie di tendenza recenti",
      readAction: "Leggi",
      articleCount: (count: number) => `${count} articoli`,
      sourceCount: (count: number) => `${count} fonti`
    };
  }
  if (language === "nl") {
    return {
      newsArticle: "Nieuws",
      feedEyebrow: "Nieuwslijst",
      feedTitle: "Recente trendnieuws",
      readAction: "Lezen",
      articleCount: (count: number) => `${count} artikelen`,
      sourceCount: (count: number) => `${count} bronnen`
    };
  }
  if (language === "pl") {
    return {
      newsArticle: "Aktualności",
      feedEyebrow: "Lista aktualności",
      feedTitle: "Najnowsze trendy",
      readAction: "Czytaj",
      articleCount: (count: number) => `${count} artykułów`,
      sourceCount: (count: number) => `${count} źródeł`
    };
  }
  if (language === "tr") {
    return {
      newsArticle: "Haberler",
      feedEyebrow: "Haber listesi",
      feedTitle: "Son trend haberleri",
      readAction: "Oku",
      articleCount: (count: number) => `${count} yazı`,
      sourceCount: (count: number) => `${count} kaynak`
    };
  }
  if (language === "id") {
    return {
      newsArticle: "Berita",
      feedEyebrow: "Daftar berita",
      feedTitle: "Berita tren terbaru",
      readAction: "Baca",
      articleCount: (count: number) => `${count} artikel`,
      sourceCount: (count: number) => `${count} sumber`
    };
  }
  return {
    newsArticle: "News",
    feedEyebrow: "News list",
    feedTitle: "Recent trend news",
    readAction: "Read",
    articleCount: (count: number) => `${count} articles`,
    sourceCount: (count: number) => `${count} sources`
  };
}

export function newsEmptyCopy(language: string) {
  if (language === "ko") return "아직 보여줄 뉴스 글이 없습니다.";
  if (language === "ja") return "表示できるニュース記事はまだありません。";
  if (language === "es") return "Aún no hay noticias listas.";
  if (language === "pt-br" || language === "pt") return "Ainda não há notícias prontas.";
  if (language === "fr") return "Aucune actualité n'est encore prête.";
  if (language === "de") return "Es sind noch keine News bereit.";
  if (language === "it") return "Non ci sono ancora news pronte.";
  if (language === "nl") return "Er is nog geen nieuws klaar.";
  if (language === "pl") return "Nie ma jeszcze gotowych aktualności.";
  if (language === "tr") return "Henüz hazır haber yok.";
  if (language === "id") return "Belum ada berita yang siap.";
  return "No news articles are ready yet.";
}
