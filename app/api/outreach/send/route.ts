import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({error:'Bulk email sending is unavailable. Contact leads through your own email account.'},{status:410})
}
