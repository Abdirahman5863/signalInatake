import OpenAI from 'openai'
import { FormQuestion } from '@/lib/forms'

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
  confidenceScore: number
  confidenceLevel: 'High' | 'Medium' | 'Low'
}

export interface RuleScore {
  rule: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  explanation: string
}

// FLEXIBLE RULE ENGINE - Works with ANY questions
function evaluateRules(
  answers: Record<string, string>,
  questions: FormQuestion[]
): {
  baseScore: number
  ruleBreakdown: RuleScore[]
  hardRuleTriggered?: string
  maxBadgeCap?: 'Silver' | 'Bronze'
} {
  const rules: RuleScore[] = []
  let baseScore = 50
  let hardRuleTriggered: string | undefined
  let maxBadgeCap: 'Silver' | 'Bronze' | undefined

  // Find key questions by analyzing question text
  const budgetQuestion = questions.find(q => 
    q.question.toLowerCase().includes('budget') ||
    q.question.toLowerCase().includes('price') ||
    q.question.toLowerCase().includes('invest')
  )
  
  const timelineQuestion = questions.find(q =>
    q.question.toLowerCase().includes('timeline') ||
    q.question.toLowerCase().includes('when') ||
    q.question.toLowerCase().includes('urgency') ||
    q.question.toLowerCase().includes('start')
  )
  
  const decisionQuestion = questions.find(q =>
    q.question.toLowerCase().includes('decide') ||
    q.question.toLowerCase().includes('authority') ||
    q.question.toLowerCase().includes('who makes')
  )

  // BUDGET ANALYSIS
  if (budgetQuestion) {
    const budgetAnswer = answers[budgetQuestion.id]?.toLowerCase() || ''
    
    // High budget signals
    if (budgetAnswer.includes('5,000') || budgetAnswer.includes('5k') ||
        budgetAnswer.includes('10,000') || budgetAnswer.includes('10k') ||
        budgetAnswer.includes('$5') || budgetAnswer.includes('$10')) {
      baseScore += 25
      rules.push({
        rule: 'Budget Strength: High-Tier ($5K+)',
        impact: 'positive',
        weight: +25,
        explanation: 'Strong budget commitment - premium buyer signal'
      })
    }
    // Mid budget
    else if (budgetAnswer.includes('2,000') || budgetAnswer.includes('2k') ||
             budgetAnswer.includes('3,000') || budgetAnswer.includes('3k') ||
             budgetAnswer.includes('$2') || budgetAnswer.includes('$3')) {
      baseScore += 15
      rules.push({
        rule: 'Budget Strength: Mid-Tier ($2K-$5K)',
        impact: 'positive',
        weight: +15,
        explanation: 'Workable budget - qualified prospect'
      })
    }
    // Lower budget but not disqualified
    else if (budgetAnswer.includes('500') || budgetAnswer.includes('1,000') ||
             budgetAnswer.includes('1k') || budgetAnswer.includes('$500')) {
      baseScore -= 10
      maxBadgeCap = 'Bronze'
      rules.push({
        rule: 'Budget Concern: Entry-Level',
        impact: 'negative',
        weight: -10,
        explanation: 'Lower budget range - may need nurturing'
      })
    }
  }

  // TIMELINE ANALYSIS
  if (timelineQuestion) {
    const timelineAnswer = answers[timelineQuestion.id]?.toLowerCase() || ''
    
    if (timelineAnswer.includes('asap') || timelineAnswer.includes('immediately') ||
        timelineAnswer.includes('urgent') || timelineAnswer.includes('now') ||
        timelineAnswer.includes('this week')) {
      baseScore += 20
      rules.push({
        rule: 'Timeline: Immediate Need (ASAP)',
        impact: 'positive',
        weight: +20,
        explanation: 'High urgency - ready to move fast'
      })
    }
    else if (timelineAnswer.includes('this month') || timelineAnswer.includes('soon') ||
             timelineAnswer.includes('1-2 weeks') || timelineAnswer.includes('within a month')) {
      baseScore += 12
      rules.push({
        rule: 'Timeline: Near-term (1-4 weeks)',
        impact: 'positive',
        weight: +12,
        explanation: 'Clear short-term timeline'
      })
    }
    else if (timelineAnswer.includes('1-3 months') || timelineAnswer.includes('few months')) {
      baseScore += 5
      rules.push({
        rule: 'Timeline: Mid-range (1-3 months)',
        impact: 'neutral',
        weight: +5,
        explanation: 'Planning ahead - nurture opportunity'
      })
    }
    else if (timelineAnswer.includes('exploring') || timelineAnswer.includes('not sure') ||
             timelineAnswer.includes('eventually') || timelineAnswer.includes('browsing')) {
      baseScore -= 12
      rules.push({
        rule: 'Timeline: Vague/Distant',
        impact: 'negative',
        weight: -12,
        explanation: 'No clear urgency - low priority'
      })
    }
  }

  // DECISION AUTHORITY ANALYSIS
  if (decisionQuestion) {
    const decisionAnswer = answers[decisionQuestion.id]?.toLowerCase() || ''
    
    if (decisionAnswer.includes('i do') || decisionAnswer.includes('i decide') ||
        decisionAnswer.includes('me alone') || decisionAnswer.includes('founder') || 
        decisionAnswer.includes('ceo') || decisionAnswer.includes('owner')) {
      baseScore += 18
      rules.push({
        rule: 'Authority: Direct Decision Maker',
        impact: 'positive',
        weight: +18,
        explanation: 'Clear authority - can close fast'
      })
    }
    else if (decisionAnswer.includes('me + ') || decisionAnswer.includes('partner')) {
      baseScore += 5
      rules.push({
        rule: 'Authority: Shared Decision (2 people)',
        impact: 'neutral',
        weight: +5,
        explanation: 'One approval needed - manageable friction'
      })
    }
    else if (decisionAnswer.includes('team') || decisionAnswer.includes('committee') ||
             decisionAnswer.includes('board')) {
      baseScore -= 15
      if (!maxBadgeCap || maxBadgeCap === 'Bronze') {
        maxBadgeCap = 'Silver'
      }
      rules.push({
        rule: 'Authority Friction: Multi-Stakeholder',
        impact: 'negative',
        weight: -15,
        explanation: 'Multiple decision makers - longer sales cycle'
      })
    }
  }

  // GENERAL ANSWER QUALITY
  const allAnswers = Object.values(answers).join(' ')
  if (allAnswers.length > 250) {
    baseScore += 8
    rules.push({
      rule: 'Response Quality: Detailed',
      impact: 'positive',
      weight: +8,
      explanation: 'Comprehensive answers - engaged prospect'
    })
  } else if (allAnswers.length < 100) {
    baseScore -= 5
    rules.push({
      rule: 'Response Quality: Brief',
      impact: 'negative',
      weight: -5,
      explanation: 'Short answers - may lack commitment'
    })
  }

  return {
    baseScore,
    ruleBreakdown: rules,
    hardRuleTriggered,
    maxBadgeCap
  }
}

