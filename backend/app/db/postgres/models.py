# backend/app/db/postgres/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base
import datetime
import uuid

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    anonymous = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # relationship example: moods
    moods = relationship("MoodEntry", back_populates="user")

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    emotion = Column(String(64), nullable=False)
    score = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="moods")
