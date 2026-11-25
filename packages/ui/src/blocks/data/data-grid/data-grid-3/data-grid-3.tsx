'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import {
  type DataGridConditionFilterField,
  DataGridConditionFilters,
} from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-condition-filters'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  createDataGridConditionFilterFn,
  type DataGridConditionField,
} from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../shared/format'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/grid-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { GridViewSwitcher } from '../shared/grid-view-switcher'
import { healthLevel } from './data-grid-3-cells'
import { createDataGrid3Columns } from './data-grid-3-columns'
import { createDataGrid3SelectionActions } from './data-grid-3-selection-actions'
import { DataGrid3Skeleton } from './data-grid-3-skeleton'
import { DataGrid3Toolbar } from './data-grid-3-toolbar'
import { resolveDataGrid3Labels } from './labels'
import type {
  DataGrid3Condition,
  DataGrid3Person,
  DataGrid3Props,
  DataGrid3Renewal,
  DataGrid3Risk,
  DataGrid3Segment,
  DataGrid3Stage,
} from './types'

const segments: readonly DataGrid3Segment[] = [
  'enterprise',
  'mid-market',
  'scale',
]
const stages: readonly DataGrid3Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]
const risks: readonly DataGrid3Risk[] = ['critical', 'high', 'medium', 'low']
const noConditions: readonly DataGrid3Condition[] = []
const hiddenFilterColumns = { owner: false, segment: false }

function uniqueOwners(
  renewals: readonly DataGrid3Renewal[],
): DataGrid3Person[] {
  const byId = new Map<string, DataGrid3Person>()
  for (const renewal of renewals) byId.set(renewal.owner.id, renewal.owner)
  return [...byId.values()]
}

