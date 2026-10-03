import { IconFrame } from '@tc96/elements/icon-frame'
import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import { MeterPrimitive } from '@tc96/ui/meter'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { Amount } from '../shared/amount'
import { CardWidgetShell } from '../shared/card-widget-shell'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetPeriodToggle } from '../shared/widget-period-toggle'
import type { WidgetPeriodOption } from '../types'

export interface BudgetCategory {
  color?: string
  icon?: ReactNode
  id: string
  label: string
  limit: number
  spent: number
}

export interface BudgetWidgetProps<TPeriod extends string = string>
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  categories: readonly BudgetCategory[]
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  limitLabel?: ReactNode
  locale?: string
  onPeriodChange?: (period: TPeriod) => void
  period?: TPeriod
  periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  spentLabel?: ReactNode
  title: ReactNode
}

function categoryColor(category: BudgetCategory, index: number) {
  return category.color ?? `var(--chart-${(index % 5) + 1})`
}

export function BudgetWidget<TPeriod extends string = string>({
  action,
  categories,
  className,
  expand,
  format,
  limitLabel = 'Limite',
  locale,
  onPeriodChange,
  period,
  periodLabel,
  periods,
  spentLabel = 'Gasto',
  title,
  ...props
}: Readonly<BudgetWidgetProps<TPeriod>>): ReactElement {
  const titleId = useId()
  const totalSpent = categories.reduce((sum, item) => sum + item.spent, 0)
  const totalLimit = categories.reduce((sum, item) => sum + item.limit, 0)
  const headerAction = periods?.length ? (
    <WidgetPeriodToggle
      options={periods}
      {...(period === undefined ? {} : { value: period })}
      {...(onPeriodChange ? { onValueChange: onPeriodChange } : {})}
      {...(periodLabel ? { 'aria-label': periodLabel } : {})}
    />
  ) : (
    action
  )

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="budget"
      {...props}
    >
      <WidgetHeader action={headerAction} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <div className="grid gap-1">
          <p className="text-muted-foreground text-sm">{spentLabel}</p>
          <Amount
            className="font-medium text-4xl leading-tight tracking-tight"
            dimFraction
            value={totalSpent}
            {...(format ? { format } : {})}
          />
          <p className="text-muted-foreground text-sm">
            {limitLabel}{' '}
            <span className="tabular-nums">
              {formatAmount(totalLimit, format)}
            </span>
          </p>
        </div>
        <ExpandableList items={categories} {...expand}>
          {(shown) => (
            <ul className="grid gap-4" data-slot="budget-list">
              {shown.map((category, index) => {
                const over = category.spent > category.limit
                const share = category.limit
                  ? category.spent / category.limit
                  : 0
                const color = categoryColor(category, index)
                return (
                  <li
                    className="grid gap-2"
                    data-over={over ? 'true' : undefined}
                    data-slot="budget-category"
                    key={category.id}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {category.icon ? (
                        <IconFrame color={color}>{category.icon}</IconFrame>
                      ) : null}
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {category.label}
                      </span>
                      <span className="shrink-0 text-sm tabular-nums">
                        <span
                          className={cn(
                            'font-medium',
                            over && 'text-destructive-foreground',
                          )}
                        >
                          {formatAmount(category.spent, format)}
                        </span>
                        <span className="text-muted-foreground">
                          {' / '}
                          {formatAmount(category.limit, format)}
                        </span>
                      </span>
                    </div>
                    <MeterPrimitive.Root
                      aria-label={category.label}
                      className="block"
                      data-slot="budget-meter"
                      max={category.limit}
                      min={0}
                      value={Math.min(category.spent, category.limit)}
                    >
                      <MeterPrimitive.Track className="block h-1.5 overflow-hidden rounded-full bg-muted">
                        <MeterPrimitive.Indicator
                          className={cn(
                            'block h-full rounded-full transition-[width] duration-500',
                            over && 'bg-destructive',
                          )}
                          style={over ? undefined : { backgroundColor: color }}
                        />
                      </MeterPrimitive.Track>
                    </MeterPrimitive.Root>
                    <span className="sr-only">
                      {formatAmount(share, {
                        style: 'percent',
                        ...(locale ? { locale } : {}),
                      })}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </ExpandableList>
      </CardPanel>
    </CardWidgetShell>
  )
}
