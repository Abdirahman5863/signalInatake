import { NextRequest, NextResponse } from 'next/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { FormQuestion } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionExpiration } from '@/lib/subscription/check-expiration'

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

    // Check subscription expiration
    const subscriptionCheck = await checkSubscriptionExpiration(user.id)

    // If has active subscription, allow access
    if (subscriptionCheck.hasAccess && subscriptionCheck.reason === 'active_subscription') {
      console.log('✅ Access granted: Active subscription')
    } else {
      // Check trial period
      const signupDate = new Date(user.created_at)
      const now = new Date()
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
      const trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSinceSignup)

      if (trialDaysLeft === 0) {
        console.log('❌ Access denied: Trial/subscription expired')
        
        let errorMessage = 'Your 3-day trial has expired. Subscribe to continue using LeadVett.'
        
        if (subscriptionCheck.reason === 'subscription_expired') {
          errorMessage = 'Your subscription has expired. Renew to continue analyzing leads.'
        }
        
        return NextResponse.json(
          { 
            error: errorMessage,
            requiresSubscription: true,
            subscriptionExpired: subscriptionCheck.reason === 'subscription_expired',
            trialExpired: trialDaysLeft === 0,
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