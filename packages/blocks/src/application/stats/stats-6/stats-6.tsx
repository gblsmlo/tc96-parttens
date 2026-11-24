import { formatAmount } from '@tc96/helpers/format'
import { TrendIndicator } from '@tc96/parttens/widgets/shared/trend-indicator'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@tc96/ui/card'
import { Meter, MeterIndicator, MeterLabel, MeterTrack } from '@tc96/ui/meter'
import { Tabs, TabsList, TabsTab } from '@tc96/ui/tabs'
import { statsLoadState } from '../shared/stats-load-state'
import { defaultStats6Labels } from './labels'
import { Stats6Skeleton } from './stats-6-skeleton'
import type { Stats6Period, Stats6Props } from './types'

const defaultPeriods: Stats6Period[] = ['day', 'week', 'month', 'year']

export function Stats6({
  error,
  onRetry,
  pending,
  className,
  currency = 'BRL',
  labels,
  locale = 'pt-BR',
  onPeriodChange,
  period,
  periods = defaultPeriods,
  sleeves,
}: Readonly<Stats6Props>) {
  const text = { ...defaultStats6Labels, ...labels }
  const loadState = statsLoadState({
    error,
    labels: text,
    onRetry,
    pending,
    skeleton: <Stats6Skeleton label={text.loading} />,
  })
  const percent = (ratio: number) =>
    formatAmount(ratio, { locale, maximumFractionDigits: 0, style: 'percent' })

  return (
    <WidgetShell
      aria-label={text.title}
      className={className}
      data-slot="stats-6"
    >
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle>{text.title}</CardTitle>
        <Tabs
          onValueChange={(next) => onPeriodChange?.(next as Stats6Period)}
          value={period}
        >
          <TabsList aria-label={text.period}>
            {periods.map((value) => (
              <TabsTab key={value} value={value}>
                {text.periods[value]}
              </TabsTab>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      {loadState ?? (
        <CardContent>
          <ul className="grid gap-4 md:grid-cols-3" data-slot="stats-6-list">
            {sleeves.map((sleeve) => (
              <li key={sleeve.id}>
                <Card className="h-full" data-slot="stats-6-sleeve">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <span className="font-medium text-muted-foreground text-sm">
                      {sleeve.name}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-2xl tabular-nums">
                        {formatAmount(sleeve.amount, { currency, locale })}
                      </span>
                      <TrendIndicator
                        format={{ locale, style: 'percent' }}
                        value={sleeve.delta}
                      />
                    </div>
                    <Meter
                      getAriaValueText={() => percent(sleeve.share)}
                      max={1}
                      value={sleeve.share}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <MeterLabel>{text.share}</MeterLabel>
                        <span className="text-sm tabular-nums">
                          {percent(sleeve.share)}
                        </span>
                      </div>
                      <MeterTrack>
                        <MeterIndicator />
                      </MeterTrack>
                    </Meter>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </WidgetShell>
  )
}
