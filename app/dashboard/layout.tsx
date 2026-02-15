import { requireAuth } from '@/lib/auth'
import { SignOutButton } from '@/components/SignOutButton'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="text-xl font-bold">
            LeadVett
          </Link>
          <SignOutButton />
        </div>
      </nav>
      <main className="container mx-auto px-4 py-4 md:py-8">{children}</main>
    </div>
  )
}