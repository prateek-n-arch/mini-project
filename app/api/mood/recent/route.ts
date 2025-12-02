import { NextResponse } from "next/server"

// Mock recent entries
const generateRecentEntries = () => {
  const moods = [
    { mood: "happy", emoji: "😊", color: "text-yellow-500" },
    { mood: "calm", emoji: "😌", color: "text-blue-500" },
    { mood: "anxious", emoji: "😰", color: "text-orange-500" },
    { mood: "sad", emoji: "😢", color: "text-gray-500" },
  ]

  const entries = []
  const now = new Date()

  for (let i = 0; i < 5; i++) {
    const date = new Date(now)
    date.setHours(date.getHours() - i * 4)

    const randomMood = moods[Math.floor(Math.random() * moods.length)]
    entries.push({
      id: `entry-${i}`,
      mood: randomMood.mood,
      note: `Feeling ${randomMood.mood} today`,
      timestamp: date.toISOString(),
      created_at: date.toISOString(),
    })
  }

  return entries
}

export async function GET() {
  try {
    const recent = generateRecentEntries()
    return NextResponse.json(recent)
  } catch (error) {
    console.error("[v0] Error fetching recent entries:", error)
    return NextResponse.json({ error: "Failed to fetch recent entries" }, { status: 500 })
  }
}
