'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export function DashboardRefresh({ userId }: { userId: string }) {
  const router = useRouter()

  useEffect(() => {
    // Subscribe to new leads
    const leadsChannel = supabase
      .channel('dashboard-leads')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lead_responses',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('🎯 New lead received!', payload.new)
          router.refresh() // Refresh server component data
        }
      )
      .subscribe()

    // Subscribe to new forms
    const formsChannel = supabase
      .channel('dashboard-forms')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'intake_forms',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('📝 New form created!', payload.new)
          router.refresh() // Refresh server component data
        }
      )
      .subscribe()

    // Subscribe to subscription changes
    const subscriptionChannel = supabase
      .channel('dashboard-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('💳 Subscription updated!', payload)
          router.refresh() // Refresh server component data
        }
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      leadsChannel.unsubscribe()
      formsChannel.unsubscribe()
      subscriptionChannel.unsubscribe()
    }
  }, [userId, router])

  return null // This component doesn't render anything
}