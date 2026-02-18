'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FORM_QUESTIONS, type FormAnswers, type QuestionId } from '@/lib/forms'
import { QuestionCard } from '@/components/intake/QuestionCard'
import { ProgressIndicator } from '@/components/intake/ProgressIndicator'

export default function IntakeFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [formExists, setFormExists] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<FormAnswers>({
    trigger: '',
    budget: '',
    timeline: '',
    decision_maker: '',
    tried: '',
  })
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkForm() {
      try {
        const { data, error } = await supabase
          .from('intake_forms')
          .select('id')
          .eq('share_link', formId)
          .single()

        if (error || !data) {
          setFormExists(false)
        } else {
          setFormExists(true)
        }
      } catch (err) {
        setFormExists(false)
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      checkForm()
    }
  }, [formId])

  const handleAnswerChange = (questionId: QuestionId, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < FORM_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }
const handleSubmit = async () => {
  if (!leadName.trim() || !leadEmail.trim()) {
    setError('Please provide your name and email')
    return
  }

  setSubmitting(true)
  setError(null)

  try {
    // Get form ID from share_link
    const { data: formData, error: formError } = await supabase
      .from('intake_forms')
      .select('id')
      .eq('share_link', formId)
      .single()

    if (formError || !formData) {
      throw new Error('Form not found')
    }

    console.log('📊 LeadVett Rule Engine analyzing...')

    // STEP 1: Analyze the lead FIRST
    const analysisResponse = await fetch('/api/analyze-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
      }),
    })

    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze lead')
    }

    const { analysis } = await analysisResponse.json()
    
    console.log('✅ Verdict:', analysis.badge, '| Action:', analysis.action)

    // STEP 2: Save lead WITH all analysis data
    const { error: insertError } = await supabase
      .from('lead_responses')
      .insert({
        form_id: formData.id,
        lead_name: leadName.trim(),
        lead_email: leadEmail.trim(),
        answers: answers,
        badge: analysis.badge,
        summary: analysis.summary,
        strengths: analysis.strengths,
        risks: analysis.risks,
        dm_script: analysis.dmScript,
        action: analysis.action,
        rule_breakdown: analysis.ruleBreakdown,
        hard_rule_triggered: analysis.hardRuleTriggered,
        confidence_score: analysis.confidenceScore,
        confidence_level: analysis.confidenceLevel,
      })

    if (insertError) throw insertError

    console.log('💾 Lead saved successfully with full analysis')

    // Redirect to thank you page
    router.push(`/intake/${formId}/thank-you`)
    
  } catch (err: any) {
    console.error('❌ Submission error:', err)
    setError(err.message || 'An error occurred while submitting your response')
  } finally {
    setSubmitting(false)
  }
}
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading form...</div>
        </div>
      </div>
    )
  }

  if (!formExists) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground">
            This intake form does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  // Show name/email collection before questions
  if (currentQuestionIndex === -1) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 py-8 md:py-4">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Get Started</h1>
            <p className="text-muted-foreground">
              Please provide your contact information to continue
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (leadName.trim() && leadEmail.trim()) {
                setCurrentQuestionIndex(0)
              }
            }}
            className="space-y-4"
          >
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="leadName" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                id="leadName"
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="leadEmail" className="block text-sm font-medium mb-2">
                Your Email
              </label>
              <input
                id="leadEmail"
                type="email"
                required
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  const currentQuestion = FORM_QUESTIONS[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === FORM_QUESTIONS.length - 1

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8 md:py-4">
      <div className="w-full max-w-2xl space-y-6">
        <ProgressIndicator
          current={currentQuestionIndex + 1}
          total={FORM_QUESTIONS.length}
        />

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <QuestionCard
            questionId={currentQuestion.id}
            value={answers[currentQuestion.id]}
            onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            onNext={isLastQuestion ? handleSubmit : handleNext}
            onBack={handleBack}
            isFirst={currentQuestionIndex === 0}
            isLast={isLastQuestion}
          />

          {submitting && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Submitting...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

