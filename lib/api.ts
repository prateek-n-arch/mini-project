// API utility functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface MoodEntry {
  id?: string
  mood: string
  intensity: number
  note?: string
  timestamp: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface WellnessScore {
  score: number
  trend: "up" | "down" | "stable"
  insights: string[]
}

// Mood API
export async function saveMood(mood: MoodEntry): Promise<MoodEntry> {
  const response = await fetch(`${API_BASE_URL}/api/mood`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mood),
  })

  if (!response.ok) {
    throw new Error("Failed to save mood")
  }

  return response.json()
}

export async function getMoodHistory(days = 30): Promise<MoodEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/mood/history?days=${days}`)

  if (!response.ok) {
    throw new Error("Failed to fetch mood history")
  }

  return response.json()
}

export async function getRecentMoods(limit = 5): Promise<MoodEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/mood/recent?limit=${limit}`)

  if (!response.ok) {
    throw new Error("Failed to fetch recent moods")
  }

  return response.json()
}

// Wellness API
export async function getWellnessScore(): Promise<WellnessScore> {
  const response = await fetch(`${API_BASE_URL}/api/wellness/score`)

  if (!response.ok) {
    throw new Error("Failed to fetch wellness score")
  }

  return response.json()
}

// Chat API
export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<ChatMessage> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history: history.slice(-10), // Send last 10 messages for better context and personalization
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send chat message")
  }

  return response.json()
}

// Health check
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    })
    return response.ok
  } catch (error) {
    return false
  }
}
