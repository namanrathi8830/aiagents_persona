# Hackathon Agents Platform

A dual-stack project for persona learning agents with a FastAPI backend and a React (Vite + TypeScript) frontend. The system uses Gemini 3.0 Pro Preview for AI reasoning and Supabase for auth/storage.

## Stack
- Frontend: React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Shadcn-style UI primitives, React Query, Zustand.
- Backend: FastAPI, Pydantic, Supabase Python client, Google Gemini 3.0 Pro Preview.
- Database/Services: Supabase (PostgreSQL, Auth, Storage, Realtime).

## Quickstart
1) Environment
- Copy `.env.example` to `.env` and fill values (Supabase + Gemini).
- Optional: create `frontend/.env` for Vite runtime keys if exposing anon public Supabase key.

2) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features (planned/initial)
- 10+ learning methods: email/message, calendar, documents, social profiles, decision history, tasks, response times, sentiment, topic interest, custom feedback loop.
- Modular agents (`conversation`, `activity`, `profile`, `synthesis`, `learning_engine`) with Gemini-assisted summarization.
- Supabase persistence for personas and learning signals.
- Matte black/white UI with smooth micro-interactions.

## Notes
- The Gemini client is configured for `gemini-1.5-pro-002` (Gemini 3.0 Pro Preview naming). Update the model id if Google changes the public preview name.
- Keep secrets out of git; only commit `.env.example`.

