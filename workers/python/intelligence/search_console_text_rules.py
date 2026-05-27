from __future__ import annotations

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "best",
    "for",
    "how",
    "is",
    "it",
    "of",
    "on",
    "or",
    "the",
    "to",
    "vs",
    "what",
    "when",
    "why",
    "with",
}

CLAIM_TERMS = {"45w", "60w", "65w", "67w", "100w", "120w", "pd", "pps", "watt", "watts", "mah", "wh"}
PROBLEM_TERMS = {"fake", "not", "trap", "variant", "plug", "cable", "charging", "laptop", "overheat", "return"}
RISK_TERMS = {"customs", "certification", "return", "plug", "shipping", "country", "risk", "warranty"}
PRICE_TERMS = {"cheap", "price", "coupon", "deal", "alternative", "budget", "premium"}
TERM_ALIASES = {
    "aliexpress": {"ali", "express"},
    "charger": {"charging", "usb", "c"},
    "charging": {"charger", "charge"},
    "watt": {"watts"},
    "watts": {"watt"},
}
HEALTH_TERMS = {"iherb", "supplement", "magnesium", "probiotic", "vitamin", "sleep", "gut", "dosage", "dose", "ingredient"}


def _terms(value: str) -> list[str]:
    cleaned = "".join(char.lower() if char.isalnum() else " " for char in value)
    return [term for term in cleaned.split() if (len(term) > 2 or any(char.isdigit() for char in term)) and term not in STOPWORDS]


def _expanded_terms(terms: list[str]) -> set[str]:
    expanded = set(terms)
    for term in terms:
        expanded.update(TERM_ALIASES.get(term, set()))
    return expanded
