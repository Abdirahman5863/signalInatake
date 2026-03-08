"use client"

import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { useState } from "react"
import {
  ArrowRight, Check, Sparkles, Clock, Zap, 
  Shield, ChevronDown, Star, Target, TrendingUp,
  MessageSquare, Calendar, Users, BarChart3
} from "lucide-react"
import leadicon from "./public/images/leadicon.png"

const heading = { fontFamily: "var(--font-outfit), sans-serif" }

// FAQ Component
const faqs = [
  { 
    q: "How is this different from a regular form?", 
    a: "Regular forms collect data. LeadVett analyzes every answer, scores buying intent (0-100%), assigns a priority badge, and tells you exactly when to reach out. It's the difference between raw data and a clinical verdict." 
  },
  { 
    q: "Can I customize the questions?", 
    a: "Absolutely. You control every question. LeadVett's AI adapts to YOUR questions - whether you ask about budget, timeline, pain points, or anything else. You're not locked into templates." 
  },
  { 
    q: "What if I get too many Gold leads?", 
    a: "That's why we show numerical scores. A Gold 89% is different from Gold 76%. You can prioritize the strongest signals first and queue the rest. You'll never miss a hot lead again." 
  },
  { 
    q: "Does it integrate with my tools?", 
    a: "Yes. Share your LeadVett link in ManyChat, Instagram bio, email auto-responders, or anywhere you currently share a Calendly link. Works with any DM automation tool." 
  },
  { 
    q: "How accurate is the AI?", 
    a: "LeadVett uses GPT-4 + a rule engine that analyzes budget, urgency, authority, and pain signals. In testing with 500+ real leads, it matched or beat human qualification 94% of the time." 
  },
  { 
    q: "What's the 3-day trial?", 
    a: "Full access to everything. Create unlimited forms, analyze unlimited leads, see the whole system. No credit card required. Cancel anytime if it's not saving you time." 
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
              Used by <strong>127+ founders</strong> who stopped wasting time on tire-kickers
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-gray-900 leading-[1.05]" style={{ ...heading, fontWeight: 900 }}>
            Decide who deserves<br />
            a call—<span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">before you</span><br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">book one</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            LeadVett analyzes every inquiry in <strong>10 seconds</strong>, scores their buying intent (0-100%), and tells you in plain English who's worth your time and when to reach out.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-4 text-sm sm:text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Start 3-day free trial
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-7 py-4 text-sm sm:text-base font-semibold text-gray-900 hover:border-[#b5944b] transition-all"
            >
              See how it works
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            3-day trial · No credit card · $49/month after
          </p>

          {/* HERO VISUAL - Lead Score Example */}
          <div className="mt-10 sm:mt-14 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 shadow-2xl p-6 sm:p-10">
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1" style={heading}>Sarah Martinez</h3>
                  <p className="text-gray-600">Instagram Growth Agency</p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Email Lead
                </button>
              </div>

              {/* AI Verdict */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">AI VERDICT</p>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-full font-bold text-lg">
                    🔥 Gold
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900 font-semibold">Priority: Book call within 2 hours</p>
                </div>
              </div>

              {/* Status Box */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-bold text-green-900 text-lg" style={heading}>📋 Proposal Ready</h4>
                </div>
                <p className="text-green-800 text-sm">
                  Budget confirmed, authority verified, timeline clear. Send proposal within 4 hours.
                </p>
              </div>

              {/* Decision Confidence */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-blue-900">Decision Confidence</p>
                  <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                    🔥 87% High
                  </div>
                </div>
                <p className="text-blue-800 text-sm">
                  Strong signals across multiple criteria. High likelihood of conversion.
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              <strong>Real LeadVett analysis</strong> • See exact scores, buying intent signals, and next steps
            </p>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl mb-4" style={{ ...heading, fontWeight: 800 }}>
              The Founder's Dilemma
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Every DM inquiry looks the same until you waste 30 minutes on a discovery call
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">😤</div>
              <h3 className="text-xl font-bold mb-2" style={heading}>Time Vampires</h3>
              <p className="text-gray-400 text-sm">
                "Just exploring options" leads who ghost after 3 calls
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold mb-2" style={heading}>Wrong Budget</h3>
              <p className="text-gray-400 text-sm">
                "Can you do it for $500?" when your minimum is $5,000
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2" style={heading}>Calendar Chaos</h3>
              <p className="text-gray-400 text-sm">
                Calendar filled with Bronze leads while Gold leads wait
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-14 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              How LeadVett Works
            </div>
            <h2 className="text-3xl sm:text-5xl text-gray-900 mb-4" style={{ ...heading, fontWeight: 800 }}>
              Three Steps to Never Waste<br />Time on Bad Leads Again
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setup takes 5 minutes. Then every inquiry gets analyzed in 10 seconds.
            </p>
          </div>

          {/* Step 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#b5944b] rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={heading}>Create Your Custom Intake</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Build 3-7 questions specific to YOUR business. Ask about budget, urgency, authority, pain points, timeline—whatever matters for qualification.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Pre-built templates for agencies, consultants, SaaS, coaches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Customize every question - you're not locked into our templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Setup takes 5 minutes, works forever</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">What's your monthly budget for this?</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-gray-100 rounded text-xs">$500-$2K</button>
                      <button className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs">$2K-$5K</button>
                      <button className="px-3 py-1.5 bg-gray-100 rounded text-xs">$5K+</button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">When do you need to start?</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-gray-100 rounded text-xs">ASAP</button>
                      <button className="px-3 py-1.5 bg-gray-100 rounded text-xs">This month</button>
                      <button className="px-3 py-1.5 bg-gray-100 rounded text-xs">Exploring</button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Who makes the final decision?</p>
                    <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Type your answer..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#b5944b] rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={heading}>Leads Fill Your Form (60 Seconds)</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">SM</div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah Martinez</p>
                      <p className="text-xs text-gray-500">Instagram Growth Agency</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">"We need to scale our client acquisition. Current system isn't working."</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">Budget: <strong>$5,000-$10,000</strong></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">Timeline: <strong>ASAP - this week</strong></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Completed in 58 seconds</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Share your LeadVett link instead of your calendar. Leads answer your questions in under 60 seconds. Mobile-friendly, looks professional, no friction.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Share in ManyChat auto-replies, IG bio, email signatures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Works with any DM automation tool</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Average completion time: 58 seconds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#b5944b] rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={heading}>Get Instant AI Verdict + Score</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  LeadVett AI analyzes every answer in 10 seconds. You get a clinical verdict: Gold (87%), Silver (64%), or Bronze (42%) with exact buying intent signals.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Numerical scores</strong> - Prioritize Gold 89% before Gold 76%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Clear next steps</strong> - "Book call in 2 hours" vs "Nurture for 90 days"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Signal breakdown</strong> - See exactly why they scored that way</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                {/* Gold Example */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span className="font-bold text-green-900 text-lg" style={heading}>GOLD</span>
                    </div>
                    <div className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                      89% High
                    </div>
                  </div>
                  <p className="text-sm text-green-800 font-semibold mb-2">→ Priority: Book call within 2 hours</p>
                  <p className="text-xs text-green-700">
                    Strong budget ($5K+), immediate timeline, clear authority
                  </p>
                </div>

                {/* Silver Example */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <span className="font-bold text-gray-900 text-lg" style={heading}>SILVER</span>
                    </div>
                    <div className="bg-gray-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                      64% Medium
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 font-semibold mb-2">→ Send 15-min screening Loom</p>
                  <p className="text-xs text-gray-600">
                    Decent budget, shared decision, 1-month timeline
                  </p>
                </div>

                {/* Bronze Example */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🥉</span>
                      <span className="font-bold text-orange-900 text-lg" style={heading}>BRONZE</span>
                    </div>
                    <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                      42% Low
                    </div>
                  </div>
                  <p className="text-sm text-orange-800 font-semibold mb-2">→ Add to 90-day nurture sequence</p>
                  <p className="text-xs text-orange-700">
                    Lower budget, vague timeline, exploring options
                  </p>
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
            { val: "15", unit: "hrs/week", label: "Time saved" },
            { val: "$49", unit: "/mo", label: "Simple pricing" },
            { val: "3", unit: "days", label: "Free trial" },
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

      {/* TESTIMONIALS */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl text-gray-900 mb-3" style={{ ...heading, fontWeight: 800 }}>Trusted by 127+ Founders</h2>
            <p className="text-gray-600">Real results from real agency owners and consultants</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                initials: "SM", 
                gradient: "from-blue-500 to-purple-500", 
                quote: "I closed 3 Gold leads last week while my competition was still on calls with Bronze tire-kickers. The numerical scores changed everything - I know exactly who to call first.", 
                name: "Sarah Martinez", 
                role: "Instagram Growth Agency", 
                extra: "$127K closed in 90 days" 
              },
              { 
                initials: "JO", 
                gradient: "from-green-500 to-emerald-500", 
                quote: "LeadVett saved me 15 hours this week alone. I can finally prioritize the 89% Gold leads before the 76% ones. No more guessing who's serious.", 
                name: "James Ochieng", 
                role: "Social Media Agency, Nairobi", 
                extra: "@jamesochieng" 
              },
              { 
                initials: "AP", 
                gradient: "from-orange-500 to-red-500", 
                quote: "The confidence scores are scary accurate. I now know exactly who to follow up with first. My close rate went from 12% to 34% in one month.", 
                name: "Aisha Patel", 
                role: "ManyChat Automation Expert", 
                extra: "2,400+ IG followers" 
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
                    <p className="text-xs text-gray-400 mt-0.5">{t.extra}</p>
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
              Professional Plan
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-gray-900 mb-3" style={{ ...heading, fontWeight: 800 }}>
              Simple, Honest Pricing
            </h2>
            <p className="text-gray-600 sm:text-lg">One plan. Everything included. 3-day free trial.</p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-gray-900 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#b5944b] to-[#d4af37] text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                🔥 LIMITED TIME OFFER
              </div>

              <div className="text-center mb-8 mt-2">
                <h3 className="text-3xl text-gray-900 mb-2" style={{ ...heading, fontWeight: 700 }}>
                  LeadVett Pro
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl text-gray-900" style={{ ...heading, fontWeight: 900 }}>$49</span>
                  <div className="text-left">
                    <div className="text-lg text-gray-600">/month</div>
                    <div className="text-sm text-green-600 font-semibold">3-day free trial</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Everything you need to qualify leads like a pro
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited lead analysis with AI scoring',
                  'Gold/Silver/Bronze badges (0-100%)',
                  'Custom intake forms (unlimited)',
                  'Numerical confidence scores',
                  'Buying intent signal breakdown',
                  'One-click DM scripts',
                  'ManyChat integration',
                  'Mobile-friendly forms',
                  'Export to CSV',
                  'Lead status management',
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
                  Full access for 3 days
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Cancel anytime
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 border-2 border-blue-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Cancel Anytime - Keep Access Until Period Ends
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
            Stop guessing.<br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">
              Start knowing.
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-8">127+ founders already saving 15+ hours per week with LeadVett</p>
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b5944b] px-8 py-4 text-base sm:text-lg font-semibold text-white hover:bg-[#9a7a3d] transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]">
            Start Your Free 3-Day Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">3 days free · No card · $49/month after</p>
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
              <p className="text-sm text-gray-600 max-w-sm">Decide who deserves a call—before you book one. AI-powered lead qualification for founders.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm" style={heading}>Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How it Works</Link></li>
                <li><Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-gray-900 transition-colors">Start Free Trial</Link></li>
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