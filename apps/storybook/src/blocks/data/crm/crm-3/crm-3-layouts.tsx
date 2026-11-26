import {
  Crm3,
  type Crm3Archived,
  type Crm3GroupBy,
  type Crm3Lead,
  type Crm3Mode,
  type Crm3Origin,
  type Crm3Props,
  type Crm3Sort,
} from '@tc96/ui/blocks/data/crm/crm-3'
import { useEffect, useMemo, useState } from 'react'
import {
  counts,
  crm3Labels,
  isOnTheBoard,
  leads,
  owners,
  savedViews,
  stages,
  stageValuesOf,
  tags,
} from '../fixtures/crm-3.ts'
import type { Crm3Controls } from './crm-3-controls.ts'

type Callbacks = Pick<
  Crm3Props,
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
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onStageChange'
  | 'onStageFilterChange'
  | 'onTagFilterChange'
>

export interface ComposedCrm3Props extends Crm3Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

interface SavedViewFilters {
  ownerFilter: string | null
  stageFilter: string | null
  tagFilter: string[]
}

const noop = () => undefined
const composedPageSize = 5
const noFilters: SavedViewFilters = {
  ownerFilter: null,
  stageFilter: null,
  tagFilter: [],
}

const savedViewFilters: Record<string, SavedViewFilters> = {
  'sv-propostas': { ownerFilter: null, stageFilter: 'proposta', tagFilter: [] },
  'sv-quentes': {
    ownerFilter: 'marina',
    stageFilter: null,
    tagFilter: ['quente'],
  },
}

const sortLeads = (items: Crm3Lead[], sort: Crm3Sort) => {
  if (sort === 'updated') return [...items].reverse()
  if (sort === 'value')
    return [...items].sort((a, b) => (b.valueCents ?? 0) - (a.valueCents ?? 0))
  if (sort === 'next-action')
    return [...items].sort((a, b) =>
      (a.nextActionAt ?? '9999').localeCompare(b.nextActionAt ?? '9999'),
    )
  return items
}

export const ComposedCrm3 = ({
  boardHasMore,
  bulkActions,
  create,
  editable,
  empty,
  error = false,
  filters,
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
  onSelectedIdsChange,
  onSortChange,
  onStageChange,
  onStageFilterChange,
  onTagFilterChange,
  openable,
  paginated,
  pending = false,
  title,
}: Readonly<ComposedCrm3Props>) => {
  const [items, setItems] = useState<Crm3Lead[]>(leads)
  const [mode, setMode] = useState<Crm3Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Crm3GroupBy>('stage')
  const [sort, setSort] = useState<Crm3Sort>('created')
  const [stageFilter, setStageFilter] = useState<string | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [originFilter, setOriginFilter] = useState<Crm3Origin | null>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [archivedFilter, setArchivedFilter] = useState<Crm3Archived | null>(
    null,
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(
    () => ({ ...crm3Labels, create, title }),
    [create, title],
  )

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const update = (ids: readonly string[], change: Partial<Crm3Lead>) =>
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, ...change } : item,
      ),
    )
  const firstPage = () => setPage(1)
  const filter = <TValue,>(
    apply: (value: TValue) => void,
    report: ((value: TValue) => void) | undefined,
  ) =>
    filters
      ? (value: TValue) => {
          apply(value)
          firstPage()
          report?.(value)
        }
      : undefined
  const edit = <TArgs extends unknown[]>(
    enabled: boolean,
    apply: (...args: TArgs) => void,
    report: ((...args: TArgs) => void) | undefined,
  ) =>
    enabled
      ? (...args: TArgs) => {
          apply(...args)
          report?.(...args)
        }
      : undefined

  const matching = empty
    ? []
    : items.filter(
        (item) =>
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
    <Crm3
      archivedFilter={archivedFilter}
      boardHasMore={boardHasMore}
      counts={counts}
      error={error}
      filtered={Boolean(
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
      onArchivedFilterChange={filter(setArchivedFilter, onArchivedFilterChange)}
      onBulkArchive={edit(
        bulkActions,
        (ids: string[]) => update(ids, { archived: true }),
        onBulkArchive,
      )}
      onBulkOwnerChange={edit(
        bulkActions,
        (ids: string[], ownerId: string) => update(ids, { ownerId }),
        onBulkOwnerChange,
      )}
      onBulkStageChange={edit(
        bulkActions,
        (ids: string[], stageId: string) => update(ids, { stageId }),
        onBulkStageChange,
      )}
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
      onOriginChange={edit(
        editable,
        (id: string, origin: Crm3Origin) => update([id], { origin }),
        onOriginChange,
      )}
      onOriginFilterChange={filter(setOriginFilter, onOriginFilterChange)}
      onOwnerChange={edit(
        editable,
        (id: string, ownerId: string) => update([id], { ownerId }),
        onOwnerChange,
      )}
      onOwnerFilterChange={filter(setOwnerFilter, onOwnerFilterChange)}
      onPageChange={(next) => {
        setPage(next)
        onPageChange?.(next)
      }}
      onRetry={noop}
      onSavedViewCreate={onSavedViewCreate ?? noop}
      onSavedViewSelect={(id) => {
        const next = (id && savedViewFilters[id]) || noFilters
        setSavedViewId(id)
        setOwnerFilter(next.ownerFilter)
        setStageFilter(next.stageFilter)
        setTagFilter(next.tagFilter)
        firstPage()
        onSavedViewSelect?.(id)
      }}
      onSelectedIdsChange={edit(
        bulkActions,
        (next: string[]) => setSelectedIds(next),
        onSelectedIdsChange,
      )}
      onSortChange={(next) => {
        setSort(next)
        firstPage()
        onSortChange?.(next)
      }}
      onStageChange={edit(
        editable,
        (id: string, stageId: string) => update([id], { stageId }),
        onStageChange,
      )}
      onStageFilterChange={filter(setStageFilter, onStageFilterChange)}
      onTagFilterChange={filter(setTagFilter, onTagFilterChange)}
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
      pending={pending}
      savedViewId={savedViewId}
      savedViews={savedViews}
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
