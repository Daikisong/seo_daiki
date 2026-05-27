from __future__ import annotations

from workers.python.intelligence.search_console_page_rules import _article_type_from_path


def _title_candidate(page: str, query: str) -> str:
    phrase = " ".join(_title_word(word) for word in query.split())
    suffix = "Evidence, Variant Checks, Safer Picks"
    if _article_type_from_path(page) == "guide":
        suffix = "Fixes, Evidence, Safer Picks"
    return _truncate(f"{phrase}: {suffix}", 68)


def _meta_candidate(query: str, link_candidates: list[dict[str, object]]) -> str:
    link_hint = " Compare linked data, lab, and guide pages before buying." if link_candidates else ""
    return _truncate(
        f"Answer {query} with seller-claim checks, variant traps, price evidence, and local risk notes.{link_hint}",
        154,
    )


def _title_word(word: str) -> str:
    if any(char.isdigit() for char in word):
        return word.upper()
    if word.lower() == "aliexpress":
        return "AliExpress"
    if word.lower() == "usb":
        return "USB"
    small_words = {"a", "an", "and", "for", "in", "of", "or", "the", "to", "vs"}
    lowered = word.lower()
    return lowered if lowered in small_words else lowered.capitalize()


def _truncate(value: str, max_length: int) -> str:
    if len(value) <= max_length:
        return value
    trimmed = value[: max_length - 3].rstrip(" ,.;:-")
    return trimmed + "..."
