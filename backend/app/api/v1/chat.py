# backend/app/api/v1/chat.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from app.services.ml_orchestrator import call_ml_orchestrator
from app.db.mongodb import chat_collection
import datetime
import uuid

router = APIRouter()

class TextChatReq(BaseModel):
    user_id: Optional[str]
    text: str

class ChatResp(BaseModel):
    id: str
    user_id: Optional[str]
    emotion: str
    confidence: float
    reply: str
    timestamp: datetime.datetime

@router.post("/text", response_model=ChatResp)
async def post_text(req: TextChatReq):
    # 1) call ML orchestrator
    payload = {"text": req.text}
    try:
        data = await call_ml_orchestrator(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML orchestrator error: {e}")

    # 2) Save chat to Mongo (store text, result, timestamp)
    doc = {
        "chat_id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "text": req.text,
        "result": data,
        "timestamp": datetime.datetime.utcnow()
    }
    await chat_collection.insert_one(doc)

    # 3) Return response
    return ChatResp(
        id=doc["chat_id"],
        user_id=req.user_id,
        emotion=data.get("emotion", "neutral"),
        confidence=float(data.get("confidence", 0.0)),
        reply=data.get("reply", ""),
        timestamp=doc["timestamp"]
    )
