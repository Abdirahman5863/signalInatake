export class RequestError extends Error { constructor(message:string, public status=400) { super(message) } }
export async function readJson(request: Request, maxBytes=65536): Promise<Record<string,unknown>> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new RequestError('Use application/json.',415)
  if (Number(request.headers.get('content-length')) > maxBytes) throw new RequestError('Submission is too large.',413)
  const reader = request.body?.getReader()
  if (!reader) throw new RequestError('A request body is required.')
  let size=0; const chunks: Uint8Array[]=[]
  try {
    while (true) { const part=await reader.read(); if (part.done) break; size+=part.value.byteLength; if (size>maxBytes) { await reader.cancel(); throw new RequestError('Submission is too large.',413) }; chunks.push(part.value) }
  } finally { reader.releaseLock() }
  const bytes = new Uint8Array(size); let offset=0
  for (const c of chunks) { bytes.set(c,offset); offset+=c.length }
  try { const body=JSON.parse(new TextDecoder().decode(bytes)); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error(); return body }
  catch { throw new RequestError('Invalid JSON submission.') }
}
