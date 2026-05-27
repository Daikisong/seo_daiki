from __future__ import annotations

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from workers.python.cli_dispatch import run_command
from workers.python.cli_parser import build_parser
from workers.python.common import ensure_dirs


def main() -> None:
    args = build_parser().parse_args()
    ensure_dirs()
    print(run_command(args))


if __name__ == "__main__":
    main()
