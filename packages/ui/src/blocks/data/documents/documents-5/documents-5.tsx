'use client'

import { UserCircleIcon } from '@phosphor-icons/react'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { useMemo } from 'react'
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
import { createDocuments5Columns } from './documents-5-columns'
import type { Documents5FieldContext } from './documents-5-fields'
import {
  documents5GroupBys,
  documents5NoGroup,
  documents5TypeIcons,
  documents5Types,
} from './documents-5-options'
import { Documents5Pinned } from './documents-5-pinned'
import {
  Documents5ListHeader,
  renderDocuments5GalleryCard,
  renderDocuments5ListRow,
} from './documents-5-records'
import { createDocuments5SelectionActions } from './documents-5-selection-actions'
import { Documents5Skeleton } from './documents-5-skeleton'
import { Documents5Toolbar } from './documents-5-toolbar'
import { resolveDocuments5Labels } from './labels'
import type {
  Documents5GroupBy,
  Documents5Labels,
  Documents5Mode,
  Documents5Person,
  Documents5Props,
  Documents5Record,
  Documents5Sort,
  Documents5Type,
} from './types'

export {
  documents5GroupBys,
  documents5Modes,
  documents5Sorts,
  documents5Types,
} from './documents-5-options'

type Documents5Grouping =
  DataCollectionDefinition<Documents5Record>['groupings'][number]

const documents5AllView = 'all'
const documents5Views = [documents5AllView] as const

const noPeople: NonNullable<Documents5Props['people']> = []
const noRecords: Documents5Record[] = []
const noIds: string[] = []
const groupIcon = 'size-4'

