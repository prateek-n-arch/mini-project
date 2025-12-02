# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, chat, mood, mindmap, emergency

def create_app() -> FastAPI:
    app = FastAPI(title="MindEcho Backend", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # change to frontend origin in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    api = app
    api.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    api.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
    api.include_router(mood.router, prefix="/api/v1/mood", tags=["mood"])
    api.include_router(mindmap.router, prefix="/api/v1/mindmap", tags=["mindmap"])
    api.include_router(emergency.router, prefix="/api/v1/emergency", tags=["emergency"])
    return api

app = create_app()
