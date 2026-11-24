'use client'

import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import type { DataTableGroupCellContext } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-group-row'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../shared/format'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import { TableToolbar } from '../shared/table-toolbar'
import { resolveTable6Labels } from './labels'
import { sortByRegion, summarizeRegion } from './region-summary'
import { createTable6Columns, Table6Nrr } from './table-6-columns'
import { Table6Kpis } from './table-6-kpis'
import { Table6Skeleton } from './table-6-skeleton'
import { Table6Toolbar } from './table-6-toolbar'
import type { Table6Account, Table6Props } from './types'

export function Table6({
  accounts,
  className,
  collapsedRegionIds,
  currency,
  density = 'medium',
  error,
  labels: labelsProp,
  locale,
  onCollapsedRegionIdsChange,
  onDensityChange,
  onExport,
  onRetry,
  onRowAction,
  pending,
  regions,
  rowActions,
  summary,
}: Readonly<Table6Props>) {
  const labels = useMemo(() => resolveTable6Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const rowActionRef = useRef(onRowAction)
  useLayoutEffect(() => {
    rowActionRef.current = onRowAction
  })
  const handleRowAction = useCallback(
    (actionId: string, accountId: string) =>
      rowActionRef.current?.(actionId, accountId),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const columns = useMemo(
    () =>
      createTable6Columns({
        formatter,
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [formatter, handleRowAction, hasRowMenu, labels, rowActions],
  )

  const regionIndex = useMemo(() => {
    const byId = new Map(regions.map((region) => [region.id, region]))
    const byLabel = new Map(regions.map((region) => [region.label, region]))
    return { byId, byLabel }
  }, [regions])
  const rows = useMemo(
    () =>
      sortByRegion(
        accounts,
        regions.map((region) => region.id),
      ),
    [accounts, regions],
  )
  const presentRegionIds = useMemo(() => {
    const ids = new Set(accounts.map((account) => account.regionId))
    return regions
      .filter((region) => ids.has(region.id))
      .map((region) => region.id)
  }, [accounts, regions])

  const getRowGroup = useCallback(
    (account: Table6Account) =>
      regionIndex.byId.get(account.regionId)?.label ?? null,
    [regionIndex],
  )
  const collapsedGroupIds = useMemo(
    () =>
      collapsedRegionIds?.flatMap((id) => {
        const region = regionIndex.byId.get(id)
        return region ? [region.label] : []
      }),
    [collapsedRegionIds, regionIndex],
  )
  const handleCollapsedGroupIdsChange = useCallback(
    (groups: readonly string[]) =>
      onCollapsedRegionIdsChange?.(
        groups.flatMap((group) => {
          const region = regionIndex.byLabel.get(group)
          return region ? [region.id] : []
        }),
      ),
    [onCollapsedRegionIdsChange, regionIndex],
  )
  const allCollapsed =
    presentRegionIds.length > 0 &&
    presentRegionIds.every((id) => collapsedRegionIds?.includes(id))

  const renderGroupCell = useCallback(
    ({
      column,
      group,
      rows: groupRows,
    }: DataTableGroupCellContext<Table6Account>) => {
      if (column.id === 'owner')
        return (
          <span className="truncate font-normal text-muted-foreground">
            {regionIndex.byLabel.get(group)?.description}
          </span>
        )
      if (column.id !== 'arr' && column.id !== 'nrr' && column.id !== 'renewal')
        return null
      const totals = summarizeRegion(groupRows.map((row) => row.original))
      if (column.id === 'arr')
        return (
          <span className="font-semibold tabular-nums" data-subtotal="arr">
            {formatter.money(totals.arr)}
          </span>
        )
      if (column.id === 'nrr')
        return totals.nrr === null ? null : (
          <span data-subtotal="nrr">
            <Table6Nrr
              formatter={formatter}
              labels={labels}
              value={totals.nrr}
            />
          </span>
        )
      return totals.nextRenewal ? (
        <span className="font-normal tabular-nums" data-subtotal="renewal">
          {labels.nextRenewal(formatter.date(totals.nextRenewal))}
        </span>
      ) : null
    },
    [formatter, labels, regionIndex],
  )

  const { table } = useDataTable<Table6Account>({
    columns,
    data: rows,
    density,
    enableSorting: false,
    getRowId: (account) => account.id,
    onDensityChange,
  })

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table6Skeleton label={labels.loading} />,
  })

  return (
    <TableFrame
      className={className}
      data-block="table-6"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            description={labels.description}
            title={labels.title}
          />
        ) : (
          <Table6Toolbar
            allCollapsed={allCollapsed}
            labels={labels}
            onExport={onExport}
            onToggleAll={
              onCollapsedRegionIdsChange
                ? () =>
                    onCollapsedRegionIdsChange(
                      allCollapsed ? [] : presentRegionIds,
                    )
                : undefined
            }
            table={table}
          />
        )
      }
    >
      {loadState ?? (
        <>
          {summary ? (
            <Table6Kpis
              formatter={formatter}
              labels={labels}
              summary={summary}
            />
          ) : null}
          <DataTable
            aria-label={labels.title}
            collapsedGroupIds={collapsedGroupIds}
            emptyMessage={labels.empty}
            getGroupToggleLabel={labels.groupToggle}
            getRowGroup={getRowGroup}
            onCollapsedGroupIdsChange={
              onCollapsedRegionIdsChange
                ? handleCollapsedGroupIdsChange
                : undefined
            }
            renderGroupCell={renderGroupCell}
            table={table}
          />
        </>
      )}
    </TableFrame>
  )
}
