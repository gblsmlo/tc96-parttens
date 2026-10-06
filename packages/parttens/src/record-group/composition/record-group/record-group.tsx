'use client'

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { ChevronDownIcon } from 'lucide-react'
import { type ReactElement, useId, useState } from 'react'
import type { RecordGroupProps } from '../../core'
import {
  recordGroupClassName,
  recordGroupContentVariants,
} from '../../lib/variants'

export function RecordGroup({
  actions,
  children,
  className,
  defaultOpen = true,
  empty = false,
  footer,
  onOpenChange,
  open,
  title,
  variant = 'plain',
}: Readonly<RecordGroupProps>): ReactElement {
  const controlled = open !== undefined
  const titleId = `record-group-title-${useId()}`
  const [internalOpen, setInternalOpen] = useState(defaultOpen && !empty)
  const [wasEmpty, setWasEmpty] = useState(empty)
  if (wasEmpty !== empty) {
    setWasEmpty(empty)
    if (wasEmpty && !controlled) setInternalOpen(true)
  }

  return (
    <Collapsible
      aria-labelledby={titleId}
      className={recordGroupClassName(variant, className)}
      data-empty={empty ? 'true' : undefined}
      data-slot="record-group"
      data-variant={variant}
      onOpenChange={(next) => {
        if (!controlled) setInternalOpen(next)
        onOpenChange?.(next)
      }}
      open={controlled ? open : internalOpen}
      render={<section />}
    >
      <div
        className="flex min-h-9 items-center justify-between gap-2 px-1"
        data-slot="record-group-header"
      >
        <h2 className="min-w-0 font-medium text-sm" id={titleId}>
          <CollapsibleTrigger className="group/trigger flex min-w-0 items-center gap-1 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronDownIcon
              aria-hidden="true"
              className="size-4 shrink-0 -rotate-90 transition-transform group-data-panel-open/trigger:rotate-0"
            />
            <span className="block max-w-30 truncate">{title}</span>
          </CollapsibleTrigger>
        </h2>
        {actions ? (
          <div
            className="flex shrink-0 items-center gap-1"
            data-slot="record-group-actions"
          >
            {actions}
          </div>
        ) : null}
      </div>
      <CollapsiblePanel>
        <div
          className={recordGroupContentVariants({ empty })}
          data-slot="record-group-content"
        >
          {children}
        </div>
        {footer ? (
          <div className="px-3 py-2" data-slot="record-group-footer">
            {footer}
          </div>
        ) : null}
      </CollapsiblePanel>
    </Collapsible>
  )
}
