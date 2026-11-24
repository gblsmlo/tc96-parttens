'use client'

import { Spinner } from '@tc96/ui/spinner'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleMinusIcon,
} from 'lucide-react'
import { type ReactElement, useEffect, useRef } from 'react'
import type { RecordStatus, RecordStatusItemProps } from '../../core'
import {
  recordStatusDetailForeground,
  recordStatusIconVariants,
  recordStatusItemVariants,
  recordStatusLeadClassName,
} from '../../lib/variants'
import { useRecordStatusAnnounce } from '../../store/status-list-context'

const STATUS_ICON = {
  done: CircleCheckIcon,
  failed: CircleAlertIcon,
  pending: CircleDashedIcon,
  skipped: CircleMinusIcon,
} as const

function StatusIcon({ status }: Readonly<{ status: RecordStatus }>) {
  const Icon = status === 'running' ? null : STATUS_ICON[status]
  return (
    <span
      aria-hidden="true"
      className={recordStatusIconVariants({ status })}
      data-slot="record-status-item-icon"
    >
      {Icon ? <Icon className="size-4" /> : <Spinner className="size-4" />}
    </span>
  )
}

export function RecordStatusItem({
  action,
  announcement,
  className,
  detail,
  status,
  title,
}: Readonly<RecordStatusItemProps>): ReactElement {
  const announce = useRecordStatusAnnounce()
  const previous = useRef(status)

  useEffect(() => {
    if (previous.current === status) return
    previous.current = status
    if (announcement) announce(announcement)
  }, [announce, announcement, status])

  return (
    <li
      className={cn(recordStatusItemVariants({ status }), className)}
      data-slot="record-status-item"
      data-status={status}
    >
      <span className={recordStatusLeadClassName}>
        <StatusIcon status={status} />
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <Text data-slot="record-status-item-title" size="sm" weight="medium">
            {title}
          </Text>
          {detail ? (
            <Text
              className="min-w-0"
              data-slot="record-status-item-detail"
              foreground={recordStatusDetailForeground(status)}
              size="sm"
            >
              {detail}
            </Text>
          ) : null}
        </span>
      </span>
      {action ? (
        <span
          className="flex shrink-0 items-center gap-1"
          data-slot="record-status-item-action"
        >
          {action}
        </span>
      ) : null}
    </li>
  )
}
