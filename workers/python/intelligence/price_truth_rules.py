from __future__ import annotations

from typing import Any

from workers.python.intelligence.price_truth_values import string_value


CATEGORY_THRESHOLDS = {
    "usb-c-chargers": {"buy_under": 18, "wait_under": 24, "label": "$"},
    "usb-c-cables": {"buy_under": 8, "wait_under": 12, "label": "$"},
    "power-banks": {"buy_under": 45, "wait_under": 55, "label": "$"},
    "electric-screwdrivers": {"buy_under": 25, "wait_under": 35, "label": "$"},
    "smart-home-sensors": {"buy_under": 8, "wait_under": 12, "label": "$"}
}


def price_truth(final_price: float) -> dict[str, object]:
    return price_truth_from_values(final_price=final_price, category="usb-c-chargers")


def price_truth_from_values(final_price: float, category: str) -> dict[str, object]:
    thresholds = CATEGORY_THRESHOLDS.get(category, CATEGORY_THRESHOLDS["usb-c-chargers"])
    buy_under = float(thresholds["buy_under"])
    wait_under = float(thresholds["wait_under"])
    currency_label = str(thresholds["label"])

    if final_price < buy_under:
        zone = "buy"
    elif final_price < wait_under:
        zone = "wait"
    else:
        zone = "avoid"

    return {
        "buy_zone": f"under {currency_label}{buy_under:g} shipped",
        "wait_zone": f"{currency_label}{buy_under:g}-{currency_label}{wait_under:g} shipped",
        "avoid_zone": f"{currency_label}{wait_under:g}+ unless evidence is unusually strong",
        "current_zone": zone
    }


def avoid_reasons_for_price(current_zone: object, variant_traps: list[dict[str, Any]]) -> list[str]:
    reasons: list[str] = []
    if current_zone == "avoid":
        reasons.append("Final shipped price is above the avoid threshold for this category.")

    for trap in variant_traps:
        flags = trap.get("risk_flags") if isinstance(trap.get("risk_flags"), list) else []
        for flag in flags:
            text = string_value(flag)
            if text and text not in reasons:
                reasons.append(text)

    return reasons[:5]
