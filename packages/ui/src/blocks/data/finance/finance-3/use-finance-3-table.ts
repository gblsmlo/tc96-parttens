'use client'

import type { RowData } from '@tanstack/react-table'
import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo } from 'react'
import { useControllable } from '../../shared/collection/use-controllable'
import type { Finance3SelectionProps } from './types'

const noIds: string[] = []
const noHidden: readonly string[] = []

export interface UseFinance3TableOptions<TRecord extends RowData>
  extends Finance3SelectionProps {
  columns: DataTableColumnDef<TRecord>[]
  getId: (record: TRecord) => string
  hiddenColumns?: readonly string[]
  onHiddenColumnsChange?: (columnIds: string[]) => void
  records: TRecord[]
  selectable: boolean
}

export function useFinance3Table<TRecord extends RowData>({
  columns,
  getId,
  hiddenColumns = noHidden,
  onHiddenColumnsChange,
  onSelectedIdsChange,
  records,
  selectable,
  selectedIds: selectedIdsProp,
}: UseFinance3TableOptions<TRecord>) {
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const columnVisibility = useMemo(
    () => Object.fromEntries(hiddenColumns.map((id) => [id, false])),
    [hiddenColumns],
  )
  const { table } = useDataTable<TRecord>({
    columnVisibility,
    columns,
    data: records,
    enableRowSelection: selectable,
    getRowId: getId,
    onColumnVisibilityChange: (visibility) =>
      onHiddenColumnsChange?.(
        Object.keys(visibility).filter((id) => visibility[id] === false),
      ),
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })
  return table
}
