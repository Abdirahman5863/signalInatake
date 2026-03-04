// /lib/payments/dodo.ts

const DODO_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://live.dodopayments.com'  // swap to live when you go live
  : 'https://test.dodopayments.com'  // test/sandbox

const DODO_API_KEY = process.env.DODO_SECRET_KEY // your API key from the dashboard

if (!DODO_API_KEY) {
  console.warn('⚠️ DODO_SECRET_KEY is not set in environment variables')
}

// ─── Create a payment link ────────────────────────────────────────────────────
export async function createPaymentLink({
  amount,
  currency = 'USD',
  reference,
  redirectUrl,
  customerEmail,
}: {
  amount: number        // in cents, e.g. 4900 for $49
  currency?: string
  reference: string
  redirectUrl: string
  customerEmail?: string
}) {
  const response = await fetch(`${DODO_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DODO_API_KEY}`,
    },
    body: JSON.stringify({
      amount,
      currency,
      payment_link: true,
      return_url: redirectUrl,
      metadata: {
        reference,
        customer_email: customerEmail,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Dodo Payments error: ${response.status} — ${error}`)
  }

  return response.json()
}

// ─── Verify a payment ────────────────────────────────────────────────────────
export async function verifyPayment(paymentId: string) {
  const response = await fetch(`${DODO_API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${DODO_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Dodo verification error: ${response.status} — ${error}`)
  }

  return response.json()
}