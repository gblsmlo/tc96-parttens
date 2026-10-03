import { useCallback, useLayoutEffect, useState } from 'react'
import { createCellRegistry } from '../lib/cell-registry'
import { shouldPullFocus } from '../lib/dom'

interface UseDataGridFocusOptions {
  focusedColumnId?: string
  focusedRowId?: string
  hasInteracted: boolean
}

export function useDataGridFocus({
  focusedColumnId,
  focusedRowId,
  hasInteracted,
}: UseDataGridFocusOptions) {
  const [registry] = useState(createCellRegistry)

  useLayoutEffect(() => {
    if (!(hasInteracted && focusedRowId && focusedColumnId)) return
    const node = registry.get(focusedRowId, focusedColumnId)
    if (!node || node.contains(document.activeElement)) return
    queueMicrotask(() => {
      if (shouldPullFocus(node)) node.focus()
    })
  })

  const focusCell = useCallback(
    (rowId: string, columnId: string) => {
      queueMicrotask(() => registry.get(rowId, columnId)?.focus())
    },
    [registry],
  )

  return { focusCell, registry }
}
