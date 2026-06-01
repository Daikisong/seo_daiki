import { notFound, permanentRedirect } from "next/navigation";
import { canonicalForMarketPath } from "@global-import-lab/seo";
import { enabledMarkets, findMarket } from "@/lib/market/config";

interface MarketHomeProps {
  params: Promise<{ locale: string; language: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().map((market) => ({ locale: market.market, language: market.language }));
}

export async function generateMetadata({ params }: MarketHomeProps) {
  const { locale: marketCode, language } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const reviewsPath = `${market.pathPrefix}/reviews/`;
  return {
    title: marketHomeTitle(market.language),
    description: marketHomeDescription(market.language),
    alternates: { canonical: canonicalForMarketPath(reviewsPath) },
    robots: { index: false, follow: true }
  };
}

export default async function MarketHomePage({ params }: MarketHomeProps) {
  const { locale: marketCode, language } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  permanentRedirect(`${market.pathPrefix}/reviews/`);
}

function marketHomeTitle(language: string) {
  if (language === "ko") return "리뷰/가이드";
  if (language === "ja") return "レビュー/ガイド";
  if (language === "es") return "Reseñas/Guías";
  if (language === "pt-br" || language === "pt") return "Reviews/Guias";
  if (language === "fr") return "Avis/Guides";
  if (language === "de") return "Reviews/Ratgeber";
  if (language === "it") return "Recensioni/Guide";
  if (language === "nl") return "Reviews/Gidsen";
  if (language === "pl") return "Recenzje/Poradniki";
  if (language === "tr") return "İncelemeler/Rehberler";
  if (language === "id") return "Review/Panduan";
  return "Reviews/Guides";
}

function marketHomeDescription(language: string) {
  if (language === "ko") return "시장별 리뷰와 구매 전 확인 가이드를 모아 보여줍니다.";
  if (language === "ja") return "市場別のレビューと購入前チェックガイドをまとめて表示します。";
  if (language === "es") return "Reseñas y guías de compra organizadas por mercado.";
  if (language === "pt-br" || language === "pt") return "Reviews e guias de compra organizados por mercado.";
  if (language === "fr") return "Avis et guides d'achat organisés par marché.";
  if (language === "de") return "Reviews und Kaufchecks nach Markt geordnet.";
  if (language === "it") return "Recensioni e guide all'acquisto organizzate per mercato.";
  if (language === "nl") return "Reviews en koopchecks per markt geordend.";
  if (language === "pl") return "Recenzje i poradniki zakupowe uporządkowane według rynku.";
  if (language === "tr") return "Pazara göre düzenlenmiş incelemeler ve satın alma kontrolleri.";
  if (language === "id") return "Review dan panduan pembelian yang diatur per pasar.";
  return "Market-specific reviews and buying checks.";
}
