'use client'

import { splitTimeOfDay, type TimeOfDayOptions } from '@tc96/helpers/time'
import { CardPanel } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'

export interface WorldClock {
  id: string
  label: ReactNode
  meta?: ReactNode
  timeZone: string
}

export interface WorldClockWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'>,
    Omit<TimeOfDayOptions, 'timeZone'> {
  clocks: readonly WorldClock[]
  label?: string
  now?: Date
  showSeconds?: boolean
}

function useTickingNow(now: Date | undefined): Date {
  const [ticking, setTicking] = useState(() => now ?? new Date())

  useEffect(() => {
    if (now) return
    const interval = setInterval(() => setTicking(new Date()), 1000)
    return () => clearInterval(interval)
  }, [now])

  return now ?? ticking
}

export function WorldClockWidget({
  className,
  clocks,
  hourCycle,
  label = 'Relógios',
  locale,
  now,
  showSeconds = true,
  ...props
}: Readonly<WorldClockWidgetProps>): ReactElement {
  const instant = useTickingNow(now)
  const dateTime = instant.toISOString()

  return (
    <CardWidgetShell
      aria-label={label}
      className={className}
      data-widget="world-clock"
      {...props}
    >
      <CardPanel className="py-5">
        <div className="grid auto-cols-fr grid-flow-col divide-x divide-border/40">
          {clocks.map((clock) => {
            const parts = splitTimeOfDay(instant, {
              timeZone: clock.timeZone,
              ...(hourCycle ? { hourCycle } : {}),
              ...(locale ? { locale } : {}),
            })
            return (
              <div
                className="grid min-w-0 gap-1 px-5"
                data-slot="world-clock-item"
                key={clock.id}
              >
                <time
                  className="whitespace-nowrap font-medium text-3xl leading-tight tracking-tight tabular-nums"
                  dateTime={dateTime}
                >
                  {parts.hourMinute}
                  <span
                    className={cn(
                      'text-base text-muted-foreground',
                      showSeconds ? undefined : 'sr-only',
                    )}
                  >
                    {showSeconds ? parts.second : null}
                    {parts.dayPeriod}
                  </span>
                </time>
                <span className="truncate text-sm">{clock.label}</span>
                {clock.meta ? (
                  <span className="truncate text-muted-foreground text-xs">
                    {clock.meta}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </CardPanel>
    </CardWidgetShell>
  )
}
