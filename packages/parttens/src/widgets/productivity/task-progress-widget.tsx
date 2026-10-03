'use client'

import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { StatList, type WidgetStat } from '../shared/stat-list'
import { TrendIndicator } from '../shared/trend-indicator'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetPeriodToggle } from '../shared/widget-period-toggle'
import type { WidgetPeriodOption } from '../types'

export interface TaskProgressPoint {
  label: string
  value: number
}

export interface TaskProgressWidgetProps<TPeriod extends string = string>
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number
  changeFormat?: AmountFormatOptions
  changeLabel?: ReactNode
  chartLabel?: string
  color?: string
  data: readonly TaskProgressPoint[]
  format?: AmountFormatOptions
  height?: number
  onPeriodChange?: (period: TPeriod) => void
  period?: TPeriod
  periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  stats?: readonly WidgetStat[]
  title: ReactNode
  tone?: 'default' | 'inverted'
}

function TaskProgressTooltip({
  active,
  format,
  payload,
}: {
  active?: boolean
  format?: AmountFormatOptions
  payload?: readonly { payload?: unknown }[]
}): ReactElement | null {
  const point = payload?.[0]?.payload as TaskProgressPoint | undefined
  if (!active || !point) return null

  return (
    <div className="grid gap-0.5 rounded-lg border bg-popover px-2.5 py-1.5 text-popover-foreground text-xs shadow-md/5">
      <span className="text-muted-foreground">{point.label}</span>
      <span className="font-medium tabular-nums">
        {formatAmount(point.value, format ?? { style: 'decimal' })}
      </span>
    </div>
  )
}

export function TaskProgressWidget<TPeriod extends string = string>({
  change,
  changeFormat,
  changeLabel,
  chartLabel,
  className,
  color = 'var(--chart-1)',
  data,
  format,
  height = 140,
  onPeriodChange,
  period,
  periodLabel,
  periods,
  stats,
  title,
  tone = 'default',
  ...props
}: Readonly<TaskProgressWidgetProps<TPeriod>>): ReactElement {
  const titleId = useId()
  const card = (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-tone={tone}
      data-widget="task-progress"
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
          ) : change === undefined ? null : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendIndicator
                value={change}
                {...(changeFormat ? { format: changeFormat } : {})}
              />
              {changeLabel}
            </div>
          )
        }
        title={title}
        titleId={titleId}
      />
      <CardPanel className="grid gap-5 px-5 pb-5">
        {periods?.length && change !== undefined ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendIndicator
              value={change}
              {...(changeFormat ? { format: changeFormat } : {})}
            />
            {changeLabel}
          </div>
        ) : null}
        <div
          aria-label={
            chartLabel ?? (typeof title === 'string' ? title : 'Gráfico')
          }
          className="-mx-1 min-w-0"
          data-slot="task-progress-chart"
          role="img"
          style={{ height }}
        >
          <ResponsiveContainer
            height="100%"
            initialDimension={{ height, width: 320 }}
            width="100%"
          >
            <BarChart
              accessibilityLayer={false}
              barCategoryGap="28%"
              data={[...data]}
              margin={{ bottom: 0, left: 4, right: 4, top: 4 }}
            >
              <XAxis
                axisLine={false}
                dataKey="label"
                interval="preserveStartEnd"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={false}
                tickMargin={8}
              />
              <Tooltip
                content={(tooltip) => (
                  <TaskProgressTooltip
                    {...tooltip}
                    {...(format ? { format } : {})}
                  />
                )}
                cursor={{ fill: 'var(--muted)' }}
              />
              <Bar
                dataKey="value"
                fill={color}
                isAnimationActive={false}
                radius={[6, 6, 6, 6]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {stats?.length ? <StatList stats={stats} /> : null}
      </CardPanel>
    </CardWidgetShell>
  )

  return tone === 'inverted' ? (
    <div className="dark contents" data-slot="task-progress-widget-scope">
      {card}
    </div>
  ) : (
    card
  )
}
