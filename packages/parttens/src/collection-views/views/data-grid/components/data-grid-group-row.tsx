// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { memo } from 'react'

export interface DataGridGroupRowProps {
  ariaRowIndex: number
  collapsed: boolean
  count: number
  group: string
  onToggle: (group: string, collapsed: boolean) => void
}

function DataGridGroupRowView({
  ariaRowIndex,
  collapsed,
  count,
  group,
  onToggle,
}: DataGridGroupRowProps) {
  return (
    <div
      aria-rowindex={ariaRowIndex}
      className="flex min-h-9 items-center border-b bg-muted/40 px-1 font-medium"
      data-collapsed={collapsed ? 'true' : undefined}
      data-slot="data-grid-group-row"
      role="row"
      tabIndex={-1}
    >
      <div
        className="flex min-w-0 items-center gap-1"
        role="gridcell"
        tabIndex={-1}
      >
        <Button
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${group}`}
          onClick={() => onToggle(group, !collapsed)}
          size="icon-sm"
          variant="ghost"
        >
          {collapsed ? (
            <ChevronRightIcon aria-hidden="true" />
          ) : (
            <ChevronDownIcon aria-hidden="true" />
          )}
        </Button>
        <span className="truncate" data-slot="data-grid-group-label">
          {group}
        </span>
        <Badge
          className="size-5 min-w-5 shrink-0 rounded-full p-0 text-xs tabular-nums sm:size-5 sm:min-w-5"
          data-slot="data-grid-group-count"
          variant="secondary"
        >
          {count}
        </Badge>
      </div>
    </div>
  )
}

export const DataGridGroupRow = memo(DataGridGroupRowView)
