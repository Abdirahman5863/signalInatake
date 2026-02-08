export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-96 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border bg-card"
          />
        ))}
      </div>
    </div>
  )
}

