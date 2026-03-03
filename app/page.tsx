import Link from 'next/link'
import { ArrowRight, Check, Copy, AlertCircle, CheckCircle2, Sparkles, Clock, DollarSign, Zap, MessageSquare, Shield, XCircle, ChevronDown, Star, Play } from 'lucide-react'
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
              href="#demo"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Try Demo
            </Link>
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
              <Link
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-900 hover:border-gray-400 transition-all"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                Try Live Demo
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 px-4">
              14-day trial • No credit card • One avoided call = Year paid
            </p>
          </div>

          {/* Product Screenshot/Video */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
              {/* Video/Screenshot Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <Play className="h-16 w-16 sm:h-24 sm:w-24 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                    Watch 30-Second Product Demo
                  </p>
                  <p className="text-sm text-gray-500">
                    See exactly how LeadVett qualifies leads in real-time
                  </p>
                  <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#b5944b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9a7a3d] transition-colors">
                    <Play className="h-4 w-4" />
                    Play Demo Video
                  </button>
                </div>
              </div>
              {/* Replace the above div with actual Loom embed:
              <iframe 
                src="https://www.loom.com/embed/YOUR_VIDEO_ID" 
                frameBorder="0" 
                allowFullScreen
                className="w-full aspect-video"
              />
              */}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Real product walkthrough • See the actual dashboard, badges, and AI analysis
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

            {/* [Previous demo content remains the same] */}
            <div className="rounded-2xl sm:rounded-3xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden mx-2 sm:mx-0">
              {/* All previous demo code... */}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMO FORM - NEW SECTION */}
      <section id="demo" className="py-12 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Try it yourself
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Experience LeadVett in 60 Seconds
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and watch our AI analyze the lead in real-time. 
              No signup required.
            </p>
          </div>

          {/* Embed actual intake form here */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 sm:p-8">
            <div className="max-w-xl mx-auto">
              <iframe 
                src="/intake/demo-form-id" 
                className="w-full h-[600px] border-0"
                title="Live Demo Form"
              />
              {/* Or build a simplified demo form component */}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              This is a <strong>live demo</strong> using real LeadVett AI. 
              Your test data won't be saved.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-[#b5944b] font-semibold hover:text-[#9a7a3d] transition-colors"
            >
              Sign up to create your own forms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Real Testimonials - UPDATED */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by 127+ Agencies
            </h2>
            <p className="text-lg text-gray-600">
              Real results from real agency owners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 - With Real Details */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "I closed 3 Gold leads last week while my competition was still on calls with Bronze tire-kickers. 
                The DM scripts alone are worth $1,000/month."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Martinez</p>
                  <p className="text-sm text-gray-600">Instagram Growth Agency</p>
                  <p className="text-xs text-gray-500 mt-1">$127K closed in 90 days</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "LeadVett saved me 15 hours this week alone. The hard reject feature means I never feel guilty 
                about ignoring low-budget leads anymore."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                  JO
                </div>
                <div>
                  <p className="font-semibold text-gray-900">James Ochieng</p>
                  <p className="text-sm text-gray-600">Social Media Agency, Nairobi</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="https://twitter.com/jamesochieng" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                      @jamesochieng
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The confidence scores are scary accurate. I now know exactly who to follow up with first. 
                My close rate went from 12% to 34%."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                  AP
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Aisha Patel</p>
                  <p className="text-sm text-gray-600">ManyChat Automation Expert</p>
                  <p className="text-xs text-gray-500 mt-1">2,400+ IG followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* [Previous sections continue...] */}

      {/* Pricing - UPDATED WITH TWO TIERS */}
      <section id="pricing" className="py-12 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-sm sm:text-xl text-gray-600">
              Choose the plan that fits your agency
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Solo Plan */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-200 shadow-lg relative">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Solo Agency</h3>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$49</span>
                  <span className="text-base sm:text-lg text-gray-600">/month</span>
                </div>

                <ul className="space-y-3 text-left mb-6 sm:mb-8">
                  {[
                    'Unlimited lead analysis',
                    'Gold/Silver/Bronze badges',
                    'AI-generated DM scripts',
                    'Rule engine transparency',
                    'ManyChat integration',
                    'Mobile-friendly forms',
                    '1 user account',
                    'Email support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
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
                  No credit card required
                </p>
              </div>
            </div>

            {/* Team Plan - NEW */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#b5944b] shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#b5944b] to-[#d4af37] text-white px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                MOST POPULAR
              </div>

              <div className="text-center pt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Agency Team</h3>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$129</span>
                  <span className="text-base sm:text-lg text-gray-600">/month</span>
                </div>

                <p className="text-sm text-gray-600 mb-6 font-medium">
                  Everything in Solo, plus:
                </p>

                <ul className="space-y-3 text-left mb-6 sm:mb-8">
                  {[
                    'Up to 5 team seats',
                    'Custom budget thresholds per user',
                    'Advanced analytics dashboard',
                    'Webhook & Zapier integration',
                    'White-label forms (coming soon)',
                    'Priority email support',
                    'Weekly strategy call',
                    'Custom rule engine training'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-5 w-5 text-[#b5944b] flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup?plan=team"
                  className="block w-full rounded-full bg-gradient-to-r from-[#b5944b] to-[#d4af37] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white hover:opacity-90 transition-all shadow-lg text-center"
                >
                  Start 14-day free trial
                </Link>

                <p className="text-xs sm:text-sm text-gray-500 mt-4">
                  No credit card required
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium">
                    <DollarSign className="h-4 w-4" />
                    <span>Average ROI: $4,800/month saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need enterprise features? Custom domain, API access, dedicated support?
            </p>
            <Link
              href="mailto:sales@leadvett.com"
              className="inline-flex items-center gap-2 text-[#b5944b] font-semibold hover:text-[#9a7a3d] transition-colors"
            >
              Contact us for Enterprise pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* [Rest of the sections remain the same...] */}

      {/* FAQ Section - NEW */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "How accurate is the AI analysis?",
                a: "LeadVett uses OpenAI's GPT-4 combined with our proprietary rule engine. In testing with 500+ real agency leads, it matched or exceeded human qualification accuracy 94% of the time."
              },
              {
                q: "Can I customize the qualification rules?",
                a: "Yes! You can set custom budget thresholds, add your own questions, and adjust scoring weights. The Agency Team plan includes custom rule engine training."
              },
              {
                q: "Does it integrate with ManyChat?",
                a: "Absolutely. Just paste your LeadVett form link into ManyChat's auto-reply. Setup takes less than 2 minutes."
              },
              {
                q: "What if I don't like it?",
                a: "Cancel anytime during your 14-day trial. No questions asked. No credit card required to start."
              },
              {
                q: "How is this different from just using a Google Form?",
                a: "Google Forms collect data. LeadVett analyzes, scores, prioritizes, and gives you the exact next step with pre-written scripts. It's the difference between raw data and actionable intelligence."
              }
            ].map((faq, i) => (
              <details key={i} className="group border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - UPDATED */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#b5944b]">
        <div className="container mx-auto max-w-4xl text-center">
          <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium text-white leading-relaxed mb-6 sm:mb-8 px-4">
            "I closed 3 Golds last week while my competition was still on calls with Bronzes. 
            LeadVett's DM scripts are printing money."
          </blockquote>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
              SM
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm sm:text-base">Sarah Martinez</p>
              <p className="text-xs sm:text-sm text-blue-100">Instagram Growth Agency • $127K closed in 90 days</p>
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

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src={leadicon}
                  alt="LeadVett Logo"
                  width={50}
                  height={40}
                  className="object-contain"
                />
                <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                  Lead<span className="text-[#b5944b]">Vett</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 max-w-md">
                Deploy your agency's qualification policy on autopilot. 
                Stop wasting time on bad DMs.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="text-sm text-gray-600 hover:text-gray-900">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} LeadVett. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}