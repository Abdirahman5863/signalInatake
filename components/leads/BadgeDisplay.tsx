'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react'

interface BadgeDisplayProps {
  badge: string | null
  strengths?: string[]
  risks?: string[]
  dmScript?: string
  summary?: string
}

export function BadgeDisplay({ badge, strengths, risks, dmScript, summary }: BadgeDisplayProps) {
  const [copied, setCopied] = useState(false)

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

  const getBadgeAction = (badge: string | null) => {
    switch (badge) {
      case 'Gold':
        return '→ Call within 2 hours'
      case 'Silver':
        return '→ Nurture, check back later'
      case 'Bronze':
        return '→ Ignore or archive'
      default:
        return '→ Analysis pending'
    }
  }

  const handleCopyScript = async () => {
    if (dmScript) {
      await navigator.clipboard.writeText(dmScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">AI Verdict</h3>
        <div className="flex items-center gap-3">
          <Badge className={`${getBadgeColor(badge)} text-lg px-4 py-2`}>
            {badge || 'Pending'}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground">
            {getBadgeAction(badge)}
          </span>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <p className="text-sm text-muted-foreground italic border-l-4 border-primary pl-3">
            "{summary}"
          </p>
        </div>
      )}

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4" />
            Strengths (The 'Yes' Signals)
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {risks && risks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-orange-600 flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4" />
            Risks (The 'Red' Flags)
          </h3>
          <ul className="space-y-2">
            {risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 mt-0.5">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DM Script */}
      {dmScript && (
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">AI-Generated Reply</h3>
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy Script
                </>
              )}
            </button>
          </div>
          <p className="text-sm bg-background rounded-md p-3 font-mono">
            {dmScript}
          </p>
          <p className="text-xs text-muted-foreground">
            Click to copy this script and paste directly into your DM
          </p>
        </div>
      )}
    </div>
  )
}