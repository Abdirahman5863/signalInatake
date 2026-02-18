'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ExternalLink, Copy, Check, Edit, Trash2 } from 'lucide-react'

interface Form {
  id: string
  form_name: string
  share_link: string
  created_at: string
}

interface FormsListProps {
  forms: Form[]
}

export function FormsList({ forms }: FormsListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyLink = async (shareLink: string, formId: string) => {
    const fullUrl = `${window.location.origin}/intake/${shareLink}`
    await navigator.clipboard.writeText(fullUrl)
    setCopiedId(formId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!forms || forms.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Forms</h2>
        <Link
          href="/dashboard/forms/new"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Form
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2 text-lg">{form.form_name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Created {new Date(form.created_at).toLocaleDateString()}
            </p>
            
            {/* Form Link Display */}
            <div className="bg-muted rounded-md p-3 mb-3">
              <p className="text-xs text-muted-foreground mb-1">Form Link:</p>
              <p className="text-xs font-mono truncate">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/intake/${form.share_link}`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCopyLink(form.share_link, form.id)}
                className="flex items-center justify-center gap-2 rounded-md bg-[#b5944b] px-4 py-2 text-sm font-medium text-white hover:bg-[#9a7a3d] transition-colors"
              >
                {copiedId === form.id ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <Link
                  href={`/intake/${form.share_link}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Preview
                </Link>
                <Link
                  href={`/dashboard/forms/${form.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}