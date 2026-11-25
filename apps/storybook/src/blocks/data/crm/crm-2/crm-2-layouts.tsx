import {
  Crm2,
  type Crm2Archived,
  type Crm2GroupBy,
  type Crm2Lead,
  type Crm2Mode,
  type Crm2Origin,
  type Crm2Props,
  type Crm2Sort,
} from '@tc96/ui/blocks/data/crm/crm-2'
import { useEffect, useMemo, useState } from 'react'
import {
  counts,
  isOnTheBoard,
  leads,
  owners,
  savedViews,
  stages,
  stageValuesOf,
  tags,
} from '../fixtures/crm-2.ts'
import type { Crm2Controls } from './crm-2-controls.ts'

type Callbacks = Pick<
  Crm2Props,
  | 'onArchivedFilterChange'
  | 'onBulkArchive'
  | 'onBulkOwnerChange'
  | 'onBulkStageChange'
  | 'onCreate'
  | 'onCreateInStage'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onOriginChange'
  | 'onOriginFilterChange'
  | 'onOwnerChange'
  | 'onOwnerFilterChange'
  | 'onPageChange'
  | 'onSavedViewCreate'
  | 'onSavedViewSelect'
  | 'onSavePreference'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStageChange'
  | 'onStageFilterChange'
  | 'onTagFilterChange'
>

export interface ComposedCrm2Props extends Crm2Controls, Callbacks {}

const noop = () => undefined
const composedPageSize = 5

const savedViewFilters: Record<
  string,
  {
    ownerFilter: string | null
    stageFilter: string | null
    tagFilter: string[]
  }
> = {
  'sv-propostas': { ownerFilter: null, stageFilter: 'proposta', tagFilter: [] },
  'sv-quentes': {
    ownerFilter: 'marina',
    stageFilter: null,
    tagFilter: ['quente'],
  },
}

const sortLeads = (items: Crm2Lead[], sort: Crm2Sort) => {
  if (sort === 'updated') return [...items].reverse()
  if (sort === 'value')
    return [...items].sort((a, b) => (b.valueCents ?? 0) - (a.valueCents ?? 0))
  if (sort === 'next-action')
    return [...items].sort((a, b) =>
      (a.nextActionAt ?? '9999').localeCompare(b.nextActionAt ?? '9999'),
    )
  return items
}

export const ComposedCrm2 = ({
  boardHasMore,
  bulkActions,
  create,
  editable,
  empty,
  headerActions,
  mode: modeControl,
  onArchivedFilterChange,
  onBulkArchive,
  onBulkOwnerChange,
  onBulkStageChange,
  onCreate,
  onCreateInStage,
  onGroupByChange,
  onModeChange,
  onOpen,
  onOriginChange,
  onOriginFilterChange,
  onOwnerChange,
  onOwnerFilterChange,
  onPageChange,
  onSavedViewCreate,
  onSavedViewSelect,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStageChange,
  onStageFilterChange,
  onTagFilterChange,
  openable,
  paginated,
  savedViews: withSavedViews,
  title,
}: Readonly<ComposedCrm2Props>) => {
  const [items, setItems] = useState<Crm2Lead[]>(leads)
  const [mode, setMode] = useState<Crm2Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Crm2GroupBy>('stage')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Crm2Sort>('created')
  const [stageFilter, setStageFilter] = useState<string | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [originFilter, setOriginFilter] = useState<Crm2Origin | null>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [archivedFilter, setArchivedFilter] = useState<Crm2Archived | null>(
    null,
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const update = (ids: readonly string[], change: Partial<Crm2Lead>) =>
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, ...change } : item,
      ),
    )
  const firstPage = () => setPage(1)

  const matching = empty
    ? []
    : items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) &&
          (!stageFilter || item.stageId === stageFilter) &&
          (!ownerFilter || item.ownerId === ownerFilter) &&
          (!originFilter || item.origin === originFilter) &&
          (tagFilter.length === 0 ||
            item.tagIds.some((id) => tagFilter.includes(id))),
      )
  const board = matching.filter(isOnTheBoard)
  const tableRows = sortLeads(
    matching.filter((item) => {
      if (archivedFilter === 'only') return item.archived
      if (archivedFilter === 'include') return true
      return !item.archived
    }),
    sort,
  )
  const isBoard = mode === 'kanban'
  const visible = isBoard
    ? board
    : paginated
      ? tableRows.slice((page - 1) * composedPageSize, page * composedPageSize)
      : tableRows

  return (
    <Crm2
      archivedFilter={archivedFilter}
      boardHasMore={boardHasMore}
      counts={withSavedViews ? counts : undefined}
      filtered={Boolean(
        search ||
          stageFilter ||
          ownerFilter ||
          originFilter ||
          tagFilter.length ||
          (!isBoard && archivedFilter),
      )}
      groupBy={groupBy}
      labels={labels}
      leads={visible}
      mode={mode}
      onArchivedFilterChange={(next) => {
        setArchivedFilter(next)
        firstPage()
        onArchivedFilterChange?.(next)
      }}
      onBulkArchive={
        bulkActions
          ? (ids) => {
              update(ids, { archived: true })
              onBulkArchive?.(ids)
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
      onBulkStageChange={
        bulkActions
          ? (ids, stageId) => {
              update(ids, { stageId })
              onBulkStageChange?.(ids, stageId)
            }
          : undefined
      }
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onCreateInStage={editable ? (onCreateInStage ?? noop) : undefined}
      onGroupByChange={(next) => {
        setGroupBy(next)
        onGroupByChange?.(next)
      }}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onOriginChange={
        editable
          ? (id, origin) => {
              update([id], { origin })
              onOriginChange?.(id, origin)
            }
          : undefined
      }
      onOriginFilterChange={(next) => {
        setOriginFilter(next)
        firstPage()
        onOriginFilterChange?.(next)
      }}
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
              const filters = savedViewFilters[id]
              setSavedViewId(id)
              if (filters) {
                setOwnerFilter(filters.ownerFilter)
                setStageFilter(filters.stageFilter)
                setTagFilter(filters.tagFilter)
                firstPage()
              }
              onSavedViewSelect?.(id)
            }
          : undefined
      }
      onSavePreference={withSavedViews ? (onSavePreference ?? noop) : undefined}
      onSearchChange={
        headerActions
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
        firstPage()
        onSortChange?.(next)
      }}
      onStageChange={
        editable
          ? (id, stageId) => {
              update([id], { stageId })
              onStageChange?.(id, stageId)
            }
          : undefined
      }
      onStageFilterChange={(next) => {
        setStageFilter(next)
        firstPage()
        onStageFilterChange?.(next)
      }}
      onTagFilterChange={(next) => {
        setTagFilter(next)
        firstPage()
        onTagFilterChange?.(next)
      }}
      originFilter={originFilter}
      ownerFilter={ownerFilter}
      owners={owners}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(tableRows.length / composedPageSize))
          : undefined
      }
      pageSize={paginated ? composedPageSize : undefined}
      savedViewId={withSavedViews ? savedViewId : undefined}
      savedViews={withSavedViews ? savedViews : undefined}
      search={search}
      selectedIds={bulkActions ? selectedIds : undefined}
      sort={sort}
      stageFilter={stageFilter}
      stageValues={stageValuesOf(board)}
      stages={stages}
      tagFilter={tagFilter}
      tags={tags}
      total={paginated ? tableRows.length : undefined}
    />
  )
}
