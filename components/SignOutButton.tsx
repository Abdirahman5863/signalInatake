'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="hidden sm:inline">Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </>
      )}
    </button>
  )
}