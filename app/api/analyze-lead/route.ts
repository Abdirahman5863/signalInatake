import { NextRequest, NextResponse } from 'next/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { FormQuestion } from '@/lib/forms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, questions } = body

    if (!answers || !questions) {
      return NextResponse.json(
        { error: 'Missing answers or questions' },
        { status: 400 }
      )
    }

    console.log('🤖 LeadVett AI analyzing with', questions.length, 'custom questions...')

    const analysis = await analyzeLead(
      answers as Record<string, string>,
      questions as FormQuestion[]
    )

    console.log('✅ Analysis complete:', {
      badge: analysis.badge,
      confidence: `${analysis.confidenceScore}%`,
      rules: analysis.ruleBreakdown.length
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