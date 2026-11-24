import {
  Table1,
  type Table1ColumnVisibility,
  type Table1Density,
  type Table1Props,
  type Table1Queue,
  type Table1Sort,
  type Table1Status,
} from '@tc96/ui/blocks/data/table/table-1'
import { useEffect, useState } from 'react'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
  views,
} from '../fixtures/table-1.ts'
import type { Table1Controls } from './table-1-controls.ts'

export const table1PageSizeOptions = [6, 12, 24]

interface ComposedTable1Props extends Table1Controls {
  onAssignOwner?: Table1Props['onAssignOwner']
  onColumnVisibilityChange?: Table1Props['onColumnVisibilityChange']
  onCreate?: Table1Props['onCreate']
  onExport?: Table1Props['onExport']
  onPageSizeChange?: Table1Props['onPageSizeChange']
  onQueueChange?: Table1Props['onQueueChange']
  onRowAction?: Table1Props['onRowAction']
  onSaveView?: Table1Props['onSaveView']
  onSearchChange?: Table1Props['onSearchChange']
  onSelectedIdsChange?: Table1Props['onSelectedIdsChange']
  onSortChange?: Table1Props['onSortChange']
  onStatusChange?: Table1Props['onStatusChange']
  onStatusUpdate?: Table1Props['onStatusUpdate']
  onViewChange?: Table1Props['onViewChange']
  onViewCreate?: Table1Props['onViewCreate']
}

const noop = () => undefined

export const ComposedTable1 = ({
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
}: Readonly<ComposedTable1Props>) => {
  const [sort, setSort] = useState<Table1Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<Table1ColumnVisibility>({})
  const [density, setDensity] = useState<Table1Density>('tall')
  const [search, setSearch] = useState('')
  const [queue, setQueue] = useState<Table1Queue | null>(null)
  const [status, setStatus] = useState<Table1Status | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(pageSizeControl)
  const [activeViewId, setActiveViewId] = useState('all')

  useEffect(() => {
    setPageSize(pageSizeControl)
  }, [pageSizeControl])

  return (
    <Table1
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
      pageSizeOptions={table1PageSizeOptions}
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
