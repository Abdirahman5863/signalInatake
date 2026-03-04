interface DodoPaymentData {
  amount: number
  currency: string
  email: string
  reference: string
  callback_url: string
  metadata?: Record<string, any>
}

interface DodoSubscriptionData {
  plan_code: string
  customer_email: string
  customer_name: string
  metadata?: Record<string, any>
}

class DodoPayments {
  private secretKey: string
  private publicKey: string
  private baseUrl = 'https://api.dodopayments.com/v1'

  constructor() {
    this.secretKey = process.env.DODO_SECRET_KEY || ''
    this.publicKey = process.env.NEXT_PUBLIC_DODO_PUBLIC_KEY || ''
  }

  private async request(endpoint: string, method: string = 'GET', body?: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment request failed')
    }

    return response.json()
  }

  // Initialize a payment
  async initializePayment(data: DodoPaymentData) {
    return this.request('/transactions/initialize', 'POST', data)
  }

  // Verify a payment
  async verifyPayment(reference: string) {
    return this.request(`/transactions/verify/${reference}`)
  }

  // Create a subscription plan
  async createPlan(name: string, amount: number, interval: string = 'monthly') {
    return this.request('/plans', 'POST', {
      name,
      amount,
      interval,
      currency: 'USD'
    })
  }

  // Subscribe a customer to a plan
  async createSubscription(data: DodoSubscriptionData) {
    return this.request('/subscriptions', 'POST', data)
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionCode: string) {
    return this.request(`/subscriptions/${subscriptionCode}/cancel`, 'POST')
  }

  // Get subscription details
  async getSubscription(subscriptionCode: string) {
    return this.request(`/subscriptions/${subscriptionCode}`)
  }
}

export const dodoPayments = new DodoPayments()