from typing import Any

from ..utils.gemini_client import get_gemini_client


class ConversationAgent:
    """Handles chat-like learning and summary generation."""

    def __init__(self) -> None:
        self.client = get_gemini_client()

    async def summarize_conversations(self, messages: list[dict[str, Any]]) -> str:
        if not self.client:
            return "Gemini client not configured"

        prompt = (
            "Summarize the following recent conversations to extract personality traits, "
            "communication style, and interests. Return bullet points."
        )
        text = "\n".join([f"{m.get('sender', 'user')}: {m.get('text','')}" for m in messages])
        response = self.client.generate_content(f"{prompt}\n\n{text}")
        return response.text or "No summary generated"

