import {
  Dashboard1,
  type Dashboard1Props,
} from '@tc96/ui/blocks/application/dashboard/dashboard-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import {
  capacity,
  countFilterOptions,
  exceptions,
  filterExceptions,
  kpis,
  reasons,
} from '../fixtures/dashboard-1.ts'
import {
  breadcrumbsFor,
  initialPeriod,
  matchesSearch,
  paginate,
  periodOptions,
  rowActions,
} from '../fixtures/shared.ts'
import type { Dashboard1Controls } from './dashboard-1-controls.ts'

export const dashboard1PageSize = 4

interface ComposedDashboard1Props extends Dashboard1Controls {
  onExport?: Dashboard1Props['onExport']
  onFilterChange?: Dashboard1Props['onFilterChange']
  onPageChange?: Dashboard1Props['onPageChange']
  onPeriodChange?: Dashboard1Props['onPeriodChange']
  onRetry?: Dashboard1Props['onRetry']
  onRowAction?: Dashboard1Props['onRowAction']
  onSearchChange?: Dashboard1Props['onSearchChange']
}

export const ComposedDashboard1 = ({
  deltas,
  empty,
  error,
  onExport,
  onFilterChange,
  onPageChange,
  onPeriodChange,
  onRetry,
  onRowAction,
  onSearchChange,
  pending,
  tableTools,
  title,
}: Readonly<ComposedDashboard1Props>) => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(initialPeriod)
  const searched = (empty ? [] : exceptions).filter((row) =>
    matchesSearch(search, row.order, row.hub, row.reason),
  )
  const filtered = filterExceptions(searched, filter)
  const visible = tableTools
    ? paginate(filtered, page, dashboard1PageSize)
    : { pagination: undefined, rows: filtered }

  return (
    <Dashboard1
      breadcrumbs={breadcrumbsFor(title)}
      capacity={empty ? [] : capacity}
      error={error}
      exceptions={visible.rows}
      filter={filter}
      filterOptions={countFilterOptions(searched)}
      kpis={
        empty
          ? []
          : kpis.map((kpi) => (deltas ? kpi : { ...kpi, delta: undefined }))
      }
      labels={{ title }}
      onExport={onExport ?? (() => undefined)}
      onFilterChange={(next) => {
        setFilter(next)
        setPage(1)
        onFilterChange?.(next)
      }}
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
      pagination={visible.pagination}
      pending={pending}
      period={period}
      periodOptions={periodOptions}
      reasons={empty ? [] : reasons}
      renderLink={renderAnchor}
      rowActions={rowActions}
      search={search}
    />
  )
}
