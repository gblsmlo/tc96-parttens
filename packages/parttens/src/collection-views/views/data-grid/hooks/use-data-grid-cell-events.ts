import type { Row, RowData } from '@tanstack/react-table'
import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useMemo,
  useRef,
} from 'react'
import type { CellIdentity, CellRegistry } from '../lib/cell-registry'
import {
  PENDING_SELECT_CLICK_WINDOW_MS,
  SELECT_TRIGGER_SELECTOR,
} from '../lib/constants'
import type {
  DataGridColumn,
  DataGridFeatures,
} from '../lib/data-grid-features'
import { hasSelectTrigger } from '../lib/dom'
import { type CellSelection, isCellSelected } from '../lib/selection'
import { useLatestCallback } from './use-latest-callback'

export interface CellInteractions {
  onClick: (event: MouseEvent<HTMLDivElement>) => void
  onClickCapture: (event: MouseEvent<HTMLDivElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  onMouseDownCapture: (event: MouseEvent<HTMLDivElement>) => void
  onPointerDownCapture: (event: PointerEvent<HTMLDivElement>) => void
  registerRow: CellRegistry['registerRow']
}

interface UseDataGridCellEventsOptions<TData extends RowData> {
  columnIndexById: ReadonlyMap<string, number>
  columns: readonly DataGridColumn<TData>[]
  firstNavigableColumn: number
  focusCell: (rowId: string, columnId: string) => void
  registry: CellRegistry
  rowIndexById: ReadonlyMap<string, number>
  rows: readonly Row<DataGridFeatures, TData>[]
  scrollRowIntoView?: (rowIndex: number) => void
  selectCell: (rowId: string, columnId: string, extend?: boolean) => void
  selection: CellSelection
}

interface PendingSelectClick extends CellIdentity {
  timestamp: number
}

export function useDataGridCellEvents<TData extends RowData>({
  columnIndexById,
  columns,
  firstNavigableColumn,
  focusCell,
  registry,
  rowIndexById,
  rows,
  scrollRowIntoView,
  selectCell,
  selection,
}: UseDataGridCellEventsOptions<TData>): CellInteractions {
  const pendingRef = useRef<PendingSelectClick | null>(null)

  const isPendingPointerSelect = (identity: CellIdentity) => {
    const pending = pendingRef.current
    return (
      pending?.rowId === identity.rowId &&
      pending.columnId === identity.columnId &&
      performance.now() - pending.timestamp < PENDING_SELECT_CLICK_WINDOW_MS
    )
  }

  const onKeyDown = useLatestCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return
      const identity = registry.identify(event.currentTarget)
      const rowIndex = identity && rowIndexById.get(identity.rowId)
      const columnIndex = identity && columnIndexById.get(identity.columnId)
      if (rowIndex === undefined || columnIndex === undefined) return

      let nextRow = rowIndex
      let nextColumn = columnIndex
      if (event.key === 'ArrowLeft') nextColumn -= 1
      else if (event.key === 'ArrowRight') nextColumn += 1
      else if (event.key === 'ArrowUp') nextRow -= 1
      else if (event.key === 'ArrowDown') nextRow += 1
      else if (event.key === 'Home') {
        nextColumn = firstNavigableColumn
        if (event.ctrlKey || event.metaKey) nextRow = 0
      } else if (event.key === 'End') {
        nextColumn = columns.length - 1
        if (event.ctrlKey || event.metaKey) nextRow = rows.length - 1
      } else return

      event.preventDefault()
      nextRow = Math.max(0, Math.min(rows.length - 1, nextRow))
      nextColumn = Math.max(
        firstNavigableColumn,
        Math.min(columns.length - 1, nextColumn),
      )
      if (scrollRowIntoView && nextRow !== rowIndex) scrollRowIntoView(nextRow)
      const nextRowId = rows[nextRow]?.id
      const nextColumnId = columns[nextColumn]?.id
      if (!(nextRowId && nextColumnId)) return
      selectCell(nextRowId, nextColumnId, event.shiftKey)
      focusCell(nextRowId, nextColumnId)
    },
  )

  const onPointerDownCapture = useLatestCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const identity = registry.identify(event.currentTarget)
      if (!identity) return
      const selected = isCellSelected(
        selection,
        identity.rowId,
        identity.columnId,
      )
      if (selected || !hasSelectTrigger(event.currentTarget)) return

      event.preventDefault()
      event.stopPropagation()
      pendingRef.current = { ...identity, timestamp: performance.now() }
      selectCell(identity.rowId, identity.columnId, event.shiftKey)
    },
  )

  const onMouseDownCapture = useLatestCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const identity = registry.identify(event.currentTarget)
      if (!identity) return

      if (isPendingPointerSelect(identity)) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      const selected = isCellSelected(
        selection,
        identity.rowId,
        identity.columnId,
      )
      if (selected || !hasSelectTrigger(event.currentTarget)) return

      event.preventDefault()
      event.stopPropagation()
      pendingRef.current = { ...identity, timestamp: performance.now() }
      selectCell(identity.rowId, identity.columnId, event.shiftKey)
    },
  )

  const onClickCapture = useLatestCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const identity = registry.identify(event.currentTarget)
      if (!identity) return

      if (isPendingPointerSelect(identity)) {
        event.preventDefault()
        event.stopPropagation()
        pendingRef.current = null
        return
      }

      const selected = isCellSelected(
        selection,
        identity.rowId,
        identity.columnId,
      )
      if (selected || !hasSelectTrigger(event.currentTarget)) return

      event.preventDefault()
      event.stopPropagation()
      selectCell(identity.rowId, identity.columnId, event.shiftKey)
    },
  )

  const onClick = useLatestCallback((event: MouseEvent<HTMLDivElement>) => {
    const identity = registry.identify(event.currentTarget)
    if (!identity) return
    const selected = isCellSelected(
      selection,
      identity.rowId,
      identity.columnId,
    )
    selectCell(identity.rowId, identity.columnId, event.shiftKey)
    if (!selected) return

    const trigger = event.currentTarget.querySelector<HTMLElement>(
      SELECT_TRIGGER_SELECTOR,
    )
    if (!trigger || trigger.contains(event.target as Node)) return
    trigger.click()
  })

  return useMemo(
    () => ({
      onClick,
      onClickCapture,
      onKeyDown,
      onMouseDownCapture,
      onPointerDownCapture,
      registerRow: registry.registerRow,
    }),
    [
      onClick,
      onClickCapture,
      onKeyDown,
      onMouseDownCapture,
      onPointerDownCapture,
      registry,
    ],
  )
}
