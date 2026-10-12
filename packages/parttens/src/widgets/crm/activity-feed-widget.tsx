import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import type { WidgetExpandProps } from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'
import { WidgetShell } from '../shared/widget-shell'
import { type Activity, ActivityTimeline } from './activity-timeline'

export interface ActivityFeedWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  activities: readonly Activity[]
  expand?: WidgetExpandProps
  emptyLabel?: ReactNode
  listLabel?: string
  title: ReactNode
}

export function ActivityFeedWidget({
  action,
  activities,
  className,
  expand,
  emptyLabel,
  listLabel,
  title,
  ...props
}: Readonly<ActivityFeedWidgetProps>): ReactElement {
  const titleId = useId()

  return (
    <WidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="activity-feed"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <ActivityTimeline
          activities={activities}
          aria-label={
            listLabel ?? (typeof title === 'string' ? title : 'Atividades')
          }
          {...(emptyLabel === undefined ? {} : { emptyLabel })}
          {...(expand ? { expand } : {})}
        />
      </CardPanel>
    </WidgetShell>
  )
}
