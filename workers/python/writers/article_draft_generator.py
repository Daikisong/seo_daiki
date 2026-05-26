from __future__ import annotations

from workers.python.common import DATA, read_json
from workers.python.writers.article_outline_generator import build_outline_for_pack
from workers.python.writers.llm_provider import get_provider
from workers.python.writers.localizer import localize_label


def generate_draft(locale: str, article_type: str) -> str:
    packs = read_json(DATA / "evidence_packs" / f"{locale}.json", [])
    output = DATA / "drafts" / f"{locale}-{article_type}.md"
    provider = get_provider()
    lines = [f"# {article_type.title()} draft ({locale})", ""]
    for pack in packs:
        product = pack["product"]
        outline = build_outline_for_pack(pack, locale, article_type)
        prompt = (
            "Write only from this evidence pack. "
            "Do not invent specs, prices, tests, certifications, or review quotes.\n\n"
            f"{pack}"
        )
        generated_note = provider.generate(prompt)
        lines.extend(
            [
                f"## {product['title']}",
                "",
                "### Outline plan",
                *(f"- {section['heading']}: {section['why']}" for section in outline["sections"]),
                "",
                f"### {localize_label(locale, 'verdict')}",
                "Use this page only when evidence, variant traps, price truth, and locale risk are present.",
                "",
                "### Seller claims vs evidence",
                *(f"- {claim['claim_type']}: {claim['claim_value']}" for claim in pack["seller_claims"]),
                "",
                "### Variant traps",
                *(f"- {trap['option']}: {'; '.join(trap['risk_flags'])}" for trap in pack["variants"]),
                "",
                "### LLM draft note",
                generated_note,
                "",
                f"### {localize_label(locale, 'evidence')}",
                *(f"- forbidden: {claim}" for claim in pack["forbidden_claims"]),
                ""
            ]
        )
    output.write_text("\n".join(lines), encoding="utf-8")
    return str(output)
