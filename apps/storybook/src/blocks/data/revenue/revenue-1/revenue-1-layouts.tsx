import {
  Revenue1,
  type Revenue1ColumnVisibility,
  type Revenue1Condition,
  type Revenue1Density,
  type Revenue1Props,
  type Revenue1Sort,
} from '@tc96/ui/blocks/data/revenue/revenue-1'
import { useState } from 'react'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
  views,
} from '../fixtures/revenue-1.ts'
import type { Revenue1Controls } from './revenue-1-controls.ts'

interface ComposedRevenue1Props extends Revenue1Controls {
  onAssignOwner?: Revenue1Props['onAssignOwner']
  onColumnVisibilityChange?: Revenue1Props['onColumnVisibilityChange']
  onConditionsChange?: Revenue1Props['onConditionsChange']
  onCreate?: Revenue1Props['onCreate']
  onRowAction?: Revenue1Props['onRowAction']
  onSaveView?: Revenue1Props['onSaveView']
  onSelectedIdsChange?: Revenue1Props['onSelectedIdsChange']
  onSortChange?: Revenue1Props['onSortChange']
  onStageUpdate?: Revenue1Props['onStageUpdate']
  onViewChange?: Revenue1Props['onViewChange']
  onViewCreate?: Revenue1Props['onViewCreate']
}

const noop = () => undefined

export const ComposedRevenue1 = ({
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
}: Readonly<ComposedRevenue1Props>) => {
  const [sort, setSort] = useState<Revenue1Sort | null>(initialSort)
  const [visibility, setVisibility] = useState<Revenue1ColumnVisibility>({})
  const [density, setDensity] = useState<Revenue1Density>('tall')
  const [conditions, setConditions] =
    useState<Revenue1Condition[]>(initialConditions)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')

  return (
    <Revenue1
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
