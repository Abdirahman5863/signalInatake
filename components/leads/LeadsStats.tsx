import { TrendingUp, Users, Award, XCircle } from 'lucide-react'

interface LeadsStatsProps {
  leads: any[]
}

export function LeadsStats({ leads }: LeadsStatsProps) {
  const goldCount = leads.filter(l => l.badge === 'Gold').length
  const silverCount = leads.filter(l => l.badge === 'Silver').length
  const bronzeCount = leads.filter(l => l.badge === 'Bronze').length
  const rejectedCount = leads.filter(l => l.badge === 'Rejected' || l.hard_rule_triggered).length
  const totalCount = leads.length

  const conversionRate = totalCount > 0 
    ? Math.round((goldCount / totalCount) * 100)
    : 0

  const avgConfidence = leads.length > 0
    ? Math.round(leads.reduce((sum, l) => sum + (l.confidence_score || 0), 0) / leads.length)
    : 0

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
      {/* Total Leads */}
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-blue-600" />
          <p className="text-xs sm:text-sm text-gray-600">Total Leads</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold">{totalCount}</p>
        <p className="text-xs text-gray-500 mt-1">
          {leads.filter(l => {
            const today = new Date()
            const leadDate = new Date(l.created_at)
            const diffTime = Math.abs(today.getTime() - leadDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 7
          }).length} this week
        </p>
      </div>

      {/* Gold Leads */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-green-600" />
          <p className="text-xs sm:text-sm text-green-700 font-medium">Gold Leads</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-green-700">{goldCount}</p>
        <p className="text-xs text-green-600 mt-1">
          {conversionRate}% conversion rate
        </p>
      </div>

      {/* Pipeline Health */}
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <p className="text-xs sm:text-sm text-gray-600">Avg Confidence</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold">{avgConfidence}%</p>
        <div className="flex gap-2 mt-2 text-xs">
          <span className="text-yellow-600">{silverCount} Silver</span>
          <span className="text-orange-600">{bronzeCount} Bronze</span>
        </div>
      </div>

      {/* Rejected */}
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <p className="text-xs sm:text-sm text-gray-600">Auto-Rejected</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-red-600">{rejectedCount}</p>
        <p className="text-xs text-gray-500 mt-1">
          {totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0}% filtered out
        </p>
      </div>
    </div>
  )
}