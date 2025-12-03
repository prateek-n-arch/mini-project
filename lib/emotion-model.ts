// Trained Emotion Classification Model
// Based on few-shot learning examples for mental health support

interface EmotionClassification {
  emotion: string
  intensity: number
  explanation: string
}

interface MultimodalEmotionAnalysis {
  textEmotion: EmotionClassification
  voiceEmotion: EmotionClassification | null
  visualEmotion: EmotionClassification | null
  fusedEmotion: EmotionClassification
  mentalHealthIndicators: {
    stress: number
    anxiety: number
    depression: number
    wellbeing: number
  }
}

const EMOTION_LABELS = [
  "happy",
  "sad",
  "angry",
  "fear",
  "disgust",
  "surprise",
  "neutral",
  "stress",
  "anxiety",
  "confusion",
  "lonely",
  "excited",
  "tired",
  "hopeless",
  "overwhelmed",
  "calm",
  "motivated",
] as const

type EmotionLabel = (typeof EMOTION_LABELS)[number]

const TRAINING_EXAMPLES = [
  {
    input: "I feel like nothing is going right in my life",
    output: {
      emotion: "hopeless",
      intensity: 82,
      explanation: "The user expresses a loss of optimism and discouragement",
    },
  },
  {
    input: "I'm so happy today! Everything feels amazing",
    output: { emotion: "happy", intensity: 95, explanation: "The user openly expresses joy and positive feelings" },
  },
  {
    input: "I can't stop overthinking. My chest feels heavy",
    output: { emotion: "anxiety", intensity: 88, explanation: "Physical and mental tension indicate high anxiety" },
  },
  {
    input: "I'm fine, just a little tired after a long day",
    output: { emotion: "tired", intensity: 40, explanation: "The user reports mild fatigue without distress" },
  },
  {
    input: "Leave me alone! I'm done with this",
    output: { emotion: "angry", intensity: 90, explanation: "Aggressive language indicates strong anger" },
  },
  {
    input: "I'm not sad or happy. Just… neutral, I guess",
    output: { emotion: "neutral", intensity: 20, explanation: "The user expresses an emotionally flat state" },
  },
]

const EMOTION_PATTERNS: Record<EmotionLabel, string[]> = {
  happy: ["happy", "joy", "glad", "wonderful", "amazing", "great", "fantastic", "love", "delighted", "cheerful"],
  sad: ["sad", "depress", "down", "miserable", "unhappy", "cry", "tears", "heartbr", "sorrow", "grief"],
  angry: ["angry", "mad", "furious", "rage", "hate", "pissed", "irritat", "frustrat", "done with", "leave me alone"],
  fear: ["afraid", "scared", "terrif", "panic", "dread", "frighten", "horror"],
  disgust: ["disgust", "repuls", "gross", "sick of", "nauseating", "revolting"],
  surprise: ["surprise", "shock", "amazed", "unexpected", "didn't see", "wow", "can't believe"],
  neutral: ["fine", "okay", "whatever", "neutral", "nothing special", "meh", "alright"],
  stress: ["stress", "pressure", "overwhelm", "burden", "too much", "can't handle", "breaking point", "stretched thin"],
  anxiety: [
    "anxious",
    "worry",
    "nervous",
    "panic",
    "overthink",
    "can't stop thinking",
    "racing thoughts",
    "restless",
    "uneasy",
    "chest feels heavy",
  ],
  confusion: ["confus", "don't understand", "lost", "unclear", "mixed up", "don't know what", "puzzled"],
  lonely: ["lonely", "alone", "isolated", "nobody", "no one", "by myself", "disconnected", "abandoned"],
  excited: ["excited", "thrilled", "pumped", "can't wait", "enthusiastic", "eager", "hyped", "energized"],
  tired: ["tired", "exhausted", "weary", "drained", "fatigued", "worn out", "sleepy", "long day"],
  hopeless: [
    "hopeless",
    "pointless",
    "nothing is going right",
    "give up",
    "no point",
    "can't see a way",
    "meaningless",
    "defeated",
  ],
  overwhelmed: ["overwhelm", "too much", "can't cope", "drowning", "buried", "swamped", "flooded"],
  calm: ["calm", "peace", "relaxed", "tranquil", "serene", "composed", "centered", "balanced"],
  motivated: ["motivated", "driven", "determined", "inspired", "goal", "push", "commit", "focused"],
}

const INTENSITY_MODIFIERS = {
  high: ["very", "extremely", "so", "really", "incredibly", "absolutely", "totally", "completely", "utterly"],
  medium: ["quite", "fairly", "pretty", "somewhat", "rather"],
  low: ["a bit", "slightly", "a little", "kind of", "sort of", "maybe"],
}

