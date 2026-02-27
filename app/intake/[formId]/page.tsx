'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FormQuestion } from '@/lib/forms'
import { ProgressIndicator } from '@/components/intake/ProgressIndicator'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function IntakeFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [formExists, setFormExists] = useState<boolean | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkForm() {
      try {
        const { data, error } = await supabase
          .from('intake_forms')
          .select('*')
          .eq('share_link', formId)
          .single()

        if (error || !data) {
          setFormExists(false)
        } else {
          setFormExists(true)
          setFormData(data)
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

  const questions: FormQuestion[] = formData?.questions || []

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentQuestionIndex === 0) {
      setCurrentQuestionIndex(-1)
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
      console.log('📊 LeadVett Rule Engine analyzing...')

      // STEP 1: Analyze the lead
      const analysisResponse = await fetch('/api/analyze-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          questions, // Send questions so AI knows the context
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze lead')
      }

      const { analysis } = await analysisResponse.json()
      
      console.log('✅ Verdict:', analysis.badge, '| Action:', analysis.action)

      // STEP 2: Save lead with full analysis
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

      console.log('💾 Lead saved successfully')

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

  // Show name/email collection
  if (currentQuestionIndex === -1) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 py-8 md:py-4">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {formData.form_name || 'Get Started'}
            </h1>
            {formData.instructions && (
              <p className="text-muted-foreground mb-4">
                {formData.instructions}
              </p>
            )}
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
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8 md:py-4">
      <div className="w-full max-w-2xl space-y-6">
        <ProgressIndicator
          current={currentQuestionIndex + 1}
          total={questions.length}
        />

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (isLastQuestion) {
                handleSubmit()
              } else {
                handleNext()
              }
            }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {currentQuestion.question}
                {currentQuestion.required && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </h2>

              {/* Text Input */}
              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  required={currentQuestion.required}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type your answer here..."
                />
              )}

              {/* Textarea */}
              {currentQuestion.type === 'textarea' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  required={currentQuestion.required}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type your answer here..."
                />
              )}

              {/* Number Input */}
              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  required={currentQuestion.required}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter a number..."
                />
              )}

              {/* Dropdown */}
              {currentQuestion.type === 'dropdown' && (
                <select
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  required={currentQuestion.required}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select an option...</option>
                  {currentQuestion.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={
                  submitting ||
                  (currentQuestion.required && !answers[currentQuestion.id]?.trim())
                }
                className="ml-auto flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Submitting...
                  </>
                ) : isLastQuestion ? (
                  'Submit'
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}