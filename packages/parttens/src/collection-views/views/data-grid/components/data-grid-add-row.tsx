// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import { Button } from '@tc96/ui/button'
import { PlusIcon } from 'lucide-react'

export interface DataGridAddRowProps {
  ariaRowIndex: number
  label: string
  minWidth: number
  onAdd: () => void | Promise<void>
}

export function DataGridAddRow({
  ariaRowIndex,
  label,
  minWidth,
  onAdd,
}: DataGridAddRowProps) {
  return (
    <div
      className="sticky bottom-0 z-10 grid border-t bg-background"
      data-slot="data-grid-add-row-group"
      role="rowgroup"
    >
      <div
        aria-rowindex={ariaRowIndex}
        className="flex min-h-9 w-full"
        role="row"
        style={{ minWidth }}
        tabIndex={-1}
      >
        <div
          className="flex grow items-center bg-muted/30"
          role="gridcell"
          tabIndex={-1}
        >
          <Button
            aria-label={label}
            className="h-full w-full justify-start rounded-none px-3"
            onClick={() => void onAdd()}
            variant="ghost"
          >
            <PlusIcon />
            {label}
          </Button>
        </div>
      </div>
    </div>
  )
}
