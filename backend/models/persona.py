from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class LearningSignal(BaseModel):
    type: str = Field(..., description="One of the supported learning methods")
    payload: dict[str, Any] = Field(default_factory=dict)


class Persona(BaseModel):
    user_id: str
    traits: list[Any] = Field(default_factory=list)
    preferences: list[Any] = Field(default_factory=list)
    interests: list[Any] = Field(default_factory=list)
    risks: list[Any] = Field(default_factory=list)
    notes: list[Any] = Field(default_factory=list)


class PersonaUpdateRequest(BaseModel):
    user_id: str
    signals: list[LearningSignal]
    feedback: str | None = None


class PersonaResponse(BaseModel):
    persona: dict[str, Any] | Persona
    message: str = "ok"

