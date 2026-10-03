import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { cn } from '@tc96/utils'
import { FlameIcon, TrophyIcon } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { MetricPill } from '../shared/metric-pill'
import { clampRatio, ProgressRing } from '../shared/progress-ring'
import type { XpProgress } from './types'
import { XpMeter } from './xp-meter'

export interface ProgressHudProps
  extends Omit<ComponentProps<'section'>, 'children'> {
  achievements?: { total: number; unlocked: number }
  achievementsLabel?: string
  'aria-label': string
  format?: AmountFormatOptions
  level: number
  levelLabel?: (level: number) => ReactNode
  meterLabel?: (nextLevel: number) => string
  streakDays?: number
  streakLabel?: (days: number) => string
  xp: XpProgress
}

const defaultFormat: AmountFormatOptions = {
  maximumFractionDigits: 0,
  style: 'decimal',
}

export function ProgressHud({
  achievements,
  achievementsLabel = 'conquistas',
  'aria-label': ariaLabel,
  className,
  format = defaultFormat,
  level,
  levelLabel = (value) => `Nível ${value}`,
  meterLabel = (next) => `Progresso para o nível ${next}`,
  streakDays,
  streakLabel = (days) => (days === 1 ? 'dia seguido' : 'dias seguidos'),
  xp,
  ...props
}: Readonly<ProgressHudProps>): ReactElement {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-3 rounded-full border border-border/80 bg-card py-1.5 ps-1.5 pe-2 text-card-foreground',
        className,
      )}
      data-widget="progress-hud"
      {...props}
    >
      <ProgressRing
        className="size-10"
        ratio={clampRatio(xp.current, xp.target)}
      >
        <span className="font-semibold text-sm tabular-nums">{level}</span>
      </ProgressRing>
      <div className="grid min-w-24 flex-1 gap-1">
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <span className="font-medium">{levelLabel(level)}</span>
          <span className="text-muted-foreground tabular-nums">
            {formatAmount(xp.current, format)}/{formatAmount(xp.target, format)}{' '}
            XP
          </span>
        </div>
        <XpMeter
          aria-label={meterLabel(level + 1)}
          className="w-full"
          current={xp.current}
          target={xp.target}
        />
      </div>
      {streakDays === undefined ? null : (
        <MetricPill className="shrink-0" data-slot="hud-streak" tone="warning">
          <FlameIcon />
          {streakDays}
          <span className="sr-only"> {streakLabel(streakDays)}</span>
        </MetricPill>
      )}
      {achievements ? (
        <MetricPill
          className="shrink-0"
          data-slot="hud-achievements"
          tone="primary"
        >
          <TrophyIcon />
          {achievements.unlocked}/{achievements.total}
          <span className="sr-only"> {achievementsLabel}</span>
        </MetricPill>
      ) : null}
    </section>
  )
}
