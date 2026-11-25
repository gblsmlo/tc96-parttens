'use client'

import { DataTable } from '@tc96/ui/patterns/data-table/data-table'
import type { DataTableGroupCellContext } from '@tc96/ui/patterns/data-table/data-table-group-row'
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
import { TableToolbar } from '../../shared/table/table-toolbar'
import { resolveRevenue4Labels } from './labels'
import { sortByRegion, summarizeRegion } from './region-summary'
import { createRevenue4Columns, Revenue4Nrr } from './revenue-4-columns'
import { Revenue4Kpis } from './revenue-4-kpis'
import { Revenue4Skeleton } from './revenue-4-skeleton'
import { Revenue4Toolbar } from './revenue-4-toolbar'
import type { Revenue4Account, Revenue4Props } from './types'

export function Revenue4({
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
}: Readonly<Revenue4Props>) {
  const labels = useMemo(() => resolveRevenue4Labels(labelsProp), [labelsProp])
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
      createRevenue4Columns({
        formatter,
        labels,
        locale,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [formatter, handleRowAction, hasRowMenu, labels, locale, rowActions],
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
    (account: Revenue4Account) =>
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
    }: DataTableGroupCellContext<Revenue4Account>) => {
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
            <Revenue4Nrr
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

  const { table } = useDataTable<Revenue4Account>({
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
    skeleton: <Revenue4Skeleton label={labels.loading} />,
  })

  return (
    <TableFrame
      className={className}
      data-block="revenue-4"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            left={
              <CollectionToolbarHeading>
                <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
                <CollectionToolbarDescription>
                  {labels.description}
                </CollectionToolbarDescription>
              </CollectionToolbarHeading>
            }
          />
        ) : (
          <Revenue4Toolbar
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
            <Revenue4Kpis
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
