import { Suspense } from 'react'
import { PricingPageContent } from './PricingPageContent'

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingPageContent />
    </Suspense>
  )
}