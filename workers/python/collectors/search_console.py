from __future__ import annotations

import os
from datetime import date, timedelta

from workers.python.common import DATA, write_json


def import_search_console(start_date: str | None = None, end_date: str | None = None) -> str:
    site_url = os.getenv("GOOGLE_SEARCH_CONSOLE_SITE_URL")
    credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not site_url or not credentials:
        sample = [
            {
                "page": "/en/guides/aliexpress-charger-fake-watts/",
                "query": "aliexpress charger not 65w",
                "country": "usa",
                "device": "desktop",
                "clicks": 3,
                "impressions": 240,
                "ctr": 0.0125,
                "position": 14.2
            }
        ]
        return str(write_json(DATA / "snapshots" / "search_console_sample.json", sample))

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as error:
        raise RuntimeError(
            "Install workers/python/requirements.txt to use the real Search Console importer."
        ) from error

    end = end_date or (date.today() - timedelta(days=3)).isoformat()
    start = start_date or (date.today() - timedelta(days=31)).isoformat()
    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    creds = service_account.Credentials.from_service_account_file(credentials, scopes=scopes)
    service = build("searchconsole", "v1", credentials=creds)
    response = (
        service.searchanalytics()
        .query(
            siteUrl=site_url,
            body={
                "startDate": start,
                "endDate": end,
                "dimensions": ["page", "query", "country", "device"],
                "rowLimit": 25000
            }
        )
        .execute()
    )

    rows = []
    for row in response.get("rows", []):
        keys = row.get("keys", [])
        rows.append(
            {
                "page": keys[0] if len(keys) > 0 else "",
                "query": keys[1] if len(keys) > 1 else "",
                "country": keys[2] if len(keys) > 2 else "",
                "device": keys[3] if len(keys) > 3 else "",
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0),
                "position": row.get("position", 0),
                "start_date": start,
                "end_date": end
            }
        )

    return str(write_json(DATA / "snapshots" / "search_console_rows.json", rows))
