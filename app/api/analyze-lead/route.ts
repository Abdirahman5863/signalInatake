import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { analyzeLead } from '@/lib/ai/analyze'
import { DEFAULT_QUALIFICATION_POLICY, DEFAULT_RESULT_MESSAGES, FormQuestion, QualificationPolicy, ResultMessages } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'

type FormRecord = { id: string; user_id: string; questions: FormQuestion[]; qualification_policy: Partial<QualificationPolicy> | null; booking_url: string | null; result_messages: Partial<ResultMessages> | null }

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const formId = typeof body.formId === 'string' ? body.formId : ''
    if (!formId || !body.answers || typeof body.answers !== 'object') return NextResponse.json({ error: 'A form and answers are required.' }, { status: 400 })

    const { data: form, error: formError } = await supabase.from('intake_forms').select('id, user_id, questions, qualification_policy, booking_url, result_messages').eq('id', formId).single<FormRecord>()
    if (formError || !form) return NextResponse.json({ error: 'Form not found.' }, { status: 404 })

    const questions = Array.isArray(form.questions) ? form.questions : []
    const validation = validateAnswers(body.answers, questions)
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 })

    const policy = { ...DEFAULT_QUALIFICATION_POLICY, ...(form.qualification_policy || {}) }
    if (policy.silverThreshold >= policy.goldThreshold) return NextResponse.json({ error: 'This form has an invalid qualification policy.' }, { status: 422 })

    const leadEmail = cleanText(body.leadEmail, 254)
    if (!/^\S+@\S+\.\S+$/.test(leadEmail)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })

    const analysis = await analyzeLead(validation.answers, questions, policy)
    const { data: lead, error: leadError } = await supabase.from('lead_responses').insert({
      form_id: form.id,
      lead_email: leadEmail,
      lead_name: cleanText(body.leadName, 120) || 'Unknown Lead',
      answers: validation.answers,
      badge: analysis.badge,
      confidence_score: analysis.confidenceScore,
      confidence_level: analysis.confidenceLevel,
      summary: analysis.summary,
      strengths: analysis.strengths,
      risks: analysis.risks,
      dm_script: analysis.dmScript,
      action: analysis.action,
      rule_breakdown: analysis.ruleBreakdown,
      hard_rule_triggered: analysis.hardRuleTriggered || null,
      ai_analysis: {}, status: 'new', qualification_status: analysis.qualificationStatus, pipeline_status: 'new',
    }).select('id').single()

    if (leadError) {
      console.error('Failed to save lead:', leadError)
      return NextResponse.json({ error: 'Failed to save this submission.' }, { status: 500 })
    }

    const messages = { ...DEFAULT_RESULT_MESSAGES, ...(form.result_messages || {}) }
    const result = buildPublicResult(analysis.qualificationStatus, messages, form.booking_url)
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/leads')
    return NextResponse.json({ success: true, leadId: lead.id, result })
  } catch (error) {
    console.error('LeadVett analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}

function validateAnswers(raw: Record<string, unknown>, questions: FormQuestion[]): { ok: true; answers: Record<string, string> } | { ok: false; error: string } {
  const answers: Record<string, string> = {}
  for (const question of questions) {
    const value = cleanText(raw[question.id], 3000)
    if (question.required && !value) return { ok: false, error: `Please answer: ${question.question}` }
    if (value && question.type === 'dropdown' && question.options && !question.options.includes(value)) return { ok: false, error: `Invalid answer for: ${question.question}` }
    if (value) answers[question.id] = value
  }
  return { ok: true, answers }
}

function cleanText(value: unknown, maxLength: number): string { return typeof value === 'string' ? value.trim().slice(0, maxLength) : '' }

function buildPublicResult(status: string, messages: ResultMessages, bookingUrl: string | null) {
  if (status === 'ready_to_book') return { status, title: 'You are a strong fit', message: messages.gold, bookingUrl: safeUrl(bookingUrl) }
  if (status === 'nurture') return { status, title: 'Thanks — we have your details', message: messages.silver }
  if (status === 'manual_review') return { status, title: 'One quick review needed', message: messages.manualReview }
  return { status: 'not_a_fit', title: 'Thanks for your time', message: messages.bronze }
}

function safeUrl(value: string | null): string | null {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === 'https:' ? url.toString() : null } catch { return null }
}
