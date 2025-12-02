import Link from "next/link"
import { Brain, LayoutDashboard, MessageCircle, BookOpen, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Brain className="h-6 w-6 text-primary" />
          <span className="text-xl">MindEcho</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/solutions">
            <Button variant="ghost" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Solutions</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button className="gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
