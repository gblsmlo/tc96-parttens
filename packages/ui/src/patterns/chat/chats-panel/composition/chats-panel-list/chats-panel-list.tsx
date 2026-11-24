'use client'

import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { ChatsPanelListProps } from '../../core'
import { useChatsPanelTitleId } from '../../store/chats-panel-context'

export function ChatsPanelList({
  className,
  ...props
}: Readonly<ChatsPanelListProps>): ReactElement {
  const titleId = useChatsPanelTitleId()

  return (
    <ul
      aria-labelledby={titleId}
      className={cn('m-0 flex list-none flex-col gap-0.5 p-0', className)}
      data-slot="chats-panel-list"
      {...props}
    />
  )
}
