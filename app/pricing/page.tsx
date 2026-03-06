import { PricingPageContent } from '@/components/pricing/PricingPageContent'
import { Suspense } from 'react'

export const metadata = {
  title: "Start Free Trial — LeadVett",
  description: "Start your 3-day free trial. No credit card required. Qualify DM leads in 10 seconds.",
}
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingPageContent/>
    </Suspense>
  )
}