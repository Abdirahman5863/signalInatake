import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dodo } from '@/lib/payments/dodo'

// ─── GET — redirect callback from Dodo checkout ──────────────────────────────
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('reference')
  const sessionId = searchParams.get('session_id') // Dodo may pass this too

  console.log('🔷 Payment callback received:', { reference, sessionId })

  if (!reference) {
    console.log('❌ No reference provided')
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=error&reason=missing_reference`
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('❌ No user in callback — redirecting to login')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
    }

    console.log('✅ User in callback:', user.email)

    // ── Step 1: Get our transaction record ────────────────────────
    const { data: transaction, error: txFetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('dodo_reference', reference)
      .eq('user_id', user.id) // security check — must belong to this user
      .single()

    if (txFetchError || !transaction) {
      console.error('❌ Transaction not found for reference:', reference)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=error&reason=transaction_not_found`
      )
    }

    // ── Step 2: Verify payment with Dodo API ──────────────────────
    // NEVER trust the URL status param alone — always verify server-side
    let paymentVerified = false
    let dodoSessionData: any = null

    try {
      const dodoSessionId = sessionId || transaction.dodo_transaction_id

      if (dodoSessionId) {
        console.log('🔍 Verifying payment with Dodo session:', dodoSessionId)
        dodoSessionData = await dodo.checkoutSessions.retrieve(dodoSessionId)
        console.log('🔍 Dodo session status:', dodoSessionData?.status)

        // Only trust verified statuses from Dodo API
        const successStatuses = ['succeeded', 'paid', 'complete', 'completed', 'active']
        paymentVerified = successStatuses.includes(
          (dodoSessionData?.status ?? '').toLowerCase()
        )
      } else {
        console.warn('⚠️ No Dodo session ID found — cannot verify payment')
        paymentVerified = false
      }
    } catch (verifyError: any) {
      console.error('❌ Dodo verification error:', verifyError.message)
      paymentVerified = false
    }

    // ── Step 3: Act on verified result ───────────────────────────
    if (!paymentVerified) {
      console.log('❌ Payment not verified — marking as failed')

      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          metadata: {
            error: 'Payment not verified by Dodo API',
            dodo_session: dodoSessionData,
          }
        })
        .eq('dodo_reference', reference)

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=failed&reason=not_verified`
      )
    }

    // ── Step 4: Activate subscription ────────────────────────────
    console.log('✅ Payment verified — activating subscription')

    // Mark transaction complete
    await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        metadata: {
          plan: 'pro',
          user_email: user.email,
          dodo_session: dodoSessionData,
          verified_at: new Date().toISOString(),
        }
      })
      .eq('dodo_reference', reference)

    // Create/update subscription
    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan: 'pro',
        status: 'active',
        amount: 4900,
        currency: 'USD',
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        dodo_subscription_id: reference,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (subError) {
      console.error('❌ Subscription activation error:', subError)
      throw subError
    }

    console.log('✅ Subscription activated for:', user.email)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`
    )

  } catch (error: any) {
    console.error('❌ Callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=error&reason=callback_failed`
    )
  }
}

// ─── POST — Webhook from Dodo Payments ───────────────────────────────────────
export async function POST(request: NextRequest) {
  console.log('📬 Webhook received from Dodo Payments')

  try {
    const body = await request.json()
    console.log('Webhook payload:', JSON.stringify(body, null, 2))

    const supabase = await createClient()
    const eventType = body.event || body.type
    const data = body.data || body

    switch (eventType) {

      case 'charge.success':
      case 'payment.success':
      case 'payment.completed': {
        console.log('✅ Payment success webhook')

        await supabase
          .from('payment_transactions')
          .update({
            status: 'completed',
            dodo_transaction_id: data.id || data.transaction_id,
          })
          .eq('dodo_reference', data.reference || data.metadata?.reference)

        const start = new Date()
        const end = new Date()
        end.setMonth(end.getMonth() + 1)

        await supabase.from('subscriptions').upsert({
          user_id: data.metadata?.user_id,
          plan: 'pro',
          status: 'active',
          amount: data.amount || 4900,
          currency: data.currency || 'USD',
          current_period_start: start.toISOString(),
          current_period_end: end.toISOString(),
          dodo_subscription_id: data.id || data.reference,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

        break
      }

      case 'charge.failed':
      case 'payment.failed':
      case 'payment.declined': {
        console.log('❌ Payment failed webhook')

        await supabase
          .from('payment_transactions')
          .update({
            status: 'failed',
            metadata: {
              error: data.message || 'Payment failed',
              failure_reason: data.failure_reason,
              webhook_event: eventType,
            }
          })
          .eq('dodo_reference', data.reference || data.metadata?.reference)

        break
      }

      case 'subscription.cancelled':
      case 'subscription.canceled': {
        console.log('🚫 Subscription cancelled webhook')

        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq('dodo_subscription_id', data.subscription_id || data.id)

        break
      }

      case 'subscription.renewed': {
        console.log('🔄 Subscription renewed webhook')

        const renewEnd = new Date()
        renewEnd.setMonth(renewEnd.getMonth() + 1)

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: renewEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('dodo_subscription_id', data.subscription_id || data.id)

        break
      }

      default:
        console.log('⚠️ Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ success: true, received: true })

  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}