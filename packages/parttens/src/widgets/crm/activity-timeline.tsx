import { getInitials } from '@tc96/helpers/initials'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import type { AvatarStackPerson } from '../shared/avatar-stack'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import type { WidgetTone } from '../types'

export interface Activity {
  description?: ReactNode
  icon?: ReactNode
  id: string
  person: AvatarStackPerson
  timeLabel: ReactNode
  title: ReactNode
  tone?: WidgetTone
}

const iconTones: Record<WidgetTone, string> = {
  destructive: 'text-destructive-foreground',
  info: 'text-info-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
}

export interface ActivityTimelineProps
  extends Omit<ComponentProps<'ol'>, 'children'> {
  'aria-label': string
  activities: readonly Activity[]
  emptyLabel?: ReactNode
  expand?: WidgetExpandProps
}

export function ActivityTimeline({
  activities,
  className,
  emptyLabel = 'Sem atividades',
  expand,
  ...props
}: Readonly<ActivityTimelineProps>): ReactElement {
  if (!activities.length)
    return (
      <p
        className={cn('text-muted-foreground text-sm', className)}
        data-slot="activity-feed-empty"
      >
        {emptyLabel}
      </p>
    )

  return (
    <ExpandableList items={activities} {...expand}>
      {(shown) => (
        <ol className={className} data-slot="activity-feed-list" {...props}>
          {shown.map((activity) => (
            <li
              className="relative grid grid-cols-[auto_1fr] gap-3 pb-5 last:pb-0 not-last:before:absolute not-last:before:start-3.5 not-last:before:top-8 not-last:before:bottom-0 not-last:before:w-px not-last:before:bg-border/60"
              data-slot="activity-feed-item"
              key={activity.id}
            >
              <span className="relative flex size-7">
                <span className="flex rounded-full border border-input bg-card">
                  <Avatar className="size-7">
                    {activity.person.imageUrl ? (
                      <AvatarImage alt="" src={activity.person.imageUrl} />
                    ) : null}
                    <AvatarFallback>
                      {activity.person.fallback ??
                        getInitials(activity.person.label)}
                    </AvatarFallback>
                  </Avatar>
                </span>
                {activity.icon ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      '-end-1.5 -bottom-1.5 absolute inline-flex size-5 items-center justify-center rounded-full bg-muted text-foreground [&_svg:not([class*=size-])]:size-3',
                      activity.tone ? iconTones[activity.tone] : undefined,
                    )}
                    data-slot="activity-feed-icon"
                  >
                    {activity.icon}
                  </span>
                ) : null}
              </span>
              <div className="grid min-w-0 gap-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 text-sm">
                    <span className="font-medium">{activity.person.label}</span>{' '}
                    {activity.title}
                  </span>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {activity.timeLabel}
                  </span>
                </div>
                {activity.description ? (
                  <p className="text-muted-foreground text-sm">
                    {activity.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </ExpandableList>
  )
}
