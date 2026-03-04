// /app/api/payments/initialize/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentLink } from '@/lib/payments/dodo'

export async function POST(request: NextRequest) {
  try {
    console.log('🔷 Payment initialization started')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.email)

    const body = await request.json()
    const { plan } = body

    console.log('📦 Plan selected:', plan)

    // Plan details — extend this when you add the Team plan
   
      const planDetails = { name: 'Solo Agency', amount: 4900 }   // $49

    // Unique reference for this transaction
    const reference = `LEADVETT_${Date.now()}_${user.id.substring(0, 8)}`
    console.log('📝 Reference:', reference)

    // Callback URL — Dodo will redirect here after payment
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?reference=${reference}`

    // Store pending transaction in Supabase
    const { error: insertError } = await supabase.from('payment_transactions').insert({
      user_id: user.id,
      amount: planDetails.amount,
      currency: 'USD',
      status: 'pending',
      dodo_reference: reference,
      metadata: { plan: plan || 'solo', plan_name: planDetails.name },
    })

    if (insertError) {
      console.error('❌ Transaction insert error:', insertError)
      throw insertError
    }

    console.log('✅ Transaction stored in DB')

    // Create Dodo payment link
    const dodoResponse = await createPaymentLink({
      amount: planDetails.amount,
      currency: 'USD',
      reference,
      redirectUrl: callbackUrl,
      customerEmail: user.email,
    })

    console.log('✅ Dodo payment link created:', dodoResponse)

    return NextResponse.json({
      success: true,
      authorization_url: dodoResponse.payment_link || dodoResponse.url,
      reference,
    })

  } catch (error: any) {
    console.error('❌ Payment initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}