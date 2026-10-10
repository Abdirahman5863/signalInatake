import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Start Free Trial — LeadVett",
  description: "Create your free LeadVett account. No trial or credit card required.",
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
