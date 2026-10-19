'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { Badge } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { ChatsPanelItemProps } from '../../core'
import {
  chatsPanelAvatarSlotClassName,
  chatsPanelChannelClassName,
  chatsPanelItemClassName,
  chatsPanelLineClassName,
  chatsPanelMutedTextClassName,
  chatsPanelPreviewVariants,
  chatsPanelTextClassName,
  chatsPanelUnreadBadgeClassName,
} from '../../lib/variants'

export function ChatsPanelItem({
  avatar,
  channel,
  channelLabel,
  className,
  name,
  preview,
  render,
  selected = false,
  time,
  unreadCount = 0,
  unreadLabel,
  ...props
}: Readonly<ChatsPanelItemProps>): ReactElement {
  const unread = unreadCount > 0
  const spokenDetails = [channelLabel, unread ? unreadLabel : undefined]
    .filter(Boolean)
    .join(', ')

  const defaultProps = {
    'aria-current': selected ? ('true' as const) : undefined,
    children: (
      <>
        <span
          aria-hidden="true"
          className={chatsPanelAvatarSlotClassName}
          data-slot="chats-panel-item-avatar"
        >
          {avatar}
          {unread ? (
            <Badge className={chatsPanelUnreadBadgeClassName} size="sm">
              {unreadCount}
            </Badge>
          ) : null}
          {channel ? (
            <span
              className={chatsPanelChannelClassName}
              data-slot="chats-panel-item-channel"
            >
              {channel}
            </span>
          ) : null}
        </span>
        <span className={chatsPanelTextClassName}>
          <span className={chatsPanelLineClassName}>
            <span
              className="min-w-0 truncate font-medium text-sm"
              data-slot="chats-panel-item-name"
            >
              {name}
            </span>
            {spokenDetails ? (
              <span className="sr-only">{spokenDetails}</span>
            ) : null}
            {time ? (
              <span
                className={cn(
                  'ms-auto shrink-0 text-xs',
                  chatsPanelMutedTextClassName,
                )}
                data-slot="chats-panel-item-time"
              >
                {time}
              </span>
            ) : null}
          </span>
          {preview ? (
            <span className={chatsPanelLineClassName}>
              <span
                className={chatsPanelPreviewVariants({ unread })}
                data-slot="chats-panel-item-preview"
              >
                {preview}
              </span>
            </span>
          ) : null}
        </span>
      </>
    ),
    className: cn(chatsPanelItemClassName, className),
    'data-slot': 'chats-panel-item-trigger',
    ...(render ? {} : { type: 'button' as const }),
  }

  const trigger = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  })

  return (
    <li
      className="min-w-0"
      data-slot="chats-panel-item"
      data-unread={unread ? 'true' : undefined}
    >
      {trigger}
    </li>
  )
}
