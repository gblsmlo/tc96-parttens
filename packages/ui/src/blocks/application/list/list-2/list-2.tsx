import { formatAmount } from '@tc96/ui/helpers/format'
import { getInitials } from '@tc96/ui/helpers/initials'
import { List } from '@tc96/ui/patterns/list/composition/list/list'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Amount } from '@tc96/ui/patterns/widgets/shared/amount'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { listLoadState } from '../shared/list-load-state'
import { defaultList2Labels } from './labels'
import { List2Skeleton } from './list-2-skeleton'
import type { List2Props, List2Range } from './types'

const defaultRanges: List2Range[] = ['7d', '30d', '12m']

export function List2({
  error,
  onRetry,
  pending,
  className,
  currency = 'BRL',
  entries,
  labels: labelsProp,
  locale = 'pt-BR',
  onRangeChange,
  range,
  ranges = defaultRanges,
}: Readonly<List2Props>) {
  const labels = { ...defaultList2Labels, ...labelsProp }
  const loadState = listLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <List2Skeleton label={labels.loading} />,
  })
  const items = ranges.map((value) => ({
    label: labels.ranges[value],
    value,
  }))

  return (
    <section aria-label={labels.title} className={cn('grid gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium text-base">{labels.title}</h3>
        <Select
          items={items}
          onValueChange={(next) => {
            if (next) onRangeChange?.(next as List2Range)
          }}
          value={range}
        >
          <SelectTrigger aria-label={labels.range} className="w-48" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
      {loadState ??
        (entries.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          <ol className="grid list-none gap-2">
            {entries.map((entry, index) => (
              <li
                className="flex items-center gap-3"
                data-entry={entry.id}
                key={entry.id}
              >
                <span className="w-6 shrink-0 text-center font-medium text-muted-foreground text-sm tabular-nums">
                  <span aria-hidden="true">{index + 1}</span>
                  <span className="sr-only">{labels.rank(index + 1)}</span>
                </span>
                <List
                  actions={
                    <span className="flex items-center gap-3 text-sm">
                      <Amount
                        className="font-medium"
                        format={{ currency, locale, style: 'currency' }}
                        value={entry.amount}
                      />
                      <span
                        className="w-12 text-end text-muted-foreground tabular-nums"
                        data-slot="list-2-share"
                      >
                        {formatAmount(entry.share, {
                          locale,
                          maximumFractionDigits: 1,
                          style: 'percent',
                        })}
                      </span>
                    </span>
                  }
                  icon={
                    entry.icon ?? (
                      <span className="font-medium text-xs">
                        {getInitials(entry.name)}
                      </span>
                    )
                  }
                  title={entry.name}
                />
              </li>
            ))}
          </ol>
        ))}
    </section>
  )
}
