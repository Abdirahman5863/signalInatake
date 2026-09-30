import DodoPayments from 'dodopayments'

let client: DodoPayments | null = null

export function getDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY
  if (!bearerToken) {
    throw new Error('DODO_PAYMENTS_API_KEY is not configured')
  }

  if (!client) {
    client = new DodoPayments({ bearerToken, environment: 'live_mode' })
  }

  return client
}

export const PRODUCT_IDS = {
  Leadvett: 'pdt_0Na2Tb0jC4HGNu8S2I3B8',
}
