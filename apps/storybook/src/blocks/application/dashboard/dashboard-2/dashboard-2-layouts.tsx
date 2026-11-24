import {
  Dashboard2,
  type Dashboard2Props,
  type Dashboard2Sort,
} from '@tc96/blocks/application/dashboard/dashboard-2'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import {
  channels,
  initialSort,
  kpis,
  orderActions,
  orders,
  sales,
  sortOrders,
} from '../fixtures/dashboard-2.ts'
import {
  breadcrumbsFor,
  initialPeriod,
  matchesSearch,
  paginate,
  periodOptions,
} from '../fixtures/shared.ts'
import type { Dashboard2Controls } from './dashboard-2-controls.ts'

export const dashboard2PageSize = 4

interface ComposedDashboard2Props extends Dashboard2Controls {
  onExport?: Dashboard2Props['onExport']
  onPageChange?: Dashboard2Props['onPageChange']
  onPeriodChange?: Dashboard2Props['onPeriodChange']
  onRetry?: Dashboard2Props['onRetry']
  onRowAction?: Dashboard2Props['onRowAction']
  onSearchChange?: Dashboard2Props['onSearchChange']
  onSortChange?: Dashboard2Props['onSortChange']
}

export const ComposedDashboard2 = ({
  empty,
  error,
  onExport,
  onPageChange,
  onPeriodChange,
  onRetry,
  onRowAction,
  onSearchChange,
  onSortChange,
  pending,
  sparklines,
  tableTools,
  title,
}: Readonly<ComposedDashboard2Props>) => {
  const [sort, setSort] = useState<Dashboard2Sort>(initialSort)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(initialPeriod)
  const sorted = sortOrders(
    (empty ? [] : orders).filter((order) =>
      matchesSearch(search, order.number, order.customer),
    ),
    sort,
  )
  const visible = tableTools
    ? paginate(sorted, page, dashboard2PageSize)
    : { pagination: undefined, rows: sorted }

  return (
    <Dashboard2
      breadcrumbs={breadcrumbsFor(title)}
      channels={channels}
      error={error}
      kpis={
        empty
          ? []
          : kpis.map((kpi) =>
              sparklines ? kpi : { ...kpi, sparkline: undefined },
            )
      }
      labels={{ title }}
      onExport={onExport ?? (() => undefined)}
      onPageChange={
        tableTools
          ? (next) => {
              setPage(next)
              onPageChange?.(next)
            }
          : undefined
      }
      onPeriodChange={(next) => {
        setPeriod(next)
        onPeriodChange?.(next)
      }}
      onRetry={onRetry}
      onRowAction={tableTools ? (onRowAction ?? (() => undefined)) : undefined}
      onSearchChange={
        tableTools
          ? (next) => {
              setSearch(next)
              setPage(1)
              onSearchChange?.(next)
            }
          : undefined
      }
      onSortChange={(next) => {
        setSort(next)
        setPage(1)
        onSortChange?.(next)
      }}
      orders={visible.rows}
      pagination={visible.pagination}
      pending={pending}
      period={period}
      periodOptions={periodOptions}
      renderLink={renderAnchor}
      rowActions={orderActions}
      sales={empty ? [] : sales}
      search={search}
      sort={sort}
    />
  )
}
