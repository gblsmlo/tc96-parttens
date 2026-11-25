import {
  Legal5,
  type Legal5Archived,
  type Legal5Mode,
  type Legal5Pole,
  type Legal5Props,
  type Legal5Record,
  type Legal5Situation,
  type Legal5Sort,
  type Legal5View,
} from '@tc96/ui/blocks/data/legal/legal-5'
import { useEffect, useMemo, useState } from 'react'
import {
  clients,
  owners,
  phases,
  records,
  savedViews,
  tags,
} from '../fixtures/legal-5.ts'
import {
  type LegalSavedViewCallbacks,
  useLocalSavedViews,
} from '../legal-saved-views.ts'
import type { Legal5Controls } from './legal-5-controls.ts'

type Callbacks = Pick<
  Legal5Props,
  | 'onArchivedFilterChange'
  | 'onBulkArchive'
  | 'onBulkOwnerChange'
  | 'onBulkPhaseChange'
  | 'onBulkTagAdd'
  | 'onClientFilterChange'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onOwnerChange'
  | 'onOwnerFilterChange'
  | 'onPageChange'
  | 'onPhaseChange'
  | 'onPhaseFilterChange'
  | 'onPoleFilterChange'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSituationFilterChange'
  | 'onSortChange'
  | 'onTagFilterChange'
  | 'onTagsChange'
  | 'onUnarchive'
  | 'onViewChange'
>

export interface ComposedLegal5Props
  extends Legal5Controls,
    Callbacks,
    LegalSavedViewCallbacks {}

type Legal5GroupBy = NonNullable<Legal5Props['groupBy']>

const noop = () => undefined
const composedPageSize = 5

