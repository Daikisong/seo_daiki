from __future__ import annotations

from argparse import Namespace
import unittest

from workers.python.cli_dispatch import COMMAND_HANDLERS, run_command
from workers.python.cli_dispatch_result import NOT_HANDLED, handled
from workers.python.cli_later_phase_commands import run_later_phase_command
from workers.python.cli_serp_commands import run_serp_command


class CliDispatchModulesTest(unittest.TestCase):
    def test_dispatch_result_supports_none_return_values(self) -> None:
        result = handled(None)

        self.assertTrue(result.handled)
        self.assertIsNone(result.value)
        self.assertFalse(NOT_HANDLED.handled)

    def test_dispatcher_has_grouped_handlers(self) -> None:
        handler_names = [handler.__name__ for handler in COMMAND_HANDLERS]

        self.assertIn("run_trend_command", handler_names)
        self.assertIn("run_serp_command", handler_names)
        self.assertIn("run_later_phase_command", handler_names)

    def test_group_handlers_ignore_unrelated_commands(self) -> None:
        args = Namespace(command="trend:score")

        self.assertIs(run_serp_command(args), NOT_HANDLED)
        self.assertIs(run_later_phase_command(args), NOT_HANDLED)

    def test_unsupported_command_still_raises_clear_error(self) -> None:
        with self.assertRaisesRegex(ValueError, "Unsupported command: unknown"):
            run_command(Namespace(command="unknown"))


if __name__ == "__main__":
    unittest.main()
