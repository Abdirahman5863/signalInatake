'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Check,
  CheckCircle,
  ChevronDown,
  Clock3,
  Copy,
  FileText,
  Gauge,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import leadIcon from './public/images/leadicon.png'
import styles from './landing.module.css'

const steps = [
  {
    icon: FileText,
    label: 'Ask what matters',
    copy: 'Build a focused intake around budget, timeline, authority, pain, and the standards that define a good client for your agency.',
  },
  {
    icon: Gauge,
    label: 'Get the verdict',
    copy: 'LeadVett reads every answer, applies your qualification logic, and returns a Gold, Silver, or Bronze decision in seconds.',
  },
  {
    icon: MessageSquareText,
    label: 'Take the next step',
    copy: 'See the reasoning, risks, and recommended action—plus a ready-to-personalize outreach message for the lead.',
  },
]

const featureRows = [
  ['Verdict', 'Gold', 'Book the call while intent is high'],
  ['Approval', 'Self-reported', 'Confirm stakeholders on the discovery call'],
  ['Budget', '$5k–$10k', 'Inside your preferred engagement range'],
  ['Timeline', '2–4 weeks', 'Near-term project with clear urgency'],
]

const faqs = [
  ['Do leads need to create an account?', 'No. They open your shareable form, answer your questions, and submit. There is no LeadVett account or download required for the lead.'],
  ['How is this different from a normal form?', 'A normal form stores answers. LeadVett interprets them, gives you a clear qualification verdict, explains the decision, and recommends what to do next.'],
  ['Can I choose my own qualification questions?', 'Yes. You control the questions, so the decision reflects the offer, minimum budget, timeline, and buying signals that matter to your agency.'],
  ['Where can I share the form?', 'Anywhere you currently send prospects: your website, Instagram bio, ManyChat flow, WhatsApp, email signature, or direct messages.'],
  ['Is LeadVett really free?', 'Yes. Create qualification forms, collect responses, and review lead verdicts without a trial, subscription, or credit card.'],
]

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`${styles.brand} ${light ? styles.brandLight : ''}`}>
      <Image src={leadIcon} width={34} height={28} alt="" aria-hidden="true" className={styles.brandIcon} />
      <span>Lead<strong>Vett</strong></span>
    </span>
  )
}

