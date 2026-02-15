import Link from 'next/link'
import { ArrowRight, Check, Zap, Copy, AlertCircle, CheckCircle2, Sparkles, Star } from 'lucide-react'

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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by 100+ agencies
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Clear verdicts,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                not vague summaries
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              LeadVett AI analyzes your leads in seconds—Strengths vs. Risks—so you can 
              ignore bad leads guilt-free. Plus instant DM scripts to close faster.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Start qualifying leads for free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              14-day trial • No credit card required • 2-minute setup
            </p>
          </div>

          {/* Hero Visual - Demo Card */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-500 font-medium">Lead Analysis</span>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8 space-y-6">
                {/* Badge */}
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg">
                    🔥 GOLD
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    → Call within 2 hours
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                    <h3 className="text-base font-bold text-green-900 flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-green-900">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>High Budget:</strong> $5K-10K range confirmed</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-green-900">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Urgency:</strong> Needs solution in 7 days</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-green-900">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Authority:</strong> CEO makes decisions</span>
                      </li>
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                    <h3 className="text-base font-bold text-orange-900 flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5" />
                      Risks
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-orange-900">
                        <span className="text-lg">⚠</span>
                        <span><strong>Friction:</strong> Needs partner approval</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-orange-900">
                        <span className="text-lg">⚠</span>
                        <span><strong>History:</strong> Tried 3 agencies before</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* DM Script */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      AI-Generated Reply (One-Click Copy)
                    </h3>
                    <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-200">
                    "Hey Sarah, saw your request! Since you're working with a partner, 
                    I have a 2-min 'Agency Comparison' PDF that'll speed up their decision. 
                    Want me to send it?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof
      <section className="py-12 px-6 border-y border-gray-200 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-sm text-gray-500 mb-6">
            Trusted by agencies that closed $2M+ in new business
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
            {['Agency A', 'Studio B', 'Growth Co', 'Scale Inc', 'Digital X'].map((name) => (
              <div key={name} className="text-xl font-bold text-gray-400">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Problem Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stop reading paragraphs
            </h2>
            <p className="text-xl text-gray-600">
              Get clinical breakdowns in 10 seconds, not 10 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '😫',
                title: '100+ DMs every week',
                description: 'Calendar fills with meetings that go nowhere'
              },
              {
                emoji: '😤',
                title: '15 hours on bad calls',
                description: '"What\'s your budget?" "It depends..." every time'
              },
              {
                emoji: '😞',
                title: 'Real buyers go cold',
                description: 'While you\'re stuck with tire-kickers'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How LeadVett works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, automatic, effective
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Send your intake link',
                description: 'Replace Calendly with LeadVett in your IG automation, ManyChat, or bio'
              },
              {
                number: '02',
                title: 'Lead answers 5 questions',
                description: 'Budget, timeline, decision maker, pain, history—takes 60 seconds'
              },
              {
                number: '03',
                title: 'AI assigns badge + gives you DM script',
                description: 'Gold/Silver/Bronze verdict with strengths, risks, and instant reply template'
              },
              {
                number: '04',
                title: 'You only call Gold leads',
                description: 'Copy the DM script, close faster, ignore Bronze guilt-free'
              }
            ].map((step, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {step.number}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for Instagram agencies
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to qualify leads in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Decisive AI',
                description: 'No essays. Just clear strengths, risks, and action steps.'
              },
              {
                icon: <Copy className="h-6 w-6" />,
                title: 'One-click scripts',
                description: 'Copy pre-written DM replies. Paste. Close deals faster.'
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: '10-second analysis',
                description: 'Lead submits → AI analyzes → Badge ready instantly.'
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: 'ManyChat ready',
                description: 'Works with your IG automation. Setup in 2 minutes.'
              },
              {
                icon: <AlertCircle className="h-6 w-6" />,
                title: 'Risk detection',
                description: 'Spot red flags before wasting time on calls.'
              },
              {
                icon: <Check className="h-6 w-6" />,
                title: 'Mobile-first',
                description: 'Leads fill out on phones. Clean, fast, professional.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              ))}
            </div>
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8">
            "LeadVett saved me 12 hours last week. I only call Golds now. 
            The DM scripts are money—closed 2 deals without even hopping on a call first."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20"></div>
            <div className="text-left">
              <p className="font-semibold text-white">Sarah M.</p>
              <p className="text-sm text-blue-100">Agency Owner, Nairobi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Ready to qualify leads
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              in 10 seconds?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join 100+ agencies using LeadVett to save 10+ hours per week
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            Start your free trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-6">
            14 days free • No credit card • Cancel anytime
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