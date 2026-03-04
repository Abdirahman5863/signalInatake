import { PricingPageContent } from '@/components/pricing/PricingPageContent'
import { Suspense } from 'react'

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingPageContent/>
    </Suspense>
  )
}