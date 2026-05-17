'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight, Check, Star, ChevronDown,
  Shield, Zap, Clock, Phone, TrendingUp, X
} from "lucide-react"

export default function LeadVettLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const faqs = [
    {
      q: "Do my leads need to sign up or create an account?",
      a: "No. Your leads click the link, answer 5 questions, and submit. Zero signup. Zero friction. It takes them under 60 seconds."
    },
    {
      q: "What happens after the 3-day free trial?",
      a: "After 3 days you're charged $49/month. Cancel anytime before that and you won't be charged. No credit card needed to start."
    },
    {
      q: "How is this different from a contact form?",
      a: "A contact form just collects data. LeadVett scores every lead in 10 seconds and tells you exactly what to do — book the call, nurture them, or move on. It's a decision engine."
    },
    {
      q: "Can I use this with ManyChat or my Instagram bio?",
      a: "Yes. You get a shareable link to put anywhere — ManyChat flows, Instagram bio, email signature, WhatsApp. Wherever you currently send Calendly links."
    },
    {
      q: "What if I'm not technical?",
      a: "Setup takes 5 minutes. Create your form, share the link. No code or integrations required to start."
    },
  ]

  const S = {
    gold: "#C9920A",
    dark: "#0D0D0D",
    cream: "#FAFAF8",
    muted: "#6B6B6B",
    border: "#E8E2D8",
    green: "#16A34A",
    greenBg: "#F0FAF5",
    greenBorder: "#BBE4CC",
    orange: "#EA580C",
    orangeBg: "#FFF7ED",
    red: "#DC2626",
  }

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: S.cream, color: S.dark, overflowX: "hidden",
      fontSize: 16, lineHeight: 1.6
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .heading { font-family: 'Bricolage Grotesque', sans-serif; }

        .btn-dark {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #0D0D0D; color: #fff; border: none;
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          text-decoration: none; transition: all 0.15s;
          font-family: inherit; white-space: nowrap;
        }
        .btn-dark:hover { background: #C9920A; }

        .btn-outline {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: transparent; color: #0D0D0D;
          border: 1.5px solid #D0C8B8; padding: 14px 28px;
          border-radius: 12px; font-size: 15px; font-weight: 600;
          cursor: pointer; text-decoration: none; transition: all 0.15s;
          font-family: inherit; white-space: nowrap;
        }
        .btn-outline:hover { border-color: #C9920A; color: #C9920A; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.25s; }
        .d4 { animation-delay: 0.35s; }
        .d5 { animation-delay: 0.45s; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .verdict-gold {
          background: #F0FAF5; border: 1.5px solid #BBE4CC;
          border-radius: 14px; padding: 20px;
        }
        .verdict-bronze {
          background: #FFF7ED; border: 1.5px solid #FED7AA;
          border-radius: 14px; padding: 20px;
        }

        .feature-card {
          background: #fff; border: 1px solid #E8E2D8;
          border-radius: 16px; padding: 24px;
          transition: box-shadow 0.2s;
        }
        .feature-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }

        .faq-item { border-bottom: 1px solid #E8E2D8; }
        .faq-btn {
          width: 100%; background: none; border: none;
          padding: 20px 0; display: flex; justify-content: space-between;
          align-items: center; cursor: pointer; font-family: inherit;
          font-size: 16px; font-weight: 600; color: #0D0D0D; text-align: left;
          gap: 16px;
        }
        .faq-ans {
          overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .step-num {
          width: 36px; height: 36px; border-radius: 50%;
          background: #0D0D0D; color: #C9920A;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; flex-shrink: 0;
        }

        .pill-green {
          display: inline-flex; align-items: center; gap: 7px;
          background: #F0FAF5; border: 1px solid #BBE4CC;
          border-radius: 100px; padding: 5px 14px;
          font-size: 13px; font-weight: 500; color: #15803D;
        }

        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .stack-mobile { flex-direction: column !important; }
          .full-mobile { width: 100% !important; }
          .text-center-mobile { text-align: center !important; }
          .grid-1-mobile { grid-template-columns: 1fr !important; }
          .pad-mobile { padding-left: 20px !important; padding-right: 20px !important; }
          .h1-mobile { font-size: 38px !important; letter-spacing: -1.5px !important; }
          .h2-mobile { font-size: 28px !important; letter-spacing: -1px !important; }
          .hero-top-mobile { padding-top: 100px !important; }
        }
        @media (min-width: 641px) {
          .show-mobile-only { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,250,248,0.96)" : "rgba(250,250,248,0.0)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${S.border}` : "1px solid transparent",
        transition: "all 0.3s"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="heading" style={{ fontSize: 20, fontWeight: 900, color: S.dark, letterSpacing: -0.5 }}>
              Lead<span style={{ color: S.gold }}>Vett</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <Link href="#how-it-works" style={{ fontSize: 14, fontWeight: 500, color: S.muted, textDecoration: "none" }}>How it Works</Link>
            <Link href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: S.muted, textDecoration: "none" }}>Pricing</Link>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: S.muted, textDecoration: "none" }}>Sign in</Link>
            <Link href="/signup" className="btn-dark" style={{ padding: "9px 20px", fontSize: 14 }}>
              Start free trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            {menuOpen ? <X size={22} /> : <span style={{ fontSize: 22 }}>☰</span>}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="show-mobile-only" style={{ background: S.cream, borderTop: `1px solid ${S.border}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <Link href="#how-it-works" style={{ fontWeight: 500, color: S.dark, textDecoration: "none" }} onClick={() => setMenuOpen(false)}>How it Works</Link>
            <Link href="#pricing" style={{ fontWeight: 500, color: S.dark, textDecoration: "none" }} onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/login" style={{ fontWeight: 500, color: S.muted, textDecoration: "none" }} onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link href="/signup" className="btn-dark full-mobile" onClick={() => setMenuOpen(false)}>Start free trial</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hero-top-mobile" style={{ paddingTop: 120, paddingBottom: 72, padding: "120px 24px 72px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>

          <div className="fade-up" style={{ marginBottom: 24 }}>
            <span className="pill-green">
              <span style={{ width: 6, height: 6, background: "#16A34A", borderRadius: "50%", animation: "pulse 2s infinite" }} />
              Used by 127+ agencies who stopped bad calls
            </span>
          </div>

          <h1 className="heading fade-up d1 h1-mobile" style={{
            fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 900,
            lineHeight: 1.05, letterSpacing: -2.5,
            color: S.dark, marginBottom: 20
          }}>
            Know which leads<br />
            are worth your time.
          </h1>

          <p className="fade-up d2" style={{ fontSize: "clamp(16px, 2.5vw, 19px)", color: S.muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto 32px" }}>
            LeadVett scores every inbound lead in <strong style={{ color: S.dark }}>10 seconds</strong> before they touch your calendar. Gold means book the call. Bronze means move on.
          </p>

          <div className="fade-up d3 stack-mobile" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <Link href="/signup" className="btn-dark full-mobile" style={{ fontSize: 16, padding: "16px 32px" }}>
              Start free — 3 days, no card <ArrowRight size={17} />
            </Link>
            <Link href="#how-it-works" className="btn-outline full-mobile" style={{ fontSize: 16, padding: "16px 32px" }}>
              See how it works
            </Link>
          </div>

          <p className="fade-up d4" style={{ fontSize: 13, color: "#AAA" }}>
            3-day free trial · No credit card · $49/month after
          </p>

          {/* ── REAL APP PREVIEW ── */}
          <div className="fade-up d5" style={{ marginTop: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#AAA", marginBottom: 16 }}>
              Real LeadVett output — from the actual app
            </p>
            <div style={{
              background: "#fff", borderRadius: 20,
              border: `1px solid ${S.border}`,
              overflow: "hidden",
              boxShadow: "0 2px 40px rgba(0,0,0,0.06)"
            }}>
              {/* Fake browser bar */}
              <div style={{ background: "#F5F3EF", borderBottom: `1px solid ${S.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFB3B3" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFE4A3" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#B3F0C8" }} />
                <span style={{ flex: 1, background: "#E8E2D8", borderRadius: 6, padding: "4px 12px", fontSize: 11, color: S.muted, marginLeft: 8, textAlign: "left" }}>leadvett.com/dashboard/leads</span>
              </div>

              {/* Lead pipeline content */}
              <div style={{ padding: "20px 20px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#AAA", marginBottom: 14 }}>Lead Pipeline · 2 leads</p>

                {/* Gold lead */}
                <div className="verdict-gold" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>Abdirahman Abdi</span>
                      <span style={{ background: "#16A34A", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>🔥 GOLD</span>
                      <span style={{ fontSize: 12, color: S.muted }}>79% confidence</span>
                    </div>
                    <span style={{ background: "#16A34A", color: "#fff", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}>View Full Analysis →</span>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, marginBottom: 6 }}>abdirahmanabdi5863@gmail.com</p>
                  <p style={{ fontSize: 13, color: "#374151", fontStyle: "italic", marginBottom: 8 }}>"Yes, this person is worth a call right now due to their high budget, urgency, and decision-making authority."</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={13} color={S.green} />
                    <span style={{ fontSize: 13, color: S.green, fontWeight: 600 }}>Book 30-min strategy call today</span>
                    <span style={{ fontSize: 12, color: "#AAA", marginLeft: 8 }}>5/16/2026</span>
                  </div>
                </div>

                {/* Bronze lead */}
                <div className="verdict-bronze">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>hassan</span>
                      <span style={{ background: S.orange, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>BRONZE</span>
                      <span style={{ fontSize: 12, color: S.muted }}>44% confidence</span>
                    </div>
                    <span style={{ background: S.orange, color: "#fff", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}>View Full Analysis →</span>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, marginBottom: 6 }}>yahmed@knbs.or.ke</p>
                  <p style={{ fontSize: 13, color: "#374151", fontStyle: "italic", marginBottom: 8 }}>"This person may not be worth a call right now due to low budget and vague intent, but their immediate timeline warrants a brief exploratory conversation."</p>
                  <span style={{ fontSize: 13, color: S.orange, fontWeight: 600 }}>Add to 90-day nurture sequence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN ── */}
      <section style={{ background: S.dark, padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="heading h2-mobile" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, letterSpacing: -2, color: "#fff", marginBottom: 14 }}>
              Right now, your calendar<br />has no filter.
            </h2>
            <p style={{ fontSize: 17, color: "#666", maxWidth: 460, margin: "0 auto" }}>
              Anyone can book time with you — including people with $500 budgets booking 30-minute calls.
            </p>
          </div>

          {/* Brutal math */}
          <div style={{ background: "#111", borderRadius: 16, border: "1px solid #1A1A1A", padding: "32px 24px", marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#444", marginBottom: 28, textAlign: "center" }}>The math most agencies ignore</p>
            <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
              {[
                { n: "20", label: "calls booked", color: "#fff" },
                { n: "15", label: "unqualified", color: "#EF4444" },
                { n: "11h", label: "wasted", color: "#F97316" },
                { n: "$0", label: "from those 15", color: "#EF4444" },
              ].map(item => (
                <div key={item.label}>
                  <div className="heading" style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, color: item.color, lineHeight: 1, letterSpacing: -2 }}>{item.n}</div>
                  <div style={{ color: "#555", fontSize: 13, marginTop: 6 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #1A1A1A", marginTop: 28, paddingTop: 20, textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: 15 }}>
                At $150/hr value of your time — that's <strong style={{ color: S.gold }}>$1,650 lost this week alone.</strong>
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/signup" className="btn-dark" style={{ background: S.gold, fontSize: 16, padding: "16px 32px" }}>
              Fix this — try free for 3 days <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "80px 24px", background: S.cream }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: S.gold, marginBottom: 12 }}>How it works</p>
            <h2 className="heading h2-mobile" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, letterSpacing: -2, marginBottom: 14 }}>
              Setup in 5 minutes.<br />Works forever.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {[
              {
                n: "01",
                title: "Create your qualification form",
                desc: "Pick 3–5 questions about budget, timeline, and decision authority. Use our template or build your own. No code needed.",
                note: "Ready-to-use templates included."
              },
              {
                n: "02",
                title: "Share your LeadVett link",
                desc: "Put it in your Instagram bio, ManyChat flow, email signature, or wherever you currently send Calendly links.",
                note: "One link. Works everywhere."
              },
              {
                n: "03",
                title: "Get a verdict in 10 seconds",
                desc: "Every submission gets scored instantly — Gold, Silver, or Bronze — with the reasoning, risks, and a pre-written outreach script ready to send.",
                note: "Book the right people. Ignore the rest."
              },
            ].map((step, i) => (
              <div key={step.n} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div className="step-num">{step.n}</div>
                <div>
                  <h3 className="heading" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>{step.title}</h3>
                  <p style={{ color: S.muted, fontSize: 16, lineHeight: 1.65, marginBottom: 6 }}>{step.desc}</p>
                  <span style={{ fontSize: 13, color: S.gold, fontWeight: 600 }}>{step.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERDICT DETAIL PREVIEW ── */}
      <section style={{ background: "#F5F3EF", padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 className="heading h2-mobile" style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, letterSpacing: -2, marginBottom: 12 }}>
              Not just a score.<br />A complete decision.
            </h2>
            <p style={{ color: S.muted, fontSize: 17, maxWidth: 440, margin: "0 auto" }}>
              Every Gold lead comes with the exact reasoning, risks to watch, and a ready-to-send outreach script.
            </p>
          </div>

          {/* Gold verdict detail */}
          <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${S.border}`, overflow: "hidden", boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "24px 24px 0" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#AAA", marginBottom: 16 }}>AI Verdict — Abdirahman Abdi</p>

              {/* Badge row */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ background: "#16A34A", color: "#fff", fontSize: 16, fontWeight: 800, padding: "10px 24px", borderRadius: 100 }}>🔥 Gold</span>
                <span style={{ fontSize: 15, color: S.muted }}>→ Book 30-min strategy call today</span>
              </div>

              {/* Proposal ready */}
              <div style={{ background: S.greenBg, border: `1px solid ${S.greenBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <Check size={18} color={S.green} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: S.dark, marginBottom: 2 }}>Proposal Ready</p>
                  <p style={{ fontSize: 14, color: S.muted }}>Budget confirmed, authority verified, timeline clear. Send proposal within 4 hours.</p>
                </div>
              </div>

              {/* Decision confidence */}
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 600, color: "#1E40AF" }}>Decision Confidence</p>
                <span style={{ background: "#16A34A", color: "#fff", fontSize: 14, fontWeight: 700, padding: "6px 16px", borderRadius: 100 }}>🔥 79% High</span>
              </div>
            </div>

            {/* Decision breakdown */}
            <div style={{ padding: "0 24px 24px" }}>
              <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#AAA", marginBottom: 12 }}>Decision Breakdown</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Budget Strength: High-Tier ($5K+)", pts: "+25", positive: true },
                    { label: "Timeline: Near-term (1-4 weeks)", pts: "+12", positive: true },
                    { label: "Response Quality: Brief", pts: "-5", positive: false },
                  ].map(r => (
                    <div key={r.label} style={{
                      background: r.positive ? S.greenBg : "#FEF2F2",
                      border: `1px solid ${r.positive ? S.greenBorder : "#FECACA"}`,
                      borderRadius: 10, padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: 12
                    }}>
                      {r.positive
                        ? <Check size={15} color={S.green} />
                        : <X size={15} color={S.red} />
                      }
                      <span style={{ flex: 1, fontSize: 14, color: S.dark }}>{r.label}</span>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 100,
                        background: r.positive ? "#DCFCE7" : "#FEE2E2",
                        color: r.positive ? "#15803D" : S.red
                      }}>{r.pts}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next best action */}
              <div style={{ background: "#F8F8F8", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>Next Best Action</p>
                  <span style={{ background: S.dark, color: "#fff", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>Copy Script</span>
                </div>
                <p style={{ fontSize: 13, color: S.muted, fontStyle: "italic", lineHeight: 1.6 }}>
                  "Hi [Name], I noticed you're looking to move forward within 1-2 weeks with a budget of $5k-$10k. Since you're the decision-maker, let's schedule a quick call to explore how we can meet your needs efficiently..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: S.dark, padding: "64px 24px" }}>
        <div className="grid-1-mobile" style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, textAlign: "center" }}>
          {[
            { val: "10", unit: "sec", label: "To score every lead" },
            { val: "15", unit: "hrs", label: "Saved per week average" },
            { val: "3", unit: "day", label: "Free trial, no card" },
          ].map(s => (
            <div key={s.label}>
              <div className="heading" style={{ fontSize: "clamp(48px, 7vw, 64px)", fontWeight: 900, color: S.gold, lineHeight: 1, letterSpacing: -3 }}>
                {s.val}<span style={{ fontSize: 22, color: "#444" }}>{s.unit}</span>
              </div>
              <p style={{ color: "#555", fontSize: 14, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 24px", background: S.cream }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="heading h2-mobile" style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, letterSpacing: -2, marginBottom: 10 }}>What users say</h2>
            <p style={{ color: S.muted }}>Real feedback from real people who tested it</p>
          </div>
          <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                initials: "BP", color: "#1E40AF", bg: "#EFF6FF",
                quote: "Tested the product overall — impressed. Congrats on the launch. The AI verdict is genuinely useful and the scoring makes sense. Would save agency owners a lot of time.",
                name: "Barun P.", role: "shipfast.ai founder", metric: "Impressed on first test"
              },
              {
                initials: "JO", color: "#15803D", bg: "#F0FAF5",
                quote: "I was taking 20+ calls a week. Now I take 7. The Gold/Bronze filter is so clear — I stopped second-guessing myself. Closed more because I'm only talking to serious buyers.",
                name: "James O.", role: "Social Media Agency, Nairobi", metric: "15 hrs/week saved"
              },
              {
                initials: "AM", color: "#B45309", bg: "#FFFBEB",
                quote: "The outreach script alone is worth it. I used to spend 20 minutes writing follow-ups. Now I copy the script, change the name, and send. My reply rate went up noticeably.",
                name: "Aisha M.", role: "ManyChat Consultant", metric: "Reply rate improved"
              },
            ].map(t => (
              <div key={t.name} className="feature-card">
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill={S.gold} color={S.gold} />)}
                </div>
                <p style={{ color: "#444", fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: S.muted }}>{t.role}</p>
                    <p style={{ fontSize: 11, color: S.gold, fontWeight: 600, marginTop: 2 }}>{t.metric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "80px 24px", background: "#F5F3EF" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: S.gold, marginBottom: 12 }}>Pricing</p>
          <h2 className="heading h2-mobile" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>
            One plan.<br />Everything included.
          </h2>

          <div style={{ background: "#fff", borderRadius: 20, border: `2px solid ${S.dark}`, padding: "40px 32px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: S.gold }} />

            <div style={{ marginBottom: 28 }}>
              <div className="heading" style={{ fontSize: 64, fontWeight: 900, color: S.dark, lineHeight: 1, letterSpacing: -3 }}>
                $49<span style={{ fontSize: 18, fontWeight: 400, color: S.muted, letterSpacing: 0 }}>/mo</span>
              </div>
              <p style={{ color: S.muted, fontSize: 14, marginTop: 6 }}>After your free 3-day trial</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, textAlign: "left" }}>
              {[
                "Unlimited lead scoring",
                "Gold / Silver / Bronze verdicts",
                "AI reasoning & signal breakdown",
                "Pre-written outreach scripts",
                "Custom qualification questions",
                "Works with ManyChat & Instagram bio",
                "Mobile-optimized intake forms",
                "Lead pipeline dashboard",
                "Email support",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: S.greenBg, border: `1px solid ${S.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} color={S.green} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 15, color: "#333" }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/signup" className="btn-dark" style={{ width: "100%", fontSize: 16, padding: "16px 24px" }}>
              Start free trial — 3 days, no card <ArrowRight size={17} />
            </Link>

            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
              {[
                { icon: Shield, text: "No credit card" },
                { icon: Zap, text: "Active in 5 min" },
                { icon: Clock, text: "Cancel anytime" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: S.muted }}>
                  <Icon size={12} /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 24px", background: S.cream }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 className="heading h2-mobile" style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, letterSpacing: -2, marginBottom: 40, textAlign: "center" }}>Questions</h2>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={18} color={S.muted} style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }} />
                </button>
                <div className="faq-ans" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                  <p style={{ color: S.muted, fontSize: 15, lineHeight: 1.7, paddingBottom: 20 }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: S.dark, padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="heading h2-mobile" style={{ fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, letterSpacing: -3, color: "#fff", lineHeight: 1.05, marginBottom: 18 }}>
            Your next Gold lead<br />
            <span style={{ color: S.gold }}>is already waiting.</span>
          </h2>
          <p style={{ color: "#555", fontSize: 17, marginBottom: 36 }}>Start your free trial. Score your first lead today.</p>
          <Link href="/signup" className="btn-dark" style={{ fontSize: 17, padding: "18px 40px", background: S.gold }}>
            Start free — 3 days, no card required <ArrowRight size={18} />
          </Link>
          <p style={{ color: "#333", fontSize: 13, marginTop: 14 }}>$49/month after trial · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050505", padding: "40px 24px", borderTop: "1px solid #111" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
            <span className="heading" style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
              Lead<span style={{ color: S.gold }}>Vett</span>
            </span>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"], ["Sign in", "/login"]].map(([label, href]) => (
                <Link key={label} href={href} style={{ fontSize: 13, color: "#444", textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#333" }}>© 2026 LeadVett</p>
          </div>
        </div>
      </footer>
    </div>
  )
}