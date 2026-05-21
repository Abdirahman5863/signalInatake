import type { Metadata, Viewport } from "next"
import { Outfit, Inter_Tight } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"

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

const SITE_URL = "https://leadvett.com"
const SITE_NAME = "LeadVett"

// 52 chars — primary keyword first, brand last
const DEFAULT_TITLE = "Lead Qualification Tool for Agencies — LeadVett"

// 149 chars — answers search intent, includes target keywords
const DEFAULT_DESCRIPTION =
  "Qualify every inbound lead in 10 seconds. LeadVett scores leads Gold, Silver, or Bronze so agencies only book calls with buyers. Free 3-day trial."

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: "%s | LeadVett",
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  authors: [{ name: "Abdirahman Abdi", url: SITE_URL }],
  creator: "Abdirahman Abdi",
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeadVett — Lead Qualification Tool for Agencies",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@leadvett",
    creator: "@abdirahman5863",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
  applicationName: SITE_NAME,
  category: "business",
  verification: {
    google: "Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA",
  },
}

export const viewport: Viewport = {
  themeColor: "#C9920A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "LeadVett",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      featureList: [
        "AI lead scoring in 10 seconds",
        "Gold, Silver, Bronze lead verdicts",
        "Custom qualification intake forms",
        "Lead pipeline dashboard",
        "Pre-written outreach scripts",
        "ManyChat and Instagram bio integration",
      ],
      offers: {
        "@type": "Offer",
        name: "LeadVett Pro",
        price: "49.00",
        priceCurrency: "USD",
        priceValidUntil: "2027-01-01",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/signup`,
        description: "Full AI lead qualification engine. Unlimited leads. 3-day free trial.",
      },
      description:
        "LeadVett is an AI-powered lead qualification tool for digital marketing agencies. It scores every inbound lead in 10 seconds — Gold (book the call), Silver (nurture first), or Bronze (not worth your time).",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a lead qualification tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A lead qualification tool automatically scores your inbound leads based on budget, timeline, decision authority, and urgency. Instead of manually reviewing every inquiry, it tells you which leads are worth a call (Gold), which need nurturing (Silver), and which to skip (Bronze). LeadVett scores every lead in 10 seconds.",
          },
        },
        {
          "@type": "Question",
          name: "How do you qualify inbound leads automatically?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To qualify inbound leads automatically: (1) Create a short intake form with 3-5 questions about budget, timeline, and decision authority. (2) Share the form link instead of your Calendly. (3) When a lead submits, AI scores them instantly. LeadVett does this in under 10 seconds, before leads touch your calendar.",
          },
        },
        {
          "@type": "Question",
          name: "How is LeadVett different from a regular contact form?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A contact form just collects data. LeadVett analyzes every answer, scores buying intent from 0-100%, assigns a Gold, Silver, or Bronze badge, flags risks, and writes a personalized outreach script. It is a decision engine, not a form.",
          },
        },
        {
          "@type": "Question",
          name: "Does LeadVett work with ManyChat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Paste your LeadVett form link into your ManyChat auto-reply and you are live in under 2 minutes. When a lead fills the form, you get an instant AI verdict in your dashboard. No developer needed.",
          },
        },
        {
          "@type": "Question",
          name: "How much does LeadVett cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LeadVett costs $49 per month with a 3-day free trial. No credit card required to start. Cancel anytime.",
          },
        },
        {
          "@type": "Question",
          name: "Do leads need to create an account to fill the qualification form?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Leads just click the link, answer 5 questions, and submit. Zero signup required. It takes under 60 seconds and works on mobile.",
          },
        },
      ],
    },
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
        availableLanguage: "English",
      },
      sameAs: [
        "https://twitter.com/leadvett",
        "https://www.instagram.com/awsaam_abdi",
        "https://www.linkedin.com/company/leadvett",
        "https://webcatalog.io/en/apps/leadvett",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${interTight.variable}`}>
      <head>
        <meta name="google-site-verification" content="Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="language" content="English" />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
        <SpeedInsights />
        {children}
      </body>
    </html>
  )
}