'use client'

import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Amount } from '../shared/amount'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { StatList } from '../shared/stat-list'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetPeriodToggle } from '../shared/widget-period-toggle'
import type { WidgetPeriodOption } from '../types'

export interface CashFlowPoint {
  expenses: number
  income: number
  label: string
}

export interface CashFlowWidgetProps<TPeriod extends string = string>
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  chartLabel?: string
  data: readonly CashFlowPoint[]
  expensesColor?: string
  expensesLabel?: ReactNode
  format?: AmountFormatOptions
  height?: number
  incomeColor?: string
  incomeLabel?: ReactNode
  netLabel?: ReactNode
  onPeriodChange?: (period: TPeriod) => void
  period?: TPeriod
  periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  title: ReactNode
}

function CashFlowTooltip({
  active,
  expensesColor,
  expensesLabel,
  format,
  incomeColor,
  incomeLabel,
  payload,
}: {
  active?: boolean
  expensesColor: string
  expensesLabel: ReactNode
  format?: AmountFormatOptions
  incomeColor: string
  incomeLabel: ReactNode
  payload?: readonly { payload?: unknown }[]
}): ReactElement | null {
  const point = payload?.[0]?.payload as CashFlowPoint | undefined
  if (!active || !point) return null

  return (
    <div className="grid gap-1 rounded-lg border bg-popover px-2.5 py-1.5 text-popover-foreground text-xs shadow-md/5">
      <span className="text-muted-foreground">{point.label}</span>
      <span className="flex items-center gap-1.5 tabular-nums">
        <span
          aria-hidden="true"
          className="size-2 rounded-sm"
          style={{ backgroundColor: incomeColor }}
        />
        {incomeLabel}{' '}
        <span className="font-medium">
          {formatAmount(point.income, format)}
        </span>
      </span>
      <span className="flex items-center gap-1.5 tabular-nums">
        <span
          aria-hidden="true"
          className="size-2 rounded-sm"
          style={{ backgroundColor: expensesColor }}
        />
        {expensesLabel}{' '}
        <span className="font-medium">
          {formatAmount(point.expenses, format)}
        </span>
      </span>
    </div>
  )
}

export function CashFlowWidget<TPeriod extends string = string>({
  chartLabel,
  className,
  data,
  expensesColor = 'var(--chart-2)',
  expensesLabel = 'Saídas',
  format,
  height = 160,
  incomeColor = 'var(--chart-1)',
  incomeLabel = 'Entradas',
  netLabel = 'Saldo',
  onPeriodChange,
  period,
  periodLabel,
  periods,
  title,
  ...props
}: Readonly<CashFlowWidgetProps<TPeriod>>): ReactElement {
  const titleId = useId()
  const income = data.reduce((sum, point) => sum + point.income, 0)
  const expenses = data.reduce((sum, point) => sum + point.expenses, 0)
  const net = income - expenses
  const amount = (value: number) => (
    <Amount value={value} {...(format ? { format } : {})} />
  )

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="cash-flow"
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
        <StatList
          className="justify-center text-center"
          stats={[
            { id: 'income', label: incomeLabel, value: amount(income) },
            { id: 'expenses', label: expensesLabel, value: amount(expenses) },
            {
              id: 'net',
              label: netLabel,
              value: (
                <span
                  className={
                    net < 0 ? 'text-destructive-foreground' : undefined
                  }
                >
                  {amount(net)}
                </span>
              ),
            },
          ]}
        />
        <div className="grid gap-3">
          <div
            aria-label={
              chartLabel ?? (typeof title === 'string' ? title : 'Gráfico')
            }
            className="-mx-1 min-w-0"
            data-slot="cash-flow-widget-chart"
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
                barGap={4}
                data={[...data]}
                margin={{ bottom: 0, left: 4, right: 4, top: 4 }}
              >
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  interval="preserveStartEnd"
                  minTickGap={24}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis hide />
                <Tooltip
                  content={(tooltip) => (
                    <CashFlowTooltip
                      {...tooltip}
                      expensesColor={expensesColor}
                      expensesLabel={expensesLabel}
                      incomeColor={incomeColor}
                      incomeLabel={incomeLabel}
                      {...(format ? { format } : {})}
                    />
                  )}
                  cursor={{ fill: 'var(--muted)' }}
                />
                <Bar
                  dataKey="income"
                  fill={incomeColor}
                  isAnimationActive={false}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill={expensesColor}
                  isAnimationActive={false}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul
            className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-muted-foreground text-xs"
            data-slot="cash-flow-legend"
          >
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-sm"
                style={{ backgroundColor: incomeColor }}
              />
              {incomeLabel}
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-sm"
                style={{ backgroundColor: expensesColor }}
              />
              {expensesLabel}
            </li>
          </ul>
        </div>
      </CardPanel>
    </CardWidgetShell>
  )
}
