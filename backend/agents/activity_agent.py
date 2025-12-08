from typing import Any

from ..utils.gemini_client import get_gemini_client


class ActivityAgent:
    """Analyzes activity streams like calendar, tasks, and decisions."""

    def __init__(self) -> None:
        self.client = get_gemini_client()

    async def summarize_calendar(self, events: list[dict[str, Any]]) -> str:
        if not self.client:
            return "Gemini client not configured"
        prompt = (
            "Derive scheduling preferences, meeting styles, and time-of-day energy "
            "from these calendar events. Return concise bullets."
        )
        text = "\n".join([f"{e.get('title','(untitled)')} at {e.get('start')}" for e in events])
        return self.client.generate_content(f"{prompt}\n\n{text}").text or ""

    async def summarize_tasks(self, tasks: list[dict[str, Any]]) -> str:
        if not self.client:
            return "Gemini client not configured"
        prompt = (
            "From these tasks, infer prioritization habits, completion patterns, and blockers."
        )
        text = "\n".join([f"{t.get('title')} - {t.get('status','')}" for t in tasks])
        return self.client.generate_content(f"{prompt}\n\n{text}").text or ""

