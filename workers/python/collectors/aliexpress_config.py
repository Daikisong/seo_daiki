from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass

DEFAULT_ALIEXPRESS_BASE_URL = "https://api-sg.aliexpress.com/sync"
DEFAULT_ALIEXPRESS_SIGN_METHOD = "md5"


@dataclass(frozen=True)
class AliExpressConfig:
    app_key: str | None
    app_secret: str | None
    tracking_id: str | None
    base_url: str
    sign_method: str


def aliexpress_config_from_env(env: Mapping[str, str]) -> AliExpressConfig:
    return AliExpressConfig(
        app_key=env.get("ALIEXPRESS_APP_KEY"),
        app_secret=env.get("ALIEXPRESS_APP_SECRET"),
        tracking_id=env.get("ALIEXPRESS_TRACKING_ID"),
        base_url=env.get("ALIEXPRESS_API_BASE_URL", DEFAULT_ALIEXPRESS_BASE_URL),
        sign_method=env.get("ALIEXPRESS_SIGN_METHOD", DEFAULT_ALIEXPRESS_SIGN_METHOD).lower(),
    )


def aliexpress_configured(config: AliExpressConfig) -> bool:
    return bool(config.app_key and config.app_secret and config.tracking_id)
