from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import re
from typing import List, Dict

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# In-memory storage (replace with database for production)
mood_data: List[Dict] = []
chat_conversations: List[Dict] = []

# Mental health keywords for AI analysis
KEYWORDS = {
    'anxiety': ['anxious', 'worried', 'nervous', 'panic', 'stress', 'overwhelmed'],
    'depression': ['sad', 'depressed', 'hopeless', 'empty', 'tired', 'exhausted'],
    'anger': ['angry', 'frustrated', 'irritated', 'mad', 'furious'],
    'loneliness': ['lonely', 'alone', 'isolated', 'disconnected'],
    'joy': ['happy', 'joyful', 'excited', 'grateful', 'blessed'],
    'fear': ['scared', 'afraid', 'terrified', 'frightened'],
}

CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm']

def analyze_sentiment(text: str) -> str:
    """Analyze sentiment of user message"""
    text_lower = text.lower()
    
    # Check for crisis
    if any(keyword in text_lower for keyword in CRISIS_KEYWORDS):
        return 'crisis'
    
    # Count emotion keywords
    emotions = {}
    for emotion, keywords in KEYWORDS.items():
        count = sum(1 for keyword in keywords if keyword in text_lower)
        if count > 0:
            emotions[emotion] = count
    
    if not emotions:
        return 'neutral'
    
    # Return dominant emotion
    return max(emotions.items(), key=lambda x: x[1])[0]

def generate_ai_response(message: str, history: List[Dict]) -> str:
    """Generate contextual AI response based on message and history"""
    sentiment = analyze_sentiment(message)
    
    # Crisis response
    if sentiment == 'crisis':
        return ("I'm really concerned about what you're sharing. Please reach out to a crisis helpline immediately:\n\n"
                "• National Suicide Prevention Lifeline: 988\n"
                "• Crisis Text Line: Text HOME to 741741\n\n"
                "You don't have to go through this alone. Professional help is available 24/7.")
    
    # Contextual responses based on sentiment
    responses = {
        'anxiety': [
            "I can sense you're feeling anxious. That's completely valid. Would you like to try a grounding exercise? Try the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
            "Anxiety can feel overwhelming. Remember, feelings are temporary. Have you tried deep breathing? Breathe in for 4 counts, hold for 4, exhale for 4.",
            "What you're feeling is real and valid. Sometimes anxiety tries to convince us of worst-case scenarios. What's one small thing you can control right now?"
        ],
        'depression': [
            "I hear you, and I want you to know that what you're feeling matters. Depression can make everything feel heavy. Have you been able to do something small for yourself today?",
            "It's okay to not be okay. Depression is real, and you're brave for acknowledging it. Even small steps count - like getting out of bed or drinking water.",
            "I'm here with you. Depression can make us feel alone, but you're not. Would talking more about what you're experiencing help?"
        ],
        'anger': [
            "I can feel the intensity of what you're experiencing. Anger is a valid emotion - it often tells us something important. What do you think is underneath it?",
            "It's okay to feel angry. Sometimes we need to express it. Have you tried physical release like going for a walk or doing some exercise?",
            "Your feelings are valid. Anger can be protective - what boundary might need attention right now?"
        ],
        'loneliness': [
            "Feeling lonely is so difficult. I want you to know that I'm here, and you're not as alone as it might feel. When did you last connect with someone?",
            "Loneliness is painful. Sometimes reaching out feels hard, but even a small connection can help. Is there someone you could text or call?",
            "I hear you. Feeling isolated is real. Remember, being alone and feeling lonely are different - your feelings are valid either way."
        ],
        'joy': [
            "I'm so glad you're experiencing joy! That's wonderful. What's bringing you happiness right now?",
            "It's beautiful to hear positive feelings from you! Savoring these moments is important. What makes this moment special?",
            "That's fantastic! Joy is precious. How can you hold onto this feeling a bit longer?"
        ],
        'neutral': [
            "I'm here to listen. What's on your mind today?",
            "Thank you for sharing with me. How are you really feeling?",
            "I'm listening. Would you like to explore what you're experiencing more deeply?"
        ]
    }
    
    # Select response based on sentiment
    response_list = responses.get(sentiment, responses['neutral'])
    
    # Use history length to vary responses
    response_index = len(history) % len(response_list)
    return response_list[response_index]

