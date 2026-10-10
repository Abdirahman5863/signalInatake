export function generateShareLink(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface FormQuestion {
  id: string
  question: string
  type: 'text' | 'dropdown' | 'textarea' | 'number'
  required: boolean
  options?: string[] // For dropdown type
  order: number
  purpose?: QuestionPurpose
}

export type QuestionPurpose = 'general' | 'budget' | 'timeline' | 'authority' | 'need' | 'service'

export interface QualificationPolicy {
  minBudget: number | null
  goldThreshold: number
  silverThreshold: number
  manualReviewConfidence: number
  currency?: 'USD' | 'KES' | 'GBP' | 'EUR'
  budgetBasis?: 'project' | 'monthly'
  supportedServices?: string[]
}

export interface ResultMessages {
  gold: string
  silver: string
  bronze: string
  manualReview: string
}

export const DEFAULT_QUALIFICATION_POLICY: QualificationPolicy = {
  minBudget: 3000,
  goldThreshold: 75,
  silverThreshold: 50,
  manualReviewConfidence: 45,
  currency: 'USD',
  budgetBasis: 'project',
  supportedServices: [],
}

export const DEFAULT_RESULT_MESSAGES: ResultMessages = {
  gold: 'You look like a strong fit. Choose a time that works for you.',
  silver: 'Thanks — your answers are being reviewed and we will follow up shortly.',
  bronze: 'Thanks for sharing the details. We will keep you in mind as the fit develops.',
  manualReview: 'Thanks — we need a quick human review before recommending the next step.',
}

export const DEFAULT_QUESTIONS: FormQuestion[] = [
  {
    id: 'trigger',
    question: 'What are you building or changing on your website?',
    type: 'text',
    required: true,
    order: 1,
    purpose: 'need'
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    type: 'dropdown',
    required: true,
    options: ['<1k', '1k-3k', '3k-5k', '5k-10k', '10k+', 'Not sure yet'],
    order: 2,
    purpose: 'budget'
  },
  {
    id: 'timeline',
    question: "What's your timeline?",
    type: 'dropdown',
    required: true,
    options: ['ASAP', '1-2 weeks', '1 month', '2-3 months', '3+ months'],
    order: 3,
    purpose: 'timeline'
  },
  {
    id: 'decision_maker',
    question: 'Who approves the project?',
    type: 'dropdown',
    options: ['I decide', 'Me and a partner', 'A team or committee', 'I am researching for someone else'],
    required: true,
    order: 4,
    purpose: 'authority'
  },
  {
    id: 'service',
    question: 'Which service do you need?',
    type: 'dropdown',
    options: ['Website design', 'Website development', 'E-commerce', 'Other / not sure'],
    required: true,
    order: 5,
    purpose: 'service'
  },
]

// Legacy support - keep for backward compatibility
export const FORM_QUESTIONS = DEFAULT_QUESTIONS
export type QuestionId = string // Changed from literal union to string
export type FormAnswers = Record<string, string>
