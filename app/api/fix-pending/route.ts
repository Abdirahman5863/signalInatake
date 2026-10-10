import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({error:'This repair endpoint has been retired.'},{status:410}) }
export async function POST() { return NextResponse.json({error:'Use the authenticated lead worker to process pending enrichment.'},{status:410}) }
