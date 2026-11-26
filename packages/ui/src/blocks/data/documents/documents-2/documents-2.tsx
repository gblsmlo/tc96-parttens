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
import { createDocuments2Columns } from './documents-2-columns'
import type { Documents2FieldContext } from './documents-2-fields'
import {
  documents2GroupBys,
  documents2NoGroup,
  documents2TypeIcons,
  documents2Types,
} from './documents-2-options'
import { Documents2Pinned } from './documents-2-pinned'
import {
  Documents2ListHeader,
  renderDocuments2GalleryCard,
  renderDocuments2ListRow,
} from './documents-2-records'
import { createDocuments2SelectionActions } from './documents-2-selection-actions'
import { Documents2Skeleton } from './documents-2-skeleton'
import { Documents2Toolbar } from './documents-2-toolbar'
import { resolveDocuments2Labels } from './labels'
import type {
  Documents2GroupBy,
  Documents2Labels,
  Documents2Mode,
  Documents2Person,
  Documents2Props,
  Documents2Record,
  Documents2Sort,
  Documents2Type,
} from './types'

export {
  documents2GroupBys,
  documents2Modes,
  documents2Sorts,
  documents2Types,
} from './documents-2-options'

type Documents2Grouping =
  DataCollectionDefinition<Documents2Record>['groupings'][number]

const documents2AllView = 'all'
const documents2Views = [documents2AllView] as const

const noPeople: NonNullable<Documents2Props['people']> = []
const noRecords: Documents2Record[] = []
const noIds: string[] = []
const groupIcon = 'size-4'

function createDocuments2Groupings(
  labels: Documents2Labels,
  people: readonly Documents2Person[],
): Documents2Grouping[] {
  return [
    {
      getGroupId: (item) => item.type,
      id: 'type',
      label: labels.groupings.type,
      options: documents2Types.map((type) => {
        const TypeIcon = documents2TypeIcons[type]
        return {
          icon: <TypeIcon aria-hidden="true" className={groupIcon} />,
          id: type,
          label: labels.types[type],
        }
      }),
    },
    {
      getGroupId: (item) => item.ownerId ?? documents2NoGroup,
      id: 'owner',
      label: labels.groupings.owner,
      options: [
        ...people.map((person) => ({
          icon: <UserCircleIcon aria-hidden="true" className={groupIcon} />,
          id: person.id,
          label: person.label,
        })),
        { id: documents2NoGroup, label: labels.noOwner },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Documents2GroupBy | null =>
  documents2GroupBys.find((item) => item === value) ?? null

export function Documents2({
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
}: Readonly<Documents2Props>) {
  const labels = useMemo(
    () => resolveDocuments2Labels(labelsProp),
    [labelsProp],
  )
  const [mode, setMode] = useControllable<Documents2Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sort, setSort] = useControllable<Documents2Sort>(
    sortProp,
    'updated',
    onSortChange,
  )
  const [groupBy, setGroupBy] = useControllable<Documents2GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [typeFilter, setTypeFilter] = useControllable<Documents2Type | null>(
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

  const context = useMemo<Documents2FieldContext>(
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
    () => createDocuments2Groupings(labels, people),
    [labels, people],
  )
  const tableRecords = useMemo(() => {
    const dimension =
      mode === 'table' ? groupings.find(({ id }) => id === groupBy) : undefined
    if (!dimension) return records
    const rank = new Map(
      dimension.options.map((option, index) => [option.id, index]),
    )
    const rankOf = (item: Documents2Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [groupBy, groupings, mode, records])
  const collection = useMemo<DataCollectionDefinition<Documents2Record>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.name,
      groupings,
      records: tableRecords,
    }),
    [groupings, tableRecords],
  )

  const columns = useMemo(
    () => createDocuments2Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Documents2Record>({
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
    rows: readonly Documents2Record[],
    clear: () => void,
  ) => (
    <ActionBar
      actions={createDocuments2SelectionActions({
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
    skeleton: <Documents2Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="documents-2"
      subheader={
        loadState ? undefined : (
          <Documents2Pinned context={context} records={pinnedRecords} />
        )
      }
      title={labels.title}
      toolbar={
        <Documents2Toolbar
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
            <DataCollectionViewSwitcher<typeof documents2AllView>
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
              view={documents2AllView}
              viewLabels={{ [documents2AllView]: labels.title }}
              views={documents2Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<Documents2Record>
          collapseEmptyGroups
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(item) => labels.openRecord(item.name)}
          groupBy={groupBy}
          label={labels.title}
          listHeader={
            <Documents2ListHeader
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
          renderGalleryRecord={renderDocuments2GalleryCard(context)}
          renderListRecord={renderDocuments2ListRow(context)}
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
