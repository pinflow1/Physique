import { AnalysisResult } from '@/types'

export const DEMO_RESULT: AnalysisResult = {
  summary:
    "Based on visual assessment, you have a mesomorphic build with a solid foundation of muscle mass. Your upper body shows reasonable development, particularly in the chest and shoulders, while your lower body and posterior chain present the most significant opportunity for growth. Core definition suggests moderate body composition with room for improvement through targeted training and nutrition adjustments.",
  body_fat_estimate: "Estimated 18–22% (visual assessment only — not a medical measurement)",
  muscle_analysis: {
    chest: "Moderate development. Good width but lacking upper chest fullness. Priority: incline pressing movements.",
    back: "Underdeveloped relative to chest — common imbalance. Thickness and width both need attention. Priority: vertical and horizontal pulls.",
    shoulders: "Front delts reasonably developed (likely from pressing). Lateral and rear delts lagging. Priority: lateral raises, face pulls.",
    arms: "Proportionate to current physique. Biceps show reasonable peak; triceps could add more mass for overall arm size.",
    core: "Functional strength likely present but definition limited by current body composition. Priority: reduce overall body fat while maintaining muscle.",
    legs: "Significantly underdeveloped relative to upper body. Quads and hamstrings both need volume. Priority: compound leg work 2x per week minimum.",
    overall_impression: "Classic 'beach muscles' pattern — upper body prioritized over lower. Addressing this imbalance will dramatically improve overall physique symmetry.",
  },
  priority_focus: [
    "Bring up lower body to match upper body development",
    "Address posterior chain (back, rear delts, hamstrings)",
    "Reduce body fat by 4–6% to reveal existing muscle",
    "Fix shoulder imbalance to prevent long-term injury",
  ],
  workout_plan: [
    {
      day: "Monday",
      focus: "Push (Chest / Shoulders / Triceps)",
      exercises: [
        { name: "Incline Barbell Press", sets: "4", reps: "6–8", notes: "Focus on upper chest activation" },
        { name: "Flat Dumbbell Press", sets: "3", reps: "10–12" },
        { name: "Seated Dumbbell Lateral Raises", sets: "4", reps: "12–15", notes: "Control the eccentric" },
        { name: "Cable Face Pulls", sets: "3", reps: "15–20", notes: "Rear delt priority" },
        { name: "Overhead Tricep Extension", sets: "3", reps: "10–12" },
      ],
    },
    {
      day: "Tuesday",
      focus: "Pull (Back / Biceps / Rear Delts)",
      exercises: [
        { name: "Weighted Pull-Ups", sets: "4", reps: "6–8", notes: "Full range of motion" },
        { name: "Barbell Rows", sets: "4", reps: "8–10" },
        { name: "Cable Lat Pulldown", sets: "3", reps: "10–12" },
        { name: "Seated Cable Row", sets: "3", reps: "12–15" },
        { name: "Barbell Curl", sets: "3", reps: "10–12" },
      ],
    },
    {
      day: "Wednesday",
      focus: "Legs (Quad Focus)",
      exercises: [
        { name: "Barbell Back Squat", sets: "4", reps: "6–8", notes: "This is your most important lift" },
        { name: "Leg Press", sets: "3", reps: "12–15" },
        { name: "Walking Lunges", sets: "3", reps: "12 each leg" },
        { name: "Leg Extension", sets: "3", reps: "15–20" },
        { name: "Standing Calf Raises", sets: "4", reps: "15–20" },
      ],
    },
    {
      day: "Thursday",
      focus: "Rest / Light Cardio",
      exercises: [
        { name: "30-min Zone 2 Cardio", sets: "1", reps: "30 min", notes: "Walking, cycling, or elliptical" },
        { name: "Foam Rolling & Stretching", sets: "1", reps: "15 min" },
      ],
    },
    {
      day: "Friday",
      focus: "Upper (Strength Focus)",
      exercises: [
        { name: "Overhead Press", sets: "4", reps: "6–8" },
        { name: "Weighted Dips", sets: "3", reps: "8–10" },
        { name: "T-Bar Row", sets: "4", reps: "8–10" },
        { name: "Dumbbell Shrugs", sets: "3", reps: "12–15" },
        { name: "Hammer Curls", sets: "3", reps: "10–12" },
      ],
    },
    {
      day: "Saturday",
      focus: "Legs (Posterior Chain Focus)",
      exercises: [
        { name: "Romanian Deadlift", sets: "4", reps: "8–10", notes: "Feel the hamstring stretch" },
        { name: "Leg Curl (Seated or Lying)", sets: "3", reps: "12–15" },
        { name: "Hip Thrust", sets: "4", reps: "10–12" },
        { name: "Bulgarian Split Squat", sets: "3", reps: "10 each leg" },
        { name: "Seated Calf Raises", sets: "4", reps: "15–20" },
      ],
    },
    {
      day: "Sunday",
      focus: "Rest",
      exercises: [
        { name: "Active Recovery", sets: "1", reps: "Optional", notes: "Light walk, yoga, or complete rest" },
      ],
    },
  ],
  diet_plan: {
    calories_estimate: "2,800–3,100 kcal/day (adjust based on weekly weight changes)",
    protein_target: "175–190g per day (primary lever for muscle building)",
    carbs_target: "300–350g per day (fuel training sessions)",
    fats_target: "70–85g per day (hormone health)",
    meal_timing: "Prioritize carbs around training (pre and post-workout). Protein spread evenly across 4–5 meals.",
    foods_to_prioritize: [
      "Chicken breast, turkey, lean beef",
      "Rice, oats, sweet potato, pasta",
      "Eggs and egg whites",
      "Greek yogurt, cottage cheese",
      "Broccoli, spinach, mixed greens",
      "Olive oil, avocado (fats)",
      "Berries, banana (around training)",
    ],
    foods_to_limit: [
      "Ultra-processed foods",
      "Alcohol (significantly impairs recovery)",
      "Excessive saturated fats",
      "High-sugar drinks and snacks",
    ],
    supplements: [
      "Creatine monohydrate 5g/day (strong evidence for strength + muscle)",
      "Protein powder as needed to hit daily target",
      "Vitamin D3 + K2 (especially if low sun exposure)",
      "Omega-3 fish oil 2–3g/day",
    ],
  },
  timeline: "With consistent training and nutrition, expect noticeable improvements in 8–12 weeks. Significant physique transformation typically requires 6–12 months of sustained effort.",
  disclaimer:
    "This analysis is for general fitness guidance only and does not constitute medical advice. Consult a healthcare professional before starting any new diet or exercise program. Body fat estimates are visual assessments only, not clinical measurements.",
}

