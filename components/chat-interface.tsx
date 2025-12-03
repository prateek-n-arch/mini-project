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
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })
      setCameraStream(stream)
      setShowCameraPreview(true)

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream

        // Wait for video metadata to load
        await new Promise((resolve, reject) => {
          if (!videoPreviewRef.current) {
            reject(new Error("Video ref is null"))
            return
          }

          const video = videoPreviewRef.current

          // Wait for metadata first
          video.onloadedmetadata = () => {
            console.log("[v0] Video metadata loaded")
            video
              .play()
              .then(() => {
                console.log("[v0] Video started playing")

                // Wait for first frame to be rendered
                const checkVideoReady = () => {
                  if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
                    console.log("[v0] Video fully ready, dimensions:", video.videoWidth, "x", video.videoHeight)
                    // Give it extra time to ensure frames are rendering
                    setTimeout(resolve, 1000)
                  } else {
                    console.log("[v0] Waiting for video to be ready...")
                    setTimeout(checkVideoReady, 100)
                  }
                }

                checkVideoReady()
              })
              .catch(reject)
          }

          video.onerror = () => {
            reject(new Error("Video failed to load"))
          }
        })
      }
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      alert("Unable to access camera. Please check your permissions.")
      cancelCameraPreview()
    }
  }

  const captureImage = () => {
    if (!videoPreviewRef.current || !cameraStream) {
      console.error("[v0] Video or stream not ready")
      alert("Camera not ready. Please try again.")
      return
    }

    const video = videoPreviewRef.current

    if (video.readyState < 2) {
      console.error("[v0] Video not ready yet, readyState:", video.readyState)
      alert("Please wait for the camera to fully initialize")
      return
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("[v0] Video has no dimensions yet")
      alert("Camera is still initializing, please wait a moment")
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d", { willReadFrequently: false })

    if (!ctx) {
      console.error("[v0] Could not get canvas context")
      alert("Failed to capture image. Please try again.")
      return
    }

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to JPEG with good quality
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.92)

      if (imageDataUrl.length < 1000) {
        console.error("[v0] Captured image is too small, likely blank:", imageDataUrl.length, "bytes")
        alert("Failed to capture image. Please ensure your camera is working and try again.")
        return
      }

      console.log("[v0] Image captured successfully, size:", imageDataUrl.length, "bytes")
      setCapturedImage(imageDataUrl)

      // Don't stop camera stream yet - do it after analysis
      setShowCameraPreview(false)

      // Send to backend for emotion analysis
      analyzeImageEmotion(imageDataUrl).finally(() => {
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop())
          setCameraStream(null)
        }
      })
    } catch (error) {
      console.error("[v0] Error capturing image:", error)
      alert("Failed to capture image. Please try again.")
    }
  }

  const cancelCameraPreview = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setShowCameraPreview(false)
    setCapturedImage(null)
  }

  const analyzeImageEmotion = async (imageDataUrl: string) => {
    try {
      console.log("[v0] Sending image to backend, size:", imageDataUrl.length)

      const response = await fetch("/api/analyze/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      })

      if (!response.ok) throw new Error("Failed to analyze image")

      const emotionData = await response.json()
      console.log("[v0] Backend emotion analysis:", emotionData)

      const messageContent = `[Photo captured]`

      const userMessage: ChatMessage = {
        role: "user",
        content: messageContent,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageContent,
            history: messages,
            emotionData: {
              visual: {
                emotions: emotionData.emotions,
                dominantEmotion: emotionData.dominantEmotion,
                mentalState: emotionData.mentalState,
                confidence: emotionData.confidence,
              },
            },
          }),
        })

        if (!chatResponse.ok) throw new Error("Failed to get response")

        const data = await chatResponse.json()
        setMessages((prev) => [...prev, data])
      } catch (error) {
        console.error("[v0] Chat error:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble responding right now. Please try again in a moment.",
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setIsLoading(false)
      }

      setTimeout(() => {
        setCapturedImage(null)
      }, 3000)
    } catch (error) {
      console.error("[v0] Error analyzing image emotion:", error)
      setCapturedImage(null)

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "[Photo captured]",
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: "I captured your photo but had trouble analyzing it. How are you feeling right now?",
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      console.log("[v0] Sending audio to backend for analysis")

      const formData = new FormData()
      formData.append("audio", audioBlob, "audio.webm")

      const response = await fetch("/api/analyze/voice", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to analyze voice")

      const voiceData = await response.json()
      console.log("[v0] Backend voice analysis:", voiceData)

      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          console.log("[v0] Transcribed text:", transcript)

          sendVoiceMessage(transcript, voiceData)
        }

        recognition.onerror = () => {
          sendVoiceMessage("", voiceData)
        }

        recognition.start()
      } else {
        sendVoiceMessage("", voiceData)
      }
    } catch (error) {
      console.error("[v0] Error in voice analysis:", error)
      sendVoiceMessage("", null)
    }
  }

  const sendVoiceMessage = async (transcript: string, voiceData: any) => {
    const messageContent = transcript || "[Voice message recorded]"

    const emotionData = voiceData
      ? {
          voice: {
            emotion: voiceData.emotion,
            energy: voiceData.energy,
            stress: voiceData.stress,
            confidence: voiceData.confidence,
            details: voiceData.details,
          },
        }
      : null

    const userMessage: ChatMessage = {
      role: "user",
      content: messageContent,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
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
          content: "I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()

    let emotionData = null
    let cleanMessage = userMessage

    const voiceMatch = userMessage.match(/\[Voice Analysis: (.+?) - (.+?) intensity\]/)
    const videoMatch = userMessage.match(/\[Video Analysis\][\s\S]*?Overall mood: (.+?)\n/)

    if (voiceMatch) {
      emotionData = {
        voice: {
          emotion: voiceMatch[1],
          intensity: voiceMatch[2],
        },
      }
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
      {showCameraPreview && (
        <div className="border-b bg-muted/50 p-4">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              <video
                ref={videoPreviewRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
                <Button onClick={captureImage} size="lg" className="bg-primary hover:bg-primary/90">
                  📸 Capture Photo
                </Button>
                <Button onClick={cancelCameraPreview} size="lg" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {capturedImage && !showCameraPreview && (
        <div className="border-b bg-muted/50 p-4">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-lg">
              <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full rounded-lg" />
              <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
                ✓ Analyzing emotions...
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
              disabled={isRecordingAudio || showCameraPreview}
            />
            <Button
              type="button"
              size="icon"
              variant={isRecordingAudio ? "destructive" : "outline"}
              className="h-12 w-12 shrink-0"
              onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
              disabled={showCameraPreview}
            >
              {isRecordingAudio ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant={showCameraPreview ? "default" : "outline"}
              className="h-12 w-12 shrink-0"
              onClick={startCameraPreview}
              disabled={isRecordingAudio || showCameraPreview}
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || isRecordingAudio || showCameraPreview}
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
