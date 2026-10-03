'use client'

import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Amount } from '../shared/amount'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { TrendIndicator } from '../shared/trend-indicator'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetPeriodToggle } from '../shared/widget-period-toggle'
import type { WidgetPeriodOption } from '../types'

export interface BalancePoint {
  label: string
  value: number
}

export interface BalanceWidgetProps<TPeriod extends string = string>
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number
  changeFormat?: AmountFormatOptions
  changeLabel?: ReactNode
  chartLabel?: string
  color?: string
  data: readonly BalancePoint[]
  format?: AmountFormatOptions
  height?: number
  onPeriodChange?: (period: TPeriod) => void
  period?: TPeriod
  periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  title: ReactNode
  value: number
}

function BalanceTooltip({
  active,
  format,
  payload,
}: {
  active?: boolean
  format?: AmountFormatOptions
  payload?: readonly { payload?: unknown }[]
}): ReactElement | null {
  const point = payload?.[0]?.payload as BalancePoint | undefined
  if (!active || !point) return null

  return (
    <div className="grid gap-0.5 rounded-lg border bg-popover px-2.5 py-1.5 text-popover-foreground text-xs shadow-md/5">
      <span className="text-muted-foreground">{point.label}</span>
      <span className="font-medium tabular-nums">
        {formatAmount(point.value, format)}
      </span>
    </div>
  )
}

export function BalanceWidget<TPeriod extends string = string>({
  change,
  changeFormat,
  changeLabel,
  chartLabel,
  className,
  color = 'var(--chart-1)',
  data,
  format,
  height = 160,
  onPeriodChange,
  period,
  periodLabel,
  periods,
  title,
  value,
  ...props
}: Readonly<BalanceWidgetProps<TPeriod>>): ReactElement {
  const titleId = useId()
  const gradientId = `balance-gradient-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="balance"
      {...props}
    >
      <WidgetHeader
        action={
          periods?.length ? (
            <WidgetPeriodToggle
              options={periods}
              {...(period === undefined ? {} : { value: period })}
              {...(onPeriodChange ? { onValueChange: onPeriodChange } : {})}
              {...(periodLabel ? { 'aria-label': periodLabel } : {})}
            />
          ) : null
        }
        title={title}
        titleId={titleId}
      />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <div className="grid gap-2">
          <Amount
            className="font-medium text-4xl leading-tight tracking-tight"
            dimFraction
            value={value}
            {...(format ? { format } : {})}
          />
          {change === undefined ? null : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendIndicator
                value={change}
                {...(changeFormat ? { format: changeFormat } : {})}
              />
              {changeLabel}
            </div>
          )}
        </div>
        <div
          aria-label={
            chartLabel ?? (typeof title === 'string' ? title : 'Gráfico')
          }
          className="-mx-1 min-w-0"
          data-slot="balance-widget-chart"
          role="img"
          style={{ height }}
        >
          <ResponsiveContainer
            height="100%"
            initialDimension={{ height, width: 320 }}
            width="100%"
          >
            <AreaChart
              accessibilityLayer={false}
              data={[...data]}
              margin={{ bottom: 0, left: 4, right: 4, top: 4 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                axisLine={false}
                dataKey="label"
                interval="preserveStartEnd"
                minTickGap={24}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Tooltip
                content={(tooltip) => (
                  <BalanceTooltip
                    {...tooltip}
                    {...(format ? { format } : {})}
                  />
                )}
                cursor={{ stroke: 'var(--border)' }}
              />
              <Area
                activeDot={{ fill: color, r: 4, stroke: 'var(--card)' }}
                dataKey="value"
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
                stroke={color}
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardPanel>
    </CardWidgetShell>
  )
}
