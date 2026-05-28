from __future__ import annotations

import hashlib
import hmac


def aliexpress_signature(params: dict[str, str], app_secret: str | None, sign_method: str) -> str:
    if not app_secret:
        raise RuntimeError("AliExpress API secret is missing.")

    method = sign_method.lower()
    unsigned = {key: value for key, value in params.items() if key != "sign" and value is not None}
    sign_body = "".join(f"{key}{unsigned[key]}" for key in sorted(unsigned))
    wrapped = f"{app_secret}{sign_body}{app_secret}".encode("utf-8")

    if method == "hmac":
        return hmac.new(app_secret.encode("utf-8"), sign_body.encode("utf-8"), hashlib.md5).hexdigest().upper()
    if method in {"hmac-sha256", "hmac_sha256"}:
        return hmac.new(app_secret.encode("utf-8"), sign_body.encode("utf-8"), hashlib.sha256).hexdigest().upper()
    if method == "sha256":
        return hashlib.sha256(wrapped).hexdigest().upper()
    return hashlib.md5(wrapped).hexdigest().upper()
