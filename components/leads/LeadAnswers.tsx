import { FORM_QUESTIONS } from '@/lib/forms'
import { type FormAnswers } from '@/lib/forms'

interface LeadAnswersProps {
  answers: FormAnswers
}

export function LeadAnswers({ answers }: LeadAnswersProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Lead Responses</h3>
      <div className="space-y-4">
        {FORM_QUESTIONS.map((question) => {
          const answer = answers[question.id]
          return (
            <div key={question.id} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {question.question}
              </h4>
              <div className="rounded-md border bg-card p-4 text-sm">
                {answer || <span className="text-muted-foreground">No answer provided</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

