from __future__ import annotations

import unittest

from workers.python.intelligence import trend_topic_records
from workers.python.intelligence.topic_content_brief_records import content_brief_records
from workers.python.intelligence.topic_cluster_records import topic_cluster_payload
from workers.python.intelligence.topic_content_records import content_brief_records as legacy_content_brief_records
from workers.python.intelligence.topic_draft_records import topic_draft_lines
from workers.python.intelligence.topic_localization_record_builders import topic_localization_records
from workers.python.intelligence.topic_offer_match_records import affiliate_offer_match_records
from workers.python.intelligence.topic_publishing_gate_records import publishing_gate_records
from workers.python.intelligence.trend_import_records import trend_import_payload


class TrendTopicRecordModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_record_builders(self) -> None:
        self.assertIs(trend_topic_records.trend_import_payload, trend_import_payload)
        self.assertIs(trend_topic_records.topic_cluster_payload, topic_cluster_payload)
        self.assertIs(trend_topic_records.content_brief_records, content_brief_records)

    def test_content_records_module_reexports_role_specific_builders(self) -> None:
        self.assertIs(legacy_content_brief_records, content_brief_records)
        self.assertIs(trend_topic_records.affiliate_offer_match_records, affiliate_offer_match_records)
        self.assertIs(trend_topic_records.topic_draft_lines, topic_draft_lines)
        self.assertIs(trend_topic_records.topic_localization_records, topic_localization_records)
        self.assertIs(trend_topic_records.publishing_gate_records, publishing_gate_records)


if __name__ == "__main__":
    unittest.main()
