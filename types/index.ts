export type Plan = 'basic' | 'pro' | 'elite'

export type ScanType = 'single' | 'comparison'

export interface User {
  id: string
  email: string
  plan: Plan
  credits: number
  created_at: string
}

export interface Scan {
  id: string
  user_id: string
  scan_type: ScanType
  current_image_url: string
  goal_image_url?: string
  credits_used: number
  status: 'pending' | 'processing' | 'complete' | 'failed'
  result?: AnalysisResult
  created_at: string
}

export interface MuscleAnalysis {
  chest: string
  back: string
  shoulders: string
  arms: string
  core: string
  legs: string
  overall_impression: string
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: {
    name: string
    sets: string
    reps: string
    notes?: string
  }[]
}

export interface DietPlan {
  calories_estimate: string
  protein_target: string
  carbs_target: string
  fats_target: string
  meal_timing: string
  foods_to_prioritize: string[]
  foods_to_limit: string[]
  supplements?: string[]
}

export interface GapAnalysis {
  current_state: string
  goal_state: string
  primary_gaps: string[]
  training_focus: string[]
  realistic_timeline: string
  key_milestones: string[]
}

export interface AnalysisResult {
  summary: string
  body_fat_estimate: string
  muscle_analysis: MuscleAnalysis
  priority_focus: string[]
  workout_plan: WorkoutDay[]
  diet_plan: DietPlan
  timeline: string
  gap_analysis?: GapAnalysis
  disclaimer: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'debit' | 'credit'
  description: string
  scan_id?: string
  created_at: string
}

export const PLAN_CREDITS: Record<Plan, number> = {
  basic: 15,
  pro: 50,
  elite: 150,
}

export const PLAN_PRICES: Record<Plan, number> = {
  basic: 5.99,
  pro: 9.99,
  elite: 19.99,
}

export const SCAN_COSTS: Record<ScanType, number> = {
  single: 1,
  comparison: 4,
}
