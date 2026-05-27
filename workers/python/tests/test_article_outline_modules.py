from __future__ import annotations

import unittest

from workers.python.writers import article_outline_rules
from workers.python.writers.article_outline_builder import build_outline_for_pack
from workers.python.writers.article_outline_text_rules import internal_link_plan, search_intent


class ArticleOutlineModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_outline_helpers(self) -> None:
        self.assertIs(article_outline_rules.build_outline_for_pack, build_outline_for_pack)
        self.assertIs(article_outline_rules.internal_link_plan, internal_link_plan)
        self.assertIs(article_outline_rules.search_intent, search_intent)


if __name__ == "__main__":
    unittest.main()
