import OpenAI from 'openai'
import { type FormAnswers } from '@/lib/forms'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface AnalysisResult {
  badge: 'Gold' | 'Silver' | 'Bronze'
  strengths: string[]
  risks: string[]
  dmScript: string
  summary: string
  action: string
  ruleBreakdown: RuleScore[]
  hardRuleTriggered?: string
}

export interface RuleScore {
  rule: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  explanation: string
}

// RULE ENGINE - Programmable Discipline
function evaluateRules(answers: FormAnswers): {
  baseScore: number
  ruleBreakdown: RuleScore[]
  hardRuleTriggered?: string
  maxBadgeCap?: 'Silver' | 'Bronze'
} {
  const rules: RuleScore[] = []
  let baseScore = 50 // Start neutral
  let hardRuleTriggered: string | undefined
  let maxBadgeCap: 'Silver' | 'Bronze' | undefined

  // HARD DISQUALIFIERS (Auto-reject logic)
  
  // Rule 1: Budget hard floor
  const budgetLower = answers.budget.toLowerCase()
  if (budgetLower.includes('<') || budgetLower.includes('less than') || 
      budgetLower.includes('under') || budgetLower.includes('1,000') ||
      budgetLower.includes('500')) {
    hardRuleTriggered = 'Budget below minimum threshold ($2K) → Auto-capped at Bronze'
    maxBadgeCap = 'Bronze'
    baseScore -= 30
    rules.push({
      rule: 'Hard Rule: Budget Floor',
      impact: 'negative',
      weight: -30,
      explanation: 'Budget below $2K minimum → Cannot qualify as Gold/Silver'
    })
  }

  // Rule 2: Budget strength (positive signals)
  if (budgetLower.includes('5,000') || budgetLower.includes('5k') ||
      budgetLower.includes('10,000') || budgetLower.includes('10k') ||
      budgetLower.includes('$5-') || budgetLower.includes('$10')) {
    baseScore += 20
    rules.push({
      rule: 'Budget Strength: High-Tier ($5K+)',
      impact: 'positive',
      weight: +20,
      explanation: 'Confirmed budget in premium range'
    })
  } else if (budgetLower.includes('3,000') || budgetLower.includes('3k')) {
    baseScore += 10
    rules.push({
      rule: 'Budget Strength: Mid-Tier ($3K+)',
      impact: 'positive',
      weight: +10,
      explanation: 'Workable budget mentioned'
    })
  }

  // Rule 3: Timeline urgency
  const timelineLower = answers.timeline.toLowerCase()
  if (timelineLower.includes('asap') || timelineLower.includes('immediately') ||
      timelineLower.includes('this week') || timelineLower.includes('urgent')) {
    baseScore += 15
    rules.push({
      rule: 'Timeline: Immediate Need',
      impact: 'positive',
      weight: +15,
      explanation: 'High urgency = ready to move fast'
    })
  } else if (timelineLower.includes('this month')) {
    baseScore += 10
    rules.push({
      rule: 'Timeline: Near-term',
      impact: 'positive',
      weight: +10,
      explanation: 'Clear timeline within 30 days'
    })
  } else if (timelineLower.includes('exploring') || timelineLower.includes('not sure') ||
             timelineLower.includes('eventually')) {
    baseScore -= 10
    rules.push({
      rule: 'Timeline: Vague/Distant',
      impact: 'negative',
      weight: -10,
      explanation: 'No urgency = lower priority'
    })
  }

  // Rule 4: Decision authority (CAP LOGIC)
  const decisionLower = answers.decision_maker.toLowerCase()
  if (decisionLower.includes('team') || decisionLower.includes('committee') ||
      decisionLower.includes('need to check') || decisionLower.includes('partner') ||
      decisionLower.includes('board')) {
    if (!maxBadgeCap) {
      maxBadgeCap = 'Silver'
    }
    baseScore -= 15
    rules.push({
      rule: 'Authority Friction: Multi-Stakeholder',
      impact: 'negative',
      weight: -15,
      explanation: 'No direct decision maker → Capped at Silver max'
    })
  } else if (decisionLower.includes('i do') || decisionLower.includes('i decide') ||
             decisionLower.includes('founder') || decisionLower.includes('ceo') ||
             decisionLower.includes('owner')) {
    baseScore += 15
    rules.push({
      rule: 'Authority: Clear Decision Maker',
      impact: 'positive',
      weight: +15,
      explanation: 'Direct authority = faster close'
    })
  }

  // Rule 5: Trigger clarity (pain point)
  if (answers.trigger.length > 50 && answers.trigger.toLowerCase().includes('because')) {
    baseScore += 10
    rules.push({
      rule: 'Trigger: Specific Pain Point',
      impact: 'positive',
      weight: +10,
      explanation: 'Clear articulation of problem'
    })
  } else if (answers.trigger.length < 20) {
    baseScore -= 5
    rules.push({
      rule: 'Trigger: Vague/Generic',
      impact: 'negative',
      weight: -5,
      explanation: 'Unclear motivation'
    })
  }

  // Rule 6: Previous attempts (sophistication signal)
  const triedLower = answers.tried.toLowerCase()
  if (triedLower.includes('nothing') || triedLower.includes('no') ||
      triedLower.includes('haven\'t tried')) {
    baseScore -= 5
    rules.push({
      rule: 'Experience: No Prior Attempts',
      impact: 'negative',
      weight: -5,
      explanation: 'Might not understand scope/pricing'
    })
  } else if (triedLower.includes('agency') || triedLower.includes('freelancer') ||
             triedLower.includes('in-house')) {
    // This could be positive (sophisticated) or negative (burned before)
    baseScore += 5
    rules.push({
      rule: 'Experience: Prior Vendor Experience',
      impact: 'positive',
      weight: +5,
      explanation: 'Understands process (watch for scope creep)'
    })
  }

  return {
    baseScore,
    ruleBreakdown: rules,
    hardRuleTriggered,
    maxBadgeCap
  }
}

