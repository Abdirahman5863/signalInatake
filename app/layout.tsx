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
export const metadata: Metadata = {
  title: {
    default: "LeadVett — AI Lead Qualification for Instagram Agencies",
    template: "%s | LeadVett",
  },
  description:
    "Stop wasting 30-min calls on $500 leads. LeadVett's AI scores every inbound lead in 10 seconds — 🔥 Gold, ⚡ Silver, or ⛔ Disqualified. Used by 127+ agencies. $49/mo.",
  metadataBase: new URL("https://leadvett.com"),
  alternates: { canonical: "/" },
  keywords: [
    "lead qualification tool",
    "AI lead scoring",
    "Instagram agency tools",
    "lead qualification for agencies",
    "ManyChat lead qualification",
    "SMMA lead scoring",
    "Instagram DM automation",
    "lead intake form",
    "agency CRM",
    "qualify leads automatically",
    "LeadVett",
  ],
  authors: [{ name: "LeadVett", url: "https://leadvett.com" }],
  creator: "LeadVett",
  publisher: "LeadVett",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leadvett.com",
    siteName: "LeadVett",
    title: "LeadVett — Stop Wasting Calls on Bad Leads",
    description:
      "AI decision engine that sits between your DMs and your calendar. Scores every lead in 10 seconds. Works with ManyChat in 2 mins. 3-day free trial.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeadVett — AI Lead Qualification Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@leadvett",
    creator: "@abdirahman5863",
    title: "LeadVett — AI Lead Qualification for Agencies",
    description:
      "Stop wasting calls on bad leads. AI scores every DM inquiry in 10 seconds — Gold, Silver, or Disqualified. $49/mo.",
    images: ["/og-image.png"],
  },
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
  applicationName: "LeadVett",
  category: "business",
  verification: {
    google: "Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA",
  },
}

export const viewport: Viewport = {
  themeColor: "#b5944b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://leadvett.com/#software",
      name: "LeadVett",
      url: "https://leadvett.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: "LeadVett Pro",
          price: "49.00",
          priceCurrency: "USD",
          description: "Full AI lead qualification engine, unlimited leads, ManyChat integration",
        },
      ],
      description:
        "AI-powered lead qualification decision engine for Instagram agencies and freelancers. Scores every inbound lead in 10 seconds with Gold, Silver, Bronze, or Disqualified verdict.",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "127",
        bestRating: "5",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is LeadVett different from a regular form?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Regular forms collect data. LeadVett analyzes every answer, scores buying intent (0-100%), assigns a priority badge, and tells you exactly when to reach out.",
          },
        },
        {
          "@type": "Question",
          name: "Does LeadVett integrate with ManyChat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Paste your LeadVett form link into ManyChat's auto-reply and you're live in under 2 minutes — no developer needed.",
          },
        },
        {
          "@type": "Question",
          name: "How much does LeadVett cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LeadVett is $49/month with a 3-day free trial. No credit card required to start.",
          },
        },
        {
          "@type": "Question",
          name: "How accurate is the AI lead scoring?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LeadVett uses GPT-4 combined with a rule engine analyzing budget, urgency, authority, and pain signals. In testing with 500+ real leads, it matched or beat human qualification 94% of the time.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://leadvett.com/#org",
      name: "LeadVett",
      url: "https://leadvett.com",
      logo: "https://leadvett.com/images/leadicon.png",
      sameAs: [
        "https://twitter.com/leadvett",
        "https://www.instagram.com/leadvett",
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${interTight.variable}`}>
      <head>
        <meta name="google-site-verification" content="Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
        <SpeedInsights />
        {children}
      </body>
    </html>
  )
}