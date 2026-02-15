import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { type FormAnswers } from '@/lib/forms'

async function fixPendingLeads() {
  const supabase = await createClient()

  // Get all leads without badges
  const { data: leads, error } = await supabase
    .from('lead_responses')
    .select('*')
    .is('badge', null)

  if (error) throw error

  console.log(`📊 Found ${leads?.length || 0} pending leads`)

  if (!leads || leads.length === 0) {
    return { message: 'No pending leads found', total: 0, results: [] }
  }

  const results = []

  for (const lead of leads) {
    try {
      const answers = lead.answers as FormAnswers

      console.log(`🔍 Analyzing: ${lead.lead_name} (${lead.lead_email})`)

      const analysis = await analyzeLead(answers)

      console.log(`✅ Badge: ${analysis.badge}`)

      const { error: updateError } = await supabase
        .from('lead_responses')
        .update({
          badge: analysis.badge,
           strengths: analysis.strengths?.length || 0,
      risks: analysis.risks?.length || 0,
      hasScript:analysis.dmScript
        })
        .eq('id', lead.id)

      if (updateError) {
        console.error(`❌ Update failed:`, updateError)
        results.push({ 
          id: lead.id, 
          name: lead.lead_name,
          email: lead.lead_email,
          success: false,
          error: updateError.message 
        })
      } else {
        results.push({ 
          id: lead.id, 
          name: lead.lead_name,
          email: lead.lead_email,
          badge: analysis.badge,
          success: true 
        })
      }

    } catch (err: any) {
      console.error(`❌ Analysis failed:`, err)
      results.push({ 
        id: lead.id, 
        name: lead.lead_name,
        email: lead.lead_email,
        success: false,
        error: err.message 
      })
    }
  }

  return {
    success: true,
    total: leads.length,
    results,
  }
}

// GET handler (for browser access)
export async function GET() {
  try {
    const result = await fixPendingLeads()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST handler (for API calls)
export async function POST() {
  try {
    const result = await fixPendingLeads()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}