from fastapi import FastAPI
from .routes import health, persona


def create_app() -> FastAPI:
    app = FastAPI(
        title="Hackathon Persona Agents",
        version="0.1.0",
        description="AI persona learning platform powered by Gemini 3.0 Pro Preview.",
    )
    app.include_router(health.router)
    app.include_router(persona.router, prefix="/persona", tags=["persona"])
    return app


app = create_app()

