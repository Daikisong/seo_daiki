import Link from "next/link";
import { enabledMarkets } from "@/lib/market/config";

export function MarketSwitcher() {
  const markets = enabledMarkets();

  return (
    <nav aria-label="Market switcher" className="flex flex-wrap gap-2 text-xs text-neutral-600">
      {markets.slice(0, 6).map((market) => (
        <Link className="focus-ring rounded-sm hover:text-neutral-950" href={`${market.pathPrefix}/reviews/`} key={`${market.market}-${market.language}`}>
          {market.country}/{market.language}
        </Link>
      ))}
      <Link className="focus-ring rounded-sm font-medium text-neutral-800 hover:text-neutral-950" href="/global/markets/">
        All markets
      </Link>
    </nav>
  );
}
