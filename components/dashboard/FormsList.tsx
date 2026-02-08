import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, ExternalLink } from 'lucide-react'

export async function FormsList() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: forms, error } = await supabase
    .from('intake_forms')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="text-destructive">Error loading forms: {error.message}</div>
    )
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
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h3 className="font-semibold mb-2">{form.form_name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Created {new Date(form.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/intake/${form.share_link}`}
                target="_blank"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View Form
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

