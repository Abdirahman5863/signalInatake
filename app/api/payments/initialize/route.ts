import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'LeadVett is free. No payment is required.' },
    { status: 410 },
  )
}
