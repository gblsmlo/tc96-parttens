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
import { createCrm3Columns } from './crm-3-columns'
import type { Crm3FieldContext } from './crm-3-fields'
import {
  activeCrm3Stages,
  canMoveCrm3Lead,
  crm3Origins,
  crm3Views,
} from './crm-3-options'
import { renderCrm3KanbanCard } from './crm-3-records'
import { createCrm3SelectionActions } from './crm-3-selection-actions'
import { Crm3Skeleton } from './crm-3-skeleton'
import { Crm3Toolbar } from './crm-3-toolbar'
import { resolveCrm3Labels } from './labels'
import type {
  Crm3Archived,
  Crm3GroupBy,
  Crm3Lead,
  Crm3Mode,
  Crm3Origin,
  Crm3Props,
  Crm3Sort,
  Crm3View,
} from './types'

export {
  crm3Groupings,
  crm3Modes,
  crm3Origins,
  crm3Sorts,
} from './crm-3-options'

const defaultCurrency = 'BRL'
const crm3AllView = 'all'
const stageColumnPrefix = 'stage:'

const noOwners: NonNullable<Crm3Props['owners']> = []
const noStages: NonNullable<Crm3Props['stages']> = []
const noOptions: NonNullable<Crm3Props['tags']> = []
const noIds: string[] = []

const stageIdOf = (columnId: string) =>
  columnId.startsWith(stageColumnPrefix)
    ? columnId.slice(stageColumnPrefix.length)
    : columnId

export function Crm3({
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
  onSelectedIdsChange,
  onSortChange,
  onStageChange,
  onStageFilterChange,
  onTagFilterChange,
  originFilter: originFilterProp,
  ownerFilter: ownerFilterProp,
  owners = noOwners,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading = false,
  savedViewsPending,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  stageFilter: stageFilterProp,
  stageValues,
  stages = noStages,
  tagFilter: tagFilterProp,
  tags = noOptions,
  timeZone = defaultDataCollectionTimeZone,
  total,
}: Readonly<Crm3Props>) {
  const labels = useMemo(() => resolveCrm3Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Crm3Mode>(
    modeProp,
    'kanban',
    onModeChange,
  )
  const [groupBy, setGroupBy] = useControllable<Crm3GroupBy>(
    groupByProp,
    'stage',
    onGroupByChange,
  )
  const [sort, setSort] = useControllable<Crm3Sort>(
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
  const [originFilter, setOriginFilter] = useControllable<Crm3Origin | null>(
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
    useControllable<Crm3Archived | null>(
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

  const context = useMemo<Crm3FieldContext>(
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

  const collection = useMemo<DataCollectionDefinition<Crm3Lead>>(() => {
    const holds = (match: (lead: Crm3Lead) => boolean) => leads.some(match)
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
          options: crm3Origins
            .filter((origin) => holds((lead) => lead.origin === origin))
            .map((origin) => ({ id: origin, label: labels.origins[origin] })),
        },
      ],
      records: leads,
    }
  }, [labels, leads, owners, stages])

  const kanban = useMemo<CollectionKanbanViewProps<Crm3Lead>>(() => {
    const byStage = groupBy === 'stage'
    const activeStageOf = (stageId: string | null) =>
      stages.find((stage) => stage.id === stageId && !stage.inactive)
    return {
      emptyGroupLabel: labels.emptyColumn,
      getGroupActions:
        byStage && createInStage
          ? (column) => {
              const stage = activeStageOf(stageIdOf(column.id))
              if (!stage) return undefined
              return {
                addLabel: labels.createInStage(stage.label),
                onRecordAdd: () => createInStage(stage.id),
              }
            }
          : undefined,
      onRecordMove:
        byStage && changeStage
          ? ({ card, targetGroup }) => {
              const stage = activeStageOf(targetGroup.value)
              if (stage && stage.id !== card.stageId && canMoveCrm3Lead(card))
                changeStage(card.id, stage.id)
              return false
            }
          : undefined,
      renderGroupTitle: (column) => {
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
                data-slot="crm-3-column-value"
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
    () => createCrm3Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Crm3Lead>({
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
    skeleton: <Crm3Skeleton label={labels.loading} mode={mode} />,
  })

  const isBoard = mode === 'kanban'
  const hasRecords = total === undefined ? leads.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={className}
      data-block="crm-3"
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
        <Crm3Toolbar
          archivedFilter={archivedFilter}
          groupBy={groupBy}
          labels={labels}
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
          onOwnerFilterChange={onOwnerFilterChange ? setOwnerFilter : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStageFilterChange={onStageFilterChange ? setStageFilter : undefined}
          onTagFilterChange={onTagFilterChange ? setTagFilter : undefined}
          originFilter={originFilter}
          ownerFilter={ownerFilter}
          owners={owners}
          sort={sort}
          stageFilter={stageFilter}
          stages={activeCrm3Stages(stages)}
          tagFilter={tagFilter}
          tags={tags}
          viewSwitcher={
            <DataCollectionViewSwitcher<Crm3View>
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
              onViewChange={() => onSavedViewSelect?.(null)}
              savedViewId={savedViewId}
              savedViewLabels={labels.savedViews}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={crm3AllView}
              viewCountName={labels.viewCountName}
              viewLabels={labels.views}
              views={crm3Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<Crm3Lead>
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
          renderKanbanRecord={renderCrm3KanbanCard(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createCrm3SelectionActions({
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
