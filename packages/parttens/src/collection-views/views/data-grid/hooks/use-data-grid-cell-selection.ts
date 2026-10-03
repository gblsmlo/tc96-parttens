import { useMemo, useState } from 'react'
import {
  addCellToSelection,
  type CellSelection,
  EMPTY_SELECTION,
  pruneSelection,
  selectSingleCell,
} from '../lib/selection'

interface FocusedCell {
  columnId?: string
  rowId?: string
}

interface UseDataGridCellSelectionOptions {
  coreRowsById: object
  availableColumnIds: ReadonlyMap<string, number>
  availableRowIds: ReadonlyMap<string, number>
  firstColumnId?: string
  firstRowId?: string
  visibleRowIds: ReadonlyMap<string, number>
}

export function useDataGridCellSelection({
  coreRowsById,
  availableColumnIds,
  availableRowIds,
  firstColumnId,
  firstRowId,
  visibleRowIds,
}: UseDataGridCellSelectionOptions) {
  const [focusedCell, setFocusedCell] = useState<FocusedCell>({
    columnId: firstColumnId,
    rowId: firstRowId,
  })
  const [hasInteracted, setHasInteracted] = useState(false)
  const [selectedCells, setSelectedCells] =
    useState<CellSelection>(EMPTY_SELECTION)

  const [seenCoreRows, setSeenCoreRows] = useState(coreRowsById)
  if (seenCoreRows !== coreRowsById) {
    setSeenCoreRows(coreRowsById)
    setSelectedCells((current) =>
      pruneSelection(
        current,
        (rowId) => rowId in coreRowsById,
        () => true,
      ),
    )
  }

  const focusedCellIsAvailable =
    focusedCell.rowId !== undefined &&
    focusedCell.columnId !== undefined &&
    visibleRowIds.has(focusedCell.rowId) &&
    availableColumnIds.has(focusedCell.columnId)
  const activeFocusedCell: FocusedCell = focusedCellIsAvailable
    ? focusedCell
    : { columnId: firstColumnId, rowId: firstRowId }

  const selection = useMemo(
    () =>
      pruneSelection(
        selectedCells,
        (rowId) => availableRowIds.has(rowId),
        (columnId) => availableColumnIds.has(columnId),
      ),
    [availableColumnIds, availableRowIds, selectedCells],
  )

  function selectCell(rowId: string, columnId: string, extend = false) {
    setHasInteracted(true)
    setFocusedCell({ columnId, rowId })
    setSelectedCells((current) =>
      extend
        ? addCellToSelection(
            pruneSelection(
              current,
              (id) => availableRowIds.has(id),
              (id) => availableColumnIds.has(id),
            ),
            rowId,
            columnId,
          )
        : selectSingleCell(rowId, columnId),
    )
  }

  return {
    focusedColumnId: activeFocusedCell.columnId,
    focusedRowId: activeFocusedCell.rowId,
    hasInteracted,
    selectCell,
    selection,
  }
}
