'use client'

import { Gauge } from '@tc96/ui/gauge'
import { type ReactElement, type ReactNode, useId } from 'react'

export interface ShellUsage {
  action?: ReactNode
  description?: string
  label: string
  max: number
  value: number
  valueLabel: string
}

export interface UsageCardProps {
  usage: ShellUsage
}

export function UsageCard({ usage }: Readonly<UsageCardProps>): ReactElement {
  const labelId = useId()
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-sidebar-accent p-3 text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
      <div className="flex flex-col gap-2">
        <span className="font-medium text-xs" id={labelId}>
          {usage.label}
        </span>
        <Gauge
          aria-labelledby={labelId}
          getAriaValueText={() => usage.valueLabel}
          max={usage.max}
          value={usage.value}
        />
        <span className="text-xs tabular-nums">{usage.valueLabel}</span>
      </div>
      {usage.description ? (
        <p className="text-xs">{usage.description}</p>
      ) : null}
      {usage.action}
    </div>
  )
}
