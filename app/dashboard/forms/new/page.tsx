'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateShareLink, DEFAULT_QUESTIONS, FormQuestion } from '@/lib/forms'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { FormBuilder } from '@/components/forms/FormBuilder'

export default function NewFormPage() {
  const router = useRouter()
  const [formName, setFormName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [questions, setQuestions] = useState<FormQuestion[]>(DEFAULT_QUESTIONS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to create a form')
      }

      const shareLink = generateShareLink()

      const { error: insertError } = await supabase
        .from('intake_forms')
        .insert({
          user_id: user.id,
          form_name: formName,
          share_link: shareLink,
          instructions: instructions || null,
          questions: questions,
        })

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the form')
    } finally {
      setLoading(false)
    }
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

      <div>
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <p className="text-muted-foreground mt-2">
          Customize your lead qualification form with your own questions
        </p>
      </div>

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
              Form Name <span className="text-red-600">*</span>
            </label>
            <input
              id="formName"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g., Instagram Campaign Leads, Q1 2024 Intake"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Internal name to help you organize your forms
            </p>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium mb-2">
              Welcome Message (Optional)
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g., Thanks for your interest! Please answer these questions so we can better understand your needs..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will appear at the top of your form
            </p>
          </div>
        </div>

        {/* Form Builder */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Customize Your Questions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Edit the default questions, change dropdown options, add new questions, or reorder them as needed
            </p>
          </div>
          <FormBuilder 
            initialQuestions={questions}
            onUpdate={setQuestions}
          />
        </div>

        {/* Create Button */}
        <div className="flex gap-4 sticky bottom-0 bg-background py-4 border-t">
          <button
            type="submit"
            disabled={loading || !formName.trim() || questions.length === 0}
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Creating...' : 'Create Form'}
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