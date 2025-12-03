import { NextResponse } from "next/server"
import { analyzeMultimodalEmotion } from "@/lib/emotion-model"

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

    const analysis = await analyzeMultimodalEmotion(message, emotionData?.audioBuffer, emotionData?.imageData)

    console.log("[v0] Trained model analysis:", analysis)

    // Crisis detection from model
    if (
      analysis.mentalHealthIndicators.depression > 85 ||
      analysis.mentalHealthIndicators.anxiety > 90 ||
      message.toLowerCase().includes("suicide") ||
      message.toLowerCase().includes("kill myself")
    ) {
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

    // Get recent mood history
    const moodHistoryRes = await fetch(`${request.url.replace("/api/chat", "/api/mood/recent")}`)
    const recentMoods = moodHistoryRes.ok ? await moodHistoryRes.json() : []

    // Generate response using model's emotion analysis
    const response = generateIntelligentResponse(message, analysis, history, recentMoods)

    return NextResponse.json({
      role: "assistant" as const,
      content: response,
      timestamp: new Date().toISOString(),
      emotionAnalysis: {
        emotion: analysis.fusedEmotion.emotion,
        confidence: analysis.fusedEmotion.confidence,
        mentalHealth: analysis.mentalHealthIndicators,
      },
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

function generateIntelligentResponse(message: string, analysis: any, history: any[], recentMoods: any[]): string {
  const { fusedEmotion, mentalHealthIndicators, voiceEmotion, visualEmotion } = analysis

  let response = ""
  const detectedEmotion = fusedEmotion.emotion
  const intensity = fusedEmotion.intensity

  if (voiceEmotion && visualEmotion) {
    if (voiceEmotion.emotion !== visualEmotion.emotion) {
      response += `I notice your voice suggests ${voiceEmotion.emotion} while your expression shows ${visualEmotion.emotion}. Sometimes our feelings are layered. `
    }
  } else if (voiceEmotion) {
    response += `I can hear ${voiceEmotion.emotion} in your voice. `
  } else if (visualEmotion) {
    response += `I can see ${visualEmotion.emotion} in your expression. `
  }

  // Emotion-specific empathetic responses
  const emotionResponses: Record<string, string[]> = {
    happy: [
      "I'm so glad to hear you're feeling happy! These positive moments deserve to be celebrated.",
      "That's wonderful! Your joy is evident, and it's beautiful to witness.",
      "I love hearing this happiness in your words! What's bringing you such joy?",
    ],
    sad: [
      "I hear your sadness, and I want you to know that what you're feeling matters. You're not alone.",
      "I'm sorry you're going through this difficult time. Your feelings are completely valid.",
      "Thank you for trusting me with your pain. I'm here to listen and support you.",
    ],
    angry: [
      "I hear your anger. Often anger tells us something important to us has been violated or hurt.",
      "Your frustration is completely understandable. Let's explore what's underneath this feeling.",
      "It's okay to feel angry - that emotion is giving us important information about your needs.",
    ],
    fear: [
      "I sense your fear, and that takes courage to share. Fear is often our mind trying to protect us.",
      "What you're describing sounds frightening. You don't have to face this fear alone.",
    ],
    anxiety: [
      "I can sense the anxiety you're experiencing. That racing, worried feeling is incredibly hard to sit with.",
      "Anxiety can feel so overwhelming. Let's work through this together, one breath at a time.",
      "I understand how unsettling anxious thoughts can be. Your nervous system is on high alert right now.",
    ],
    stress: [
      "It sounds like you're under immense pressure right now. That overwhelmed feeling is your signal that you're carrying too much.",
      "Stress can feel crushing. Let's see if we can break things down into smaller pieces.",
      "I hear how overwhelmed you are. You don't have to solve everything at once.",
    ],
    hopeless: [
      "What you're describing sounds like hopelessness, and I want you to know these feelings, while painful, are real.",
      "I'm concerned about how defeated you're feeling. You don't have to face this darkness alone.",
      "Hopelessness is one of the hardest emotions to sit with. Have you considered talking to a mental health professional?",
    ],
    lonely: [
      "Loneliness can feel so isolating. I want you to know that you matter, even when you feel alone.",
      "I hear how disconnected you're feeling. That isolation is real and valid.",
    ],
    overwhelmed: [
      "Being overwhelmed means you're trying to handle too much at once. Let's identify what you can let go of.",
      "That drowning feeling is your signal to pause and breathe. You don't have to do it all.",
    ],
    tired: [
      "Exhaustion is your body and mind asking for rest. Have you been able to give yourself that?",
      "Fatigue is real. Sometimes the most productive thing we can do is rest.",
    ],
    excited: [
      "I can feel your excitement! That energized feeling is wonderful!",
      "Your enthusiasm is contagious! Tell me more about what's got you so excited!",
    ],
    calm: [
      "It's beautiful to hear you're feeling peaceful. These moments of calm are so valuable.",
      "I'm glad you're in a centered place right now. Let's honor this feeling.",
    ],
    motivated: [
      "Your determination is inspiring! That drive and focus will serve you well.",
      "I love hearing how motivated you are. What goal are you working toward?",
    ],
    neutral: [
      "I'm here to listen. What's really on your mind today?",
      "Thanks for sharing with me. How are you truly feeling?",
    ],
    confusion: [
      "Confusion can feel frustrating. Let's work through this together to find clarity.",
      "It's okay not to have all the answers right now. What specifically feels unclear?",
    ],
    disgust: [
      "That feeling of disgust is strong. What triggered this reaction?",
      "I hear your revulsion. Sometimes disgust protects us from harmful situations.",
    ],
    surprise: [
      "That sounds unexpected! How are you processing this surprise?",
      "Surprise can throw us off balance. What happened?",
    ],
  }

  const responses = emotionResponses[detectedEmotion] || emotionResponses.neutral
  response += responses[Math.floor(Math.random() * responses.length)] + "\n\n"

  if (intensity > 80) {
    response +=
      "I can sense the intensity of what you're feeling right now. These strong emotions need space and acknowledgment.\n\n"
  }

  if (mentalHealthIndicators.stress > 70) {
    response +=
      "**For Stress Relief:** Try this 2-minute break: Close your eyes, take 5 deep breaths, and tense then release each muscle group from your toes up to your head.\n\n"
  }

  if (mentalHealthIndicators.anxiety > 70) {
    response +=
      "**For Anxiety:** Try box breathing right now: Breathe in for 4 counts, hold 4, out 4, hold 4. Repeat 4 times. This calms your nervous system.\n\n"
  }

  if (mentalHealthIndicators.depression > 65) {
    response +=
      "**Important:** The feelings you're describing suggest depression. Please consider reaching out to a mental health professional. You deserve support, and help is available.\n\n"
  }

  const copingStrategies: Record<string, string> = {
    anxiety:
      "**Try this:** The 5-4-3-2-1 grounding technique - Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
    sad: "**Gentle reminder:** Be compassionate with yourself. Do one tiny act of self-care today, even if it's just drinking water or stepping outside for 60 seconds.",
    stress:
      "**Strategy:** Make a brain dump list of everything on your mind. Then circle only the top 3 priorities. Everything else can wait.",
    angry:
      "**Release:** Physical movement helps - go for a brisk walk, do jumping jacks, or punch a pillow to move the energy through your body.",
    hopeless:
      "**Truth:** Depression lies. The thought 'nothing will help' is the illness talking, not reality. Please reach out to a therapist.",
    overwhelmed:
      "**Action:** Pick just ONE thing you can control right now. Focus only on that. You don't need to solve everything today.",
    lonely:
      "**Connection:** Reach out to one person today, even just a text saying 'thinking of you.' Small connections matter.",
    tired: "**Rest:** Your body is asking for recovery. Can you give yourself permission to rest without guilt?",
  }

  if (copingStrategies[detectedEmotion]) {
    response += copingStrategies[detectedEmotion] + "\n\n"
  }

  const followUps: Record<string, string> = {
    happy: "What's contributing most to these good feelings?",
    sad: "What do you need most right now - to be heard, to problem-solve, or just to know someone cares?",
    anxiety: "What specifically are you most worried about right now?",
    angry: "What boundary was crossed or what need wasn't met?",
    stress: "If you could take one thing off your plate, what would it be?",
    hopeless: "How long have you been feeling this way? Have you talked to anyone else about this?",
    lonely: "When do you feel most connected to others? What makes that different?",
    overwhelmed: "What's taking up the most mental space for you right now?",
    tired: "Are you getting enough sleep and taking care of your basic needs?",
    excited: "Tell me more! What are you looking forward to?",
    calm: "What's different about today that's making you feel more at peace?",
    motivated: "What goal are you working toward? How can I support you?",
    neutral: "What's really on your mind today?",
  }

  response += followUps[detectedEmotion] || "How can I best support you right now?"

  return response.trim()
}
