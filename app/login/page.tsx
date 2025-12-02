import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles, UserCircle } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to MindEcho</h1>
          <p className="text-muted-foreground">Your safe space for mental wellness</p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Start Your Journey</CardTitle>
            <CardDescription>Choose how you'd like to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Anonymous Access */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Quick Start</span>
                </div>
              </div>

              <Link href="/dashboard">
                <Button size="lg" className="w-full gap-2" variant="default">
                  <UserCircle className="h-5 w-5" />
                  Continue as Guest
                </Button>
              </Link>

              <p className="text-xs text-center text-muted-foreground">
                No account needed. Your data stays private and secure.
              </p>
            </div>

            {/* Optional: Create Account Section */}
            <div className="space-y-4 pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or use a nickname</span>
                </div>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Choose a Nickname (Optional)</Label>
                  <Input id="nickname" placeholder="e.g., Rainbow123" className="bg-background" />
                </div>

                <Link href="/dashboard">
                  <Button size="lg" type="submit" variant="outline" className="w-full gap-2 bg-transparent">
                    <Sparkles className="h-5 w-5" />
                    Start with Nickname
                  </Button>
                </Link>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Nicknames help personalize your experience while keeping you anonymous.
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/solutions" className="text-primary hover:underline">
              Explore wellness resources
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
