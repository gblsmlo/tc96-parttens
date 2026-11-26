import { cn } from '@tc96/utils'

;('use client')

import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { type ReactNode, useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  defaultDataCollectionLocale,
  defaultDataCollectionTimeZone,
} from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { createDocuments3Columns } from './documents-3-columns'
import {
  type Documents3FieldContext,
  documents3Opens,
} from './documents-3-fields'
import {
  documents3TypeOf,
  documents3Types,
  documents3ViewIcons,
  documents3Views,
} from './documents-3-options'
import {
  renderDocuments3GalleryCard,
  renderDocuments3ListRow,
} from './documents-3-records'
import { Documents3Skeleton } from './documents-3-skeleton'
import { Documents3Toolbar } from './documents-3-toolbar'
import { resolveDocuments3Labels } from './labels'
import type {
  Documents3GroupBy,
  Documents3Mode,
  Documents3Props,
  Documents3Record,
  Documents3Sort,
  Documents3Type,
  Documents3View,
} from './types'

export {
  documents3Modes,
  documents3Sorts,
  documents3TypeOf,
  documents3Types,
  documents3Views,
  documents3ViewTypes,
} from './documents-3-options'

const noPeople: NonNullable<Documents3Props['people']> = []
const noTypes: Documents3Type[] = []

const viewIcons = Object.fromEntries(
  documents3Views.map((view) => {
    const ViewIcon = documents3ViewIcons[view]
    return [view, <ViewIcon aria-hidden="true" key={view} />]
  }),
) as Record<Documents3View, ReactNode>

export function Documents3({
  className,
  collapsedGroupIds,
  counts,
  error,
  filtered = false,
  groupBy: groupByProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onCollapsedGroupIdsChange,
  onCreateLink,
  onCreateNote,
  onCreatePage,
  onDelete,
  onDownload,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPageChange,
  onPinnedChange,
  onRename,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSavePreference,
  onSearchChange,
  onShare,
  onSortChange,
  onTypeFilterChange,
  onUpload,
  onViewChange,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  people = noPeople,
  records,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  search: searchProp,
  sort: sortProp,
  timeZone = defaultDataCollectionTimeZone,
  total,
  typeColors,
  typeFilter: typeFilterProp,
  uploadAccept,
  view: viewProp,
}: Readonly<Documents3Props>) {
  const labels = useMemo(
    () => resolveDocuments3Labels(labelsProp),
    [labelsProp],
  )
  const [mode, setMode] = useControllable<Documents3Mode>(
    modeProp,
    'gallery',
    onModeChange,
  )
  const [view, setView] = useControllable<Documents3View>(
    viewProp,
    'all',
    onViewChange,
  )
  const [groupBy, setGroupBy] = useControllable<Documents3GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Documents3Sort | null>(
    sortProp,
    null,
    onSortChange,
  )
  const [typeFilter, setTypeFilter] = useControllable<Documents3Type[]>(
    typeFilterProp,
    noTypes,
    onTypeFilterChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openRecord = useStableHandler(onOpen)
  const download = useStableHandler(onDownload)
  const rename = useStableHandler(onRename)
  const changePinned = useStableHandler(onPinnedChange)
  const share = useStableHandler(onShare)
  const remove = useStableHandler(onDelete)

  const context = useMemo<Documents3FieldContext>(
    () => ({
      labels,
      locale,
      onDelete: remove,
      onDownload: download,
      onOpen: openRecord,
      onPinnedChange: changePinned,
      onRename: rename,
      onShare: share,
      people,
      timeZone,
      typeColors,
    }),
    [
      changePinned,
      download,
      labels,
      locale,
      openRecord,
      people,
      remove,
      rename,
      share,
      timeZone,
      typeColors,
    ],
  )

  const collection = useMemo<DataCollectionDefinition<Documents3Record>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.name,
      groupings: [
        {
          getGroupId: (item) => (item.pinned ? 'pinned' : 'recent'),
          id: 'pinned',
          label: labels.groupings.pinned,
          options: [
            { id: 'pinned', label: labels.pinnedGroups.pinned },
            { id: 'recent', label: labels.pinnedGroups.recent },
          ],
        },
        {
          getGroupId: (item) => documents3TypeOf(item),
          id: 'type',
          label: labels.groupings.type,
          options: documents3Types.map((type) => ({
            id: type,
            label: labels.types[type],
          })),
        },
      ],
      records,
    }),
    [labels, records],
  )

  const tableRecords = useMemo(() => {
    const dimension =
      mode === 'table'
        ? collection.groupings.find(({ id }) => id === groupBy)
        : undefined
    if (!dimension) return records
    const rank = new Map(
      dimension.options.map((option, index) => [option.id, index]),
    )
    const rankOf = (item: Documents3Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [collection, groupBy, mode, records])

  const columns = useMemo(() => createDocuments3Columns(context), [context])
  const { table } = useDataTable<Documents3Record>({
    columns,
    data: tableRecords,
    getRowId: (item) => item.id,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Documents3Skeleton label={labels.loading} />,
  })

  const hasRecords = total === undefined ? records.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={cn('lg:[&_[data-slot=gallery-view]]:grid-cols-4', className)}
      data-block="documents-3"
      title={labels.title}
      toolbar={
        <Documents3Toolbar
          accept={uploadAccept}
          groupBy={groupBy}
          labels={labels}
          left={
            <DataCollectionViewSwitcher<Documents3View>
              counts={counts}
              icons={viewIcons}
              label={labels.viewList}
              locale={locale}
              modified={savedViewModified}
              onSavedViewCreate={onSavedViewCreate}
              onSavedViewDelete={onSavedViewDelete}
              onSavedViewDuplicate={onSavedViewDuplicate}
              onSavedViewRename={onSavedViewRename}
              onSavedViewSelect={onSavedViewSelect}
              onSavedViewUpdate={onSavedViewUpdate}
              onViewChange={setView}
              savedViewId={savedViewId}
              savedViewLabels={labels.savedViews}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={view}
              viewCountName={labels.viewCountName}
              viewLabels={labels.views}
              views={documents3Views}
            />
          }
          loading={Boolean(loadState)}
          mode={mode}
          onCreateLink={onCreateLink}
          onCreateNote={onCreateNote}
          onCreatePage={onCreatePage}
          onGroupByChange={onGroupByChange ? setGroupBy : undefined}
          onModeChange={setMode}
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onTypeFilterChange={onTypeFilterChange ? setTypeFilter : undefined}
          onUpload={onUpload}
          search={search}
          sort={sort}
          typeFilter={typeFilter}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Documents3Record>
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyGroupMessage={labels.emptyGroup}
          emptyMessage={filtered ? labels.noResult : labels.empty[view]}
          footer={
            pageCount !== undefined && hasRecords ? (
              <CollectionPagination
                buttonLabels={labels.paginationButtons}
                formatRange={labels.pageRange}
                label={labels.pagination}
                onPageChange={setPage}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={total}
              />
            ) : undefined
          }
          getGroupToggleLabel={labels.groupToggle}
          getRowCanOpen={documents3Opens}
          getRowOpenLabel={(item) => labels.openRecord(item.name)}
          groupBy={groupBy}
          label={labels.title}
          mode={mode}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onOpen={openRecord ? (item) => openRecord(item.id) : undefined}
          renderGalleryRecord={renderDocuments3GalleryCard(context)}
          renderListRecord={renderDocuments3ListRow(context)}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
