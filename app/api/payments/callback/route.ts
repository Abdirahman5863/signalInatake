import { NextResponse } from 'next/server'

const retired = () => NextResponse.json(
  { error: 'Payments are retired because LeadVett is free.' },
  { status: 410 },
)

export const GET = retired
export const POST = retired
