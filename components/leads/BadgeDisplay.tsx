'use client'
import { useState } from 'react'
import { decisionLabels, Decision, RuleScore } from '@/lib/qualification'
interface Props {
  badge: string | null; qualificationStatus?: Decision; strengths?: string[]; risks?: string[]
  dmScript?: string; summary?: string; action?: string; ruleBreakdown?: RuleScore[]
  hardRuleTriggered?: string | null; confidenceScore?: number; confidenceLevel?: string
}
export function BadgeDisplay(props: Props) {
  const [copyStatus, setCopyStatus] = useState('Copy draft')
  return <div className="space-y-6">
    <div className="border-l-4 border-[#b99345] pl-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Project fit · submitted evidence</p>
      <h2 className="mt-2 text-2xl font-semibold">{props.qualificationStatus ? decisionLabels[props.qualificationStatus] : 'Review this enquiry'}</h2>
      <p className="mt-3 text-sm leading-6">{props.hardRuleTriggered || props.summary}</p>
      <p className="mt-2 text-xs text-muted-foreground">Answers are self-reported. Confirm scope and stakeholders before making a proposal.</p>
    </div>
    {[["What fits", props.strengths], ["What needs attention", props.risks]].map(([title, items]) => Array.isArray(items) && items.length > 0 && <section key={title as string}>
      <h3 className="font-semibold">{title}</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </section>)}
    {!!props.ruleBreakdown?.length && <details className="rounded-lg border p-4"><summary className="cursor-pointer font-medium">Why this decision?</summary><div className="mt-4 space-y-3">{props.ruleBreakdown.map((rule,i) => <p key={i} className="text-sm"><strong>{rule.rule}: </strong>{rule.explanation}</p>)}</div></details>}
    {props.dmScript && <section className="rounded-lg border bg-stone-50 p-5"><h3 className="font-semibold">Reply draft</h3><p className="mt-1 text-xs text-muted-foreground">Review and edit before sending from your email account.</p><p className="my-4 whitespace-pre-wrap text-sm leading-6">{props.dmScript}</p><button className="rounded-md bg-black px-4 py-2 text-sm text-white" onClick={async () => { try { await navigator.clipboard.writeText(props.dmScript!); setCopyStatus('Copied') } catch { setCopyStatus('Copy unavailable — select the text above') } }}>{copyStatus}</button><span className="sr-only" role="status">{copyStatus}</span></section>}
  </div>
}
