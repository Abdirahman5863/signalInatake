import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Free Access — LeadVett",
  description: "LeadVett is currently free. Create qualification forms and prioritize inbound leads without a trial or credit card.",
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
