'use client'

import { Button } from '@tc96/ui/button'
import { ScrollAreaPrimitive, ScrollBar } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'

export interface WidgetExpandProps {
  collapseLabel?: ReactNode
  defaultExpanded?: boolean
  expandLabel?: (hidden: number) => ReactNode
  expanded?: boolean
  maxHeight?: number
  onExpandedChange?: (expanded: boolean) => void
  visibleCount?: number
}

export interface ExpandableListProps<TItem> extends WidgetExpandProps {
  children: (items: readonly TItem[]) => ReactNode
  className?: string
  items: readonly TItem[]
}

export const defaultVisibleCount = 5
export const defaultExpandMaxHeight = 420

function defaultExpandLabel(hidden: number): ReactNode {
  return `Ver todas (+${hidden})`
}

export function ExpandableList<TItem>({
  children,
  className,
  collapseLabel = 'Ver menos',
  defaultExpanded = false,
  expandLabel = defaultExpandLabel,
  expanded: controlledExpanded,
  items,
  maxHeight = defaultExpandMaxHeight,
  onExpandedChange,
  visibleCount = defaultVisibleCount,
}: Readonly<ExpandableListProps<TItem>>): ReactElement {
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded)
  const expanded = controlledExpanded ?? uncontrolledExpanded
  const hidden = Math.max(0, items.length - visibleCount)

  function setExpanded(next: boolean) {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  if (hidden === 0)
    return (
      <div className={className} data-slot="expandable-list">
        {children(items)}
      </div>
    )

  if (!expanded)
    return (
      <div
        className={cn('relative', className)}
        data-expanded="false"
        data-slot="expandable-list"
      >
        {children(items.slice(0, visibleCount))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-linear-to-t from-35% from-card to-transparent">
          <Button
            className="pointer-events-auto"
            onClick={() => setExpanded(true)}
            size="sm"
            type="button"
            variant="outline"
          >
            {expandLabel(hidden)}
          </Button>
        </div>
      </div>
    )

  return (
    <div
      className={cn('grid gap-3', className)}
      data-expanded="true"
      data-slot="expandable-list"
    >
      <ScrollAreaPrimitive.Root
        className="relative"
        data-slot="expandable-list-scroll"
      >
        <ScrollAreaPrimitive.Viewport
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-slot="scroll-area-viewport"
          style={{ maxHeight }}
        >
          <ScrollAreaPrimitive.Content
            className="pe-3"
            data-slot="scroll-area-content"
            style={{ minWidth: 0 }}
          >
            {children(items)}
          </ScrollAreaPrimitive.Content>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="vertical" />
      </ScrollAreaPrimitive.Root>
      {collapseLabel ? (
        <Button
          className="justify-self-center"
          onClick={() => setExpanded(false)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {collapseLabel}
        </Button>
      ) : null}
    </div>
  )
}
