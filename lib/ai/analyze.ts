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
}

export async function analyzeLead(answers: FormAnswers): Promise<AnalysisResult> {
  const prompt = `You are LeadVett AI - a decisive lead qualification expert for agencies. Analyze this lead and provide a clinical breakdown.

Lead Answers:
- Trigger: ${answers.trigger}
- Budget: ${answers.budget}
- Timeline: ${answers.timeline}
- Decision Maker: ${answers.decision_maker}
- Previous Attempts: ${answers.tried}

Provide your analysis in this EXACT JSON format:
{
  "badge": "Gold" | "Silver" | "Bronze",
  "strengths": [
    "High Budget: Mentioned $5K-10K range",
    "Immediate Urgency: Needs solution within 7 days",
    "Clear Authority: Is the Founder/CEO"
  ],
  "risks": [
    "Decision Friction: Needs to check with partner",
    "Vague Goals: No clear KPI mentioned"
  ],
  "dmScript": "Hey [Lead Name], saw your request! Since you mentioned [specific detail from their response], I have a [specific resource] that might help. Want me to send it over?",
  "summary": "One clear sentence verdict on this lead"
}

BADGE CRITERIA:
- Gold: Budget $3K+, Timeline urgent (this week/month), Clear decision maker
- Silver: Budget mentioned, Timeline flexible, Decision involved
- Bronze: No clear budget, No urgency, Not decision maker

Be DECISIVE. Use bullet points. No fluff.`

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are LeadVett AI - decisive, clinical, bullet-point focused. No essays.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.choices[0].message.content
    if (!content) {
      throw new Error('No response from AI')
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult

    // Validate
    if (!['Gold', 'Silver', 'Bronze'].includes(result.badge)) {
      throw new Error('Invalid badge')
    }

    return result

  } catch (error) {
    console.error('❌ AI Analysis Error:', error)
    return {
      badge: 'Bronze',
      strengths: ['Form submitted'],
      risks: ['Unable to analyze automatically'],
      dmScript: 'Thanks for your interest! Let me review your submission and get back to you shortly.',
      summary: 'Analysis failed - manual review needed'
    }
  }
}