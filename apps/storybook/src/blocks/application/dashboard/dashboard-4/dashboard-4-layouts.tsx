import {
  Dashboard4,
  type Dashboard4Props,
  type Dashboard4Sort,
} from '@tc96/blocks/application/dashboard/dashboard-4'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import {
  filterModules,
  filterOptionsFor,
  initialFilter,
  initialSort,
  metrics,
  moduleActions,
  modules,
  pageModules,
  sortModules,
  team,
} from '../fixtures/dashboard-4.ts'
import { matchesSearch } from '../fixtures/shared.ts'
import type { Dashboard4Controls } from './dashboard-4-controls.ts'

export const dashboard4PageSize = 10

export const dashboard4Breadcrumbs = [
  { href: '/', label: 'Início' },
  { label: 'Workspace' },
]

interface ComposedDashboard4Props extends Dashboard4Controls {
  onAddModule?: Dashboard4Props['onAddModule']
  onFavoriteChange?: Dashboard4Props['onFavoriteChange']
  onFilterChange?: Dashboard4Props['onFilterChange']
  onInvite?: Dashboard4Props['onInvite']
  onOpen?: Dashboard4Props['onOpen']
  onPageChange?: Dashboard4Props['onPageChange']
  onRetry?: Dashboard4Props['onRetry']
  onRowAction?: Dashboard4Props['onRowAction']
  onSearchChange?: Dashboard4Props['onSearchChange']
  onSortChange?: Dashboard4Props['onSortChange']
}

export const ComposedDashboard4 = ({
  empty,
  error,
  onAddModule,
  onFavoriteChange,
  onFilterChange,
  onInvite,
  onOpen,
  onPageChange,
  onRetry,
  onRowAction,
  onSearchChange,
  onSortChange,
  pending,
  rowActions,
  tableTools,
  team: showTeam,
  title,
}: Readonly<ComposedDashboard4Props>) => {
  const [sort, setSort] = useState<Dashboard4Sort>(initialSort)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(initialFilter)
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState(
    () => new Set(modules.filter((row) => row.favorite).map((row) => row.id)),
  )
  const source = (empty ? [] : modules).map((row) => ({
    ...row,
    favorite: favorites.has(row.id),
  }))
  const searched = source.filter((row) =>
    matchesSearch(search, row.name, row.owner.label, row.domain),
  )
  const sorted = sortModules(
    tableTools ? filterModules(searched, filter) : searched,
    sort,
  )
  const visible = tableTools
    ? pageModules(sorted, page, dashboard4PageSize)
    : { pagination: undefined, rows: sorted }

  return (
    <Dashboard4
      breadcrumbs={dashboard4Breadcrumbs}
      currency="BRL"
      error={error}
      filter={filter}
      filterOptions={filterOptionsFor(searched)}
      labels={{ title }}
      metrics={empty ? [] : metrics}
      modules={visible.rows}
      onAddModule={tableTools ? (onAddModule ?? (() => undefined)) : undefined}
      onFavoriteChange={
        rowActions
          ? (id, favorite) => {
              setFavorites((current) => {
                const next = new Set(current)
                if (favorite) next.add(id)
                else next.delete(id)
                return next
              })
              onFavoriteChange?.(id, favorite)
            }
          : undefined
      }
      onFilterChange={
        tableTools
          ? (next) => {
              setFilter(next)
              setPage(1)
              onFilterChange?.(next)
            }
          : undefined
      }
      onInvite={showTeam ? (onInvite ?? (() => undefined)) : undefined}
      onOpen={rowActions ? (onOpen ?? (() => undefined)) : undefined}
      onPageChange={
        tableTools
          ? (next) => {
              setPage(next)
              onPageChange?.(next)
            }
          : undefined
      }
      onRetry={onRetry}
      onRowAction={rowActions ? (onRowAction ?? (() => undefined)) : undefined}
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
      pagination={visible.pagination}
      pending={pending}
      renderLink={renderAnchor}
      rowActions={moduleActions}
      search={search}
      sort={sort}
      team={showTeam ? team : undefined}
    />
  )
}