function assignBadge(
  baseScore: number, 
  maxBadgeCap?: 'Silver' | 'Bronze'
): 'Gold' | 'Silver' | 'Bronze' {
  let calculatedBadge: 'Gold' | 'Silver' | 'Bronze'

  // Gold: 75-100 (Strong lead)
  // Silver: 50-74 (Qualified lead)
  // Bronze: 0-49 (Needs nurturing)
  
  if (baseScore >= 75) {
    calculatedBadge = 'Gold'
  } else if (baseScore >= 50) {
    calculatedBadge = 'Silver'
  } else {
    calculatedBadge = 'Bronze'
  }

  // Apply caps if hard rules triggered
  if (maxBadgeCap === 'Bronze') {
    return 'Bronze'
  } else if (maxBadgeCap === 'Silver' && calculatedBadge === 'Gold') {
    return 'Silver'
  }

  return calculatedBadge
}

function getAction(badge: 'Gold' | 'Silver' | 'Bronze', score: number): string {
  switch (badge) {
    case 'Gold':
      if (score >= 85) {
        return 'Priority: Book call within 2 hours'
      } else if (score >= 75) {
        return 'Book 30-min strategy call today'
      } else {
        return 'Book call within 24 hours'
      }
    case 'Silver':
      return 'Send 15-min screening Loom video'
    case 'Bronze':
      return 'Add to 90-day nurture sequence'
  }
}

