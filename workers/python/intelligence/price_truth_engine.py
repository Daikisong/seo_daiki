from __future__ import annotations

from typing import Any


from workers.python.common import DATA, read_json, write_json


CATEGORY_THRESHOLDS = {
    "usb-c-chargers": {"buy_under": 18, "wait_under": 24, "label": "$"},
    "usb-c-cables": {"buy_under": 8, "wait_under": 12, "label": "$"},
    "power-banks": {"buy_under": 45, "wait_under": 55, "label": "$"},
    "electric-screwdrivers": {"buy_under": 25, "wait_under": 35, "label": "$"},
    "smart-home-sensors": {"buy_under": 8, "wait_under": 12, "label": "$"}
}


def build_price_truth() -> str:
    products = {str(item.get("product_id")): item for item in read_json(DATA / "raw" / "raw_product_candidates.json", [])}
    snapshots = read_json(DATA / "snapshots" / "price_snapshots.json", [])
    variant_traps = read_json(DATA / "snapshots" / "variant_traps.json", [])

    rows = [
        price_truth_for_snapshot(snapshot, products.get(str(snapshot.get("product_id")), {}), variant_traps)
        for snapshot in snapshots
        if isinstance(snapshot, dict)
    ]
    path = write_json(DATA / "snapshots" / "price_truth.json", rows)
    return str(path)


def price_truth(final_price: float) -> dict[str, object]:
    return price_truth_from_values(final_price=final_price, category="usb-c-chargers")


def price_truth_for_snapshot(
    snapshot: dict[str, Any],
    product: dict[str, Any],
    variant_traps: list[dict[str, Any]]
) -> dict[str, object]:
    price = number_value(snapshot.get("price"))
    shipping = number_value(snapshot.get("shipping"))
    coupon = number_value(snapshot.get("coupon"))
    final_price = number_value(snapshot.get("final_price")) or round(price + shipping - coupon, 2)
    category = string_value(product.get("category")) or "usb-c-chargers"
    base = price_truth_from_values(final_price=final_price, category=category)
    product_id = string_value(snapshot.get("product_id"))
    trap_rows = [trap for trap in variant_traps if isinstance(trap, dict) and string_value(trap.get("product_id")) == product_id]
    avoid_reasons = avoid_reasons_for_price(base["current_zone"], trap_rows)

    return {
        "product_id": product_id,
        "category": category,
        "currency": snapshot.get("currency"),
        "normal_price": price,
        "sale_price": max(0, round(price - coupon, 2)),
        "shipping": shipping,
        "coupon": coupon,
        "coupon_adjusted_price": max(0, round(price - coupon, 2)),
        "final_price": final_price,
        "captured_at": snapshot.get("captured_at"),
        "source_url": snapshot.get("source_url") or product.get("source_url"),
        "avoid_reasons": avoid_reasons,
        **base
    }


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


def number_value(value: Any) -> float:
    try:
        return round(float(value), 2)
    except (TypeError, ValueError):
        return 0.0


def string_value(value: Any) -> str:
    return str(value).strip() if value is not None else ""
