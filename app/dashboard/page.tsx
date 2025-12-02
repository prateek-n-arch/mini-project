import { MoodTracker } from "@/components/mood-tracker"
import { MoodChart } from "@/components/mood-chart"
import { RecentEntries } from "@/components/recent-entries"
import { WellnessScore } from "@/components/wellness-score"

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Your Wellness Dashboard</h1>
          <p className="text-muted-foreground">Track your emotional journey and see your progress over time</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <MoodTracker />
            <MoodChart />
            <RecentEntries />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WellnessScore />
          </div>
        </div>
      </div>
    </div>
  )
}
