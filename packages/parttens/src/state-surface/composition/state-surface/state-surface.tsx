import { IconFrame } from '@tc96/elements/icon-frame'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { cn } from '@tc96/utils'
import {
  AlertTriangleIcon,
  FileQuestionIcon,
  InboxIcon,
  LockIcon,
  SearchXIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import {
  STATE_SURFACE_ICON_COLORS,
  STATE_SURFACE_ROLES,
  type StateSurfaceKind,
  type StateSurfaceProps,
} from '../../core'

const KIND_ICONS = {
  empty: InboxIcon,
  error: AlertTriangleIcon,
  'no-result': SearchXIcon,
  'not-found': FileQuestionIcon,
  permission: LockIcon,
} as const satisfies Record<StateSurfaceKind, typeof InboxIcon>

export function StateSurface({
  actions,
  className,
  description,
  icon,
  kind,
  title,
}: StateSurfaceProps): ReactNode {
  const Icon = KIND_ICONS[kind]
  const iconColor = STATE_SURFACE_ICON_COLORS[kind]

  return (
    <Empty
      className={className}
      data-kind={kind}
      role={STATE_SURFACE_ROLES[kind]}
    >
      <EmptyHeader>
        {icon === null ? null : (
          <EmptyMedia>
            <IconFrame
              className={cn(!iconColor && 'bg-muted/60')}
              color={iconColor}
              shape="rounded"
              size="xl"
            >
              {icon === undefined ? <Icon /> : icon}
            </IconFrame>
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actions ? (
        <EmptyContent className="flex-row flex-wrap justify-center gap-2">
          {actions}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
