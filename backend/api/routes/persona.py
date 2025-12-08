from fastapi import APIRouter, HTTPException

from ...agents.learning_engine import LearningEngine
from ...agents.profile_agent import ProfileAgent
from ...models.persona import LearningSignal, PersonaResponse, PersonaUpdateRequest
from ...utils.supabase_client import get_supabase

router = APIRouter()
learning_engine = LearningEngine()
profile_agent = ProfileAgent(learning_engine=learning_engine)


@router.post("/learn", response_model=PersonaResponse)
async def learn(request: PersonaUpdateRequest) -> PersonaResponse:
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    persona = await learning_engine.process_signals(
        user_id=request.user_id, signals=request.signals, feedback=request.feedback
    )
    await profile_agent.persist_persona(user_id=request.user_id, persona=persona, supabase=supabase)
    return PersonaResponse(persona=persona, message="Persona updated")


@router.get("/{user_id}", response_model=PersonaResponse)
async def get_persona(user_id: str) -> PersonaResponse:
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    result = supabase.table("personas").select("*").eq("user_id", user_id).execute()
    records = result.data or []
    if not records:
        raise HTTPException(status_code=404, detail="Persona not found")
    return PersonaResponse(persona=records[0], message="Persona fetched")

