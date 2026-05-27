from __future__ import annotations


def search_intent(article_type: str, locale: str, product_title: str) -> str:
    intents = {
        "review": f"Decide whether {product_title} is worth buying after checking claims, variants, price, and local risk.",
        "guide": f"Solve a buyer problem around {product_title} without inventing unsupported specs.",
        "compare": f"Compare {product_title} against alternatives using evidence, price, and risk.",
        "data": f"Expose the structured evidence table behind {product_title} pages.",
        "lab": f"Show how measured evidence for {product_title} was collected.",
        "risk": f"Explain country-specific import risk for {product_title}.",
        "hub": f"Organize the {product_title} category into evidence-backed paths.",
    }
    if locale == "es":
        return intents.get(article_type, intents["review"]).replace("Decide whether", "Decidir si")
    if locale == "pt-br":
        return intents.get(article_type, intents["review"]).replace("Decide whether", "Decidir se")
    return intents.get(article_type, intents["review"])
