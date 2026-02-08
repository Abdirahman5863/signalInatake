import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { BadgeDisplay } from '@/components/leads/BadgeDisplay'
import { LeadAnswers } from '@/components/leads/LeadAnswers'
import { type FormAnswers } from '@/lib/forms'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function LeadDetailPage({
  params,
}: {
  params: { leadId: string }
}) {
  await requireAuth()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get lead response
  const { data: lead, error } = await supabase
    .from('lead_responses')
    .select(
      `
      *,
      intake_forms!inner (
        id,
        form_name,
        user_id
      )
    `
    )
    .eq('id', params.leadId)
    .eq('intake_forms.user_id', user.id)
    .single()

  if (error || !lead) {
    notFound()
  }

  const answers = lead.answers as FormAnswers

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold mb-2">Lead Details</h1>
        <p className="text-muted-foreground">
          {lead.intake_forms?.form_name || 'Unknown Form'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{lead.lead_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a
                href={`mailto:${lead.lead_email}`}
                className="font-medium text-primary hover:underline"
              >
                {lead.lead_email}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {new Date(lead.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <BadgeDisplay badge={lead.badge} reasoning={lead.badge_reasoning} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <LeadAnswers answers={answers} />
      </div>
    </div>
  )
}

