'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { BadgeDisplay } from '@/components/leads/BadgeDisplay'
import { LeadAnswers } from '@/components/leads/LeadAnswers'
import { FormQuestion } from '@/lib/forms'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.leadId as string
  const [lead, setLead] = useState<any>(null)
  const [events, setEvents] = useState<{id:string;event:string;created_at:string}[]>([])
  const [loading, setLoading] = useState(true)
  const [statusError, setStatusError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const updatePipelineStatus = async (pipelineStatus: string) => {
    setUpdatingStatus(true)
    setStatusError('')
    const { error } = await supabase.from('lead_responses').update({ pipeline_status: pipelineStatus }).eq('id', leadId)
    if (error) setStatusError('Could not save the status. Please retry.')
    if (!error) setLead((current: any) => ({ ...current, pipeline_status: pipelineStatus }))
    if (!error) {
      const {data} = await supabase.from('lead_events').select('id,event,created_at').eq('lead_id',leadId).order('created_at',{ascending:false}).limit(30)
      setEvents(data ?? [])
    }
    setUpdatingStatus(false)
  }


  useEffect(() => {

    async function loadLead() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch lead with form questions
      const { data, error } = await supabase
        .from('lead_responses')
        .select(`
          *,
          intake_forms!inner (
            id,
            form_name,
            user_id,
            questions
          )
        `)
        .eq('id', leadId)
        .eq('intake_forms.user_id', user.id)
        .single()

      if (error) {
        console.error('Error loading lead:', error)
      }

      if (data) {
        setLead(data)
        const {data:history} = await supabase.from('lead_events').select('id,event,created_at').eq('lead_id',leadId).order('created_at',{ascending:false}).limit(30)
        setEvents(history ?? [])
      }
      setLoading(false)
    }

    loadLead()
  }, [leadId, router])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
      
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lead Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This lead doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const answers = lead.answers as Record<string, string>
  const formQuestions = (lead.form_snapshot?.questions ?? lead.intake_forms?.questions) as FormQuestion[] || []

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
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#9b762f]">
            {(lead.qualification_status || 'received').replaceAll('_', ' ')} · {(lead.pipeline_status || 'new').replaceAll('_', ' ')}
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

      {statusError && <p role="alert" className="text-red-700">{statusError}</p>}
      <p className="text-sm text-muted-foreground">Decision based on submitted answers. {lead.analysis_status === 'pending' ? 'An optional reply draft is queued.' : lead.analysis_status === 'completed' ? 'AI reply draft available; review before sending.' : 'A standard reply draft is available.'}</p>
      {/* Qualification evidence */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
    <BadgeDisplay
  badge={lead.badge}
  qualificationStatus={lead.qualification_status}
  strengths={lead.strengths}
  risks={lead.risks}
  dmScript={lead.dm_script}
  summary={lead.summary}
  action={lead.action}
  ruleBreakdown={lead.rule_breakdown}
  hardRuleTriggered={lead.hard_rule_triggered}
  confidenceScore={lead.confidence_score}
  confidenceLevel={lead.confidence_level}
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
              type="button"
              disabled={updatingStatus}
              onClick={() => updatePipelineStatus('contacted')}
              className="block w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              {lead.pipeline_status === 'contacted' ? 'Contacted' : 'Mark as Contacted'}
            </button>
            <div className="grid grid-cols-3 gap-2">
              {['booked', 'held', 'won', 'lost', 'archived'].map((status) => (
                <button key={status} type="button" disabled={updatingStatus} onClick={() => updatePipelineStatus(status)} className={`rounded-md border px-2 py-2 text-xs font-medium capitalize hover:bg-accent ${lead.pipeline_status === status ? 'bg-[#101010] text-white' : ''}`}>{status}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Responses - NOW WITH QUESTIONS */}
      {events.length > 0 && <section className="rounded-lg border p-6"><h2 className="font-semibold">Activity</h2><ol className="mt-3 space-y-2 text-sm">{events.map(event => <li key={event.id} className="flex justify-between gap-3"><span className="capitalize">{event.event.replaceAll('_',' ')}</span><time dateTime={event.created_at} className="text-muted-foreground">{new Date(event.created_at).toLocaleString()}</time></li>)}</ol><p className="mt-3 text-xs text-muted-foreground">Latest 30 recorded events.</p></section>}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <LeadAnswers 
          answers={answers} 
          questions={formQuestions}
        />
      </div>
    </div>
  )
}
