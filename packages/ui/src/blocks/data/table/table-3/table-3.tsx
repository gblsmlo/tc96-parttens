'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import {
  type DataGridConditionFilterField,
  DataGridConditionFilters,
} from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-condition-filters'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import {
  createDataGridConditionFilterFn,
  type DataGridConditionField,
} from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import type { DataTableFeatures } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../shared/format'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/table-state'
import { TableToolbar } from '../shared/table-toolbar'
import { TableViewSwitcher } from '../shared/table-view-switcher'
import { resolveTable3Labels } from './labels'
import { healthLevel } from './table-3-cells'
import { createTable3Columns } from './table-3-columns'
import { createTable3SelectionActions } from './table-3-selection-actions'
import { Table3Skeleton } from './table-3-skeleton'
import { Table3Toolbar } from './table-3-toolbar'
import type {
  Table3Condition,
  Table3Person,
  Table3Props,
  Table3Renewal,
  Table3Risk,
  Table3Segment,
  Table3Stage,
} from './types'

const segments: readonly Table3Segment[] = ['enterprise', 'mid-market', 'scale']
const stages: readonly Table3Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]
const risks: readonly Table3Risk[] = ['critical', 'high', 'medium', 'low']
const noConditions: readonly Table3Condition[] = []
const hiddenFilterColumns = { owner: false, segment: false }

function uniqueOwners(renewals: readonly Table3Renewal[]): Table3Person[] {
  const byId = new Map<string, Table3Person>()
  for (const renewal of renewals) byId.set(renewal.owner.id, renewal.owner)
  return [...byId.values()]
}

export function Table3({
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
}: Readonly<Table3Props>) {
  const labels = useMemo(() => resolveTable3Labels(labelsProp), [labelsProp])
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
      createTable3Columns({
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
      createDataGridConditionFilterFn<Table3Renewal, DataTableFeatures>(fields),
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

  const { table } = useDataTable<Table3Renewal>({
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
    ? (next: Table3Condition[]) => {
        table.setPageIndex(0)
        onConditionsChange(next)
      }
    : undefined

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table3Skeleton label={labels.loading} />,
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
      createTable3SelectionActions({
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
      data-block="table-3"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Table3Toolbar
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
