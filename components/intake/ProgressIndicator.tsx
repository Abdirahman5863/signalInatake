export function ProgressIndicator({
  current,
  total,
}: {
  current: number
  total: number
}) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

