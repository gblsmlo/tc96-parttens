'use client'

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { cn } from '@tc96/utils'
import { ChevronDownIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { RecordGroupSubgroupProps } from '../../core'
import {
  recordGroupRowGapClassName,
  recordGroupRowHeightClassName,
  recordGroupRowPaddingClassName,
} from '../../lib/variants'

export function RecordGroupSubgroup({
  children,
  className,
  defaultOpen = false,
  meta,
  onOpenChange,
  open,
  title,
}: Readonly<RecordGroupSubgroupProps>): ReactElement {
  return (
    <Collapsible
      className={cn('flex flex-col', className)}
      data-slot="record-group-subgroup"
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
      open={open}
    >
      <h3 className="min-w-0 font-normal text-sm">
        <CollapsibleTrigger
          className={cn(
            'group/trigger flex w-full min-w-0 items-center gap-1 rounded-md py-1 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring',
            recordGroupRowHeightClassName,
            recordGroupRowPaddingClassName,
          )}
        >
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 -rotate-90 transition-transform group-data-panel-open/trigger:rotate-0"
          />
          <span className="min-w-0 break-words">{title}</span>
          {meta ? (
            <span
              className="ms-auto flex shrink-0 items-center gap-2 ps-2 text-muted-foreground"
              data-slot="record-group-subgroup-meta"
            >
              {meta}
            </span>
          ) : null}
        </CollapsibleTrigger>
      </h3>
      <CollapsiblePanel>
        <div
          className={cn('flex flex-col ps-5', recordGroupRowGapClassName)}
          data-slot="record-group-subgroup-content"
        >
          {children}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
