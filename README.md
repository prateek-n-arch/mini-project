# MindEcho - Mental Wellness Web App

A beautiful, modern web interface for your mental wellness application built with Next.js 16.

## Features

- **Mood Tracking**: Log your daily emotions with an intuitive interface
- **AI Companion**: Chat with an empathetic AI for emotional support
- **Wellness Dashboard**: Visualize your mental health journey with charts and insights
- **Beautiful Design**: Calming, supportive UI that promotes wellbeing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Python backend running on port 8000

### Installation

1. The frontend is already set up and running in v0!

2. Start your Python backend on port 8000 with these endpoints:
   - `POST /api/mood` - Log a mood entry
   - `GET /api/mood/history` - Get mood history for charts
   - `GET /api/mood/recent` - Get recent mood entries
   - `GET /api/wellness/score` - Get wellness score
   - `POST /api/chat` - AI chat endpoint

### Backend API Structure

Your Python backend should have these endpoints:

\`\`\`python
# Example FastAPI structure
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/mood")
async def log_mood(mood_data: dict):
    # Save mood to database
    return {"success": True}

@app.get("/api/mood/history")
async def get_mood_history():
    # Return mood history for charts
    return [{"date": "2024-01-01", "score": 4}]

@app.post("/api/chat")
async def chat(message: dict):
    # Process with AI and return response
    return {"response": "AI response here"}
\`\`\`

## Local Development

1. **Frontend**: Already running in v0 preview
2. **Backend**: Run your Python backend:
   \`\`\`bash
   cd backend
   python main.py  # or uvicorn main:app --reload
   \`\`\`

The frontend will connect to `http://localhost:8000` for all API calls.

## Deployment

You can deploy this to Vercel directly from v0:
1. Click the "Publish" button
2. Update the API URLs to point to your deployed backend
3. Configure environment variables if needed

## Tech Stack

- Next.js 16 with App Router
- React 19
- Tailwind CSS v4
- Recharts for data visualization
- shadcn/ui components
