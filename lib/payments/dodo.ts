import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: 'test_mode', // change to 'live_mode' when going live
})

export const PRODUCT_IDS = {
  solo: 'pdt_0NZkpgUmhmLcmW5OyhARe',
}