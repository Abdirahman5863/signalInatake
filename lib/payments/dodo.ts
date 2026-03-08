import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: 'live_mode',
})

export const PRODUCT_IDS = {
  Leadvett: 'pdt_0Na2Tb0jC4HGNu8S2I3B8',
}
