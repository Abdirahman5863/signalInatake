import Link from 'next/link'
import { ArrowRight, Check, Copy, AlertCircle, CheckCircle2, Sparkles, Clock, DollarSign, Zap, MessageSquare, Shield, XCircle, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import leadicon from './public/images/leadicon.png'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Mobile Optimized */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1">
            <Image
              src={leadicon}
              alt="LeadVett Logo"
              width={45}
              height={38}
              className="object-contain sm:w-[60px] sm:h-[50px]"
            />
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-gray-900">
              Lead<span className="text-[#b5944b]">Vett</span> 
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-gray-900 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
            >
              Start trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile First */}
      <section className="pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Pain Headline - Responsive */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Stop wasting
              <br />
              <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">
                15 hours a week
              </span>
              <br />
              on bad DMs
            </h1>

            {/* Relief Sub-headline */}
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              LeadVett AI gives you the clinical verdict on every lead in <strong>10 seconds</strong>—so 
              you close Golds fast and never waste time on tire-kickers again.
            </p>

            {/* Social Proof - Mobile Friendly */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-green-700">
                <strong>127 agencies</strong> saved 1,905 hrs this month
              </span>
            </div>

            {/* CTA - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Start saving time now
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 px-4">
              14-day trial • No credit card • One avoided call = Year paid
            </p>
          </div>

          {/* The Clinical Breakdown - Mobile Responsive */}
          <div className="mt-12 sm:mt-20 max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                The Decision Engine
              </h2>
              <p className="text-sm sm:text-lg text-gray-600">
                No essays. Decisive verdicts in 10 seconds.
              </p>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden mx-2 sm:mx-0">
              {/* Window Header - Mobile */}
              <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center overflow-hidden">
                  <span className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                    Sarah Johnson
                  </span>
                </div>
              </div>

              {/* Demo Content - Mobile Optimized */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                {/* Verdict Section */}
                <div className="pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="flex flex-col gap-3 mb-3">
                    <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-base sm:text-lg shadow-lg w-fit">
                      🔥 GOLD
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                        → Book 30-min Strategy Call within 2 hours
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 italic">
                        "Strong budget, clear authority, immediate need"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decision Breakdown - Mobile Collapsible */}
                <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div className="bg-blue-50 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-blue-900 text-sm sm:text-base block">
                          Decision Breakdown
                        </span>
                        <span className="text-xs text-blue-700">
                          6 rules evaluated
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rules - Mobile Optimized */}
                  <div className="bg-white p-3 sm:p-6 space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-green-50 border-2 border-green-200">
                      <span className="text-base sm:text-xl flex-shrink-0">✅</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <p className="font-bold text-xs sm:text-sm">Budget: High-Tier ($5K+)</p>
                          <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-200 text-green-800 flex-shrink-0">
                            +20
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Confirmed budget in premium range
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-green-50 border-2 border-green-200">
                      <span className="text-base sm:text-xl flex-shrink-0">✅</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <p className="font-bold text-xs sm:text-sm">Timeline: Immediate</p>
                          <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-200 text-green-800 flex-shrink-0">
                            +15
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Needs solution within 7 days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-red-50 border-2 border-red-200">
                      <span className="text-base sm:text-xl flex-shrink-0">❌</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <p className="font-bold text-xs sm:text-sm">Multi-Stakeholder</p>
                          <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-200 text-red-800 flex-shrink-0">
                            -15
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Partner approval needed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Watch For Section - Mobile */}
                <div className="rounded-xl bg-orange-50 border-2 border-orange-200 p-4 sm:p-6">
                  <h3 className="text-sm sm:text-base font-bold text-orange-900 flex items-center gap-2 mb-3 sm:mb-4">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Watch For
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-orange-900">
                      <span className="text-base sm:text-lg flex-shrink-0">⚠</span>
                      <span><strong>Decision Friction:</strong> Partner approval needed first</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-orange-900">
                      <span className="text-base sm:text-lg flex-shrink-0">⚠</span>
                      <span><strong>History:</strong> Tried 3 agencies (scope creep risk)</span>
                    </li>
                  </ul>
                </div>

                {/* ONE-CLICK CLOSER - Mobile Hero */}
                <div className="rounded-2xl border-2 border-[#b5944b]/30 bg-gradient-to-br from-[#b5944b]/5 to-white p-4 sm:p-6 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                    ✨ MAGIC
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                      One-Click Closer
                    </h3>
                    <p className="text-xs text-gray-600">
                      Copy → Paste → Close deal
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-3 sm:p-5 border-2 border-gray-200 mb-3">
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                      "Before we proceed with the $5K-10K engagement, I need to understand what 
                      failed with your previous 3 agencies so we don't repeat those mistakes."
                    </p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-md">
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Copy This Script
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hard Reject Example - "I NEED THIS" Moment */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Automatic Protection
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 px-4">
              Never waste time on leads below your standards
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-6 sm:p-8 text-center mx-2 sm:mx-0">
            <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-2 sm:mb-3">
              ⛔ AUTO DISQUALIFIED
            </h3>
            <p className="text-sm sm:text-base text-red-700 font-medium mb-4">
              Budget below minimum threshold ($500 mentioned, $2K minimum required)
            </p>
            <p className="text-xs sm:text-sm text-red-600">
              This lead was automatically archived. Zero time wasted.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 text-center px-4">
            <p className="text-xs sm:text-sm text-gray-600 italic">
              "This alone saves me 5 hours a week. No more guilt about ignoring bad leads."
              <br />
              <span className="font-semibold text-gray-900">— Agency Owner, Lagos</span>
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator - Mobile Optimized */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold px-4">
              One avoided call pays for the year
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-5xl font-bold text-green-400 mb-1 sm:mb-2">15</div>
                <p className="text-xs sm:text-base text-white/80">Hours saved/week</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-5xl font-bold text-blue-400 mb-1 sm:mb-2">$49</div>
                <p className="text-xs sm:text-base text-white/80">Per month</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-5xl font-bold text-purple-400 mb-1 sm:mb-2">83x</div>
                <p className="text-xs sm:text-base text-white/80">ROI</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-white/70 pt-4 px-4">
              Average agency closes <strong>2-3 more clients per month</strong> by focusing on Gold leads only
            </p>
          </div>
        </div>
      </section>

      {/* ManyChat Integration - Mobile */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Works with your IG automation
            </h2>
            <p className="text-sm sm:text-xl text-gray-600">
              Setup in 2 minutes. No developer needed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 - Mobile */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-blue-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Add Your LeadVett Link
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Paste into ManyChat auto-reply or IG bio.
              </p>
              <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 font-mono text-xs text-gray-700 overflow-x-auto">
                leadvett.com/f/abc123
              </div>
            </div>

            {/* Step 2 - Mobile */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-green-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Leads Fill 60-Sec Form
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Mobile-friendly. 5 questions. Budget, timeline, authority.
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700 font-medium">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Avg: 58 seconds</span>
              </div>
            </div>

            {/* Step 3 - Mobile */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-orange-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Get Instant Gold Alert
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                AI analyzes → Badge assigned → DM script ready.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                🔥 New Gold Lead!
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg"
            >
              Set up in 2 minutes
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing - Mobile Optimized */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-sm sm:text-xl text-gray-600">
              One plan. No tricks. Cancel anytime.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-900 shadow-2xl relative mx-2 sm:mx-0">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                MOST POPULAR
              </div>

              <div className="text-center pt-4 sm:pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Agency Pro</h3>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$49</span>
                  <span className="text-base sm:text-lg text-gray-600">/month</span>
                </div>

                <ul className="space-y-3 sm:space-y-4 text-left mb-6 sm:mb-8">
                  {[
                    'Unlimited lead analysis',
                    'Gold/Silver/Bronze badges',
                    'AI-generated DM scripts',
                    'Rule engine transparency',
                    'ManyChat integration',
                    'Mobile-friendly forms',
                    'Email support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="block w-full rounded-full bg-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg text-center"
                >
                  Start 14-day free trial
                </Link>

                <p className="text-xs sm:text-sm text-gray-500 mt-4">
                  No credit card required • Cancel anytime
                </p>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-green-700 font-medium">
                    <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>One avoided call = Year paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Mobile */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#b5944b]">
        <div className="container mx-auto max-w-4xl text-center">
          <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium text-white leading-relaxed mb-6 sm:mb-8 px-4">
            "I closed 3 Golds last week while my competition was still on calls with Bronzes. 
            LeadVett's DM scripts are printing money."
          </blockquote>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base sm:text-lg">
              S
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm sm:text-base">Sarah M.</p>
              <p className="text-xs sm:text-sm text-blue-100">Agency Owner • $127K closed in 90 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Mobile */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Stop wasting time on
            <br />
            <span className="bg-gradient-to-r from-[#b5944b] to-[#d4af37] bg-clip-text text-transparent">
              DMs that won't close
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-10 px-4">
            127 agencies already saving 15+ hours per week
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            Start saving time now
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 px-4">
            14 days free • No card • One bad call avoided = Year paid
          </p>
        </div>
      </section>

      {/* Footer - Mobile */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1">
              <Image
                src={leadicon}
                alt="LeadVett Logo"
                width={50}
                height={42}
                className="object-contain sm:w-[60px] sm:h-[50px]"
              />
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                Lead<span className="text-[#b5944b]">Vett</span> 
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} LeadVett. All rights reserved.
            </p>
            <div className="flex gap-6 sm:gap-8">
              <Link href="/login" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}