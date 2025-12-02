# ml/orchestrator/service.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import random

app = FastAPI(title="MindEcho ML Orchestrator")

class InferReq(BaseModel):
    text: Optional[str] = None
    audio: Optional[dict] = None
    image: Optional[dict] = None

@app.post("/infer")
def infer(req: InferReq):
    # Simple mock logic:
    # - if text contains "sad" -> emotion sad
    text = (req.text or "").lower()
    if "sad" in text:
        emotion = "sad"
        conf = 0.85
        reply = "I'm sorry you're feeling sad. Try a breathing exercise."
    elif "happy" in text:
        emotion = "happy"
        conf = 0.88
        reply = "Great to hear! Keep it up."
    else:
        # random neutral-ish result
        emotion = random.choice(["neutral", "calm", "anxious"])
        conf = round(random.uniform(0.5, 0.8), 2)
        reply = "Thanks for sharing. Tell me more."

    return {"emotion": emotion, "confidence": conf, "reply": reply}
