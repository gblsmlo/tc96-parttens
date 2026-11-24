import { getInitials } from '@tc96/ui/helpers/initials'
import { List } from '@tc96/ui/patterns/list/composition/list/list'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Amount } from '@tc96/ui/patterns/widgets/shared/amount'
import { TrendIndicator } from '@tc96/ui/patterns/widgets/shared/trend-indicator'
import { cn } from '@tc96/utils'
import { listLoadState } from '../shared/list-load-state'
import { defaultList1Labels } from './labels'
import { List1Skeleton } from './list-1-skeleton'
import type { List1Metric, List1Props } from './types'

function amountFormat(
  kind: List1Metric['kind'],
  currency: string,
  locale: string,
) {
  if (kind === 'currency')
    return { currency, locale, style: 'currency' as const }
  if (kind === 'percent')
    return { locale, maximumFractionDigits: 1, style: 'percent' as const }
  return { locale, style: 'decimal' as const }
}

export function List1({
  error,
  onRetry,
  pending,
  className,
  currency = 'BRL',
  labels: labelsProp,
  locale = 'pt-BR',
  metrics,
}: Readonly<List1Props>) {
  const labels = { ...defaultList1Labels, ...labelsProp }
  const loadState = listLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <List1Skeleton label={labels.loading} />,
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
    <ul
      aria-label={labels.title}
      className={cn('grid list-none gap-2', className)}
    >
      {metrics.map((metric) => (
        <List
          actions={
            <span className="flex items-center gap-3">
              <Amount
                className="font-medium text-sm"
                format={amountFormat(metric.kind, currency, locale)}
                value={metric.value}
              />
              {metric.change === undefined ? null : (
                <TrendIndicator
                  format={{
                    locale,
                    maximumFractionDigits: 1,
                    style: 'percent',
                  }}
                  labels={labels.trend}
                  value={metric.change}
                />
              )}
            </span>
          }
          description={metric.description}
          icon={
            metric.icon ?? (
              <span className="font-medium text-xs">
                {getInitials(metric.name)}
              </span>
            )
          }
          key={metric.id}
          render={<li data-metric={metric.id} />}
          title={metric.name}
        />
      ))}
    </ul>
  )
}
