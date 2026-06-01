from __future__ import annotations

from argparse import Namespace
from pathlib import Path

from workers.python.cli_dispatch_result import NOT_HANDLED, DispatchResult, handled
from workers.python.intelligence.market_trend_engine import (
    cluster_market_trends,
    collect_market_trends,
    generate_trend_keywords,
    import_market_trend_signals,
    init_markets,
    normalize_market_trends,
    score_market_trends,
    trend_report,
)
from workers.python.intelligence.trend_monetization_router import route_trend_monetization


def run_trend_command(args: Namespace) -> DispatchResult:
    if args.command == "trend:init-markets":
        return handled(init_markets())
    if args.command in {"trend:import-signals", "import-trend-signals"}:
        return handled(import_market_trend_signals(Path(args.file)))
    if args.command == "trend:collect":
        return handled(collect_market_trends(args.market, args.source))
    if args.command == "trend:normalize":
        return handled(normalize_market_trends())
    if args.command in {"trend:cluster", "cluster-topics"}:
        return handled(cluster_market_trends())
    if args.command in {"trend:score", "score-topics"}:
        return handled(score_market_trends())
    if args.command == "trend:report":
        return handled(trend_report(args.market))
    if args.command == "trend:generate-keywords":
        return handled(generate_trend_keywords(args.cluster_id))
    if args.command == "trend:route-monetization":
        return handled(route_trend_monetization(args.article_id))
    return NOT_HANDLED
