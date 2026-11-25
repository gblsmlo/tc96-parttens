import {
  Revenue2,
  type Revenue2ColumnVisibility,
  type Revenue2Condition,
  type Revenue2Density,
  type Revenue2Props,
  type Revenue2Sort,
} from '@tc96/ui/blocks/data/revenue/revenue-2'
import { useState } from 'react'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
  views,
} from '../fixtures/revenue-2.ts'
import type { Revenue2Controls } from './revenue-2-controls.ts'

interface ComposedRevenue2Props extends Revenue2Controls {
  onAssignOwner?: Revenue2Props['onAssignOwner']
  onColumnVisibilityChange?: Revenue2Props['onColumnVisibilityChange']
  onConditionsChange?: Revenue2Props['onConditionsChange']
  onCreate?: Revenue2Props['onCreate']
  onRowAction?: Revenue2Props['onRowAction']
  onSaveView?: Revenue2Props['onSaveView']
  onSelectedIdsChange?: Revenue2Props['onSelectedIdsChange']
  onSortChange?: Revenue2Props['onSortChange']
  onStageUpdate?: Revenue2Props['onStageUpdate']
  onViewChange?: Revenue2Props['onViewChange']
  onViewCreate?: Revenue2Props['onViewCreate']
}

const noop = () => undefined

export const ComposedRevenue2 = ({
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
}: Readonly<ComposedRevenue2Props>) => {
  const [sort, setSort] = useState<Revenue2Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<Revenue2ColumnVisibility>({})
  const [density, setDensity] = useState<Revenue2Density>('tall')
  const [conditions, setConditions] =
    useState<Revenue2Condition[]>(initialConditions)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')

  return (
    <Revenue2
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
