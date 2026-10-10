import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Subscriptions are retired because LeadVett is free.' },
    { status: 410 },
  )
}
