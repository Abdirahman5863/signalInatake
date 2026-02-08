export function generateShareLink(): string {
  // Generate a UUID-based share link (browser-compatible)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const FORM_QUESTIONS = [
  {
    id: 'trigger',
    question: "What triggered you to look for help now?",
    type: 'text',
    required: true,
  },
  {
    id: 'budget',
    question: "What's your monthly budget?",
    type: 'dropdown',
    required: true,
    options: ['<$1k', '$1k-$5k', '$5k-$10k', '$10k+'],
  },
  {
    id: 'timeline',
    question: "What's your timeline?",
    type: 'dropdown',
    required: true,
    options: ['ASAP', '1-2 weeks', '1 month', '2-3 months', '3+ months'],
  },
  {
    id: 'decision_maker',
    question: 'Who decides?',
    type: 'text',
    required: true,
  },
  {
    id: 'tried',
    question: 'What have you tried?',
    type: 'text',
    required: true,
  },
] as const

export type QuestionId = typeof FORM_QUESTIONS[number]['id']
export type FormAnswers = Record<QuestionId, string>

