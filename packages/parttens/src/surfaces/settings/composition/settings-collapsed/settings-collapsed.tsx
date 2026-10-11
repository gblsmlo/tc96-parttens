'use client'

import { Text } from '@tc96/elements/text'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { cn } from '@tc96/utils'
import { ChevronDownIcon } from 'lucide-react'
import { type ReactElement, useId } from 'react'
import type { SettingsCollapsedProps } from '../../core'

export function SettingsCollapsed({
  actions,
  children,
  className,
  defaultOpen = true,
  onOpenChange,
  open,
  title,
}: Readonly<SettingsCollapsedProps>): ReactElement {
  const titleId = `settings-collapsed-title-${useId()}`

  return (
    <Collapsible
      aria-labelledby={titleId}
      className={cn('my-1 flex flex-col first:mt-4 last:mb-4', className)}
      data-slot="settings-collapsed"
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
      render={<section />}
    >
      <header className="flex min-h-10 items-center justify-between gap-2 rounded-lg bg-muted/80 px-3">
        <Text
          className="min-w-0 flex-1"
          foreground="muted"
          render={
            <h2 data-slot="settings-collapsed-title" id={titleId}>
              <CollapsibleTrigger className="group/trigger flex min-h-10 w-full min-w-0 items-center gap-2 rounded-lg text-start outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background">
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 -rotate-90 transition-transform group-data-panel-open/trigger:rotate-0"
                />
                <span className="min-w-0 break-words">{title}</span>
              </CollapsibleTrigger>
            </h2>
          }
          size="sm"
          weight="medium"
        />
        {actions ? (
          <div
            className="flex shrink-0 items-center gap-1"
            data-slot="settings-collapsed-actions"
          >
            {actions}
          </div>
        ) : null}
      </header>
      <CollapsiblePanel>
        <div
          className="flex flex-col px-4 [&_[data-slot=settings-row]]:py-1"
          data-slot="settings-collapsed-items"
        >
          {children}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
