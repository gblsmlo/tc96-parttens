import {
  DataGrid3,
  type DataGrid3ColumnVisibility,
  type DataGrid3Condition,
  type DataGrid3Density,
  type DataGrid3Props,
  type DataGrid3Sort,
} from '@tc96/ui/blocks/data/data-grid/data-grid-3'
import { useState } from 'react'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
  views,
} from '../fixtures/data-grid-3.ts'
import type { DataGrid3Controls } from './data-grid-3-controls.ts'

interface ComposedDataGrid3Props extends DataGrid3Controls {
  onAssignOwner?: DataGrid3Props['onAssignOwner']
  onColumnVisibilityChange?: DataGrid3Props['onColumnVisibilityChange']
  onConditionsChange?: DataGrid3Props['onConditionsChange']
  onCreate?: DataGrid3Props['onCreate']
  onRowAction?: DataGrid3Props['onRowAction']
  onSaveView?: DataGrid3Props['onSaveView']
  onSelectedIdsChange?: DataGrid3Props['onSelectedIdsChange']
  onSortChange?: DataGrid3Props['onSortChange']
  onStageUpdate?: DataGrid3Props['onStageUpdate']
  onViewChange?: DataGrid3Props['onViewChange']
  onViewCreate?: DataGrid3Props['onViewCreate']
}

const noop = () => undefined

export const ComposedDataGrid3 = ({
  bulkActions,
  currency,
  empty,
  locale,
  onAssignOwner,
  onColumnVisibilityChange,
  onConditionsChange,
  onCreate,
  onRowAction,
  onSaveView,
  onSelectedIdsChange,
  onSortChange,
  onStageUpdate,
  onViewChange,
  onViewCreate,
  pageSize,
  rowActions: showRowActions,
  savedViews,
  title,
}: Readonly<ComposedDataGrid3Props>) => {
  const [sort, setSort] = useState<DataGrid3Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<DataGrid3ColumnVisibility>({})
  const [density, setDensity] = useState<DataGrid3Density>('tall')
  const [conditions, setConditions] =
    useState<DataGrid3Condition[]>(initialConditions)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')

  return (
    <DataGrid3
      activeViewId={savedViews ? activeViewId : undefined}
      columnVisibility={visibility}
      conditions={conditions}
      currency={currency}
      density={density}
      labels={{ title }}
      locale={locale}
      onAssignOwner={bulkActions ? (onAssignOwner ?? noop) : undefined}
      onColumnVisibilityChange={(next) => {
        setVisibility(next)
        onColumnVisibilityChange?.(next)
      }}
      onConditionsChange={(next) => {
        setConditions(next)
        onConditionsChange?.(next)
      }}
      onCreate={onCreate ?? noop}
      onDensityChange={setDensity}
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
      onStageUpdate={bulkActions ? (onStageUpdate ?? noop) : undefined}
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
      renewals={empty ? [] : renewals}
      rowActions={showRowActions ? rowActions : undefined}
      selectedIds={selectedIds}
      sort={sort}
      views={savedViews ? views : undefined}
    />
  )
}
