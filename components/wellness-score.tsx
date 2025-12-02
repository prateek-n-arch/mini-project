"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { getWellnessScore, type WellnessScore as WellnessScoreType } from "@/lib/api"

export function WellnessScore() {
  const [data, setData] = useState<WellnessScoreType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const score = await getWellnessScore()
        setData(score)
      } catch (error) {
        console.error("[v0] Failed to fetch wellness score:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    window.addEventListener("moodUpdated", fetchData)
    return () => window.removeEventListener("moodUpdated", fetchData)
  }, [])

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Wellness Score</h2>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : data ? (
        <>
          <div className="mb-6 text-center">
            <div className="mb-2 text-5xl font-bold text-primary">{data.score}</div>
            <p className="text-sm text-muted-foreground">Out of 100</p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-accent p-3">
            {data.trend === "up" && (
              <>
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Trending upward</span>
              </>
            )}
            {data.trend === "down" && (
              <>
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Needs attention</span>
              </>
            )}
            {data.trend === "stable" && (
              <>
                <Minus className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Stable</span>
              </>
            )}
          </div>

          {data.insights && data.insights.length > 0 && (
            <div className="mt-6 space-y-3 rounded-lg border p-4">
              <h3 className="font-medium">Insights</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {data.insights.map((insight, index) => (
                  <li key={index}>• {insight}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground">Start logging moods to see your wellness score</div>
      )}
    </Card>
  )
}
