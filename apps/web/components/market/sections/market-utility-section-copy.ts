export function tipsCopy(language: string) {
  if (language === "ko") {
    return [
      { title: "결론부터 읽기", body: "상단의 빠른 결론과 기준표를 먼저 보면 내 상황에 맞는지 빨리 판단할 수 있습니다." },
      { title: "가격은 다시 확인", body: "글 안의 가격 신호는 바뀔 수 있으니 구매 직전 판매자와 보증 조건을 다시 확인해야 합니다." },
      { title: "체크리스트 활용", body: "스펙보다 놓치기 쉬운 AS, 단자, 크기, 호환성을 체크리스트로 확인합니다." }
    ];
  }
  if (language === "ja") {
    return [
      { title: "結論から読む", body: "上部の結論と基準表を見ると、自分に合うかを早く判断できます。" },
      { title: "価格は再確認", body: "記事内の価格情報は変わるため、購入直前に販売条件と保証を確認します。" },
      { title: "チェックリストを使う", body: "スペックだけでなく、保証、端子、サイズ、互換性も確認します。" }
    ];
  }
  if (language === "es") {
    return [
      { title: "Lee primero el veredicto", body: "Usa la respuesta rápida y la tabla antes de leer todo el artículo." },
      { title: "Revisa el precio", body: "El precio y la disponibilidad pueden cambiar antes de comprar." },
      { title: "Usa la checklist", body: "Comprueba garantía, compatibilidad y tamaño antes de abrir enlaces de producto." }
    ];
  }
  if (language === "pt-br" || language === "pt") {
    return [
      { title: "Leia a conclusão primeiro", body: "Use a resposta rápida e a tabela antes de ler todas as seções." },
      { title: "Confira o preço de novo", body: "Preço e disponibilidade podem mudar antes da compra." },
      { title: "Use a checklist", body: "Verifique garantia, compatibilidade e tamanho antes de links de produto." }
    ];
  }
  if (language === "fr") {
    return [
      { title: "Lisez d'abord le verdict", body: "Commencez par la réponse rapide et le tableau avant de lire toutes les sections." },
      { title: "Revérifiez le prix", body: "Le prix et la disponibilité peuvent changer avant l'achat." },
      { title: "Utilisez la checklist", body: "Vérifiez la garantie, la compatibilité et le format avant les liens produit." }
    ];
  }
  if (language === "de") {
    return [
      { title: "Erst das Fazit lesen", body: "Nutze die Kurzantwort und die Tabelle, bevor du alle Abschnitte liest." },
      { title: "Preis erneut prüfen", body: "Preis und Verfügbarkeit können sich vor dem Kauf ändern." },
      { title: "Checkliste nutzen", body: "Prüfe Garantie, Kompatibilität und Maße vor Produktlinks." }
    ];
  }
  if (language === "it") {
    return [
      { title: "Leggi prima il verdetto", body: "Usa la risposta rapida e la tabella prima di leggere tutte le sezioni." },
      { title: "Ricontrolla il prezzo", body: "Prezzo e disponibilità possono cambiare prima dell'acquisto." },
      { title: "Usa la checklist", body: "Controlla garanzia, compatibilità e dimensioni prima dei link prodotto." }
    ];
  }
  if (language === "nl") {
    return [
      { title: "Lees eerst het oordeel", body: "Gebruik het korte antwoord en de tabel voordat je alle secties leest." },
      { title: "Controleer de prijs opnieuw", body: "Prijs en beschikbaarheid kunnen voor aankoop veranderen." },
      { title: "Gebruik de checklist", body: "Controleer garantie, compatibiliteit en formaat vóór productlinks." }
    ];
  }
  if (language === "pl") {
    return [
      { title: "Najpierw przeczytaj werdykt", body: "Zacznij od krótkiej odpowiedzi i tabeli, zanim przejdziesz przez cały tekst." },
      { title: "Sprawdź cenę ponownie", body: "Cena i dostępność mogą zmienić się przed zakupem." },
      { title: "Użyj checklisty", body: "Przed linkami produktu sprawdź gwarancję, zgodność i rozmiar." }
    ];
  }
  if (language === "tr") {
    return [
      { title: "Önce kararı oku", body: "Tüm bölümleri okumadan önce kısa yanıtı ve tabloyu kullan." },
      { title: "Fiyatı tekrar kontrol et", body: "Fiyat ve stok durumu satın almadan önce değişebilir." },
      { title: "Kontrol listesini kullan", body: "Ürün linklerinden önce garanti, uyumluluk ve ölçüleri kontrol et." }
    ];
  }
  if (language === "id") {
    return [
      { title: "Baca kesimpulan dulu", body: "Gunakan jawaban cepat dan tabel sebelum membaca semua bagian." },
      { title: "Cek ulang harga", body: "Harga dan ketersediaan bisa berubah sebelum pembelian." },
      { title: "Gunakan checklist", body: "Periksa garansi, kompatibilitas, dan ukuran sebelum membuka tautan produk." }
    ];
  }
  return [
    { title: "Read the verdict first", body: "Use the quick answer and table before reading every section." },
    { title: "Re-check prices", body: "Prices and availability can change before purchase." },
    { title: "Use the checklist", body: "Check warranty, compatibility, and fit before product links." }
  ];
}

