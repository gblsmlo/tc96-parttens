'use client'

import { copyToClipboard } from '@tc96/helpers/clipboard'
import { formatTimeOfDay, type TimeOfDayOptions } from '@tc96/helpers/time'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { CopyIcon } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'

const halfHourMs = 30 * 60 * 1000

export interface UpcomingEventWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'onCopy' | 'title'>,
    TimeOfDayOptions {
  copyLabel?: string
  end: Date
  eyebrow?: ReactNode
  joinHref?: string
  joinLabel?: ReactNode
  joinText?: ReactNode
  live?: boolean
  onCopy?: (href: string) => void
  provider?: ReactNode
  start: Date
  timelineLabel?: string
  title: ReactNode
  windowEnd?: Date
  windowStart?: Date
}

function ratio(instant: Date, from: Date, to: Date): number {
  const span = to.getTime() - from.getTime()
  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (instant.getTime() - from.getTime()) / span))
}

function percent(value: number): string {
  return `${(value * 100).toFixed(3)}%`
}

export function UpcomingEventWidget({
  className,
  copyLabel = 'Copiar link',
  end,
  eyebrow,
  hourCycle,
  joinHref,
  joinLabel = 'Entrar na reunião',
  joinText,
  live = false,
  locale,
  onCopy,
  provider,
  start,
  timeZone,
  timelineLabel,
  title,
  windowEnd = new Date(end.getTime() + halfHourMs),
  windowStart = new Date(start.getTime() - halfHourMs),
  ...props
}: Readonly<UpcomingEventWidgetProps>): ReactElement {
  const titleId = useId()
  const timeOptions: TimeOfDayOptions = {
    ...(hourCycle ? { hourCycle } : {}),
    ...(locale ? { locale } : {}),
    ...(timeZone ? { timeZone } : {}),
  }
  const format = (instant: Date) => formatTimeOfDay(instant, timeOptions)
  const startRatio = ratio(start, windowStart, windowEnd)
  const endRatio = ratio(end, windowStart, windowEnd)
  const tickCount = Math.floor(
    (windowEnd.getTime() - windowStart.getTime()) / halfHourMs,
  )
  const ticks = Array.from({ length: Math.max(0, tickCount - 1) }, (_, index) =>
    percent((index + 1) / tickCount),
  )
  const labels = [
    { id: 'window-start', instant: windowStart, ratio: 0 },
    { id: 'start', instant: start, ratio: startRatio },
    { id: 'end', instant: end, ratio: endRatio },
    { id: 'window-end', instant: windowEnd, ratio: 1 },
  ].filter(
    (label, index, all) =>
      all.findIndex((other) => other.ratio === label.ratio) === index,
  )

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="upcoming-event"
      {...props}
    >
      <CardPanel className="grid gap-5 p-5">
        <div className="grid gap-1">
          {eyebrow ? (
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              {live ? (
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-destructive"
                  data-slot="upcoming-event-live"
                />
              ) : null}
              {eyebrow}
            </p>
          ) : null}
          <h3 className="font-semibold text-base" id={titleId}>
            {title}
          </h3>
        </div>
        <div
          aria-label={timelineLabel ?? `${format(start)} – ${format(end)}`}
          className="grid gap-2"
          data-slot="upcoming-event-timeline"
          role="img"
        >
          <div className="relative h-12 overflow-hidden rounded-md bg-muted/40">
            {ticks.map((left) => (
              <span
                className="absolute inset-y-0 w-px bg-border"
                key={left}
                style={{ left }}
              />
            ))}
            <span
              className="absolute inset-y-1.5 rounded-md border border-info/40 bg-info/10 bg-[repeating-linear-gradient(90deg,var(--info)_0_1px,transparent_1px_8px)] opacity-80"
              data-slot="upcoming-event-slot"
              style={{
                left: percent(startRatio),
                width: percent(Math.max(0, endRatio - startRatio)),
              }}
            />
          </div>
          <div className="relative h-4 text-muted-foreground text-xs tabular-nums">
            {labels.map((label) => (
              <span
                className={cn(
                  'absolute top-0',
                  label.ratio === 0
                    ? 'start-0'
                    : label.ratio === 1
                      ? 'end-0'
                      : '-translate-x-1/2',
                )}
                key={label.id}
                style={
                  label.ratio > 0 && label.ratio < 1
                    ? { left: percent(label.ratio) }
                    : undefined
                }
              >
                {format(label.instant)}
              </span>
            ))}
          </div>
        </div>
        {joinHref ? (
          <div className="flex items-center gap-3">
            <div className="grid min-w-0 flex-1 gap-0.5">
              <a
                className="truncate font-semibold text-sm underline-offset-4 hover:underline"
                data-slot="upcoming-event-join"
                href={joinHref}
              >
                {joinLabel}
              </a>
              {joinText ? (
                <span className="flex min-w-0 items-center gap-1 text-muted-foreground text-sm">
                  <span className="truncate">{joinText}</span>
                  <Button
                    aria-label={copyLabel}
                    onClick={() => {
                      void copyToClipboard(joinHref)?.catch(() => undefined)
                      onCopy?.(joinHref)
                    }}
                    size="icon-xs"
                    type="button"
                    variant="ghost"
                  >
                    <CopyIcon aria-hidden="true" />
                  </Button>
                </span>
              ) : null}
            </div>
            {provider ? (
              <span
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted [&_svg:not([class*='size-'])]:size-5"
                data-slot="upcoming-event-provider"
              >
                {provider}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardPanel>
    </CardWidgetShell>
  )
}
