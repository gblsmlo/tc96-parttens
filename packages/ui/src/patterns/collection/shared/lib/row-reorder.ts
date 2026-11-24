export interface RowMove {
  rowId: string
  fromIndex: number
  toIndex: number
  overRowId: string
}

export interface RowDragAnnouncements {
  instructions?: string
  start: (event: { rowId: string; index: number; rowCount: number }) => string
  over?: (event: {
    rowId: string
    index: number
    overRowId: string
    overIndex: number
    rowCount: number
  }) => string
  end: (event: {
    rowId: string
    fromIndex: number
    toIndex: number
    rowCount: number
    canceled: boolean
  }) => string
}

interface RowReorderGate {
  enabled: boolean
  grouped: boolean
  loading: boolean
  sorted: boolean
  virtualized: boolean
}

export function isRowReorderActive({
  enabled,
  grouped,
  loading,
  sorted,
  virtualized,
}: RowReorderGate) {
  return enabled && !(grouped || loading || sorted || virtualized)
}

interface ResolveRowMoveInput {
  collectionIndexes: readonly number[]
  rowIds: readonly string[]
  sourceId: string
  targetIndex: number
}

export function resolveRowMove({
  collectionIndexes,
  rowIds,
  sourceId,
  targetIndex,
}: ResolveRowMoveInput): RowMove | undefined {
  const sourceIndex = rowIds.indexOf(sourceId)
  const overRowId = rowIds[targetIndex]
  const fromIndex = collectionIndexes[sourceIndex]
  const toIndex = collectionIndexes[targetIndex]
  if (
    sourceIndex < 0 ||
    sourceIndex === targetIndex ||
    overRowId === undefined ||
    fromIndex === undefined ||
    toIndex === undefined
  ) {
    return undefined
  }
  return { fromIndex, overRowId, rowId: sourceId, toIndex }
}
