'use client'

import type { Row, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { RowReorderProvider } from '../../collection/shared/components/row-reorder-provider'
import { useLatestCallback } from '../../collection/shared/hooks/use-latest-callback'
import type { DataGridFeatures } from '../lib/data-grid-features'
import { resolveCollectionRowIndex } from '../lib/row-index'
import type { DataGridRowDragAnnouncements, DataGridRowMove } from '../types'

export interface DataGridRowReorderProps<TData extends RowData> {
  active: boolean
  announcements?: DataGridRowDragAnnouncements
  children: ReactNode
  indexByRowId: ReadonlyMap<string, number>
  onRowMove?: (move: DataGridRowMove) => void
  paginationRowOffset: number
  positions: ReadonlyMap<string, number>
  rows: readonly Row<DataGridFeatures, TData>[]
}

export function DataGridRowReorder<TData extends RowData>({
  active,
  announcements,
  children,
  indexByRowId,
  onRowMove,
  paginationRowOffset,
  positions,
  rows,
}: DataGridRowReorderProps<TData>) {
  const getCollectionIndexes = useLatestCallback(() =>
    rows.map((row, index) =>
      resolveCollectionRowIndex({
        fallbackIndex: index,
        paginationRowOffset,
        positions,
        row,
      }),
    ),
  )

  return (
    <RowReorderProvider
      active={active}
      announcements={announcements}
      getCollectionIndexes={getCollectionIndexes}
      indexByRowId={indexByRowId}
      onRowMove={onRowMove}
      rowIds={rows.map((row) => row.id)}
    >
      {children}
    </RowReorderProvider>
  )
}
