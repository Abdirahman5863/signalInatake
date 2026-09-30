'use client'

import { QualificationPolicy, ResultMessages } from '@/lib/forms'

interface Props {
  policy: QualificationPolicy
  bookingUrl: string
  messages: ResultMessages
  onPolicyChange: (policy: QualificationPolicy) => void
  onBookingUrlChange: (value: string) => void
  onMessagesChange: (messages: ResultMessages) => void
}

export function QualificationPolicyEditor({
  policy,
  bookingUrl,
  messages,
  onPolicyChange,
  onBookingUrlChange,
  onMessagesChange,
}: Props) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Qualification & routing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the policy once. LeadVett scores every submission, explains the decision, and only sends qualified Gold leads to your calendar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NumberField label="Minimum monthly budget" hint="Leave blank to disable the budget disqualifier." value={policy.minBudget ?? ''} onChange={(value) => onPolicyChange({ ...policy, minBudget: value === '' ? null : Number(value) })} />
        <div>
          <label htmlFor="bookingUrl" className="block text-sm font-medium mb-2">Calendar URL for Gold leads</label>
          <input id="bookingUrl" type="url" value={bookingUrl} onChange={(event) => onBookingUrlChange(event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://cal.com/your-name/discovery" />
          <p className="mt-1 text-xs text-muted-foreground">This link is never returned to Silver, Bronze, or manual-review leads.</p>
        </div>
        <NumberField label="Gold score starts at" value={policy.goldThreshold} min={1} max={100} onChange={(value) => onPolicyChange({ ...policy, goldThreshold: Number(value) })} />
        <NumberField label="Silver score starts at" value={policy.silverThreshold} min={0} max={99} onChange={(value) => onPolicyChange({ ...policy, silverThreshold: Number(value) })} />
        <NumberField label="Manual review below confidence" value={policy.manualReviewConfidence} min={0} max={100} onChange={(value) => onPolicyChange({ ...policy, manualReviewConfidence: Number(value) })} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(['gold', 'silver', 'bronze', 'manualReview'] as const).map((key) => (
          <div key={key}>
            <label htmlFor={`${key}Message`} className="block text-sm font-medium mb-2">{key === 'manualReview' ? 'Manual review' : key[0].toUpperCase() + key.slice(1)} result message</label>
            <textarea id={`${key}Message`} rows={2} value={messages[key]} onChange={(event) => onMessagesChange({ ...messages, [key]: event.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

function NumberField({ label, hint, value, onChange, min = 0, max }: { label: string; hint?: string; value: number | string; onChange: (value: string) => void; min?: number; max?: number }) {
  const id = label.toLowerCase().replace(/\W+/g, '-')
  return <div><label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label><input id={id} type="number" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}</div>
}
