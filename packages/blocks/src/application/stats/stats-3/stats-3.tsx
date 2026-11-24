import { formatAmount } from '@tc96/helpers/format'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { SegmentedMeter } from '../shared/segmented-meter'
import { statsLoadState } from '../shared/stats-load-state'
import { defaultStats3Labels } from './labels'
import { Stats3Skeleton } from './stats-3-skeleton'
import type { Stats3Item, Stats3Labels, Stats3Props } from './types'

interface CapacityCellProps {
  item: Stats3Item
  labels: Stats3Labels
  locale: string
  segments: number
}

function CapacityCell({
  item,
  labels,
  locale,
  segments,
}: Readonly<CapacityCellProps>) {
  const labelId = useId()
  const count = (value: number) =>
    formatAmount(value, { locale, style: 'decimal' })
  const ratio = labels.ratio(count(item.value), count(item.total))

  return (
    <div className="grid min-w-0 gap-3 p-5" data-capacity={item.id}>
      <span className="truncate text-muted-foreground text-sm" id={labelId}>
        {item.label}
      </span>
      <span className="font-medium text-2xl tabular-nums tracking-tight">
        {ratio}
      </span>
      <SegmentedMeter
        labelledBy={labelId}
        max={item.total}
        segments={segments}
        value={item.value}
        valueText={ratio}
      />
    </div>
  )
}

export function Stats3({
  error,
  onRetry,
  pending,
  className,
  items,
  labels: labelsProp,
  locale = 'pt-BR',
  segments = 10,
}: Readonly<Stats3Props>) {
  const labels = { ...defaultStats3Labels, ...labelsProp }
  const loadState = statsLoadState({
    error,
    labels: labels,
    onRetry,
    pending,
    skeleton: <Stats3Skeleton label={labels.loading} />,
  })

  return (
    <WidgetShell aria-label={labels.title} className={className}>
      {loadState ?? (
        <div
          className={cn(
            'grid divide-y sm:divide-x sm:divide-y-0',
            items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-flow-col',
          )}
        >
          {items.map((item) => (
            <CapacityCell
              item={item}
              key={item.id}
              labels={labels}
              locale={locale}
              segments={segments}
            />
          ))}
        </div>
      )}
    </WidgetShell>
  )
}