export default function LeadVettLanding() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className={styles.page}>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link href="/" aria-label="LeadVett home"><Brand light /></Link>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link href="#product">Product</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="#free">Free access</Link>
            <Link href="#questions">Questions</Link>
          </nav>
          <div className={styles.navActions}>
            <Link href="/login" className={styles.signIn}>Sign in</Link>
            <Link href="/signup" className={styles.navCta}>Start free <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <button className={styles.menuButton} onClick={() => setMenuOpen(value => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <Link href="#product" onClick={() => setMenuOpen(false)}>Product</Link>
            <Link href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
            <Link href="#free" onClick={() => setMenuOpen(false)}>Free access</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link href="/signup" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Start free</Link>
          </nav>
        )}
      </header>

      <section className={styles.hero}>
        <div className={styles.ambient} aria-hidden="true">
          <span className={styles.orbitOne} />
          <span className={styles.orbitTwo} />
          <span className={styles.orbitThree} />
          <span className={styles.glow} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}><span /> Project qualification for independent web studios</div>
          <h1>Is this website project<br /><em>worth a discovery call?</em></h1>
          <p className={styles.heroCopy}>Collect project scope, budget and timing before you open your calendar. See what fits, what needs clarification, and what to ask next.</p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={styles.primaryCta}>Start qualifying for free <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="#product" className={styles.secondaryCta}>See an example enquiry</Link>
          </div>
          <div className={styles.heroMeta}>
            <span><CheckCircle size={15} aria-hidden="true" /> No credit card</span>
            <span><Clock3 size={15} aria-hidden="true" /> Setup in 5 minutes</span>
            <span><ShieldCheck size={15} aria-hidden="true" /> You control the questions</span>
          </div>
        </div>

        <div id="product" className={styles.productStage}>
          <div className={styles.windowGlow} aria-hidden="true" />
          <div className={styles.productWindow}>
            <div className={styles.windowBar}>
              <div className={styles.trafficLights} aria-hidden="true"><i /><i /><i /></div>
              <span>LeadVett — Lead analysis</span>
              <span className={styles.secure}><ShieldCheck size={13} aria-hidden="true" /> Private</span>
            </div>
            <div className={styles.appShell}>
              <aside className={styles.appSidebar}>
                <Brand />
                <div className={styles.sideNav}>
                  <span><BarChart3 size={16} /> Dashboard</span>
                  <span className={styles.sideActive}><Sparkles size={16} /> Leads <b>12</b></span>
                  <span><FileText size={16} /> Forms</span>
                </div>
                <div className={styles.sideFooter}><span>AW</span><p>Awsam Agency<small>Workspace</small></p></div>
              </aside>
              <div className={styles.appMain}>
                <div className={styles.appHeading}>
                  <div><small>NEW LEAD · WEBSITE FORM</small><h2>Usama Hassan</h2><p>Awsam Agency Growth Audit</p></div>
                  <button><MessageSquareText size={15} /> Email lead</button>
                </div>
                <div className={styles.verdictGrid}>
                  <section className={styles.verdictCard}>
                    <div className={styles.verdictTop}><span>PROJECT FIT</span><small>Illustrative example</small></div>
                    <div className={styles.goldVerdict}><Sparkles size={19} /> Gold</div>
                    <h3>Invite to discovery</h3>
                    <p>Reported budget meets the minimum. Confirm scope and approvers on the call.</p>

                  </section>
                  <section className={styles.breakdownCard}>
                    <div className={styles.cardTitle}><span>Decision breakdown</span><span className={styles.confidence}>Submitted evidence</span></div>
                    <div className={styles.featureTable}>
                      {featureRows.map(([label, value, note]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
                    </div>
                  </section>
                </div>
                <div className={styles.scriptCard}>
                  <div><MessageSquareText size={17} /><span><strong>Suggested opening</strong><small>Ready to personalize</small></span></div>
                  <p>“Hi Usama, your timeline and growth goals look like a strong fit. I’d like to explore the project while the opportunity is fresh…”</p>
                  <button aria-label="Copy suggested opening"><Copy size={15} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.floatingNote} ${styles.noteOne}`}><Zap size={16} /><span><strong>Explainable decision</strong><small>Review unclear answers</small></span></div>
          <div className={`${styles.floatingNote} ${styles.noteTwo}`}><CalendarClock size={16} /><span><strong>Next action</strong><small>Confirm project scope</small></span></div>
        </div>
      </section>

      <section className={styles.marketStrip}>
        <p>Forms collect answers.</p><span />
        <p>LeadVett makes the decision.</p><span />
        <p>Your calendar stays focused.</p>
      </section>

      <section id="how-it-works" className={styles.processSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.kicker}>THE QUALIFICATION LOOP</span><h2>From enquiry to action,<br />without the guesswork.</h2></div>
          <p>Every lead moves through the same clear standard. No scanning paragraphs. No deciding by instinct. No treating every form fill like a sales opportunity.</p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => {
            const Icon = step.icon
            return <article key={step.label} className={styles.stepCard}><div className={styles.stepTop}><span>0{index + 1}</span><Icon size={21} /></div><h3>{step.label}</h3><p>{step.copy}</p>{index < steps.length - 1 && <ArrowRight className={styles.stepArrow} size={18} aria-hidden="true" />}</article>
          })}
        </div>
      </section>

      <section className={styles.explainSection}>
        <div className={styles.explainCopy}>
          <span className={styles.kicker}>EXPLAINABLE BY DESIGN</span>
          <h2>Never just<br />a score.</h2>
          <p>A badge only matters when you can trust it. LeadVett shows the signals behind every decision, the risks worth noticing, and the next move to make.</p>
          <ul>
            <li><Check size={16} /> Transparent signal breakdown</li>
            <li><Check size={16} /> Missing details and risk flags</li>
            <li><Check size={16} /> Clear next-best action</li>
            <li><Check size={16} /> Outreach copy grounded in the lead’s answers</li>
          </ul>
        </div>
        <div className={styles.signalPanel}>
          <div className={styles.panelHeader}><span>Example project evidence</span><small>3 signals · scope to confirm</small></div>
          {[
            ['Budget', 'Reported amount meets your minimum', 'Fits', 'positive'],
            ['Project approver', 'Says they approve the project', 'Reported', 'positive'],
            ['Project timing', 'Reports a start within 30 days', 'Near-term', 'positive'],
            ['Scope', 'Confirm requirements during discovery', 'Review', 'risk'],
          ].map(([label, detail, points, type]) => <div className={styles.signalRow} key={label}><span className={type === 'risk' ? styles.riskDot : styles.positiveDot} /><p><strong>{label}</strong><small>{detail}</small></p><b className={type === 'risk' ? styles.riskPoints : ''}>{points}</b></div>)}
          <div className={styles.panelFooter}><span>Recommended action</span><strong>Invite to discovery call today</strong></div>
        </div>
      </section>

      <section id="free" className={styles.pricingSection}>
        <div className={styles.pricingWatermark} aria-hidden="true">QUALIFY</div>
        <div className={styles.pricingIntro}><span className={styles.kicker}>FREE PILOT FOR WEB STUDIOS</span><h2>No trial.<br /><em>No paywall.</em></h2><p>LeadVett is available free while we learn from independent web studios using it with real enquiries.</p></div>
        <div className={styles.priceCard}>
          <div className={styles.priceTop}><span>LeadVett Free</span><small>Everything you need to begin</small></div>
          <div className={styles.price}><strong>$0</strong><span>for now</span></div>
          <p>Create an account and start qualifying leads. No card, trial countdown, or subscription.</p>
          <ul>{['Up to 100 enquiries per form per hour','Gold, Silver, and Bronze verdicts','Qualification rules and evidence','Custom qualification questions','Suggested outreach messages','Lead pipeline dashboard'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>
          <Link href="/signup">Create your free account <ArrowRight size={16} /></Link>
          <small>No credit card · Your existing data stays yours</small>
        </div>
      </section>

      <section id="questions" className={styles.faqSection}>
        <div className={styles.faqIntro}><span className={styles.kicker}>QUESTIONS</span><h2>Before your<br />first verdict.</h2><p>Everything you need to know before putting LeadVett between an enquiry and your calendar.</p></div>
        <div className={styles.faqList}>{faqs.map(([question, answer], index) => <div className={styles.faqItem} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} className={openFaq === index ? styles.chevronOpen : ''} /></button><div className={`${styles.faqAnswer} ${openFaq === index ? styles.faqAnswerOpen : ''}`}><p>{answer}</p></div></div>)}</div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalGlow} aria-hidden="true" />
        <div className={styles.finalOrbit} aria-hidden="true" />
        <span className={styles.kicker}>YOUR NEXT LEAD IS ALREADY ON THE WAY</span>
        <h2>Decide before<br /><em>you book.</em></h2>
        <p>Build your qualification form and score your first inbound lead today.</p>
        <Link href="/signup">Start free—no card required <ArrowRight size={17} /></Link>
      </section>

      <footer className={styles.footer}>
        <Brand light />
        <p>Website project qualification for independent studios.</p>
        <nav aria-label="Footer navigation"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link><Link href="/login">Sign in</Link></nav>
        <small>© {new Date().getFullYear()} LeadVett</small>
      </footer>
    </main>
  )
}
