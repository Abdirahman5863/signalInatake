"use client"

import { useState, useEffect } from "react"
import { X, Mail, Instagram, MessageSquare } from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function  ContactPageClient ({ isOpen, onClose }: ContactModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            Need Help?
          </h2>
          <p className="text-sm text-gray-500">
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <a
            href="mailto:contact@leadvett.com"
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-[#b5944b] hover:bg-amber-50 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#b5944b] rounded-full flex items-center justify-center transition-colors flex-shrink-0">
              <Mail className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Send an Email</p>
              <p className="text-gray-500 text-xs">contact@leadvett.com</p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/leadvett"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-pink-400 hover:bg-pink-50 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-600 rounded-full flex items-center justify-center transition-all flex-shrink-0">
              <Instagram className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">DM on Instagram</p>
              <p className="text-gray-500 text-xs">@leadvett</p>
            </div>
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          We typically respond within 24 hours
        </p>
      </div>
    </div>
  )
}

// Standalone trigger button — drop this anywhere you want a "Contact" link
export function ContactTrigger() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Contact
      </button>
      <ContactPageClient isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}