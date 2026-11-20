'use client'

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { cn } from '@tc96/utils'
import { ChevronDownIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import type { RecordGroupSubgroupProps } from '../../core'
import {
  recordGroupRowGapClassName,
  recordGroupRowHeightClassName,
  recordGroupRowPaddingClassName,
  recordGroupSubgroupPanelClassName,
} from '../../lib/variants'

const headerClassName = cn(
  'flex w-full min-w-0 items-center gap-1 rounded-md py-1 text-start',
  recordGroupRowHeightClassName,
  recordGroupRowPaddingClassName,
)

const chevronIcon = (
  <ChevronDownIcon
    aria-hidden="true"
    className="size-4 shrink-0 -rotate-90 transition-transform group-data-panel-open/trigger:rotate-0"
  />
)

function SubgroupHeading({
  count,
  meta,
  title,
  trailing,
}: Readonly<
  Pick<RecordGroupSubgroupProps, 'count' | 'meta' | 'title'> & {
    trailing?: ReactNode
  }
>): ReactNode {
  return (
    <>
      <span className="min-w-0 break-words">{title}</span>
      {count !== undefined ? (
        <span
          className="shrink-0 text-muted-foreground tabular-nums"
          data-slot="record-group-subgroup-count"
        >
          {count}
        </span>
      ) : null}
      {meta || trailing ? (
        <span className="ms-auto flex shrink-0 items-center gap-2 ps-2">
          {meta ? (
            <span
              className="flex items-center gap-2 text-muted-foreground"
              data-slot="record-group-subgroup-meta"
            >
              {meta}
            </span>
          ) : null}
          {trailing}
        </span>
      ) : null}
    </>
  )
}

function SubgroupContent({
  children,
}: Readonly<{ children?: ReactNode }>): ReactElement {
  return (
    <div
      className={cn('flex flex-col', recordGroupRowGapClassName)}
      data-slot="record-group-subgroup-content"
    >
      {children}
    </div>
  )
}

export function RecordGroupSubgroup({
  chevron = 'start',
  children,
  className,
  collapsible = true,
  count,
  defaultOpen = false,
  meta,
  onOpenChange,
  open,
  title,
}: Readonly<RecordGroupSubgroupProps>): ReactElement {
  if (!collapsible)
    return (
      <div
        className={cn('flex flex-col', className)}
        data-slot="record-group-subgroup"
      >
        <h3 className={cn('font-normal text-sm', headerClassName)}>
          <SubgroupHeading count={count} meta={meta} title={title} />
        </h3>
        <SubgroupContent>{children}</SubgroupContent>
      </div>
    )

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
            'group/trigger outline-none focus-visible:ring-2 focus-visible:ring-ring',
            headerClassName,
          )}
        >
          {chevron === 'start' ? chevronIcon : null}
          <SubgroupHeading
            count={count}
            meta={meta}
            title={title}
            trailing={chevron === 'end' ? chevronIcon : undefined}
          />
        </CollapsibleTrigger>
      </h3>
      <CollapsiblePanel className={recordGroupSubgroupPanelClassName}>
        <SubgroupContent>{children}</SubgroupContent>
      </CollapsiblePanel>
    </Collapsible>
  )
}
