"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Smile, Meh, Frown, Laugh, Angry } from "lucide-react"
import { getRecentMoods, type MoodEntry } from "@/lib/api"

export function RecentEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const recent = await getRecentMoods(5)
        setEntries(recent)
      } catch (error) {
        console.error("[v0] Failed to fetch recent entries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Listen for mood updates
    window.addEventListener("moodUpdated", fetchData)
    return () => window.removeEventListener("moodUpdated", fetchData)
  }, [])

  const getMoodIcon = (mood: string) => {
    if (mood === "great") return Laugh
    if (mood === "good") return Smile
    if (mood === "okay") return Meh
    if (mood === "bad") return Frown
    return Angry
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Recent Entries</h2>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const Icon = getMoodIcon(entry.mood)
            return (
              <div key={entry.id || index} className="flex items-start gap-4 rounded-lg border p-4">
                <Icon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium capitalize">{entry.mood}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(entry.timestamp)}</span>
                  </div>
                  {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No entries yet. Start tracking your mood!</p>
      )}
    </Card>
  )
}
