from __future__ import annotations


def risk_score(row: dict[str, str]) -> float:
    risk = 20
    text = " ".join(str(value).lower() for value in row.values())
    for term in ["health", "supplement", "medical", "counterfeit", "safety", "claims"]:
        if term in text:
            risk += 12
    return min(100, risk)


def evidence_needed(row: dict[str, str]) -> list[str]:
    needs = ["Official product page", "Current price/availability timestamp", "Merchant policy check"]
    text = " ".join(str(value).lower() for value in row.values())
    if any(term in text for term in ["health", "supplement", "magnesium", "gut"]):
        needs.append("Health claim review and supplement disclaimer")
    if any(term in text for term in ["charger", "power bank", "adapter"]):
        needs.append("Safety/certification and spec verification")
    return needs