export const ComposedLegal5 = ({
  bulkActions,
  catalogsLoading,
  create,
  editable,
  empty,
  groupBy: groupByControl,
  headerActions,
  mode: modeControl,
  onArchivedFilterChange,
  onBulkArchive,
  onBulkOwnerChange,
  onBulkPhaseChange,
  onBulkTagAdd,
  onClientFilterChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onOpen,
  onOwnerChange,
  onOwnerFilterChange,
  onPageChange,
  onPhaseChange,
  onPhaseFilterChange,
  onPoleFilterChange,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSituationFilterChange,
  onSortChange,
  onTagFilterChange,
  onTagsChange,
  onUnarchive,
  onViewChange,
  openable,
  paginated,
  savedViews: withSavedViews,
  title,
  viewCounts,
}: Readonly<ComposedLegal5Props>) => {
  const [items, setItems] = useState<Legal5Record[]>(records)
  const [mode, setMode] = useState<Legal5Mode>(modeControl)
  const [view, setView] = useState<Legal5View>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Legal5Sort | null>(null)
  const [phaseFilter, setPhaseFilter] = useState<string[]>([])
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [clientFilter, setClientFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [poleFilter, setPoleFilter] = useState<Legal5Pole | null>(null)
  const [situationFilter, setSituationFilter] =
    useState<Legal5Situation | null>(null)
  const [archivedFilter, setArchivedFilter] = useState<Legal5Archived | null>(
    null,
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [groupBy, setGroupBy] = useState<Legal5GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const labels = useMemo(() => ({ create, title }), [create, title])
  const views = useLocalSavedViews(
    savedViews,
    {
      apply: (config) => {
        setView(config.view)
        setOwnerFilter(config.ownerFilter)
        setPhaseFilter(config.phaseFilter)
        setPage(1)
      },
      config: { ownerFilter, phaseFilter, view },
    },
    {
      onSavedViewCreate,
      onSavedViewDelete,
      onSavedViewDuplicate,
      onSavedViewRename,
      onSavedViewSelect,
      onSavedViewUpdate,
      onSavePreference,
    },
  )

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const update = (ids: readonly string[], change: Partial<Legal5Record>) =>
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, ...change } : item,
      ),
    )
  const firstPage = () => setPage(1)

  const clientName = clients.find((item) => item.id === clientFilter)?.label
  const matching = empty
    ? []
    : [...items]
        .filter(
          (item) =>
            (view === 'all' || item.kind === view) &&
            item.title.toLowerCase().includes(search.toLowerCase()) &&
            (phaseFilter.length === 0 || phaseFilter.includes(item.phaseId)) &&
            (!ownerFilter || item.ownerId === ownerFilter) &&
            (!clientName || item.clients.includes(clientName)) &&
            (tagFilter.length === 0 ||
              item.tagIds.some((id) => tagFilter.includes(id))) &&
            (archivedFilter !== 'only' || item.archived),
        )
        .sort((a, b) =>
          sort === 'title' ? a.title.localeCompare(b.title, 'pt-BR') : 0,
        )
  const visible = paginated
    ? matching.slice((page - 1) * composedPageSize, page * composedPageSize)
    : matching
  const count = (kind: Legal5View) =>
    kind === 'all'
      ? items.length
      : items.filter((item) => item.kind === kind).length

  return (
    <Legal5
      {...(withSavedViews ? views.props : {})}
      archivedFilter={archivedFilter}
      clientFilter={clientFilter}
      clients={clients}
      clientsLoading={catalogsLoading}
      collapsedGroupIds={collapsedGroupIds}
      counts={
        viewCounts
          ? {
              all: count('all'),
              lawsuit: count('lawsuit'),
              matter: count('matter'),
            }
          : undefined
      }
      filtered={Boolean(
        search ||
          phaseFilter.length ||
          ownerFilter ||
          clientFilter ||
          tagFilter.length ||
          poleFilter ||
          situationFilter ||
          archivedFilter,
      )}
      groupBy={groupBy}
      labels={labels}
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
      onBulkPhaseChange={
        bulkActions
          ? (ids, phaseId) => {
              update(ids, { phaseId })
              onBulkPhaseChange?.(ids, phaseId)
            }
          : undefined
      }
      onBulkTagAdd={
        bulkActions
          ? (ids, tagId) => {
              setItems((current) =>
                current.map((item) =>
                  ids.includes(item.id) && !item.tagIds.includes(tagId)
                    ? { ...item, tagIds: [...item.tagIds, tagId] }
                    : item,
                ),
              )
              onBulkTagAdd?.(ids, tagId)
            }
          : undefined
      }
      onClientFilterChange={(next) => {
        setClientFilter(next)
        firstPage()
        onClientFilterChange?.(next)
      }}
      onCollapsedGroupIdsChange={(next) => {
        setCollapsedGroupIds(next)
        onCollapsedGroupIdsChange?.(next)
      }}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onGroupByChange={(next) => {
        setGroupBy(next)
        setCollapsedGroupIds([])
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
      onPhaseChange={
        editable
          ? (id, phaseId) => {
              update([id], { phaseId })
              onPhaseChange?.(id, phaseId)
            }
          : undefined
      }
      onPhaseFilterChange={(next) => {
        setPhaseFilter(next)
        firstPage()
        onPhaseFilterChange?.(next)
      }}
      onPoleFilterChange={(next) => {
        setPoleFilter(next)
        firstPage()
        onPoleFilterChange?.(next)
      }}
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
      onSituationFilterChange={(next) => {
        setSituationFilter(next)
        firstPage()
        onSituationFilterChange?.(next)
      }}
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onTagFilterChange={(next) => {
        setTagFilter(next)
        firstPage()
        onTagFilterChange?.(next)
      }}
      onTagsChange={
        editable
          ? (id, tagIds) => {
              update([id], { tagIds })
              onTagsChange?.(id, tagIds)
            }
          : undefined
      }
      onUnarchive={
        editable
          ? (id) => {
              update([id], { archived: false })
              onUnarchive?.(id)
            }
          : undefined
      }
      onViewChange={(next) => {
        setView(next)
        firstPage()
        views.clear()
        onViewChange?.(next)
      }}
      ownerFilter={ownerFilter}
      owners={owners}
      ownersLoading={catalogsLoading}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(matching.length / composedPageSize))
          : undefined
      }
      pageSize={paginated ? composedPageSize : undefined}
      phaseFilter={phaseFilter}
      phases={phases}
      phasesLoading={catalogsLoading}
      poleFilter={poleFilter}
      records={visible}
      search={search}
      selectedIds={bulkActions ? selectedIds : undefined}
      situationFilter={situationFilter}
      sort={sort}
      tagFilter={tagFilter}
      tags={tags}
      tagsLoading={catalogsLoading}
      total={paginated ? matching.length : undefined}
      view={view}
    />
  )
}
