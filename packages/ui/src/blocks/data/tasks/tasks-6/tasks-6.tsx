'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { CollectionKanbanViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { PropertyMetaIcon, priorityMeta } from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import { useMemo, useState } from 'react'
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
import { dataPriorities } from '../../shared/properties/data-priority'
import { resolveTasks6Labels } from './labels'
import { findTasks6Priority, type Tasks6FieldContext } from './tasks-6-fields'
import {
  createTasks6SortOptions,
  createTasks6StatusOptions,
  tasks6DefaultSortDirection,
  tasks6NoGroup,
  tasks6Sorts,
} from './tasks-6-options'
import {
  renderTasks6KanbanCard,
  renderTasks6ListRow,
  Tasks6ListHeader,
} from './tasks-6-records'
import { createTasks6SelectionActions } from './tasks-6-selection-actions'
import { Tasks6Skeleton } from './tasks-6-skeleton'
import { Tasks6Toolbar } from './tasks-6-toolbar'
import type {
  Tasks6KanbanGroupBy,
  Tasks6Labels,
  Tasks6Mode,
  Tasks6PriorityFilter,
  Tasks6Props,
  Tasks6Sort,
  Tasks6SortColumn,
  Tasks6SortDirection,
  Tasks6SortOption,
  Tasks6Status,
  Tasks6StatusOption,
  Tasks6Task,
} from './types'

export {
  tasks6KanbanGroupBys,
  tasks6Modes,
  tasks6PriorityFilters,
  tasks6Sorts,
  tasks6Statuses,
} from './tasks-6-options'

type Tasks6Grouping = DataCollectionDefinition<Tasks6Task>['groupings'][number]

const tasks6AllView = 'all'
const tasks6Views = [tasks6AllView] as const

const noPeople: NonNullable<Tasks6Props['people']> = []
const noOptions: NonNullable<Tasks6Props['projects']> = []
const noTags: NonNullable<Tasks6Props['tags']> = []
const noIds: string[] = []
const noColumns: [] = []
const groupIcon = 'size-4'

function createTasks6Groupings(
  labels: Tasks6Labels,
  statuses: readonly Tasks6StatusOption[],
): Tasks6Grouping[] {
  return [
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: statuses.map((status) => ({
        icon: <PropertyMetaIcon className={groupIcon} meta={status.meta} />,
        id: status.id,
        label: status.label,
      })),
    },
    {
      getGroupId: (task) => task.priority ?? tasks6NoGroup,
      id: 'priority',
      label: labels.groupings.priority,
      options: [
        ...dataPriorities.map((priority) => ({
          icon: (
            <PropertyMetaIcon
              className={groupIcon}
              meta={priorityMeta[priority]}
            />
          ),
          id: priority,
          label: labels.priorities[priority],
        })),
        {
          icon: (
            <PropertyMetaIcon className={groupIcon} meta={priorityMeta.none} />
          ),
          id: tasks6NoGroup,
          label: labels.noPriority,
        },
      ],
    },
  ]
}

const directionOf = (
  sort: Tasks6Sort,
  options: readonly Tasks6SortOption[],
): Tasks6SortDirection =>
  options.find((option) => option.id === sort)?.direction ??
  tasks6DefaultSortDirection[tasks6Sorts.find((item) => item === sort) ?? 'due']

