import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { UUID, validateQuestions } from '@/lib/intake-validation'

export const dynamic = 'force-dynamic'
export async function GET(_request: Request, { params }: {params:Promise<{shareLink:string}>}) {
  const {shareLink} = await params
  if (!UUID.test(shareLink)) return NextResponse.json({error:'Form not found.'},{status:404})
  try {
    const {data,error} = await createAdminClient().from('intake_forms')
      .select('form_name,instructions,questions,share_link,version,qualification_policy').eq('share_link',shareLink).eq('is_published',true).maybeSingle()
    if (error) throw error
    if (!data || !validateQuestions(data.questions)) return NextResponse.json({error:'This form is not accepting enquiries.'},{status:404})
    const { qualification_policy, ...publicForm } = data
    return NextResponse.json({...publicForm,budget_currency:qualification_policy?.currency ?? 'USD',budget_basis:qualification_policy?.budgetBasis ?? 'monthly'},{headers:{'Cache-Control':'no-store'}})
  } catch { return NextResponse.json({error:'The form is temporarily unavailable. Please try again.'},{status:503}) }
}
