// Mental Health AI Analysis Engine
// Analyzes user messages and mood history to provide personalized support

interface MoodEntry {
  mood: string
  intensity: number
  note?: string
  timestamp: string
}

interface AnalysisResult {
  sentiment: "positive" | "negative" | "neutral" | "crisis"
  emotions: string[]
  concerns: string[]
  supportType: "validation" | "coping" | "encouragement" | "crisis" | "exploration"
}

interface ConversationContext {
  topics: string[]
  emotionalJourney: string[]
  userPreferences: string[]
  sessionLength: number
}

// Sentiment and emotion detection
const SENTIMENT_KEYWORDS = {
  crisis: [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "no reason to live",
    "hurt myself",
    "self harm",
    "better off dead",
    "can't go on",
  ],
  negative: [
    "sad",
    "depressed",
    "anxious",
    "worried",
    "scared",
    "angry",
    "frustrated",
    "overwhelmed",
    "stressed",
    "tired",
    "exhausted",
    "lonely",
    "isolated",
    "hopeless",
    "worthless",
    "failure",
    "can't",
    "struggling",
    "difficult",
    "pain",
    "hurt",
    "crying",
    "awful",
    "terrible",
    "miserable",
    "hate",
  ],
  positive: [
    "happy",
    "good",
    "great",
    "better",
    "improving",
    "grateful",
    "thankful",
    "proud",
    "accomplished",
    "excited",
    "hopeful",
    "optimistic",
    "calm",
    "peaceful",
    "relaxed",
    "content",
    "joy",
    "love",
    "wonderful",
    "amazing",
  ],
}

const EMOTION_PATTERNS = {
  anxiety: ["anxious", "worried", "nervous", "panic", "fear", "scared", "stress"],
  depression: ["sad", "depressed", "empty", "hopeless", "worthless", "numb"],
  anger: ["angry", "frustrated", "furious", "irritated", "mad", "annoyed"],
  loneliness: ["lonely", "isolated", "alone", "abandoned", "disconnected"],
  overwhelm: ["overwhelmed", "too much", "can't handle", "exhausted", "burned out"],
  grief: ["loss", "grieving", "miss", "died", "gone", "mourning"],
}

const COPING_STRATEGIES = {
  anxiety: [
    "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
    "Take a few deep breaths: Breathe in for 4 counts, hold for 4, out for 4. This activates your body's calm response.",
    "Remember: anxiety is temporary. This feeling will pass, and you're safe right now.",
  ],
  depression: [
    "Even small steps count. Can you do one tiny thing today that brings you comfort?",
    "Your feelings are valid, and it's okay to not be okay. Be gentle with yourself.",
    "Consider reaching out to someone you trust, or try a short walk outside. Movement can help shift mood.",
  ],
  anger: [
    "Your anger is valid. Can you identify what's underneath it - hurt, fear, or frustration?",
    "Try taking a pause before responding. Count to 10, take deep breaths, or step away for a moment.",
    "Physical release can help: try a quick workout, punch a pillow, or write out your feelings.",
  ],
  loneliness: [
    "Loneliness is painful, and your need for connection is important. You deserve to feel supported.",
    "Consider reaching out to someone - even a brief message can help. Or join an online community around your interests.",
    "Sometimes being kind to yourself is a form of connection. What would you say to a friend feeling this way?",
  ],
  overwhelm: [
    "When everything feels like too much, focus on just the next small step. What's one thing you can do right now?",
    "It's okay to say no and set boundaries. You don't have to do everything at once.",
    "Try writing down your tasks, then pick just one. Breaking things down makes them manageable.",
  ],
  grief: [
    "Grief is love with nowhere to go. Your feelings honor what you've lost.",
    "There's no timeline for grief. Allow yourself to feel whatever comes up, without judgment.",
    "Consider journaling about memories, or creating a small ritual to honor your loss.",
  ],
}

function buildConversationContext(history: any[]): ConversationContext {
  const context: ConversationContext = {
    topics: [],
    emotionalJourney: [],
    userPreferences: [],
    sessionLength: history.length,
  }

  // Extract topics and emotional journey from conversation history
  history.forEach((msg) => {
    if (msg.role === "user") {
      const lowerContent = msg.content.toLowerCase()

      // Track emotional journey
      if (SENTIMENT_KEYWORDS.negative.some((word) => lowerContent.includes(word))) {
        context.emotionalJourney.push("struggling")
      } else if (SENTIMENT_KEYWORDS.positive.some((word) => lowerContent.includes(word))) {
        context.emotionalJourney.push("improving")
      }

      // Detect topics
      if (lowerContent.includes("work") || lowerContent.includes("job")) {
        if (!context.topics.includes("work")) context.topics.push("work")
      }
      if (lowerContent.includes("family") || lowerContent.includes("parent") || lowerContent.includes("sibling")) {
        if (!context.topics.includes("family")) context.topics.push("family")
      }
      if (
        lowerContent.includes("relationship") ||
        lowerContent.includes("partner") ||
        lowerContent.includes("dating")
      ) {
        if (!context.topics.includes("relationships")) context.topics.push("relationships")
      }
      if (lowerContent.includes("school") || lowerContent.includes("university") || lowerContent.includes("study")) {
        if (!context.topics.includes("education")) context.topics.push("education")
      }
    }
  })

  return context
}

