export interface IAiQuizAnswers {
  budget: number
  frequency: string
  activity: string
  goal: string
  level: string
  trainerStyle: string
}

export interface IAiMessage {
  role: "user" | "assistant"
  content: string
}

export interface IAiTrainerRecommendation {
  id: number
  name: string
  category: string
  description: string | null
  teachingStyle: string | null
  thumbnail: string | null
  locationSlug: string | null
}

export interface IAiRecommendation {
  subscriptionId: number
  reason: string
  trainer?: IAiTrainerRecommendation
  trainerReason?: string
}

export type AiRetentionTrigger =
  | "INACTIVE_7"
  | "INACTIVE_14"
  | "INACTIVE_30"
  | "EXPIRING_7"
  | "EXPIRED_3"

export interface IAiRetentionLog {
  id: string
  userId: string
  triggerType: AiRetentionTrigger
  sentAt: Date
  emailSubject: string
}

export interface IClientProfileData {
  reason: string
  injuries: string
  medicalRestrictions: string
  fitnessGoal: string
  experienceLevel: string
  daysPerWeek: number
  preferredHours: string
  aiSummary: string
}
