import { Button } from '@tc96/ui/button'
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import { formatMediumDate } from '@tc96/ui/helpers/date'
import { formatAmount } from '@tc96/ui/helpers/format'
import { Meter, MeterLabel, MeterValue } from '@tc96/ui/meter'
import { Amount } from '@tc96/ui/patterns/widgets/shared/amount'
import { WidgetShell } from '@tc96/ui/patterns/widgets/shared/widget-shell'
import { useId } from 'react'
import { statsLoadState } from '../shared/stats-load-state'
import { defaultStats2Labels } from './labels'
import { Stats2Skeleton } from './stats-2-skeleton'
import type { Stats2Props } from './types'

export function Stats2({
  error,
  onRetry,
  pending,
  className,
  cost,
  currency = 'BRL',
  labels: labelsProp,
  limit,
  locale = 'pt-BR',
  onUpgrade,
  renewsAt,
  timeZone,
  used,
}: Readonly<Stats2Props>) {
  const labels = { ...defaultStats2Labels, ...labelsProp }
  const loadState = statsLoadState({
    error,
    labels: labels,
    onRetry,
    pending,
    skeleton: <Stats2Skeleton label={labels.loading} />,
  })
  const titleId = useId()
  const count = (value: number) =>
    formatAmount(value, { locale, style: 'decimal' })
  const usageText = labels.usage(count(used), count(limit))

  return (
    <WidgetShell aria-labelledby={titleId} className={className}>
      <CardHeader>
        <CardTitle id={titleId}>{labels.title}</CardTitle>
        {loadState ? null : (
          <CardDescription>
            {labels.renewsOn(formatMediumDate(renewsAt, locale, timeZone))}
          </CardDescription>
        )}
        {onUpgrade ? (
          <CardAction>
            <Button onClick={onUpgrade} size="sm" variant="outline">
              {labels.upgrade}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      {loadState ?? (
        <CardPanel className="grid gap-5">
          <Meter
            getAriaValueText={() => usageText}
            locale={locale}
            max={Math.max(limit, 1)}
            min={0}
            value={Math.min(Math.max(used, 0), Math.max(limit, 1))}
          >
            <div className="flex items-center justify-between gap-3">
              <MeterLabel>{labels.quota}</MeterLabel>
              <MeterValue>{() => usageText}</MeterValue>
            </div>
          </Meter>
          <div className="grid gap-1">
            <span className="text-muted-foreground text-sm">
              {labels.billed}
            </span>
            <Amount
              className="font-medium text-3xl tracking-tight"
              dimFraction
              format={{ currency, locale, style: 'currency' }}
              value={cost}
            />
          </div>
        </CardPanel>
      )}
    </WidgetShell>
  )
}
