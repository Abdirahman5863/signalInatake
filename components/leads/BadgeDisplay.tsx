import { Badge } from '@/components/ui/badge'

interface BadgeDisplayProps {
  badge: string | null
  reasoning?: string | null
}

export function BadgeDisplay({ badge, reasoning }: BadgeDisplayProps) {
  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'Silver':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white'
      case 'Bronze':
        return 'bg-orange-500 hover:bg-orange-600 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Qualification Badge</h3>
        {badge ? (
          <Badge className={`${getBadgeColor(badge)} text-lg px-4 py-2`}>
            {badge}
          </Badge>
        ) : (
          <Badge className="bg-gray-500 text-white text-lg px-4 py-2">
            Pending Analysis
          </Badge>
        )}
      </div>
      {reasoning && (
        <div>
          <h3 className="text-sm font-medium mb-2">AI Reasoning</h3>
          <div className="rounded-md border bg-muted/50 p-4 text-sm">
            <p className="whitespace-pre-wrap">{reasoning}</p>
          </div>
        </div>
      )}
    </div>
  )
}

