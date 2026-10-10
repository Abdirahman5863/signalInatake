import { DEFAULT_QUALIFICATION_POLICY, FormQuestion, QualificationPolicy } from './forms'

export const RULE_VERSION = 'project-fit-v2'
export type Decision = 'ready_to_book' | 'nurture' | 'not_a_fit' | 'manual_review'
export interface RuleScore { rule: string; impact: 'positive' | 'negative' | 'neutral'; weight: number; explanation: string }
export interface AnalysisResult {
  badge: 'Gold' | 'Silver' | 'Bronze'
  strengths: string[]; risks: string[]; dmScript: string; summary: string; action: string
  ruleBreakdown: RuleScore[]; hardRuleTriggered?: string
  // Legacy storage fields now describe evidence coverage, NOT conversion probability.
  confidenceScore: number; confidenceLevel: 'High' | 'Medium' | 'Low'
  qualificationStatus: Decision
}

export function normalizePolicy(raw: Partial<QualificationPolicy> = {}): QualificationPolicy {
  const p = { ...DEFAULT_QUALIFICATION_POLICY, ...raw }
  p.currency = raw.currency ?? 'USD'
  p.budgetBasis = raw.budgetBasis ?? 'monthly'
  if (p.minBudget !== null && (!Number.isFinite(p.minBudget) || p.minBudget < 0)) throw new Error('Invalid minimum budget')
  for (const key of ['goldThreshold', 'silverThreshold', 'manualReviewConfidence'] as const) {
    if (!Number.isFinite(p[key]) || p[key] < 0 || p[key] > 100) throw new Error('Invalid qualification threshold')
  }
  if (p.silverThreshold >= p.goldThreshold) throw new Error('Gold threshold must exceed Silver threshold')
  if (!['USD', 'KES', 'GBP', 'EUR'].includes(p.currency)) throw new Error('Unsupported currency')
  if (!['project', 'monthly'].includes(p.budgetBasis)) throw new Error('Invalid budget basis')
  if (p.supportedServices !== undefined && (!Array.isArray(p.supportedServices) || p.supportedServices.length > 20 || p.supportedServices.some(s => typeof s !== 'string' || s.length > 120))) throw new Error('Invalid services')
  p.supportedServices = p.supportedServices?.map(s => s.trim()).filter(Boolean) ?? []
  return p
}

export function parseBudget(value: string, currency = 'USD'): { min: number; max: number; maxInclusive: boolean } | null {
  let s = value.toLowerCase().trim().replace(/,/g, '').replace(/[–—]/g, '-')
  const detected = s.match(/usd|kes|ksh|gbp|eur|\$|£|€/g) ?? []
  const currencies: Record<string,string> = { usd:'USD', '$':'USD', kes:'KES', ksh:'KES', gbp:'GBP', '£':'GBP', eur:'EUR', '€':'EUR' }
  if (detected.some(c => currencies[c] !== currency)) return null
  s = s.replace(/usd|kes|ksh|gbp|eur|\$|£|€/g, '').replace(/\s+/g, '')
  const match = s.match(/^(<|<=|under|below|upto|over|>)?(\d+(?:\.\d+)?)(k|m)?(?:-(\d+(?:\.\d+)?)(k|m)?)?(\+)?$/)
  if (!match) return null
  const [,op,a,unitA,b,unitB,plus] = match
  const multiplier = (unit?: string) => unit === 'm' ? 1000000 : unit === 'k' ? 1000 : 1
  const lo = Number(a) * multiplier(unitA || (b ? unitB : undefined))
  const hi = b ? Number(b) * multiplier(unitB || unitA) : lo
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo || (b && (op || plus))) return null
  if (['<', 'under', 'below', '<=', 'upto'].includes(op)) return { min:0, max:lo, maxInclusive:op === '<=' || op === 'upto' }
  return { min:lo, max:plus || op === '>' || op === 'over' ? Infinity : hi, maxInclusive:true }
}

export const decisionLabels: Record<Decision,string> = {
  ready_to_book:'Invite to discovery', manual_review:'Needs clarification', nurture:'Review timing', not_a_fit:'Not currently a fit',
}

