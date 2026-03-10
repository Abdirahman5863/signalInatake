import type { Metadata, Viewport } from "next"
import { Outfit, Inter_Tight } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
// ─── Fonts ────────────────────────────────────────────────────────────────────
// Headings: Outfit — geometric, sharp, confident. Used by fintech & SaaS brands.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

// Body: Inter Tight — ultra-clean, professional, highly readable at small sizes.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

// ─── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "LeadVett — AI Lead Qualification for Agencies",
    template: "%s | LeadVett",
  },
  description:
    "LeadVett instantly qualifies your DM leads with AI. Get Gold/Silver/Bronze verdicts in 10 seconds, auto-disqualify tire-kickers, and close more clients — for just $49/mo.",
  metadataBase: new URL("https://leadvett.com"),
  alternates: { canonical: "/" },
  keywords: [
    "lead qualification", "AI lead scoring", "agency lead management",
    "ManyChat integration", "Instagram DM automation", "SMMA tools",
    "freelancer CRM", "lead intake form", "LeadVett",
  ],
  authors: [{ name: "LeadVett", url: "https://leadvett.com" }],
  creator: "LeadVett",
  publisher: "LeadVett",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leadvett.com",
    siteName: "LeadVett",
    title: "LeadVett — Stop Wasting 15 Hours a Week on Bad DMs",
    description: "AI-powered lead qualification for agencies. Gold/Silver/Bronze verdicts in 10 seconds. Works with ManyChat. 14-day free trial.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LeadVett — AI Lead Qualification Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@leadvett",
    creator: "@leadvett",
    title: "LeadVett — AI Lead Qualification for Agencies",
    description: "Qualify every DM lead in 10 seconds. Auto-disqualify tire-kickers. Close more Golds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
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
        { "@type": "Offer", name: "Solo Agency", price: "49.00", priceCurrency: "USD" },
        { "@type": "Offer", name: "Agency Team", price: "129.00", priceCurrency: "USD" },
      ],
      description: "AI-powered lead qualification tool for Instagram agencies.",
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "127", bestRating: "5" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How accurate is the AI lead analysis?", acceptedAnswer: { "@type": "Answer", text: "LeadVett uses GPT-4 combined with a proprietary rule engine, matching human accuracy 94% of the time." } },
        { "@type": "Question", name: "Does LeadVett integrate with ManyChat?", acceptedAnswer: { "@type": "Answer", text: "Yes. Paste your form link into ManyChat's auto-reply. Setup takes under 2 minutes." } },
        { "@type": "Question", name: "How much does LeadVett cost?", acceptedAnswer: { "@type": "Answer", text: "LeadVett starts at $49/month. Team plan is $129/month. Both include a 14-day free trial, no credit card required." } },
      ],
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="antialiased" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
        <SpeedInsights/>
        {children}
      </body>
    </html>
  )
}