import {
  Dashboard3,
  type Dashboard3Props,
} from '@tc96/blocks/application/dashboard/dashboard-3'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { crew, forecast, kpis, queue } from '../fixtures/dashboard-3.ts'
import {
  breadcrumbsFor,
  initialPeriod,
  matchesSearch,
  paginate,
  periodOptions,
} from '../fixtures/shared.ts'
import type { Dashboard3Controls } from './dashboard-3-controls.ts'

export const dashboard3PageSize = 3

interface ComposedDashboard3Props extends Dashboard3Controls {
  onAction?: Dashboard3Props['onAction']
  onExport?: Dashboard3Props['onExport']
  onPageChange?: Dashboard3Props['onPageChange']
  onPeriodChange?: Dashboard3Props['onPeriodChange']
  onRetry?: Dashboard3Props['onRetry']
  onSearchChange?: Dashboard3Props['onSearchChange']
}

export const ComposedDashboard3 = ({
  actions,
  empty,
  error,
  onAction,
  onExport,
  onPageChange,
  onPeriodChange,
  onRetry,
  onSearchChange,
  pending,
  tableTools,
  title,
}: Readonly<ComposedDashboard3Props>) => {
  const [done, setDone] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(initialPeriod)
  const searched = (empty ? [] : crew).filter((member) =>
    matchesSearch(search, member.name, member.role),
  )
  const visible = tableTools
    ? paginate(searched, page, dashboard3PageSize)
    : { pagination: undefined, rows: searched }

  return (
    <Dashboard3
      breadcrumbs={breadcrumbsFor(title)}
      crew={visible.rows}
      error={error}
      forecast={empty ? [] : forecast}
      kpis={empty ? [] : kpis}
      labels={{ title }}
      onAction={
        actions
          ? (id) => {
              setDone((current) => [...current, id])
              onAction?.(id)
            }
          : undefined
      }
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
      queue={empty ? [] : queue.filter((item) => !done.includes(item.id))}
      renderLink={renderAnchor}
      search={search}
    />
  )
}