export function analyzeMentalState(
  message: string,
  recentMoods: MoodEntry[] = [],
  emotionData?: { voice?: any; video?: any },
): AnalysisResult {
  const lowerMessage = message.toLowerCase()

  // Extract emotion insights from voice/video analysis if present
  const voiceEmotionInsights: string[] = []
  let videoEmotionInsights: string[] = []

  if (emotionData?.voice) {
    voiceEmotionInsights.push(emotionData.voice.emotion)
    // High intensity voice = possible stress/excitement
    if (emotionData.voice.intensity === "high") {
      voiceEmotionInsights.push("heightened emotional state")
    }
  }

  if (emotionData?.video) {
    videoEmotionInsights = emotionData.video.emotions || []
  }

  // Detect emotions present in the message
  const detectedEmotions: string[] = []
  Object.entries(EMOTION_PATTERNS).forEach(([emotion, keywords]) => {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      detectedEmotions.push(emotion)
    }
  })

  // Analyze sentiment
  const negativeCount = SENTIMENT_KEYWORDS.negative.filter((word) => lowerMessage.includes(word)).length
  const positiveCount = SENTIMENT_KEYWORDS.positive.filter((word) => lowerMessage.includes(word)).length

  let sentiment: AnalysisResult["sentiment"]
  if (negativeCount > positiveCount) {
    sentiment = "negative"
  } else if (positiveCount > negativeCount) {
    sentiment = "positive"
  } else {
    sentiment = "neutral"
  }

  // Analyze mood patterns from history
  const concerns: string[] = []
  if (recentMoods.length >= 3) {
    const avgIntensity = recentMoods.reduce((sum, m) => sum + m.intensity, 0) / recentMoods.length
    const negativeCount = recentMoods.filter((m) => ["sad", "anxious", "angry", "stressed"].includes(m.mood)).length

    if (avgIntensity <= 3 && negativeCount >= 2) {
      concerns.push("persistent low mood")
    }

    // Check for declining pattern
    const isDecreasing = recentMoods.every((mood, i) => i === 0 || mood.intensity <= recentMoods[i - 1].intensity)
    if (isDecreasing && recentMoods[recentMoods.length - 1].intensity < 4) {
      concerns.push("declining mood trend")
    }
  }

  // Determine support type needed
  let supportType: AnalysisResult["supportType"]
  if (lowerMessage.includes("?") && !SENTIMENT_KEYWORDS.crisis.some((keyword) => lowerMessage.includes(keyword))) {
    supportType = "exploration"
  } else if (sentiment === "positive") {
    supportType = "encouragement"
  } else if (detectedEmotions.length > 0) {
    supportType = "coping"
  } else {
    supportType = "validation"
  }

  const combinedEmotions = [...detectedEmotions, ...voiceEmotionInsights, ...videoEmotionInsights].filter(
    (v, i, a) => a.indexOf(v) === i,
  ) // Remove duplicates

  return {
    sentiment,
    emotions: combinedEmotions.length > 0 ? combinedEmotions : detectedEmotions,
    concerns,
    supportType,
  }
}

