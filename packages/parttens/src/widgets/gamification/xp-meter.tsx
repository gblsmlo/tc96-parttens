import { Gauge } from '@tc96/ui/gauge'
import type { ReactElement } from 'react'

export function XpMeter({
  'aria-label': ariaLabel,
  className,
  current,
  target,
}: Readonly<{
  'aria-label': string
  className?: string
  current: number
  target: number
}>): ReactElement {
  return (
    <Gauge
      aria-label={ariaLabel}
      className={className}
      data-slot="xp-meter"
      max={Math.max(target, 1)}
      value={Math.max(current, 0)}
    />
  )
}
