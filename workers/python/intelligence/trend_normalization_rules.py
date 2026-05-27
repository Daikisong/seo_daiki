from __future__ import annotations


def normalize_keyword(value: str) -> str:
    return " ".join(str(value).lower().replace("-", " ").split())


def market_from_country(country: str) -> str:
    return country.lower() if country else "us"


def cluster_topic(signal: dict[str, object]) -> str:
    value = str(signal.get("topicRaw") or signal.get("normalizedKeyword") or "").lower()
    replacements = {
        "magnesium sleep": "magnesium sleep",
        "gut health": "gut health",
        "usb c": "usb c charger",
        "usb-c": "usb c charger",
        "power bank": "power bank real capacity",
        "desk gadget": "compact desk gadget",
        "travel adapter": "travel adapter",
        "smartwatch": "budget smartwatch",
        "beauty ingredient": "beauty ingredient",
    }
    for needle, topic in replacements.items():
        if needle in value:
            return topic
    return normalize_keyword(value)


def topic_signature(value: str) -> str:
    words = [word for word in normalize_keyword(value).split() if len(word) > 2]
    return " ".join(words[:4]) or normalize_keyword(value)
