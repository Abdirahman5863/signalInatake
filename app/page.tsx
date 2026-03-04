"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  ArrowRight, Check, Copy, AlertCircle, CheckCircle2,
  Sparkles, Clock, DollarSign, Zap, MessageSquare,
  Shield, XCircle, ChevronDown, Star, Play,
} from "lucide-react"
import leadicon from "./public/images/leadicon.png"

// Google Analytics tag is handled via next/script in the component

// ─── Live Demo Component ──────────────────────────────────────────────────────
function LiveDemo() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<null | "gold" | "silver" | "bronze" | "disqualified">(null)
  const [copied, setCopied] = useState(false)

  const questions = [
    { label: "What's your monthly budget for this service?", options: ["Under $500", "$500–$2,000", "$2,000–$5,000", "$5,000+"] },
    { label: "How soon do you need to start?", options: ["Just browsing", "1–3 months", "Within a month", "ASAP / this week"] },
    { label: "Who makes the final decision?", options: ["Me alone", "Me + partner", "Team vote", "Waiting on investor"] },
    { label: "Have you worked with an agency before?", options: ["No, first time", "Yes, good experience", "Yes, had problems", "Multiple agencies"] },
    { label: "How did you hear about us?", options: ["Instagram DM", "Referral", "Google / Search", "ManyChat"] },
  ]

  const analyze = () => {
    const budget = answers[0]
    const timeline = answers[1]
    const decision = answers[2]

    if (budget === "Under $500") { setResult("disqualified"); return }
    if (budget === "$5,000+" && (timeline === "ASAP / this week" || timeline === "Within a month") && decision === "Me alone") {
      setResult("gold"); return
    }
    if (budget === "$2,000–$5,000" || budget === "$5,000+") {
      setResult(timeline === "Just browsing" ? "silver" : "gold"); return
    }
    if (budget === "$500–$2,000") {
      setResult("silver"); return
    }
    setResult("bronze")
  }

  const scripts: Record<string, string> = {
    gold: `Hey! Thanks for filling this out — I can already see you're a great fit. I have a slot open this week. Can we jump on a 20-minute strategy call? Here's my calendar: [link]`,
    silver: `Thanks for reaching out! Based on your answers, I'd love to learn more. A quick call would help me understand your goals. When works for you this week?`,
    bronze: `Thanks for your interest! Right now my availability is limited to projects at a higher investment level. I'll keep your details and reach out when I have something that fits your budget.`,
    disqualified: `Hi! Thanks for reaching out. Unfortunately our minimum engagement starts at $2,000/month. We wouldn't be the right fit at this stage, but here are some resources that might help: [link]`,
  }

  const badge = {
    gold: { emoji: "🔥", label: "GOLD", color: "text-yellow-600 bg-yellow-50 border-yellow-300", bar: "bg-yellow-400" },
    silver: { emoji: "⚡", label: "SILVER", color: "text-gray-600 bg-gray-100 border-gray-300", bar: "bg-gray-400" },
    bronze: { emoji: "🥉", label: "BRONZE", color: "text-orange-700 bg-orange-50 border-orange-300", bar: "bg-orange-400" },
    disqualified: { emoji: "⛔", label: "DISQUALIFIED", color: "text-red-700 bg-red-50 border-red-300", bar: "bg-red-400" },
  }

  if (result) {
    const b = badge[result]
    const script = scripts[result]
    return (
      <div className="max-w-xl mx-auto space-y-5 animate-fadeIn">
        <div className={`rounded-2xl border-2 p-6 ${b.color}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{b.emoji}</span>
            <span className="font-extrabold text-xl tracking-wide">{b.label}</span>
          </div>
          <p className="text-sm font-medium opacity-80">
            {result === "gold" && "Strong budget, clear authority, immediate need. Book a call within 2 hours."}
            {result === "silver" && "Good potential but some friction. Nurture before closing."}
            {result === "bronze" && "Low urgency or budget concerns. Low priority — respond when convenient."}
            {result === "disqualified" && "Budget below minimum threshold. Auto-archived. Zero time wasted."}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#b5944b]" />
            <span className="font-semibold text-gray-900 text-sm">One-Click Closer Script</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 mb-4">
            {script}
          </p>
          <button
            onClick={() => { navigator.clipboard.writeText(script); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-all"
          >
            {copied ? <><CheckCircle2 className="h-4 w-4 text-green-400" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Script</>}
          </button>
        </div>

        <div className="text-center pt-2">
          <button onClick={() => { setStep(0); setAnswers({}); setResult(null) }} className="text-sm text-gray-500 underline hover:text-gray-800 transition-colors mr-6">
            Try Again
          </button>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#b5944b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9a7a3d] transition-all">
            Set Up Your Real Forms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }


  const q = questions[step]
  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#b5944b]" : "bg-gray-200"}`} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mb-4 font-medium">Question {step + 1} of {questions.length}</p>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">{q.label}</h3>
      <div className="space-y-3">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              const next = { ...answers, [step]: opt }
              setAnswers(next)
              if (step < questions.length - 1) {
                setStep(step + 1)
              } else {
                // Analyze with final answer included
                const budget = next[0]; const timeline = next[1]; const decision = next[2]
                if (budget === "Under $500") { setResult("disqualified"); return }
                if (budget === "$5,000+" && (timeline === "ASAP / this week" || timeline === "Within a month") && decision === "Me alone") { setResult("gold"); return }
                if (budget === "$2,000–$5,000" || budget === "$5,000+") { setResult(timeline === "Just browsing" ? "silver" : "gold"); return }
                if (budget === "$500–$2,000") { setResult("silver"); return }
                setResult("bronze")
              }
            }}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all hover:border-[#b5944b] hover:bg-[#fdf8ee] ${answers[step] === opt ? "border-[#b5944b] bg-[#fdf8ee]" : "border-gray-200 bg-white"}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
const faqs = [
  { q: "How accurate is the AI analysis?", a: "LeadVett uses GPT-4 combined with our proprietary rule engine. In testing with 500+ real agency leads, it matched or exceeded human qualification accuracy 94% of the time." },
  { q: "Can I customize the qualification rules?", a: "Yes. You can set custom budget thresholds, add your own questions, and adjust scoring weights. The Agency Team plan includes full custom rule engine training." },
  { q: "Does it integrate with ManyChat?", a: "Absolutely. Paste your LeadVett form link into ManyChat's auto-reply and you're live in under 2 minutes — no developer needed." },
  { q: "What if I don't like it?", a: "Cancel anytime during your 14-day trial. No questions asked. No credit card required to start." },
  { q: "How is this different from a Google Form?", a: "Google Forms collect data. LeadVett analyzes, scores, prioritizes, and gives you the exact next step with a pre-written closing script. It's the difference between raw data and actionable intelligence." },
  { q: "Does it work for non-Instagram businesses?", a: "Yes. While it's optimized for IG DM agencies, any business receiving inbound enquiries via DM, email, or link-in-bio can use LeadVett to qualify leads instantly." },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 text-sm sm:text-base"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* <!-- Google tag (gtag.js) --> */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ"></script>
      <script dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6QJQ6KGNJ');
      `}}></script>

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1" aria-label="LeadVett home">
            <Image src={leadicon} alt="LeadVett logo" width={45} height={38} className="object-contain sm:w-[56px] sm:h-[46px]" priority />
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
              Lead<span className="text-[#b5944b]">Vett</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <Link href="#demo" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Try Demo
            </Link>
            <Link href="#pricing" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Pricing
            </Link>
            <Link href="/login" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="rounded-full bg-gray-900 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-sm">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6" aria-label="Hero">
        <div className="container mx-auto max-w-6xl text-center space-y-6 sm:space-y-8">

          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium text-green-700">
              <strong>127 agencies</strong> saved 1,905 hrs this month
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-900 leading-[1.05]" style={{ fontFamily: "var(--font-syne)" }}>
            Stop wasting<br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">
              15 hours a week
            </span><br />
            on bad DMs
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            LeadVett AI gives you the clinical verdict on every lead in <strong>10 seconds</strong> — so you close Golds fast and never waste time on tire-kickers again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
            <Link href="/signup" className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-4 text-sm sm:text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
              Start saving time now
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link href="#demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-7 py-4 text-sm sm:text-base font-semibold text-gray-900 hover:border-[#b5944b] transition-all">
              <Play className="h-4 w-4" aria-hidden="true" />
              Try Live Demo — Free
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">14-day trial · No credit card · One avoided call = Year paid</p>

          {/* Video placeholder */}
          <div className="mt-10 sm:mt-14 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-100">
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-[#b5944b] ml-1" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-1">30-Second Product Demo</p>
                <p className="text-sm text-gray-500 mb-4">See how LeadVett qualifies leads in real-time</p>
                {/* Replace with: <iframe src="https://www.loom.com/embed/YOUR_ID" className="w-full aspect-video" allowFullScreen /> */}
                <span className="inline-flex items-center gap-2 rounded-full bg-[#b5944b] px-6 py-2.5 text-sm font-semibold text-white">
                  <Play className="h-3.5 w-3.5" /> Add your Loom video here
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50" aria-label="How it works">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "var(--font-syne)" }}>Works With Your IG Automation</h2>
            <p className="text-gray-600 sm:text-lg">Setup in 2 minutes. No developer needed.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "1", icon: <MessageSquare className="h-6 w-6 text-[#b5944b]" />, title: "Add Your LeadVett Link", body: "Paste your form link into ManyChat auto-reply or your IG bio." },
              { step: "2", icon: <Clock className="h-6 w-6 text-[#b5944b]" />, title: "Leads Fill 60-Sec Form", body: "Mobile-friendly. 5 questions. Budget, timeline, authority. Avg: 58 seconds." },
              { step: "3", icon: <Zap className="h-6 w-6 text-[#b5944b]" />, title: "Get Instant Gold Alert", body: "AI analyzes → Badge assigned → DM script ready. Book the call." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 shadow-sm hover:border-[#b5944b] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-[#b5944b] text-white text-sm font-bold flex items-center justify-center">{item.step}</span>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BADGE DEMO PREVIEW ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white" aria-label="Decision engine">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "var(--font-syne)" }}>The Decision Engine</h2>
            <p className="text-gray-600 sm:text-lg">No essays. Decisive verdicts in 10 seconds.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Gold card */}
            <div className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔥</span>
                <span className="font-extrabold text-yellow-700 text-lg">GOLD</span>
                <span className="ml-auto text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-semibold">Book in 2hrs</span>
              </div>
              <p className="text-sm text-yellow-800 font-medium mb-3">"Strong budget, clear authority, immediate need"</p>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />Budget: $5K+ confirmed</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />Timeline: Immediate (7 days)</div>
                <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />Watch: Tried 3 agencies before</div>
              </div>
            </div>

            {/* Disqualified card */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⛔</span>
                <span className="font-extrabold text-red-700 text-lg">AUTO REJECTED</span>
              </div>
              <p className="text-sm text-red-800 font-medium mb-3">"Budget below minimum threshold"</p>
              <p className="text-xs text-red-700">$500 mentioned · Your minimum: $2,000</p>
              <p className="text-xs text-gray-500 mt-3 italic">"This alone saves me 5 hours a week. No more guilt ignoring bad leads." — Agency Owner, Lagos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ── */}
      <section id="demo" className="py-14 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-amber-50 to-white" aria-label="Live demo">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b5944b]/10 text-[#b5944b] text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Try it — no signup needed
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              Experience LeadVett<br />in 60 Seconds
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
              Answer 5 questions as if you were a lead. Watch our AI badge the result and generate a closing script — live.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 sm:p-10">
            <LiveDemo />
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            This is a live LeadVett AI simulation. Test data is not saved.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-gray-900" aria-label="Key stats">
        <div className="container mx-auto max-w-5xl grid grid-cols-3 gap-4 sm:gap-8 text-center">
          {[
            { val: "15", unit: "hrs/week", label: "Saved on average" },
            { val: "$49", unit: "/mo", label: "All-in price" },
            { val: "83×", unit: "ROI", label: "Average return" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-5xl font-extrabold text-[#d4af37]" style={{ fontFamily: "var(--font-syne)" }}>{s.val}<span className="text-xl sm:text-2xl">{s.unit}</span></div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white" aria-label="Testimonials">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "var(--font-syne)" }}>Trusted by 127+ Agencies</h2>
            <p className="text-gray-600">Real results from real agency owners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                initials: "SM", gradient: "from-blue-500 to-purple-500",
                quote: "I closed 3 Gold leads last week while my competition was still on calls with Bronze tire-kickers. The DM scripts alone are worth $1,000/month.",
                name: "Sarah Martinez", role: "Instagram Growth Agency", extra: "$127K closed in 90 days",
              },
              {
                initials: "JO", gradient: "from-green-500 to-emerald-500",
                quote: "LeadVett saved me 15 hours this week alone. The auto-reject feature means I never feel guilty about ignoring low-budget leads anymore.",
                name: "James Ochieng", role: "Social Media Agency, Nairobi", extra: "@jamesochieng",
              },
              {
                initials: "AP", gradient: "from-orange-500 to-red-500",
                quote: "The confidence scores are scary accurate. I now know exactly who to follow up with first. My close rate went from 12% to 34%.",
                name: "Aisha Patel", role: "ManyChat Automation Expert", extra: "2,400+ IG followers",
              },
            ].map((t) => (
              <div key={t.name} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm hover:border-[#b5944b] transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-600">{t.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.extra}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-14 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white" aria-label="Pricing">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "var(--font-syne)" }}>Simple, Honest Pricing</h2>
            <p className="text-gray-600 sm:text-lg">One avoided call pays for the whole year</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Solo */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-7 sm:p-10 border-2 border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-syne)" }}>Solo Agency</h3>
              <p className="text-sm text-gray-500 mb-5">Perfect for independent agency owners</p>
              <div className="flex items-baseline gap-2 mb-7">
                <span className="text-5xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>$49</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited lead analysis", "Gold / Silver / Bronze badges", "AI-generated DM scripts", "Rule engine transparency", "ManyChat integration", "Mobile-friendly forms", "1 user seat", "Email support"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full rounded-full bg-gray-900 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-md text-center">
                Start 14-day free trial
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">No credit card required</p>
            </div>

            {/* Team */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-7 sm:p-10 border-2 border-[#b5944b] shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#b5944b] to-[#d4af37] text-white px-6 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 pt-2" style={{ fontFamily: "var(--font-syne)" }}>Agency Team</h3>
              <p className="text-sm text-gray-500 mb-5">For growing agencies with a team</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>$129</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-xs text-green-600 font-semibold mb-5">Avg ROI: $4,800/month saved</p>
              <ul className="space-y-3 mb-8">
                {["Everything in Solo", "Up to 5 team seats", "Custom budget thresholds per user", "Advanced analytics dashboard", "Webhook & Zapier integration", "White-label forms (coming soon)", "Priority email support", "Weekly strategy call"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="h-5 w-5 text-[#b5944b] flex-shrink-0 mt-0.5" aria-hidden="true" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=team" className="block w-full rounded-full bg-gradient-to-r from-[#b5944b] to-[#d4af37] py-4 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-md text-center">
                Start 14-day free trial
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">No credit card required · Cancel anytime</p>
            </div>
          </div>

          <div className="mt-10 text-center text-sm text-gray-600">
            Need enterprise features, custom domain, or API access?{" "}
            <Link href="mailto:sales@leadvett.com" className="text-[#b5944b] font-semibold hover:underline">
              Contact us for Enterprise pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white" aria-label="FAQ">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "var(--font-syne)" }}>Frequently Asked Questions</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 bg-gray-900" aria-label="Call to action">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
            Stop wasting time on<br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">
              DMs that won't close
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-8">127 agencies already saving 15+ hours per week</p>
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b5944b] px-8 py-4 text-base sm:text-lg font-semibold text-white hover:bg-[#9a7a3d] transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]">
            Start Your Free 14-Day Trial
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">14 days free · No card · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Image src={leadicon} alt="LeadVett logo" width={48} height={38} className="object-contain" />
                <span className="text-xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "var(--font-syne)" }}>
                  Lead<span className="text-[#b5944b]">Vett</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 max-w-sm">
                Deploy your agency's qualification policy on autopilot. Stop wasting time on bad DMs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-gray-900 transition-colors">Live Demo</Link></li>
                <li><Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-gray-900 transition-colors">Start Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} LeadVett. All rights reserved.</p>
            <div className="flex gap-5 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-800">Terms</Link>
              <Link href="/login" className="hover:text-gray-800">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}