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
const DEFAULT_TITLE = "Website Project Qualification — LeadVett"

// 149 chars — answers search intent, includes target keywords
const DEFAULT_DESCRIPTION =
  "Qualify website project enquiries before discovery. Compare budget, timing and scope with your web studio’s criteria, and clarify what is missing."

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
        "Rule-based website project qualification",
        "Gold, Silver, Bronze lead verdicts",
        "Custom qualification intake forms",
        "Lead pipeline dashboard",
        "Pre-written outreach scripts",
        "Shareable public intake links",
      ],
      offers: {
        "@type": "Offer",
        name: "LeadVett Free",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/signup`,
        description: "Free lead qualification forms, explainable verdicts, and lead workflow tools.",
      },
      description:
        "LeadVett helps independent web studios compare website enquiries with their project criteria and decide what to clarify before discovery.",
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
