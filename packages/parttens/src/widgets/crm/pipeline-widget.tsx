'use client'

import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
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

export interface PipelineStage {
  color?: string
  count: number
  id: string
  label: ReactNode
  value: number
}

export interface PipelineWidgetProps<TPeriod extends string = string>
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  countLabel?: (count: number) => ReactNode
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  listLabel?: string
  onPeriodChange?: (period: TPeriod) => void
  period?: TPeriod
  periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  stages: readonly PipelineStage[]
  title: ReactNode
  totalLabel?: ReactNode
}

function stageColor(stage: PipelineStage, index: number) {
  return stage.color ?? `var(--chart-${(index % 5) + 1})`
}

export function PipelineWidget<TPeriod extends string = string>({
  action,
  className,
  countLabel = (count) => `${count}`,
  expand,
  format,
  listLabel,
  onPeriodChange,
  period,
  periodLabel,
  periods,
  stages,
  title,
  totalLabel = 'Total no funil',
  ...props
}: Readonly<PipelineWidgetProps<TPeriod>>): ReactElement {
  const titleId = useId()
  const total = stages.reduce((sum, stage) => sum + Math.max(0, stage.value), 0)
  const peak = stages.reduce((max, stage) => Math.max(max, stage.value), 0)
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
      data-widget="pipeline"
      {...props}
    >
      <WidgetHeader action={headerAction} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <div className="grid gap-1">
          <Amount
            className="font-medium text-4xl leading-tight tracking-tight"
            dimFraction
            value={total}
            {...(format ? { format } : {})}
          />
          <p className="text-muted-foreground text-sm">{totalLabel}</p>
        </div>
        <ExpandableList items={stages} {...expand}>
          {(shown) => (
            <ol
              aria-label={
                listLabel ?? (typeof title === 'string' ? title : 'Etapas')
              }
              className="grid gap-4"
              data-slot="pipeline-stages"
            >
              {shown.map((stage, index) => {
                const share = total ? Math.max(0, stage.value) / total : 0
                const width = peak ? (Math.max(0, stage.value) / peak) * 100 : 0
                return (
                  <li
                    className="grid gap-2"
                    data-slot="pipeline-stage"
                    key={stage.id}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="flex min-w-0 items-baseline gap-1.5">
                        <span className="truncate text-sm">{stage.label}</span>
                        <span className="text-muted-foreground text-xs tabular-nums">
                          {countLabel(stage.count)}
                        </span>
                      </span>
                      <span className="shrink-0 font-medium text-sm tabular-nums">
                        {formatAmount(stage.value, format)}
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="h-2 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          backgroundColor: stageColor(stage, index),
                          width: `${width}%`,
                        }}
                      />
                    </div>
                    <span className="sr-only">
                      {formatAmount(share, {
                        style: 'percent',
                        ...(format?.locale ? { locale: format.locale } : {}),
                      })}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </ExpandableList>
      </CardPanel>
    </CardWidgetShell>
  )
}
