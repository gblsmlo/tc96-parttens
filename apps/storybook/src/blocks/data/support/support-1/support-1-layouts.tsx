import {
  Support1,
  type Support1ColumnVisibility,
  type Support1Density,
  type Support1Props,
  type Support1Queue,
  type Support1Sort,
  type Support1Status,
} from '@tc96/ui/blocks/data/support/support-1'
import { useEffect, useState } from 'react'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
  views,
} from '../fixtures/support-1.ts'
import type { Support1Controls } from './support-1-controls.ts'

export const support1PageSizeOptions = [6, 12, 24]

interface ComposedSupport1Props extends Support1Controls {
  onAssignOwner?: Support1Props['onAssignOwner']
  onColumnVisibilityChange?: Support1Props['onColumnVisibilityChange']
  onCreate?: Support1Props['onCreate']
  onExport?: Support1Props['onExport']
  onPageSizeChange?: Support1Props['onPageSizeChange']
  onQueueChange?: Support1Props['onQueueChange']
  onRowAction?: Support1Props['onRowAction']
  onSaveView?: Support1Props['onSaveView']
  onSelectedIdsChange?: Support1Props['onSelectedIdsChange']
  onSortChange?: Support1Props['onSortChange']
  onStatusChange?: Support1Props['onStatusChange']
  onStatusUpdate?: Support1Props['onStatusUpdate']
  onViewChange?: Support1Props['onViewChange']
  onViewCreate?: Support1Props['onViewCreate']
}

const noop = () => undefined

export const ComposedSupport1 = ({
  bulkActions,
  empty,
  headerActions,
  onAssignOwner,
  onColumnVisibilityChange,
  onCreate,
  onExport,
  onPageSizeChange,
  onQueueChange,
  onRowAction,
  onSaveView,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusUpdate,
  onViewChange,
  onViewCreate,
  pageSize: pageSizeControl,
  rowActions: showRowActions,
  savedViews,
  title,
}: Readonly<ComposedSupport1Props>) => {
  const [sort, setSort] = useState<Support1Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<Support1ColumnVisibility>({})
  const [density, setDensity] = useState<Support1Density>('tall')
  const [queue, setQueue] = useState<Support1Queue | null>(null)
  const [status, setStatus] = useState<Support1Status | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(pageSizeControl)
  const [activeViewId, setActiveViewId] = useState('all')

  useEffect(() => {
    setPageSize(pageSizeControl)
  }, [pageSizeControl])

  return (
    <Support1
      activeViewId={savedViews ? activeViewId : undefined}
      columnVisibility={visibility}
      density={density}
      labels={{ title }}
      onAssignOwner={bulkActions ? (onAssignOwner ?? noop) : undefined}
      onColumnVisibilityChange={(next) => {
        setVisibility(next)
        onColumnVisibilityChange?.(next)
      }}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onDensityChange={setDensity}
      onExport={headerActions ? (onExport ?? noop) : undefined}
      onPageSizeChange={(next) => {
        setPageSize(next)
        onPageSizeChange?.(next)
      }}
      onQueueChange={(next) => {
        setQueue(next)
        onQueueChange?.(next)
      }}
      onRowAction={showRowActions ? (onRowAction ?? noop) : undefined}
      onSaveView={onSaveView ?? noop}
      onSelectedIdsChange={(next) => {
        setSelectedIds(next)
        onSelectedIdsChange?.(next)
      }}
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onStatusChange={(next) => {
        setStatus(next)
        onStatusChange?.(next)
      }}
      onStatusUpdate={bulkActions ? (onStatusUpdate ?? noop) : undefined}
      onViewChange={
        savedViews
          ? (next) => {
              setActiveViewId(next)
              onViewChange?.(next)
            }
          : undefined
      }
      onViewCreate={savedViews ? (onViewCreate ?? noop) : undefined}
      owners={owners}
      pageSize={pageSize}
      pageSizeOptions={support1PageSizeOptions}
      queue={queue}
      rowActions={showRowActions ? rowActions : undefined}
      selectedIds={selectedIds}
      sort={sort}
      status={status}
      tickets={empty ? [] : tickets}
      views={savedViews ? views : undefined}
    />
  )
}
