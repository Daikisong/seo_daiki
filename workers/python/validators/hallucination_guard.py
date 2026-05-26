from __future__ import annotations


def content_text_for_validation(text: str) -> str:
    kept = []
    skipping_prompt_preview = False
    for line in text.splitlines():
        stripped = line.strip().lower()
        if stripped.startswith("prompt preview:"):
            skipping_prompt_preview = True
            continue
        if stripped.startswith("### ") or stripped.startswith("## "):
            skipping_prompt_preview = False
        if skipping_prompt_preview:
            continue
        if stripped.startswith("- forbidden:") or stripped.startswith("- allowed:"):
            continue
        kept.append(line)
    return "\n".join(kept)


def forbidden_claim_issues(text: str, forbidden_claims: list[str]) -> list[str]:
    lowered = content_text_for_validation(text).lower()
    issues = []
    if "certified safe" in lowered:
        issues.append("Certification claim appears without evidence.")
    if "we tested" in lowered and "verified_claims" not in lowered:
        issues.append("Direct test wording appears without a verified claim reference.")
    for claim in forbidden_claims:
        marker = claim.lower().replace("do not ", "")
        if marker and marker in lowered:
            issues.append(f"Forbidden claim pattern appears: {claim}")
    return issues
