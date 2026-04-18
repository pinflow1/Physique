import OpenAI from 'openai'
import { AnalysisResult } from '@/types'

// Only instantiate client on server — key is never exposed to client
const getClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a professional fitness assessment AI. Analyze physique images and generate personalized fitness plans.

STRICT RULES — violations are unacceptable:
1. NEVER make medical claims or diagnoses of any kind
2. ALWAYS use hedging language: "estimated", "appears to", "visual assessment suggests", "approximately"  
3. Body fat MUST be a range e.g. "18–22%" followed by "(visual estimate only — not a medical measurement)"
4. NEVER claim exact body fat, muscle mass, or any clinical measurement
5. Be honest and realistic about timelines — do not over-promise
6. Respond ONLY with valid JSON. No markdown fences, no extra text, no explanation.`

const ANALYSIS_SCHEMA = `{
  "summary": "2–3 sentence overall physique assessment",
  "body_fat_estimate": "XX–XX% (visual estimate only — not a medical measurement)",
  "muscle_analysis": {
    "chest": "assessment and recommended action",
    "back": "assessment and recommended action",
    "shoulders": "assessment and recommended action",
    "arms": "assessment and recommended action",
    "core": "assessment and recommended action",
    "legs": "assessment and recommended action",
    "overall_impression": "overall physique balance note"
  },
  "priority_focus": ["3–5 specific, actionable priorities"],
  "workout_plan": [
    {
      "day": "Monday",
      "focus": "muscle group focus",
      "exercises": [
        { "name": "Exercise Name", "sets": "4", "reps": "6–8", "notes": "form tip" }
      ]
    }
  ],
  "diet_plan": {
    "calories_estimate": "XXXX–XXXX kcal/day (adjust based on weekly weight change)",
    "protein_target": "XXXg per day",
    "carbs_target": "XXXg per day",
    "fats_target": "XXg per day",
    "meal_timing": "timing strategy description",
    "foods_to_prioritize": ["food items"],
    "foods_to_limit": ["food items"],
    "supplements": ["evidence-based only"]
  },
  "timeline": "realistic transformation timeline statement",
  "gap_analysis": null,
  "disclaimer": "This analysis is for general fitness guidance only and does not constitute medical advice. Consult a healthcare professional before starting any new diet or exercise program. Body composition figures are visual estimates only, not clinical measurements."
}`

const COMPARISON_SCHEMA = `{
  "summary": "2–3 sentence overall assessment comparing current vs goal",
  "body_fat_estimate": "XX–XX% (visual estimate only — not a medical measurement)",
  "muscle_analysis": {
    "chest": "assessment",
    "back": "assessment",
    "shoulders": "assessment",
    "arms": "assessment",
    "core": "assessment",
    "legs": "assessment",
    "overall_impression": "overall assessment"
  },
  "priority_focus": ["3–5 specific, actionable priorities"],
  "workout_plan": [
    {
      "day": "Monday",
      "focus": "focus area",
      "exercises": [
        { "name": "Exercise Name", "sets": "4", "reps": "8–10", "notes": "form tip" }
      ]
    }
  ],
  "diet_plan": {
    "calories_estimate": "XXXX–XXXX kcal/day",
    "protein_target": "XXXg per day",
    "carbs_target": "XXXg per day",
    "fats_target": "XXg per day",
    "meal_timing": "timing strategy",
    "foods_to_prioritize": ["foods"],
    "foods_to_limit": ["foods"],
    "supplements": ["evidence-based only"]
  },
  "timeline": "realistic timeline statement",
  "gap_analysis": {
    "current_state": "honest description of current physique from image",
    "goal_state": "description of goal physique from reference image",
    "primary_gaps": ["specific gaps that need to be closed"],
    "training_focus": ["specific training priorities to reach goal"],
    "realistic_timeline": "honest, specific timeline e.g. 12–18 months",
    "key_milestones": ["Month 1–2: ...", "Month 4: ...", "Month 6: ...", "Month 12: ..."]
  },
  "disclaimer": "This analysis is for general fitness guidance only and does not constitute medical advice. Consult a healthcare professional before starting any new diet or exercise program. Body composition figures are visual estimates only, not clinical measurements."
}`

export async function analyzePhysique(
  currentImageBase64: string,
  currentImageMime: string,
  goalImageBase64?: string,
  goalImageMime?: string
): Promise<AnalysisResult> {
  const client = getClient()
  const isComparison = !!(goalImageBase64 && goalImageMime)

  // Build message content array with correct OpenAI SDK types
  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = []

  if (isComparison) {
    userContent.push({
      type: 'text',
      text: `Analyze these two physique images. Image 1 = CURRENT physique. Image 2 = GOAL physique.

Generate a gap analysis, workout plan, and diet plan specifically tailored to help this person bridge the gap from their current to their goal physique.

Use only visual assessment language. Never make medical claims. Respond with JSON matching this exact schema:
${COMPARISON_SCHEMA}`,
    })
    userContent.push({
      type: 'image_url',
      image_url: {
        url: `data:${currentImageMime};base64,${currentImageBase64}`,
        detail: 'high',
      },
    })
    userContent.push({
      type: 'image_url',
      image_url: {
        url: `data:${goalImageMime};base64,${goalImageBase64}`,
        detail: 'high',
      },
    })
  } else {
    userContent.push({
      type: 'text',
      text: `Analyze this physique image and generate a comprehensive, personalized fitness plan.

Use only visual assessment language. Never make medical claims. Respond with JSON matching this exact schema:
${ANALYSIS_SCHEMA}`,
    })
    userContent.push({
      type: 'image_url',
      image_url: {
        url: `data:${currentImageMime};base64,${currentImageBase64}`,
        detail: 'high',
      },
    })
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4000,
    temperature: 0.4, // Lower temp = more consistent structured output
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from OpenAI')
  }

  let parsed: AnalysisResult
  try {
    parsed = JSON.parse(content) as AnalysisResult
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  // Enforce required fields exist
  if (!parsed.summary || !parsed.muscle_analysis || !parsed.workout_plan || !parsed.diet_plan) {
    throw new Error('AI response missing required fields')
  }

  // Always override disclaimer — never let the AI weaken it
  parsed.disclaimer =
    'This analysis is for general fitness guidance only and does not constitute medical advice. ' +
    'Consult a qualified healthcare professional before starting any new diet or exercise program. ' +
    'Body composition figures are visual estimates only, not clinical measurements.'

  return parsed
}

export async function compressImageToBase64(
  buffer: Buffer,
  mimeType: string
): Promise<{ base64: string; mime: string }> {
  try {
    const sharp = (await import('sharp')).default
    const instance = sharp(buffer)
    const meta = await instance.metadata()

    let processed = instance
    if ((meta.width ?? 0) > 1024 || (meta.height ?? 0) > 1024) {
      processed = instance.resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    }

    const compressed = await processed.jpeg({ quality: 85 }).toBuffer()
    return { base64: compressed.toString('base64'), mime: 'image/jpeg' }
  } catch (err) {
    // If sharp fails (e.g. corrupt image), return original
    console.warn('Sharp compression failed, using original:', err)
    return { base64: buffer.toString('base64'), mime: mimeType }
  }
}
