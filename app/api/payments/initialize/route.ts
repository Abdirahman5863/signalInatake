import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dodo, PRODUCT_IDS } from '@/lib/payments/dodo'

export async function POST(request: NextRequest) {
  try {
    console.log('🔷 Payment initialization started')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.email)

    const reference = `LEADVETT_${Date.now()}_${user.id.substring(0, 8)}`
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?reference=${reference}`

    // Store pending transaction
    const { error: insertError } = await supabase.from('payment_transactions').insert({
      user_id: user.id,
      amount: 4900,
      currency: 'USD',
      status: 'pending',
      dodo_reference: reference,
      metadata: { plan: 'solo', plan_name: 'Solo Agency' },
    })

    if (insertError) {
      console.error('❌ Transaction insert error:', insertError)
      throw insertError
    }

    console.log('✅ Transaction stored')

    // Create payment using official SDK
    const payment = await dodo.payments.create({
      payment_link: true,
      customer: { email: user.email!, name: user.email! },
      product_cart: [{ product_id: PRODUCT_IDS.Leadvett, quantity: 1 }],
      billing: {
        city: 'Nairobi',
        country: 'KE',
        state: 'Nairobi',
        street: 'N/A',
        zipcode: '00100',
      },
      return_url: callbackUrl,
    })

    console.log('✅ Dodo payment created:', payment.payment_id)

    return NextResponse.json({
      success: true,
      authorization_url: payment.payment_link,
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