import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Dodo Payments configuration
const DODO_BASE_URL = process.env.DODO_MODE === 'live' 
  ? 'https://live.dodopayments.com'
  : 'https://test.dodopayments.com'

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY
const USE_MOCK_PAYMENTS = !DODO_API_KEY || process.env.USE_MOCK_PAYMENTS === 'true'

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
        console.log('⚠️ User already has active subscription')
        return NextResponse.json(
          { error: 'You already have an active subscription' },
          { status: 400 }
        )
      }
    }

    const reference = `leadvett_${user.id}_${Date.now()}`

    // Create transaction record
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

    console.log('✅ Transaction created with reference:', reference)

    // ============================================
    // MOCK PAYMENT MODE (for testing)
    // ============================================
    if (USE_MOCK_PAYMENTS) {
      console.log('⚠️ Using MOCK payment mode')
      console.log('Set DODO_PAYMENTS_API_KEY to use real payments')
      
      const mockCallbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?reference=${reference}&status=success&mock=true`
      
      return NextResponse.json({
        success: true,
        authorization_url: mockCallbackUrl,
        reference,
        mock: true
      })
    }

    // ============================================
    // REAL DODO PAYMENTS INTEGRATION
    // ============================================
    
    try {
      const dodoEndpoint = `${DODO_BASE_URL}/checkout-sessions`
      console.log('🔷 Calling Dodo Payments:', dodoEndpoint)

      const dodoResponse = await fetch(dodoEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DODO_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          payment_link: false, // Use checkout session, not payment link
          amount: 4900, // Amount in cents ($49.00)
          currency: 'USD',
          customer_email: user.email,
          customer_name: user.user_metadata?.full_name,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?reference=${reference}&status=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
          metadata: {
            user_id: user.id,
            plan: 'pro',
            reference: reference
          }
        }),
        signal: AbortSignal.timeout(15000) // 15 second timeout
      })

      const responseText = await dodoResponse.text()
      console.log('Dodo response status:', dodoResponse.status)
      console.log('Dodo response body:', responseText)

      if (!dodoResponse.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { message: responseText }
        }
        
        console.error('❌ Dodo API error:', {
          status: dodoResponse.status,
          data: errorData
        })
        
        throw new Error(errorData.message || errorData.error || `Dodo API returned ${dodoResponse.status}`)
      }

      const dodoData = JSON.parse(responseText)
      console.log('✅ Dodo payment initialized:', dodoData)

      // Update transaction with Dodo checkout session ID
      await supabase
        .from('payment_transactions')
        .update({ 
          dodo_transaction_id: dodoData.id || dodoData.checkout_session_id,
          metadata: {
            plan: 'pro',
            user_email: user.email,
            dodo_session: dodoData
          }
        })
        .eq('dodo_reference', reference)

      return NextResponse.json({
        success: true,
        authorization_url: dodoData.url || dodoData.checkout_url || dodoData.payment_url,
        reference: reference,
        session_id: dodoData.id
      })

    } catch (dodoError: any) {
      console.error('❌ Dodo Payments error:', {
        message: dodoError.message,
        code: dodoError.code,
        cause: dodoError.cause?.message
      })
      
      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({ 
          status: 'failed',
          metadata: { 
            error: dodoError.message,
            error_code: dodoError.code 
          }
        })
        .eq('dodo_reference', reference)

      // Network error
      if (dodoError.code === 'ENOTFOUND' || dodoError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { 
            error: 'Payment service temporarily unavailable.',
            suggestion: 'Please try again in a few minutes or contact support@leadvett.com'
          },
          { status: 503 }
        )
      }

      // Timeout error
      if (dodoError.name === 'TimeoutError') {
        return NextResponse.json(
          { 
            error: 'Payment request timed out.',
            suggestion: 'Please check your internet connection and try again.'
          },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Failed to initialize payment.',
          details: dodoError.message
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