import { IconFrame } from '@tc96/elements/icon-frame'
import { CardPanel } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { FlameIcon } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { WidgetHeader } from '../shared/widget-header'
import type { StreakDay } from './types'

export interface StreakWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  activeLabel?: string
  color?: string
  days: number
  daysLabel?: (days: number) => ReactNode
  inactiveLabel?: string
  listLabel?: string
  title: ReactNode
  todayLabel?: string
  week: readonly StreakDay[]
  weekLabel?: ReactNode
}

export function StreakWidget({
  action,
  activeLabel = 'estudou',
  className,
  color = 'var(--warning-foreground)',
  days,
  daysLabel = (value) => (value === 1 ? 'dia seguido' : 'dias seguidos'),
  inactiveLabel = 'sem estudo',
  listLabel = 'Dias de estudo',
  title,
  todayLabel = 'hoje',
  week,
  weekLabel = 'Últimos 7 dias',
  ...props
}: Readonly<StreakWidgetProps>): ReactElement {
  const titleId = useId()

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="streak"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <div className="flex items-center gap-3">
          <IconFrame color={color} size="lg">
            <FlameIcon />
          </IconFrame>
          <div className="grid gap-0.5">
            <span className="font-medium text-4xl leading-tight tabular-nums tracking-tight">
              {days}
            </span>
            <span className="text-muted-foreground text-sm">
              {daysLabel(days)}
            </span>
          </div>
        </div>
        <div className="grid gap-3">
          <p className="text-muted-foreground text-xs">{weekLabel}</p>
          <ol
            aria-label={listLabel}
            className="grid grid-cols-7 gap-2"
            data-slot="streak-week"
          >
            {week.map((day) => (
              <li
                className="flex flex-col items-center gap-1.5"
                data-active={day.active ? 'true' : undefined}
                data-today={day.today ? 'true' : undefined}
                key={day.id}
              >
                {day.active ? (
                  <IconFrame
                    className={cn(
                      day.today &&
                        'ring-2 ring-ring ring-offset-2 ring-offset-card',
                    )}
                    color={color}
                  >
                    <FlameIcon />
                  </IconFrame>
                ) : (
                  <IconFrame
                    className={cn(
                      'border border-input border-dashed text-muted-foreground',
                      day.today &&
                        'ring-2 ring-ring ring-offset-2 ring-offset-card',
                    )}
                    variant="plain"
                  >
                    <FlameIcon className="opacity-40" />
                  </IconFrame>
                )}
                <span className="text-muted-foreground text-xs">
                  {day.label}
                </span>
                <span className="sr-only">
                  {day.today ? `, ${todayLabel}` : ''}:{' '}
                  {day.active ? activeLabel : inactiveLabel}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </CardPanel>
    </CardWidgetShell>
  )
}
