from __future__ import annotations

from workers.python.validators.common import ValidationIssue, issue

REVIEW_SECTION_BY_LOCALE = {"en": "reviews", "es": "resenas", "pt-br": "analises"}
GUIDE_SECTION_BY_LOCALE = {"en": "guides", "es": "guias", "pt-br": "guias"}
REGIONAL_RISK_PREFIXES_BY_LOCALE = {
    "en": ("/en-us/guides/", "/en-gb/guides/"),
    "es": ("/es-es/guias/",),
    "pt-br": ("/pt-br/guias/",),
}


def validate_hreflang_inventory(inventory: list[dict[str, object]]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []

    for row in inventory:
        locale = str(row.get("locale", ""))
        article_type = str(row.get("type", ""))
        path = str(row.get("path", ""))

        regional_risk_path = article_type == "risk" and path.startswith(REGIONAL_RISK_PREFIXES_BY_LOCALE.get(locale, ()))
        if not path.startswith(f"/{locale}/") and not regional_risk_path:
            issues.append(issue("locale_path_mismatch", f"Path does not start with its locale: {path}"))

        if "/guide/" in path:
            issues.append(issue("guide_path_singular", f"Guide path should use /guides/: {path}"))

        if article_type == "review":
            expected = REVIEW_SECTION_BY_LOCALE.get(locale)
            if expected and f"/{expected}/" not in path:
                issues.append(
                    issue(
                        "review_path_not_localized",
                        f"Review path for {locale} should use /{expected}/: {path}",
                    )
                )
            if locale != "en" and "/reviews/" in path:
                issues.append(issue("localized_review_uses_english_path", f"Localized review path is wrong: {path}"))

        if article_type == "guide":
            expected = GUIDE_SECTION_BY_LOCALE.get(locale)
            if expected and f"/{expected}/" not in path:
                issues.append(
                    issue(
                        "guide_path_not_localized",
                        f"Guide path for {locale} should use /{expected}/: {path}",
                    )
                )
            if locale != "en" and "/guides/" in path:
                issues.append(issue("localized_guide_uses_english_path", f"Localized guide path is wrong: {path}"))

    return issues
