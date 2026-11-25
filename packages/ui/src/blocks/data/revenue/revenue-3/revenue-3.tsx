'use client'

import { DataGrid } from '@tc96/ui/patterns/data-grid/components/data-grid'
import type { DataGridGroupCellContext } from '@tc96/ui/patterns/data-grid/components/data-grid-group-row'
import { useDataGrid } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../../shared/grid/format'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import { resolveRevenue3Labels } from './labels'
import { sortByRegion, summarizeRegion } from './region-summary'
import { createRevenue3Columns, Revenue3Nrr } from './revenue-3-columns'
import { Revenue3Kpis } from './revenue-3-kpis'
import { Revenue3Skeleton } from './revenue-3-skeleton'
import { Revenue3Toolbar } from './revenue-3-toolbar'
import type { Revenue3Account, Revenue3Props } from './types'

export function Revenue3({
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
}: Readonly<Revenue3Props>) {
  const labels = useMemo(() => resolveRevenue3Labels(labelsProp), [labelsProp])
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
      createRevenue3Columns({
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
    (account: Revenue3Account) =>
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
    }: DataGridGroupCellContext<Revenue3Account>) => {
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
            <Revenue3Nrr
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

  const { table } = useDataGrid<Revenue3Account>({
    columns,
    data: rows,
    density,
    enableSorting: false,
    getRowId: (account) => account.id,
    onDensityChange,
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Revenue3Skeleton label={labels.loading} />,
  })

  return (
    <GridFrame
      className={className}
      data-block="revenue-3"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
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
          <Revenue3Toolbar
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
            <Revenue3Kpis
              formatter={formatter}
              labels={labels}
              summary={summary}
            />
          ) : null}
          <DataGrid
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
            showPagination={false}
            renderGroupCell={renderGroupCell}
            table={table}
          />
        </>
      )}
    </GridFrame>
  )
}
