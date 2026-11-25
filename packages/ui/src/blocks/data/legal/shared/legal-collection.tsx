'use client'

import type { RowData } from '@tanstack/react-table'
import {
  type CollectionCalendarViewProps,
  type CollectionKanbanViewProps,
  CollectionLayoutOutlet,
  type CollectionLayoutOutletProps,
} from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import type { DataTableTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { CollectionProvider } from '@tc96/ui/patterns/collection/store/collection-provider'
import { type ReactNode, useMemo } from 'react'
import type { LegalMode } from './types'

const layoutOf = {
  calendar: 'calendar',
  kanban: 'kanban',
  list: 'list',
  table: 'datatable',
} as const satisfies Record<LegalMode, string>

export type LegalCollectionDefinition<TRecord extends RowData> =
  CollectionLayoutOutletProps<TRecord>['collection']

export interface LegalCollectionProps<TRecord extends RowData> {
  calendar?: CollectionCalendarViewProps<TRecord>
  collection: LegalCollectionDefinition<TRecord>
  emptyMessage: string
  getRowOpenLabel?: (record: TRecord) => string
  kanban?: CollectionKanbanViewProps<TRecord>
  label: string
  mode: LegalMode
  onOpen?: (record: TRecord) => void
  renderKanbanRecord?: (record: TRecord) => ReactNode
  renderListRecord: (record: TRecord) => ReactNode
  table: DataTableTable<TRecord>
}

export function LegalCollection<TRecord extends RowData>({
  calendar,
  collection,
  emptyMessage,
  getRowOpenLabel,
  kanban,
  label,
  mode,
  onOpen,
  renderKanbanRecord,
  renderListRecord,
  table,
}: Readonly<LegalCollectionProps<TRecord>>) {
  const preferences = useMemo(
    () => ({
      groupBy: mode === 'kanban' ? (collection.groupings[0]?.id ?? null) : null,
      layout: layoutOf[mode],
    }),
    [collection.groupings, mode],
  )

  return (
    <div className="min-w-0" data-mode={mode} data-slot="legal-collection">
      <CollectionProvider collection={collection} preferences={preferences}>
        <CollectionLayoutOutlet
          calendar={calendar}
          collection={collection}
          datatable={{
            'aria-label': label,
            emptyMessage,
            getRowOpenLabel: getRowOpenLabel
              ? (row) => getRowOpenLabel(row.original)
              : undefined,
            onRowClick: onOpen ? (row) => onOpen(row.original) : undefined,
            table,
          }}
          kanban={kanban}
          list={{ emptyMessage }}
          renderKanbanRecord={renderKanbanRecord}
          renderListRecord={renderListRecord}
        />
      </CollectionProvider>
    </div>
  )
}
