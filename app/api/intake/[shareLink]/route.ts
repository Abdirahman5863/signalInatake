import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { UUID, validateQuestions } from '@/lib/intake-validation'

export const dynamic = 'force-dynamic'
export async function GET(_request: Request, { params }: {params:Promise<{shareLink:string}>}) {
  const {shareLink} = await params
  try {
    const db = createAdminClient()
    let {data,error} = await db.from('intake_forms')
      .select('form_name,instructions,questions,share_link,version,qualification_policy').eq('slug',shareLink).eq('is_published',true).maybeSingle()
    // Keep existing UUID-based public links working during and after migration.
    if (!error && !data && UUID.test(shareLink)) {
      ({data,error} = await db.from('intake_forms')
        .select('form_name,instructions,questions,share_link,version,qualification_policy').eq('share_link',shareLink).eq('is_published',true).maybeSingle())
    }
    if (error) throw error
    if (!data || !validateQuestions(data.questions)) return NextResponse.json({error:'This form is not accepting enquiries.'},{status:404})
    const { qualification_policy, ...publicForm } = data
    return NextResponse.json({...publicForm,budget_currency:qualification_policy?.currency ?? 'USD',budget_basis:qualification_policy?.budgetBasis ?? 'monthly'},{headers:{'Cache-Control':'no-store'}})
  } catch { return NextResponse.json({error:'The form is temporarily unavailable. Please try again.'},{status:503}) }
}
