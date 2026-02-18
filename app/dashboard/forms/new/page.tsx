'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateShareLink } from '@/lib/forms'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewFormPage() {
  const router = useRouter()
  const [formName, setFormName] = useState('')
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
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold">Create New Form</h1>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground mb-6">
          Your form will include these 5 proven qualification questions:
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-6 text-sm">
          <li>What triggered you to look for help now?</li>
          <li>What's your monthly budget? (dropdown)</li>
          <li>What's your timeline? (dropdown)</li>
          <li>Who decides? (text)</li>
          <li>What have you tried? (text)</li>
        </ol>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Form'}
            </button>
            <Link
              href="/dashboard"
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}