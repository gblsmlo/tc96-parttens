import {
  Legal9,
  type Legal9BillingModel,
  type Legal9GroupBy,
  type Legal9Mode,
  type Legal9Props,
  type Legal9Record,
  type Legal9Sort,
  type Legal9Status,
} from '@tc96/ui/blocks/data/legal/legal-9'
import { useEffect, useMemo, useState } from 'react'
import { owners, records, savedViews } from '../fixtures/legal-9.ts'
import type { Legal9Controls } from './legal-9-controls.ts'

type Callbacks = Pick<
  Legal9Props,
  | 'onBillingModelChange'
  | 'onBillingModelFilterChange'
  | 'onBulkBillingModelChange'
  | 'onBulkOwnerChange'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onDefaultViewSelect'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onOwnerChange'
  | 'onOwnerFilterChange'
  | 'onPageChange'
  | 'onSavedViewCreate'
  | 'onSavedViewSelect'
  | 'onSavePreference'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStatusFilterChange'
>

export interface ComposedLegal9Props extends Legal9Controls, Callbacks {}

const noop = () => undefined
const composedPageSize = 5

const byAmount = (a: Legal9Record, b: Legal9Record) =>
  (b.amountCents ?? -1) - (a.amountCents ?? -1)

export const ComposedLegal9 = ({
  bulkActions,
  create,
  editable,
  empty,
  groupBy: groupByControl,
  mode: modeControl,
  onBillingModelChange,
  onBillingModelFilterChange,
  onBulkBillingModelChange,
  onBulkOwnerChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDefaultViewSelect,
  onGroupByChange,
  onModeChange,
  onOpen,
  onOwnerChange,
  onOwnerFilterChange,
  onPageChange,
  onSavedViewCreate,
  onSavedViewSelect,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusFilterChange,
  openable,
  paginated,
  savedViews: withSavedViews,
  search: withSearch,
  title,
}: Readonly<ComposedLegal9Props>) => {
  const [items, setItems] = useState<Legal9Record[]>(records)
  const [mode, setMode] = useState<Legal9Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Legal9GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Legal9Sort>('updated')
  const [statusFilter, setStatusFilter] = useState<Legal9Status | null>(null)
  const [billingModelFilter, setBillingModelFilter] =
    useState<Legal9BillingModel | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (ids: readonly string[], change: Partial<Legal9Record>) =>
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, ...change } : item,
      ),
    )
  const firstPage = () => setPage(1)

  const matching = empty
    ? []
    : items
        .filter(
          (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) &&
            (!statusFilter || item.status === statusFilter) &&
            (!billingModelFilter || item.billingModel === billingModelFilter) &&
            (!ownerFilter || item.ownerId === ownerFilter),
        )
        .sort((a, b) => {
          if (sort === 'title') return a.title.localeCompare(b.title, 'pt-BR')
          if (sort === 'amount') return byAmount(a, b)
          return 0
        })
  const visible = paginated
    ? matching.slice((page - 1) * composedPageSize, page * composedPageSize)
    : matching

  return (
    <Legal9
      billingModelFilter={billingModelFilter}
      collapsedGroupIds={collapsedGroupIds}
      filtered={Boolean(
        search || statusFilter || billingModelFilter || ownerFilter,
      )}
      groupBy={groupBy}
      labels={labels}
      mode={mode}
      onBillingModelChange={
        editable
          ? (id, billingModel) => {
              update([id], { billingModel })
              onBillingModelChange?.(id, billingModel)
            }
          : undefined
      }
      onBillingModelFilterChange={(next) => {
        setBillingModelFilter(next)
        firstPage()
        onBillingModelFilterChange?.(next)
      }}
      onBulkBillingModelChange={
        bulkActions
          ? (ids, billingModel) => {
              update(ids, { billingModel })
              onBulkBillingModelChange?.(ids, billingModel)
            }
          : undefined
      }
      onBulkOwnerChange={
        bulkActions
          ? (ids, ownerId) => {
              update(ids, { ownerId })
              onBulkOwnerChange?.(ids, ownerId)
            }
          : undefined
      }
      onCollapsedGroupIdsChange={(next) => {
        setCollapsedGroupIds(next)
        onCollapsedGroupIdsChange?.(next)
      }}
      onCreate={onCreate ?? noop}
      onDefaultViewSelect={
        withSavedViews
          ? () => {
              setSavedViewId(null)
              onDefaultViewSelect?.()
            }
          : undefined
      }
      onGroupByChange={(next) => {
        setGroupBy(next)
        onGroupByChange?.(next)
      }}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onOwnerChange={
        editable
          ? (id, ownerId) => {
              update([id], { ownerId })
              onOwnerChange?.(id, ownerId)
            }
          : undefined
      }
      onOwnerFilterChange={(next) => {
        setOwnerFilter(next)
        firstPage()
        onOwnerFilterChange?.(next)
      }}
      onPageChange={(next) => {
        setPage(next)
        onPageChange?.(next)
      }}
      onSavedViewCreate={
        withSavedViews ? (onSavedViewCreate ?? noop) : undefined
      }
      onSavedViewSelect={
        withSavedViews
          ? (id) => {
              setSavedViewId(id)
              onSavedViewSelect?.(id)
            }
          : undefined
      }
      onSavePreference={withSavedViews ? (onSavePreference ?? noop) : undefined}
      onSearchChange={
        withSearch
          ? (next) => {
              setSearch(next)
              firstPage()
              onSearchChange?.(next)
            }
          : undefined
      }
      onSelectedIdsChange={
        bulkActions
          ? (next) => {
              setSelectedIds(next)
              onSelectedIdsChange?.(next)
            }
          : undefined
      }
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onStatusFilterChange={(next) => {
        setStatusFilter(next)
        firstPage()
        onStatusFilterChange?.(next)
      }}
      ownerFilter={ownerFilter}
      owners={owners}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(matching.length / composedPageSize))
          : undefined
      }
      pageSize={paginated ? composedPageSize : undefined}
      records={visible}
      savedViewId={savedViewId}
      savedViews={withSavedViews ? savedViews : undefined}
      search={search}
      selectedIds={bulkActions ? selectedIds : undefined}
      sort={sort}
      statusFilter={statusFilter}
      total={paginated ? matching.length : undefined}
      viewCount={withSavedViews ? items.length : undefined}
    />
  )
}
