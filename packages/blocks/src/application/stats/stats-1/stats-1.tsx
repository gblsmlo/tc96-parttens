import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Amount } from '@tc96/parttens/widgets/shared/amount'
import { TrendIndicator } from '@tc96/parttens/widgets/shared/trend-indicator'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { CardPanel } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { StatsCardActions } from '../shared/stats-card-actions'
import { defaultStats1Labels } from './labels'
import type {
  Stats1Action,
  Stats1Labels,
  Stats1Props,
  Stats1Stat,
} from './types'

interface StatCardProps {
  currency: string
  labels: Stats1Labels
  locale: string
  onStatAction?: Stats1Props['onStatAction']
  stat: Stats1Stat
}

function StatCard({
  currency,
  labels,
  locale,
  onStatAction,
  stat,
}: Readonly<StatCardProps>) {
  const titleId = useId()
  const kind = stat.kind ?? 'number'
  const format =
    kind === 'currency'
      ? { currency, locale, style: 'currency' as const }
      : kind === 'percent'
        ? { locale, maximumFractionDigits: 1, style: 'percent' as const }
        : { locale, style: 'decimal' as const }

  return (
    <WidgetShell aria-labelledby={titleId} data-stat={stat.id}>
      <CardPanel className="grid gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-muted-foreground text-sm" id={titleId}>
            {stat.label}
          </h3>
          {onStatAction ? (
            <StatsCardActions
              actions={[
                { id: 'details', label: labels.details },
                { id: 'export', label: labels.export },
              ]}
              label={labels.actions(stat.label)}
              onAction={(action) =>
                onStatAction(stat.id, action as Stats1Action)
              }
            />
          ) : null}
        </div>
        <Amount
          className="font-medium text-3xl leading-tight tracking-tight"
          format={format}
          value={stat.value}
        />
        {stat.change === undefined ? null : (
          <div>
            <TrendIndicator
              format={{ locale, maximumFractionDigits: 1, style: 'percent' }}
              labels={labels.trend}
              value={stat.change}
            />
          </div>
        )}
      </CardPanel>
    </WidgetShell>
  )
}

export function Stats1({
  className,
  currency = 'BRL',
  labels: labelsProp,
  locale = 'pt-BR',
  onStatAction,
  stats,
}: Readonly<Stats1Props>) {
  const labels = { ...defaultStats1Labels, ...labelsProp }

  if (stats.length === 0) {
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
      <ul
        className={cn(
          'grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-4',
          stats.length === 3 && 'xl:grid-cols-3',
        )}
      >
        {stats.map((stat) => (
          <li className="min-w-0" key={stat.id}>
            <StatCard
              currency={currency}
              labels={labels}
              locale={locale}
              onStatAction={onStatAction}
              stat={stat}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
