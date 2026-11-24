import {
  Table3,
  type Table3ColumnVisibility,
  type Table3Condition,
  type Table3Density,
  type Table3Props,
  type Table3Sort,
} from '@tc96/ui/blocks/data/table/table-3'
import { useState } from 'react'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
  views,
} from '../fixtures/table-3.ts'
import type { Table3Controls } from './table-3-controls.ts'

interface ComposedTable3Props extends Table3Controls {
  onAssignOwner?: Table3Props['onAssignOwner']
  onColumnVisibilityChange?: Table3Props['onColumnVisibilityChange']
  onConditionsChange?: Table3Props['onConditionsChange']
  onCreate?: Table3Props['onCreate']
  onRowAction?: Table3Props['onRowAction']
  onSaveView?: Table3Props['onSaveView']
  onSelectedIdsChange?: Table3Props['onSelectedIdsChange']
  onSortChange?: Table3Props['onSortChange']
  onStageUpdate?: Table3Props['onStageUpdate']
  onViewChange?: Table3Props['onViewChange']
  onViewCreate?: Table3Props['onViewCreate']
}

const noop = () => undefined

export const ComposedTable3 = ({
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
}: Readonly<ComposedTable3Props>) => {
  const [sort, setSort] = useState<Table3Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<Table3ColumnVisibility>({})
  const [density, setDensity] = useState<Table3Density>('tall')
  const [conditions, setConditions] =
    useState<Table3Condition[]>(initialConditions)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')

  return (
    <Table3
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
