import { NextResponse } from "next/server"
import { analyzeMentalState, generateResponse } from "@/lib/mental-health-ai"

export const maxDuration = 30

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, history = [] } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const moodHistoryRes = await fetch(`${request.url.replace("/api/chat", "/api/mood/recent")}`)
    const recentMoods = moodHistoryRes.ok ? await moodHistoryRes.json() : []

    const analysis = analyzeMentalState(message, recentMoods)

    const responseText = generateResponse(message, analysis, history)

    return NextResponse.json({
      role: "assistant" as const,
      content: responseText,
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