@app.route('/api/mood', methods=['POST'])
def save_mood():
    """Save a mood entry"""
    try:
        data = request.json
        
        if not data or 'mood' not in data:
            return jsonify({'error': 'Mood is required'}), 400
        
        mood_entry = {
            'id': len(mood_data) + 1,
            'mood': data['mood'],
            'note': data.get('note', ''),
            'timestamp': datetime.now().isoformat()
        }
        
        mood_data.append(mood_entry)
        print(f"[Backend] Saved mood: {mood_entry['mood']}")
        
        return jsonify(mood_entry), 201
    
    except Exception as e:
        print(f"[Backend] Error saving mood: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/mood/history', methods=['GET'])
def get_mood_history():
    """Get mood history for charts"""
    try:
        # Return last 30 days of data
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        filtered_data = [
            entry for entry in mood_data
            if datetime.fromisoformat(entry['timestamp']) >= thirty_days_ago
        ]
        
        print(f"[Backend] Returning {len(filtered_data)} mood entries")
        return jsonify(filtered_data)
    
    except Exception as e:
        print(f"[Backend] Error fetching history: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/mood/recent', methods=['GET'])
def get_recent_moods():
    """Get recent mood entries"""
    try:
        recent = mood_data[-5:] if len(mood_data) >= 5 else mood_data
        recent.reverse()  # Most recent first
        
        print(f"[Backend] Returning {len(recent)} recent entries")
        return jsonify(recent)
    
    except Exception as e:
        print(f"[Backend] Error fetching recent moods: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/wellness/score', methods=['GET'])
def get_wellness_score():
    """Calculate wellness score based on recent moods"""
    try:
        if not mood_data:
            return jsonify({'score': 50, 'trend': 'stable', 'message': 'Start tracking to see your score'})
        
        # Mood values for scoring
        mood_values = {
            'great': 5,
            'good': 4,
            'okay': 3,
            'bad': 2,
            'terrible': 1
        }
        
        # Get last 7 days of data
        seven_days_ago = datetime.now() - timedelta(days=7)
        recent_moods = [
            entry for entry in mood_data
            if datetime.fromisoformat(entry['timestamp']) >= seven_days_ago
        ]
        
        if not recent_moods:
            recent_moods = mood_data[-7:] if len(mood_data) >= 7 else mood_data
        
        # Calculate average score
        avg_score = sum(mood_values.get(m['mood'], 3) for m in recent_moods) / len(recent_moods)
        score = int((avg_score / 5) * 100)
        
        # Determine trend
        if len(recent_moods) >= 3:
            first_half = recent_moods[:len(recent_moods)//2]
            second_half = recent_moods[len(recent_moods)//2:]
            
            first_avg = sum(mood_values.get(m['mood'], 3) for m in first_half) / len(first_half)
            second_avg = sum(mood_values.get(m['mood'], 3) for m in second_half) / len(second_half)
            
            if second_avg > first_avg + 0.5:
                trend = 'improving'
            elif second_avg < first_avg - 0.5:
                trend = 'declining'
            else:
                trend = 'stable'
        else:
            trend = 'stable'
        
        # Generate message
        if score >= 80:
            message = 'Excellent! Keep up the great work!'
        elif score >= 60:
            message = 'You\'re doing well. Keep taking care of yourself.'
        elif score >= 40:
            message = 'Things are okay. Remember to practice self-care.'
        else:
            message = 'It\'s been tough. Consider reaching out for support.'
        
        result = {
            'score': score,
            'trend': trend,
            'message': message
        }
        
        print(f"[Backend] Wellness score: {score}, trend: {trend}")
        return jsonify(result)
    
    except Exception as e:
        print(f"[Backend] Error calculating wellness score: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages with AI analysis"""
    try:
        data = request.json
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        history = data.get('history', [])
        
        # Generate AI response
        ai_response = generate_ai_response(user_message, history)
        
        # Create response object
        response = {
            'role': 'assistant',
            'content': ai_response,
            'timestamp': datetime.now().isoformat()
        }
        
        # Store conversation
        chat_conversations.append({
            'user': user_message,
            'assistant': ai_response,
            'timestamp': datetime.now().isoformat()
        })
        
        print(f"[Backend] Chat response generated for message: {user_message[:50]}...")
        return jsonify(response)
    
    except Exception as e:
        print(f"[Backend] Error in chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'mood_entries': len(mood_data),
        'chat_conversations': len(chat_conversations)
    })

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'MindEcho Backend API',
        'version': '1.0.0',
        'endpoints': {
            'POST /api/mood': 'Save mood entry',
            'GET /api/mood/history': 'Get mood history',
            'GET /api/mood/recent': 'Get recent moods',
            'GET /api/wellness/score': 'Get wellness score',
            'POST /api/chat': 'Chat with AI assistant',
            'GET /api/health': 'Health check'
        }
    })

if __name__ == '__main__':
    print("=" * 50)
    print("MindEcho Backend Server Starting...")
    print("=" * 50)
    print("Server running on: http://localhost:8000")
    print("Health check: http://localhost:8000/api/health")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=8000, debug=True)
