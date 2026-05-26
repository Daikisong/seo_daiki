from __future__ import annotations

from workers.python.validators.common import ValidationIssue, issue

SUPPORTED_LOCALES = {"en", "es", "pt-br"}


def validate_locale_depth(pack: dict[str, object]) -> list[ValidationIssue]:
    locale = str(pack.get("locale", ""))
    market_risks = pack.get("market_risks") if isinstance(pack.get("market_risks"), list) else []
    review_signals = pack.get("review_signals") if isinstance(pack.get("review_signals"), list) else []
    issues: list[ValidationIssue] = []

    if locale not in SUPPORTED_LOCALES:
        issues.append(issue("locale_unsupported", f"Unsupported locale: {locale or '(missing)'}"))

    matching_risks = [
        risk
        for risk in market_risks
        if isinstance(risk, dict) and str(risk.get("locale", "")) == locale
    ]
    if not matching_risks:
        issues.append(issue("locale_risk_missing", "Evidence pack needs a market_risk row for its locale."))
    else:
        for risk in matching_risks:
            if not risk.get("local_alternative_note"):
                issues.append(
                    issue(
                        "local_alternative_missing",
                        "Locale risk should explain when to compare a local marketplace alternative.",
                        "warning",
                    )
                )

    matching_signals = [
        signal
        for signal in review_signals
        if isinstance(signal, dict) and str(signal.get("locale", "")) == locale
    ]
    if not matching_signals:
        issues.append(
            issue(
                "locale_review_signal_missing",
                "No review signal exists for this locale yet; keep the page pending until localized evidence improves.",
                "warning",
            )
        )

    return issues

