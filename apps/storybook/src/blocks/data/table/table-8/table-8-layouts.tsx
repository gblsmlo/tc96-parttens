import {
  Table8,
  type Table8ColumnVisibility,
  type Table8Density,
  type Table8Filters,
  type Table8Props,
  type Table8Sort,
} from '@tc96/ui/blocks/data/table/table-8'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createTable8Transactions,
  emptyFilters,
  initialSort,
  queryTable8Transactions,
  table8PageSize,
  table8TotalCount,
  views,
} from '../fixtures/table-8.ts'
import type { Table8Controls } from './table-8-controls.ts'

interface ComposedTable8Props extends Table8Controls {
  onExport?: Table8Props['onExport']
  onExportSelected?: Table8Props['onExportSelected']
  onFiltersChange?: Table8Props['onFiltersChange']
  onFlag?: Table8Props['onFlag']
  onLoadMore?: Table8Props['onLoadMore']
  onRefresh?: Table8Props['onRefresh']
  onRefund?: Table8Props['onRefund']
  onSearchChange?: Table8Props['onSearchChange']
  onSortChange?: Table8Props['onSortChange']
  onViewChange?: Table8Props['onViewChange']
  onViewCreate?: Table8Props['onViewCreate']
}

const loadDelayMs = 600

export const ComposedTable8 = ({
  bulkActions,
  empty,
  locale,
  onExport,
  onExportSelected,
  onFiltersChange,
  onFlag,
  onLoadMore,
  onRefresh,
  onRefund,
  onSearchChange,
  onSortChange,
  onViewChange,
  onViewCreate,
  savedViews,
  title,
}: Readonly<ComposedTable8Props>) => {
  const [sort, setSort] = useState<Table8Sort | null>(initialSort)
  const [filters, setFilters] = useState<Table8Filters>(emptyFilters)
  const [search, setSearch] = useState('')
  const [visibility, setVisibility] = useState<Table8ColumnVisibility>({})
  const [density, setDensity] = useState<Table8Density>('tall')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')
  const [loaded, setLoaded] = useState(table8PageSize)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const ledger = useMemo(() => createTable8Transactions(400), [])
  const matching = useMemo(
    () => queryTable8Transactions(ledger, { filters, search, sort }),
    [filters, ledger, search, sort],
  )
  const rows = useMemo(
    () => (empty ? [] : matching.slice(0, loaded)),
    [empty, loaded, matching],
  )
  const total =
    filters.status || filters.method || filters.channel || search
      ? matching.length
      : table8TotalCount

  const later = (done: () => void) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(done, loadDelayMs)
  }

  return (
    <Table8
      activeViewId={savedViews ? activeViewId : undefined}
      columnVisibility={visibility}
      density={density}
      filters={filters}
      hasMore={rows.length < matching.length}
      labels={{ title }}
      loadingMore={loadingMore}
      locale={locale}
      onColumnVisibilityChange={setVisibility}
      onDensityChange={setDensity}
      onExport={onExport ?? (() => undefined)}
      onExportSelected={
        bulkActions ? (onExportSelected ?? (() => undefined)) : undefined
      }
      onFiltersChange={(next) => {
        setFilters(next)
        setLoaded(table8PageSize)
        onFiltersChange?.(next)
      }}
      onFlag={bulkActions ? (onFlag ?? (() => undefined)) : undefined}
      onLoadMore={() => {
        onLoadMore?.()
        setLoadingMore(true)
        later(() => {
          setLoaded((current) => current + table8PageSize)
          setLoadingMore(false)
        })
      }}
      onRefresh={() => {
        onRefresh?.()
        setRefreshing(true)
        later(() => setRefreshing(false))
      }}
      onRefund={bulkActions ? (onRefund ?? (() => undefined)) : undefined}
      onSearchChange={(next) => {
        setSearch(next)
        setLoaded(table8PageSize)
        onSearchChange?.(next)
      }}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={(next) => {
        setSort(next)
        setLoaded(table8PageSize)
        onSortChange?.(next)
      }}
      onViewChange={
        savedViews
          ? (id) => {
              setActiveViewId(id)
              onViewChange?.(id)
            }
          : undefined
      }
      onViewCreate={
        savedViews ? (onViewCreate ?? (() => undefined)) : undefined
      }
      refreshing={refreshing}
      search={search}
      selectedIds={selectedIds}
      sort={sort}
      totalCount={empty ? 0 : total}
      transactions={rows}
      views={savedViews ? views : undefined}
    />
  )
}
