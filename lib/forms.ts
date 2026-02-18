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
}

export const DEFAULT_QUESTIONS: FormQuestion[] = [
  {
    id: 'trigger',
    question: "What triggered you to look for help now?",
    type: 'text',
    required: true,
    order: 1
  },
  {
    id: 'budget',
    question: "What's your monthly budget?",
    type: 'dropdown',
    required: true,
    options: ['<$1k', '$1k-$5k', '$5k-$10k', '$10k+'],
    order: 2
  },
  {
    id: 'timeline',
    question: "What's your timeline?",
    type: 'dropdown',
    required: true,
    options: ['ASAP', '1-2 weeks', '1 month', '2-3 months', '3+ months'],
    order: 3
  },
  {
    id: 'decision_maker',
    question: 'Who decides?',
    type: 'text',
    required: true,
    order: 4
  },
  {
    id: 'tried',
    question: 'What have you tried?',
    type: 'text',
    required: true,
    order: 5
  },
]

// Legacy support - keep for backward compatibility
export const FORM_QUESTIONS = DEFAULT_QUESTIONS
export type QuestionId = string // Changed from literal union to string
export type FormAnswers = Record<string, string>