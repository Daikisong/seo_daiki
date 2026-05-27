from __future__ import annotations

from workers.python.common import DATA, write_json
from workers.python.validators.duplicate_similarity_validator import validate_duplicate_similarity
from workers.python.validators.hreflang_validator import validate_hreflang_inventory
from workers.python.validators.internal_link_validator import validate_internal_link_inventory
from workers.python.validators.quality_gate_io import load_evidence_packs, load_url_inventory, read_draft
from workers.python.validators.quality_gate_pack import validate_quality_pack
from workers.python.validators.quality_gate_report import build_quality_gate_output, print_quality_gate_result


def run_quality_gate() -> str:
    packs = load_evidence_packs()
    inventory = load_url_inventory()
    global_issues = [
        *validate_duplicate_similarity(packs),
        *validate_hreflang_inventory(inventory),
        *validate_internal_link_inventory(inventory),
    ]

    evidence_results = [validate_quality_pack(pack, read_draft(str(pack.get("locale", "")))) for pack in packs]
    output = build_quality_gate_output(packs, inventory, global_issues, evidence_results)

    path = DATA / "exports" / "quality_gate.json"
    write_json(path, output)
    print_quality_gate_result(output)
    return str(path)
