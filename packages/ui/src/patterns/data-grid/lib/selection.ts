export type CellSelection = ReadonlyMap<string, ReadonlySet<string>>

export const EMPTY_SELECTION: CellSelection = new Map()

export function selectSingleCell(
  rowId: string,
  columnId: string,
): CellSelection {
  return new Map([[rowId, new Set([columnId])]])
}

export function addCellToSelection(
  selection: CellSelection,
  rowId: string,
  columnId: string,
): CellSelection {
  const next = new Map(selection)
  next.set(rowId, new Set(selection.get(rowId)).add(columnId))
  return next
}

export function isCellSelected(
  selection: CellSelection,
  rowId: string,
  columnId: string,
) {
  return selection.get(rowId)?.has(columnId) ?? false
}

export function pruneSelection(
  selection: CellSelection,
  isRowAvailable: (rowId: string) => boolean,
  isColumnAvailable: (columnId: string) => boolean,
): CellSelection {
  if (selection.size === 0) return selection
  let changed = false
  const next = new Map<string, ReadonlySet<string>>()
  for (const [rowId, columnIds] of selection) {
    if (!isRowAvailable(rowId)) {
      changed = true
      continue
    }
    const kept = new Set<string>()
    for (const columnId of columnIds) {
      if (isColumnAvailable(columnId)) kept.add(columnId)
    }
    if (kept.size === columnIds.size) {
      next.set(rowId, columnIds)
    } else {
      changed = true
      if (kept.size > 0) next.set(rowId, kept)
    }
  }
  return changed ? next : selection
}
