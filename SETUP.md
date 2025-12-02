# MindEcho - Setup Guide

## Frontend Setup

The frontend is built with Next.js and is ready to run.

### Install and Run

\`\`\`bash
npm install
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file if you want to change the backend URL:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

## Backend Setup

The backend needs to run on `http://localhost:8000` for the frontend to connect properly.

### Required API Endpoints

Your Python backend needs to implement these endpoints:

1. **POST /api/mood** - Save mood entries
   - Request: `{mood, intensity, note, timestamp}`
   - Response: The saved mood with an ID

2. **GET /api/mood/history?days=30** - Get mood history for charts
   - Response: Array of `{date, score}` objects

3. **GET /api/mood/recent?limit=5** - Get recent mood entries
   - Response: Array of mood entries

4. **GET /api/wellness/score** - Calculate wellness score
   - Response: `{score, trend, insights}`

5. **POST /api/chat** - Handle AI chat messages
   - Request: `{message, history}`
   - Response: `{role, content, timestamp}`

6. **GET /health** - Health check
   - Response: `{status: "healthy"}`

### Quick Start with FastAPI

See `backend-reference.py` for a complete reference implementation.

\`\`\`bash
# Install FastAPI and dependencies
pip install fastapi uvicorn

# Run the backend
python backend-reference.py
\`\`\`

The backend will be available at `http://localhost:8000`

### Database Integration

You'll need to add a database (SQLite, PostgreSQL, etc.) to persist mood entries. The frontend will automatically refresh data when new moods are logged.

### AI Chat Integration

For the chat feature, integrate with your ML model or use an AI service like OpenAI's API.

## Testing the Connection

1. Start the backend on port 8000
2. Start the frontend on port 3000
3. Visit `http://localhost:3000`
4. Try logging a mood - you should see a success message
5. Check the dashboard to see the mood appear in recent entries

If you see connection errors, ensure:
- Backend is running on port 8000
- CORS is enabled in your backend
- No firewall is blocking the connection
