# backend/app/api/v1/mood.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
import datetime, uuid
from app.db.postgres import SessionLocal
from app.db.postgres.models import MoodEntry as MoodModel, User as UserModel

router = APIRouter()

class MoodAddReq(BaseModel):
    user_id: Optional[str] = None
    emotion: str
    score: int
    note: Optional[str] = None

class MoodEntryResp(BaseModel):
    id: str
    user_id: Optional[str]
    emotion: str
    score: int
    note: Optional[str]
    timestamp: datetime.datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add", response_model=MoodEntryResp)
def add_mood(req: MoodAddReq, db=Depends(get_db)):
    # create user if user_id not present or not found (anonymous-first)
    user = None
    if req.user_id:
        user = db.query(UserModel).filter(UserModel.id == req.user_id).first()
    if user is None:
        # create an anonymous user
        user = UserModel()
        db.add(user)
        db.commit()
        db.refresh(user)

    entry = MoodModel(user_id=user.id, emotion=req.emotion, score=req.score, note=req.note)
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return MoodEntryResp(
        id=entry.id,
        user_id=entry.user_id,
        emotion=entry.emotion,
        score=entry.score,
        note=entry.note,
        timestamp=entry.timestamp
    )

@router.get("/timeline", response_model=List[MoodEntryResp])
def timeline(db=Depends(get_db)):
    rows = db.query(MoodModel).order_by(MoodModel.timestamp.desc()).limit(30).all()
    return [
        MoodEntryResp(
            id=r.id,
            user_id=r.user_id,
            emotion=r.emotion,
            score=r.score,
            note=r.note,
            timestamp=r.timestamp
        ) for r in rows
    ]
