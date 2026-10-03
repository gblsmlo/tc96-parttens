import { CardPanel } from '@tc96/ui/card'
import { MeterPrimitive } from '@tc96/ui/meter'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'

import { CardWidgetShell } from '../shared/card-widget-shell'
import { StatList, type WidgetStat } from '../shared/stat-list'
import { WidgetHeader } from '../shared/widget-header'
import type { WidgetTone } from '../types'

export type RiskScoreStat = WidgetStat

export interface RiskScoreWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  /** Ação no cabeçalho, como um `Button` do COSS. */
  action?: ReactNode
  highLabel?: ReactNode
  lowLabel?: ReactNode
  max?: number
  /** Nome acessível do medidor. Padrão: o título, quando for texto. */
  meterLabel?: string
  min?: number
  score: number
  stats?: readonly RiskScoreStat[]
  title: ReactNode
  /**
   * Cor do trecho preenchido. O widget não interpreta a pontuação: qual faixa
   * é boa ou ruim é regra do consumidor.
   */
  tone?: WidgetTone
}

const indicatorTones: Record<WidgetTone, string> = {
  destructive: 'bg-destructive',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
}

export function RiskScoreWidget({
  action,
  className,
  highLabel = 'Risco alto',
  lowLabel = 'Risco baixo',
  max = 100,
  meterLabel,
  min = 0,
  score,
  stats,
  title,
  tone = 'success',
  ...props
}: Readonly<RiskScoreWidgetProps>): ReactElement {
  const titleId = useId()
  const accessibleMeterLabel =
    meterLabel ?? (typeof title === 'string' ? title : 'Pontuação')

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="risk-score"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        {stats?.length ? <StatList stats={stats} /> : null}
        <MeterPrimitive.Root
          aria-label={accessibleMeterLabel}
          className="grid gap-2"
          data-slot="risk-score-meter"
          max={max}
          min={min}
          value={score}
        >
          <MeterPrimitive.Track className="relative block h-7 overflow-hidden rounded-md bg-[repeating-linear-gradient(90deg,var(--border)_0_2px,transparent_2px_5px)]">
            <MeterPrimitive.Indicator
              className={cn(
                'block h-full rounded-md transition-[width] duration-500',
                indicatorTones[tone],
              )}
              data-tone={tone}
            />
          </MeterPrimitive.Track>
          <div className="flex justify-between gap-3 text-muted-foreground text-xs">
            <span>{lowLabel}</span>
            <span>{highLabel}</span>
          </div>
        </MeterPrimitive.Root>
      </CardPanel>
    </CardWidgetShell>
  )
}
