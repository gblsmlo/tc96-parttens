// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import type { ReactNode } from 'react'

export function DataGridFooter({
  ariaRowIndex,
  children,
  columnCount,
}: {
  ariaRowIndex: number
  children: ReactNode
  columnCount: number
}) {
  return (
    <div
      aria-rowindex={ariaRowIndex}
      className="sticky bottom-0 z-10 border-t bg-background"
      data-slot="data-grid-footer"
      role="row"
      tabIndex={-1}
    >
      <div aria-colspan={columnCount} role="gridcell" tabIndex={-1}>
        {children}
      </div>
    </div>
  )
}
