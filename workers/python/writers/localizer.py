from __future__ import annotations


def localize_label(locale: str, key: str) -> str:
    labels = {
        "en": {"verdict": "30-second verdict", "evidence": "Evidence"},
        "es": {"verdict": "Veredicto rápido", "evidence": "Evidencia"},
        "pt-br": {"verdict": "Veredito em 30 segundos", "evidence": "Evidências"}
    }
    return labels.get(locale, labels["en"]).get(key, key)
