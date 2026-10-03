import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { clampRatio, ProgressRing } from '../shared/progress-ring'
import { WidgetHeader } from '../shared/widget-header'
import type { XpProgress } from './types'
import { XpMeter } from './xp-meter'

export interface LevelWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  format?: AmountFormatOptions
  level: number
  levelLabel?: (level: number) => ReactNode
  meterLabel?: (nextLevel: number) => string
  remainingLabel?: (remaining: string, nextLevel: number) => ReactNode
  ringLabel?: ReactNode
  title: ReactNode
  totalLabel?: (total: string) => ReactNode
  xp: XpProgress
}

const defaultFormat: AmountFormatOptions = {
  maximumFractionDigits: 0,
  style: 'decimal',
}

export function LevelWidget({
  action,
  className,
  format = defaultFormat,
  level,
  levelLabel = (value) => `Nível ${value}`,
  meterLabel = (next) => `Progresso para o nível ${next}`,
  remainingLabel = (remaining, next) => (
    <>
      Faltam <span className="font-medium text-foreground">{remaining} XP</span>{' '}
      para o nível {next}.
    </>
  ),
  ringLabel = 'Nível',
  title,
  totalLabel = (total) => `${total} XP no total`,
  xp,
  ...props
}: Readonly<LevelWidgetProps>): ReactElement {
  const titleId = useId()
  const nextLevel = level + 1
  const remaining = Math.max(xp.target - xp.current, 0)

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="level"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <ProgressRing
            className="size-28"
            ratio={clampRatio(xp.current, xp.target)}
            strokeWidth={8}
          >
            <span className="text-muted-foreground text-xs uppercase tracking-widest">
              {ringLabel}
            </span>
            <span className="font-medium text-4xl leading-tight tabular-nums tracking-tight">
              {level}
            </span>
          </ProgressRing>
          <div className="grid w-full min-w-0 flex-1 gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold text-lg tracking-tight">
                {levelLabel(level)}
              </p>
              <p className="text-muted-foreground text-sm tabular-nums">
                {totalLabel(formatAmount(xp.total, format))}
              </p>
            </div>
            <XpMeter
              aria-label={meterLabel(nextLevel)}
              current={xp.current}
              target={xp.target}
            />
            <p className="text-muted-foreground text-sm">
              {remainingLabel(formatAmount(remaining, format), nextLevel)}
            </p>
          </div>
        </div>
      </CardPanel>
    </CardWidgetShell>
  )
}
