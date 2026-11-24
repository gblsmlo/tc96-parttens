import type { AmountFormatOptions } from '@tc96/ui/helpers/format'
import { AreaMetricWidget } from '@tc96/ui/patterns/stats/area-metric-widget'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { statsLoadState } from '../shared/stats-load-state'
import { defaultStats7Labels } from './labels'
import { Stats7Skeleton } from './stats-7-skeleton'
import type { Stats7Props, Stats7ValueKind } from './types'

const metricFormat = (
  kind: Stats7ValueKind,
  locale: string,
  currency: string,
): AmountFormatOptions =>
  kind === 'currency'
    ? {
        currency,
        locale,
        maximumFractionDigits: 1,
        notation: 'compact',
        style: 'currency',
      }
    : kind === 'percent'
      ? { locale, maximumFractionDigits: 1, style: 'percent' }
      : { locale, maximumFractionDigits: 0, style: 'decimal' }

export function Stats7({
  className,
  currency = 'BRL',
  error,
  labels: labelsProp,
  locale = 'pt-BR',
  metrics,
  onRetry,
  pending,
}: Readonly<Stats7Props>) {
  const labels = { ...defaultStats7Labels, ...labelsProp }
  const loadState = statsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Stats7Skeleton label={labels.loading} />,
  })

  if (loadState)
    return (
      <section aria-label={labels.title} className={className}>
        {loadState}
      </section>
    )

  if (metrics.length === 0) {
    return (
      <StateSurface
        className={className}
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  }

  return (
    <section aria-label={labels.title} className={className}>
      <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <li className="min-w-0" key={metric.id}>
            <AreaMetricWidget
              caption={metric.caption}
              color={`var(--chart-${(index % 5) + 1})`}
              data-stat={metric.id}
              format={metricFormat(metric.kind ?? 'number', locale, currency)}
              label={metric.label}
              points={metric.points}
              value={metric.value}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
