import { requireAuth } from '@/lib/auth'
import { SignOutButton } from '@/components/SignOutButton'
import Link from 'next/link'
import Image from 'next/image'
import leadicon from '../public/images/leadicon.png'

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
                <div className="flex items-center gap-1">
            <Image
              src={leadicon}
              alt="LeadVett Logo"
              width={60} // Increased size so it's actually visible
              height={50}
              className="object-contain" // Keeps aspect ratio perfect
            />
            
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Lead<span className="text-[#b5944b]">Vett</span> 
            </span>
          </div>
                   
          </Link>
          <SignOutButton />
        </div>
      </nav>
      <main className="container mx-auto px-4 py-4 md:py-8">{children}</main>
    </div>
  )
}