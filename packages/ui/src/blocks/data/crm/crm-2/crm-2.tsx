'use client'

import { InfoIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@tc96/ui/alert'
import { createAmountFormatter } from '@tc96/ui/helpers/format'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { CollectionKanbanViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
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
import { createCrm2Columns } from './crm-2-columns'
import type { Crm2FieldContext } from './crm-2-fields'
import {
  activeCrm2Stages,
  canMoveCrm2Lead,
  crm2Origins,
  crm2Views,
} from './crm-2-options'
import { renderCrm2KanbanCard } from './crm-2-records'
import { createCrm2SelectionActions } from './crm-2-selection-actions'
import { Crm2Skeleton } from './crm-2-skeleton'
import { Crm2Toolbar } from './crm-2-toolbar'
import { resolveCrm2Labels } from './labels'
import type {
  Crm2Archived,
  Crm2GroupBy,
  Crm2Lead,
  Crm2Mode,
  Crm2Origin,
  Crm2Props,
  Crm2Sort,
  Crm2View,
} from './types'

export {
  crm2Groupings,
  crm2Modes,
  crm2Origins,
  crm2Sorts,
} from './crm-2-options'

const defaultCurrency = 'BRL'
const stageColumnPrefix = 'stage:'

const noOwners: NonNullable<Crm2Props['owners']> = []
const noStages: NonNullable<Crm2Props['stages']> = []
const noOptions: NonNullable<Crm2Props['tags']> = []
const noIds: string[] = []

const stageIdOf = (columnId: string) =>
  columnId.startsWith(stageColumnPrefix)
    ? columnId.slice(stageColumnPrefix.length)
    : columnId

export function Crm2({
  archivedFilter: archivedFilterProp,
  boardHasMore = false,
  className,
  counts,
  currency = defaultCurrency,
  error,
  filtered = false,
  groupBy: groupByProp,
  labels: labelsProp,
  leads,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
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
  onSortChange,
  onStageChange,
  onStageFilterChange,
  onTagFilterChange,
  onViewChange,
  originFilter: originFilterProp,
  ownerFilter: ownerFilterProp,
  owners = noOwners,
  ownersLoading = false,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading = false,
  savedViewsPending,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  stageFilter: stageFilterProp,
  stageValues,
  stages = noStages,
  stagesLoading = false,
  tagFilter: tagFilterProp,
  tags = noOptions,
  tagsLoading = false,
  timeZone = defaultDataCollectionTimeZone,
  total,
  view: viewProp,
}: Readonly<Crm2Props>) {
  const labels = useMemo(() => resolveCrm2Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Crm2Mode>(
    modeProp,
    'kanban',
    onModeChange,
  )
  const [view, setView] = useControllable<Crm2View>(
    viewProp,
    'all',
    onViewChange,
  )
  const [groupBy, setGroupBy] = useControllable<Crm2GroupBy>(
    groupByProp,
    'stage',
    onGroupByChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Crm2Sort>(
    sortProp,
    'created',
    onSortChange,
  )
  const [stageFilter, setStageFilter] = useControllable<string | null>(
    stageFilterProp,
    null,
    onStageFilterChange,
  )
  const [ownerFilter, setOwnerFilter] = useControllable<string | null>(
    ownerFilterProp,
    null,
    onOwnerFilterChange,
  )
  const [originFilter, setOriginFilter] = useControllable<Crm2Origin | null>(
    originFilterProp,
    null,
    onOriginFilterChange,
  )
  const [tagFilter, setTagFilter] = useControllable<string[]>(
    tagFilterProp,
    noIds,
    onTagFilterChange,
  )
  const [archivedFilter, setArchivedFilter] =
    useControllable<Crm2Archived | null>(
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

  const openLead = useStableHandler(onOpen)
  const changeOrigin = useStableHandler(onOriginChange)
  const changeOwner = useStableHandler(onOwnerChange)
  const changeStage = useStableHandler(onStageChange)
  const createInStage = useStableHandler(onCreateInStage)

  const formatMoney = useMemo(() => {
    const formatter = createAmountFormatter({ currency, locale })
    return (cents: number) => formatter.format(cents / 100)
  }, [currency, locale])

  const context = useMemo<Crm2FieldContext>(
    () => ({
      formatMoney,
      labels,
      locale,
      onOpen: openLead,
      onOriginChange: changeOrigin,
      onOwnerChange: changeOwner,
      onStageChange: changeStage,
      owners,
      stages,
      tags,
      timeZone,
    }),
    [
      changeOrigin,
      changeOwner,
      changeStage,
      formatMoney,
      labels,
      locale,
      openLead,
      owners,
      stages,
      tags,
      timeZone,
    ],
  )

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkArchive ||
      onBulkOwnerChange ||
      onBulkStageChange,
  )

  const collection = useMemo<DataCollectionDefinition<Crm2Lead>>(() => {
    const holds = (match: (lead: Crm2Lead) => boolean) => leads.some(match)
    return {
      getKey: (item) => item.id,
      getLabel: (item) => item.title,
      groupings: [
        {
          getGroupId: (item) => item.stageId,
          id: 'stage',
          label: labels.groupings.stage,
          options: stages
            .filter(
              (stage) =>
                !stage.inactive || holds((lead) => lead.stageId === stage.id),
            )
            .map(({ id, label }) => ({ id, label })),
        },
        {
          getGroupId: (item) => item.ownerId,
          id: 'owner',
          label: labels.groupings.owner,
          options: owners
            .filter((owner) => holds((lead) => lead.ownerId === owner.id))
            .map(({ id, label }) => ({ id, label })),
          unassignedLabel: labels.unassigned,
        },
        {
          getGroupId: (item) => item.origin,
          id: 'origin',
          label: labels.groupings.origin,
          options: crm2Origins
            .filter((origin) => holds((lead) => lead.origin === origin))
            .map((origin) => ({ id: origin, label: labels.origins[origin] })),
        },
      ],
      records: leads,
    }
  }, [labels, leads, owners, stages])

  const kanban = useMemo<CollectionKanbanViewProps<Crm2Lead>>(() => {
    const byStage = groupBy === 'stage'
    const activeStageOf = (stageId: string | null) =>
      stages.find((stage) => stage.id === stageId && !stage.inactive)
    return {
      emptyColumnLabel: labels.emptyColumn,
      getColumnActions:
        byStage && createInStage
          ? (column) => {
              const stage = activeStageOf(stageIdOf(column.id))
              if (!stage) return undefined
              return {
                addLabel: labels.createInStage(stage.label),
                onAddCard: () => createInStage(stage.id),
              }
            }
          : undefined,
      onMoveCard:
        byStage && changeStage
          ? ({ card, targetGroup }) => {
              const stage = activeStageOf(targetGroup.value)
              if (stage && stage.id !== card.stageId && canMoveCrm2Lead(card))
                changeStage(card.id, stage.id)
              return false
            }
          : undefined,
      renderColumnTitle: (column) => {
        const value =
          byStage && stageValues
            ? (stageValues[stageIdOf(column.id)] ?? 0)
            : column.cards.reduce(
                (sum, lead) => sum + (lead.valueCents ?? 0),
                0,
              )
        return (
          <>
            {column.title}
            {value > 0 ? (
              <span
                className="ms-2 font-normal text-muted-foreground text-xs tabular-nums"
                data-slot="crm-2-column-value"
              >
                {formatMoney(value)}
              </span>
            ) : null}
          </>
        )
      },
    }
  }, [
    changeStage,
    createInStage,
    formatMoney,
    groupBy,
    labels,
    stageValues,
    stages,
  ])

  const columns = useMemo(
    () => createCrm2Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Crm2Lead>({
    columns,
    data: leads,
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
    skeleton: <Crm2Skeleton label={labels.loading} mode={mode} />,
  })

  const isBoard = mode === 'kanban'
  const hasRecords = total === undefined ? leads.length > 0 : total > 0
  const showSwitcher = Boolean(
    savedViews?.length || savedViewsLoading || onSavedViewCreate,
  )

  return (
    <DataCollectionFrame
      className={className}
      data-block="crm-2"
      notice={
        isBoard && boardHasMore && !loadState ? (
          <Alert role="status" variant="info">
            <InfoIcon aria-hidden="true" />
            <AlertDescription>{labels.boardHasMore}</AlertDescription>
          </Alert>
        ) : undefined
      }
      title={labels.title}
      toolbar={
        <Crm2Toolbar
          archivedFilter={archivedFilter}
          groupBy={groupBy}
          labels={labels}
          left={
            showSwitcher ? (
              <DataCollectionViewSwitcher<Crm2View>
                counts={counts}
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
                views={crm2Views}
              />
            ) : undefined
          }
          loading={Boolean(loadState)}
          mode={mode}
          onArchivedFilterChange={
            onArchivedFilterChange ? setArchivedFilter : undefined
          }
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          onModeChange={setMode}
          onOriginFilterChange={
            onOriginFilterChange ? setOriginFilter : undefined
          }
          onOwnerFilterChange={setOwnerFilter}
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStageFilterChange={setStageFilter}
          onTagFilterChange={setTagFilter}
          originFilter={originFilter}
          ownerFilter={ownerFilter}
          owners={owners}
          ownersLoading={ownersLoading}
          search={search}
          sort={sort}
          stageFilter={stageFilter}
          stages={activeCrm2Stages(stages)}
          stagesLoading={stagesLoading}
          tagFilter={tagFilter}
          tags={tags}
          tagsLoading={tagsLoading}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Crm2Lead>
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          footer={
            !isBoard && pageCount !== undefined && hasRecords ? (
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
          getRowOpenLabel={(item) => labels.openRecord(item.title)}
          groupBy={isBoard ? groupBy : null}
          kanban={kanban}
          label={labels.title}
          mode={mode}
          onOpen={openLead ? (item) => openLead(item.id) : undefined}
          renderKanbanRecord={renderCrm2KanbanCard(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createCrm2SelectionActions({
                      labels,
                      onBulkArchive,
                      onBulkOwnerChange,
                      onBulkStageChange,
                      onDone: clearSelection,
                      owners,
                      selectedRows,
                      stages,
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
