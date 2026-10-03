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

const radius = 42
const circumference = 2 * Math.PI * radius

export function ProgressRing({
  children,
  className,
  empty = false,
  ratio,
  strokeWidth = 10,
  ...props
}: Readonly<ProgressRingProps>): ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn('relative size-10 shrink-0', className)}
      data-empty={empty ? 'true' : undefined}
      data-slot="progress-ring"
      {...props}
    >
      <svg
        aria-hidden="true"
        className="-rotate-90 size-full"
        viewBox="0 0 100 100"
      >
        <circle
          className={empty ? 'stroke-input' : 'stroke-muted'}
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          strokeDasharray={empty ? '6 10' : undefined}
          strokeWidth={strokeWidth}
        />
        {empty ? null : (
          <circle
            className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            cx="50"
            cy="50"
            fill="none"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference * (1 - Math.min(Math.max(ratio, 0), 1))
            }
            strokeLinecap="round"
            strokeWidth={strokeWidth}
          />
        )}
      </svg>
      {children ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </span>
      ) : null}
    </div>
  )
}
