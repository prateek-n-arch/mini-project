import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Calculate a mock wellness score based on recent moods
    const score = Math.floor(Math.random() * 30) + 70 // 70-100
    const trend = Math.random() > 0.5 ? "up" : "down"
    const change = Math.floor(Math.random() * 10) + 1

    return NextResponse.json({
      score,
      trend,
      change,
      message:
        score >= 85
          ? "You're doing great! Keep up the good work."
          : score >= 70
            ? "You're on the right track. Consider some self-care activities."
            : "Take some time for yourself today.",
    })
  } catch (error) {
    console.error("[v0] Error calculating wellness score:", error)
    return NextResponse.json({ error: "Failed to calculate wellness score" }, { status: 500 })
  }
}
