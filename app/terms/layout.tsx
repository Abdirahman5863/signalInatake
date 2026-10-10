import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms of Service — LeadVett",
  description: "LeadVett terms of service. Read our usage, data, AI, and account policies.",
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
