import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enrichLead } from '@/lib/ai/analyze'
import { AnalysisResult } from '@/lib/qualification'
import { FormQuestion } from '@/lib/forms'

export const maxDuration = 60
export async function POST(request: Request) {
  const secret = process.env.LEAD_WORKER_SECRET
  const supplied = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  if (!secret || secret.length<32 || Buffer.byteLength(supplied)!==Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) {
    return NextResponse.json({error:'Unauthorized'},{status:401})
  }
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({error:'AI is not configured.'},{status:503})
  try {
    const db=createAdminClient()
    const {data:jobs,error}=await db.rpc('claim_lead_jobs')
    if (error) throw error
    const results=await Promise.all((jobs ?? []).map(async (job:{id:string;lead_id:string;lease_token:string}) => {
      let draft:string|null=null; let failure:string|null=null
      try {
        const {data:lead,error:readError}=await db.from('lead_responses').select('answers,form_snapshot,decision_snapshot').eq('id',job.lead_id).single()
        if (readError || !lead?.form_snapshot || !lead.decision_snapshot) throw new Error('SNAPSHOT_UNAVAILABLE')
        const result=await enrichLead(lead.answers as Record<string,string>,lead.form_snapshot.questions as FormQuestion[],lead.decision_snapshot as AnalysisResult)
        draft=result.dmScript
      } catch { failure='ENRICHMENT_FAILED' }
      const {data:finished,error:finishError}=await db.rpc('finish_lead_job',{p_id:job.id,p_token:job.lease_token,p_draft:draft,p_error:failure})
      if (finishError) throw finishError
      return finished && !failure ? 'completed' : 'pending_or_failed'
    }))
    return NextResponse.json({processed:results.length,completed:results.filter(r=>r==='completed').length},{headers:{'Cache-Control':'no-store'}})
  } catch { console.error('Lead worker failed; check queue health.'); return NextResponse.json({error:'Worker unavailable.'},{status:503}) }
}
