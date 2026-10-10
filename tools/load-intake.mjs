// Synthetic write test for a dedicated staging form. Never use a customer form.
// node tools/load-intake.mjs https://staging.example.com SHARE_UUID answers.json --allow-test-writes
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'
const [origin, shareLink, answerFile, consent] = process.argv.slice(2)
if (!origin || !shareLink || !answerFile || consent !== '--allow-test-writes') throw new Error('Provide staging origin, share UUID, answers JSON, and --allow-test-writes.')
const base = new URL(origin)
if (base.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(base.hostname)) throw new Error('Use HTTPS or localhost.')
const formResponse = await fetch(new URL(`/api/intake/${encodeURIComponent(shareLink)}`,base))
if (!formResponse.ok) throw new Error(`Form lookup failed: ${formResponse.status}`)
const form = await formResponse.json()
const answers = JSON.parse(await readFile(answerFile,'utf8'))
const batch = randomUUID()
const submit = async (submissionKey,index) => {
  const start = performance.now()
  const response = await fetch(new URL('/api/analyze-lead',base), {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({shareLink,formVersion:form.version,submissionKey,leadName:`Staging test ${batch} ${index}`,leadEmail:`test-${index}@example.com`,answers})})
  const receipt = await response.json()
  if (!response.ok || !receipt.leadId) throw new Error(`Capture failed: ${response.status} ${receipt.error || ''}`)
  return {key:submissionKey,index,id:receipt.leadId,ms:performance.now()-start}
}
const results = await Promise.all(Array.from({length:10},(_,i)=>submit(randomUUID(),i)))
const replays = await Promise.all(results.map(r=>submit(r.key,r.index)))
if (new Set(results.map(r=>r.id)).size!==10 || replays.some((r,i)=>r.id!==results[i].id)) throw new Error('Lost or duplicated receipt.')
const times=results.map(r=>r.ms).sort((a,b)=>a-b)
console.log(JSON.stringify({batch,uniqueReceipts:10,replaysMatched:10,p50Ms:Math.round(times[4]),p95Ms:Math.round(times[9]),note:'Verify exactly ten matching rows and snapshots in the staging database. This small batch is not a sustained capacity benchmark.'},null,2))
