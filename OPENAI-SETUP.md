# OpenAI Integration for Mental Health Analysis

Your MindEcho app now uses **OpenAI GPT-4** for advanced emotion analysis and mental health support!

## What's Integrated

### 1. Facial Emotion Analysis (GPT-4 Vision)
- Analyzes facial expressions, body language, and environmental context
- Detects subtle emotional cues
- Provides detailed mental state assessment

### 2. Voice Emotion Analysis (GPT-4)
- Interprets voice characteristics (amplitude, peaks, energy)
- Detects stress levels and emotional tone
- Provides deeper emotional analysis

### 3. Conversational AI (GPT-4)
- Trained as a mental health companion
- Uses evidence-based therapeutic approaches (CBT, DBT, mindfulness)
- Provides personalized coping strategies
- Remembers conversation context and mood history
- Multimodal awareness (combines text, voice, and facial data)

## Setup Instructions

### Option 1: Using Vercel AI Gateway (Recommended)

The app is already configured to use the Vercel AI Gateway which provides access to OpenAI models.

**You need to add a payment method:**
1. Go to your Vercel dashboard
2. Navigate to Settings → Billing
3. Add a credit card
4. The AI Gateway will automatically work

**Pricing:**
- Very affordable for personal use
- Only pay for what you use
- GPT-4o-mini is cost-effective (~$0.15 per 1M input tokens)

### Option 2: Direct OpenAI API Key

If you prefer to use OpenAI directly:

1. Get an API key from [platform.openai.com](https://platform.openai.com/)
2. Add to your environment variables:
   \`\`\`
   OPENAI_API_KEY=sk-...your-key...
   \`\`\`
3. Update the code to use direct OpenAI client

## Features

### Multimodal Analysis
The AI now combines:
- **Text content** - What the user says
- **Voice tone** - How they say it (energy, stress)
- **Facial expressions** - What their face shows
- **Mood history** - Recent mood patterns

### Smart Fallback System
If OpenAI is unavailable (no payment, API error, etc.):
- Automatically falls back to rule-based analysis
- App continues working
- Users get helpful responses

### Crisis Detection
- Local analysis always runs first for immediate crisis detection
- If suicidal ideation or self-harm is detected, immediate crisis resources are provided
- OpenAI is not used for crisis situations to ensure instant response

## Benefits

### Before (Rule-Based):
- Generic pattern matching
- Limited emotional understanding
- Repetitive responses

### After (OpenAI-Powered):
- Deep emotional understanding
- Personalized, context-aware responses
- Natural, empathetic conversation
- Accurate emotion detection from faces and voice
- Evidence-based coping strategies

## Testing Without OpenAI

The app works perfectly without OpenAI! It just uses:
- Local emotion analysis algorithms
- Rule-based response generation
- Pattern matching for emotions

Add OpenAI when you're ready to enhance the experience.

## Privacy & Ethics

- All emotion analysis happens securely
- No data is stored by OpenAI (as per their API policy)
- Images and audio are analyzed in real-time only
- Your mood data stays in your app
- Crisis detection happens locally first

## Cost Estimates

For typical usage:
- **Personal use:** $1-5/month
- **10-20 conversations/day:** ~$0.50/day
- **Voice analysis:** ~$0.02 per recording
- **Image analysis:** ~$0.01 per photo

Very affordable for the significant improvement in quality!
