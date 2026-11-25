import {
  DataGrid1,
  type DataGrid1ColumnVisibility,
  type DataGrid1Density,
  type DataGrid1Props,
  type DataGrid1Queue,
  type DataGrid1Sort,
  type DataGrid1Status,
} from '@tc96/ui/blocks/data/data-grid/data-grid-1'
import { useEffect, useState } from 'react'
import {
  initialSort,
  owners,
  rowActions,
  tickets,
  views,
} from '../fixtures/data-grid-1.ts'
import type { DataGrid1Controls } from './data-grid-1-controls.ts'

export const dataGrid1PageSizeOptions = [6, 12, 24]

interface ComposedDataGrid1Props extends DataGrid1Controls {
  onAssignOwner?: DataGrid1Props['onAssignOwner']
  onColumnVisibilityChange?: DataGrid1Props['onColumnVisibilityChange']
  onCreate?: DataGrid1Props['onCreate']
  onExport?: DataGrid1Props['onExport']
  onPageSizeChange?: DataGrid1Props['onPageSizeChange']
  onQueueChange?: DataGrid1Props['onQueueChange']
  onRowAction?: DataGrid1Props['onRowAction']
  onSaveView?: DataGrid1Props['onSaveView']
  onSelectedIdsChange?: DataGrid1Props['onSelectedIdsChange']
  onSortChange?: DataGrid1Props['onSortChange']
  onStatusChange?: DataGrid1Props['onStatusChange']
  onStatusUpdate?: DataGrid1Props['onStatusUpdate']
  onViewChange?: DataGrid1Props['onViewChange']
  onViewCreate?: DataGrid1Props['onViewCreate']
}

const noop = () => undefined

export const ComposedDataGrid1 = ({
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
}: Readonly<ComposedDataGrid1Props>) => {
  const [sort, setSort] = useState<DataGrid1Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<DataGrid1ColumnVisibility>({})
  const [density, setDensity] = useState<DataGrid1Density>('tall')
  const [queue, setQueue] = useState<DataGrid1Queue | null>(null)
  const [status, setStatus] = useState<DataGrid1Status | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(pageSizeControl)
  const [activeViewId, setActiveViewId] = useState('all')

  useEffect(() => {
    setPageSize(pageSizeControl)
  }, [pageSizeControl])

  return (
    <DataGrid1
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
      pageSizeOptions={dataGrid1PageSizeOptions}
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
