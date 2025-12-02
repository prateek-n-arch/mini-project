# backend/app/api/v1/mindmap.py
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/generate")
def generate():
    # In production: aggregate mood entries, compute sentiment timeline
    # Demo returns a simple structure
    return {"timeline": [{"date": "2025-01-01", "score": 6}, {"date":"2025-01-02","score":5}]}