export function Tasks6({
  actionBar,
  activeFilterCount,
  assigneeFilter: assigneeFilterProp,
  className,
  error,
  filtered = false,
  filters,
  footer,
  kanbanGroupBy: kanbanGroupByProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  now: nowProp,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkAssigneesChange,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkProjectChange,
  onBulkStatusChange,
  onClearFilters,
  onCreate,
  onDueChange,
  onKanbanGroupByChange,
  onModeChange,
  onOpen,
  onPriorityChange,
  onPriorityFilterChange,
  onProjectChange,
  onTagsChange,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  pending,
  people = noPeople,
  priorityFilter: priorityFilterProp,
  projects = noOptions,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  sortDirection: sortDirectionProp,
  sortOptions: sortOptionsProp,
  statuses: statusesProp,
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
}: Readonly<Tasks6Props>) {
  const labels = useMemo(() => resolveTasks6Labels(labelsProp), [labelsProp])
  const statuses = useMemo(
    () => statusesProp ?? createTasks6StatusOptions(labels),
    [labels, statusesProp],
  )
  const sortOptions = useMemo(
    () => sortOptionsProp ?? createTasks6SortOptions(labels),
    [labels, sortOptionsProp],
  )
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [mode, setMode] = useControllable<Tasks6Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sortState, setSortState] = useControllable<{
    direction: Tasks6SortDirection
    sort: Tasks6Sort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? directionOf(sortProp, sortOptions),
          sort: sortProp,
        }
      : undefined,
    {
      direction: directionOf(sortOptions[0]?.id ?? 'due', sortOptions),
      sort: sortOptions[0]?.id ?? 'due',
    },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Tasks6Sort) =>
    setSortState({ direction: directionOf(next, sortOptions), sort: next })
  const sortByColumn = (column: Tasks6SortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: tasks6DefaultSortDirection[column], sort: column },
    )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const selectable = Boolean(
    actionBar ||
      onBulkAssigneesChange ||
      onBulkDelete ||
      onBulkPriorityChange ||
      onBulkProjectChange ||
      onBulkStatusChange,
  )
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const toggleSelected = useStableHandler(
    selectable
      ? (taskId: string, checked: boolean) =>
          setSelectedIds(
            checked
              ? [...selectedIds.filter((id) => id !== taskId), taskId]
              : selectedIds.filter((id) => id !== taskId),
          )
      : undefined,
  )
  const [kanbanGroupBy, setKanbanGroupBy] =
    useControllable<Tasks6KanbanGroupBy>(
      kanbanGroupByProp,
      'status',
      onKanbanGroupByChange,
    )
  const [statusFilter, setStatusFilter] = useControllable<Tasks6Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [priorityFilter, setPriorityFilter] =
    useControllable<Tasks6PriorityFilter | null>(
      priorityFilterProp,
      null,
      onPriorityFilterChange,
    )
  const [assigneeFilter, setAssigneeFilter] = useControllable<string | null>(
    assigneeFilterProp,
    null,
    onAssigneeFilterChange,
  )

  const openTask = useStableHandler(onOpen)
  const changeAssignees = useStableHandler(onAssigneesChange)
  const changeDue = useStableHandler(onDueChange)
  const changePriority = useStableHandler(onPriorityChange)
  const changeProject = useStableHandler(onProjectChange)
  const changeTags = useStableHandler(onTagsChange)
  const changeStatus = useStableHandler(onStatusChange)

  const tagById = useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag])),
    [tags],
  )
  const context = useMemo<Tasks6FieldContext>(
    () => ({
      labels,
      locale,
      now,
      onAssigneesChange: changeAssignees,
      onDueChange: changeDue,
      onOpen: openTask,
      onProjectChange: changeProject,
      onSelectedChange: toggleSelected,
      onStatusChange: changeStatus,
      onTagsChange: changeTags,
      people,
      projects,
      selectedIds: selectedSet,
      statuses,
      tagById,
      timeZone,
    }),
    [
      changeAssignees,
      changeDue,
      changeProject,
      changeStatus,
      changeTags,
      labels,
      locale,
      now,
      openTask,
      people,
      projects,
      selectedSet,
      statuses,
      tagById,
      timeZone,
      toggleSelected,
    ],
  )

  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : null

  const groupings = useMemo(
    () => createTasks6Groupings(labels, statuses),
    [labels, statuses],
  )
  const collection = useMemo<DataCollectionDefinition<Tasks6Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tasks,
    }),
    [groupings, tasks],
  )
  const { table } = useDataTable<Tasks6Task>({
    columns: noColumns,
    data: tasks,
    getRowId: (task) => task.id,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Tasks6Task>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove:
        (kanbanGroupBy === 'status' && changeStatus) ||
        (kanbanGroupBy === 'priority' && changePriority)
          ? ({ card, sourceGroup, targetGroup }) => {
              if (sourceGroup.id === targetGroup.id) return false
              if (targetGroup.grouping === 'status') {
                const status = statuses.find(
                  (item) => item.id === targetGroup.value,
                )
                if (status && status.id !== card.status)
                  changeStatus?.(card.id, status.id)
              }
              if (targetGroup.grouping === 'priority') {
                const priority = findTasks6Priority(targetGroup.value)
                if (priority !== card.priority)
                  changePriority?.(card.id, priority)
              }
              return false
            }
          : undefined,
    }),
    [changePriority, changeStatus, kanbanGroupBy, labels.emptyColumn, statuses],
  )

  const selectedRows = useMemo(
    () => tasks.filter((task) => selectedSet.has(task.id)),
    [selectedSet, tasks],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending: pending && tasks.length === 0,
    skeleton: <Tasks6Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      aria-busy={pending || undefined}
      className={className}
      data-block="tasks-6"
      title={labels.title}
      toolbar={
        <Tasks6Toolbar
          activeFilterCount={activeFilterCount}
          filters={filters}
          onClearFilters={onClearFilters}
          assigneeFilter={assigneeFilter}
          kanbanGroupBy={kanbanGroupBy}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          onAssigneeFilterChange={
            onAssigneeFilterChange ? setAssigneeFilter : undefined
          }
          onCreate={onCreate}
          onKanbanGroupByChange={setKanbanGroupBy}
          onModeChange={setMode}
          onPriorityFilterChange={
            onPriorityFilterChange ? setPriorityFilter : undefined
          }
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          people={people}
          priorityFilter={priorityFilter}
          sort={sort}
          sortOptions={sortOptions}
          statuses={statuses}
          statusFilter={statusFilter}
          viewSwitcher={
            <DataCollectionViewSwitcher<typeof tasks6AllView>
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
              view={tasks6AllView}
              viewLabels={{ [tasks6AllView]: labels.defaultView }}
              views={tasks6Views}
            />
          }
        />
      }
    >
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col transition-opacity',
          pending && 'pointer-events-none opacity-60',
        )}
        data-slot="tasks-6-body"
      >
        {loadState ?? (
          <DataCollection<Tasks6Task>
            collection={collection}
            emptyMessage={filtered ? labels.noResult : labels.empty}
            groupBy={activeGroupBy}
            kanban={kanban}
            label={labels.title}
            listHeader={
              <Tasks6ListHeader
                labels={labels}
                selection={
                  selectable && tasks.length > 0
                    ? {
                        checked: tasks.every((task) =>
                          selectedSet.has(task.id),
                        ),
                        indeterminate:
                          selectedSet.size > 0 &&
                          !tasks.every((task) => selectedSet.has(task.id)),
                        onCheckedChange: (checked) =>
                          setSelectedIds(
                            checked ? tasks.map((task) => task.id) : noIds,
                          ),
                      }
                    : undefined
                }
                onSort={onSortChange ? sortByColumn : undefined}
                sort={sort}
                sortDirection={sortDirection}
              />
            }
            mode={mode}
            onOpen={openTask ? (task) => openTask(task.id) : undefined}
            renderKanbanRecord={renderTasks6KanbanCard(context)}
            renderListRecord={renderTasks6ListRow(context)}
            table={table}
          />
        )}
        {!loadState && mode === 'list' && selectable ? (
          <div className="pointer-events-none sticky bottom-3 flex justify-center *:pointer-events-auto">
            {actionBar ?? (
              <ActionBar
                actions={createTasks6SelectionActions({
                  labels,
                  onBulkAssigneesChange,
                  onBulkDelete,
                  onBulkPriorityChange,
                  onBulkProjectChange,
                  onBulkStatusChange,
                  onDone: () => setSelectedIds(noIds),
                  people,
                  projects,
                  selectedRows,
                  statuses,
                })}
                clearSelectionLabel={labels.clearSelection}
                formatSelection={labels.selectedCount}
                label={labels.selectionActions}
                onClearSelection={() => setSelectedIds(noIds)}
                selectedCount={selectedRows.length}
                selectedRows={selectedRows}
              />
            )}
          </div>
        ) : null}
      </div>
      {footer}
    </DataCollectionFrame>
  )
}
