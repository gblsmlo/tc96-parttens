import { MeterPrimitive } from '@tc96/ui/meter'
import { cn } from '@tc96/utils'
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
    <MeterPrimitive.Root
      aria-label={ariaLabel}
      className={cn('block', className)}
      data-slot="xp-meter"
      max={Math.max(target, 1)}
      min={0}
      value={Math.min(Math.max(current, 0), Math.max(target, 1))}
    >
      <MeterPrimitive.Track className="block h-2 overflow-hidden rounded-full bg-muted">
        <MeterPrimitive.Indicator className="block h-full rounded-full bg-primary transition-[width] duration-500" />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  )
}
