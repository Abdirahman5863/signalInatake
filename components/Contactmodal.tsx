"use client"

import Link from "next/link"
import { Mail, Instagram, ArrowLeft } from "lucide-react"

const heading = { fontFamily: "var(--font-outfit), sans-serif" }

export function ContactTrigger() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to LeadVett
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3" style={heading}>
              Get in Touch
            </h1>
            <p className="text-gray-600">
              Have a question about LeadVett? We&apos;re here to help.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:contact@leadvett.com"
              className="flex items-center gap-5 p-5 rounded-2xl border-2 border-gray-200 hover:border-[#b5944b] hover:bg-amber-50 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#b5944b] rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                <Mail className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-bold text-gray-900" style={heading}>Send an Email</p>
                <p className="text-gray-500 text-sm">contact@leadvett.com</p>
                <p className="text-gray-400 text-xs mt-0.5">We reply within 24 hours</p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/leadvett"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-5 rounded-2xl border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-600 rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                <Instagram className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-bold text-gray-900" style={heading}>DM on Instagram</p>
                <p className="text-gray-500 text-sm">@leadvett</p>
                <p className="text-gray-400 text-xs mt-0.5">Usually respond same day</p>
              </div>
            </a>
          </div>

          <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">Ready to stop wasting time on bad leads?</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-all"
            >
              Start 3-Day Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-6 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} LeadVett ·{" "}
          <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-gray-800">Terms</Link>
        </p>
      </footer>
    </div>
  )
}