function createDocuments5Groupings(
  labels: Documents5Labels,
  people: readonly Documents5Person[],
): Documents5Grouping[] {
  return [
    {
      getGroupId: (item) => item.type,
      id: 'type',
      label: labels.groupings.type,
      options: documents5Types.map((type) => {
        const TypeIcon = documents5TypeIcons[type]
        return {
          icon: <TypeIcon aria-hidden="true" className={groupIcon} />,
          id: type,
          label: labels.types[type],
        }
      }),
    },
    {
      getGroupId: (item) => item.ownerId ?? documents5NoGroup,
      id: 'owner',
      label: labels.groupings.owner,
      options: [
        ...people.map((person) => ({
          icon: <UserCircleIcon aria-hidden="true" className={groupIcon} />,
          id: person.id,
          label: person.label,
        })),
        { id: documents5NoGroup, label: labels.noOwner },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Documents5GroupBy | null =>
  documents5GroupBys.find((item) => item === value) ?? null

export function Documents5({
  className,
  collapsedGroupIds,
  error,
  filtered = false,
  groupBy: groupByProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onBulkDelete,
  onBulkDownload,
  onBulkPinnedChange,
  onCollapsedGroupIdsChange,
  onCreateLink,
  onCreateNote,
  onDelete,
  onDownload,
  onGroupByChange,
  onModeChange,
  onOpen,
  onOwnerFilterChange,
  onPinnedChange,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSelectedIdsChange,
  onSortChange,
  onTypeFilterChange,
  onUpload,
  ownerFilter: ownerFilterProp,
  pending,
  people = noPeople,
  pinnedRecords = noRecords,
  records,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  timeZone = defaultDataCollectionTimeZone,
  typeColors,
  typeFilter: typeFilterProp,
  uploadAccept,
}: Readonly<Documents5Props>) {
  const labels = useMemo(
    () => resolveDocuments5Labels(labelsProp),
    [labelsProp],
  )
  const [mode, setMode] = useControllable<Documents5Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sort, setSort] = useControllable<Documents5Sort>(
    sortProp,
    'updated',
    onSortChange,
  )
  const [groupBy, setGroupBy] = useControllable<Documents5GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [typeFilter, setTypeFilter] = useControllable<Documents5Type | null>(
    typeFilterProp,
    null,
    onTypeFilterChange,
  )
  const [ownerFilter, setOwnerFilter] = useControllable<string | null>(
    ownerFilterProp,
    null,
    onOwnerFilterChange,
  )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const selectable = Boolean(
    onBulkDelete || onBulkDownload || onBulkPinnedChange,
  )
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const toggleSelected = useStableHandler(
    selectable
      ? (recordId: string, checked: boolean) =>
          setSelectedIds(
            checked
              ? [...selectedIds.filter((id) => id !== recordId), recordId]
              : selectedIds.filter((id) => id !== recordId),
          )
      : undefined,
  )

  const openRecord = useStableHandler(onOpen)
  const download = useStableHandler(onDownload)
  const changePinned = useStableHandler(onPinnedChange)
  const remove = useStableHandler(onDelete)

  const context = useMemo<Documents5FieldContext>(
    () => ({
      labels,
      locale,
      onDelete: remove,
      onDownload: download,
      onOpen: openRecord,
      onPinnedChange: changePinned,
      onSelectedChange: toggleSelected,
      people,
      selectedIds: selectedSet,
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
      selectedSet,
      timeZone,
      toggleSelected,
      typeColors,
    ],
  )

  const groupings = useMemo(
    () => createDocuments5Groupings(labels, people),
    [labels, people],
  )
  const tableRecords = useMemo(() => {
    const dimension =
      mode === 'table' ? groupings.find(({ id }) => id === groupBy) : undefined
    if (!dimension) return records
    const rank = new Map(
      dimension.options.map((option, index) => [option.id, index]),
    )
    const rankOf = (item: Documents5Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [groupBy, groupings, mode, records])
  const collection = useMemo<DataCollectionDefinition<Documents5Record>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.name,
      groupings,
      records: tableRecords,
    }),
    [groupings, tableRecords],
  )

  const columns = useMemo(
    () => createDocuments5Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Documents5Record>({
    columns,
    data: tableRecords,
    enableRowSelection: selectable,
    getRowId: (item) => item.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const selectedRows = useMemo(
    () => records.filter((item) => selectedSet.has(item.id)),
    [records, selectedSet],
  )
  const clearSelection = () => setSelectedIds(noIds)
  const selectionBar = (
    rows: readonly Documents5Record[],
    clear: () => void,
  ) => (
    <ActionBar
      actions={createDocuments5SelectionActions({
        labels,
        onBulkDelete,
        onBulkDownload,
        onBulkPinnedChange,
        onDone: clear,
        selectedRows: rows,
      })}
      className="pointer-events-auto"
      clearSelectionLabel={labels.clearSelection}
      formatSelection={labels.selectedCount}
      label={labels.selectionActions}
      onClearSelection={clear}
      selectedCount={rows.length}
      selectedRows={rows}
    />
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Documents5Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="documents-5"
      subheader={
        loadState ? undefined : (
          <Documents5Pinned context={context} records={pinnedRecords} />
        )
      }
      title={labels.title}
      toolbar={
        <Documents5Toolbar
          accept={uploadAccept}
          groupBy={groupBy}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          onCreateLink={onCreateLink}
          onCreateNote={onCreateNote}
          onGroupByChange={setGroupBy}
          onModeChange={setMode}
          onOwnerFilterChange={onOwnerFilterChange ? setOwnerFilter : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onTypeFilterChange={onTypeFilterChange ? setTypeFilter : undefined}
          onUpload={onUpload}
          ownerFilter={ownerFilter}
          people={people}
          sort={sort}
          typeFilter={typeFilter}
          viewSwitcher={
            <DataCollectionViewSwitcher<typeof documents5AllView>
              label={labels.viewList}
              modified={savedViewModified}
              onSavedViewCreate={onSavedViewCreate}
              onSavedViewDelete={onSavedViewDelete}
              onSavedViewDuplicate={onSavedViewDuplicate}
              onSavedViewRename={onSavedViewRename}
              onSavedViewSelect={onSavedViewSelect}
              onSavedViewUpdate={onSavedViewUpdate}
              onViewChange={() => onSavedViewSelect?.(null)}
              savedViewId={savedViewId}
              savedViewLabels={labels.savedViews}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={documents5AllView}
              viewLabels={{ [documents5AllView]: labels.title }}
              views={documents5Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<Documents5Record>
          collapseEmptyGroups
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(item) => labels.openRecord(item.name)}
          groupBy={groupBy}
          label={labels.title}
          listHeader={
            <Documents5ListHeader
              context={context}
              selection={
                selectable && records.length > 0
                  ? {
                      checked: records.every((item) =>
                        selectedSet.has(item.id),
                      ),
                      indeterminate:
                        selectedSet.size > 0 &&
                        !records.every((item) => selectedSet.has(item.id)),
                      onCheckedChange: (checked) =>
                        setSelectedIds(
                          checked ? records.map((item) => item.id) : noIds,
                        ),
                    }
                  : undefined
              }
            />
          }
          mode={mode}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openRecord ? (item) => openRecord(item.id) : undefined}
          renderGalleryRecord={renderDocuments5GalleryCard(context)}
          renderListRecord={renderDocuments5ListRow(context)}
          selectionActions={
            selectable
              ? ({ clearSelection: clear, selectedRows: rows }) =>
                  selectionBar(rows, clear)
              : undefined
          }
          table={table}
        />
      )}
      {!loadState && mode === 'list' && selectable ? (
        <div className="pointer-events-none sticky bottom-3 flex justify-center">
          {selectionBar(selectedRows, clearSelection)}
        </div>
      ) : null}
    </DataCollectionFrame>
  )
}
