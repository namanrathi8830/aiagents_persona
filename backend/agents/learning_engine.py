from __future__ import annotations

from typing import Any, Callable

from ..models.persona import LearningSignal, Persona
from ..utils.gemini_client import get_gemini_client
from .activity_agent import ActivityAgent
from .conversation_agent import ConversationAgent
from .synthesis_agent import SynthesisAgent


class LearningEngine:
    """Central coordinator for 10+ learning methods."""

    def __init__(self) -> None:
        self.gemini = get_gemini_client()
        self.activity_agent = ActivityAgent()
        self.conversation_agent = ConversationAgent()
        self.synthesis_agent = SynthesisAgent()
        self.method_map: dict[str, Callable[[dict[str, Any]], Any]] = {
            "chat": self._analyze_chat,
            "email_message": self._analyze_email_message,
            "calendar": self._analyze_calendar,
            "documents": self._analyze_documents,
            "social_profile": self._analyze_social,
            "decision_history": self._analyze_decisions,
            "tasks": self._analyze_tasks,
            "response_time": self._analyze_response_time,
            "sentiment": self._analyze_sentiment,
            "topic_interest": self._analyze_topics,
            "feedback_loop": self._analyze_feedback,
        }

    async def process_signals(
        self, user_id: str, signals: list[LearningSignal], feedback: str | None
    ) -> Persona:
        summaries: list[str] = []
        persona: Persona = {
            "user_id": user_id,
            "traits": [],
            "preferences": [],
            "interests": [],
            "risks": [],
            "notes": [],
        }

        for signal in signals:
            handler = self.method_map.get(signal.type)
            if not handler:
                continue
            summary = await handler(signal.payload)
            if summary:
                summaries.append(summary)
                persona["notes"].append({"type": signal.type, "summary": summary})

        if feedback:
            feedback_summary = await self._analyze_feedback({"text": feedback})
            summaries.append(feedback_summary)
            persona["notes"].append({"type": "feedback", "summary": feedback_summary})

        merged = await self.synthesis_agent.merge_signals(summaries)
        persona["traits"].append(merged)
        return persona

    async def _analyze_chat(self, payload: dict[str, Any]) -> str:
        """Handle chat/conversation signals."""
        if not self.gemini:
            return "Gemini client not configured"
        message = payload.get("message") or str(payload)
        prompt = (
            "Analyze this chat message to extract personality traits, interests, "
            "communication style, and preferences. Return concise bullet points."
        )
        try:
            response = self.gemini.generate_content(f"{prompt}\n\n{message}")
            return response.text or "No analysis generated"
        except Exception as e:
            return f"Error analyzing chat: {str(e)}"

    async def _analyze_email_message(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = (
            "Extract tone, clarity, and collaboration style from emails/messages. "
            "Return concise bullet points."
        )
        text = payload.get("text") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_calendar(self, payload: dict[str, Any]) -> str:
        events = payload.get("events", [])
        return await self.activity_agent.summarize_calendar(events)

    async def _analyze_documents(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = (
            "Derive writing style, rigor, and preferred formats from these documents."
        )
        text = payload.get("text") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_social(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = (
            "From public profile snippets, infer interests, professional focus, and voice."
        )
        text = payload.get("bio") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_decisions(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = (
            "Analyze decision logs to extract heuristics, risk tolerance, and review cadence."
        )
        text = payload.get("log") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_tasks(self, payload: dict[str, Any]) -> str:
        tasks = payload.get("tasks", [])
        return await self.activity_agent.summarize_tasks(tasks)

    async def _analyze_response_time(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = "Determine responsiveness patterns and urgency cues from timestamps."
        text = str(payload.get("timeline", ""))
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_sentiment(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = "Perform emotional tone analysis; capture sentiment trends and volatility."
        text = payload.get("text") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_topics(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = "Map recurring topics and curiosity spikes; return ranked list."
        text = payload.get("text") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

    async def _analyze_feedback(self, payload: dict[str, Any]) -> str:
        if not self.gemini:
            return "Gemini client not configured"
        prompt = "Summarize user feedback to refine persona accuracy and preferences."
        text = payload.get("text") or ""
        return self.gemini.generate_content(f"{prompt}\n\n{text}").text or ""

