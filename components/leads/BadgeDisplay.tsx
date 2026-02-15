'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Shield, XCircle } from 'lucide-react'

interface RuleScore {
  rule: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  explanation: string
}

interface BadgeDisplayProps {
  badge: string | null
  strengths?: string[]
  risks?: string[]
  dmScript?: string
  summary?: string
  action?: string
  ruleBreakdown?: RuleScore[]
  hardRuleTriggered?: string
}

export function BadgeDisplay({ 
  badge, 
  strengths, 
  risks, 
  dmScript, 
  action,
  ruleBreakdown,
  hardRuleTriggered
}: BadgeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      case 'Silver':
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
      case 'Bronze':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
      case 'Rejected':
        return 'bg-gradient-to-r from-red-600 to-red-800 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleCopyScript = async () => {
    if (dmScript) {
      await navigator.clipboard.writeText(dmScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // HARD REJECT MODE
  if (hardRuleTriggered) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-8 text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            ⛔ AUTO DISQUALIFIED
          </h2>
          <p className="text-red-700 font-medium mb-4">
            {hardRuleTriggered}
          </p>
          <p className="text-sm text-red-600">
            This lead has been automatically archived and removed from your active pipeline.
          </p>
        </div>

        {/* Still show breakdown for transparency */}
        {ruleBreakdown && ruleBreakdown.length > 0 && (
          <div className="border-2 border-red-200 rounded-lg overflow-hidden opacity-60">
            <button
              onClick={() => setShowRules(!showRules)}
              className="w-full bg-red-50 px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-900 text-sm">
                  Why Disqualified ({ruleBreakdown.length} rules)
                </span>
              </div>
              {showRules ? (
                <ChevronUp className="h-4 w-4 text-red-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-red-600" />
              )}
            </button>

            {showRules && (
              <div className="bg-white p-4 space-y-2">
                {ruleBreakdown.map((rule, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200"
                  >
                    <span className="text-lg">❌</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-red-900">
                        {rule.rule}
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {rule.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // NORMAL FLOW - STREAMLINED
  return (
    <div className="space-y-6">
      {/* SECTION 1: VERDICT (Badge + Action) */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 p-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          AI Verdict
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Badge className={`${getBadgeColor(badge)} text-xl px-6 py-3 w-fit shadow-lg`}>
            {badge === 'Gold' && '🔥'} {badge || 'Pending'}
          </Badge>
          {action && (
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">
                → {action}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: BREAKDOWN (Collapsible Rules) */}
      {ruleBreakdown && ruleBreakdown.length > 0 && (
        <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowRules(!showRules)}
            className="w-full bg-blue-50 px-6 py-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <span className="font-bold text-blue-900 text-base block">
                  Decision Breakdown
                </span>
                <span className="text-xs text-blue-700">
                  {ruleBreakdown.length} rules evaluated
                </span>
              </div>
            </div>
            {showRules ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </button>

          {showRules && (
            <div className="bg-white p-6 space-y-3">
              {ruleBreakdown.map((rule, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                    rule.impact === 'positive' 
                      ? 'bg-green-50 border-green-200' 
                      : rule.impact === 'negative'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-xl">
                    {rule.impact === 'positive' ? '✅' : rule.impact === 'negative' ? '❌' : '➖'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">
                        {rule.rule}
                      </p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        rule.weight > 0 
                          ? 'bg-green-200 text-green-800' 
                          : rule.weight < 0
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {rule.weight > 0 ? '+' : ''}{rule.weight}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {rule.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: WATCHOUTS (Risks Only - Removed Strengths) */}
      {risks && risks.length > 0 && (
        <div className="rounded-xl bg-orange-50 border-2 border-orange-200 p-6">
          <h3 className="text-base font-bold text-orange-900 flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5" />
            Watch For
          </h3>
          <ul className="space-y-3">
            {risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-orange-900">
                <span className="text-lg flex-shrink-0">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECTION 4: SCRIPT (The Money Maker) */}
      {dmScript && (
        <div className="rounded-2xl border-2 border-[#b5944b]/30 bg-gradient-to-br from-[#b5944b]/5 to-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                One-Click Closer
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Copy → Paste into DM → Close deal
              </p>
            </div>
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-md"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Script
                </>
              )}
            </button>
          </div>
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
            <p className="text-sm text-gray-800 leading-relaxed font-mono whitespace-pre-wrap">
              {dmScript}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
