import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type {
  ChatsPanelItemSkeletonProps,
  ChatsPanelSkeletonProps,
} from '../../core'
import {
  chatsPanelAvatarSlotClassName,
  chatsPanelLineClassName,
  chatsPanelRowClassName,
  chatsPanelSkeletonRows,
  chatsPanelSkeletonWidthVariants,
  chatsPanelTextClassName,
} from '../../lib/variants'

export function ChatsPanelItemSkeleton({
  nameWidth = 'md',
  previewWidth = 'xl',
}: Readonly<ChatsPanelItemSkeletonProps>): ReactElement {
  return (
    <div
      aria-hidden="true"
      className={chatsPanelRowClassName}
      data-slot="chats-panel-item-skeleton"
    >
      <div className={chatsPanelAvatarSlotClassName}>
        <Skeleton className="size-(--avatar-size) rounded-full" />
      </div>
      <div className={chatsPanelTextClassName}>
        <div className={chatsPanelLineClassName}>
          <Skeleton
            className={cn(
              'h-3.5',
              chatsPanelSkeletonWidthVariants({ width: nameWidth }),
            )}
            data-width={nameWidth}
          />
          <Skeleton
            className={cn(
              'ms-auto h-3',
              chatsPanelSkeletonWidthVariants({ width: 'xs' }),
            )}
          />
        </div>
        <div className={chatsPanelLineClassName}>
          <Skeleton
            className={cn(
              'h-3.5',
              chatsPanelSkeletonWidthVariants({ width: previewWidth }),
            )}
            data-width={previewWidth}
          />
        </div>
      </div>
    </div>
  )
}

export function ChatsPanelSkeleton({
  count = 6,
  label,
}: Readonly<ChatsPanelSkeletonProps>): ReactElement {
  const rows = Array.from({ length: Math.max(0, count) }, (_, position) => ({
    id: `chats-panel-skeleton-${position}`,
    ...chatsPanelSkeletonRows[position % chatsPanelSkeletonRows.length],
  }))

  return (
    <output
      aria-busy="true"
      aria-label={label}
      className="flex flex-col gap-0.5"
      data-slot="chats-panel-skeleton"
    >
      {rows.map((row) => (
        <ChatsPanelItemSkeleton
          key={row.id}
          nameWidth={row.name}
          previewWidth={row.preview}
        />
      ))}
    </output>
  )
}
