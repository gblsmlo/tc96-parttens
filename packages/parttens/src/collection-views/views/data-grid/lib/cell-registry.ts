export interface CellIdentity {
  columnId: string
  rowId: string
}

export interface CellRegistry {
  get: (rowId: string, columnId: string) => HTMLElement | undefined
  identify: (cell: HTMLElement) => CellIdentity | undefined
  registerRow: (rowId: string, node: HTMLElement | null) => void
}

export function createCellRegistry(): CellRegistry {
  const rows = new Map<string, HTMLElement>()
  const rowIds = new Map<Element, string>()

  return {
    get: (rowId, columnId) => {
      const row = rows.get(rowId)
      if (!row) return undefined
      for (const child of Array.from(row.children)) {
        if (
          child instanceof HTMLElement &&
          child.dataset.columnId === columnId
        ) {
          return child
        }
      }
      return undefined
    },
    identify: (cell) => {
      const rowElement = cell.parentElement
      const rowId = rowElement ? rowIds.get(rowElement) : undefined
      const columnId = cell.dataset.columnId
      return rowId === undefined || columnId === undefined
        ? undefined
        : { columnId, rowId }
    },
    registerRow: (rowId, node) => {
      if (node) {
        rows.set(rowId, node)
        rowIds.set(node, rowId)
        return
      }
      const current = rows.get(rowId)
      if (current) rowIds.delete(current)
      rows.delete(rowId)
    },
  }
}
