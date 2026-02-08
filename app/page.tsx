import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Sparkles, Clock, Target } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SignalIntake</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span>Stop Wasting Calls on Tire-Kickers</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Turn Instagram DMs Into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Qualified Leads
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI qualifies your leads before they hit your calendar. Gold badges = ready to buy. 
            Bronze badges = politely ignore. Save 10+ hours per week.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-muted-foreground">
              14-day trial • No credit card required
            </p>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Join agencies saving 10+ hours/week on bad calls
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              You Know This Pain
            </h2>
            <p className="text-lg text-muted-foreground">
              Every agency faces the same problem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card p-6">
              <div className="text-4xl mb-4">😫</div>
              <h3 className="text-lg font-semibold mb-2">100 DMs/week saying "interested"</h3>
              <p className="text-muted-foreground text-sm">
                You send Calendly to everyone and your calendar fills with meetings
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="text-4xl mb-4">😤</div>
              <h3 className="text-lg font-semibold mb-2">15 hours/week on bad calls</h3>
              <p className="text-muted-foreground text-sm">
                "What's your budget?" "It depends..." Every. Single. Time.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="text-4xl mb-4">😞</div>
              <h3 className="text-lg font-semibold mb-2">Real buyers lost in noise</h3>
              <p className="text-muted-foreground text-sm">
                While you're on calls with tire-kickers, serious leads go cold
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SignalIntake Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple. Automatic. Effective.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Send Your Intake Link (Not Calendly)</h3>
                <p className="text-muted-foreground">
                  When someone DMs "interested" → send your SignalIntake link instead of Calendly. 
                  Add it to your IG automation, ManyChat, or bio.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center font-bold text-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Leads Answer 5 Quick Questions</h3>
                <p className="text-muted-foreground">
                  What's your budget? When do you want to start? Who decides? 
                  Takes 60 seconds. Mobile-friendly. No BS.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">AI Assigns Gold/Silver/Bronze Badge</h3>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-green-600">Gold</span> = Has budget, urgent, decision maker (call NOW) • 
                  <span className="font-semibold text-yellow-600"> Silver</span> = Potential, nurture later • 
                  <span className="font-semibold text-orange-600"> Bronze</span> = Just browsing, ignore
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center font-bold text-lg">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">You Only Call Gold Leads</h3>
                <p className="text-muted-foreground">
                  Check your dashboard. See clear badges. Call the Golds within 2 hours. 
                  Ignore the Bronzes guilt-free. Simple.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badge System */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Badge System
            </h2>
            <p className="text-lg text-muted-foreground">
              Clear verdicts, not vague scores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border-2 border-green-500 bg-card p-6">
              <div className="inline-flex items-center justify-center rounded-full bg-green-500 text-white px-4 py-2 mb-4 text-sm font-bold">
                🔥 GOLD
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Buy</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Budget confirmed ($3K+), timeline urgent (this week/month), decision maker clear.
              </p>
              <p className="text-sm font-medium text-green-600">
                → Call within 2 hours
              </p>
            </div>

            <div className="rounded-lg border-2 border-yellow-500 bg-card p-6">
              <div className="inline-flex items-center justify-center rounded-full bg-yellow-500 text-white px-4 py-2 mb-4 text-sm font-bold">
                🟡 SILVER
              </div>
              <h3 className="text-lg font-semibold mb-2">Potential</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Budget mentioned but flexible, timeline next quarter, worth following up.
              </p>
              <p className="text-sm font-medium text-yellow-600">
                → Nurture, check back later
              </p>
            </div>

            <div className="rounded-lg border-2 border-orange-500 bg-card p-6">
              <div className="inline-flex items-center justify-center rounded-full bg-orange-500 text-white px-4 py-2 mb-4 text-sm font-bold">
                🟤 BRONZE
              </div>
              <h3 className="text-lg font-semibold mb-2">Just Browsing</h3>
              <p className="text-muted-foreground text-sm mb-4">
                No clear budget, no urgency, not decision maker. Early exploration.
              </p>
              <p className="text-sm font-medium text-orange-600">
                → Ignore or archive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Agencies Like Yours
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI That Actually Works</h3>
              <p className="text-muted-foreground text-sm">
                Powered by Claude AI. Analyzes budget signals, urgency, authority. 
                80%+ accuracy from day one.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Lead submits form → AI analyzes → Badge assigned in 10 seconds. 
                No waiting, no manual work.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile-Friendly Forms</h3>
              <p className="text-muted-foreground text-sm">
                Leads fill out on their phones in 60 seconds. Clean, fast, professional. 
                No technical setup needed.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Simple Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                See all leads in one place. Filter by badge. Click to see AI reasoning. 
                No clutter, just what matters.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Works With Your Tools</h3>
              <p className="text-muted-foreground text-sm">
                Add link to ManyChat, IG bio, email signature, anywhere. 
                No complex integration required.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Enterprise-grade security with Supabase. Your leads, your data, fully encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Wasting Time on Bad Leads
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join agencies using SignalIntake to save 10+ hours/week and focus on Gold leads only.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            14-day free trial • No credit card required • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">SignalIntake</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} SignalIntake. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}