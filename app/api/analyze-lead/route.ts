import { NextRequest, NextResponse } from 'next/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { type FormAnswers } from '@/lib/forms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json(
        { error: 'Missing answers' },
        { status: 400 }
      )
    }

    console.log('🤖 LeadVett AI analyzing...')

    const analysis = await analyzeLead(answers as FormAnswers)

    console.log('✅ Analysis complete:', {
      badge: analysis.badge,
      strengths: analysis.strengths?.length || 0,
      risks: analysis.risks?.length || 0,
      hasScript: !!analysis.dmScript
    })

    return NextResponse.json({ 
      success: true, 
      analysis 
    })
    
  } catch (error: any) {
    console.error('❌ LeadVett AI Error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}