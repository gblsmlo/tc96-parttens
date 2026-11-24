import { formatAmount } from '@tc96/helpers/format'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
} from '@tc96/ui/progress'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { defaultStats4Labels } from './labels'
import type { Stats4Props, Stats4Range } from './types'

const defaultRanges: Stats4Range[] = ['7d', '30d', '90d']

export function Stats4({
  className,
  goal,
  labels,
  locale = 'pt-BR',
  onRangeChange,
  range,
  ranges = defaultRanges,
  sources,
  total,
}: Readonly<Stats4Props>) {
  const text = { ...defaultStats4Labels, ...labels }
  const number = (value: number) =>
    formatAmount(value, { locale, style: 'decimal' })
  const percent = (ratio: number) =>
    formatAmount(ratio, { locale, maximumFractionDigits: 0, style: 'percent' })
  const items = ranges.map((value) => ({ label: text.ranges[value], value }))
  const progress = goal > 0 ? Math.min(total / goal, 1) : 0
  const sourcesTotal = sources.reduce((sum, source) => sum + source.value, 0)

  return (
    <WidgetShell aria-label={text.title} className={className}>
      <CardHeader>
        <CardTitle>{text.title}</CardTitle>
        <CardDescription>{text.total(text.ranges[range])}</CardDescription>
        <CardAction>
          <Select
            items={items}
            onValueChange={(next) => {
              if (next) onRangeChange?.(next as Stats4Range)
            }}
            value={range}
          >
            <SelectTrigger aria-label={text.range} className="w-36" size="sm">
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
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p
            className="font-semibold text-4xl tabular-nums"
            data-slot="stats-4-total"
          >
            {number(total)}
          </p>
          <Progress
            getAriaValueText={() =>
              text.goalProgress(number(total), number(goal), percent(progress))
            }
            max={1}
            value={progress}
          >
            <div className="flex items-center justify-between gap-2">
              <ProgressLabel>{text.goal(number(goal))}</ProgressLabel>
              <span
                className="font-medium text-sm tabular-nums"
                data-slot="stats-4-progress"
              >
                {percent(progress)}
              </span>
            </div>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">{text.sources}</p>
          <div
            aria-label={text.sourcesBar}
            className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-input"
            data-slot="stats-4-bar"
            role="img"
          >
            {sourcesTotal > 0
              ? sources
                  .filter((source) => source.value > 0)
                  .map((source) => (
                    <span
                      className={cn('h-full', source.colorClassName)}
                      data-source={source.id}
                      key={source.id}
                      style={{
                        width: `${(source.value / sourcesTotal) * 100}%`,
                      }}
                    />
                  ))
              : null}
          </div>
          <ul className="grid gap-2 sm:grid-cols-2" data-slot="stats-4-legend">
            {sources.map((source) => (
              <li className="flex items-center gap-2 text-sm" key={source.id}>
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-2.5 shrink-0 rounded-full',
                    source.colorClassName,
                  )}
                />
                <span className="truncate">{source.name}</span>
                <span className="ms-auto text-muted-foreground tabular-nums">
                  {number(source.value)} ·{' '}
                  {percent(sourcesTotal > 0 ? source.value / sourcesTotal : 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </WidgetShell>
  )
}
