'use client'

import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { BellIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { ShellLabels, ShellNotification } from './types'

export interface ShellNotificationsProps {
  labels: ShellLabels
  notifications: ShellNotification[]
  onMarkAllRead?: () => void
  onNotificationSelect?: (notificationId: string) => void
}

export function ShellNotifications({
  labels,
  notifications,
  onMarkAllRead,
  onNotificationSelect,
}: Readonly<ShellNotificationsProps>): ReactElement {
  const unread = notifications.filter(
    (notification) => notification.unread,
  ).length

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-label={labels.notificationsTrigger(unread)}
            className="relative"
            size="icon"
            variant="ghost"
          />
        }
      >
        <BellIcon />
        {unread ? (
          <Badge aria-hidden className="absolute -end-1 -top-1" size="sm">
            {unread}
          </Badge>
        ) : null}
      </PopoverTrigger>
      <PopoverPopup align="end" className="w-80">
        <div className="flex items-center justify-between gap-2">
          <PopoverTitle>{labels.notifications}</PopoverTitle>
          {onMarkAllRead && unread ? (
            <Button onClick={onMarkAllRead} size="sm" variant="ghost">
              {labels.markAllRead}
            </Button>
          ) : null}
        </div>
        {notifications.length ? (
          <ul className="-mx-2 mt-2 flex flex-col">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  className="flex w-full gap-3 rounded-md px-2 py-2 text-start hover:bg-accent"
                  onClick={() => onNotificationSelect?.(notification.id)}
                  type="button"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-1.5 size-2 shrink-0 rounded-full',
                      notification.unread ? 'bg-primary' : 'bg-transparent',
                    )}
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-medium text-sm">
                      {notification.title}
                    </span>
                    {notification.description ? (
                      <span className="text-muted-foreground text-sm">
                        {notification.description}
                      </span>
                    ) : null}
                    <span className="text-muted-foreground text-xs">
                      {notification.time}
                      {notification.unread ? (
                        <span className="sr-only">, {labels.unread}</span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted-foreground text-sm">
            {labels.notificationsEmpty}
          </p>
        )}
      </PopoverPopup>
    </Popover>
  )
}
