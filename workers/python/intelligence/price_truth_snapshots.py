from __future__ import annotations

from typing import Any

from workers.python.intelligence.price_truth_rules import avoid_reasons_for_price, price_truth_from_values
from workers.python.intelligence.price_truth_values import number_value, string_value


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
