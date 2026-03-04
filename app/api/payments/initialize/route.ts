import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dodoPayments } from '@/lib/payments/dodo'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()

    // Define plans
    const plans = {
      solo: { name: 'Solo Agency', amount: 4900, currency: 'USD' }, // $49 in cents
      team: { name: 'Agency Team', amount: 12900, currency: 'USD' }, // $129 in cents
    }

    const selectedPlan = plans[plan as keyof typeof plans]
    
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Generate unique reference
    const reference = `LEADVETT_${Date.now()}_${user.id.substring(0, 8)}`

    // Initialize payment with Dodo
    const paymentData = await dodoPayments.initializePayment({
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      email: user.email!,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
      metadata: {
        user_id: user.id,
        plan: plan,
        plan_name: selectedPlan.name
      }
    })

    // Store pending transaction
    await supabase.from('payment_transactions').insert({
      user_id: user.id,
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      status: 'pending',
      dodo_reference: reference,
      metadata: {
        plan,
        plan_name: selectedPlan.name
      }
    })

    return NextResponse.json({
      success: true,
      authorization_url: paymentData.data.authorization_url,
      reference: paymentData.data.reference
    })

  } catch (error: any) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}