function calculateConfidence(
  baseScore: number,
  ruleBreakdown: RuleScore[]
): { score: number; level: 'High' | 'Medium' | 'Low' } {
  const normalizedScore = Math.max(0, Math.min(100, baseScore))
  const positiveRules = ruleBreakdown.filter(r => r.impact === 'positive').length
  const negativeRules = ruleBreakdown.filter(r => r.impact === 'negative').length
  
  let confidence = normalizedScore
  if (positiveRules >= 3) confidence += 8
  if (positiveRules > 0 && negativeRules > 0) confidence -= 3
  confidence = Math.min(100, confidence)
  
  let level: 'High' | 'Medium' | 'Low'
  if (confidence >= 75) level = 'High'
  else if (confidence >= 50) level = 'Medium'
  else level = 'Low'
  
  return { score: Math.round(confidence), level }
}

export async function analyzeLead(
  answers: Record<string, string>,
  questions: FormQuestion[]
): Promise<AnalysisResult> {
  // STEP 1: Rule Engine Evaluation
  const ruleEvaluation = evaluateRules(answers, questions)
  
  // STEP 2: Assign Badge based on score
  const badge = assignBadge(ruleEvaluation.baseScore, ruleEvaluation.maxBadgeCap)
  
  // STEP 3: Get Action
  const action = getAction(badge, ruleEvaluation.baseScore)

  // STEP 4: Calculate Confidence
  const confidence = calculateConfidence(
    ruleEvaluation.baseScore,
    ruleEvaluation.ruleBreakdown
  )

  // STEP 5: Build context for AI
  const questionsContext = questions.map((q, idx) => 
    `Q${idx + 1}: ${q.question}\nA: ${answers[q.id] || 'No answer'}`
  ).join('\n\n')

  // STEP 6: AI Enhancement
  const prompt = `You are LeadVett AI - analyzing lead qualification to help founders decide who deserves a call.

ANALYSIS RESULTS:
- Badge: ${badge}
- Score: ${ruleEvaluation.baseScore}/100
- Confidence: ${confidence.score}% (${confidence.level})
${ruleEvaluation.hardRuleTriggered ? `- Note: ${ruleEvaluation.hardRuleTriggered}` : ''}

FORM RESPONSES:
${questionsContext}

Provide your analysis:
{
  "strengths": ["3-5 specific positive signals from their answers"],
  "risks": ["2-4 concerns or friction points to watch"],
  "dmScript": "A personalized DM/email that references their specific answers and suggests next steps. Professional but warm.",
  "summary": "One clear sentence: Is this person worth a call right now?"
}

Be specific. Reference their actual words. Only respond with JSON.`

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are LeadVett AI - you help founders decide who deserves a call by analyzing buying intent signals.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.choices[0].message.content
    if (!content) throw new Error('No AI response')

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const aiAnalysis = JSON.parse(jsonMatch[0])

    return {
      badge,
      strengths: aiAnalysis.strengths || ['Form completed with details'],
      risks: aiAnalysis.risks || ['No specific concerns identified'],
      dmScript: aiAnalysis.dmScript || 'Thanks for your interest. Let me review your submission and get back to you.',
      summary: aiAnalysis.summary || `${badge} lead (${ruleEvaluation.baseScore}/100) - ${action}`,
      action,
      ruleBreakdown: ruleEvaluation.ruleBreakdown,
      hardRuleTriggered: ruleEvaluation.hardRuleTriggered,
      confidenceScore: confidence.score,
      confidenceLevel: confidence.level
    }

  } catch (error) {
    console.error('❌ AI Enhancement Error:', error)
    
    return {
      badge,
      strengths: ['Form submitted with information'],
      risks: ['AI analysis unavailable - manual review recommended'],
      dmScript: 'Thanks for your interest. Let me review your submission and get back to you shortly.',
      summary: `${badge} lead (${ruleEvaluation.baseScore}/100) based on rule engine`,
      action,
      ruleBreakdown: ruleEvaluation.ruleBreakdown,
      hardRuleTriggered: ruleEvaluation.hardRuleTriggered,
      confidenceScore: confidence.score,
      confidenceLevel: confidence.level
    }
  }
}