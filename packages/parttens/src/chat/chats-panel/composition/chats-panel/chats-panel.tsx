'use client'

import { Card } from '@tc96/ui/card'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { type ReactElement, useId } from 'react'
import type { ChatsPanelProps } from '../../core'
import {
  chatsPanelBodyVariants,
  chatsPanelClassName,
  chatsPanelHeaderClassName,
  chatsPanelShellClassName,
} from '../../lib/variants'
import { ChatsPanelTitleContext } from '../../store/chats-panel-context'

export function ChatsPanel({
  actions,
  children,
  className,
  title,
  variant = 'plain',
}: Readonly<ChatsPanelProps>): ReactElement {
  const titleId = `chats-panel-title-${useId()}`

  const header = (
    <div className={chatsPanelHeaderClassName} data-slot="chats-panel-header">
      <h2 className="min-w-0 font-semibold text-base" id={titleId}>
        {title}
      </h2>
      {actions ? (
        <div
          className="ms-auto flex shrink-0 items-center gap-1"
          data-slot="chats-panel-actions"
        >
          {actions}
        </div>
      ) : null}
    </div>
  )

  const body = (
    <ScrollArea className="min-h-0 flex-1" data-slot="chats-panel-body">
      <div className={chatsPanelBodyVariants({ variant })}>{children}</div>
    </ScrollArea>
  )

  const parts = {
    card: (
      <Card className={chatsPanelShellClassName}>
        {header}
        {body}
      </Card>
    ),
    inset: (
      <>
        {header}
        <Card className={chatsPanelShellClassName}>{body}</Card>
      </>
    ),
    plain: (
      <>
        {header}
        {body}
      </>
    ),
  } satisfies Record<typeof variant, ReactElement>

  return (
    <ChatsPanelTitleContext.Provider value={titleId}>
      <section
        aria-labelledby={titleId}
        className={chatsPanelClassName(variant, className)}
        data-slot="chats-panel"
        data-variant={variant}
      >
        {parts[variant]}
      </section>
    </ChatsPanelTitleContext.Provider>
  )
}
