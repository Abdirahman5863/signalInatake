import { FormQuestion } from './forms'

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function validateQuestions(value: unknown): value is FormQuestion[] {
  if (!Array.isArray(value) || !value.length || value.length > 20) return false
  const ids = new Set<string>()
  return value.every(q => {
    if (!q || typeof q !== 'object' || typeof q.id !== 'string' || !/^[\w-]{1,80}$/.test(q.id) || ids.has(q.id) || ['__proto__','constructor','prototype'].includes(q.id)) return false
    ids.add(q.id)
    return typeof q.question === 'string' && q.question.length > 0 && q.question.length <= 500 && typeof q.required === 'boolean' &&
      ['text','textarea','number','dropdown'].includes(q.type) &&
      (q.type !== 'dropdown' || (Array.isArray(q.options) && q.options.length > 0 && q.options.length <= 50 && q.options.every((o:unknown) => typeof o === 'string' && o.length > 0 && o.length <= 200)))
  })
}
export function validateAnswers(raw: unknown, questions: FormQuestion[]): Record<string,string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Answers must be an object.')
  const answers: Record<string,string> = Object.create(null)
  for (const q of questions) {
    const entry = (raw as Record<string,unknown>)[q.id]
    if (entry !== undefined && typeof entry !== 'string') throw new Error(`Invalid answer for: ${q.question}`)
    const value = (entry as string | undefined)?.trim() ?? ''
    if (value.length > 3000) throw new Error(`Please shorten your answer to: ${q.question}`)
    if (q.required && !value) throw new Error(`Please answer: ${q.question}`)
    if (value && q.type === 'dropdown' && !q.options?.includes(value)) throw new Error(`Invalid option for: ${q.question}`)
    if (value && q.type === 'number' && (!/^-?\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value)))) throw new Error(`Please enter a number for: ${q.question}`)
    if (value) answers[q.id] = value
  }
  return answers
}
export function safeBookingUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : null } catch { return null }
}
