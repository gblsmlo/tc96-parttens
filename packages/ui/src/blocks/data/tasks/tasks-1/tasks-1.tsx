'use client'

import { CubeIcon } from '@phosphor-icons/react'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { CollectionKanbanViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
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
  type TasksGrouping,
  tasksCollectionMode,
} from '../shared/tasks-collection'
import { createTasksColumns } from '../shared/tasks-columns'
import {
  findTasksPriority,
  type TasksFieldContext,
} from '../shared/tasks-fields'
import {
  renderTasksKanbanCard,
  renderTasksListRow,
  TasksListHeader,
} from '../shared/tasks-records'
import { createTasksSelectionActions } from '../shared/tasks-selection-actions'
import { resolveTasks1Labels } from './labels'
import { createTasks1Cells } from './tasks-1-fields'
import { Tasks1Skeleton } from './tasks-1-skeleton'
import { Tasks1Toolbar } from './tasks-1-toolbar'
import type { Tasks1Labels, Tasks1Props } from './types'

const noOptions: NonNullable<Tasks1Props['kinds']> = []
const noPeople: NonNullable<Tasks1Props['people']> = []
const noTags: NonNullable<Tasks1Props['tags']> = []
const noIds: string[] = []
const groupIcon = 'size-4'

function createTasks1Groupings(
  labels: Tasks1Labels,
  kinds: readonly TasksOption[],
): TasksGrouping[] {
  return [
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

export function Tasks1({
  assigneeFilter: assigneeFilterProp,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  error,
  filtered = false,
  filters = tasksFilterIds,
  groupBy: groupByProp,
  groupBys = tasksGroupBys,
  kindFilter: kindFilterProp,
  kinds = noOptions,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  modes = tasksModes,
  now: nowProp,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkAssigneesChange,
  onBulkDelete,
  onBulkKindChange,
  onBulkPriorityChange,
  onBulkStatusChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onGroupByChange,
  onKindChange,
  onKindFilterChange,
  onModeChange,
  onOpen,
  onPageChange,
  onPriorityChange,
  onPriorityFilterChange,
  onRetry,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onTagsChange,
  onVisibleColumnsChange,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  people = noPeople,
  priorityFilter: priorityFilterProp,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  sortDirection: sortDirectionProp,
  sorts = tasksSorts,
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
  total,
  visibleColumns: visibleColumnsProp,
}: Readonly<Tasks1Props>) {
  const labels = useMemo(() => resolveTasks1Labels(labelsProp), [labelsProp])
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [modeState, setMode] = useControllable<TasksMode>(
    modeProp,
    'datatable',
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
    { direction: tasksDefaultSortDirection.updated, sort: 'updated' },
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
  const [groupBy, setGroupBy] = useControllable<TasksGroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useControllable<string[]>(
    collapsedGroupIdsProp,
    noIds,
    onCollapsedGroupIdsChange,
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
  const [kindFilter, setKindFilter] = useControllable<string | null>(
    kindFilterProp,
    null,
    onKindFilterChange,
  )
  const [assigneeFilter, setAssigneeFilter] = useControllable<string | null>(
    assigneeFilterProp,
    null,
    onAssigneeFilterChange,
  )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openTask = useStableHandler(onOpen)
  const changeAssignees = useStableHandler(onAssigneesChange)
  const changeDue = useStableHandler(onDueChange)
  const changeKind = useStableHandler(onKindChange)
  const changePriority = useStableHandler(onPriorityChange)
  const changeStatus = useStableHandler(onStatusChange)
  const changeTags = useStableHandler(onTagsChange)

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkAssigneesChange ||
      onBulkDelete ||
      onBulkKindChange ||
      onBulkPriorityChange ||
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
  const tagById = useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag])),
    [tags],
  )
  const context = useMemo<TasksFieldContext>(
    () => ({
      kinds,
      labels,
      locale,
      now,
      onAssigneesChange: changeAssignees,
      onDueChange: changeDue,
      onKindChange: changeKind,
      onOpen: openTask,
      onPriorityChange: changePriority,
      onSelectedChange: toggleSelected,
      onStatusChange: changeStatus,
      onTagsChange: changeTags,
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
      kinds,
      labels,
      locale,
      now,
      openTask,
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
    () => createTasks1Groupings(labels, kinds),
    [kinds, labels],
  )
  const tableTasks = useMemo(
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
      records: tableTasks,
    }),
    [groupings, tableTasks],
  )

  const columns = useMemo(
    () =>
      createTasksColumns({
        cells: createTasks1Cells(context),
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
    data: tableTasks,
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
    skeleton: <Tasks1Skeleton label={labels.loading} />,
  })

  const hasTasks = total === undefined ? tasks.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={className}
      data-block="tasks-1"
      title={labels.title}
      toolbar={
        <Tasks1Toolbar
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
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          onVisibleColumnsChange={
            onVisibleColumnsChange ? setVisibleColumnList : undefined
          }
          people={people}
          priorityFilter={priorityFilter}
          search={search}
          sort={sort}
          sorts={sorts}
          statusFilter={statusFilter}
          visibleColumns={visibleColumns}
        />
      }
    >
      {loadState ?? (
        <DataCollection<TasksTask>
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          footer={
            pageCount !== undefined && hasTasks ? (
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
          getRowOpenLabel={(task) => labels.openTask(task.title)}
          groupBy={activeGroupBy}
          kanban={kanban}
          label={labels.title}
          listHeader={
            <TasksListHeader
              labels={labels}
              onSort={sortColumn}
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
              sort={sort}
              sortDirection={sortDirection}
              visibleColumns={visibleColumns}
            />
          }
          mode={tasksCollectionMode[mode]}
          onCollapsedGroupIdsChange={(groupIds) =>
            setCollapsedGroupIds([...groupIds])
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openTask ? (task) => openTask(task.id) : undefined}
          renderKanbanRecord={renderTasksKanbanCard(context)}
          renderListRecord={renderTasksListRow(context)}
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
              kinds,
              labels,
              onBulkAssigneesChange,
              onBulkDelete,
              onBulkKindChange,
              onBulkPriorityChange,
              onBulkStatusChange,
              onDone: () => setSelectedIds(noIds),
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
