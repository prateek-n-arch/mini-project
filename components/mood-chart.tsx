"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getMoodHistory } from "@/lib/api"

export function MoodChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const history = await getMoodHistory(30)
        setData(history)
      } catch (error) {
        console.error("[v0] Failed to fetch mood history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Listen for mood updates
    window.addEventListener("moodUpdated", fetchData)
    return () => window.removeEventListener("moodUpdated", fetchData)
  }, [])

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Your Mood Trends</h2>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
      ) : data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Start logging your moods to see trends over time
        </div>
      )}
    </Card>
  )
}
