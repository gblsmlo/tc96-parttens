import {
  Finance1,
  type Finance1ColumnVisibility,
  type Finance1Density,
  type Finance1Filters,
  type Finance1Props,
  type Finance1Sort,
} from '@tc96/ui/blocks/data/finance/finance-1'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createFinance1Transactions,
  emptyFilters,
  finance1PageSize,
  finance1TotalCount,
  initialSort,
  queryFinance1Transactions,
  views,
} from '../fixtures/finance-1.ts'
import type { Finance1Controls } from './finance-1-controls.ts'

interface ComposedFinance1Props extends Finance1Controls {
  onExport?: Finance1Props['onExport']
  onExportSelected?: Finance1Props['onExportSelected']
  onFiltersChange?: Finance1Props['onFiltersChange']
  onFlag?: Finance1Props['onFlag']
  onLoadMore?: Finance1Props['onLoadMore']
  onRefresh?: Finance1Props['onRefresh']
  onRefund?: Finance1Props['onRefund']
  onSearchChange?: Finance1Props['onSearchChange']
  onSortChange?: Finance1Props['onSortChange']
  onViewChange?: Finance1Props['onViewChange']
  onViewCreate?: Finance1Props['onViewCreate']
}

const loadDelayMs = 600

export const ComposedFinance1 = ({
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
}: Readonly<ComposedFinance1Props>) => {
  const [sort, setSort] = useState<Finance1Sort | null>(initialSort)
  const [filters, setFilters] = useState<Finance1Filters>(emptyFilters)
  const [search, setSearch] = useState('')
  const [visibility, setVisibility] = useState<Finance1ColumnVisibility>({})
  const [density, setDensity] = useState<Finance1Density>('tall')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')
  const [loaded, setLoaded] = useState(finance1PageSize)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const ledger = useMemo(() => createFinance1Transactions(400), [])
  const matching = useMemo(
    () => queryFinance1Transactions(ledger, { filters, search, sort }),
    [filters, ledger, search, sort],
  )
  const rows = useMemo(
    () => (empty ? [] : matching.slice(0, loaded)),
    [empty, loaded, matching],
  )
  const total =
    filters.status || filters.method || filters.channel || search
      ? matching.length
      : finance1TotalCount

  const later = (done: () => void) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(done, loadDelayMs)
  }

  return (
    <Finance1
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
        setLoaded(finance1PageSize)
        onFiltersChange?.(next)
      }}
      onFlag={bulkActions ? (onFlag ?? (() => undefined)) : undefined}
      onLoadMore={() => {
        onLoadMore?.()
        setLoadingMore(true)
        later(() => {
          setLoaded((current) => current + finance1PageSize)
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
        setLoaded(finance1PageSize)
        onSearchChange?.(next)
      }}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={(next) => {
        setSort(next)
        setLoaded(finance1PageSize)
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
