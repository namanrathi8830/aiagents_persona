from typing import Any

from ..utils.gemini_client import get_gemini_client


class SynthesisAgent:
    """Turns multiple signal summaries into unified insights."""

    def __init__(self) -> None:
        self.client = get_gemini_client()

    async def merge_signals(self, summaries: list[str]) -> str:
        if not self.client:
            return "Gemini client not configured"
        prompt = (
            "Merge these persona learning summaries into a single, deduplicated persona snapshot "
            "with traits, habits, and cautions."
        )
        text = "\n- ".join(summaries)
        return self.client.generate_content(f"{prompt}\n\n{text}").text or ""

