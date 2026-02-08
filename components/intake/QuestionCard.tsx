import { FORM_QUESTIONS } from '@/lib/forms'
import { QuestionId } from '@/lib/forms'

interface QuestionCardProps {
  questionId: QuestionId
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function QuestionCard({
  questionId,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}: QuestionCardProps) {
  const question = FORM_QUESTIONS.find((q) => q.id === questionId)

  if (!question) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">{question.question}</h2>

        {question.type === 'text' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Type your answer here..."
          />
        ) : (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-4">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={!value.trim()}
          className="ml-auto rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  )
}