export const DEMO_COMPARISON_RESULT: AnalysisResult = {
  ...DEMO_RESULT,
  gap_analysis: {
    current_state:
      "Solid mesomorphic base with approximately 18–22% estimated body fat. Good upper chest and shoulder width. Lower body and back significantly underdeveloped relative to stated goals.",
    goal_state:
      "Target physique shows approximately 10–12% estimated body fat with well-developed, proportional muscle across all major groups. Particular emphasis on full back development, capped shoulders, and strong legs.",
    primary_gaps: [
      "~6–10% estimated body fat reduction required",
      "Back needs significant volume increase (2–3x current development)",
      "Leg mass dramatically behind target — likely 18–24 months of focused work",
      "Shoulder roundness needs lateral and rear delt prioritization",
      "Core definition contingent on fat loss first",
    ],
    training_focus: [
      "Prioritize legs 2x per week — non-negotiable",
      "Add dedicated back day to current split",
      "Implement progressive overload tracking",
      "Add 2x weekly cardio for body composition",
    ],
    realistic_timeline: "12–24 months of consistent, optimized training and nutrition to meaningfully close the gap. The body fat difference alone requires 4–8 months.",
    key_milestones: [
      "Month 1–2: Establish training habits, optimize nutrition",
      "Month 3–4: Visible strength gains, first body composition changes",
      "Month 6: Noticeable physique improvement, lower body catching up",
      "Month 12: Significant transformation, ~60–70% toward goal",
      "Month 18–24: Goal physique achievable with sustained effort",
    ],
  },
}
