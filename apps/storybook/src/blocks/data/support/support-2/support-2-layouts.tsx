import {
  Support2,
  type Support2ColumnVisibility,
  type Support2Density,
  type Support2Props,
  type Support2Queue,
  type Support2Sort,
  type Support2Status,
} from '@tc96/ui/blocks/data/support/support-2'
import { useEffect, useState } from 'react'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
  views,
} from '../fixtures/support-2.ts'
import type { Support2Controls } from './support-2-controls.ts'

export const support2PageSizeOptions = [6, 12, 24]

interface ComposedSupport2Props extends Support2Controls {
  onAssignOwner?: Support2Props['onAssignOwner']
  onColumnVisibilityChange?: Support2Props['onColumnVisibilityChange']
  onCreate?: Support2Props['onCreate']
  onExport?: Support2Props['onExport']
  onPageSizeChange?: Support2Props['onPageSizeChange']
  onQueueChange?: Support2Props['onQueueChange']
  onRowAction?: Support2Props['onRowAction']
  onSaveView?: Support2Props['onSaveView']
  onSearchChange?: Support2Props['onSearchChange']
  onSelectedIdsChange?: Support2Props['onSelectedIdsChange']
  onSortChange?: Support2Props['onSortChange']
  onStatusChange?: Support2Props['onStatusChange']
  onStatusUpdate?: Support2Props['onStatusUpdate']
  onViewChange?: Support2Props['onViewChange']
  onViewCreate?: Support2Props['onViewCreate']
}

const noop = () => undefined

export const ComposedSupport2 = ({
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
  onSearchChange,
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
}: Readonly<ComposedSupport2Props>) => {
  const [sort, setSort] = useState<Support2Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<Support2ColumnVisibility>({})
  const [density, setDensity] = useState<Support2Density>('tall')
  const [search, setSearch] = useState('')
  const [queue, setQueue] = useState<Support2Queue | null>(null)
  const [status, setStatus] = useState<Support2Status | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(pageSizeControl)
  const [activeViewId, setActiveViewId] = useState('all')

  useEffect(() => {
    setPageSize(pageSizeControl)
  }, [pageSizeControl])

  return (
    <Support2
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
      onSearchChange={(next) => {
        setSearch(next)
        onSearchChange?.(next)
      }}
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
      pageSizeOptions={support2PageSizeOptions}
      queue={queue}
      rowActions={showRowActions ? rowActions : undefined}
      search={search}
      selectedIds={selectedIds}
      sort={sort}
      status={status}
      tickets={empty ? [] : tickets}
      views={savedViews ? views : undefined}
    />
  )
}
