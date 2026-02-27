import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeLead } from '@/lib/ai/analyze'
import { FormQuestion } from '@/lib/forms'

async function fixPendingLeads() {
  const supabase = await createClient()

  // Get all leads without badges, including their form's questions
  const { data: leads, error } = await supabase
    .from('lead_responses')
    .select(`
      *,
      intake_forms!inner (
        id,
        questions
      )
    `)
    .is('badge', null)

  if (error) throw error

  console.log(`📊 Found ${leads?.length || 0} pending leads`)

  if (!leads || leads.length === 0) {
    return { 
      success: true,
      message: 'No pending leads found', 
      total: 0, 
      results: [] 
    }
  }

  const results = []

  for (const lead of leads) {
    try {
      const answers = lead.answers as Record<string, string>
      const questions = lead.intake_forms?.questions as FormQuestion[] || []

      if (questions.length === 0) {
        console.warn(`⚠️ No questions found for lead ${lead.id}`)
        results.push({ 
          id: lead.id, 
          name: lead.lead_name,
          email: lead.lead_email,
          success: false,
          error: 'No form questions available'
        })
        continue
      }

      console.log(`🔍 Analyzing: ${lead.lead_name} (${lead.lead_email})`)

      // Analyze with the form's custom questions
      const analysis = await analyzeLead(answers, questions)

      console.log(`✅ Badge: ${analysis.badge} | Confidence: ${analysis.confidenceScore}%`)

      // Update with full analysis data
      const { error: updateError } = await supabase
        .from('lead_responses')
        .update({
          badge: analysis.badge,
          summary: analysis.summary,
          strengths: analysis.strengths,
          risks: analysis.risks,
          dm_script: analysis.dmScript,
          action: analysis.action,
          rule_breakdown: analysis.ruleBreakdown,
          hard_rule_triggered: analysis.hardRuleTriggered,
          confidence_score: analysis.confidenceScore,
          confidence_level: analysis.confidenceLevel,
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
          confidence: analysis.confidenceScore,
          action: analysis.action,
          success: true 
        })
      }

    } catch (err: any) {
      console.error(`❌ Analysis failed for lead ${lead.id}:`, err)
      results.push({ 
        id: lead.id, 
        name: lead.lead_name,
        email: lead.lead_email,
        success: false,
        error: err.message 
      })
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return {
    success: true,
    message: `Processed ${leads.length} leads: ${successCount} successful, ${failCount} failed`,
    total: leads.length,
    successful: successCount,
    failed: failCount,
    results,
  }
}

// GET handler (for browser access)
export async function GET() {
  try {
    console.log('🔄 Starting pending leads fix...')
    const result = await fixPendingLeads()
    console.log('✅ Fix complete:', result.message)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}

// POST handler (for API calls)
export async function POST() {
  try {
    console.log('🔄 Starting pending leads fix...')
    const result = await fixPendingLeads()
    console.log('✅ Fix complete:', result.message)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}