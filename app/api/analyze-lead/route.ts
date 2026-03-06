import { NextRequest, NextResponse } from 'next/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { FormQuestion } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'

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
      .select('status')
      .eq('user_id', user.id)
      .single()

    const hasActiveSubscription = subscription?.status === 'active'

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
    const { answers, questions } = body

    if (!answers || !questions) {
      return NextResponse.json(
        { error: 'Missing answers or questions' },
        { status: 400 }
      )
    }

    console.log('🤖 LeadVett AI analyzing with', questions.length, 'custom questions...')

    const analysis = await analyzeLead(
      answers as Record<string, string>,
      questions as FormQuestion[]
    )

    console.log('✅ Analysis complete:', {
      badge: analysis.badge,
      confidence: `${analysis.confidenceScore}%`,
      rules: analysis.ruleBreakdown.length
    })

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