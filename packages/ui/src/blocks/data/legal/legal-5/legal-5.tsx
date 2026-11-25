'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal5Labels } from './labels'
import { createLegal5Columns } from './legal-5-columns'
import type { Legal5FieldContext } from './legal-5-fields'
import { legal5Views } from './legal-5-options'
import { renderLegal5ListRow } from './legal-5-records'
import { createLegal5SelectionActions } from './legal-5-selection-actions'
import { Legal5Skeleton } from './legal-5-skeleton'
import { Legal5Toolbar } from './legal-5-toolbar'
import type {
  Legal5Archived,
  Legal5GroupBy,
  Legal5Mode,
  Legal5Pole,
  Legal5Props,
  Legal5Record,
  Legal5Situation,
  Legal5Sort,
  Legal5View,
} from './types'

export { legal5Modes, legal5Views } from './legal-5-options'

const noOwners: NonNullable<Legal5Props['owners']> = []
const noPhases: NonNullable<Legal5Props['phases']> = []
const noOptions: NonNullable<Legal5Props['tags']> = []
const noIds: string[] = []

export function Legal5({
  archivedFilter: archivedFilterProp,
  className,
  clientFilter: clientFilterProp,
  clients = noOptions,
  clientsLoading = false,
  collapsedGroupIds,
  counts,
  error,
  filtered = false,
  groupBy: groupByProp,
  labels: labelsProp,
  mode: modeProp,
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
  onRetry,
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
  ownerFilter: ownerFilterProp,
  owners = noOwners,
  ownersLoading = false,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  phaseFilter: phaseFilterProp,
  phases = noPhases,
  phasesLoading = false,
  poleFilter: poleFilterProp,
  records,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  search: searchProp,
  selectedIds: selectedIdsProp,
  situationFilter: situationFilterProp,
  sort: sortProp,
  tagFilter: tagFilterProp,
  tags = noOptions,
  tagsLoading = false,
  total,
  view: viewProp,
}: Readonly<Legal5Props>) {
  const labels = useMemo(() => resolveLegal5Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal5Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [view, setView] = useControllable<Legal5View>(
    viewProp,
    'all',
    onViewChange,
  )
  const [groupBy, setGroupBy] = useControllable<Legal5GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Legal5Sort | null>(
    sortProp,
    null,
    onSortChange,
  )
  const [phaseFilter, setPhaseFilter] = useControllable<string[]>(
    phaseFilterProp,
    noIds,
    onPhaseFilterChange,
  )
  const [ownerFilter, setOwnerFilter] = useControllable<string | null>(
    ownerFilterProp,
    null,
    onOwnerFilterChange,
  )
  const [clientFilter, setClientFilter] = useControllable<string | null>(
    clientFilterProp,
    null,
    onClientFilterChange,
  )
  const [tagFilter, setTagFilter] = useControllable<string[]>(
    tagFilterProp,
    noIds,
    onTagFilterChange,
  )
  const [poleFilter, setPoleFilter] = useControllable<Legal5Pole | null>(
    poleFilterProp,
    null,
    onPoleFilterChange,
  )
  const [situationFilter, setSituationFilter] =
    useControllable<Legal5Situation | null>(
      situationFilterProp,
      null,
      onSituationFilterChange,
    )
  const [archivedFilter, setArchivedFilter] =
    useControllable<Legal5Archived | null>(
      archivedFilterProp,
      null,
      onArchivedFilterChange,
    )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openRecord = useStableHandler(onOpen)
  const changeOwner = useStableHandler(onOwnerChange)
  const changePhase = useStableHandler(onPhaseChange)
  const changeTags = useStableHandler(onTagsChange)
  const unarchive = useStableHandler(onUnarchive)

  const context = useMemo<Legal5FieldContext>(
    () => ({
      labels,
      onOpen: openRecord,
      onOwnerChange: changeOwner,
      onPhaseChange: changePhase,
      onTagsChange: changeTags,
      onUnarchive: unarchive,
      owners,
      phases,
      tags,
      tagsLoading,
    }),
    [
      changeOwner,
      changePhase,
      changeTags,
      labels,
      openRecord,
      owners,
      phases,
      tags,
      tagsLoading,
      unarchive,
    ],
  )

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkArchive ||
      onBulkOwnerChange ||
      onBulkPhaseChange ||
      onBulkTagAdd,
  )

  const visiblePhases = useMemo(
    () =>
      view === 'all'
        ? phases
        : phases.filter((phase) => !phase.kind || phase.kind === view),
    [phases, view],
  )

  const collection = useMemo<DataCollectionDefinition<Legal5Record>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.title,
      groupings: [
        {
          getGroupId: (item) => item.phaseId,
          id: 'phase',
          label: labels.groupings.phase,
          options: visiblePhases.map(({ id, label }) => ({ id, label })),
        },
        {
          getGroupId: (item) => item.ownerId,
          id: 'owner',
          label: labels.groupings.owner,
          options: owners.map(({ id, label }) => ({ id, label })),
          unassignedLabel: labels.unassigned,
        },
      ],
      records,
    }),
    [labels, owners, records, visiblePhases],
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
    const rankOf = (item: Legal5Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [collection, groupBy, mode, records])

  const columns = useMemo(
    () => createLegal5Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Legal5Record>({
    columns,
    data: tableRecords,
    enableRowSelection: selectable,
    getRowId: (item) => item.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal5Skeleton label={labels.loading} />,
  })

  const hasRecords = total === undefined ? records.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-5"
      title={labels.title}
      toolbar={
        <Legal5Toolbar
          archivedFilter={archivedFilter}
          clientFilter={clientFilter}
          clients={clients}
          clientsLoading={clientsLoading}
          groupBy={groupBy}
          labels={labels}
          left={
            <DataCollectionViewSwitcher<Legal5View>
              counts={counts}
              label={labels.viewList}
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
              views={legal5Views}
            />
          }
          loading={Boolean(loadState)}
          mode={mode}
          onArchivedFilterChange={
            onArchivedFilterChange ? setArchivedFilter : undefined
          }
          onClientFilterChange={setClientFilter}
          onCreate={onCreate}
          onGroupByChange={onGroupByChange ? setGroupBy : undefined}
          onModeChange={setMode}
          onOwnerFilterChange={setOwnerFilter}
          onPhaseFilterChange={setPhaseFilter}
          onPoleFilterChange={onPoleFilterChange ? setPoleFilter : undefined}
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSituationFilterChange={
            onSituationFilterChange ? setSituationFilter : undefined
          }
          onSortChange={onSortChange ? setSort : undefined}
          onTagFilterChange={setTagFilter}
          ownerFilter={ownerFilter}
          owners={owners}
          ownersLoading={ownersLoading}
          phaseFilter={phaseFilter}
          phases={visiblePhases}
          phasesLoading={phasesLoading}
          poleFilter={poleFilter}
          search={search}
          showLawsuitFilters={view !== 'matter'}
          situationFilter={situationFilter}
          sort={sort}
          tagFilter={tagFilter}
          tags={tags}
          tagsLoading={tagsLoading}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Legal5Record>
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyGroupMessage={labels.emptyGroup}
          emptyMessage={(filtered ? labels.noResult : labels.empty)[view]}
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
          getRowOpenLabel={(item) => labels.openRecord(item.title)}
          groupBy={groupBy}
          label={labels.title}
          mode={mode}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onOpen={openRecord ? (item) => openRecord(item.id) : undefined}
          renderListRecord={renderLegal5ListRow(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createLegal5SelectionActions({
                      labels,
                      onBulkArchive,
                      onBulkOwnerChange,
                      onBulkPhaseChange,
                      onBulkTagAdd,
                      onDone: clearSelection,
                      owners,
                      phases,
                      selectedRows,
                      tags,
                    })}
                    clearSelectionLabel={labels.clearSelection}
                    formatSelection={labels.selectedCount}
                    label={labels.selectionActions}
                    onClearSelection={clearSelection}
                    selectedCount={selectedCount}
                    selectedRows={selectedRows}
                  />
                )
              : undefined
          }
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
