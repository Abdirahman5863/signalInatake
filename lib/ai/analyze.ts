import OpenAI from 'openai'
import { type FormAnswers } from '@/lib/forms'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY|| '',
})

export interface AnalysisResult {
  badge: 'Gold' | 'Silver' | 'Bronze'
  reasoning: string
}

export async function analyzeLead(answers: FormAnswers): Promise<AnalysisResult> {
  const prompt = `You are analyzing a lead qualification form. Based on the following answers, assign a badge (Gold, Silver, or Bronze) and provide reasoning.

Consider these factors:
1. Budget clarity and amount (higher budget = better badge)
2. Urgency/timeline (ASAP or short timeline = better badge)
3. Decision authority (clear decision maker = better badge)
4. Trigger clarity (specific trigger = better badge)
5. Previous attempts (shows engagement = better badge)

Lead Answers:
1. What triggered you to look for help now? ${answers.trigger}
2. What's your monthly budget? ${answers.budget}
3. What's your timeline? ${answers.timeline}
4. Who decides? ${answers.decision_maker}
5. What have you tried? ${answers.tried}

Respond with a JSON object in this exact format:
{
  "badge": "Gold" | "Silver" | "Bronze",
  "reasoning": "A clear explanation of why this badge was assigned, focusing on budget clarity, urgency, decision authority, and overall qualification strength."
}

Only respond with the JSON object, no additional text.`

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.choices[0].message
    if (!content.content) {
      throw new Error('Unexpected response type from OpenAI')
    }

    // Parse JSON response
    const jsonMatch = content.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0]) as AnalysisResult

    // Validate badge
    if (!['Gold', 'Silver', 'Bronze'].includes(result.badge)) {
      throw new Error('Invalid badge value')
    }

    return result
  } catch (error) {
    console.error('Error analyzing lead:', error)
    // Return default Bronze badge if analysis fails
    return {
      badge: 'Bronze',
      reasoning: 'Unable to analyze lead automatically. Manual review recommended.',
    }
  }
}