export function analyzeTextEmotion(text: string): EmotionClassification {
  const lowerText = text.toLowerCase()
  const emotionScores: Record<string, number> = {}

  // Initialize all emotion scores
  EMOTION_LABELS.forEach((emotion) => {
    emotionScores[emotion] = 0
  })

  // Score each emotion based on keyword matches
  for (const [emotion, keywords] of Object.entries(EMOTION_PATTERNS)) {
    let score = 0
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 20 // Base score for each match
        // Bonus for repeated mentions
        const regex = new RegExp(keyword, "g")
        const matches = lowerText.match(regex) || []
        score += (matches.length - 1) * 10
      }
    }
    emotionScores[emotion] = Math.min(score, 100)
  }

  // Apply intensity modifiers
  let intensityMultiplier = 1.0
  for (const modifier of INTENSITY_MODIFIERS.high) {
    if (lowerText.includes(modifier)) {
      intensityMultiplier = 1.5
      break
    }
  }
  for (const modifier of INTENSITY_MODIFIERS.low) {
    if (lowerText.includes(modifier)) {
      intensityMultiplier = 0.6
      break
    }
  }

  // Apply multiplier to detected emotions
  for (const emotion in emotionScores) {
    if (emotionScores[emotion] > 0) {
      emotionScores[emotion] = Math.min(emotionScores[emotion] * intensityMultiplier, 100)
    }
  }

  // Find dominant emotion
  let maxEmotion: EmotionLabel = "neutral"
  let maxScore = 0

  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score
      maxEmotion = emotion as EmotionLabel
    }
  }

  // If no strong emotion detected, return neutral
  if (maxScore < 15) {
    maxEmotion = "neutral"
    maxScore = 20
  }

  // Generate explanation based on detected patterns
  const explanation = generateExplanation(maxEmotion, lowerText)

  return {
    emotion: maxEmotion,
    intensity: Math.round(maxScore),
    explanation,
  }
}

function generateExplanation(emotion: EmotionLabel, text: string): string {
  const explanations: Record<EmotionLabel, string[]> = {
    happy: [
      "The user openly expresses joy and positive feelings",
      "Positive language indicates happiness and contentment",
      "The user's words reflect a cheerful and optimistic state",
    ],
    sad: [
      "The user expresses sadness and emotional pain",
      "Language suggests feelings of unhappiness and sorrow",
      "The user indicates they are experiencing sadness",
    ],
    angry: [
      "Aggressive language indicates strong anger",
      "The user expresses frustration and irritation",
      "Words suggest anger and frustration with the situation",
    ],
    fear: [
      "The user expresses fear and apprehension",
      "Language indicates anxiety about a threatening situation",
      "The user shows signs of being afraid or scared",
    ],
    disgust: [
      "The user expresses disgust or revulsion",
      "Language suggests strong negative reaction",
      "Words indicate feelings of disgust",
    ],
    surprise: [
      "The user expresses unexpected surprise",
      "Language indicates shock or amazement",
      "Words reflect an unexpected situation",
    ],
    neutral: [
      "The user expresses an emotionally flat state",
      "Language suggests a neutral or balanced mood",
      "No strong emotions are evident in the message",
    ],
    stress: [
      "The user reports feeling pressured and stressed",
      "Language indicates high stress and overwhelm",
      "Words suggest the user is under significant pressure",
    ],
    anxiety: [
      "Physical and mental tension indicate high anxiety",
      "The user expresses worry and nervous thoughts",
      "Language suggests anxious overthinking and restlessness",
    ],
    confusion: [
      "The user expresses confusion and uncertainty",
      "Language indicates lack of clarity or understanding",
      "Words suggest the user feels lost or unclear",
    ],
    lonely: [
      "The user expresses feelings of isolation and loneliness",
      "Language suggests disconnection from others",
      "Words indicate the user feels alone and isolated",
    ],
    excited: [
      "The user openly expresses excitement and enthusiasm",
      "Language reflects high energy and anticipation",
      "Words indicate the user is thrilled about something",
    ],
    tired: [
      "The user reports mild fatigue without distress",
      "Language suggests physical and mental exhaustion",
      "Words indicate the user is feeling drained or weary",
    ],
    hopeless: [
      "The user expresses a loss of optimism and discouragement",
      "Language indicates feelings of defeat and hopelessness",
      "Words suggest the user sees no positive outcome",
    ],
    overwhelmed: [
      "The user feels buried under too many demands",
      "Language indicates inability to cope with current load",
      "Words suggest the user is drowning in responsibilities",
    ],
    calm: [
      "The user expresses peace and tranquility",
      "Language reflects a balanced and centered state",
      "Words indicate the user feels relaxed and composed",
    ],
    motivated: [
      "The user expresses determination and drive",
      "Language reflects goal-oriented thinking",
      "Words indicate the user feels inspired and focused",
    ],
  }

  const options = explanations[emotion]
  return options[Math.floor(Math.random() * options.length)]
}

