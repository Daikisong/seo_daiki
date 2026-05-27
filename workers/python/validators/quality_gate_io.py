from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA, read_json


def load_evidence_packs(data_root: Path = DATA) -> list[dict[str, object]]:
    packs: list[dict[str, object]] = []
    for path in sorted((data_root / "evidence_packs").glob("*.json")):
        for pack in read_json(path, []):
            if isinstance(pack, dict):
                packs.append({**pack, "_source_file": str(path.relative_to(data_root))})
    return packs


def load_url_inventory(data_root: Path = DATA) -> list[object]:
    inventory = read_json(data_root / "exports" / "initial_url_inventory.json", [])
    return inventory if isinstance(inventory, list) else []


def read_draft(locale: str, data_root: Path = DATA) -> str:
    paths = sorted((data_root / "drafts").glob(f"{locale}-*.md"))
    return "\n\n".join(read_text(path) for path in paths)


def read_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")
