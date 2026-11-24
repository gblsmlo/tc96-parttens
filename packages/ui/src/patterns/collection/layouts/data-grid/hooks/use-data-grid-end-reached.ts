import type { RefObject } from 'react'
import { useEndReached } from '../../../shared/hooks/use-end-reached'
import { BOTTOM_BAR_HEIGHT_PX, ROW_HEIGHT } from '../lib/constants'
import type { DataGridDensity } from '../types'

interface UseDataGridEndReachedOptions {
  density: DataGridDensity
  enabled: boolean
  gridRef: RefObject<HTMLDivElement | null>
  hasBottomBar: boolean
  loadingMore: boolean
  onEndReached?: () => void
  rowCount: number
  threshold: number
}

export function useDataGridEndReached({
  density,
  enabled,
  gridRef,
  hasBottomBar,
  loadingMore,
  onEndReached,
  rowCount,
  threshold,
}: UseDataGridEndReachedOptions) {
  useEndReached({
    enabled,
    loadingMore,
    measure: () => ({
      bottomInset: hasBottomBar ? BOTTOM_BAR_HEIGHT_PX : 0,
      rowHeight: ROW_HEIGHT[density],
    }),
    onEndReached,
    rowCount,
    scrollRef: gridRef,
    threshold,
  })
}