export function DataGrid3({
  activeViewId,
  className,
  columnVisibility,
  conditions = noConditions,
  currency,
  density = 'tall',
  error,
  labels: labelsProp,
  locale,
  onAssignOwner,
  onColumnVisibilityChange,
  onConditionsChange,
  onCreate,
  onDensityChange,
  onRetry,
  onRowAction,
  onSaveView,
  onSelectedIdsChange,
  onSortChange,
  onStageUpdate,
  onViewChange,
  onViewCreate,
  owners: ownersProp,
  pageSize = 10,
  pending,
  renewals,
  rowActions,
  selectedIds,
  sort,
  views,
}: Readonly<DataGrid3Props>) {
  const labels = useMemo(() => resolveDataGrid3Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const owners = useMemo(
    () => ownersProp ?? uniqueOwners(renewals),
    [ownersProp, renewals],
  )
  const rowActionRef = useRef(onRowAction)
  useLayoutEffect(() => {
    rowActionRef.current = onRowAction
  })
  const handleRowAction = useCallback(
    (actionId: string, renewalId: string) =>
      rowActionRef.current?.(actionId, renewalId),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const columns = useMemo(
    () =>
      createDataGrid3Columns({
        formatter,
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [formatter, handleRowAction, hasRowMenu, labels, rowActions],
  )

  const fields = useMemo<DataGridConditionFilterField[]>(
    () => [
      { columnId: 'account', kind: 'text', label: labels.fields.account },
      {
        columnId: 'owner',
        kind: 'option',
        label: labels.fields.owner,
        options: owners.map((owner) => ({
          label: owner.label,
          value: owner.id,
        })),
      },
      {
        columnId: 'segment',
        kind: 'option',
        label: labels.fields.segment,
        options: segments.map((id) => ({
          label: labels.segments[id],
          value: id,
        })),
      },
      {
        columnId: 'stage',
        kind: 'option',
        label: labels.fields.stage,
        options: stages.map((id) => ({ label: labels.stages[id], value: id })),
      },
      {
        columnId: 'risk',
        kind: 'option',
        label: labels.fields.risk,
        options: risks.map((id) => ({ label: labels.risks[id], value: id })),
      },
      { columnId: 'arr', kind: 'number', label: labels.fields.arr },
      { columnId: 'health', kind: 'number', label: labels.fields.health },
      { columnId: 'renewal', kind: 'date', label: labels.fields.renewal },
    ],
    [labels, owners],
  )
  const globalFilterFn = useMemo(
    () => createDataGridConditionFilterFn<DataGrid3Renewal>(fields),
    [fields],
  )
  const formatValue = useCallback(
    (field: DataGridConditionField, value: string) => {
      if (field.columnId === 'arr') return formatter.money(Number(value))
      if (field.columnId === 'renewal') return formatter.date(value)
      return (
        field.options?.find((option) => option.value === value)?.label ?? value
      )
    },
    [formatter],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const controlledSelection = useMemo(
    () =>
      selectedIds === undefined
        ? undefined
        : Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const gridVisibility = useMemo(
    () =>
      columnVisibility === undefined
        ? undefined
        : { ...columnVisibility, ...hiddenFilterColumns },
    [columnVisibility],
  )

  const { table } = useDataGrid<DataGrid3Renewal>({
    columns,
    columnVisibility: gridVisibility,
    data: renewals,
    density,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (renewal) => renewal.id,
    globalFilter: conditions,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) => {
          const { owner: _owner, segment: _segment, ...rest } = visibility
          onColumnVisibilityChange(visibilityFromState(rest))
        }
      : undefined,
    onDensityChange: onDensityChange
      ? (next) => onDensityChange(next)
      : undefined,
    onRowSelectionChange: onSelectedIdsChange
      ? (selection) =>
          onSelectedIdsChange(
            Object.keys(selection).filter((id) => selection[id]),
          )
      : undefined,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    pageSize,
    rowSelection: controlledSelection,
    sorting: controlledSorting,
    tableOptions: {
      globalFilterFn,
      initialState: { columnVisibility: hiddenFilterColumns },
    },
  })

  const changeConditions = onConditionsChange
    ? (next: DataGrid3Condition[]) => {
        table.setPageIndex(0)
        onConditionsChange(next)
      }
    : undefined

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid3Skeleton label={labels.loading} />,
  })

  const visible = table.getFilteredRowModel().rows.map((row) => row.original)
  const atRisk = visible.filter(
    (renewal) =>
      renewal.risk === 'critical' || healthLevel(renewal.health) === 'at-risk',
  )
  const description = labels.summary(
    visible.filter((renewal) => renewal.dueInDays <= 30).length,
    atRisk.length,
    formatter.compactMoney(
      atRisk.reduce((total, renewal) => total + renewal.arr, 0),
    ),
  )
  const selectionActions = useMemo(
    () =>
      createDataGrid3SelectionActions({
        labels,
        onAssignOwner,
        onStageUpdate,
        owners,
      }),
    [labels, onAssignOwner, onStageUpdate, owners],
  )

  const toolbarLeft = views?.length ? (
    <GridViewSwitcher
      activeViewId={activeViewId}
      labels={labels}
      locale={locale}
      onViewChange={onViewChange}
      onViewCreate={onViewCreate}
      views={views}
    />
  ) : (
    <CollectionToolbarHeading>
      <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
      <CollectionToolbarDescription>
        {loadState ? undefined : description}
      </CollectionToolbarDescription>
    </CollectionToolbarHeading>
  )

  return (
    <GridFrame
      className={className}
      data-block="data-grid-3"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <DataGrid3Toolbar
            conditions={conditions}
            labels={labels}
            left={toolbarLeft}
            onConditionsChange={changeConditions}
            onCreate={onCreate}
            onSaveView={onSaveView}
            table={table}
          />
        )
      }
    >
      {loadState ?? (
        <>
          {changeConditions ? (
            <DataGridConditionFilters
              conditions={conditions}
              fields={fields}
              formatValue={formatValue}
              labels={labels.conditions}
              onConditionsChange={changeConditions}
              operatorLabels={labels.operators}
            />
          ) : null}
          <DataGrid
            aria-label={labels.title}
            emptyMessage={labels.empty}
            selectionActions={({
              clearSelection,
              selectedCount,
              selectedRows,
            }) => (
              <ActionBar
                actions={selectionActions}
                clearSelectionLabel={labels.clearSelection}
                formatSelection={labels.selectedCount}
                label={labels.selectionActions}
                onClearSelection={clearSelection}
                selectedCount={selectedCount}
                selectedRows={selectedRows}
              />
            )}
            table={table}
          />
        </>
      )}
    </GridFrame>
  )
}
