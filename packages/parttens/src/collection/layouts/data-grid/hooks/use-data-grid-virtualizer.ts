import type { Row, RowData } from '@tanstack/react-table'
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import {
  BOTTOM_BAR_HEIGHT_PX,
  DEFAULT_MAX_HEIGHT_PX,
  FALLBACK_HEADER_HEIGHT_PX,
  HEADER_SELECTOR,
  ROW_HEIGHT,
} from '../lib/constants'
import type { DataGridFeatures, DataGridTable } from '../lib/data-grid-features'
import { resolveVirtualScrollTop } from '../lib/virtual-scroll'
import type { DataGridDensity } from '../types'

interface UseDataGridVirtualizerOptions<TData extends RowData> {
  density: DataGridDensity
  enabled: boolean
  gridRef: RefObject<HTMLDivElement | null>
  hasBottomBar: boolean
  maxHeight?: number | string
  overscan: number
  rows: readonly Row<DataGridFeatures, TData>[]
  table: DataGridTable<TData>
}

export function useDataGridVirtualizer<TData extends RowData>({
  density,
  enabled,
  gridRef,
  hasBottomBar,
  maxHeight,
  overscan,
  rows,
  table,
}: UseDataGridVirtualizerOptions<TData>) {
  const fallbackHeight =
    typeof maxHeight === 'number' ? maxHeight : DEFAULT_MAX_HEIGHT_PX
  const rowVirtualizer = useVirtualizer({
    count: enabled ? rows.length : 0,
    estimateSize: () => ROW_HEIGHT[density],
    getItemKey: (index) => rows[index]?.id ?? index,
    getScrollElement: () => gridRef.current,
    initialRect:
      typeof maxHeight === 'number'
        ? { height: maxHeight, width: table.getTotalSize() }
        : undefined,
    observeElementRect: (instance, callback) =>
      observeElementRect(instance, (rect) =>
        callback({
          height: rect.height || fallbackHeight,
          width: rect.width || table.getTotalSize(),
        }),
      ),
    overscan,
    useFlushSync: false,
  })

  function scrollRowIntoView(rowIndex: number) {
    const grid = gridRef.current
    if (!grid) return
    const top = resolveVirtualScrollTop({
      bottomHeight: hasBottomBar ? BOTTOM_BAR_HEIGHT_PX : 0,
      headerHeight:
        grid.querySelector<HTMLElement>(HEADER_SELECTOR)?.clientHeight ||
        FALLBACK_HEADER_HEIGHT_PX,
      rowHeight: ROW_HEIGHT[density],
      rowIndex,
      scrollTop: grid.scrollTop,
      viewportHeight: grid.clientHeight || fallbackHeight,
    })
    if (top !== undefined) grid.scrollTo({ behavior: 'auto', top })
  }

  return {
    scrollRowIntoView,
    totalSize: rowVirtualizer.getTotalSize(),
    virtualItems: rowVirtualizer.getVirtualItems(),
  }
}
