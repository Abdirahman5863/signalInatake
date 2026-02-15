import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { BadgeDisplay } from '@/components/leads/BadgeDisplay'
import { LeadAnswers } from '@/components/leads/LeadAnswers'
import { type FormAnswers } from '@/lib/forms'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

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
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">{lead.lead_name}</h1>
          <p className="text-muted-foreground">
            {lead.intake_forms?.form_name || 'Unknown Form'}
          </p>
        </div>
        <a
          href={`mailto:${lead.lead_email}`}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Mail className="h-4 w-4" />
          Email Lead
        </a>
      </div>

      {/* AI Analysis Section */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <BadgeDisplay
          badge={lead.badge}
          strengths={lead.strengths}
          risks={lead.risks}
          dmScript={lead.dm_script}
          summary={lead.summary}
        />
      </div>

      {/* Contact & Timing */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
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

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
            
              href={`mailto:${lead.lead_email}`}
              className="block w-full rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors text-center"
            >
              Send Email
            </a>
            <button
              className="block w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              Mark as Contacted
            </button>
          </div>
        </div>
      </div>

      {/* Full Responses */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <LeadAnswers answers={answers} />
      </div>
    </div>
  )
}