import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In — LeadVett",
  description: "Sign in to your LeadVett account and start qualifying leads automatically.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}