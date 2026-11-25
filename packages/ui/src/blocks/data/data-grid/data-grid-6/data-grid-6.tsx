'use client'

import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import type { DataGridGroupCellContext } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-group-row'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter } from '../shared/format'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { GridToolbarHeading } from '../shared/grid-toolbar-heading'
import { createDataGrid6Columns, DataGrid6Nrr } from './data-grid-6-columns'
import { DataGrid6Kpis } from './data-grid-6-kpis'
import { DataGrid6Skeleton } from './data-grid-6-skeleton'
import { DataGrid6Toolbar } from './data-grid-6-toolbar'
import { resolveDataGrid6Labels } from './labels'
import { sortByRegion, summarizeRegion } from './region-summary'
import type { DataGrid6Account, DataGrid6Props } from './types'

export function DataGrid6({
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
}: Readonly<DataGrid6Props>) {
  const labels = useMemo(() => resolveDataGrid6Labels(labelsProp), [labelsProp])
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
      createDataGrid6Columns({
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
    (account: DataGrid6Account) =>
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
    }: DataGridGroupCellContext<DataGrid6Account>) => {
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
            <DataGrid6Nrr
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

  const { table } = useDataGrid<DataGrid6Account>({
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
    skeleton: <DataGrid6Skeleton label={labels.loading} />,
  })

  return (
    <GridFrame
      className={className}
      data-block="data-grid-6"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            left={
              <GridToolbarHeading
                description={labels.description}
                title={labels.title}
              />
            }
          />
        ) : (
          <DataGrid6Toolbar
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
            <DataGrid6Kpis
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
            pagination={false}
            renderGroupCell={renderGroupCell}
            table={table}
          />
        </>
      )}
    </GridFrame>
  )
}
