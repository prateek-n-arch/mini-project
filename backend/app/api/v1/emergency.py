# backend/app/api/v1/emergency.py
from fastapi import APIRouter
router = APIRouter()

@router.get("/helplines")
def helplines():
    return [
        {"label": "National Helpline (India)", "number": "9152987821"},
        {"label": "Suicide Prevention", "number": "08046110007"},
    ]