// BADGE ASSIGNMENT with Rule Enforcement
function assignBadge(
  baseScore: number, 
  maxBadgeCap?: 'Silver' | 'Bronze'
): 'Gold' | 'Silver' | 'Bronze' {
  let calculatedBadge: 'Gold' | 'Silver' | 'Bronze'

  if (baseScore >= 70) {
    calculatedBadge = 'Gold'
  } else if (baseScore >= 45) {
    calculatedBadge = 'Silver'
  } else {
    calculatedBadge = 'Bronze'
  }

  // ENFORCE CAP LOGIC
  if (maxBadgeCap === 'Bronze') {
    return 'Bronze'
  } else if (maxBadgeCap === 'Silver' && calculatedBadge === 'Gold') {
    return 'Silver'
  }

  return calculatedBadge
}

// ACTION RECOMMENDATIONS - Resource-Based
function getAction(badge: 'Gold' | 'Silver' | 'Bronze'): string {
  switch (badge) {
    case 'Gold':
      return 'Book 30-min Strategy Call within 2 hours'
    case 'Silver':
      return 'Send 15-min Screening Loom Video'
    case 'Bronze':
      return 'Send Automated PDF Resource / Add to 90-day nurture'
  }
}

export async function analyzeLead(answers: FormAnswers): Promise<AnalysisResult> {
  // STEP 1: Rule Engine Evaluation
  const ruleEvaluation = evaluateRules(answers)
  
  // STEP 2: Assign Badge with Cap Logic
  const badge = assignBadge(ruleEvaluation.baseScore, ruleEvaluation.maxBadgeCap)
  
  // STEP 3: Get Resource-Based Action
  const action = getAction(badge)

  // STEP 4: Extract the EXACT budget/timeline the rules detected
  const detectedBudget = extractBudgetFromRules(ruleEvaluation.ruleBreakdown)
  const detectedTimeline = extractTimelineFromRules(ruleEvaluation.ruleBreakdown)

  // STEP 5: AI Enhancement with ENFORCED CONSISTENCY
  const prompt = `You are LeadVett AI - a senior consultant analyzing a lead.

RULE ENGINE RESULTS (YOU MUST USE THESE EXACT NUMBERS):
- Badge: ${badge}
- Score: ${ruleEvaluation.baseScore}/100
- Budget Detected: ${detectedBudget}
- Timeline Detected: ${detectedTimeline}
${ruleEvaluation.hardRuleTriggered ? `- Hard Rule: ${ruleEvaluation.hardRuleTriggered}` : ''}

Lead's Raw Answers:
- Trigger: "${answers.trigger}"
- Budget: "${answers.budget}"
- Timeline: "${answers.timeline}"
- Decision Maker: "${answers.decision_maker}"
- Previous Attempts: "${answers.tried}"

CRITICAL RULES:
1. You MUST use the exact budget range/amount detected by rules: "${detectedBudget}"
2. You MUST use the exact timeline detected by rules: "${detectedTimeline}"
3. DO NOT invent different numbers or ranges
4. Reference their actual words in quotes

Provide JSON:
{
  "strengths": [
    "Budget Confirmed: ${detectedBudget} mentioned explicitly",
    "Timeline Clear: ${detectedTimeline}",
    "Authority: [extract from decision_maker]"
  ],
  "risks": [
    "Watch-for points based on their actual answers"
  ],
  "dmScript": "Senior consultant tone. Reference their EXACT details. Example: 'Before we proceed with the ${detectedBudget} engagement, I need to understand what failed with your previous 3 agencies so we don't repeat those mistakes.'",
  "summary": "One decisive sentence"
}

Tone: Senior consultant who's already qualified them. Confident, not asking permission.`

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.5, // Lower temp for more consistency
      messages: [
        {
          role: 'system',
          content: 'You are LeadVett AI - senior, clinical, decisive. You enforce rules, not vibes. Use EXACT numbers from rule engine.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.choices[0].message.content
    if (!content) {
      throw new Error('No AI response')
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON in AI response')
    }

    const aiAnalysis = JSON.parse(jsonMatch[0])

    return {
      badge,
      strengths: aiAnalysis.strengths || [],
      risks: aiAnalysis.risks || [],
      dmScript: aiAnalysis.dmScript || 'Thanks for your interest. I need to review your submission before proceeding.',
      summary: aiAnalysis.summary || `${badge} lead - ${action}`,
      action,
      ruleBreakdown: ruleEvaluation.ruleBreakdown,
      hardRuleTriggered: ruleEvaluation.hardRuleTriggered
    }

  } catch (error) {
    console.error('❌ AI Enhancement Error:', error)
    
    // Fallback with EXACT rule engine data
    return {
      badge,
      strengths: [
        `Budget: ${detectedBudget}`,
        `Timeline: ${detectedTimeline}`,
        'Form submitted with required information'
      ],
      risks: ['AI analysis unavailable - manual review recommended'],
      dmScript: `Thanks for your interest. Given your ${detectedBudget} budget range and ${detectedTimeline} timeline, let me review your submission and get back to you.`,
      summary: `${badge} lead based on rule engine evaluation`,
      action,
      ruleBreakdown: ruleEvaluation.ruleBreakdown,
      hardRuleTriggered: ruleEvaluation.hardRuleTriggered
    }
  }
}

// Helper functions to extract what rules detected
function extractBudgetFromRules(rules: RuleScore[]): string {
  const budgetRule = rules.find(r => r.rule.includes('Budget'))
  if (budgetRule?.rule.includes('$5K+')) return '$5K-10K'
  if (budgetRule?.rule.includes('$3K+')) return '$3K-5K'
  if (budgetRule?.rule.includes('$2K')) return 'Below $2K'
  return 'Budget unclear'
}

function extractTimelineFromRules(rules: RuleScore[]): string {
  const timelineRule = rules.find(r => r.rule.includes('Timeline'))
  if (timelineRule?.rule.includes('Immediate')) return 'within 7 days'
  if (timelineRule?.rule.includes('Near-term')) return 'this month'
  if (timelineRule?.rule.includes('Vague')) return 'timeline unclear'
  return 'flexible timeline'
}