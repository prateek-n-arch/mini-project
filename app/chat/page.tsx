import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-1 text-2xl font-bold">AI Companion</h1>
          <p className="text-sm text-muted-foreground">Share your thoughts and feelings in a safe, supportive space</p>
        </div>
      </div>
      <ChatInterface />
    </div>
  )
}
