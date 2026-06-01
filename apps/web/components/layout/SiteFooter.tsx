export function SiteFooter({ language }: { language?: string }) {
  const copy = footerCopy(language);
  return (
    <footer className="mt-12 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
        <p>{copy}</p>
      </div>
    </footer>
  );
}

function footerCopy(language?: string) {
  if (language === "ko") {
    return "리뷰 가이드는 시장별 트렌드를 확인하고, 출처와 기준이 분명한 구매 전 체크 글로 정리합니다.";
  }
  if (language === "ja") {
    return "レビューガイドは市場ごとのトレンドを確認し、根拠と基準が分かる購入前チェック記事として整理します。";
  }
  if (language === "es") {
    return "Guía de reseñas convierte tendencias locales en guías prácticas con fuentes y criterios claros.";
  }
  if (language === "pt-br" || language === "pt") {
    return "Guia de reviews transforma tendências locais em guias práticos com fontes e critérios claros.";
  }
  if (language === "fr") {
    return "Guide d'avis transforme les tendances locales en guides pratiques avec sources et critères clairs.";
  }
  if (language === "de") {
    return "Review Guide macht lokale Trends zu praktischen Ratgebern mit klaren Quellen und Kriterien.";
  }
  if (language === "it") {
    return "Guida recensioni trasforma i trend locali in guide pratiche con fonti e criteri chiari.";
  }
  if (language === "nl") {
    return "Reviewgids zet lokale trends om in praktische gidsen met duidelijke bronnen en criteria.";
  }
  if (language === "pl") {
    return "Przewodnik recenzji zamienia lokalne trendy w praktyczne poradniki z jasnymi źródłami i kryteriami.";
  }
  if (language === "tr") {
    return "İnceleme Rehberi yerel trendleri açık kaynaklar ve kriterlerle pratik rehberlere dönüştürür.";
  }
  if (language === "id") {
    return "Panduan Review mengubah tren lokal menjadi panduan praktis dengan sumber dan kriteria yang jelas.";
  }
  return "Review Guide turns market-specific trends into practical guides with clear source checks and cautious recommendations.";
}
