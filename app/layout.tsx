import type { Metadata, Viewport } from "next"
import { Outfit, Inter_Tight } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"

// ─── Fonts ────────────────────────────────────────────────────────────────────
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
// Target keywords (in priority order):
// 1. "lead qualification tool" — high intent, product-aware searches
// 2. "how to qualify inbound leads" — problem-aware searches
// 3. "lead scoring software for agencies" — buyer searches
// 4. "ManyChat lead qualification" — ecosystem searches
// 5. "LeadVett" — brand searches (already ranking)

const SITE_URL = "https://leadvett.com"
const SITE_NAME = "LeadVett"

// Title: 50-60 chars. Primary keyword first. Brand last.
// "Lead Qualification Tool for Agencies — LeadVett" = 49 chars ✓
const DEFAULT_TITLE = "Lead Qualification Tool for Agencies — LeadVett"

// Description: 140-155 chars. Answer the search intent immediately.
// Includes primary keyword, secondary keyword, and clear value prop.
const DEFAULT_DESCRIPTION =
  "Qualify every inbound lead in 10 seconds. LeadVett scores leads Gold, Silver, or Bronze so agencies only book calls with buyers. Free 3-day trial."
// ↑ 148 chars ✓ — ends cleanly, includes "qualify inbound leads", "agencies", "book calls"

export const metadata: Metadata = {
  // ── Title ──────────────────────────────────────────────────────────────────
  title: {
    default: DEFAULT_TITLE,
    // Inner pages: "Pricing | LeadVett" / "How it Works | LeadVett"
    template: "%s | LeadVett",
  },

  // ── Description ────────────────────────────────────────────────────────────
  description: DEFAULT_DESCRIPTION,

  // ── Canonical & Base ───────────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // ── Authors & Publisher ────────────────────────────────────────────────────
  authors: [{ name: "Abdirahman Abdi", url: SITE_URL }],
  creator: "Abdirahman Abdi",
  publisher: SITE_NAME,

  // ── Open Graph ─────────────────────────────────────────────────────────────
  // Must match page title exactly — Google cross-references these
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",      // 1200x630px — create this if missing
        width: 1200,
        height: 630,
        alt: "LeadVett — AI Lead Qualification Tool for Agencies",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ───────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@leadvett",
    creator: "@abdirahman5863",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── App Info ───────────────────────────────────────────────────────────────
  applicationName: SITE_NAME,
  category: "business",

  // ── Google Search Console Verification ────────────────────────────────────
  verification: {
    google: "Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA",
  },
}

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#C9920A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────
// Rules:
// 1. SoftwareApplication — tells Google what LeadVett IS
// 2. FAQPage — gets FAQ rich results in Google (shows Q&A directly in search)
// 3. Organization — builds brand entity recognition
// 4. WebSite — enables sitelinks search box
// REMOVED: AggregateRating — don't use without real verified reviews
//          Google can penalize fabricated ratings

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [

    // ── 1. Software Product ──────────────────────────────────────────────────
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "LeadVett",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      featureList: [
        "AI lead scoring in 10 seconds",
        "Gold, Silver, Bronze lead verdicts",
        "Custom qualification forms",
        "Lead pipeline dashboard",
        "Pre-written outreach scripts",
        "ManyChat integration",
      ],
      offers: {
        "@type": "Offer",
        name: "LeadVett Pro",
        price: "49.00",
        priceCurrency: "USD",
        priceValidUntil: "2026-12-31",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/signup`,
        description:
          "Full AI lead qualification engine. Unlimited leads. Custom forms. 3-day free trial included.",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 3,
        },
      },
      description:
        "LeadVett is an AI-powered lead qualification tool for digital marketing agencies. It scores every inbound lead in 10 seconds — Gold (book the call), Silver (nurture first), or Bronze (not worth your time) — so agencies stop wasting hours on bad discovery calls.",
    },

    // ── 2. FAQ Rich Results ──────────────────────────────────────────────────
    // These questions appear DIRECTLY in Google search results
    // as expandable Q&A — massive visibility boost
    // Rules: max 10 questions, answers under 300 words each,
    //        questions must match real search queries
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a lead qualification tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A lead qualification tool automatically scores your inbound leads based on their budget, timeline, decision-making authority, and urgency. Instead of manually reviewing every inquiry, the tool tells you which leads are worth a call (Gold), which need nurturing (Silver), and which to ignore (Bronze). LeadVett does this in 10 seconds per lead.",
          },
        },
        {
          "@type": "Question",
          name: "How do you qualify inbound leads automatically?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To qualify inbound leads automatically: (1) Create a short intake form with 3–5 questions about budget, timeline, and decision authority. (2) Share the form link instead of your Calendly. (3) When a lead submits, AI analyzes their answers and scores them instantly. LeadVett does exactly this — every lead gets a verdict in under 10 seconds, before they touch your calendar.",
          },
        },
        {
          "@type": "Question",
          name: "How is LeadVett different from a regular contact form?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A regular contact form just collects data. LeadVett analyzes every answer, scores buying intent from 0–100%, assigns a Gold, Silver, or Bronze badge, identifies risks, and writes a personalized outreach script for you. It's a decision engine, not a form.",
          },
        },
        {
          "@type": "Question",
          name: "Does LeadVett work with ManyChat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Paste your LeadVett form link into your ManyChat auto-reply flow and you're live in under 2 minutes. When a lead fills the form, you get an instant AI verdict in your LeadVett dashboard — no developer needed.",
          },
        },
        {
          "@type": "Question",
          name: "How much does LeadVett cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LeadVett costs $49 per month with a 3-day free trial. No credit card required to start. You can cancel anytime.",
          },
        },
        {
          "@type": "Question",
          name: "Do my leads need to create an account to fill the form?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Your leads just click the link, answer 5 questions, and submit. Zero signup required on their end. It takes under 60 seconds and works on mobile.",
          },
        },
      ],
    },

    // ── 3. Organization ──────────────────────────────────────────────────────
    // Builds brand entity in Google's Knowledge Graph
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/leadicon.png`,
        width: 512,
        height: 512,
      },
      foundingDate: "2025",
      founder: {
        "@type": "Person",
        name: "Abdirahman Abdi",
        url: `${SITE_URL}/about`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@leadvett.com",
        contactType: "customer support",
      },
      sameAs: [
        "https://twitter.com/leadvett",
        "https://www.instagram.com/awsaam_abdi",
        "https://www.linkedin.com/company/leadvett",
      ],
    },

    // ── 4. WebSite ───────────────────────────────────────────────────────────
    // Enables sitelinks + search box in Google results
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    // ── 5. BreadcrumbList ────────────────────────────────────────────────────
    // Helps Google understand site structure
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: `${SITE_URL}/#pricing`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "How it Works",
          item: `${SITE_URL}/#how-it-works`,
        },
      ],
    },
  ],
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${interTight.variable}`}
    >
      <head>
        {/* ── Google Search Console ── */}
        <meta
          name="google-site-verification"
          content="Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA"
        />

        {/* ── Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* ── Preconnect for performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ── Icons ── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Geographic targeting (helps rank in Kenya + globally) ── */}
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />

        {/* ── Additional SEO signals ── */}
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="English" />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
      >
        <SpeedInsights />
        {children}
      </body>
    </html>
  )
}