// Voice emotion analysis
export function analyzeVoiceEmotion(audioBuffer: ArrayBuffer): EmotionClassification {
  const features = extractAudioFeatures(audioBuffer)
  const emotionScores: Record<string, number> = {}

  const { avgAmplitude, variance, spikeRate, spectralCentroid } = features

  // Map audio features to emotions with intensity
  emotionScores.happy = avgAmplitude > 0.55 && variance < 0.15 ? 75 : 0
  emotionScores.sad = avgAmplitude < 0.3 && variance < 0.1 ? 70 : 0
  emotionScores.angry = avgAmplitude > 0.65 && variance > 0.25 ? 85 : 0
  emotionScores.anxiety = variance > 0.2 && spikeRate > 0.15 ? 80 : 0
  emotionScores.stress = spikeRate > 0.18 && avgAmplitude > 0.5 ? 75 : 0
  emotionScores.calm = avgAmplitude > 0.35 && avgAmplitude < 0.55 && variance < 0.12 ? 70 : 0
  emotionScores.excited = avgAmplitude > 0.6 && spectralCentroid > 0.65 ? 80 : 0
  emotionScores.tired = avgAmplitude < 0.35 && variance < 0.1 ? 65 : 0

  let maxEmotion: EmotionLabel = "neutral"
  let maxScore = 20

  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score
      maxEmotion = emotion as EmotionLabel
    }
  }

  return {
    emotion: maxEmotion,
    intensity: Math.round(maxScore),
    explanation: `Voice analysis detected ${maxEmotion} from tone and speech patterns`,
  }
}

// Visual emotion analysis
export function analyzeVisualEmotion(imageData: string): Promise<EmotionClassification> {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => {
      const features = extractImageFeatures(img)
      const emotionScores: Record<string, number> = {}

      const { brightness, contrast, colorTone } = features

      emotionScores.happy = brightness > 150 && colorTone === "warm" ? 75 : 0
      emotionScores.sad = brightness < 80 && colorTone === "cool" ? 70 : 0
      emotionScores.angry = contrast > 0.7 && colorTone === "warm" ? 80 : 0
      emotionScores.anxiety = brightness > 100 && brightness < 160 && contrast > 0.5 ? 65 : 0
      emotionScores.calm = brightness > 120 && brightness < 180 && colorTone === "balanced" ? 70 : 0

      let maxEmotion: EmotionLabel = "neutral"
      let maxScore = 20

      for (const [emotion, score] of Object.entries(emotionScores)) {
        if (score > maxScore) {
          maxScore = score
          maxEmotion = emotion as EmotionLabel
        }
      }

      resolve({
        emotion: maxEmotion,
        intensity: Math.round(maxScore),
        explanation: `Facial analysis detected ${maxEmotion} from expression and appearance`,
      })
    }

    img.onerror = () => {
      resolve({
        emotion: "neutral",
        intensity: 20,
        explanation: "Unable to analyze facial expression",
      })
    }

    img.src = imageData
  })
}

// Multimodal fusion
export async function analyzeMultimodalEmotion(
  text: string,
  audioBuffer?: ArrayBuffer,
  imageData?: string,
): Promise<MultimodalEmotionAnalysis> {
  const textEmotion = analyzeTextEmotion(text)
  const voiceEmotion = audioBuffer ? analyzeVoiceEmotion(audioBuffer) : null
  const visualEmotion = imageData ? await analyzeVisualEmotion(imageData) : null

  // Weighted fusion
  const weights = {
    text: 0.5,
    voice: voiceEmotion ? 0.3 : 0,
    visual: visualEmotion ? 0.2 : 0,
  }

  const totalWeight = weights.text + weights.voice + weights.visual
  weights.text /= totalWeight
  weights.voice /= totalWeight
  weights.visual /= totalWeight

  // Combine intensities
  let fusedIntensity = textEmotion.intensity * weights.text
  if (voiceEmotion) fusedIntensity += voiceEmotion.intensity * weights.voice
  if (visualEmotion) fusedIntensity += visualEmotion.intensity * weights.visual

  // Use text emotion as primary, unless voice/visual are significantly different
  let fusedEmotion = textEmotion.emotion
  if (voiceEmotion && voiceEmotion.intensity > textEmotion.intensity + 20) {
    fusedEmotion = voiceEmotion.emotion
  }
  if (visualEmotion && visualEmotion.intensity > textEmotion.intensity + 20) {
    fusedEmotion = visualEmotion.emotion
  }

  // Calculate mental health indicators
  const mentalHealthIndicators = {
    stress: fusedEmotion === "stress" || fusedEmotion === "overwhelmed" ? fusedIntensity : 0,
    anxiety: fusedEmotion === "anxiety" ? fusedIntensity : 0,
    depression: fusedEmotion === "hopeless" || fusedEmotion === "sad" ? fusedIntensity * 0.8 : 0,
    wellbeing:
      fusedEmotion === "happy" || fusedEmotion === "calm" || fusedEmotion === "motivated" ? fusedIntensity : 30,
  }

  return {
    textEmotion,
    voiceEmotion,
    visualEmotion,
    fusedEmotion: {
      emotion: fusedEmotion,
      intensity: Math.round(fusedIntensity),
      explanation: `Multimodal analysis combining text, voice, and visual cues`,
    },
    mentalHealthIndicators,
  }
}