export function generateResponse(
  message: string,
  analysis: AnalysisResult,
  conversationHistory: any[] = [],
  emotionData?: { voice?: any; video?: any },
): string {
  // Crisis response
  if (analysis.sentiment === "crisis") {
    return `I'm really concerned about what you're sharing. Your life matters, and there are people who want to help you right now. Please reach out to a crisis helpline immediately:

National Suicide Prevention Lifeline: 988 or 1-800-273-8255
Crisis Text Line: Text HOME to 741741

You don't have to face this alone. Professional support is available 24/7.`
  }

  const context = buildConversationContext(conversationHistory)
  const isReturningToTopic = context.topics.some((topic) => message.toLowerCase().includes(topic))
  const hasImproved =
    context.emotionalJourney.length >= 2 &&
    context.emotionalJourney[context.emotionalJourney.length - 1] === "improving" &&
    context.emotionalJourney[context.emotionalJourney.length - 2] === "struggling"

  // Build personalized response based on analysis and context
  let response = ""

  // 1. Context-aware validation/acknowledgment
  if (analysis.sentiment === "negative") {
    const validations = [
      `I hear you, and what you're feeling sounds really difficult.`,
      `Thank you for sharing this with me. It takes courage to open up about these feelings.`,
      `That sounds really tough. Your feelings are completely valid.`,
      `I can sense you're going through a challenging time right now.`,
    ]

    if (isReturningToTopic && context.sessionLength > 3) {
      response += `I remember you mentioned ${context.topics[context.topics.length - 1]} earlier. `
    }

    response += validations[Math.floor(Math.random() * validations.length)] + " "
  } else if (analysis.sentiment === "positive") {
    const celebrations = [
      `That's wonderful to hear! I'm glad things are feeling better.`,
      `It's great that you're experiencing these positive moments.`,
      `I'm so happy to hear that! Celebrating these wins with you.`,
      `That's really encouraging! Thank you for sharing this positive update.`,
    ]

    if (hasImproved) {
      response += `I'm noticing a positive shift from our earlier conversation. `
    }

    response += celebrations[Math.floor(Math.random() * celebrations.length)] + " "
  }

  // 2. Address specific emotions with coping strategies
  if (analysis.emotions.length > 0 && analysis.supportType === "coping") {
    const primaryEmotion = analysis.emotions[0]
    const strategies = COPING_STRATEGIES[primaryEmotion as keyof typeof COPING_STRATEGIES]

    if (strategies) {
      const strategy = strategies[Math.floor(Math.random() * strategies.length)]
      response += strategy + " "
    }
  }

  // 3. Address concerns from mood patterns
  if (analysis.concerns.length > 0) {
    if (analysis.concerns.includes("persistent low mood")) {
      response += `I've noticed you've been struggling for a while. Have you considered talking to a mental health professional? They can provide specialized support. `
    }
    if (analysis.concerns.includes("declining mood trend")) {
      response += `I'm noticing your mood has been declining. It's important to reach out for support when things feel like they're getting harder. `
    }
  }

  // 4. Exploration responses for questions
  if (analysis.supportType === "exploration") {
    const explorations = [
      `That's a thoughtful question. What feels most important to you about this?`,
      `I'd like to understand better. Can you tell me more about what you're experiencing?`,
      `That's worth exploring. How long have you been feeling this way?`,
      `Thank you for asking. What do you think might help you feel better?`,
    ]
    response += explorations[Math.floor(Math.random() * explorations.length)]
  }

  // 5. Encouragement for positive sentiment
  if (analysis.sentiment === "positive" && analysis.supportType === "encouragement") {
    const encouragements = [
      `Keep nurturing these positive moments - they're so important for your wellbeing.`,
      `You're doing great. Remember to acknowledge your progress, no matter how small.`,
      `This is wonderful progress. What helped you get to this positive place?`,
    ]
    response += encouragements[Math.floor(Math.random() * encouragements.length)]
  }

  if (emotionData?.voice || emotionData?.video) {
    const emotionAwareness = []

    if (emotionData.voice) {
      if (emotionData.voice.intensity === "high") {
        emotionAwareness.push(`I can sense a lot of energy in your voice`)
      } else if (emotionData.voice.intensity === "low") {
        emotionAwareness.push(`I notice your voice sounds quiet and gentle`)
      }
    }

    if (emotionData.video) {
      if (emotionData.video.overallMood === "upbeat") {
        emotionAwareness.push(`I can see some brightness in your expression`)
      } else if (emotionData.video.overallMood === "low energy") {
        emotionAwareness.push(`I notice you might be feeling tired or low`)
      }
    }

    if (emotionAwareness.length > 0) {
      response = emotionAwareness.join(", and ") + ". " + response
    }
  }

  // Context-aware gentle closing based on conversation length
  if (!response.includes("?")) {
    let closings: string[]

    if (context.sessionLength < 3) {
      // Early in conversation - broad questions
      closings = [
        `How are you feeling right now?`,
        `Is there anything specific you'd like to talk about?`,
        `What would feel most supportive for you right now?`,
        `I'm here to listen. What's on your mind?`,
      ]
    } else if (context.topics.length > 0) {
      // Mid-conversation - reference topics
      closings = [
        `How is the ${context.topics[0]} situation affecting you today?`,
        `Would you like to talk more about ${context.topics[0]}?`,
        `What's been the hardest part about ${context.topics[0]} lately?`,
        `Is there anything else about ${context.topics[0]} you'd like to explore?`,
      ]
    } else {
      // Later conversation - deeper questions
      closings = [
        `What do you need most right now?`,
        `How can I best support you in this moment?`,
        `What would make today feel a little bit better?`,
        `Is there something specific that's weighing on you?`,
      ]
    }

    response += " " + closings[Math.floor(Math.random() * closings.length)]
  }

  return response.trim()
}
