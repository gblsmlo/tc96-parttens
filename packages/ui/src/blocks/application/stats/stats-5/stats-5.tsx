import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { formatAmount } from '@tc96/ui/helpers/format'
import { trendDirection } from '@tc96/ui/patterns/widgets/shared/trend-indicator'
import { WidgetShell } from '@tc96/ui/patterns/widgets/shared/widget-shell'
import { statsLoadState } from '../shared/stats-load-state'
import { defaultStats5Labels } from './labels'
import { Stats5Skeleton } from './stats-5-skeleton'
import type { Stats5Item, Stats5Labels, Stats5Props } from './types'

const icons = { down: ArrowDownIcon, flat: MinusIcon, up: ArrowUpIcon }

interface TrendBadgeProps {
  labels: Stats5Labels
  locale: string
  lowerIsBetter?: boolean
  value: number
}

function TrendBadge({
  labels,
  locale,
  lowerIsBetter,
  value,
}: Readonly<TrendBadgeProps>) {
  const direction = trendDirection(value)
  const Icon = icons[direction]
  const good = lowerIsBetter ? direction === 'down' : direction === 'up'
  const variant =
    direction === 'flat' ? 'secondary' : good ? 'success' : 'error'

  return (
    <Badge
      className="tabular-nums"
      data-direction={direction}
      data-slot="stats-5-trend"
      data-tone={direction === 'flat' ? 'neutral' : good ? 'good' : 'bad'}
      size="large"
      variant={variant}
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{labels[direction]} </span>
      {formatAmount(Math.abs(value), { locale, style: 'percent' })}
    </Badge>
  )
}

export function Stats5({
  error,
  onRetry,
  pending,
  className,
  currency = 'BRL',
  items,
  labels,
  locale = 'pt-BR',
}: Readonly<Stats5Props>) {
  const text = { ...defaultStats5Labels, ...labels }
  const loadState = statsLoadState({
    error,
    labels: text,
    onRetry,
    pending,
    skeleton: <Stats5Skeleton label={text.loading} />,
  })
  const formatValue = (item: Stats5Item) =>
    formatAmount(item.value, {
      currency,
      locale,
      ...(item.format === 'percent' ? { maximumFractionDigits: 1 } : {}),
      style: item.format === 'number' ? 'decimal' : (item.format ?? 'currency'),
    })

  return (
    <WidgetShell aria-label={text.title} className={className}>
      {loadState ?? (
        <ul
          className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          data-slot="stats-5-list"
        >
          {items.map((item) => (
            <li
              className="flex flex-col gap-3 p-6"
              data-slot="stats-5-item"
              key={item.id}
            >
              <span className="text-muted-foreground text-sm">
                {item.label}
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-3xl tabular-nums">
                  {formatValue(item)}
                </span>
                <TrendBadge
                  labels={text}
                  locale={locale}
                  lowerIsBetter={item.lowerIsBetter}
                  value={item.trend}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  )
}
