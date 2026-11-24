import {
  DataGrid8,
  type DataGrid8ColumnVisibility,
  type DataGrid8Density,
  type DataGrid8Filters,
  type DataGrid8Props,
  type DataGrid8Sort,
} from '@tc96/ui/blocks/data/data-grid/data-grid-8'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createDataGrid8Transactions,
  dataGrid8PageSize,
  dataGrid8TotalCount,
  emptyFilters,
  initialSort,
  queryDataGrid8Transactions,
  views,
} from '../fixtures/data-grid-8.ts'
import type { DataGrid8Controls } from './data-grid-8-controls.ts'

interface ComposedDataGrid8Props extends DataGrid8Controls {
  onExport?: DataGrid8Props['onExport']
  onExportSelected?: DataGrid8Props['onExportSelected']
  onFiltersChange?: DataGrid8Props['onFiltersChange']
  onFlag?: DataGrid8Props['onFlag']
  onLoadMore?: DataGrid8Props['onLoadMore']
  onRefresh?: DataGrid8Props['onRefresh']
  onRefund?: DataGrid8Props['onRefund']
  onSearchChange?: DataGrid8Props['onSearchChange']
  onSortChange?: DataGrid8Props['onSortChange']
  onViewChange?: DataGrid8Props['onViewChange']
  onViewCreate?: DataGrid8Props['onViewCreate']
}

const loadDelayMs = 600

export const ComposedDataGrid8 = ({
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
}: Readonly<ComposedDataGrid8Props>) => {
  const [sort, setSort] = useState<DataGrid8Sort | null>(initialSort)
  const [filters, setFilters] = useState<DataGrid8Filters>(emptyFilters)
  const [search, setSearch] = useState('')
  const [visibility, setVisibility] = useState<DataGrid8ColumnVisibility>({})
  const [density, setDensity] = useState<DataGrid8Density>('tall')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeViewId, setActiveViewId] = useState('all')
  const [loaded, setLoaded] = useState(dataGrid8PageSize)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const ledger = useMemo(() => createDataGrid8Transactions(400), [])
  const matching = useMemo(
    () => queryDataGrid8Transactions(ledger, { filters, search, sort }),
    [filters, ledger, search, sort],
  )
  const rows = useMemo(
    () => (empty ? [] : matching.slice(0, loaded)),
    [empty, loaded, matching],
  )
  const total =
    filters.status || filters.method || filters.channel || search
      ? matching.length
      : dataGrid8TotalCount

  const later = (done: () => void) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(done, loadDelayMs)
  }

  return (
    <DataGrid8
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
        setLoaded(dataGrid8PageSize)
        onFiltersChange?.(next)
      }}
      onFlag={bulkActions ? (onFlag ?? (() => undefined)) : undefined}
      onLoadMore={() => {
        onLoadMore?.()
        setLoadingMore(true)
        later(() => {
          setLoaded((current) => current + dataGrid8PageSize)
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
        setLoaded(dataGrid8PageSize)
        onSearchChange?.(next)
      }}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={(next) => {
        setSort(next)
        setLoaded(dataGrid8PageSize)
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
