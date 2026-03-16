import { NextRequest, NextResponse } from 'next/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { FormQuestion } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const TRIAL_DAYS = 3

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .single()

    const hasActiveSubscription = subscription?.status === 'active' && 
      new Date(subscription.current_period_end) > new Date()

    // If no active subscription, check trial period
    if (!hasActiveSubscription) {
      const signupDate = new Date(user.created_at)
      const now = new Date()
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
      const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)

      if (trialDaysLeft === 0) {
        console.log('❌ Trial expired for user:', user.email)
        return NextResponse.json(
          { 
            error: 'Your 3-day trial has expired. Subscribe to continue using LeadVett.',
            requiresSubscription: true,
            trialExpired: true,
            redirectTo: '/pricing'
          },
          { status: 403 }
        )
      }

      console.log(`⏰ User in trial: ${trialDaysLeft} days left`)
    }

    const body = await request.json()
    const { answers, questions, formId, leadEmail, leadName } = body

    if (!answers || !questions) {
      return NextResponse.json(
        { error: 'Missing answers or questions' },
        { status: 400 }
      )
    }

    console.log('🤖 LeadVett AI analyzing with', questions.length, 'custom questions...')

    // Run AI analysis
    const analysis = await analyzeLead(
      answers as Record<string, string>,
      questions as FormQuestion[]
    )

    console.log('✅ Analysis complete:', {
      badge: analysis.badge,
      confidence: `${analysis.confidenceScore}%`,
      rules: analysis.ruleBreakdown.length
    })

    // Save lead to database if formId is provided
    if (formId) {
      console.log('💾 Saving lead to database...')
      
      const { data: lead, error: leadError } = await supabase
        .from('lead_responses')
        .insert({
          form_id: formId,
          user_id: user.id,
          email: leadEmail || answers.email || 'unknown@email.com',
          name: leadName || answers.name || 'Unknown Lead',
          answers: answers,
          badge: analysis.badge,
          confidence_score: analysis.confidenceScore,
          ai_analysis: {
            summary: analysis.summary,
            strengths: analysis.strengths,
            risks: analysis.risks,
            dmScript: analysis.dmScript,
            action: analysis.action,
            ruleBreakdown: analysis.ruleBreakdown,
            hardRuleTriggered: analysis.hardRuleTriggered,
            confidenceLevel: analysis.confidenceLevel
          },
          status: 'new'
        })
        .select()
        .single()

      if (leadError) {
        console.error('❌ Failed to save lead:', leadError)
        // Don't fail the whole request, just log the error
      } else {
        console.log('✅ Lead saved with ID:', lead.id)
        
        // Revalidate dashboard and leads pages to show new data
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/leads')
        revalidatePath(`/dashboard/leads/${lead.id}`)
      }
    }

    return NextResponse.json({ 
      success: true, 
      analysis 
    })
    
  } catch (error: any) {
    console.error('❌ LeadVett AI Error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}