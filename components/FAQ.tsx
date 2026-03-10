"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const heading = { fontFamily: "var(--font-outfit), sans-serif" }

const faqs = [
  {
    q: "How is this different from a regular form?",
    a: "Regular forms collect data. LeadVett analyzes every answer, scores buying intent (0-100%), assigns a priority badge, and tells you exactly when to reach out. It's the difference between raw data and a clinical verdict."
  },
  {
    q: "Can I customize the questions?",
    a: "Absolutely. You control every question. LeadVett's AI adapts to YOUR questions — whether you ask about budget, timeline, pain points, or anything else. You're not locked into templates."
  },
  {
    q: "Does it integrate with ManyChat?",
    a: "Yes. Paste your LeadVett form link into ManyChat's auto-reply and you're live in under 2 minutes — no developer needed."
  },
  {
    q: "How accurate is the AI?",
    a: "LeadVett uses GPT-4 + a rule engine that analyzes budget, urgency, authority, and pain signals. In testing with 500+ real leads, it matched or beat human qualification 94% of the time."
  },
  {
    q: "What if I don't like it?",
    a: "Cancel anytime during your 3-day trial. No questions asked. No credit card required to start."
  },
  {
    q: "How is this different from a Google Form?",
    a: "Google Forms collect data. LeadVett analyzes, scores, prioritizes, and gives you the exact next step. It's the difference between raw data and actionable intelligence."
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 text-sm sm:text-base"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={heading}
          >
            {faq.q}
            <ChevronDown className={`h-5 w-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}