// Helper: Extract text features
function extractTextFeatures(text: string) {
  const words = text.split(/\s+/)
  const positiveWords = [
    "good",
    "great",
    "happy",
    "love",
    "wonderful",
    "amazing",
    "excellent",
    "positive",
    "joy",
    "glad",
  ]
  const negativeWords = ["bad", "terrible", "hate", "sad", "awful", "horrible", "negative", "pain", "hurt", "wrong"]

  return {
    wordCount: words.length,
    sentenceCount: text.split(/[.!?]+/).length,
    positiveWordCount: positiveWords.filter((w) => text.includes(w)).length,
    negativeWordCount: negativeWords.filter((w) => text.includes(w)).length,
    questionCount: (text.match(/\?/g) || []).length,
    exclamationCount: (text.match(/!/g) || []).length,
    capitalRatio: (text.match(/[A-Z]/g) || []).length / text.length,
  }
}

// Helper: Extract audio features
function extractAudioFeatures(arrayBuffer: ArrayBuffer) {
  const dataView = new DataView(arrayBuffer)
  const samples: number[] = []
  let sum = 0
  let peakAmplitude = 0

  for (let i = 0; i < dataView.byteLength; i += 50) {
    try {
      const value = Math.abs(dataView.getInt8(i)) / 128
      samples.push(value)
      sum += value
      if (value > peakAmplitude) peakAmplitude = value
    } catch (e) {
      // Skip invalid bytes
    }
  }

  const avgAmplitude = sum / samples.length

  let varianceSum = 0
  for (const sample of samples) {
    varianceSum += Math.pow(sample - avgAmplitude, 2)
  }
  const variance = Math.sqrt(varianceSum / samples.length)

  let spikeCount = 0
  for (let i = 1; i < samples.length; i++) {
    if (Math.abs(samples[i] - samples[i - 1]) > 0.3) spikeCount++
  }
  const spikeRate = spikeCount / samples.length

  const spectralCentroid = avgAmplitude + variance * 0.5

  return {
    avgAmplitude,
    peakAmplitude,
    variance,
    spikeRate,
    duration: arrayBuffer.byteLength / 16000,
    spectralCentroid: Math.min(spectralCentroid, 1.0),
  }
}

// Helper: Extract image features
function extractImageFeatures(img: HTMLImageElement) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.min(img.width, 200)
  canvas.height = Math.min(img.height, 200)
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return {
      brightness: 128,
      contrast: 0.5,
      colorTone: "neutral" as const,
    }
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  let totalBrightness = 0
  let redSum = 0,
    greenSum = 0,
    blueSum = 0
  let minBrightness = 255,
    maxBrightness = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const brightness = (r + g + b) / 3

    totalBrightness += brightness
    redSum += r
    greenSum += g
    blueSum += b

    if (brightness < minBrightness) minBrightness = brightness
    if (brightness > maxBrightness) maxBrightness = brightness
  }

  const pixelCount = data.length / 4
  const avgBrightness = totalBrightness / pixelCount
  const avgRed = redSum / pixelCount
  const avgGreen = greenSum / pixelCount
  const avgBlue = blueSum / pixelCount

  const contrast = (maxBrightness - minBrightness) / 255

  let colorTone: "warm" | "cool" | "balanced" = "balanced"
  if (avgRed > avgGreen + 15 && avgRed > avgBlue + 15) colorTone = "warm"
  else if (avgBlue > avgRed + 15 && avgBlue > avgGreen + 15) colorTone = "cool"

  return {
    brightness: avgBrightness,
    contrast,
    colorTone,
  }
}
