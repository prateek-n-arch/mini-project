import { NextResponse } from "next/server"

// Mock mood history data
const generateMoodHistory = () => {
  const moods = ["happy", "sad", "anxious", "calm", "stressed"]
  const history = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    history.push({
      date: date.toISOString().split("T")[0],
      mood: moods[Math.floor(Math.random() * moods.length)],
      score: Math.floor(Math.random() * 5) + 1,
    })
  }

  return history
}

export async function GET() {
  try {
    const history = generateMoodHistory()
    return NextResponse.json(history)
  } catch (error) {
    console.error("[v0] Error fetching mood history:", error)
    return NextResponse.json({ error: "Failed to fetch mood history" }, { status: 500 })
  }
}
