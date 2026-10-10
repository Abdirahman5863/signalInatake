import assert from 'node:assert/strict'
const base = 'http://127.0.0.1:4310'
for (const [path,method,status] of [
  ['/','GET',200],['/login','GET',200],['/signup','GET',200],
  ['/dashboard','GET',307],['/api/intake/invalid','GET',404],
  ['/api/analyze-lead','POST',400],['/api/jobs/process','POST',401],
  ['/api/outreach/send','POST',410],['/api/welcome','POST',410],
  ['/api/payments/initialize','POST',410],
]) {
  const response=await fetch(base+path,{method,redirect:'manual',...(method==='POST'?{headers:{'content-type':'application/json'},body:'{}'}:{})})
  assert.equal(response.status,status,`${method} ${path}`)
  if(path==='/') {
    const html=await response.text()
    assert.ok(html.includes('worth a discovery call'))
    assert.ok(!html.includes('87% confidence'))
  }
  if(path==='/dashboard') assert.ok(response.headers.get('location')?.endsWith('/login'))
  console.log(`${response.status} ${method} ${path}`)
}
