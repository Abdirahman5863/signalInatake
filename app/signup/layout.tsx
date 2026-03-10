import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Start Free Trial — LeadVett",
  description: "Start your 3-day free trial. No credit card required. Qualify DM leads in 10 seconds.",
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
