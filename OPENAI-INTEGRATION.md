# OpenAI Integration for Mental Health Analysis

## Overview

MindEcho now uses OpenAI's GPT-4o-mini model for advanced emotion analysis and personalized mental health support. The AI analyzes multimodal inputs (text, voice, facial expressions) to provide empathetic, context-aware responses.

## Features

### 1. Multimodal Emotion Analysis
- **Text Analysis**: Sentiment detection, emotion keywords, crisis indicators
- **Voice Analysis**: Tone, energy level, stress detection, vocal patterns
- **Facial Analysis**: Expression recognition, emotional state, incongruence detection

### 2. Personalized Support
- Context-aware responses based on conversation history
- References to mood patterns and previous discussions
- Tailored coping strategies for specific emotions (anxiety, depression, anger, etc.)

### 3. Crisis Detection
- Immediate intervention for crisis keywords
- Cross-modal validation (if voice + facial + text all indicate distress)
- Direct crisis resource information

### 4. Intelligent Response Generation
The AI provides:
- **Validation**: Acknowledges and validates user feelings
- **Coping Strategies**: Evidence-based techniques for managing emotions
- **Exploration**: Open-ended questions to help users process feelings
- **Encouragement**: Positive reinforcement for progress
- **Recommendations**: Suggests professional help when appropriate

## How It Works

\`\`\`typescript
// 1. User sends message with optional emotion data
{
  message: "I'm feeling really anxious today",
  emotionData: {
    voice: { emotion: "anxious", energy: "high", stress: "high" },
    video: { dominantEmotion: "worried", confidence: 75 }
  }
}

// 2. System analyzes multimodal inputs
const analysis = analyzeMentalState(message, moodHistory, emotionData)

// 3. OpenAI generates personalized response
const response = await generateText({
  model: "openai/gpt-4o-mini",
  messages: [systemPrompt, ...history, userMessage]
})

// 4. Response includes:
// - Acknowledgment of detected emotions
// - Specific coping strategies
// - Follow-up questions
// - Progress tracking
\`\`\`

## Example Interactions

### Example 1: Anxiety with Voice Analysis
**User** (with shaky voice): "I have a big presentation tomorrow and I can't stop worrying"

**Voice Analysis**: High stress, anxious tone, fast speech

**MindEcho**: "I can hear the anxiety in your voice, and it's completely understandable to feel nervous before a big presentation. Try this: breathe in for 4 counts, hold for 4, out for 4. This activates your body's calm response. What part of the presentation worries you most?"

### Example 2: Depression with Facial Analysis
**User** (with sad expression): "I'm fine, everything is okay"

**Facial Analysis**: Sad expression, low energy, possible masking

**MindEcho**: "I'm noticing your expression looks quite sad, even though you're saying you're fine. It's okay to not be okay - you don't have to put on a brave face with me. What's really going on beneath the surface?"

### Example 3: Progress Recognition
**User**: "I actually went for a walk today"

**Context**: Previous history showed declining mood, today showing improvement

**MindEcho**: "That's wonderful! I remember you mentioned feeling too exhausted to move earlier this week. Taking that walk is real progress - celebrating this win with you. How did it feel to get outside?"

## Benefits of OpenAI Integration

1. **Natural Conversations**: More fluid, human-like responses
2. **Context Memory**: Remembers details from earlier in the conversation
3. **Nuanced Understanding**: Picks up on subtle emotional cues
4. **Adaptive Support**: Adjusts approach based on user's state
5. **Evidence-Based**: Incorporates therapeutic techniques (CBT, mindfulness, validation)

## Privacy & Safety

- No user data is stored by OpenAI (ephemeral API calls)
- Crisis detection happens locally before reaching OpenAI
- All emotion analysis is processed in real-time
- Conversation history limited to recent messages for privacy

## Model Selection

**GPT-4o-mini** is used because:
- Fast response times (important for chat)
- Cost-effective for high-volume usage
- Excellent at empathetic, conversational responses
- Strong emotion understanding capabilities

## Future Enhancements

- [ ] Fine-tuning on mental health conversation datasets
- [ ] Integration with real-time therapy techniques
- [ ] Mood pattern prediction
- [ ] Personalized coping strategy recommendations
- [ ] Integration with wearable devices for physiological data
