import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import Link from 'next/link'
import Image from 'next/image'
import leadicon from '../public/images/leadicon.png'
import { Settings, LayoutDashboard, FileText, Menu, X, Users } from 'lucide-react'
import { SignOutButton } from '@/components/SignOutButton'

import { usePathname } from 'next/navigation'

function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // @ts-ignore: Server Component workaround
  const supabase = (global as any).supabase || createClient();
  // @ts-ignore: Server Component workaround
  const user = (global as any).user || null;

  if (!user) {
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-1 sm:gap-2">
              <Image
                src={leadicon}
                alt="LeadVett"
                width={40}
                height={32}
                className="object-contain sm:w-[50px] sm:h-[40px]"
              />
              <span className="text-lg sm:text-xl font-bold">
                Lead<span className="text-[#b5944b]">Vett</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
               <Link
    href="/dashboard/leads"
    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
  >
    <Users className="h-4 w-4" />
    Leads
  </Link>
              <Link
                href="/dashboard/forms"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <FileText className="h-4 w-4" />
                Forms
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Settings className="h-4 w-4" />
                Pricing
              </Link>
            </nav>

            {/* User Menu - Mobile & Desktop */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-sm text-gray-600 truncate max-w-[150px]">
                {user.email}
              </div>
              <SignOutButton/>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-4 pb-3 overflow-x-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
             <Link
    href="/dashboard/leads"
    className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
  >
    <Users className="h-4 w-4" />
    Leads
  </Link>
            <Link
              href="/dashboard/forms"
              className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
            >
              <FileText className="h-4 w-4" />
              New Form
            </Link>
            <Link
  href="/dashboard/settings"
  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
    pathname === '/dashboard/settings'
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
  }`}
>
  <Settings className="h-5 w-5" />
  <span>Settings</span>
</Link>
          </nav>
        </div>
      </header>

      {/* Main Content - Mobile Responsive Padding */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-0 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}