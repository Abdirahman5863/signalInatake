"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
const heading = { fontFamily: "var(--font-outfit), sans-serif" }

const faqs = [
      { 
        q: "How is this different from a Google Form?", 
        a: "Google Forms collect data. LeadVett is a decision engine - it analyzes buying intent, predicts close probability, explains its reasoning, and tells you exactly what to do next. It's the difference between raw data and a clinical recommendation from a senior sales consultant." 
      },
      { 
        q: "What if I don't get many leads?", 
        a: "LeadVett is built for agencies and consultants who already have inbound lead flow (10+ inquiries per month). If you're just starting out, focus on getting more leads first. LeadVett helps you qualify the leads you already have." 
      },
      { 
        q: "Why should I trust the AI scoring?", 
        a: "LeadVett shows you exactly WHY each lead scored the way they did. You see the signal breakdown: 'Budget confirmed: +25 points', 'Vague timeline: -12 points'. The AI doesn't just give a score - it explains its reasoning like a sales manager would." 
      },
      { 
        q: "Can I customize the qualification criteria?", 
        a: "Yes. You control the questions and LeadVett adapts. Ask about budget, urgency, pain points, authority - whatever matters for YOUR business. The AI learns what signals matter most from your questions." 
      },
      { 
        q: "What happens after the lead is scored?", 
        a: "You get: (1) Priority badge with confidence score, (2) Predicted close probability, (3) Recommended next action, (4) Pre-written DM script, (5) Signal breakdown showing WHY they scored that way. Everything you need to make a decision in 10 seconds." 
      },
      { 
        q: "Does it integrate with my CRM?", 
        a: "LeadVett works standalone - share the link in ManyChat, Instagram bio, email auto-responders, or anywhere you currently share a Calendly link. Export qualified leads to CSV and import into your CRM. Native integrations coming soon." 
      },
  // move your faqs array here
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