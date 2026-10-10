'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Bell, Calendar, Check, ChevronRight, HeartHandshake, LogOut, Mail, Shield, User } from 'lucide-react'

interface SettingsContentProps {
  user: {
    id: string
    email?: string
    created_at: string
    email_confirmed_at?: string
  }
}

export function SettingsContent({ user }: SettingsContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-950">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and LeadVett preferences.</p>
        </div>

        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <HeartHandshake className="h-7 w-7 text-emerald-700" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold text-emerald-950">Free access</h2>
              <p className="mt-1 text-sm text-emerald-800">
                Your account includes form creation, lead qualification, verdict explanations, and lead management. No billing details are required.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-950">Account</h2>
          <div className="mt-5 divide-y divide-gray-200">
            <div className="flex items-center gap-3 py-4">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-gray-950">Email address</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <Check className="h-3 w-3" aria-hidden="true" /> Verified
              </span>
            </div>
            <div className="flex items-center gap-3 py-4">
              <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-gray-950">Member since</p>
                <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-4">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-gray-950">Account ID</p>
                <p className="font-mono text-sm text-gray-600">{user.id.substring(0, 8)}…</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <div>
              <h2 className="font-bold text-gray-950">Lead notifications</h2>
              <p className="mt-1 text-sm text-gray-600">Email notifications are not enabled. Review new enquiries in your dashboard.</p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Enabled</span>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <div>
              <h2 className="font-bold text-gray-950">Your data</h2>
              <p className="mt-1 text-sm text-gray-600">Your forms and leads remain connected to your account. Making LeadVett free does not remove or reset existing data.</p>
            </div>
          </div>
        </section>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-between rounded-xl border border-red-200 bg-white px-4 py-3 text-left hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-red-600" aria-hidden="true" />
            <span><strong className="block text-sm text-red-700">Sign out</strong><small className="text-red-600">End this session</small></span>
          </span>
          <ChevronRight className="h-5 w-5 text-red-600" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