export function communityCopy(language: string) {
  if (language === "ko") {
    return {
      requestTitle: "리뷰 요청",
      requestBody: "궁금한 제품명이나 키워드를 검색해서 다음 비교 후보로 남깁니다.",
      requestAction: "검색하기",
      voteTitle: "이번 주 비교 후보",
      voteBody: "아직 후보가 없습니다.",
      voteAction: "리뷰 보기",
      alertTitle: "새 아이템 알림",
      alertBody: "새 트렌드가 글로 바뀌면 이메일로 받을 수 있게 준비합니다.",
      alertAction: "구독하기"
    };
  }
  if (language === "ja") {
    return {
      requestTitle: "レビュー依頼",
      requestBody: "気になる製品名やキーワードを検索して、次の比較候補にします。",
      requestAction: "検索する",
      voteTitle: "今週の比較候補",
      voteBody: "候補はまだありません。",
      voteAction: "レビューを見る",
      alertTitle: "新着アイテム通知",
      alertBody: "新しいトレンドが記事になったらメールで受け取れるよう準備します。",
      alertAction: "購読"
    };
  }
  if (language === "es") {
    return {
      requestTitle: "Solicitar reseña",
      requestBody: "Busca un producto o palabra clave para proponer la próxima comparación.",
      requestAction: "Buscar",
      voteTitle: "Candidato de la semana",
      voteBody: "Aún no hay candidatos.",
      voteAction: "Ver reseñas",
      alertTitle: "Alertas de nuevos temas",
      alertBody: "Prepara el aviso por email cuando una tendencia se convierta en artículo.",
      alertAction: "Suscribirse"
    };
  }
  if (language === "pt-br" || language === "pt") {
    return {
      requestTitle: "Pedir review",
      requestBody: "Busque um produto ou palavra-chave para sugerir a próxima comparação.",
      requestAction: "Buscar",
      voteTitle: "Candidato da semana",
      voteBody: "Ainda não há candidatos.",
      voteAction: "Ver reviews",
      alertTitle: "Alertas de novos temas",
      alertBody: "Prepare o aviso por email quando uma tendência virar artigo.",
      alertAction: "Assinar"
    };
  }
  if (language === "fr") {
    return {
      requestTitle: "Demander un avis",
      requestBody: "Recherchez un produit ou un mot-clé pour proposer la prochaine comparaison.",
      requestAction: "Rechercher",
      voteTitle: "Candidat de la semaine",
      voteBody: "Aucun candidat pour le moment.",
      voteAction: "Voir les avis",
      alertTitle: "Alertes nouveaux sujets",
      alertBody: "Recevez un e-mail quand une tendance devient un article.",
      alertAction: "S'abonner"
    };
  }
  if (language === "de") {
    return {
      requestTitle: "Review anfragen",
      requestBody: "Suche ein Produkt oder Keyword als Kandidat für den nächsten Vergleich.",
      requestAction: "Suchen",
      voteTitle: "Kandidat der Woche",
      voteBody: "Noch kein Kandidat.",
      voteAction: "Reviews ansehen",
      alertTitle: "Neue Themen",
      alertBody: "Erhalte eine E-Mail, wenn aus einem Trend ein Artikel wird.",
      alertAction: "Abonnieren"
    };
  }
  if (language === "it") {
    return {
      requestTitle: "Richiedi recensione",
      requestBody: "Cerca un prodotto o una parola chiave per proporre il prossimo confronto.",
      requestAction: "Cerca",
      voteTitle: "Candidato della settimana",
      voteBody: "Non ci sono ancora candidati.",
      voteAction: "Vedi recensioni",
      alertTitle: "Avvisi nuovi temi",
      alertBody: "Ricevi un'email quando una tendenza diventa articolo.",
      alertAction: "Abbonati"
    };
  }
  if (language === "nl") {
    return {
      requestTitle: "Review aanvragen",
      requestBody: "Zoek een product of trefwoord als kandidaat voor de volgende vergelijking.",
      requestAction: "Zoeken",
      voteTitle: "Kandidaat van de week",
      voteBody: "Nog geen kandidaat.",
      voteAction: "Reviews bekijken",
      alertTitle: "Nieuwe onderwerpalerts",
      alertBody: "Ontvang een e-mail wanneer een trend een artikel wordt.",
      alertAction: "Abonneren"
    };
  }
  if (language === "pl") {
    return {
      requestTitle: "Poproś o recenzję",
      requestBody: "Wyszukaj produkt lub słowo kluczowe jako kandydat do kolejnego porównania.",
      requestAction: "Szukaj",
      voteTitle: "Kandydat tygodnia",
      voteBody: "Nie ma jeszcze kandydatów.",
      voteAction: "Zobacz recenzje",
      alertTitle: "Alerty nowych tematów",
      alertBody: "Otrzymaj e-mail, gdy trend zmieni się w artykuł.",
      alertAction: "Subskrybuj"
    };
  }
  if (language === "tr") {
    return {
      requestTitle: "İnceleme iste",
      requestBody: "Bir ürün veya anahtar kelime arayarak sonraki karşılaştırma adayını öner.",
      requestAction: "Ara",
      voteTitle: "Haftanın adayı",
      voteBody: "Henüz aday yok.",
      voteAction: "İncelemeleri gör",
      alertTitle: "Yeni konu bildirimleri",
      alertBody: "Bir trend yazıya dönüştüğünde e-posta bildirimi al.",
      alertAction: "Abone ol"
    };
  }
  if (language === "id") {
    return {
      requestTitle: "Minta review",
      requestBody: "Cari produk atau kata kunci untuk kandidat perbandingan berikutnya.",
      requestAction: "Cari",
      voteTitle: "Kandidat minggu ini",
      voteBody: "Belum ada kandidat.",
      voteAction: "Lihat review",
      alertTitle: "Notifikasi topik baru",
      alertBody: "Dapatkan email saat tren berubah menjadi artikel.",
      alertAction: "Berlangganan"
    };
  }
  return {
    requestTitle: "Review requests",
    requestBody: "Search a product or keyword and use it as the next comparison candidate.",
    requestAction: "Search",
    voteTitle: "This week's candidate",
    voteBody: "No candidate yet.",
    voteAction: "View reviews",
    alertTitle: "New item alerts",
    alertBody: "Prepare to receive new trend summaries by email.",
    alertAction: "Subscribe"
  };
}