export function qualifyLead(answers: Record<string,string>, questions: FormQuestion[], rawPolicy: Partial<QualificationPolicy> = {}): AnalysisResult {
  const policy = normalizePolicy(rawPolicy)
  const rules: RuleScore[] = []; const missing: string[] = []; let score = 35; let known = 0; let hard: string | undefined
  const add = (rule:string, weight:number, explanation:string) => { score += weight; rules.push({rule,weight,explanation,impact:weight > 0 ? 'positive' : weight < 0 ? 'negative' : 'neutral'}) }
  const question = (purpose:string, pattern:RegExp) => questions.find(q => q.purpose === purpose) ?? questions.find(q => pattern.test(q.question))
  const budgetQ = question('budget', /budget|price|invest/i)
  const budget = parseBudget(answers[budgetQ?.id ?? ''] ?? '', policy.currency)
  if (!budget || policy.minBudget === null) {
    missing.push(!budget ? 'Clarify the budget amount and currency.' : 'Set a minimum budget before automatically inviting leads.')
  } else {
    const below = budget.max < policy.minBudget || (budget.max === policy.minBudget && !budget.maxInclusive)
    if (below) { known++; hard = `Reported budget is below your ${policy.currency} ${policy.minBudget.toLocaleString()} ${policy.budgetBasis} minimum.`; add('Budget below minimum',-35,hard) }
    else if (budget.min < policy.minBudget) missing.push('The budget range overlaps your minimum. Ask for the allocated amount.')
    else { known++; add('Budget meets minimum',30,`Reported ${policy.budgetBasis} budget meets your ${policy.currency} ${policy.minBudget.toLocaleString()} minimum.`) }
  }
  const timelineQ = question('timeline', /timeline|when|urgency|start/i)
  const timeline = (answers[timelineQ?.id ?? ''] ?? '').trim().toLowerCase()
  if (/^(asap|immediately|urgent|now|this week)$/.test(timeline)) { known++; add('Near-term timing',20,'The prospect reports an immediate need. Confirm your availability.') }
  else if (/^(1-2 weeks|1 month|this month|within a month|soon)$/.test(timeline)) { known++; add('Near-term timing',15,'The prospect reports a start within about a month.') }
  else if (/^(2-3 months|1-3 months|3\+ months|few months)$/.test(timeline)) { known++; add('Later timing',5,'Check your availability and agree a suitable follow-up date.') }
  else missing.push('Clarify the project timeline.')
  const authorityQ = question('authority', /decide|authority|who approves/i)
  const authority = (answers[authorityQ?.id ?? ''] ?? '').trim().toLowerCase().replace(/[.!]$/, '')
  if (/^(i do|i decide|me alone|founder|ceo|owner|i am the (owner|founder|ceo))$/.test(authority)) { known++; add('Self-reported approver',15,'The prospect says they approve the project. This has not been independently verified.') }
  else if (/^(me and a partner|me \+ partner|a team or committee|team|committee|board|partner)$/.test(authority)) { known++; add('Shared approval',5,'Confirm the other stakeholders before proceeding.') }
  else missing.push('Clarify who approves this project; do not infer authority from a job-title keyword.')
  const serviceQ = questions.find(q => q.purpose === 'service')
  if (policy.supportedServices?.length) {
    const service = answers[serviceQ?.id ?? ''] ?? ''
    if (!service || /other|not sure/i.test(service)) missing.push('Clarify the service needed.')
    else if (!policy.supportedServices.some(s => s.toLowerCase() === service.toLowerCase())) {
      hard = `The requested service (${service}) is outside this form's supported services.`
      add('Service mismatch',-35,hard)
    }
  }
  const coverage = Math.round(known / 3 * 100)
  const status: Decision = hard ? 'not_a_fit' : missing.length || coverage < policy.manualReviewConfidence ? 'manual_review' : score >= policy.goldThreshold ? 'ready_to_book' : 'nurture'
  const badge = status === 'not_a_fit' ? 'Bronze' : status === 'ready_to_book' ? 'Gold' : 'Silver'
  const action = decisionLabels[status]
  return {
    badge, qualificationStatus:status, action, ruleBreakdown:rules, hardRuleTriggered:hard,
    confidenceScore:coverage, confidenceLevel:coverage === 100 ? 'High' : coverage >= 50 ? 'Medium' : 'Low',
    strengths:rules.filter(r => r.impact === 'positive').map(r => r.explanation),
    risks:[...missing, ...rules.filter(r => r.impact === 'negative').map(r => r.explanation)],
    summary:hard ?? (missing[0] || (status === 'ready_to_book' ? 'The reported budget, timing and approval process meet your configured criteria.' : 'Review timing and approval before offering a discovery call.')),
    dmScript:status === 'ready_to_book' ? 'Thanks for sharing your project. Your answers look like a potential fit. Let us arrange a discovery call to confirm the scope.' : 'Thanks for your enquiry. We will review the details and follow up with the next step.',
  }
}
