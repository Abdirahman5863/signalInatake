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

    console.log('🤖 Analyzing lead with OpenAI...')

    // Analyze the lead
    const analysis = await analyzeLead(answers as FormAnswers)

    console.log('✅ Analysis result:', analysis.badge, '-', analysis.reasoning.substring(0, 50) + '...')

    return NextResponse.json({ 
      success: true, 
      analysis 
    })
    
  } catch (error: any) {
    console.error('❌ Analysis API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