export function searchCopy(language: string) {
  if (language === "ko") return { label: "검색어", placeholder: "예: 게이밍 모니터", button: "검색", empty: "검색 결과가 없습니다." };
  if (language === "ja") return { label: "検索語", placeholder: "例: AI動画編集", button: "検索", empty: "検索結果がありません。" };
  if (language === "es") return { label: "Buscar", placeholder: "Ejemplo: monitor gaming", button: "Buscar", empty: "No hay resultados." };
  if (language === "pt-br" || language === "pt") return { label: "Busca", placeholder: "Exemplo: monitor gamer", button: "Buscar", empty: "Nenhum resultado encontrado." };
  if (language === "fr") return { label: "Recherche", placeholder: "Ex. moniteur gaming", button: "Rechercher", empty: "Aucun résultat." };
  if (language === "de") return { label: "Suche", placeholder: "z. B. Gaming-Monitor", button: "Suchen", empty: "Keine Ergebnisse gefunden." };
  if (language === "it") return { label: "Cerca", placeholder: "Es. monitor gaming", button: "Cerca", empty: "Nessun risultato." };
  if (language === "nl") return { label: "Zoeken", placeholder: "Bijv. gamingmonitor", button: "Zoeken", empty: "Geen resultaten gevonden." };
  if (language === "pl") return { label: "Szukaj", placeholder: "Np. monitor gamingowy", button: "Szukaj", empty: "Brak wyników." };
  if (language === "tr") return { label: "Ara", placeholder: "Örn. oyun monitörü", button: "Ara", empty: "Sonuç bulunamadı." };
  if (language === "id") return { label: "Cari", placeholder: "Contoh: monitor gaming", button: "Cari", empty: "Tidak ada hasil." };
  return { label: "Search", placeholder: "Example: gaming monitor", button: "Search", empty: "No results found." };
}

