from __future__ import annotations

from workers.python.intelligence.calendar_engine_io import (
    export_market_calendar_payload,
    load_calendar_inputs,
    read_market_calendars,
    write_market_calendar_report,
    write_market_calendars,
)
from workers.python.intelligence.calendar_engine_model import calendar_for_market, enabled_market_configs
from workers.python.intelligence.calendar_engine_reports import calendar_explanations, filter_calendars


def build_market_calendar(market: str | None = None) -> str:
    inputs = load_calendar_inputs()

    calendars = []
    for market_config in enabled_market_configs(inputs["markets"], market):
        calendars.append(
            calendar_for_market(
                market_config,
                inputs["clusters"],
                inputs["keywords"],
                inputs["strategies"],
                inputs["articles"],
            )
        )
    return write_market_calendars(calendars)


def build_all_market_calendars() -> str:
    return build_market_calendar(None)


def explain_market_calendar(market: str | None = None) -> str:
    calendars = filter_calendars(read_market_calendars(), market)
    return write_market_calendar_report(calendars, calendar_explanations(calendars))


def export_market_calendars() -> str:
    return export_market_calendar_payload()
