'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
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

export function FormsList({ forms: initialForms }: FormsListProps) {
  const router = useRouter()
  const [forms, setForms] = useState(initialForms)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleCopyLink = async (shareLink: string, formId: string) => {
    const fullUrl = `${window.location.origin}/intake/${shareLink}`
    await navigator.clipboard.writeText(fullUrl)
    setCopiedId(formId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (formId: string) => {
    setDeletingId(formId)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Delete the form (cascade will delete associated leads)
      const { error } = await supabase
        .from('intake_forms')
        .delete()
        .eq('id', formId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setForms(forms.filter(f => f.id !== formId))
      setShowDeleteConfirm(null)
      
      // Refresh the page to update counts
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting form:', err)
      alert(`Failed to delete form: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
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
                {typeof window !== 'undefined' 
                  ? `${window.location.origin}/intake/${form.share_link}`
                  : `intake/${form.share_link}`
                }
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

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href={`/intake/${form.share_link}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  title="Preview form"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href={`/dashboard/forms/${form.id}/edit`}
                  className="flex items-center justify-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  title="Edit form"
                >
                  <Edit className="h-3 w-3" />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(form.id)}
                  disabled={deletingId === form.id}
                  className="flex items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete form"
                >
                  {deletingId === form.id ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm === form.id && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    Delete Form?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete "<strong>{form.form_name}</strong>"? 
                    This will also delete all associated lead responses. This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      disabled={deletingId === form.id}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(form.id)}
                      disabled={deletingId === form.id}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {deletingId === form.id ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Delete Form
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}