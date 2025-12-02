"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Smile, Meh, Frown, Angry, Laugh } from "lucide-react"
import { saveMood } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const moods = [
  { id: "great", label: "Great", icon: Laugh, color: "text-green-500", intensity: 5 },
  { id: "good", label: "Good", icon: Smile, color: "text-blue-500", intensity: 4 },
  { id: "okay", label: "Okay", icon: Meh, color: "text-yellow-500", intensity: 3 },
  { id: "bad", label: "Bad", icon: Frown, color: "text-orange-500", intensity: 2 },
  { id: "terrible", label: "Terrible", icon: Angry, color: "text-red-500", intensity: 1 },
]

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!selectedMood) return

    setIsSubmitting(true)

    try {
      const selectedMoodData = moods.find((m) => m.id === selectedMood)
      await saveMood({
        mood: selectedMood,
        intensity: selectedMoodData?.intensity || 3,
        note,
        timestamp: new Date().toISOString(),
      })

      setSelectedMood(null)
      setNote("")
      toast({
        title: "Mood logged successfully!",
        description: "Your mood has been recorded.",
      })

      // Trigger a page refresh to update other components
      window.dispatchEvent(new Event("moodUpdated"))
    } catch (error) {
      console.error("[v0] Failed to log mood:", error)
      toast({
        title: "Connection error",
        description: "Make sure your backend is running on http://localhost:8000",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">How are you feeling today?</h2>

      <div className="mb-6 grid grid-cols-5 gap-4">
        {moods.map((mood) => {
          const Icon = mood.icon
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-accent ${
                selectedMood === mood.id ? "border-primary bg-accent" : "border-transparent"
              }`}
            >
              <Icon className={`h-8 w-8 ${mood.color}`} />
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Add a note about how you're feeling (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="resize-none"
        />

        <Button onClick={handleSubmit} disabled={!selectedMood || isSubmitting} className="w-full">
          {isSubmitting ? "Logging..." : "Log Mood"}
        </Button>
      </div>
    </Card>
  )
}
