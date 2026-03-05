import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: 'test_mode',
})

export const PRODUCT_IDS = {
  Leadvett: 'pdt_0NZpe3zMYotwcunYyTL2H',
}