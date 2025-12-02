# backend/app/api/v1/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid

router = APIRouter()

class AuthResponse(BaseModel):
    user_id: str
    anonymous: bool
    token: str

@router.post("/anonymous", response_model=AuthResponse)
def anonymous():
    user_id = str(uuid.uuid4())
    # In prod: create DB record
    token = f"anon-{user_id}"
    return AuthResponse(user_id=user_id, anonymous=True, token=token)
