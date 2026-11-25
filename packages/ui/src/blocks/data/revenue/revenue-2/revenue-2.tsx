'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import {
  type DataGridConditionFilterField,
  DataGridConditionFilters,
} from '@tc96/ui/patterns/data-grid/components/data-grid-condition-filters'
import { DataGridPagination } from '@tc96/ui/patterns/data-grid/components/data-grid-pagination'
import {
  createDataGridConditionFilterFn,
  type DataGridConditionField,
} from '@tc96/ui/patterns/data-grid/lib/data-grid-conditions'
import { DataTable } from '@tc96/ui/patterns/data-table/data-table'
import type { DataTableFeatures } from '@tc96/ui/patterns/data-table/data-table-features'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../../shared/table/format'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/table/table-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import { TableViewSwitcher } from '../../shared/table/table-view-switcher'
import { resolveRevenue2Labels } from './labels'
import { healthLevel } from './revenue-2-cells'
import { createRevenue2Columns } from './revenue-2-columns'
import { createRevenue2SelectionActions } from './revenue-2-selection-actions'
import { Revenue2Skeleton } from './revenue-2-skeleton'
import { Revenue2Toolbar } from './revenue-2-toolbar'
import type {
  Revenue2Condition,
  Revenue2Person,
  Revenue2Props,
  Revenue2Renewal,
  Revenue2Risk,
  Revenue2Segment,
  Revenue2Stage,
} from './types'

const segments: readonly Revenue2Segment[] = [
  'enterprise',
  'mid-market',
  'scale',
]
const stages: readonly Revenue2Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]
const risks: readonly Revenue2Risk[] = ['critical', 'high', 'medium', 'low']
const noConditions: readonly Revenue2Condition[] = []
const hiddenFilterColumns = { owner: false, segment: false }

function uniqueOwners(renewals: readonly Revenue2Renewal[]): Revenue2Person[] {
  const byId = new Map<string, Revenue2Person>()
  for (const renewal of renewals) byId.set(renewal.owner.id, renewal.owner)
  return [...byId.values()]
}

export function Revenue2({
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
}: Readonly<Revenue2Props>) {
  const labels = useMemo(() => resolveRevenue2Labels(labelsProp), [labelsProp])
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
      createRevenue2Columns({
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
    () =>
      createDataGridConditionFilterFn<Revenue2Renewal, DataTableFeatures>(
        fields,
      ),
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
  const tableVisibility = useMemo(
    () =>
      columnVisibility === undefined
        ? undefined
        : { ...columnVisibility, ...hiddenFilterColumns },
    [columnVisibility],
  )

  const { table } = useDataTable<Revenue2Renewal>({
    columns,
    columnVisibility: tableVisibility,
    data: renewals,
    density,
    enablePagination: true,
    enableRowSelection: true,
    enableSorting: true,
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
    ? (next: Revenue2Condition[]) => {
        table.setPageIndex(0)
        onConditionsChange(next)
      }
    : undefined

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Revenue2Skeleton label={labels.loading} />,
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
      createRevenue2SelectionActions({
        labels,
        onAssignOwner,
        onStageUpdate,
        owners,
      }),
    [labels, onAssignOwner, onStageUpdate, owners],
  )

  const toolbarLeft = views?.length ? (
    <TableViewSwitcher
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
    <TableFrame
      className={className}
      data-block="revenue-2"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Revenue2Toolbar
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
          <DataTable
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
          <DataGridPagination table={table} />
        </>
      )}
    </TableFrame>
  )
}
