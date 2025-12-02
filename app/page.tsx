import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, MessageCircle, TrendingUp, Sparkles, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-background" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Your Mental Wellness Companion
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance lg:text-6xl">
            Take care of your mind, one day at a time
          </h1>

          <p className="mb-12 text-xl text-muted-foreground text-balance leading-relaxed">
            Track your emotions, connect with an AI companion, and gain insights into your mental wellness journey with
            MindEcho.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Get Started
                <Brain className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/solutions">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                Explore Solutions
                <BookOpen className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                Talk to AI
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Everything you need for better mental health
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Simple tools designed to support your emotional wellbeing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Mood Tracking */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Mood Tracking</h3>
              <p className="leading-relaxed text-muted-foreground">
                Log your daily moods and emotions. Visualize patterns and understand what affects your mental state.
              </p>
            </div>

            {/* AI Companion */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">AI Support</h3>
              <p className="leading-relaxed text-muted-foreground">
                Chat with an empathetic AI companion trained to provide emotional support and coping strategies.
              </p>
            </div>

            {/* Insights */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Personal Insights</h3>
              <p className="leading-relaxed text-muted-foreground">
                Get personalized insights and recommendations based on your mental wellness journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
