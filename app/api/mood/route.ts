import { NextResponse } from "next/server"

// In-memory storage (replace with database in production)
const moods: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newMood = {
      id: Date.now().toString(),
      mood: body.mood,
      note: body.note || "",
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    moods.push(newMood)

    return NextResponse.json(newMood, { status: 201 })
  } catch (error) {
    console.error("[v0] Error saving mood:", error)
    return NextResponse.json({ error: "Failed to save mood" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(moods)
}
