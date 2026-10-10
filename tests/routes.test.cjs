const { test }=require('node:test')
const assert=require('node:assert/strict')
const { randomUUID }=require('node:crypto')
const { load }=require('./load-ts.cjs')
const { DEFAULT_QUESTIONS,DEFAULT_QUALIFICATION_POLICY }=load('lib/forms.ts')
const form={id:randomUUID(),version:1,is_published:true,questions:DEFAULT_QUESTIONS,qualification_policy:DEFAULT_QUALIFICATION_POLICY,booking_url:'https://cal.com/studio'}
const body={shareLink:randomUUID(),submissionKey:randomUUID(),formVersion:1,leadName:'Prospect',leadEmail:'lead@example.com',answers:{trigger:'New site',budget:'5k-10k',timeline:'1 month',decision_maker:'I decide',service:'Website design'}}
const request=(patch={})=>new Request('https://leadvett.test/api/analyze-lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...body,...patch})})
function mockRoute({dbError=false,prior=null,captureError=null}={}) {
  const calls=[]
  const db={from(table){const query={select(){return query},eq(){return query},async maybeSingle(){return {data:table==='intake_forms'?form:prior,error:dbError?new Error('DB_DOWN'):null}}};return query},async rpc(name,args){calls.push({name,args});return {data:{leadId:randomUUID(),result:args.p_result},error:captureError}}}
  return {...load('app/api/analyze-lead/route.ts',{'@/lib/supabase/admin':{createAdminClient:()=>db}}),calls}
}
test('capture returns stored deterministic result without calling AI',async()=>{
  const route=mockRoute();const response=await route.POST(request())
  assert.equal(response.status,201);assert.equal(route.calls.length,1)
  assert.equal(route.calls[0].args.p_decision.qualificationStatus,'ready_to_book')
  assert.equal((await response.json()).result.bookingUrl,'https://cal.com/studio')
})
test('failed save is not acknowledged; quotas and form versions return clear failures',async()=>{
  assert.equal((await mockRoute({dbError:true}).POST(request())).status,503)
  assert.equal((await mockRoute({captureError:{message:'INTAKE_LIMIT'}}).POST(request())).status,429)
  const route=mockRoute(); assert.equal((await route.POST(request({formVersion:0}))).status,409);assert.equal(route.calls.length,0)
})
test('tampered dropdown, honeypot and mismatched replay do not write',async()=>{
  for (const patch of [{website:'spam'},{answers:{...body.answers,budget:'$100000'}}]) {
    const route=mockRoute();assert.equal((await route.POST(request(patch))).status,400);assert.equal(route.calls.length,0)
  }
  const route=mockRoute({prior:{id:randomUUID(),request_hash:'different',public_result:{}}})
  assert.equal((await route.POST(request())).status,409);assert.equal(route.calls.length,0)
})
test('worker rejects missing and incorrect secrets before touching the database',async()=>{
  const old=process.env.LEAD_WORKER_SECRET;process.env.LEAD_WORKER_SECRET='a'.repeat(40)
  try {
    const {POST}=load('app/api/jobs/process/route.ts',{'@/lib/supabase/admin':{createAdminClient:()=>{throw new Error('Must not access database')}},'@/lib/ai/analyze':{enrichLead:()=>{throw new Error('Must not call AI')}}})
    assert.equal((await POST(new Request('https://example.com',{method:'POST'}))).status,401)
    assert.equal((await POST(new Request('https://example.com',{method:'POST',headers:{authorization:'Bearer '+ 'b'.repeat(40)}}))).status,401)
  } finally {if(old===undefined)delete process.env.LEAD_WORKER_SECRET;else process.env.LEAD_WORKER_SECRET=old}
})
