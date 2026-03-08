import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('reference')
  const status = searchParams.get('status')

  console.log('🔷 Payment callback received:', { reference, status })

  if (!reference) {
    console.log('❌ No reference provided')
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error&reason=missing_reference`)
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('❌ No user in callback')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
    }

    console.log('✅ User in callback:', user.email)

    // Check payment status from URL parameter
    // Dodo Payments sends status in the callback URL
    const paymentSuccess = status === 'success' || status === 'completed' || status === 'successful'
    const paymentFailed = status === 'failed' || status === 'cancelled' || status === 'declined'

    if (paymentFailed) {
      console.log('❌ Payment failed:', status)

      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({ 
          status: 'failed',
          metadata: { 
            error: 'Payment failed or declined',
            callback_status: status 
          }
        })
        .eq('dodo_reference', reference)

      // Redirect to pricing with failure message
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=failed`)
    }

    if (paymentSuccess) {
      console.log('✅ Processing successful payment')

      // Update transaction
      const { error: txError } = await supabase
        .from('payment_transactions')
        .update({ status: 'completed' })
        .eq('dodo_reference', reference)

      if (txError) {
        console.error('❌ Transaction update error:', txError)
      }

      // Calculate subscription period
      const currentPeriodStart = new Date()
      const currentPeriodEnd = new Date()
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

      // Create or update subscription
      const { error: subError } = await supabase.from('subscriptions').upsert({
        user_id: user.id,
        plan: 'pro',
        status: 'active',
        amount: 4900,
        currency: 'USD',
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        dodo_subscription_id: reference,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

      if (subError) {
        console.error('❌ Subscription creation error:', subError)
        throw subError
      }

      console.log('✅ Subscription activated')

      // Redirect to success
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`)
    }

    // Unknown status - treat as pending/processing
    console.log('⚠️ Unknown payment status:', status)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=processing`)

  } catch (error: any) {
    console.error('❌ Callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=error&reason=callback_failed`)
  }
}

// Webhook handler for POST requests from Dodo Payments
export async function POST(request: NextRequest) {
  console.log('📬 Webhook received from Dodo Payments')
  
  try {
    const body = await request.json()
    console.log('Webhook data:', body)

    const supabase = await createClient()

    // Handle different webhook events
    const eventType = body.event || body.type
    const data = body.data

    switch (eventType) {
      case 'charge.success':
      case 'payment.success':
        console.log('✅ Payment success webhook')
        
        // Update transaction
        await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            dodo_transaction_id: data.id || data.transaction_id
          })
          .eq('dodo_reference', data.reference)

        // Activate subscription
        const currentPeriodStart = new Date()
        const currentPeriodEnd = new Date()
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

        await supabase.from('subscriptions').upsert({
          user_id: data.metadata?.user_id,
          plan: 'pro',
          status: 'active',
          amount: data.amount,
          currency: data.currency || 'USD',
          current_period_start: currentPeriodStart.toISOString(),
          current_period_end: currentPeriodEnd.toISOString(),
          dodo_subscription_id: data.id || data.reference,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        break

      case 'charge.failed':
      case 'payment.failed':
        console.log('❌ Payment failed webhook')
        
        await supabase
          .from('payment_transactions')
          .update({ 
            status: 'failed',
            metadata: {
              error: data.message || 'Payment failed',
              failure_reason: data.failure_reason
            }
          })
          .eq('dodo_reference', data.reference)
        break

      case 'subscription.cancelled':
        console.log('🚫 Subscription cancelled webhook')
        
        await supabase
          .from('subscriptions')
          .update({ 
            status: 'cancelled',
            cancel_at_period_end: true,
            updated_at: new Date().toISOString()
          })
          .eq('dodo_subscription_id', data.subscription_id || data.id)
        break

      default:
        console.log('⚠️ Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ success: true, received: true })

  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}