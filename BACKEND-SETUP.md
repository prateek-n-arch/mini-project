# Backend Setup Instructions

## Quick Start

### 1. Install Python Dependencies

\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

### 2. Run the Backend

\`\`\`bash
python backend-app.py
\`\`\`

The server will start on `http://localhost:8000`

### 3. Test the Backend

Open another terminal and test:

\`\`\`bash
# Health check
curl http://localhost:8000/api/health

# Save a mood
curl -X POST http://localhost:8000/api/mood \
  -H "Content-Type: application/json" \
  -d '{"mood":"great","note":"Feeling awesome today!"}'

# Get mood history
curl http://localhost:8000/api/mood/history

# Test chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I am feeling anxious about work"}'
\`\`\`

## API Endpoints

### Mood Tracking
- **POST** `/api/mood` - Save mood entry
- **GET** `/api/mood/history` - Get mood history (last 30 days)
- **GET** `/api/mood/recent` - Get 5 most recent moods

### Wellness
- **GET** `/api/wellness/score` - Calculate wellness score and trend

### Chat
- **POST** `/api/chat` - Send message to AI assistant

### System
- **GET** `/api/health` - Health check
- **GET** `/` - API documentation

## Features

✅ **Smart AI Responses** - Analyzes sentiment and provides contextual support
✅ **Crisis Detection** - Identifies crisis keywords and provides helpline info
✅ **Wellness Scoring** - Calculates trend based on mood history
✅ **CORS Enabled** - Ready to connect with Next.js frontend
✅ **Error Handling** - Comprehensive error messages and logging

## Environment Variables (Optional)

Create `.env` file:

\`\`\`
FLASK_ENV=development
PORT=8000
\`\`\`

## Production Deployment

For production, consider:
1. Using a proper database (PostgreSQL, MongoDB)
2. Adding authentication
3. Using Gunicorn instead of Flask dev server
4. Setting up HTTPS
5. Adding rate limiting

\`\`\`bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 backend-app:app
\`\`\`

## Troubleshooting

**Port already in use:**
\`\`\`bash
# Change port in backend-app.py
app.run(host='0.0.0.0', port=8001, debug=True)
\`\`\`

**CORS errors:**
- Ensure flask-cors is installed
- Check CORS(app) is called in the code

**Module not found:**
\`\`\`bash
pip install -r requirements.txt
