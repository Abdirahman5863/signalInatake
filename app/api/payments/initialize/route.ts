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

    // Single plan pricing
    const planDetails = {
      name: 'LeadVett Pro',
      amount: 4900, // $49 in cents
      currency: 'USD'
    }

    // Generate unique reference
    const reference = `LEADVETT_${Date.now()}_${user.id.substring(0, 8)}`

    // Initialize payment with Dodo
    const paymentData = await dodoPayments.initializePayment({
      amount: planDetails.amount,
      currency: planDetails.currency,
      email: user.email!,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
      metadata: {
        user_id: user.id,
        plan: 'pro',
        plan_name: planDetails.name
      }
    })

    // Store pending transaction
    await supabase.from('payment_transactions').insert({
      user_id: user.id,
      amount: planDetails.amount,
      currency: planDetails.currency,
      status: 'pending',
      dodo_reference: reference,
      metadata: {
        plan: 'pro',
        plan_name: planDetails.name
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