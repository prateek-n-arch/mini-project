import { NextResponse } from "next/server"
import { analyzeMentalState } from "@/lib/mental-health-ai"

export const maxDuration = 30

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, history = [], emotionData = null } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get recent mood history
    const moodHistoryRes = await fetch(`${request.url.replace("/api/chat", "/api/mood/recent")}`)
    const recentMoods = moodHistoryRes.ok ? await moodHistoryRes.json() : []

    // Analyze mental state using local AI
    const analysis = analyzeMentalState(message, recentMoods, emotionData)

    // Crisis detection
    if (analysis.sentiment === "crisis") {
      return NextResponse.json({
        role: "assistant" as const,
        content: `I'm really concerned about what you're sharing. Your life matters, and there are people who want to help you right now. Please reach out to a crisis helpline immediately:

**National Suicide Prevention Lifeline:** 988 or 1-800-273-8255
**Crisis Text Line:** Text HOME to 741741
**International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

You don't have to face this alone. Professional support is available 24/7. Please reach out now.`,
        timestamp: new Date().toISOString(),
      })
    }

    // Generate intelligent response using local AI
    const response = generateIntelligentResponse(message, analysis, history, emotionData, recentMoods)

    return NextResponse.json({
      role: "assistant" as const,
      content: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error processing chat message:", error)
    return NextResponse.json(
      {
        role: "assistant" as const,
        content:
          "I apologize, but I'm having trouble responding right now. Please try again in a moment. If you're in crisis, please reach out to a mental health professional or call a crisis helpline immediately.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}

function generateIntelligentResponse(
  message: string,
  analysis: any,
  history: any[],
  emotionData: any,
  recentMoods: any[],
): string {
  const { emotions, sentiment, supportType, concerns, conversationContext } = analysis

  let response = ""

  // 1. Acknowledge multimodal inputs
  if (emotionData?.voice || emotionData?.video) {
    const voiceEmotion = emotionData?.voice?.emotion
    const facialEmotion = emotionData?.video?.dominantEmotion
    const stressLevel = emotionData?.voice?.stress

    if (voiceEmotion && facialEmotion && voiceEmotion !== facialEmotion) {
      response += `I notice something interesting - your voice suggests ${voiceEmotion}, but your expression shows ${facialEmotion}. Sometimes we feel one way internally but show another externally. It's okay to have complex, layered emotions. `
    } else if (voiceEmotion) {
      response += `I can hear ${voiceEmotion} in your voice`
      if (stressLevel === "high" || stressLevel === "elevated") {
        response += `, and I notice some tension there. `
      } else {
        response += `. `
      }
    } else if (facialEmotion) {
      response += `I can see ${facialEmotion} in your expression. `
    }
  }

  // 2. Validate their feelings based on sentiment
  const validationPhrases = {
    negative: [
      "It's completely understandable to feel this way given what you're going through.",
      "What you're feeling is valid, and I'm here to support you through this.",
      "I hear you, and your feelings make sense. Thank you for trusting me with this.",
      "These feelings are real and important. You're not alone in experiencing them.",
    ],
    positive: [
      "I'm genuinely glad to hear there's some brightness in your day.",
      "It's wonderful that you're experiencing these positive feelings. That matters.",
      "That's really great to hear! It's important to recognize and celebrate these moments.",
    ],
    neutral: [
      "Thank you for sharing that with me. I'm here to listen and support you.",
      "I appreciate you opening up about this. Your thoughts and feelings matter.",
    ],
  }

  const validationType = sentiment === "positive" ? "positive" : sentiment === "negative" ? "negative" : "neutral"
  response +=
    validationPhrases[validationType][Math.floor(Math.random() * validationPhrases[validationType].length)] + " "

  // 3. Reference mood trends from history
  if (recentMoods.length >= 3) {
    const moodMap: any = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }
    const recentMoodValues = recentMoods.map((m: any) => moodMap[m.mood] || 3)
    const avgMood = recentMoodValues.reduce((a: number, b: number) => a + b, 0) / recentMoodValues.length

    const lastThree = recentMoodValues.slice(-3)
    const isImproving = lastThree[2] > lastThree[0]
    const isDeclining = lastThree[2] < lastThree[0]

    if (avgMood < 2.5) {
      response += "I've been noticing you've been having a really tough time lately. "
      if (isImproving) {
        response += "Though I do see some slight improvement, which shows your resilience. "
      }
    } else if (avgMood > 3.8) {
      response += "I'm glad to see you've been feeling more positive recently. "
    } else if (isDeclining && avgMood < 3.5) {
      response += "I notice things have been feeling a bit harder lately. "
    }
  }

  // 4. Address specific emotions with evidence-based strategies
  if (emotions.includes("anxious") || emotions.includes("worried") || emotionData?.voice?.stress === "high") {
    response +=
      "\n\nFor anxiety, I'd like to suggest a quick technique: Try the **4-7-8 breathing** - breathe in for 4 counts, hold for 7, exhale slowly for 8. This activates your parasympathetic nervous system and can help calm your mind. "

    if (emotionData?.voice?.stress === "high") {
      response +=
        "I also notice tension in your voice. Try placing one hand on your chest and one on your belly, and focus on making your belly rise with each breath. This shifts you from chest breathing (stress response) to diaphragmatic breathing (relaxation response). "
    }
  } else if (emotions.includes("sad") || emotions.includes("depressed") || emotions.includes("down")) {
    response +=
      "\n\nWhen feeling low, even tiny actions can help. Could you try one small thing today - maybe a 5-minute walk, listening to a song you love, or texting someone you care about? Small steps create momentum. "

    response +=
      "Also, practice self-compassion: speak to yourself like you would to a good friend going through this. What would you tell them? "
  } else if (emotions.includes("angry") || emotions.includes("frustrated")) {
    response +=
      "\n\nAnger is a valid emotion that often masks hurt or frustration. It's okay to feel it. To process it healthily, try: **journaling** to express what's making you angry without filter, **physical activity** like a walk or stretching to release the energy, or **assertive communication** - expressing your needs calmly when you're ready. "
  } else if (emotions.includes("lonely") || emotions.includes("isolated")) {
    response +=
      "\n\nLoneliness is painful, and I want you to know your need for connection is completely human and valid. Even small connections matter: sending a text to someone you trust, joining an online community about something you're interested in, or even just being kind to yourself. Sometimes we need to connect with ourselves first. "
  } else if (emotions.includes("overwhelmed") || emotions.includes("stressed")) {
    response +=
      "\n\nWhen overwhelmed, try this: write down everything on your mind, then pick just ONE thing - the smallest, most manageable one - and focus only on that. You don't have to solve everything today. Break it down, set boundaries where you can, and remember that 'no' is a complete sentence. "
  }

  // 5. Encourage dialogue based on conversation context
  const recentTopics = conversationContext.recentTopics.slice(0, 2)
  if (recentTopics.length > 0) {
    response += `\n\nEarlier you mentioned ${recentTopics.join(" and ")}. `
  }

  const followUpQuestions = [
    "How are you feeling right now as we talk about this?",
    "What would help you feel even a little bit better in this moment?",
    "Is there a specific aspect of this you'd like to explore together?",
    "What's one thing you need most right now - to be heard, to find solutions, or just to know someone cares?",
    "Would you like to talk more about what's on your mind?",
  ]

  response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]

  return response
}
