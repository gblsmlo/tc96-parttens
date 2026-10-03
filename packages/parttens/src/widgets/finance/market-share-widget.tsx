'use client'

import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { TrendIndicator } from '../shared/trend-indicator'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetPeriodToggle } from '../shared/widget-period-toggle'
import type { WidgetPeriodOption } from '../types'

export interface MarketShareSegment {
  /** Variação do período, como razão (`0.0044`). */
  change?: number
  /** Qualquer cor CSS. Padrão: a paleta `--chart-1` a `--chart-5` do tema. */
  color?: string
  id: string
  label: string
  /** Peso do segmento; a participação é calculada sobre a soma. */
  value: number
}

export interface ShareBarProps extends Omit<ComponentProps<'ul'>, 'children'> {
  changeFormat?: AmountFormatOptions
  locale?: string
  segments: readonly MarketShareSegment[]
}

function segmentColor(segment: MarketShareSegment, index: number) {
  return segment.color ?? `var(--chart-${(index % 5) + 1})`
}

export function ShareBar({
  changeFormat,
  className,
  locale,
  segments,
  ...props
}: Readonly<ShareBarProps>): ReactElement {
  const total = segments.reduce(
    (sum, segment) => sum + Math.max(0, segment.value),
    0,
  )

  return (
    <ul
      className={cn('flex min-w-0 gap-0.5', className)}
      data-slot="share-bar"
      {...props}
    >
      {segments.map((segment, index) => {
        const share = total ? Math.max(0, segment.value) / total : 0
        return (
          // Sem min-w-0: um segmento estreito cresce até caber a variação.
          <li
            className="flex flex-col"
            data-slot="share-bar-segment"
            key={segment.id}
            style={{ flex: `${share} 1 0%` }}
          >
            <div className="flex h-14 items-start border-border border-s ps-2">
              {segment.change === undefined ? null : (
                <TrendIndicator
                  className="whitespace-nowrap pe-1"
                  value={segment.change}
                  variant="plain"
                  {...(changeFormat ? { format: changeFormat } : {})}
                />
              )}
            </div>
            <div
              aria-hidden="true"
              className="h-7 rounded-md"
              style={{ backgroundColor: segmentColor(segment, index) }}
            />
            <span className="sr-only">
              {segment.label}:{' '}
              {formatAmount(share, {
                style: 'percent',
                ...(locale ? { locale } : {}),
              })}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export interface MarketShareWidgetProps<TPeriod extends string = string>
  extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  /** Conteúdo abaixo da barra, em geral um `AssetList`. */
  children?: ReactNode
  changeFormat?: AmountFormatOptions
  endLabel?: ReactNode
  locale?: string
  onPeriodChange?: (period: TPeriod) => void
  period?: TPeriod
  periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  segments: readonly MarketShareSegment[]
  startLabel?: ReactNode
  title: ReactNode
}

export function MarketShareWidget<TPeriod extends string = string>({
  changeFormat,
  children,
  className,
  endLabel,
  locale,
  onPeriodChange,
  period,
  periodLabel,
  periods,
  segments,
  startLabel,
  title,
  ...props
}: Readonly<MarketShareWidgetProps<TPeriod>>): ReactElement {
  const titleId = useId()

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="market-share"
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
          <ShareBar
            segments={segments}
            {...(changeFormat ? { changeFormat } : {})}
            {...(locale ? { locale } : {})}
          />
          {startLabel || endLabel ? (
            <div className="flex justify-between gap-3 text-muted-foreground text-xs">
              <span>{startLabel}</span>
              <span>{endLabel}</span>
            </div>
          ) : null}
        </div>
        {children}
      </CardPanel>
    </CardWidgetShell>
  )
}
