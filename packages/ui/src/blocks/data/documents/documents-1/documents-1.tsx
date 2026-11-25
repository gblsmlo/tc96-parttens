'use client'

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
import { createDocuments1Columns } from './documents-1-columns'
import {
  type Documents1FieldContext,
  documents1Opens,
} from './documents-1-fields'
import {
  documents1TypeOf,
  documents1Types,
  documents1ViewIcons,
  documents1Views,
} from './documents-1-options'
import { renderDocuments1ListRow } from './documents-1-records'
import { Documents1Skeleton } from './documents-1-skeleton'
import { Documents1Toolbar } from './documents-1-toolbar'
import { resolveDocuments1Labels } from './labels'
import type {
  Documents1GroupBy,
  Documents1Mode,
  Documents1Props,
  Documents1Record,
  Documents1Sort,
  Documents1Type,
  Documents1View,
} from './types'

export {
  documents1Modes,
  documents1Sorts,
  documents1TypeOf,
  documents1Types,
  documents1Views,
  documents1ViewTypes,
} from './documents-1-options'

const noPeople: NonNullable<Documents1Props['people']> = []
const noTypes: Documents1Type[] = []

const viewIcons = Object.fromEntries(
  documents1Views.map((view) => {
    const ViewIcon = documents1ViewIcons[view]
    return [view, <ViewIcon aria-hidden="true" key={view} />]
  }),
) as Record<Documents1View, ReactNode>

export function Documents1({
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
}: Readonly<Documents1Props>) {
  const labels = useMemo(
    () => resolveDocuments1Labels(labelsProp),
    [labelsProp],
  )
  const [mode, setMode] = useControllable<Documents1Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [view, setView] = useControllable<Documents1View>(
    viewProp,
    'all',
    onViewChange,
  )
  const [groupBy, setGroupBy] = useControllable<Documents1GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Documents1Sort | null>(
    sortProp,
    null,
    onSortChange,
  )
  const [typeFilter, setTypeFilter] = useControllable<Documents1Type[]>(
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

  const context = useMemo<Documents1FieldContext>(
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

  const collection = useMemo<DataCollectionDefinition<Documents1Record>>(
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
          getGroupId: (item) => documents1TypeOf(item),
          id: 'type',
          label: labels.groupings.type,
          options: documents1Types.map((type) => ({
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
    const rankOf = (item: Documents1Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [collection, groupBy, mode, records])

  const columns = useMemo(() => createDocuments1Columns(context), [context])
  const { table } = useDataTable<Documents1Record>({
    columns,
    data: tableRecords,
    getRowId: (item) => item.id,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Documents1Skeleton label={labels.loading} />,
  })

  const hasRecords = total === undefined ? records.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={className}
      data-block="documents-1"
      title={labels.title}
      toolbar={
        <Documents1Toolbar
          accept={uploadAccept}
          groupBy={groupBy}
          labels={labels}
          left={
            <DataCollectionViewSwitcher<Documents1View>
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
              views={documents1Views}
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
        <DataCollection<Documents1Record>
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
          getRowCanOpen={documents1Opens}
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
          renderListRecord={renderDocuments1ListRow(context)}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
