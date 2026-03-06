import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: 'test_mode',
})

export const PRODUCT_IDS = {
  Leadvett: 'pdt_0NZpe3zMYotwcunYyTL2H',
}
// CfGhCP1N87RcvJrZ.53Q3yCUcXCnct1RW5cP0-50mE5-fD3M8Mbw190aYpWkUXiet