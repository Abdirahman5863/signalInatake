'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateShareLink, DEFAULT_QUESTIONS, FormQuestion } from '@/lib/forms'
import { ArrowLeft, Save, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { FormBuilder } from '@/components/forms/FormBuilder'

const TRIAL_DAYS = 3
const FREE_FORMS_LIMIT = 1

export default function NewFormPage() {
  const router = useRouter()
  const [formName, setFormName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [questions, setQuestions] = useState<FormQuestion[]>(DEFAULT_QUESTIONS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Access control states
  const [checking, setChecking] = useState(true)
  const [canCreate, setCanCreate] = useState(false)
  const [accessInfo, setAccessInfo] = useState<{
    hasSubscription: boolean
    inTrial: boolean
    trialDaysLeft: number
    formCount: number
    reason?: string
  } | null>(null)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Check subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single()

      const hasActiveSubscription = subscription?.status === 'active'

      // Check form count
      const { count: formCount } = await supabase
        .from('intake_forms')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Check trial
      let inTrial = false
      let trialDaysLeft = 0
      
      if (!hasActiveSubscription) {
        const signupDate = new Date(user.created_at)
        const now = new Date()
        const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
        trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)
        inTrial = trialDaysLeft > 0
      }

      // Determine if user can create form
      let allowed = false
      let reason = ''

      if (hasActiveSubscription) {
        allowed = true
        reason = 'subscription'
      } else if (inTrial && (formCount || 0) < FREE_FORMS_LIMIT) {
        allowed = true
        reason = 'trial'
      } else if (inTrial && (formCount || 0) >= FREE_FORMS_LIMIT) {
        allowed = false
        reason = 'trial_limit_reached'
      } else {
        allowed = false
        reason = 'trial_expired'
      }

      setAccessInfo({
        hasSubscription: hasActiveSubscription,
        inTrial,
        trialDaysLeft,
        formCount: formCount || 0,
        reason
      })
      setCanCreate(allowed)
      setChecking(false)

    } catch (err) {
      console.error('Access check error:', err)
      setChecking(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('You must be logged in to create a form')
    }

    if (!canCreate) {
      throw new Error('You need an active subscription to create more forms')
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

    // Refresh the forms page data
    router.refresh() // Add this line
    router.push('/dashboard/forms')
  } catch (error: any) {
    setError(error.message || 'An error occurred while creating the form')
  } finally {
    setLoading(false)
  }
}

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const { data: { user } } = await supabase.auth.getUser()

  //     if (!user) {
  //       throw new Error('You must be logged in to create a form')
  //     }

  //     // Double-check access before creating
  //     if (!canCreate) {
  //       throw new Error('You need an active subscription to create more forms')
  //     }

  //     const shareLink = generateShareLink()

  //     const { error: insertError } = await supabase
  //       .from('intake_forms')
  //       .insert({
  //         user_id: user.id,
  //         form_name: formName,
  //         share_link: shareLink,
  //         instructions: instructions || null,
  //         questions: questions,
  //       })

  //     if (insertError) throw insertError

  //     router.push('/dashboard')
  //   } catch (error: any) {
  //     setError(error.message || 'An error occurred while creating the form')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Checking access...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ"></script>
      <script dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6QJQ6KGNJ');
      `}}></script>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Trial Warning Banner */}
      {accessInfo && accessInfo.inTrial && !accessInfo.hasSubscription && canCreate && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Trial Mode: {accessInfo.trialDaysLeft} {accessInfo.trialDaysLeft === 1 ? 'day' : 'days'} left
              </p>
              <p className="text-xs text-blue-700">
                You can create {FREE_FORMS_LIMIT} form during your trial. 
                Forms created: {accessInfo.formCount}/{FREE_FORMS_LIMIT}.{' '}
                <Link href="/pricing" className="underline font-semibold">
                  Subscribe for unlimited forms
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Access Blocked - Trial Limit Reached */}
      {!canCreate && accessInfo?.reason === 'trial_limit_reached' && (
        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 text-lg mb-2">
                Trial Form Limit Reached
              </h3>
              <p className="text-sm text-orange-700 mb-4">
                You've created your {FREE_FORMS_LIMIT} trial form. Subscribe to LeadVett Pro to create unlimited forms and qualify unlimited leads.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-orange-800">
                  <strong>What you get with Pro:</strong>
                </p>
                <ul className="text-xs text-orange-700 space-y-1 ml-4">
                  <li>• Unlimited forms</li>
                  <li>• Unlimited lead analysis</li>
                  <li>• AI-generated DM scripts</li>
                  <li>• Advanced analytics</li>
                  <li>• {accessInfo.trialDaysLeft} days left in trial</li>
                </ul>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
              >
                Subscribe Now - $49/month
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Access Blocked - Trial Expired */}
      {!canCreate && accessInfo?.reason === 'trial_expired' && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-lg mb-2">
                Your 3-Day Trial Has Expired
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Subscribe to LeadVett Pro to continue creating forms and qualifying leads.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Subscribe Now - $49/month
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Form Creation UI - Only show if access allowed */}
      {canCreate && (
        <>
          <div>
            <h1 className="text-3xl font-bold">Create New Form</h1>
            <p className="text-muted-foreground mt-2">
              Customize your lead qualification form with your own questions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
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
        </>
      )}
    </div>
  )
}