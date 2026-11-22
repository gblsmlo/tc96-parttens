'use client'

import { Meter, MeterIndicator, MeterLabel, MeterTrack } from '@tc96/ui/meter'
import type { ReactElement, ReactNode } from 'react'

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
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-sidebar-accent p-3 text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
      <Meter
        getAriaValueText={() => usage.valueLabel}
        max={usage.max}
        value={usage.value}
      >
        <MeterLabel className="text-xs">{usage.label}</MeterLabel>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
        <span className="text-xs tabular-nums">{usage.valueLabel}</span>
      </Meter>
      {usage.description ? (
        <p className="text-xs">{usage.description}</p>
      ) : null}
      {usage.action}
    </div>
  )
}
