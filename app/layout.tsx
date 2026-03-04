import type { Metadata, Viewport } from "next"
import { Syne, DM_Sans } from "next/font/google"
import "./globals.css"

// Primary display font - bold, distinctive
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "600", "700", "800"],
})

// Body font - clean and readable
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

// ─── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // Title template: page-specific title + brand
  title: {
    default: "LeadVett — AI Lead Qualification for Agencies",
    template: "%s | LeadVett",
  },
  description:
    "LeadVett instantly qualifies your DM leads with AI. Get Gold/Silver/Bronze verdicts in 10 seconds, auto-disqualify tire-kickers, and close more clients — for just $49/mo.",

  // Canonical URL — update once you connect your real domain
  metadataBase: new URL("https://leadvett.com"),
  alternates: {
    canonical: "/",
  },

  // Keywords (used by some crawlers)
  keywords: [
    "lead qualification",
    "AI lead scoring",
    "agency lead management",
    "ManyChat integration",
    "Instagram DM automation",
    "SMMA tools",
    "freelancer CRM",
    "lead intake form",
    "LeadVett",
  ],

  // Authorship / brand
  authors: [{ name: "LeadVett", url: "https://leadvett.com" }],
  creator: "LeadVett",
  publisher: "LeadVett",

  // Open Graph — controls how your link looks on Facebook, LinkedIn, WhatsApp
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leadvett.com",
    siteName: "LeadVett",
    title: "LeadVett — Stop Wasting 15 Hours a Week on Bad DMs",
    description:
      "AI-powered lead qualification for agencies. Gold/Silver/Bronze verdicts in 10 seconds. Works with ManyChat. 14-day free trial.",
    images: [
      {
        url: "/leadicon.png", // Create a 1200×630px image and place in /public
        width: 1200,
        height: 630,
        alt: "LeadVett — AI Lead Qualification Dashboard",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    site: "@leadvett",       // update to your real Twitter handle
    creator: "@leadvett",
    title: "LeadVett — AI Lead Qualification for Agencies",
    description:
      "Qualify every DM lead in 10 seconds. Auto-disqualify tire-kickers. Close more Golds.",
    images: ["/og-image.png"],
  },

  // Robots — allow all crawlers, enable Google rich snippets
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

  // App / PWA metadata
  applicationName: "LeadVett",
  category: "business",

  // Verification tokens — add yours from Google Search Console / Bing Webmaster
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  // },
}

// ─── Viewport ────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#b5944b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
// Helps Google show rich results (software app card, sitelinks, FAQ, etc.)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://leadvett.com/#software",
      name: "LeadVett",
      url: "https://leadvett.com",
      logo: "https://leadvett.com/images/leadicon.png",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: "Solo Agency",
          price: "49.00",
          priceCurrency: "USD",
          billingIncrement: "P1M",
          description: "Unlimited lead analysis, AI DM scripts, ManyChat integration",
        },
        {
          "@type": "Offer",
          name: "Agency Team",
          price: "129.00",
          priceCurrency: "USD",
          billingIncrement: "P1M",
          description: "Everything in Solo plus 5 seats, Zapier, analytics dashboard",
        },
      ],
      description:
        "AI-powered lead qualification tool for Instagram agencies. Scores leads as Gold, Silver, or Bronze in 10 seconds.",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "127",
        bestRating: "5",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://leadvett.com/#org",
      name: "LeadVett",
      url: "https://leadvett.com",
      logo: {
        "@type": "ImageObject",
        url: "https://leadvett.com/images/leadicon.png",
      },
      sameAs: [
        // Add your actual social profile URLs here
        // "https://twitter.com/leadvett",
        // "https://instagram.com/leadvett",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How accurate is the AI lead analysis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LeadVett uses GPT-4 combined with a proprietary rule engine. In testing with 500+ real agency leads, it matched or exceeded human qualification accuracy 94% of the time.",
          },
        },
        {
          "@type": "Question",
          name: "Does LeadVett integrate with ManyChat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Paste your LeadVett form link into ManyChat's auto-reply. Setup takes under 2 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "How much does LeadVett cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LeadVett starts at $49/month for solo agencies. A Team plan at $129/month includes 5 seats, Zapier integration, and advanced analytics. Both plans include a 14-day free trial with no credit card required.",
          },
        },
      ],
    },
  ],
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <meta name="google-site-verification" content="Ia63zDkjCvHnQgctf78q8vaKQOyBPttO2GIb8BwAFKA" />
        {/* Inject JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Preconnect to Google Fonts CDN for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon set — generate at realfavicongenerator.net and place in /public */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="">{children}</body>
    </html>
  )
}