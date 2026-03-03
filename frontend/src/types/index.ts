export type Certification = 'PCEP' | 'PCAP' | 'PCPP1' | 'PCEI'
export type QuestionType = 'multiple_choice' | 'true_false' | 'code_snippet' | 'spot_the_bug'
export type MasteryStatus = 'not_started' | 'in_progress' | 'mastered'

export interface Question {
  id: string
  certification: Certification
  section: string
  objective: string
  type: QuestionType
  question_text: string
  code_snippet: string | null
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: 1 | 2 | 3
}

export interface AnswerResult {
  is_correct: boolean
  explanation: string
  correct_answer: string
}

export interface SessionState {
  session_id: string | null
  current_question: Question | null
  answer_result: AnswerResult | null
  selected_answer: string | null
  question_count: number
  correct_count: number
  loading: boolean
  error: string | null
}

export interface SessionProgress {
  weekly_seconds: number
  streak_days: number
  certifications: Record<string, { completion_pct?: number }>
  topic_mastery: Array<{
    section: string
    objective: string
    correct_count: number
    questions_seen: number
    mastery_status: MasteryStatus
  }>
}

export interface CertificationStatus {
  certification: string
  locked: boolean
  status: 'complete' | 'in_progress' | 'not_started'
  unlock_requires?: string
  completion_pct?: number
  total_questions?: number
}
