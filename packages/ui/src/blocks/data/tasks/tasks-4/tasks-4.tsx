'use client'

import { CubeIcon } from '@phosphor-icons/react'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { CollectionKanbanViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import {
  PropertyMetaIcon,
  priorityMeta,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
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
import {
  type TasksColumnId,
  type TasksGroupBy,
  type TasksKanbanGroupBy,
  type TasksMode,
  type TasksOption,
  type TasksPriorityFilter,
  type TasksSort,
  type TasksSortColumn,
  type TasksSortDirection,
  type TasksStatus,
  type TasksTask,
  tasksColumnIds,
  tasksDefaultSortDirection,
  tasksFilterIds,
  tasksGroupBys,
  tasksModes,
  tasksNoGroup,
  tasksSorts,
  tasksStatuses,
} from '../shared'
import {
  orderTasksByGrouping,
  tasksCollectionMode,
} from '../shared/tasks-collection'
import { createTasksCells, createTasksColumns } from '../shared/tasks-columns'
import {
  findTasksPriority,
  type TasksFieldContext,
} from '../shared/tasks-fields'
import { createTasksSelectionActions } from '../shared/tasks-selection-actions'
import { resolveTasks4Labels } from './labels'
import {
  renderTasks4KanbanCard,
  renderTasks4ListRow,
  Tasks4ListHeader,
} from './tasks-4-records'
import { Tasks4Skeleton } from './tasks-4-skeleton'
import { Tasks4Toolbar } from './tasks-4-toolbar'
import type { Tasks4Labels, Tasks4Props } from './types'

type Tasks4Grouping = DataCollectionDefinition<TasksTask>['groupings'][number]

const tasks4AllView = 'all'
const tasks4Views = [tasks4AllView] as const

const noPeople: NonNullable<Tasks4Props['people']> = []
const noOptions: NonNullable<Tasks4Props['kinds']> = []
const noTags: NonNullable<Tasks4Props['tags']> = []
const noIds: string[] = []
const groupIcon = 'size-4'

function createTasks4Groupings(
  labels: Tasks4Labels,
  kinds: readonly TasksOption[],
): Tasks4Grouping[] {
  return [
    {
      getGroupId: (task) => task.priority ?? tasksNoGroup,
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
          id: tasksNoGroup,
          label: labels.noPriority,
        },
      ],
    },
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: tasksStatuses.map((status) => ({
        icon: (
          <PropertyMetaIcon
            className={groupIcon}
            meta={workflowStatusMeta[status]}
          />
        ),
        id: status,
        label: labels.statuses[status],
      })),
    },
    {
      getGroupId: (task) => task.kindId ?? tasksNoGroup,
      id: 'kind',
      label: labels.groupings.kind,
      options: [
        ...kinds.map((kind) => ({
          icon: <CubeIcon aria-hidden="true" />,
          id: kind.id,
          label: kind.label,
        })),
        { id: tasksNoGroup, label: labels.noKind },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): TasksGroupBy | null =>
  tasksGroupBys.find((item) => item === value) ?? null

export function Tasks4({
  assigneeFilter: assigneeFilterProp,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  error,
  filtered = false,
  filters = tasksFilterIds,
  groupBy: groupByProp,
  groupBys = tasksGroupBys,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  kindFilter: kindFilterProp,
  kinds = noOptions,
  mode: modeProp,
  modes = tasksModes,
  now: nowProp,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkAssigneesChange,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkKindChange,
  onBulkStatusChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPriorityChange,
  onPriorityFilterChange,
  onKindChange,
  onKindFilterChange,
  onTagsChange,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSavePreference,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onVisibleColumnsChange,
  pending,
  people = noPeople,
  priorityFilter: priorityFilterProp,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  sortDirection: sortDirectionProp,
  sorts = tasksSorts,
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
  visibleColumns: visibleColumnsProp,
}: Readonly<Tasks4Props>) {
  const labels = useMemo(() => resolveTasks4Labels(labelsProp), [labelsProp])
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [modeState, setMode] = useControllable<TasksMode>(
    modeProp,
    'list',
    onModeChange,
  )
  const offeredModes = tasksModes.filter((item) => modes.includes(item))
  const mode =
    offeredModes.find((item) => item === modeState) ??
    offeredModes[0] ??
    modeState
  const [sortState, setSortState] = useControllable<{
    direction: TasksSortDirection
    sort: TasksSort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? tasksDefaultSortDirection[sortProp],
          sort: sortProp,
        }
      : undefined,
    { direction: tasksDefaultSortDirection.due, sort: 'due' },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: TasksSort) =>
    setSortState({ direction: tasksDefaultSortDirection[next], sort: next })
  const sortByColumn = (column: TasksSortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: tasksDefaultSortDirection[column], sort: column },
    )
  const sortColumn = useStableHandler(onSortChange ? sortByColumn : undefined)
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const selectable = Boolean(
    onBulkAssigneesChange ||
      onBulkDelete ||
      onBulkPriorityChange ||
      onBulkKindChange ||
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
  const [groupBy, setGroupBy] = useControllable<TasksGroupBy | null>(
    groupByProp,
    'priority',
    onGroupByChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<TasksStatus | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [priorityFilter, setPriorityFilter] =
    useControllable<TasksPriorityFilter | null>(
      priorityFilterProp,
      null,
      onPriorityFilterChange,
    )
  const [visibleColumnList, setVisibleColumnList] = useControllable<
    readonly TasksColumnId[]
  >(
    visibleColumnsProp,
    tasksColumnIds,
    onVisibleColumnsChange
      ? (next) => onVisibleColumnsChange([...next])
      : undefined,
  )
  const visibleColumns = useMemo<ReadonlySet<TasksColumnId>>(
    () => new Set<TasksColumnId>([...visibleColumnList, 'title']),
    [visibleColumnList],
  )
  const [assigneeFilter, setAssigneeFilter] = useControllable<string | null>(
    assigneeFilterProp,
    null,
    onAssigneeFilterChange,
  )
  const [kindFilter, setKindFilter] = useControllable<string | null>(
    kindFilterProp,
    null,
    onKindFilterChange,
  )

  const openTask = useStableHandler(onOpen)
  const changeAssignees = useStableHandler(onAssigneesChange)
  const changeDue = useStableHandler(onDueChange)
  const changePriority = useStableHandler(onPriorityChange)
  const changeKind = useStableHandler(onKindChange)
  const changeTags = useStableHandler(onTagsChange)
  const changeStatus = useStableHandler(onStatusChange)

  const tagById = useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag])),
    [tags],
  )
  const context = useMemo<TasksFieldContext>(
    () => ({
      labels,
      locale,
      now,
      onAssigneesChange: changeAssignees,
      onDueChange: changeDue,
      onOpen: openTask,
      onKindChange: changeKind,
      onPriorityChange: changePriority,
      onSelectedChange: toggleSelected,
      onStatusChange: changeStatus,
      onTagsChange: changeTags,
      kinds,
      people,
      selectedIds: selectedSet,
      tagById,
      timeZone,
      visibleColumns,
    }),
    [
      changeAssignees,
      changeDue,
      changeKind,
      changePriority,
      changeStatus,
      changeTags,
      labels,
      locale,
      now,
      openTask,
      kinds,
      people,
      selectedSet,
      tagById,
      timeZone,
      toggleSelected,
      visibleColumns,
    ],
  )

  const kanbanGroupBy: TasksKanbanGroupBy =
    groupBy === 'status' ? 'status' : 'priority'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const groupings = useMemo(
    () => createTasks4Groupings(labels, kinds),
    [kinds, labels],
  )
  const records = useMemo(
    () =>
      mode === 'datatable'
        ? orderTasksByGrouping(
            tasks,
            groupings.find(({ id }) => id === activeGroupBy),
          )
        : tasks,
    [activeGroupBy, groupings, mode, tasks],
  )
  const collection = useMemo<DataCollectionDefinition<TasksTask>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records,
    }),
    [groupings, records],
  )
  const columns = useMemo(
    () =>
      createTasksColumns({
        cells: createTasksCells(context),
        labels,
        onSort: sortColumn,
        selectable,
        sort,
        sortDirection,
      }),
    [context, labels, selectable, sort, sortColumn, sortDirection],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const columnVisibility = useMemo(
    () =>
      Object.fromEntries(
        tasksColumnIds.map((id) => [id, visibleColumns.has(id)]),
      ),
    [visibleColumns],
  )
  const { table } = useDataTable<TasksTask>({
    columnVisibility,
    columns,
    data: records,
    enableRowSelection: selectable,
    getRowId: (task) => task.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const kanban = useMemo<CollectionKanbanViewProps<TasksTask>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove:
        (kanbanGroupBy === 'status' && changeStatus) ||
        (kanbanGroupBy === 'priority' && changePriority)
          ? ({ card, sourceGroup, targetGroup }) => {
              if (sourceGroup.id === targetGroup.id) return false
              if (targetGroup.grouping === 'status') {
                const status = tasksStatuses.find(
                  (item) => item === targetGroup.value,
                )
                if (status && status !== card.status)
                  changeStatus?.(card.id, status)
              }
              if (targetGroup.grouping === 'priority') {
                const priority = findTasksPriority(targetGroup.value)
                if (priority !== card.priority)
                  changePriority?.(card.id, priority)
              }
              return false
            }
          : undefined,
    }),
    [changePriority, changeStatus, kanbanGroupBy, labels.emptyColumn],
  )

  const selectedRows = useMemo(
    () => tasks.filter((task) => selectedSet.has(task.id)),
    [selectedSet, tasks],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Tasks4Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="tasks-4"
      title={labels.title}
      toolbar={
        <Tasks4Toolbar
          assigneeFilter={assigneeFilter}
          filters={filters}
          groupBy={groupBy}
          groupBys={groupBys}
          kanbanGroupBy={kanbanGroupBy}
          kindFilter={kindFilter}
          kinds={kinds}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          modes={offeredModes}
          onAssigneeFilterChange={
            onAssigneeFilterChange ? setAssigneeFilter : undefined
          }
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          onKindFilterChange={onKindFilterChange ? setKindFilter : undefined}
          onModeChange={setMode}
          onPriorityFilterChange={
            onPriorityFilterChange ? setPriorityFilter : undefined
          }
          onSavePreference={onSavePreference}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          onVisibleColumnsChange={
            onVisibleColumnsChange ? setVisibleColumnList : undefined
          }
          people={people}
          priorityFilter={priorityFilter}
          sort={sort}
          sorts={sorts}
          statusFilter={statusFilter}
          visibleColumns={visibleColumns}
          viewSwitcher={
            <DataCollectionViewSwitcher<typeof tasks4AllView>
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
              view={tasks4AllView}
              viewLabels={{ [tasks4AllView]: labels.title }}
              views={tasks4Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<TasksTask>
          collapseEmptyGroups
          collapsedGroupIds={collapsedGroupIdsProp}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(task) => labels.openTask(task.title)}
          groupBy={activeGroupBy}
          kanban={kanban}
          label={labels.title}
          listHeader={
            <Tasks4ListHeader
              labels={labels}
              visibleColumns={visibleColumns}
              selection={
                selectable && tasks.length > 0
                  ? {
                      checked: tasks.every((task) => selectedSet.has(task.id)),
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
          mode={tasksCollectionMode[mode]}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openTask ? (task) => openTask(task.id) : undefined}
          renderKanbanRecord={renderTasks4KanbanCard(context)}
          renderListRecord={renderTasks4ListRow(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createTasksSelectionActions({
                      kinds,
                      labels,
                      onBulkAssigneesChange,
                      onBulkDelete,
                      onBulkKindChange,
                      onBulkPriorityChange,
                      onBulkStatusChange,
                      onDone: clearSelection,
                      people,
                      selectedRows,
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
      {!loadState && mode === 'list' && selectable ? (
        <div className="pointer-events-none sticky bottom-3 flex justify-center">
          <ActionBar
            actions={createTasksSelectionActions({
              labels,
              onBulkAssigneesChange,
              onBulkDelete,
              onBulkPriorityChange,
              onBulkKindChange,
              onBulkStatusChange,
              onDone: () => setSelectedIds(noIds),
              kinds,
              people,
              selectedRows,
            })}
            className="pointer-events-auto"
            clearSelectionLabel={labels.clearSelection}
            formatSelection={labels.selectedCount}
            label={labels.selectionActions}
            onClearSelection={() => setSelectedIds(noIds)}
            selectedCount={selectedRows.length}
            selectedRows={selectedRows}
          />
        </div>
      ) : null}
    </DataCollectionFrame>
  )
}
