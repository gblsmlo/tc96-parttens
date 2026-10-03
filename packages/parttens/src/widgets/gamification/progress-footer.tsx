import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { MetricPill, type MetricPillTone } from '../shared/metric-pill'
import { clampRatio, ProgressRing } from '../shared/progress-ring'

export interface ProgressFooterMetric {
  icon: ReactNode
  id: string
  tone?: MetricPillTone
  value: ReactNode
}

export interface ProgressFooterScore {
  display: ReactNode
  max: number
  srLabel: string
  value: number | null
}

export interface ProgressFooterProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  metrics: readonly ProgressFooterMetric[]
  score: ProgressFooterScore
}

export function ProgressFooter({
  className,
  metrics,
  score,
  ...props
}: Readonly<ProgressFooterProps>): ReactElement {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 text-sm',
        className,
      )}
      data-widget="progress-footer"
      {...props}
    >
      <ul className="flex min-w-0 items-center gap-2">
        {metrics.map((metric) => (
          <MetricPill
            as="li"
            className="min-w-0"
            key={metric.id}
            {...(metric.tone ? { tone: metric.tone } : {})}
          >
            {metric.icon}
            <span className="truncate">{metric.value}</span>
          </MetricPill>
        ))}
      </ul>
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-2 font-medium tabular-nums',
          score.value === null && 'text-muted-foreground',
        )}
        data-slot="progress-footer-score"
      >
        <ProgressRing
          className="size-7"
          empty={score.value === null}
          ratio={score.value === null ? 0 : clampRatio(score.value, score.max)}
          strokeWidth={12}
        />
        {score.display}
        {score.value === null ? null : (
          <span className="sr-only"> {score.srLabel}</span>
        )}
      </span>
    </div>
  )
}
