'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { FormQuestion } from '@/lib/forms'
import { ProgressIndicator } from '@/components/intake/ProgressIndicator'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function IntakeFormPage() {
  const params = useParams()
  const formId = params.formId as string

  const [formExists, setFormExists] = useState<boolean | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const submission = useRef<{ payload: string; key: string } | null>(null)
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submissionResult, setSubmissionResult] = useState<{ status: string; title: string; message: string; bookingUrl?: string | null } | null>(null)

  useEffect(() => {
    async function checkForm() {
      try {
        const response = await fetch(`/api/intake/${encodeURIComponent(formId)}`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Form unavailable')
        const data = await response.json()
        setFormData(data)
        setFormExists(true)
      } catch (err) {
        console.error('Form lookup error:', err)
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
      const payload = JSON.stringify({ answers, shareLink: formId, formVersion: formData.version, leadEmail: leadEmail.trim(), leadName: leadName.trim(), website })
      if (!submission.current || submission.current.payload !== payload) {
        submission.current = { payload, key: crypto.randomUUID() }
      }
      const response = await fetch('/api/analyze-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...JSON.parse(payload), submissionKey: submission.current.key }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to confirm receipt. Please retry.')
      const { result } = data
      setSubmissionResult(result)

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
          <div className="h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-lg">Loading form...</div>
        </div>
      </div>
    )
  }

  if (!formExists) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This intake form does not exist or has been removed.
          </p>
          <p className="text-sm text-gray-500">
            Form ID: <code className="bg-gray-100 px-2 py-1 rounded">{formId}</code>
          </p>
        </div>
      </div>
    )
  }

  if (submissionResult) {
    const canBook = submissionResult.status === 'ready_to_book' && submissionResult.bookingUrl
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f3eb] p-4">
        <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xl md:p-12">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#b99345] text-xl text-white">✓</div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9b762f]">Submission received</p>
          <h1 className="text-3xl font-semibold text-[#101010]">{submissionResult.title}</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-black/60">{submissionResult.message}</p>
          {canBook && (
            <a href={submissionResult.bookingUrl!} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#101010] px-7 py-3 font-medium text-white transition hover:bg-[#b99345]">
              Choose a time
            </a>
          )}
        </div>
      </div>
    )
  }

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

          <div className="hidden" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
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
                id="leadName" maxLength={120}
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
                id="leadEmail" maxLength={254}
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
            <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
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
              <h2 id="question-label" className="text-2xl font-semibold mb-4">
                {currentQuestion.question}
                {currentQuestion.required && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </h2>

              {currentQuestion.purpose === 'budget' && <p className="mb-3 text-sm text-muted-foreground">Budget in {formData.budget_currency}, {formData.budget_basis === 'monthly' ? 'per month' : 'for the whole project'}.</p>}
              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  maxLength={3000}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  aria-labelledby="question-label"
                  required={currentQuestion.required}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type your answer here..."
                />
              )}

              {currentQuestion.type === 'textarea' && (
                <textarea
                  maxLength={3000}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  aria-labelledby="question-label"
                  required={currentQuestion.required}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type your answer here..."
                />
              )}

              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  maxLength={3000}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  aria-labelledby="question-label"
                  required={currentQuestion.required}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter a number..."
                />
              )}

              {currentQuestion.type === 'dropdown' && (
                <select
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  aria-labelledby="question-label"
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
