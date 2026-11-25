import {
  Finance2,
  type Finance2ColumnVisibility,
  type Finance2Density,
  type Finance2Filters,
  type Finance2Props,
  type Finance2Sort,
} from '@tc96/ui/blocks/data/finance/finance-2'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createFinance2Transactions,
  emptyFilters,
  finance2PageSize,
  finance2TotalCount,
  initialSort,
  queryFinance2Transactions,
  views,
} from '../fixtures/finance-2.ts'
import type { Finance2Controls } from './finance-2-controls.ts'

interface ComposedFinance2Props extends Finance2Controls {
  onExport?: Finance2Props['onExport']
  onExportSelected?: Finance2Props['onExportSelected']
  onFiltersChange?: Finance2Props['onFiltersChange']
  onFlag?: Finance2Props['onFlag']
  onLoadMore?: Finance2Props['onLoadMore']
  onRefresh?: Finance2Props['onRefresh']
  onRefund?: Finance2Props['onRefund']
  onSearchChange?: Finance2Props['onSearchChange']
  onSortChange?: Finance2Props['onSortChange']
  onViewChange?: Finance2Props['onViewChange']
  onViewCreate?: Finance2Props['onViewCreate']
}

const loadDelayMs = 600

export const ComposedFinance2 = ({
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
}: Readonly<ComposedFinance2Props>) => {
  const [sort, setSort] = useState<Finance2Sort | null>(initialSort)
  const [filters, setFilters] = useState<Finance2Filters>(emptyFilters)
  const [search, setSearch] = useState('')
  const [visibility, setVisibility] = useState<Finance2ColumnVisibility>({})
  const [density, setDensity] = useState<Finance2Density>('tall')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')
  const [loaded, setLoaded] = useState(finance2PageSize)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const ledger = useMemo(() => createFinance2Transactions(400), [])
  const matching = useMemo(
    () => queryFinance2Transactions(ledger, { filters, search, sort }),
    [filters, ledger, search, sort],
  )
  const rows = useMemo(
    () => (empty ? [] : matching.slice(0, loaded)),
    [empty, loaded, matching],
  )
  const total =
    filters.status || filters.method || filters.channel || search
      ? matching.length
      : finance2TotalCount

  const later = (done: () => void) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(done, loadDelayMs)
  }

  return (
    <Finance2
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
        setLoaded(finance2PageSize)
        onFiltersChange?.(next)
      }}
      onFlag={bulkActions ? (onFlag ?? (() => undefined)) : undefined}
      onLoadMore={() => {
        onLoadMore?.()
        setLoadingMore(true)
        later(() => {
          setLoaded((current) => current + finance2PageSize)
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
        setLoaded(finance2PageSize)
        onSearchChange?.(next)
      }}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={(next) => {
        setSort(next)
        setLoaded(finance2PageSize)
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
