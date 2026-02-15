import Link from 'next/link'
import { ArrowRight, Check, Copy, AlertCircle, CheckCircle2, Sparkles, Clock, DollarSign, Zap, MessageSquare } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LeadVett</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Pain-First */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Pain Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Stop wasting
              <br />
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                15 hours a week
              </span>
              <br />
              on bad DMs
            </h1>

            {/* Relief Sub-headline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              LeadVett AI gives you the clinical verdict on every lead in <strong>10 seconds</strong>—so 
              you can close the Golds and strategically nurture everyone else.
            </p>

            {/* Social Proof */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                <strong>127 agencies</strong> saved 1,905 hours this month
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Start saving time now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              14-day free trial • No credit card • One avoided call pays for the year
            </p>
          </div>

          {/* The Clinical Breakdown - SHOW THE PRODUCT */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                The Clinical Breakdown
              </h2>
              <p className="text-lg text-gray-600">
                No essays. Just decisive verdicts in 10 seconds.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-500 font-medium">Sarah Johnson • sarah@company.com</span>
                </div>
              </div>

              {/* Demo Content - Exact Dashboard UI */}
              <div className="p-8 space-y-6">
                {/* Badge + Action */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg w-fit">
                    🔥 GOLD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-700">→ Priority follow-up within 2 hours</p>
                    <p className="text-sm text-gray-600 italic">"Strong budget, clear authority, immediate need"</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                    <h3 className="text-base font-bold text-green-900 flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5" />
                      ⚡ Strengths (The 'Yes' Signals)
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-green-900">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>High Budget:</strong> Mentioned $5K-10K range explicitly</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-green-900">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Immediate Urgency:</strong> Needs solution within 7 days</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-green-900">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Clear Authority:</strong> Is the Founder/CEO—makes decisions</span>
                      </li>
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                    <h3 className="text-base font-bold text-orange-900 flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5" />
                      ⚠️ Watch For (Potential Friction)
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-orange-900">
                        <span className="text-lg">⚠</span>
                        <span><strong>Decision Friction:</strong> Needs to "check with partner" first</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-orange-900">
                        <span className="text-lg">⚠</span>
                        <span><strong>History:</strong> Mentions "tried 3 agencies before" (scope creep risk)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* THE ONE-CLICK CLOSER - Hero Feature */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-blue-300 relative overflow-hidden">
                  {/* Highlight Badge */}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    ✨ ONE-CLICK CLOSER
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      AI-Generated Reply (No More Thinking)
                    </h3>
                    <button className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-md">
                      <Copy className="h-3.5 w-3.5" />
                      Copy Script
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-200 font-mono">
                    "Hey Sarah, saw your request! Since you're working with a partner, 
                    I have a 2-min 'Agency Comparison' PDF you can show them to speed up 
                    their decision. Want me to send it over?"
                  </p>
                  <p className="text-xs text-gray-600 mt-3">
                    💡 <strong>Just click "Copy"</strong> → paste into IG DMs → close deal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator - Truth Serum */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              One avoided call pays for the entire year
            </h2>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-bold text-green-400 mb-2">15</div>
                <p className="text-white/80">Hours saved per week</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-bold text-blue-400 mb-2">$49</div>
                <p className="text-white/80">Per month (Agency Pro)</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-bold text-purple-400 mb-2">83x</div>
                <p className="text-white/80">ROI (vs. wasted calls)</p>
              </div>
            </div>
            <p className="text-white/70 pt-4">
              Average agency closes <strong>2-3 more clients per month</strong> by focusing on Gold leads only
            </p>
          </div>
        </div>
      </section>

      {/* The ManyChat Integration - 3 Steps */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Works with your IG automation
            </h2>
            <p className="text-xl text-gray-600">
              Setup in 2 minutes. No developer needed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Add Your LeadVett Link
                </h3>
                <p className="text-gray-600 mb-4">
                  Copy your unique link and paste it into your ManyChat auto-reply or IG bio.
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200 font-mono text-xs text-gray-700">
                  leadvett.com/f/abc123
                </div>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 text-3xl">
                →
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Leads Fill 60-Second Form
                </h3>
                <p className="text-gray-600 mb-4">
                  Mobile-friendly. 5 quick questions. Budget, timeline, decision maker, pain, history.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Average completion: 58 seconds</span>
                </div>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 text-3xl">
                →
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border-2 border-orange-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get Instant Gold Alert
              </h3>
              <p className="text-gray-600 mb-4">
                AI analyzes → Assigns badge → Gives you perfect DM script → You copy & paste to close.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                🔥 New Gold Lead!
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg"
            >
              Set up in 2 minutes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing - Truth Serum Tier */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-xl text-gray-600">
              One plan. No tricks. Cancel anytime.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-2xl relative">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>

              <div className="text-center pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Agency Pro</h3>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <ul className="space-y-4 text-left mb-8">
                  {[
                    'Unlimited lead analysis',
                    'Gold/Silver/Bronze badges',
                    'AI-generated DM scripts',
                    'Strengths vs. Risks breakdown',
                    'ManyChat integration',
                    'Mobile-friendly forms',
                    'Email support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="block w-full rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg text-center"
                >
                  Start 14-day free trial
                </Link>

                <p className="text-sm text-gray-500 mt-4">
                  No credit card required • Cancel anytime
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium">
                    <DollarSign className="h-4 w-4" />
                    <span>One avoided bad call = Entire year paid for</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8">
            "I closed 3 Golds last week while my competition was still on calls with Bronzes. 
            LeadVett's DM scripts are printing money."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Sarah M.</p>
              <p className="text-sm text-blue-100">Agency Owner, Nairobi • $127K closed in 90 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop wasting time on
            <br />
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              DMs that won't close
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            127 agencies already saving 15+ hours per week with LeadVett
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            Start saving time now
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-6">
            14 days free • No credit card • One bad call avoided = Year paid for
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">LeadVett</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} LeadVett. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}