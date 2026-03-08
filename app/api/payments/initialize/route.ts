import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dodo, PRODUCT_IDS } from '@/lib/payments/dodo'

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

    if (existingSubscription?.status === 'active') {
      const periodEnd = new Date(existingSubscription.current_period_end)
      const now = new Date()
      if (now < periodEnd) {
        return NextResponse.json(
          { error: 'You already have an active subscription' },
          { status: 400 }
        )
      }
    }

    const reference = `leadvett_${user.id}_${Date.now()}`

    // Create pending transaction in Supabase
    const { error: txError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        amount: 4900,
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

    console.log('✅ Transaction created:', reference)

    // ── Create checkout session via Dodo SDK ──────────────────────
    try {
      const checkout = await dodo.checkoutSessions.create({
        product_id: PRODUCT_IDS.Leadvett,
        quantity: 1,
        customer: {
          email: user.email!,
          name: user.user_metadata?.full_name ?? user.email!,
        },
        payment_link: false,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?reference=${reference}&status=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
        metadata: {
          user_id: user.id,
          plan: 'pro',
          reference,
        },
      })

      console.log('✅ Dodo checkout session created:', checkout)

      // Save session ID to transaction
      await supabase
        .from('payment_transactions')
        .update({
          dodo_transaction_id: (checkout as any).id ?? (checkout as any).checkout_session_id,
          metadata: {
            plan: 'pro',
            user_email: user.email,
            dodo_session: checkout,
          }
        })
        .eq('dodo_reference', reference)

      // Extract checkout URL from response
      const checkoutUrl =
        (checkout as any).url ??
        (checkout as any).checkout_url ??
        (checkout as any).payment_url

      if (!checkoutUrl) {
        console.error('❌ No checkout URL in Dodo response:', checkout)
        throw new Error('Dodo did not return a checkout URL')
      }

      return NextResponse.json({
        success: true,
        authorization_url: checkoutUrl,
        reference,
        session_id: (checkout as any).id,
      })

    } catch (dodoError: any) {
      console.error('❌ Dodo SDK error:', dodoError)

      // Mark transaction as failed
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          metadata: { error: dodoError.message }
        })
        .eq('dodo_reference', reference)

      return NextResponse.json(
        {
          error: 'Failed to initialize payment.',
          details: dodoError.message,
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('❌ Payment initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    )
  }
}