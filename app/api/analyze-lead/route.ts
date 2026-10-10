import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_RESULT_MESSAGES, ResultMessages } from '@/lib/forms'
import { qualifyLead, normalizePolicy, RULE_VERSION } from '@/lib/qualification'
import { UUID, validateQuestions, validateAnswers, safeBookingUrl } from '@/lib/intake-validation'
import { readJson, RequestError } from '@/lib/http'

export async function POST(request: Request) {
  try {
    const body=await readJson(request)
    if (body.website) throw new RequestError('Unable to accept this submission.')
    if (typeof body.shareLink !== 'string' || !UUID.test(body.shareLink) || typeof body.submissionKey !== 'string' || !UUID.test(body.submissionKey)) throw new RequestError('A valid form link and submission key are required.')
    if (typeof body.leadName !== 'string' || !body.leadName.trim() || body.leadName.length>120) throw new RequestError('Please enter your name (up to 120 characters).')
    if (typeof body.leadEmail !== 'string' || body.leadEmail.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.leadEmail.trim())) throw new RequestError('Please enter a valid email address.')
    const db=createAdminClient()
    const {data:form,error}=await db.from('intake_forms').select('id,version,questions,qualification_policy,booking_url,result_messages,is_published').eq('share_link',body.shareLink).maybeSingle()
    if (error) throw error
    if (!form) throw new RequestError('This form is unavailable.',404)
    // Replays return the original receipt, including after a form edit. Never return private answers.
    const name=body.leadName.trim(); const email=body.leadEmail.trim().toLowerCase()
    if (!body.answers || typeof body.answers!=='object' || Array.isArray(body.answers)) throw new RequestError('Answers must be an object.')
    const canonical=Object.fromEntries(Object.entries(body.answers).sort(([a],[b])=>a.localeCompare(b)))
    const hash=createHash('sha256').update(JSON.stringify({name,email,answers:canonical})).digest('hex')
    const {data:prior,error:priorError}=await db.from('lead_responses').select('id,request_hash,public_result').eq('form_id',form.id).eq('submission_key',body.submissionKey).maybeSingle()
    if (priorError) throw priorError
    if (prior) {
      if (prior.request_hash!==hash) throw new RequestError('This submission key was already used for different answers.',409)
      return NextResponse.json({success:true,leadId:prior.id,result:prior.public_result},{headers:{'Cache-Control':'no-store'}})
    }
    if (!form.is_published) throw new RequestError('This form is not accepting enquiries.',404)
    if (body.formVersion!==form.version) throw new RequestError('This form changed. Reload it before submitting.',409)
    if (!validateQuestions(form.questions)) throw new RequestError('This form needs an update from its owner.',422)
    let answers:Record<string,string>; let policy
    try { answers=validateAnswers(body.answers,form.questions) } catch (e) { throw new RequestError(e instanceof Error ? e.message : 'Invalid answers.') }
    try { policy=normalizePolicy(form.qualification_policy ?? {}) } catch { throw new RequestError('This form needs a valid qualification policy.',422) }
    const decision=qualifyLead(answers,form.questions,policy)
    const messages={...DEFAULT_RESULT_MESSAGES,...(form.result_messages ?? {})} as ResultMessages
    const status=decision.qualificationStatus
    const messageKey=status==='ready_to_book'?'gold':status==='not_a_fit'?'bronze':status==='nurture'?'silver':'manualReview'
    const result={status,title:status==='ready_to_book'?'Your project looks like a potential fit':'Your enquiry has been received',message:typeof messages[messageKey]==='string'?messages[messageKey].slice(0,2000):DEFAULT_RESULT_MESSAGES[messageKey],...(status==='ready_to_book'?{bookingUrl:safeBookingUrl(form.booking_url)}:{})}
    const {data:receipt,error:captureError}=await db.rpc('capture_enquiry',{
      p_form_id:form.id,p_version:form.version,p_key:body.submissionKey,p_hash:hash,p_name:name,p_email:email,p_answers:answers,p_decision:decision,p_result:result,p_rule_version:RULE_VERSION,
      p_enqueue:process.env.LEAD_ENRICHMENT_ENABLED==='true' && Boolean(process.env.OPENAI_API_KEY) && (process.env.LEAD_WORKER_SECRET?.length ?? 0)>=32,
    })
    if (captureError) {
      if (captureError.message.includes('INTAKE_LIMIT')) throw new RequestError('This form has reached its submission limit. Please try later.',429)
      if (captureError.message.includes('IDEMPOTENCY_CONFLICT') || captureError.message.includes('FORM_CHANGED')) throw new RequestError('The form or submission changed. Reload before trying again.',409)
      if (captureError.message.includes('FORM_UNAVAILABLE')) throw new RequestError('This form is unavailable.',404)
      throw captureError
    }
    return NextResponse.json({success:true,...receipt},{status:201,headers:{'Cache-Control':'no-store'}})
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({error:error.message},{status:error.status,headers:error.status===429?{'Retry-After':'3600'}:undefined})
    console.error('Intake storage unavailable; submission was not acknowledged:', error instanceof Error ? error.message : error)
    return NextResponse.json({error:'We could not confirm receipt. Please retry; the same submission will not be saved twice.'},{status:503})
  }
}
