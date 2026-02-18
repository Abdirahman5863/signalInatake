'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { FormBuilder } from '@/components/forms/FormBuilder'
import { FormQuestion, DEFAULT_QUESTIONS } from '@/lib/forms'

export default function EditFormPage() {
  const router = useRouter()
  const params = useParams()
  const formId = params.formId as string

  const [formName, setFormName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [questions, setQuestions] = useState<FormQuestion[]>(DEFAULT_QUESTIONS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadForm() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: form, error: fetchError } = await supabase
          .from('intake_forms')
          .select('*')
          .eq('id', formId)
          .eq('user_id', user.id)
          .single()

        if (fetchError || !form) {
          setError('Form not found')
          return
        }

        setFormName(form.form_name)
        setInstructions(form.instructions || '')
        setQuestions(form.questions || DEFAULT_QUESTIONS)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [formId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: updateError } = await supabase
        .from('intake_forms')
        .update({ 
          form_name: formName,
          instructions: instructions,
          questions: questions
        })
        .eq('id', formId)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to update form')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error && !formName) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center text-destructive">{error}</div>
        <div className="text-center mt-4">
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold">Edit Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Form Settings */}
        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Form Settings</h2>
          
          <div>
            <label htmlFor="formName" className="block text-sm font-medium mb-2">
              Form Name
            </label>
            <input
              id="formName"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g., Q1 2024 Lead Intake"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium mb-2">
              Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Welcome message for your leads..."
            />
          </div>
        </div>

        {/* Form Builder */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <FormBuilder 
            initialQuestions={questions}
            onUpdate={setQuestions}
          />
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}