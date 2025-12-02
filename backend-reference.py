# Backend API Reference for MindEcho
# This file shows the expected API endpoints and response formats
# Place this in your backend folder and implement with FastAPI or Flask

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class MoodEntry(BaseModel):
    id: Optional[str] = None
    mood: str
    intensity: int
    note: Optional[str] = None
    timestamp: str

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class WellnessScore(BaseModel):
    score: int
    trend: str
    insights: List[str]

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Mood endpoints
@app.post("/api/mood")
async def save_mood(mood: MoodEntry):
    """Save a new mood entry"""
    # TODO: Save to database
    # Return the saved mood with an ID
    mood.id = "generated-id"
    return mood

@app.get("/api/mood/history")
async def get_mood_history(days: int = 30):
    """Get mood history for charting"""
    # TODO: Query database for last N days
    # Return array of {date: "Jan 1", score: 4}
    return [
        {"date": "Jan 1", "score": 4},
        {"date": "Jan 2", "score": 3},
        {"date": "Jan 3", "score": 5},
    ]

@app.get("/api/mood/recent")
async def get_recent_moods(limit: int = 5):
    """Get recent mood entries"""
    # TODO: Query database for recent entries
    return []

# Wellness endpoint
@app.get("/api/wellness/score")
async def get_wellness_score():
    """Calculate wellness score based on recent moods"""
    # TODO: Calculate from mood history
    return {
        "score": 75,
        "trend": "up",
        "insights": [
            "You've been consistently positive this week",
            "Your mood variance is stable",
            "Consider continuing your current wellness practices"
        ]
    }

# Chat endpoint
@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Handle AI chat messages"""
    # TODO: Integrate with your ML model or AI service
    # For now, return a simple response
    return {
        "role": "assistant",
        "content": "I understand you're feeling that way. Tell me more about what's on your mind.",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
