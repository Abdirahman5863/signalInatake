import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Pricing — LeadVett",
  description: "Start qualifying leads for $49/month. 3-day free trial, no credit card required. One avoided call pays for the whole year.",
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}