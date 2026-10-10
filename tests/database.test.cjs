const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { randomUUID } = require('node:crypto')
const { PGlite } = require('@electric-sql/pglite')
const { load } = require('./load-ts.cjs')
const { DEFAULT_QUESTIONS, DEFAULT_QUALIFICATION_POLICY } = load('lib/forms.ts')
const { qualifyLead } = load('lib/qualification.ts')

test('PostgreSQL intake transaction, permissions, quotas and worker leases', {timeout:60000}, async t => {
  const db = new PGlite()
  t.after(()=>db.close())
  // Supabase supplies these roles and auth schema in production.
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated,service_role;`)
  // WASM does not ship uuid-ossp. gen_random_uuid provides equivalent UUID defaults.
  for (const file of fs.readdirSync('supabase/migrations').sort()) {
    let sql = fs.readFileSync('supabase/migrations/'+file,'utf8').replace('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";','').replaceAll('uuid_generate_v4()','gen_random_uuid()')
    await db.exec(sql)
    if (file.startsWith('001')) await db.exec('GRANT ALL ON ALL TABLES IN SCHEMA public TO anon,authenticated,service_role;')
  }
  const owner=randomUUID(),other=randomUUID(),form=randomUUID(),link=randomUUID()
  await db.query('INSERT INTO auth.users(id,email) VALUES($1,$2),($3,$4)',[owner,'owner@example.com',other,'other@example.com'])
  await db.query('INSERT INTO intake_forms(id,user_id,form_name,share_link,questions,qualification_policy) VALUES($1,$2,$3,$4,$5,$6)',[form,owner,'Website projects',link,JSON.stringify(DEFAULT_QUESTIONS),JSON.stringify(DEFAULT_QUALIFICATION_POLICY)])
  const answers={trigger:'New site',budget:'5k-10k',timeline:'1 month',decision_maker:'I decide',service:'Website design'}
  const decision=qualifyLead(answers,DEFAULT_QUESTIONS,DEFAULT_QUALIFICATION_POLICY)
  const capture=async(key=randomUUID(),hash='a'.repeat(64),version=1,enqueue=true)=>{
    const result=await db.query('SELECT capture_enquiry($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) AS receipt',[form,version,key,hash,'Prospect','lead@example.com',JSON.stringify(answers),JSON.stringify(decision),JSON.stringify({status:decision.qualificationStatus}),'project-fit-v2',enqueue])
    return result.rows[0].receipt
  }
  let leadId
  await t.test('duplicate capture returns one immutable receipt and one job',async()=>{
    const key=randomUUID(); const receipt=await capture(key);leadId=receipt.leadId
    assert.equal((await capture(key)).leadId,leadId)
    assert.equal((await db.query('SELECT count(*)::int n FROM lead_responses')).rows[0].n,1)
    assert.equal((await db.query('SELECT count(*)::int n FROM lead_jobs')).rows[0].n,1)
    await assert.rejects(capture(key,'b'.repeat(64)),/IDEMPOTENCY_CONFLICT/)
    await db.query("UPDATE intake_forms SET form_name='Edited' WHERE id=$1",[form])
    assert.equal((await capture(key)).leadId,leadId)
    await assert.rejects(capture(),/FORM_CHANGED/)
    assert.equal((await db.query('SELECT form_snapshot FROM lead_responses WHERE id=$1',[leadId])).rows[0].form_snapshot.form_name,'Website projects')
  })
  await t.test('anonymous access and score forgery are denied; another owner cannot read or edit',async()=>{
    await db.exec('SET ROLE anon')
    await assert.rejects(db.query('SELECT * FROM lead_responses'),/permission denied/)
    await assert.rejects(db.query('SELECT * FROM intake_forms'),/permission denied/)
    await assert.rejects(capture(randomUUID(),'a'.repeat(64),2),/permission denied/)
    await db.exec('RESET ROLE; SET ROLE authenticated')
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[other])
    assert.equal((await db.query('SELECT * FROM lead_responses')).rows.length,0)
    assert.equal((await db.query("UPDATE lead_responses SET pipeline_status='won' WHERE id=$1 RETURNING id",[leadId])).rows.length,0)
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[owner])
    assert.equal((await db.query('SELECT * FROM lead_responses')).rows.length,1)
    await assert.rejects(db.query("UPDATE lead_responses SET badge='Gold' WHERE id=$1",[leadId]),/permission denied/)
    await assert.rejects(db.query("UPDATE lead_responses SET pipeline_status='invalid' WHERE id=$1",[leadId]),/INVALID_PIPELINE_STATUS/)
    await db.query("UPDATE lead_responses SET pipeline_status='held' WHERE id=$1",[leadId])
    assert.equal((await db.query("SELECT actor_id FROM lead_events WHERE event='held'")).rows[0].actor_id,owner)
    await db.exec('RESET ROLE')
  })
  await t.test('10 simultaneous caller promises produce 10 receipts, duplicate callers produce one',async()=>{
    const receipts=await Promise.all(Array.from({length:10},()=>capture(randomUUID(),'a'.repeat(64),2)))
    assert.equal(new Set(receipts.map(r=>r.leadId)).size,10)
    const key=randomUUID();const duplicate=await Promise.all(Array.from({length:10},()=>capture(key,'a'.repeat(64),2)))
    assert.equal(new Set(duplicate.map(r=>r.leadId)).size,1)
  })
  await t.test('global two-slot worker limit and stale-lease protection',async()=>{
    const jobs=(await db.query('SELECT * FROM claim_lead_jobs()')).rows
    assert.equal(jobs.length,2);assert.equal((await db.query('SELECT * FROM claim_lead_jobs()')).rows.length,0)
    const job=jobs[0]
    assert.equal((await db.query('SELECT finish_lead_job($1,$2,$3,$4) ok',[job.id,randomUUID(),'Draft',null])).rows[0].ok,false)
    assert.equal((await db.query('SELECT finish_lead_job($1,$2,$3,$4) ok',[job.id,job.lease_token,'Reviewed draft',null])).rows[0].ok,true)
    assert.equal((await db.query('SELECT decision_snapshot FROM lead_responses WHERE id=$1',[job.lead_id])).rows[0].decision_snapshot.qualificationStatus,'ready_to_book')
    assert.equal((await db.query('SELECT * FROM claim_lead_jobs()')).rows.length,1)
    await db.query("UPDATE lead_jobs SET lease_until=now()-interval '1 second',attempts=3 WHERE state='running'")
    await db.query('SELECT * FROM claim_lead_jobs()')
    assert.equal((await db.query("SELECT count(*)::int n FROM lead_jobs WHERE state='failed'")).rows[0].n,2)
  })
  await t.test('quota rejection rolls back capture and counters',async()=>{
    const before=(await db.query('SELECT count(*)::int n FROM lead_responses')).rows[0].n
    await db.query("UPDATE intake_usage SET count=100 WHERE bucket=$1",['form:'+form])
    await assert.rejects(capture(randomUUID(),'a'.repeat(64),2),/INTAKE_LIMIT/)
    assert.equal((await db.query('SELECT count(*)::int n FROM lead_responses')).rows[0].n,before)
    assert.equal((await db.query('SELECT count FROM intake_usage WHERE bucket=$1',['form:'+form])).rows[0].count,100)
  })
  await t.test('worker failures back off and stop after three attempts',async()=>{
    await db.query("UPDATE lead_jobs SET state='completed',lease_until=null WHERE state='running'")
    const first=(await db.query('SELECT * FROM claim_lead_jobs()')).rows[0]
    assert.ok(first)
    for(let attempt=1;attempt<=3;attempt++) {
      const job=(await db.query('SELECT * FROM lead_jobs WHERE id=$1',[first.id])).rows[0]
      assert.equal((await db.query('SELECT finish_lead_job($1,$2,$3,$4) ok',[job.id,job.lease_token,null,'ENRICHMENT_FAILED'])).rows[0].ok,true)
      const updated=(await db.query('SELECT * FROM lead_jobs WHERE id=$1',[job.id])).rows[0]
      assert.equal(updated.state,attempt===3?'failed':'pending')
      if(attempt<3) {
        assert.equal((await db.query('SELECT available_at > now() delayed FROM lead_jobs WHERE id=$1',[job.id])).rows[0].delayed,true)
        // Isolate this retry from other pending jobs in the fixture.
        await db.query("UPDATE lead_jobs SET state='completed',lease_until=null WHERE id<>$1",[job.id])
        await db.query("UPDATE lead_jobs SET available_at=now()-interval '1 second' WHERE id=$1",[job.id])
        assert.equal((await db.query('SELECT * FROM claim_lead_jobs()')).rows[0].id,job.id)
      }
    }
    assert.equal((await db.query('SELECT analysis_status FROM lead_responses WHERE id=$1',[first.lead_id])).rows[0].analysis_status,'failed')
  })
  await t.test('paused forms reject fresh captures even with valid service-role credentials',async()=>{
    await db.query('UPDATE intake_forms SET is_published=false WHERE id=$1',[form])
    await db.exec('SET ROLE service_role')
    await assert.rejects(capture(randomUUID(),'a'.repeat(64),3),/FORM_UNAVAILABLE/)
    await db.exec('RESET ROLE')
  })
})
