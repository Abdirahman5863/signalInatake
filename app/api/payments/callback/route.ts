import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dodoPayments } from '@/lib/payments/dodo'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('reference')

  if (!reference) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_reference`)
  }

  try {
    // Verify payment with Dodo
    const verification = await dodoPayments.verifyPayment(reference)

    if (verification.data.status === 'success') {
      const supabase = await createClient()

      // Update transaction status
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          dodo_transaction_id: verification.data.id
        })
        .eq('dodo_reference', reference)
        .select()
        .single()

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      // Get metadata
      const metadata = transaction.metadata as any
      const userId = transaction.user_id

      // Calculate subscription period
      const currentPeriodStart = new Date()
      const currentPeriodEnd = new Date()
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

      // Create or update subscription
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan: metadata.plan,
        status: 'active',
        amount: transaction.amount,
        currency: transaction.currency,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        dodo_subscription_id: verification.data.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

      // Redirect to success page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&plan=${metadata.plan}`)
    } else {
      // Payment failed
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`)
    }

  } catch (error: any) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=verification_failed`)
  }
}

// Webhook handler for Dodo notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature (if Dodo provides one)
    // const signature = request.headers.get('x-dodo-signature')
    // ... verify signature ...

    const event = body.event
    const data = body.data

    const supabase = await createClient()

    switch (event) {
      case 'charge.success':
        // Handle successful payment
        await supabase
          .from('payment_transactions')
          .update({ status: 'completed' })
          .eq('dodo_reference', data.reference)
        break

      case 'subscription.cancelled':
        // Handle subscription cancellation
        await supabase
          .from('subscriptions')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('dodo_subscription_id', data.subscription_code)
        break

      default:
        console.log('Unhandled webhook event:', event)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}