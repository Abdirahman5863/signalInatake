import Link from 'next/link'
import { Plus } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No intake forms yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first intake form to start qualifying leads automatically
        with AI.
      </p>
      <Link
        href="/dashboard/forms/new"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Create Form
      </Link>
    </div>
  )
}

