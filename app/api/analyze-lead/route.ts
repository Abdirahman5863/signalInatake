import { NextRequest, NextResponse } from 'next/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { FormQuestion } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const TRIAL_DAYS = 3

// Service role client — bypasses RLS, safe to use server-side only
const serviceSupabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { answers, questions, formId, leadEmail, leadName, isPublicSubmission } = body

    if (!answers || !questions) {
      return NextResponse.json(
        { error: 'Missing answers or questions' },
        { status: 400 }
      )
    }

    // ─── PUBLIC FORM SUBMISSION (no auth required) ───────────────────────────
    if (isPublicSubmission) {
      console.log('📝 Public form submission received')

      if (!formId) {
        return NextResponse.json(
          { error: 'Form ID required for public submissions' },
          { status: 400 }
        )
      }

      // Use service client to read form (bypasses RLS)
      const { data: form, error: formError } = await serviceSupabase
        .from('intake_forms')
        .select('user_id')
        .eq('id', formId)
        .single()

      if (formError || !form) {
        return NextResponse.json(
          { error: 'Form not found' },
          { status: 404 }
        )
      }

      const formOwnerId = form.user_id

      // Check form owner's subscription status
      const { data: subscription } = await serviceSupabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', formOwnerId)
        .single()

      const hasActiveSubscription =
        subscription?.status === 'active' &&
        new Date(subscription.current_period_end) > new Date()

      // Check trial status if no active subscription
      if (!hasActiveSubscription) {
        const { data: { user: formOwner } } = await supabase.auth.admin.getUserById(formOwnerId)

        if (formOwner) {
          const signupDate = new Date(formOwner.created_at)
          const now = new Date()
          const daysSinceSignup = Math.floor(
            (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)

          if (trialDaysLeft === 0) {
            console.log('❌ Form owner trial expired')
            return NextResponse.json(
              {
                error: "This form is no longer active. The owner's trial has expired.",
                formOwnerExpired: true,
              },
              { status: 403 }
            )
          }

          console.log(`⏰ Form owner in trial: ${trialDaysLeft} days left`)
        }
      }

      // Run AI analysis
      console.log('🤖 LeadVett AI analyzing public submission...')
      const analysis = await analyzeLead(
        answers as Record<string, string>,
        questions as FormQuestion[]
      )

      console.log('✅ Analysis complete:', {
        badge: analysis.badge,
        confidence: `${analysis.confidenceScore}%`,
      })

      // Save lead using service role — bypasses RLS safely
      console.log('💾 Saving lead to database...')
      const { data: lead, error: leadError } = await serviceSupabase
        .from('lead_responses')
        .insert({
          form_id: formId,
          lead_email: leadEmail || answers.email || 'unknown@email.com',
          lead_name: leadName || answers.name || 'Unknown Lead',
          answers: answers,
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
          ai_analysis: {},
          status: 'new',
        })
        .select()
        .single()

      if (leadError) {
        console.error('❌ Failed to save lead - FULL ERROR:', leadError)
        return NextResponse.json(
          {
            error: 'Failed to save lead',
            details: leadError.message,
            code: leadError.code,
            hint: leadError.hint,
            fullError: leadError,
          },
          { status: 500 }
        )
      }

      console.log('✅ Lead saved with ID:', lead.id)

      revalidatePath('/dashboard')
      revalidatePath('/dashboard/leads')

      return NextResponse.json({ success: true, analysis })
    }

    // ─── AUTHENTICATED DASHBOARD USAGE ───────────────────────────────────────
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .single()

    const hasActiveSubscription =
      subscription?.status === 'active' &&
      new Date(subscription.current_period_end) > new Date()

    // Check trial period
    if (!hasActiveSubscription) {
      const signupDate = new Date(user.created_at)
      const now = new Date()
      const daysSinceSignup = Math.floor(
        (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)

      if (trialDaysLeft === 0) {
        console.log('❌ Trial expired for user:', user.email)
        return NextResponse.json(
          {
            error: 'Your 3-day trial has expired. Subscribe to continue using LeadVett.',
            requiresSubscription: true,
            trialExpired: true,
            redirectTo: '/pricing',
          },
          { status: 403 }
        )
      }

      console.log(`⏰ User in trial: ${trialDaysLeft} days left`)
    }

    console.log('🤖 LeadVett AI analyzing with', questions.length, 'custom questions...')

    const analysis = await analyzeLead(
      answers as Record<string, string>,
      questions as FormQuestion[]
    )

    console.log('✅ Analysis complete:', {
      badge: analysis.badge,
      confidence: `${analysis.confidenceScore}%`,
      rules: analysis.ruleBreakdown.length,
    })

    // Save lead using service role — flat columns, no RLS issues
    if (formId) {
      console.log('💾 Saving lead to database...')

      const { data: lead, error: leadError } = await serviceSupabase
        .from('lead_responses')
        .insert({
          form_id: formId,
          lead_email: leadEmail || answers.email || 'unknown@email.com',
          lead_name: leadName || answers.name || 'Unknown Lead',
          answers: answers,
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
          ai_analysis: {},
          status: 'new',
        })
        .select()
        .single()

      if (leadError) {
        console.error('❌ Failed to save lead:', leadError)
      } else {
        console.log('✅ Lead saved with ID:', lead.id)
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/leads')
        revalidatePath(`/dashboard/leads/${lead.id}`)
      }
    }

    return NextResponse.json({ success: true, analysis })

  } catch (error: any) {
    console.error('❌ LeadVett AI Error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}