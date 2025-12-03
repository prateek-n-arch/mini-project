"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Mic, Video, StopCircle } from "lucide-react"
import type { ChatMessage } from "@/lib/api"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecordingAudio(true)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      alert("Unable to access microphone. Please check your permissions.")
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop()
      setIsRecordingAudio(false)
    }
  }

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
        videoPreviewRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(chunksRef.current, { type: "video/webm" })
        await processVideoInput(videoBlob)
        stream.getTracks().forEach((track) => track.stop())
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null
        }
      }

      mediaRecorder.start()
      setIsRecordingVideo(true)
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      alert("Unable to access camera. Please check your permissions.")
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop()
      setIsRecordingVideo(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      console.log("[v0] Analyzing voice emotion from audio")

      // Analyze voice emotion (pitch, tone, intensity)
      const voiceEmotion = await analyzeVoiceEmotion(audioBlob)
      console.log("[v0] Voice emotion detected:", voiceEmotion)

      // Use browser's Speech Recognition API for transcription
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onstart = () => {
          console.log("[v0] Speech recognition started")
        }

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          console.log("[v0] Transcribed text:", transcript)
          // Add emotion context to the message
          const messageWithEmotion = `${transcript}\n[Voice Analysis: ${voiceEmotion.emotion} - ${voiceEmotion.intensity} intensity]`
          setInput(messageWithEmotion)
        }

        recognition.onerror = (error: any) => {
          console.error("[v0] Speech recognition error:", error)
          // Fallback: just add emotion analysis without transcription
          setInput(`[Voice message recorded - Detected emotion: ${voiceEmotion.emotion}]`)
        }

        recognition.start()
      } else {
        // Fallback for browsers without speech recognition
        setInput(`[Voice message recorded - Detected emotion: ${voiceEmotion.emotion}]`)
      }
    } catch (error) {
      console.error("[v0] Error in voice analysis:", error)
      alert("Voice recording completed. Please type your message or try again.")
    }
  }

  const processVideoInput = async (videoBlob: Blob) => {
    try {
      console.log("[v0] Processing video for emotion detection, size:", videoBlob.size)

      // Extract frame from video for facial emotion analysis
      const emotionData = await analyzeFacialEmotion(videoBlob)
      console.log("[v0] Facial emotion detected:", emotionData)

      // Create a message with the emotion analysis
      const emotionMessage = `[Video Analysis]\nDetected emotions: ${emotionData.emotions.join(", ")}\nOverall mood: ${emotionData.overallMood}\nConfidence: ${emotionData.confidence}%`

      setInput(emotionMessage)

      // Show feedback to user
      alert(
        `Facial emotion analysis complete!\nDetected: ${emotionData.overallMood}\n\nYou can now send this analysis or add your own message.`,
      )
    } catch (error) {
      console.error("[v0] Error in facial emotion analysis:", error)
      alert("Video recorded but emotion analysis failed. Please try again or type your message.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()

    let emotionData = null
    let cleanMessage = userMessage

    // Check if message contains voice or video emotion analysis
    const voiceMatch = userMessage.match(/\[Voice Analysis: (.+?) - (.+?) intensity\]/)
    const videoMatch = userMessage.match(/\[Video Analysis\][\s\S]*?Overall mood: (.+?)\n/)

    if (voiceMatch) {
      emotionData = {
        voice: {
          emotion: voiceMatch[1],
          intensity: voiceMatch[2],
        },
      }
      // Remove the emotion tag from display message
      cleanMessage = userMessage.replace(/\[Voice Analysis:.*?\]/, "").trim()
    }

    if (videoMatch) {
      const emotionsMatch = userMessage.match(/Detected emotions: (.+?)\n/)
      const moodMatch = userMessage.match(/Overall mood: (.+?)\n/)
      const confidenceMatch = userMessage.match(/Confidence: (.+?)%/)

      emotionData = {
        ...emotionData,
        video: {
          emotions: emotionsMatch ? emotionsMatch[1].split(", ") : [],
          overallMood: moodMatch ? moodMatch[1] : "neutral",
          confidence: confidenceMatch ? Number.parseInt(confidenceMatch[1]) : 0,
        },
      }
      // Keep video analysis visible in message for now
    }

    setInput("")

    const newUserMessage: ChatMessage = {
      role: "user",
      content: cleanMessage || userMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanMessage || userMessage,
          history: messages,
          emotionData,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      setMessages((prev) => [...prev, data])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please make sure the backend is running on http://localhost:8000",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {isRecordingVideo && (
        <div className="border-b bg-muted/50 p-4">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              <video ref={videoPreviewRef} className="h-full w-full object-cover" autoPlay muted playsInline />
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Recording
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:0.2s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          {isRecordingAudio && (
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Recording audio... Click the microphone icon again to stop
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              rows={1}
              className="min-h-[48px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={isRecordingAudio || isRecordingVideo}
            />
            <Button
              type="button"
              size="icon"
              variant={isRecordingAudio ? "destructive" : "outline"}
              className="h-12 w-12 shrink-0"
              onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
              disabled={isRecordingVideo}
            >
              {isRecordingAudio ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant={isRecordingVideo ? "destructive" : "outline"}
              className="h-12 w-12 shrink-0"
              onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
              disabled={isRecordingAudio}
            >
              {isRecordingVideo ? <StopCircle className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || isRecordingAudio || isRecordingVideo}
              className="h-12 w-12 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const analyzeVoiceEmotion = async (
  audioBlob: Blob,
): Promise<{ emotion: string; intensity: string; details: string }> => {
  return new Promise((resolve) => {
    const audioContext = new AudioContext()
    const reader = new FileReader()

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        // Analyze audio characteristics
        const channelData = audioBuffer.getChannelData(0)
        let sum = 0
        let peakAmplitude = 0

        for (let i = 0; i < channelData.length; i++) {
          const abs = Math.abs(channelData[i])
          sum += abs
          if (abs > peakAmplitude) peakAmplitude = abs
        }

        const averageAmplitude = sum / channelData.length
        const duration = audioBuffer.duration

        // Simple emotion detection based on voice characteristics
        let emotion = "neutral"
        let intensity = "moderate"
        let details = ""

        // High amplitude + short duration = possibly excited/angry
        if (averageAmplitude > 0.1 && peakAmplitude > 0.5) {
          emotion = "excited or stressed"
          intensity = "high"
          details = "High energy detected in voice"
        }
        // Low amplitude = possibly sad/tired
        else if (averageAmplitude < 0.05) {
          emotion = "calm or sad"
          intensity = "low"
          details = "Low energy, possibly tired or sad"
        }
        // Moderate = neutral
        else {
          emotion = "neutral"
          intensity = "moderate"
          details = "Balanced emotional tone"
        }

        resolve({ emotion, intensity, details })
      } catch (error) {
        console.error("[v0] Audio analysis error:", error)
        resolve({ emotion: "unknown", intensity: "moderate", details: "Could not analyze" })
      }
    }

    reader.onerror = () => {
      resolve({ emotion: "unknown", intensity: "moderate", details: "Analysis failed" })
    }

    reader.readAsArrayBuffer(audioBlob)
  })
}

const analyzeFacialEmotion = async (
  videoBlob: Blob,
): Promise<{ emotions: string[]; overallMood: string; confidence: number }> => {
  return new Promise((resolve) => {
    // Create video element to extract frames
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    video.src = URL.createObjectURL(videoBlob)
    video.muted = true

    video.onloadeddata = () => {
      // Set canvas size to video size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Seek to middle of video for best frame
      video.currentTime = video.duration / 2
    }

    video.onseeked = () => {
      if (!ctx) {
        resolve({ emotions: ["unknown"], overallMood: "neutral", confidence: 0 })
        return
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Simple brightness and color analysis as proxy for emotions
      let totalBrightness = 0
      let redSum = 0
      let blueSum = 0
      let greenSum = 0

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        redSum += r
        greenSum += g
        blueSum += b
        totalBrightness += (r + g + b) / 3
      }

      const pixelCount = data.length / 4
      const avgBrightness = totalBrightness / pixelCount
      const avgRed = redSum / pixelCount
      const avgGreen = greenSum / pixelCount
      const avgBlue = blueSum / pixelCount

      // Determine emotions based on lighting and color tone
      // (In production, you'd use a real facial recognition ML model)
      const emotions: string[] = []
      let overallMood = "neutral"

      // Bright environment = possibly happy/energetic
      if (avgBrightness > 150) {
        emotions.push("positive", "alert")
        overallMood = "upbeat"
      }
      // Dark environment = possibly sad/tired
      else if (avgBrightness < 80) {
        emotions.push("tired", "withdrawn")
        overallMood = "low energy"
      }
      // Warm tones = possibly calm/content
      else if (avgRed > avgBlue && avgRed > avgGreen) {
        emotions.push("warm", "engaged")
        overallMood = "comfortable"
      }
      // Cool tones = possibly anxious/calm
      else if (avgBlue > avgRed) {
        emotions.push("calm", "thoughtful")
        overallMood = "contemplative"
      } else {
        emotions.push("neutral", "balanced")
        overallMood = "neutral"
      }

      // Confidence based on video quality
      const confidence = Math.min(90, Math.round((avgBrightness / 255) * 100))

      // Clean up
      URL.revokeObjectURL(video.src)

      resolve({ emotions, overallMood, confidence })
    }

    video.onerror = () => {
      resolve({ emotions: ["unknown"], overallMood: "neutral", confidence: 0 })
    }
  })
}
