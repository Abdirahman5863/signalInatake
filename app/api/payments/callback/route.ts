// /app/api/payments/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('reference')
  const paymentId = searchParams.get('payment_id') // Dodo sends this
  const status = searchParams.get('status')         // Dodo sends this too

  console.log('🔷 Payment callback received:', { reference, paymentId, status })

  if (!reference) {
    console.log('❌ No reference provided')
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=missing_reference`
    )
  }

  try {
    const supabase = await createClient()

    // ── Find the user via the pending transaction ────────────────────────────
    // We look up by reference instead of relying on session cookie
    // because the session may be lost after external redirect
    const { data: transaction, error: txFindError } = await supabase
      .from('payment_transactions')
      .select('user_id, status')
      .eq('dodo_reference', reference)
      .single()

    if (txFindError || !transaction) {
      console.error('❌ Transaction not found:', txFindError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=transaction_not_found`
      )
    }

    console.log('✅ Transaction found for user:', transaction.user_id)

    // ── Avoid double-processing ──────────────────────────────────────────────
    if (transaction.status === 'completed') {
      console.log('⚠️ Transaction already processed, redirecting to dashboard')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=already_processed`
      )
    }

    // ── Update transaction to completed ─────────────────────────────────────
    const { error: txUpdateError } = await supabase
      .from('payment_transactions')
      .update({ status: 'completed' })
      .eq('dodo_reference', reference)

    if (txUpdateError) {
      console.error('❌ Transaction update error:', txUpdateError)
    } else {
      console.log('✅ Transaction marked completed')
    }

    // ── Activate subscription ────────────────────────────────────────────────
    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: transaction.user_id,
        plan: 'solo',
        status: 'active',
        amount: 4900,
        currency: 'USD',
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })

    if (subError) {
      console.error('❌ Subscription activation error:', subError)
      throw subError
    }

    console.log('✅ Subscription activated for user:', transaction.user_id)

    // ── Redirect to dashboard with success ───────────────────────────────────
    // Use /dashboard instead of /pricing so user lands on their account
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`
    )

  } catch (error: any) {
    console.error('❌ Callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=verification_failed`
    )
  }
}

// Handle Dodo webhooks for recurring payments / subscription events
export async function POST(request: NextRequest) {
  console.log('📬 Webhook received')

  try {
    const body = await request.json()
    console.log('Webhook event:', body.type, body)

    const supabase = await createClient()

    // Handle subscription renewal
    if (body.type === 'payment.succeeded') {
      const reference = body.data?.metadata?.reference
      if (reference) {
        await supabase
          .from('payment_transactions')
          .update({ status: 'completed' })
          .eq('dodo_reference', reference)
      }
    }

    // Handle subscription cancellation
    if (body.type === 'subscription.cancelled') {
      const userId = body.data?.metadata?.user_id
      if (userId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', userId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}