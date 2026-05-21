import { MetadataRoute } from "next"

// Last updated dates — update these when you change the pages
const TODAY = new Date()
const LAST_MONTH = new Date("2026-04-01")

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://leadvett.com"

  return [
    // ── Priority 1.0 — Homepage ────────────────────────────────────────────
    // Most important page. Weekly because content changes regularly.
    {
      url: base,
      lastModified: TODAY,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // ── Priority 0.9 — High-intent conversion pages ────────────────────────
    // People searching "lead qualification tool" land here and sign up.
    {
      url: `${base}/signup`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // ── Priority 0.8 — SEO landing pages (ADD THESE AS YOU CREATE THEM) ───
    // Each targets a specific keyword Google will rank you for.
    // Create these pages in your Next.js app and uncomment each line.

    // {
    //   url: `${base}/blog/how-to-qualify-inbound-leads`,
    //   lastModified: new Date("2026-05-20"),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${base}/blog/lead-scoring-software-for-agencies`,
    //   lastModified: new Date("2026-05-18"),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${base}/blog/manychat-lead-qualification`,
    //   lastModified: new Date("2026-05-15"),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${base}/blog/best-lead-qualification-tools-2026`,
    //   lastModified: new Date("2026-05-10"),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },

    // ── Priority 0.7 — Supporting pages ───────────────────────────────────
    {
      url: `${base}/about`,
      lastModified: LAST_MONTH,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: LAST_MONTH,
      changeFrequency: "yearly",
      priority: 0.6,
    },

    // ── Priority 0.5 — Utility pages ──────────────────────────────────────
    // Low priority — Google should index these but not prioritize them.
    {
      url: `${base}/login`,
      lastModified: LAST_MONTH,
      changeFrequency: "monthly",
      priority: 0.5,
    },

    // ── Priority 0.2 — Legal pages ─────────────────────────────────────────
    // Google indexes these but they don't help ranking.
    // Low priority keeps crawl budget on your important pages.
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]
}