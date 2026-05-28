from __future__ import annotations

import argparse
from typing import Callable

Subcommands = argparse._SubParsersAction
CommandRegistrar = Callable[[Subcommands], None]


def add_noarg(subcommands: Subcommands, name: str) -> None:
    subcommands.add_parser(name)