export function subscribeHeading(language: string) {
  if (language === "ko") return "최신 아이템 정보 받기";
  if (language === "ja") return "新着アイテム情報を受け取る";
  if (language === "es") return "Recibe nuevos artículos";
  if (language === "pt-br" || language === "pt") return "Receba novos itens";
  if (language === "fr") return "Recevoir les nouveautés";
  if (language === "de") return "Neue Themen erhalten";
  if (language === "it") return "Ricevi nuovi articoli";
  if (language === "nl") return "Ontvang nieuwe items";
  if (language === "pl") return "Otrzymuj nowe tematy";
  if (language === "tr") return "Yeni konuları al";
  if (language === "id") return "Dapatkan item baru";
  return "Get new item updates";
}

export function subscribeBody(language: string) {
  if (language === "ko") return "이메일을 남기면 시장별 새 트렌드, 비교 후보, 구매 전 확인 포인트를 받을 수 있게 저장합니다.";
  if (language === "ja") return "メールを残すと、市場別の新トレンド、比較候補、購入前チェックを受け取れるよう準備します。";
  if (language === "es") return "Deja tu email para recibir nuevos temas y comparaciones cuando estén listas.";
  if (language === "pt-br" || language === "pt") return "Deixe seu email para receber novos temas e comparações quando estiverem prontos.";
  if (language === "fr") return "Laissez votre e-mail pour recevoir les nouvelles tendances, comparaisons et points de vérification.";
  if (language === "de") return "Hinterlasse deine E-Mail, um neue Trends, Vergleiche und Kaufchecks zu erhalten.";
  if (language === "it") return "Lascia la tua email per ricevere nuovi trend, confronti e controlli prima dell'acquisto.";
  if (language === "nl") return "Laat je e-mail achter om nieuwe trends, vergelijkingen en koopchecks te ontvangen.";
  if (language === "pl") return "Zostaw e-mail, aby otrzymywać nowe trendy, porównania i checklisty zakupowe.";
  if (language === "tr") return "Yeni trendleri, karşılaştırmaları ve satın alma kontrollerini almak için e-posta bırak.";
  if (language === "id") return "Tinggalkan email untuk menerima tren baru, perbandingan, dan poin cek sebelum membeli.";
  return "Leave an email to receive new market items and comparison candidates.";
}
