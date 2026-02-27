import OpenAI from 'openai'
import { FormQuestion } from '@/lib/forms'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface AnalysisResult {
  badge: 'Gold' | 'Silver' | 'Bronze' | 'Rejected'
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
    q.question.toLowerCase().includes('urgency')
  )
  
  const decisionQuestion = questions.find(q =>
    q.question.toLowerCase().includes('decide') ||
    q.question.toLowerCase().includes('authority') ||
    q.question.toLowerCase().includes('who makes')
  )

  // BUDGET ANALYSIS
  if (budgetQuestion) {
    const budgetAnswer = answers[budgetQuestion.id]?.toLowerCase() || ''
    
    // Hard floor check
    if (budgetAnswer.includes('<') || budgetAnswer.includes('less than') ||
        budgetAnswer.includes('under') || budgetAnswer.includes('1,000') ||
        budgetAnswer.includes('500') || budgetAnswer.includes('1k')) {
      hardRuleTriggered = `Budget below threshold (${answers[budgetQuestion.id]})`
      maxBadgeCap = 'Bronze'
      baseScore -= 30
      rules.push({
        rule: 'Hard Rule: Budget Floor',
        impact: 'negative',
        weight: -30,
        explanation: 'Budget below minimum threshold'
      })
    }
    // High budget signals
    else if (budgetAnswer.includes('5,000') || budgetAnswer.includes('5k') ||
             budgetAnswer.includes('10,000') || budgetAnswer.includes('10k') ||
             budgetAnswer.includes('$5') || budgetAnswer.includes('$10')) {
      baseScore += 20
      rules.push({
        rule: 'Budget Strength: High-Tier',
        impact: 'positive',
        weight: +20,
        explanation: 'Strong budget commitment indicated'
      })
    }
    // Mid budget
    else if (budgetAnswer.includes('3,000') || budgetAnswer.includes('3k') ||
             budgetAnswer.includes('$3')) {
      baseScore += 10
      rules.push({
        rule: 'Budget Strength: Mid-Tier',
        impact: 'positive',
        weight: +10,
        explanation: 'Workable budget mentioned'
      })
    }
  }

  // TIMELINE ANALYSIS
  if (timelineQuestion) {
    const timelineAnswer = answers[timelineQuestion.id]?.toLowerCase() || ''
    
    if (timelineAnswer.includes('asap') || timelineAnswer.includes('immediately') ||
        timelineAnswer.includes('urgent') || timelineAnswer.includes('now')) {
      baseScore += 15
      rules.push({
        rule: 'Timeline: Immediate Need',
        impact: 'positive',
        weight: +15,
        explanation: 'High urgency indicated'
      })
    }
    else if (timelineAnswer.includes('this month') || timelineAnswer.includes('soon') ||
             timelineAnswer.includes('1-2 weeks')) {
      baseScore += 10
      rules.push({
        rule: 'Timeline: Near-term',
        impact: 'positive',
        weight: +10,
        explanation: 'Clear short-term timeline'
      })
    }
    else if (timelineAnswer.includes('exploring') || timelineAnswer.includes('not sure') ||
             timelineAnswer.includes('eventually')) {
      baseScore -= 10
      rules.push({
        rule: 'Timeline: Vague/Distant',
        impact: 'negative',
        weight: -10,
        explanation: 'No clear urgency'
      })
    }
  }

  // DECISION AUTHORITY ANALYSIS
  if (decisionQuestion) {
    const decisionAnswer = answers[decisionQuestion.id]?.toLowerCase() || ''
    
    if (decisionAnswer.includes('team') || decisionAnswer.includes('committee') ||
        decisionAnswer.includes('partner') || decisionAnswer.includes('board')) {
      if (!maxBadgeCap) {
        maxBadgeCap = 'Silver'
      }
      baseScore -= 15
      rules.push({
        rule: 'Authority Friction: Multi-Stakeholder',
        impact: 'negative',
        weight: -15,
        explanation: 'Multiple decision makers involved'
      })
    }
    else if (decisionAnswer.includes('i do') || decisionAnswer.includes('i decide') ||
             decisionAnswer.includes('founder') || decisionAnswer.includes('ceo') ||
             decisionAnswer.includes('owner') || decisionAnswer.includes('me')) {
      baseScore += 15
      rules.push({
        rule: 'Authority: Clear Decision Maker',
        impact: 'positive',
        weight: +15,
        explanation: 'Direct authority confirmed'
      })
    }
  }

  // GENERAL ANSWER QUALITY
  const allAnswers = Object.values(answers).join(' ')
  if (allAnswers.length > 200) {
    baseScore += 5
    rules.push({
      rule: 'Response Quality: Detailed',
      impact: 'positive',
      weight: +5,
      explanation: 'Comprehensive answers provided'
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
): 'Gold' | 'Silver' | 'Bronze' | 'Rejected' {
  let calculatedBadge: 'Gold' | 'Silver' | 'Bronze'

  if (baseScore >= 70) {
    calculatedBadge = 'Gold'
  } else if (baseScore >= 45) {
    calculatedBadge = 'Silver'
  } else {
    calculatedBadge = 'Bronze'
  }

  if (maxBadgeCap === 'Bronze') {
    return 'Bronze'
  } else if (maxBadgeCap === 'Silver' && calculatedBadge === 'Gold') {
    return 'Silver'
  }

  return calculatedBadge
}

function getAction(badge: 'Gold' | 'Silver' | 'Bronze' | 'Rejected'): string {
  switch (badge) {
    case 'Gold':
      return 'Book 30-min Strategy Call within 2 hours'
    case 'Silver':
      return 'Send 15-min Screening Loom Video'
    case 'Bronze':
      return 'Add to 90-day Nurture Sequence'
    case 'Rejected':
      return 'Disqualified - Archive'
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
  if (positiveRules >= 3) confidence += 10
  if (positiveRules > 0 && negativeRules > 0) confidence -= 5
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
  
  // STEP 2: Assign Badge
  const badge = assignBadge(ruleEvaluation.baseScore, ruleEvaluation.maxBadgeCap)
  
  // STEP 3: Get Action
  const action = getAction(badge)

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
  const prompt = `You are LeadVett AI - a senior consultant analyzing a lead qualification form.

RULE ENGINE RESULTS:
- Badge: ${badge}
- Score: ${ruleEvaluation.baseScore}/100
- Confidence: ${confidence.score}% (${confidence.level})
${ruleEvaluation.hardRuleTriggered ? `- Hard Rule: ${ruleEvaluation.hardRuleTriggered}` : ''}

FORM QUESTIONS & ANSWERS:
${questionsContext}

Analyze this lead and provide:
{
  "strengths": ["3-5 bullet points of positive signals"],
  "risks": ["2-4 bullet points of concerns or red flags"],
  "dmScript": "A professional, senior consultant tone message that references specific details from their answers. Frame it as if you're already qualified them and moving to next steps.",
  "summary": "One decisive sentence verdict"
}

Be clinical, decisive, and reference their actual words. Only respond with JSON.`

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are LeadVett AI - senior, clinical, decisive. Extract key signals from any form structure.'
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
      strengths: aiAnalysis.strengths || ['Form completed'],
      risks: aiAnalysis.risks || ['No specific risks identified'],
      dmScript: aiAnalysis.dmScript || 'Thanks for your interest. Let me review your submission and get back to you.',
      summary: aiAnalysis.summary || `${badge} lead - ${action}`,
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
      summary: `${badge} lead based on rule engine evaluation`,
      action,
      ruleBreakdown: ruleEvaluation.ruleBreakdown,
      hardRuleTriggered: ruleEvaluation.hardRuleTriggered,
      confidenceScore: confidence.score,
      confidenceLevel: confidence.level
    }
  }
}