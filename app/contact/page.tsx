import { ContactPageClient } from "@/components/Contactclient"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LeadVett team. Email us at contact@leadvett.com or DM us on Instagram @leadvett.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return <ContactPageClient />
}