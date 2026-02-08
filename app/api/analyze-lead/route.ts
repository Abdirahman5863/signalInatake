import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { type FormAnswers } from '@/lib/forms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, leadName, leadEmail, answers } = body

    if (!formId || !leadName || !leadEmail || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Analyze the lead using Claude
    const analysis = await analyzeLead(answers as FormAnswers)

    // Update the lead response with badge and reasoning
    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from('lead_responses')
      .update({
        badge: analysis.badge,
        badge_reasoning: analysis.reasoning,
      })
      .eq('form_id', formId)
      .eq('lead_email', leadEmail)
      .eq('lead_name', leadName)

    if (updateError) {
      console.error('Error updating lead response:', updateError)
      return NextResponse.json(
        { error: 'Failed to update lead response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error: any) {
    console.error('Error in analyze-lead API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

