import { CheckIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { CardPanel } from '@tc96/ui/card'
import { Gauge } from '@tc96/ui/gauge'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetShell } from '../shared/widget-shell'
import type { Quest } from './types'

export interface QuestsWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  description?: ReactNode
  doneColor?: string
  doneLabel?: ReactNode
  expand?: WidgetExpandProps
  quests: readonly Quest[]
  title: ReactNode
}

export function orderQuests(quests: readonly Quest[]): Quest[] {
  return [
    ...quests.filter((quest) => !quest.done),
    ...quests.filter((quest) => quest.done),
  ]
}

export function QuestsWidget({
  action,
  className,
  description,
  doneColor = 'var(--success-foreground)',
  doneLabel = 'Concluída',
  expand,
  quests,
  title,
  ...props
}: Readonly<QuestsWidgetProps>): ReactElement {
  const titleId = useId()
  const ordered = orderQuests(quests)
  const headerAction =
    action ??
    (description ? (
      <span className="text-muted-foreground text-sm tabular-nums">
        {description}
      </span>
    ) : null)

  return (
    <WidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="quests"
      {...props}
    >
      <WidgetHeader action={headerAction} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <ExpandableList items={ordered} {...expand}>
          {(shown) => (
            <ul className="grid gap-4" data-slot="quest-list">
              {shown.map((quest) => (
                <li
                  className="flex items-center gap-3"
                  data-done={quest.done ? 'true' : undefined}
                  data-slot="quest"
                  key={quest.id}
                >
                  {quest.done ? (
                    <IconFrame color={doneColor} shape="rounded">
                      <CheckIcon aria-hidden="true" />
                    </IconFrame>
                  ) : (
                    <IconFrame shape="rounded">{quest.icon}</IconFrame>
                  )}
                  <div className="grid min-w-0 flex-1 gap-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p
                        className={cn(
                          'truncate font-medium text-sm',
                          quest.done && 'text-muted-foreground line-through',
                        )}
                      >
                        {quest.label}
                      </p>
                      {quest.done ? (
                        <Badge variant="success">{doneLabel}</Badge>
                      ) : quest.progress ? (
                        <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                          {quest.progress.current}/{quest.progress.target}
                        </span>
                      ) : null}
                    </div>
                    {!quest.done && quest.progress ? (
                      <Gauge
                        aria-label={quest.label}
                        data-slot="quest-meter"
                        max={Math.max(quest.progress.target, 1)}
                        size="sm"
                        value={Math.min(
                          quest.progress.current,
                          quest.progress.target,
                        )}
                      />
                    ) : quest.detail ? (
                      <p className="text-muted-foreground text-xs">
                        {quest.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ExpandableList>
      </CardPanel>
    </WidgetShell>
  )
}
