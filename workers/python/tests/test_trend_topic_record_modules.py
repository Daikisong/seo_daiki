from __future__ import annotations

import unittest

from workers.python.intelligence import trend_topic_records
from workers.python.intelligence.topic_cluster_records import topic_cluster_payload
from workers.python.intelligence.topic_content_records import content_brief_records
from workers.python.intelligence.trend_import_records import trend_import_payload


class TrendTopicRecordModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_record_builders(self) -> None:
        self.assertIs(trend_topic_records.trend_import_payload, trend_import_payload)
        self.assertIs(trend_topic_records.topic_cluster_payload, topic_cluster_payload)
        self.assertIs(trend_topic_records.content_brief_records, content_brief_records)


if __name__ == "__main__":
    unittest.main()
