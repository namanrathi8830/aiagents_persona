from typing import Any

from ..agents.learning_engine import LearningEngine
from ..utils.gemini_client import get_gemini_client


class ProfileAgent:
    """Combines learning signals into a coherent persona profile."""

    def __init__(self, learning_engine: LearningEngine) -> None:
        self.learning_engine = learning_engine
        self.client = get_gemini_client()

    async def persist_persona(self, user_id: str, persona: dict[str, Any], supabase: Any) -> None:
        supabase.table("personas").upsert({"user_id": user_id, **persona}).execute()

    async def synthesize_profile(self, user_id: str, persona: dict[str, Any]) -> str:
        if not self.client:
            return "Gemini client not configured"
        prompt = (
            "Given the structured persona data, craft a concise narrative profile with tone, "
            "preferences, strengths, and cautions."
        )
        return (
            self.client.generate_content(f"{prompt}\n\n{persona}").text
            or "Profile synthesis unavailable"
        )

