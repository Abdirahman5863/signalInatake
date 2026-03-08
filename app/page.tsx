"use client"

import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { useState } from "react"
import {
  ArrowRight, Check, Sparkles, Shield, ChevronDown, Star,
  Brain, Target, TrendingUp, Zap, Clock, XCircle, CheckCircle2,
  AlertTriangle, MessageSquare, Calendar, Filter, BarChart3
} from "lucide-react"
import leadicon from "./public/images/leadicon.png"

const heading = { fontFamily: "var(--font-outfit), sans-serif" }

// FAQ Component
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6QJQ6KGNJ');
      `}} />

      {/* NAV */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5">
            <Image src={leadicon} alt="LeadVett" width={45} height={38} className="object-contain sm:w-[52px] sm:h-[44px]" priority />
            <span className="text-lg sm:text-2xl tracking-tight text-gray-900" style={{ ...heading, fontWeight: 800 }}>
              Lead<span className="text-[#b5944b]">Vett</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <Link href="#how-it-works" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">How it Works</Link>
            <Link href="#pricing" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Pricing</Link>
            <Link href="/login" className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
            <Link href="/signup" className="rounded-full bg-gray-900 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-sm">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-green-700">
              Used by <strong>127+ agencies</strong> who stopped taking bad calls
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-gray-900 leading-[1.05]" style={{ ...heading, fontWeight: 900 }}>
            Never take another<br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">bad sales call</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            LeadVett is a <strong>decision engine</strong> that filters inbound leads before they reach your calendar. Get a clinical verdict in 10 seconds: who's worth a call, who needs nurturing, and who to ignore.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-4 text-sm sm:text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Protect your calendar now
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-7 py-4 text-sm sm:text-base font-semibold text-gray-900 hover:border-[#b5944b] transition-all"
            >
              See the decision engine
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            3-day trial · No credit card · $49/month after
          </p>

          {/* HERO VISUAL - Decision Engine in Action */}
          <div className="mt-10 sm:mt-14 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-700 shadow-2xl p-6 sm:p-10 text-left">
              {/* Engine Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-700">
                <Brain className="h-8 w-8 text-[#d4af37]" />
                <div>
                  <h3 className="text-xl font-bold text-white" style={heading}>LeadVett Decision Engine</h3>
                  <p className="text-gray-400 text-sm">Analysis complete in 8 seconds</p>
                </div>
              </div>

              {/* Decision Output */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Verdict */}
                <div>
                  <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">🔥</span>
                        <span className="font-bold text-green-400 text-2xl" style={heading}>GOLD</span>
                      </div>
                      <div className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                        87% High
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                      <p className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Recommended Action
                      </p>
                      <p className="text-green-400 font-bold">→ Book 30-min strategy call within 2 hours</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-white font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Close Probability
                      </p>
                      <p className="text-green-400 font-bold">78% - Strong buyer signal</p>
                    </div>
                  </div>
                </div>

                {/* Right: Intelligence Breakdown */}
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Why This Score?</p>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold text-sm">Budget: High-Tier ($5K+)</p>
                          <p className="text-gray-400 text-xs">Strong commitment signal · +25 points</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold text-sm">Timeline: Immediate (ASAP)</p>
                          <p className="text-gray-400 text-xs">High urgency detected · +20 points</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold text-sm">Authority: Direct Decision Maker</p>
                          <p className="text-gray-400 text-xs">Can close fast · +18 points</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold text-sm">Risk: Worked with 3 agencies before</p>
                          <p className="text-gray-400 text-xs">May have high expectations · Monitor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              <strong>This is LeadVett's decision engine</strong> • Not just a score - a complete recommendation with reasoning
            </p>
          </div>
        </div>
      </section>

      {/* THE PROBLEM - Reimagined */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl mb-4" style={{ ...heading, fontWeight: 800 }}>
              Your Calendar Is Bleeding Time
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Every "discovery call" with a tire-kicker costs you 45 minutes you'll never get back
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">🗓️</div>
              <h3 className="text-xl font-bold mb-2" style={heading}>Calendar Chaos</h3>
              <p className="text-gray-400 text-sm mb-4">
                20 calls booked. 15 are "just exploring." 3 ghost. Only 2 were worth your time.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-xs font-semibold">= 11 hours wasted this week</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold mb-2" style={heading}>Wrong Leads First</h3>
              <p className="text-gray-400 text-sm mb-4">
                You talked to 5 Bronze leads while 2 Gold leads sat in your inbox waiting.
              </p>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <p className="text-orange-400 text-xs font-semibold">= Lost deals to faster competitors</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">😤</div>
              <h3 className="text-xl font-bold mb-2" style={heading}>No Filter System</h3>
              <p className="text-gray-400 text-sm mb-4">
                Anyone can grab time on your calendar. "$500 budget" leads booking 30-min calls.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-xs font-semibold">= Your time has no protection</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-2xl sm:text-3xl font-bold text-[#d4af37] mb-2" style={heading}>15 hours/week</p>
              <p className="text-gray-400 text-sm">Average time wasted on unqualified calls</p>
              <p className="text-white text-xs mt-2">That's 60 hours/month = $6,000+ in lost opportunity cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE SOLUTION - Decision Engine */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              <Brain className="h-4 w-4" />
              The LeadVett Decision Engine
            </div>
            <h2 className="text-3xl sm:text-5xl text-gray-900 mb-4" style={{ ...heading, fontWeight: 800 }}>
              Not a Form. A Filter System.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              LeadVett sits between initial contact and your calendar - analyzing buying intent and protecting your time from tire-kickers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Without LeadVett */}
            <div className="md:col-span-1">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-red-900" style={heading}>Without LeadVett</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">Lead DMs you → you send Calendly</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">They book 30 minutes</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">First 5 mins → realize they want "$500 package"</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800 font-semibold">30 minutes wasted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* With LeadVett */}
            <div className="md:col-span-2">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-green-900" style={heading}>With LeadVett Decision Engine</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-start gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-green-800">Lead DMs you → you send LeadVett link</p>
                    </div>
                    <div className="flex items-start gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-green-800">They fill 60-second intake</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-green-800">AI analyzes answers in 10 seconds</p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-white rounded-lg p-4 border border-green-300">
                      <p className="text-xs font-semibold text-green-900 mb-2">Engine Verdict:</p>
                      <p className="text-green-800 font-bold mb-1">🥉 Bronze (42%)</p>
                      <p className="text-green-700 text-xs mb-2">Budget: $500 mentioned</p>
                      <p className="text-green-900 font-semibold text-xs">→ Add to nurture sequence</p>
                    </div>
                    <p className="text-green-800 font-semibold text-xs mt-3">You never book the call. 30 minutes saved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Intelligence Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={heading}>Signal Analysis</h3>
              <p className="text-sm text-gray-600">
                AI scans for budget, urgency, authority, pain. Each signal weighted and scored. Not guesswork - clinical analysis.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={heading}>Transparent Reasoning</h3>
              <p className="text-sm text-gray-600">
                See exactly WHY each lead scored Gold/Silver/Bronze. Every verdict explained with signal breakdown.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={heading}>Close Probability</h3>
              <p className="text-sm text-gray-600">
                Predicted likelihood of conversion based on historical patterns. Know which leads deserve priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-14 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl text-gray-900 mb-4" style={{ ...heading, fontWeight: 800 }}>
              How the Decision Engine Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setup takes 5 minutes. Then every inquiry gets filtered automatically.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#b5944b] rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="text-2xl font-bold text-gray-900" style={heading}>Configure Your Qualification Criteria</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Set up 3-7 questions that matter for YOUR business. The AI learns what signals indicate buying intent from your questions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Budget thresholds you control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Timeline urgency detection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Decision authority verification</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 text-white">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Your Qualification Rules</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white/5 rounded p-3 border-l-2 border-green-500">
                    <p className="font-semibold mb-1">Budget ≥ $5,000</p>
                    <p className="text-gray-400 text-xs">+25 points · Strong buyer signal</p>
                  </div>
                  <div className="bg-white/5 rounded p-3 border-l-2 border-green-500">
                    <p className="font-semibold mb-1">Timeline = "ASAP" or "This week"</p>
                    <p className="text-gray-400 text-xs">+20 points · High urgency</p>
                  </div>
                  <div className="bg-white/5 rounded p-3 border-l-2 border-orange-500">
                    <p className="font-semibold mb-1">Budget &lt; $2,000</p>
                    <p className="text-gray-400 text-xs">Cap at Bronze · Below minimum</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">What's your budget for this project?</p>
                  <input 
                    type="text" 
                    disabled 
                    value="$5,000-$10,000" 
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">How soon do you need to start?</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-blue-600 text-white rounded text-xs font-semibold">ASAP</button>
                    <button className="px-3 py-2 bg-gray-100 rounded text-xs">This month</button>
                    <button className="px-3 py-2 bg-gray-100 rounded text-xs">Exploring</button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Completed in 58 seconds</span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#b5944b] rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="text-2xl font-bold text-gray-900" style={heading}>Lead Fills Qualification Intake</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Share your LeadVett link instead of Calendly. Lead answers your questions in under 60 seconds. Mobile-friendly, zero friction.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Works in ManyChat, IG bio, email signatures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Feels like normal form, not a barrier</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Average time: 58 seconds</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#b5944b] rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="text-2xl font-bold text-gray-900" style={heading}>Get Decision + Reasoning</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  In 10 seconds, you get: Priority badge, confidence score, close probability, recommended action, AND transparent reasoning showing exactly why.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm"><strong>Not just a score</strong> - complete intelligence report</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm"><strong>Signal breakdown</strong> - See why each lead scored that way</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm"><strong>Clear next step</strong> - "Book call in 2 hours" vs "Nurture for 90 days"</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span className="font-bold text-green-900" style={heading}>GOLD</span>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">89%</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-900 font-semibold">→ Priority: Book call within 2 hours</p>
                    <p className="text-green-800">Close probability: 78% - Strong buyer</p>
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-xs text-green-700 mb-2">Why this score:</p>
                      <ul className="space-y-1 text-xs text-green-800">
                        <li>✓ Budget $5K+ confirmed (+25)</li>
                        <li>✓ Timeline: ASAP (+20)</li>
                        <li>✓ Direct decision maker (+18)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <span className="font-bold text-gray-900" style={heading}>SILVER</span>
                    </div>
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">64%</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 font-semibold">→ Send 15-min screening Loom</p>
                    <p className="text-gray-700">Close probability: 42% - Needs nurturing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-gray-900">
        <div className="container mx-auto max-w-5xl grid grid-cols-3 gap-4 sm:gap-8 text-center">
          {[
            { val: "15", unit: "hrs/week", label: "Time saved filtering leads" },
            { val: "78%", unit: "", label: "Avg close rate on Gold leads" },
            { val: "10", unit: "sec", label: "Decision time per lead" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-5xl text-[#d4af37]" style={{ ...heading, fontWeight: 900 }}>
                {s.val}<span className="text-xl sm:text-2xl">{s.unit}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS - Updated */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl text-gray-900 mb-3" style={{ ...heading, fontWeight: 800 }}>Agencies Using the Decision Engine</h2>
            <p className="text-gray-600">Real results from founders who stopped wasting time</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                initials: "SM", 
                gradient: "from-blue-500 to-purple-500", 
                quote: "Before LeadVett I was taking 20+ calls a week. Now I take 7. The decision engine filters out everyone who isn't serious. I closed $127K in 90 days because I'm only talking to qualified buyers.", 
                name: "Sarah Martinez", 
                role: "Instagram Growth Agency", 
                extra: "3x revenue in Q1" 
              },
              { 
                initials: "JO", 
                gradient: "from-green-500 to-emerald-500", 
                quote: "The signal breakdown is what sold me. I can see exactly why someone got Gold 89% vs Gold 76%. It's like having a sales manager analyzing every lead for you. Never going back to Calendly.", 
                name: "James Ochieng", 
                role: "Social Media Agency, Nairobi", 
                extra: "15 hours/week saved" 
              },
              { 
                initials: "AP", 
                gradient: "from-orange-500 to-red-500", 
                quote: "I used to guess which leads to prioritize. Now I have close probability scores. My conversion rate went from 12% to 34% because I'm calling the right people at the right time.", 
                name: "Aisha Patel", 
                role: "ManyChat Automation Consultant", 
                extra: "2.8x close rate" 
              },
            ].map((t) => (
              <div key={t.name} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm hover:border-[#b5944b] transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{t.initials}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm" style={heading}>{t.name}</p>
                    <p className="text-xs text-gray-600">{t.role}</p>
                    <p className="text-xs text-[#b5944b] font-semibold mt-0.5">{t.extra}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-14 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Decision Engine Access
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-gray-900 mb-3" style={{ ...heading, fontWeight: 800 }}>
              Simple, Honest Pricing
            </h2>
            <p className="text-gray-600 sm:text-lg">One plan. Full decision engine. 3-day trial.</p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-gray-900 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#b5944b] to-[#d4af37] text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                🔥 LIMITED TIME - $49/mo
              </div>

              <div className="text-center mb-8 mt-2">
                <h3 className="text-3xl text-gray-900 mb-2" style={{ ...heading, fontWeight: 700 }}>
                  LeadVett Decision Engine
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl text-gray-900" style={{ ...heading, fontWeight: 900 }}>$49</span>
                  <div className="text-left">
                    <div className="text-lg text-gray-600">/month</div>
                    <div className="text-sm text-green-600 font-semibold">3-day free trial</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Full access to the complete decision engine
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited lead analysis & scoring',
                  'Signal breakdown with reasoning',
                  'Close probability predictions',
                  'Recommended actions per lead',
                  'Custom qualification criteria',
                  'Gold/Silver/Bronze badges (0-100%)',
                  'Pre-written DM scripts',
                  'ManyChat & bio link integration',
                  'CSV export & lead management',
                  'Mobile-optimized intake forms',
                  'Email support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/signup" 
                className="block w-full rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-all shadow-lg text-center"
              >
                Start 3-Day Free Trial
              </Link>

              <div className="mt-6 space-y-3 text-center text-sm text-gray-600">
                <p className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  No credit card required
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Cancel anytime
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  One saved hour = $50 value
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 border-2 border-blue-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Built for agencies with 10+ inbound leads/month
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl text-gray-900 mb-3" style={{ ...heading, fontWeight: 800 }}>Frequently Asked Questions</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl text-white mb-5 leading-tight" style={{ ...heading, fontWeight: 900 }}>
            Protect your calendar.<br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">
              Filter every lead.
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-8">Join 127+ agencies using LeadVett's decision engine</p>
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b5944b] px-8 py-4 text-base sm:text-lg font-semibold text-white hover:bg-[#9a7a3d] transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]">
            Start Free 3-Day Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card · $49/month after trial</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Image src={leadicon} alt="LeadVett" width={48} height={38} className="object-contain" />
                <span className="text-xl tracking-tight text-gray-900" style={{ ...heading, fontWeight: 800 }}>
                  Lead<span className="text-[#b5944b]">Vett</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 max-w-sm">AI-powered decision engine that filters inbound leads before they reach your calendar.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm" style={heading}>Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How it Works</Link></li>
                <li><Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-gray-900 transition-colors">Start Trial</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm" style={heading}>Legal</h3>
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