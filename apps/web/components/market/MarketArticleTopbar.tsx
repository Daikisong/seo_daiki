import Link from "next/link";
import { Search } from "lucide-react";
import { enabledMarkets } from "@/lib/market/config";
import { marketLanguageName } from "@/lib/market/market-language-names";
import { MARKET_NAV_SECTIONS, type MarketTopbarSection } from "@/lib/market/market-sections";
import { topbarLabels } from "./market-article-topbar-labels";

export function MarketArticleTopbar({
  active = "reviews",
  language,
  marketPath
}: {
  active?: MarketTopbarSection;
  language: string;
  marketPath: string;
}) {
  const labels = topbarLabels(language);
  const marketSwitcherSection = active;
  const markets = enabledMarkets();
  const currentMarket = markets.find((market) => market.pathPrefix === marketPath);
  const itemClass = (section: MarketTopbarSection) => (active === section ? "is-active" : undefined);
  return (
    <header className="market-article-topbar">
      <div className="market-article-topbar-inner">
        <Link className="market-article-brand" href={`${marketPath}/reviews/`}>
          <strong>{labels.brand}</strong>
          <span>{labels.tagline}</span>
        </Link>
        <nav className="market-article-topnav" aria-label={labels.navigation}>
          {MARKET_NAV_SECTIONS.map((section) => (
            <Link className={itemClass(section)} href={`${marketPath}/${section}/`} key={section}>
              {labels[section]}
            </Link>
          ))}
        </nav>
        <div className="market-article-top-actions">
          <Link className="market-article-icon-link" href={`${marketPath}/search/`} aria-label={labels.search}>
            <Search aria-hidden />
          </Link>
          <details className="market-locale-selector">
            <summary aria-label={labels.marketSwitch}>
              <span>{currentMarket ? `${currentMarket.country} · ${marketLanguageName(currentMarket)}` : labels.marketSwitch}</span>
            </summary>
            <div>
              <strong>{labels.marketSwitch}</strong>
              <nav aria-label={labels.marketSwitch}>
                {markets.map((market) => {
                  const activeMarket = market.pathPrefix === marketPath;
                  return (
                    <Link
                      className={activeMarket ? "is-active" : undefined}
                      href={`${market.pathPrefix}/${marketSwitcherSection}/`}
                      hrefLang={market.language}
                      key={`${market.market}-${market.language}`}
                    >
                      <span>{market.country}</span>
                      <small>{marketLanguageName(market)}</small>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </details>
          <Link className={`market-article-subscribe-link ${active === "subscribe" ? "is-active" : ""}`} href={`${marketPath}/subscribe/`}>
            {labels.subscribe}
          </Link>
        </div>
      </div>
    </header>
  );
}
