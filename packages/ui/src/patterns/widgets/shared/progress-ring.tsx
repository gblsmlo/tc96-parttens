import { GaugeRing } from '@tc96/ui/gauge'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export interface ProgressRingProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  children?: ReactNode
  empty?: boolean
  ratio: number
  strokeWidth?: number
}

export function clampRatio(current: number, target: number): number {
  return target > 0 ? Math.min(Math.max(current / target, 0), 1) : 0
}

export function ProgressRing({
  children,
  className,
  empty = false,
  ratio,
  strokeWidth = 10,
  ...props
}: Readonly<ProgressRingProps>): ReactElement {
  return (
    <GaugeRing
      className={cn('size-10', className)}
      data-slot="progress-ring"
      empty={empty}
      ratio={ratio}
      strokeWidth={strokeWidth}
      {...props}
    >
      {children}
    </GaugeRing>
  )
}
