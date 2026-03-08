import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('💳 Payment initialization for user:', user.email)

    const body = await request.json()
    const { plan } = body

    if (!plan || plan !== 'pro') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Check if user already has an ACTIVE subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .single()

    // Only block if subscription is already active AND not expired
    if (existingSubscription?.status === 'active') {
      const periodEnd = new Date(existingSubscription.current_period_end)
      const now = new Date()
      
      if (now < periodEnd) {
        console.log('⚠️ User already has active subscription')
        return NextResponse.json(
          { error: 'You already have an active subscription' },
          { status: 400 }
        )
      }
    }

    // ALLOW TRIAL USERS TO SUBSCRIBE
    // Trial users don't have active subscriptions, so they can proceed

    const reference = `leadvett_${user.id}_${Date.now()}`

    // Create transaction record
    const { error: txError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        amount: 4900, // $49.00 in cents
        currency: 'USD',
        status: 'pending',
        dodo_reference: reference,
        metadata: {
          plan: 'pro',
          user_email: user.email
        }
      })

    if (txError) {
      console.error('❌ Transaction creation error:', txError)
      throw new Error('Failed to create payment transaction')
    }

    console.log('✅ Transaction created with reference:', reference)

    // MOCK PAYMENT FOR NOW - Replace with real Dodo API call
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?reference=${reference}&status=success`
    
    console.log('🔷 Mock payment - redirecting to callback')

    return NextResponse.json({
      success: true,
      authorization_url: callbackUrl,
      reference
    })

    /* REAL DODO PAYMENTS INTEGRATION - Uncomment when you have API keys
    
    const response = await fetch('https://api.dodopayments.com/v1/payments/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 4900,
        currency: 'USD',
        reference: reference,
        customer_email: user.email,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
        metadata: {
          user_id: user.id,
          plan: 'pro'
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Payment initialization failed')
    }

    return NextResponse.json({
      success: true,
      authorization_url: data.authorization_url,
      reference: data.reference
    })
    */

  } catch (error: any) {
    console.error('❌ Payment initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    )
  }
}