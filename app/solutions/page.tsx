"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wind, Heart, Activity, BookOpen, Users, Sparkles, ChevronRight } from "lucide-react"

// Dynamic wellness solutions data
const categories = [
  {
    id: "breathing",
    title: "Breathing Exercises",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    solutions: [
      {
        name: "4-7-8 Breathing",
        duration: "2 min",
        description: "Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.",
        benefits: ["Reduces anxiety", "Improves sleep", "Calms nervous system"],
      },
      {
        name: "Box Breathing",
        duration: "5 min",
        description: "Breathe in 4 counts, hold 4, exhale 4, hold 4. Great for focus.",
        benefits: ["Enhances concentration", "Reduces stress", "Regulates emotions"],
      },
      {
        name: "Deep Belly Breathing",
        duration: "3 min",
        description: "Place hand on belly, breathe deeply so belly rises and falls.",
        benefits: ["Activates relaxation", "Lowers blood pressure", "Eases tension"],
      },
    ],
  },
  {
    id: "mindfulness",
    title: "Mindfulness & Meditation",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    solutions: [
      {
        name: "Body Scan Meditation",
        duration: "10 min",
        description: "Focus attention on each part of your body from toes to head.",
        benefits: ["Reduces physical tension", "Increases awareness", "Promotes relaxation"],
      },
      {
        name: "Loving-Kindness Meditation",
        duration: "7 min",
        description: "Direct positive wishes and compassion toward yourself and others.",
        benefits: ["Boosts empathy", "Improves mood", "Reduces self-criticism"],
      },
      {
        name: "5-Minute Mindfulness",
        duration: "5 min",
        description: "Focus on your breath and observe thoughts without judgment.",
        benefits: ["Clears mind", "Reduces racing thoughts", "Improves focus"],
      },
    ],
  },
  {
    id: "movement",
    title: "Physical Activities",
    icon: Activity,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    solutions: [
      {
        name: "Gentle Stretching",
        duration: "10 min",
        description: "Stretch major muscle groups slowly and mindfully.",
        benefits: ["Releases tension", "Improves flexibility", "Boosts energy"],
      },
      {
        name: "Walking Meditation",
        duration: "15 min",
        description: "Walk slowly outdoors, focusing on each step and your surroundings.",
        benefits: ["Combines exercise & mindfulness", "Fresh air", "Mood boost"],
      },
      {
        name: "Yoga Flow",
        duration: "20 min",
        description: "Simple yoga poses focusing on breath and movement connection.",
        benefits: ["Reduces stress", "Improves balance", "Enhances flexibility"],
      },
    ],
  },
  {
    id: "journaling",
    title: "Journaling & Reflection",
    icon: BookOpen,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    solutions: [
      {
        name: "Gratitude Journal",
        duration: "5 min",
        description: "Write 3 things you're grateful for today, no matter how small.",
        benefits: ["Shifts perspective", "Increases happiness", "Reduces negativity"],
      },
      {
        name: "Emotion Check-In",
        duration: "7 min",
        description: "Write about what you're feeling and why without judgment.",
        benefits: ["Processes emotions", "Increases self-awareness", "Validates feelings"],
      },
      {
        name: "Future Self Letter",
        duration: "10 min",
        description: "Write a compassionate letter to your future self with hopes and encouragement.",
        benefits: ["Creates hope", "Sets intentions", "Builds self-compassion"],
      },
    ],
  },
  {
    id: "social",
    title: "Social Connection",
    icon: Users,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    solutions: [
      {
        name: "Reach Out",
        duration: "10 min",
        description: "Send a message to someone you trust. Share how you're feeling.",
        benefits: ["Reduces isolation", "Builds support", "Strengthens relationships"],
      },
      {
        name: "Join a Group",
        duration: "Ongoing",
        description: "Find online or local support groups for mental health.",
        benefits: ["Shared experiences", "Community support", "Reduces loneliness"],
      },
      {
        name: "Quality Time",
        duration: "30 min",
        description: "Spend intentional time with loved ones doing something enjoyable.",
        benefits: ["Boosts oxytocin", "Creates positive memories", "Emotional support"],
      },
    ],
  },
  {
    id: "creative",
    title: "Creative Expression",
    icon: Sparkles,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    solutions: [
      {
        name: "Art Therapy",
        duration: "15 min",
        description: "Draw, paint, or color without worrying about the result.",
        benefits: ["Expresses emotions", "Reduces stress", "Increases joy"],
      },
      {
        name: "Music Therapy",
        duration: "10 min",
        description: "Listen to calming music or play an instrument if available.",
        benefits: ["Regulates mood", "Reduces anxiety", "Provides comfort"],
      },
      {
        name: "Writing Poetry",
        duration: "12 min",
        description: "Express your feelings through free-form poetry or lyrics.",
        benefits: ["Emotional release", "Self-expression", "Clarity"],
      },
    ],
  },
]

export default function SolutionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const currentCategory = categories.find((cat) => cat.id === selectedCategory)

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Free Wellness Resources
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl text-balance">
            General Mental Wellness Solutions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance leading-relaxed">
            Explore evidence-based techniques and activities to support your mental health journey. All resources are
            free and available anytime.
          </p>
        </div>

        {/* Category Grid */}
        {!selectedCategory ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="group cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader>
                    <div
                      className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {category.title}
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardTitle>
                    <CardDescription>{category.solutions.length} techniques available</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ) : (
          // Selected Category Details
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedCategory(null)} className="mb-4">
              ← Back to all categories
            </Button>

            {currentCategory && (
              <>
                <div className="mb-8 flex items-center gap-4">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${currentCategory.bgColor}`}
                  >
                    <currentCategory.icon className={`h-8 w-8 ${currentCategory.color}`} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{currentCategory.title}</h2>
                    <p className="text-muted-foreground">Choose a technique to get started</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {currentCategory.solutions.map((solution, idx) => (
                    <Card key={idx} className="border-2">
                      <CardHeader>
                        <div className="mb-2 flex items-start justify-between">
                          <CardTitle className="text-xl">{solution.name}</CardTitle>
                          <Badge variant="secondary">{solution.duration}</Badge>
                        </div>
                        <CardDescription className="text-base leading-relaxed">{solution.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="mb-2 text-sm font-medium">Benefits:</p>
                          <div className="flex flex-wrap gap-2">
                            {solution.benefits.map((benefit, benefitIdx) => (
                              <Badge key={benefitIdx} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full gap-2">
                          Try This Exercise
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Crisis Support Banner */}
        <Card className="mt-12 border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <Heart className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold">In Crisis?</h3>
              <p className="text-sm text-muted-foreground">
                If you're experiencing a mental health emergency, please contact your local emergency services or call a
                crisis helpline immediately.
              </p>
            </div>
            <Button variant="destructive">Get Help Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
