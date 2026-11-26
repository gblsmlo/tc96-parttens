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
import { createDocuments4Columns } from './documents-4-columns'
import type { Documents4FieldContext } from './documents-4-fields'
import {
  documents4GroupBys,
  documents4NoGroup,
  documents4TypeIcons,
  documents4Types,
} from './documents-4-options'
import {
  Documents4ListHeader,
  renderDocuments4GalleryCard,
  renderDocuments4ListRow,
} from './documents-4-records'
import { createDocuments4SelectionActions } from './documents-4-selection-actions'
import { Documents4Skeleton } from './documents-4-skeleton'
import { Documents4Toolbar } from './documents-4-toolbar'
import { resolveDocuments4Labels } from './labels'
import type {
  Documents4GroupBy,
  Documents4Labels,
  Documents4Mode,
  Documents4Person,
  Documents4Props,
  Documents4Record,
  Documents4Sort,
  Documents4Type,
} from './types'

export {
  documents4GroupBys,
  documents4Modes,
  documents4Sorts,
  documents4Types,
} from './documents-4-options'

type Documents4Grouping =
  DataCollectionDefinition<Documents4Record>['groupings'][number]

const documents4AllView = 'all'
const documents4Views = [documents4AllView] as const

const noPeople: NonNullable<Documents4Props['people']> = []
const noIds: string[] = []
const groupIcon = 'size-4'

function createDocuments4Groupings(
  labels: Documents4Labels,
  people: readonly Documents4Person[],
): Documents4Grouping[] {
  return [
    {
      getGroupId: (item) => item.type,
      id: 'type',
      label: labels.groupings.type,
      options: documents4Types.map((type) => {
        const TypeIcon = documents4TypeIcons[type]
        return {
          icon: <TypeIcon aria-hidden="true" className={groupIcon} />,
          id: type,
          label: labels.types[type],
        }
      }),
    },
    {
      getGroupId: (item) => item.ownerId ?? documents4NoGroup,
      id: 'owner',
      label: labels.groupings.owner,
      options: [
        ...people.map((person) => ({
          icon: <UserCircleIcon aria-hidden="true" className={groupIcon} />,
          id: person.id,
          label: person.label,
        })),
        { id: documents4NoGroup, label: labels.noOwner },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Documents4GroupBy | null =>
  documents4GroupBys.find((item) => item === value) ?? null

export function Documents4({
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
}: Readonly<Documents4Props>) {
  const labels = useMemo(
    () => resolveDocuments4Labels(labelsProp),
    [labelsProp],
  )
  const [mode, setMode] = useControllable<Documents4Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sort, setSort] = useControllable<Documents4Sort>(
    sortProp,
    'updated',
    onSortChange,
  )
  const [groupBy, setGroupBy] = useControllable<Documents4GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [typeFilter, setTypeFilter] = useControllable<Documents4Type | null>(
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

  const pinnedOrder = useMemo(
    () =>
      new Map(
        records
          .filter((item) => item.pinned)
          .map((item, index) => [item.id, index]),
      ),
    [records],
  )

  const context = useMemo<Documents4FieldContext>(
    () => ({
      labels,
      locale,
      onDelete: remove,
      onDownload: download,
      onOpen: openRecord,
      onPinnedChange: changePinned,
      onSelectedChange: toggleSelected,
      people,
      pinnedOrder,
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
      pinnedOrder,
      remove,
      selectedSet,
      timeZone,
      toggleSelected,
      typeColors,
    ],
  )

  const groupings = useMemo(
    () => createDocuments4Groupings(labels, people),
    [labels, people],
  )
  const tableRecords = useMemo(() => {
    const dimension =
      mode === 'table' ? groupings.find(({ id }) => id === groupBy) : undefined
    if (!dimension) return records
    const rank = new Map(
      dimension.options.map((option, index) => [option.id, index]),
    )
    const rankOf = (item: Documents4Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [groupBy, groupings, mode, records])
  const collection = useMemo<DataCollectionDefinition<Documents4Record>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.name,
      groupings,
      records: tableRecords,
    }),
    [groupings, tableRecords],
  )

  const columns = useMemo(
    () => createDocuments4Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Documents4Record>({
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
    rows: readonly Documents4Record[],
    clear: () => void,
  ) => (
    <ActionBar
      actions={createDocuments4SelectionActions({
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
    skeleton: <Documents4Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="documents-4"
      title={labels.title}
      toolbar={
        <Documents4Toolbar
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
            <DataCollectionViewSwitcher<typeof documents4AllView>
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
              view={documents4AllView}
              viewLabels={{ [documents4AllView]: labels.title }}
              views={documents4Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<Documents4Record>
          collapseEmptyGroups
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(item) => labels.openRecord(item.name)}
          groupBy={groupBy}
          label={labels.title}
          listHeader={
            <Documents4ListHeader
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
          renderGalleryRecord={renderDocuments4GalleryCard(context)}
          renderListRecord={renderDocuments4ListRow(context)}
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
