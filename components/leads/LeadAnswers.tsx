import { FormQuestion } from '@/lib/forms'

interface LeadAnswersProps {
  answers: Record<string, string>
  questions?: FormQuestion[] // Optional: current form questions
}

export function LeadAnswers({ answers, questions }: LeadAnswersProps) {
  // Get all question IDs from answers
  const questionIds = Object.keys(answers)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Lead Responses</h2>
      
      <div className="space-y-4">
        {questionIds.map((questionId) => {
          const answer = answers[questionId]
          
          // Try to find the question in current form questions
          const question = questions?.find(q => q.id === questionId)
          
          // If question exists in current form, show it
          // If not, it was deleted/edited - show the answer anyway with a note
          const questionText = question?.question || `Question (edited/removed)`
          const isDeleted = !question

          return (
            <div 
              key={questionId} 
              className={`rounded-lg border p-4 ${isDeleted ? 'bg-muted/50 border-dashed' : 'bg-card'}`}
            >
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                {questionText}
                {isDeleted && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    Question modified since submission
                  </span>
                )}
              </p>
              <p className="font-medium">
                {answer || (
                  <span className="text-muted-foreground italic">
                    No answer provided
                  </span>
                )}
              </p>
            </div>
          )
        })}
        
        {questionIds.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No responses recorded
          </p>
        )}
      </div>
    </div>
  )
}