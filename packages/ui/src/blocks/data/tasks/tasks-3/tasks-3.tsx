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
import {
  defaultDataCollectionLocale,
  defaultDataCollectionTimeZone,
} from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { dataPriorities } from '../../shared/properties/data-priority'
import { resolveTasks3Labels } from './labels'
import { findTasks3Priority, type Tasks3FieldContext } from './tasks-3-fields'
import {
  tasks3DefaultSortDirection,
  tasks3GroupBys,
  tasks3NoGroup,
  tasks3Statuses,
} from './tasks-3-options'
import {
  renderTasks3KanbanCard,
  renderTasks3ListRow,
  Tasks3ListHeader,
} from './tasks-3-records'
import { createTasks3SelectionActions } from './tasks-3-selection-actions'
import { Tasks3Skeleton } from './tasks-3-skeleton'
import { Tasks3Toolbar } from './tasks-3-toolbar'
import type {
  Tasks3GroupBy,
  Tasks3KanbanGroupBy,
  Tasks3Labels,
  Tasks3Mode,
  Tasks3Option,
  Tasks3PriorityFilter,
  Tasks3Props,
  Tasks3Sort,
  Tasks3SortColumn,
  Tasks3SortDirection,
  Tasks3Status,
  Tasks3Task,
} from './types'

export {
  tasks3GroupBys,
  tasks3Modes,
  tasks3PriorityFilters,
  tasks3Sorts,
  tasks3Statuses,
} from './tasks-3-options'

type Tasks3Grouping = DataCollectionDefinition<Tasks3Task>['groupings'][number]

const noPeople: NonNullable<Tasks3Props['people']> = []
const noOptions: NonNullable<Tasks3Props['projects']> = []
const noTags: NonNullable<Tasks3Props['tags']> = []
const noIds: string[] = []
const noColumns: [] = []
const groupIcon = 'size-4'

function createTasks3Groupings(
  labels: Tasks3Labels,
  projects: readonly Tasks3Option[],
): Tasks3Grouping[] {
  return [
    {
      getGroupId: (task) => task.priority ?? tasks3NoGroup,
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
          id: tasks3NoGroup,
          label: labels.noPriority,
        },
      ],
    },
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: tasks3Statuses.map((status) => ({
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
      getGroupId: (task) => task.projectId ?? tasks3NoGroup,
      id: 'project',
      label: labels.groupings.project,
      options: [
        ...projects.map((project) => ({
          icon: <CubeIcon aria-hidden="true" />,
          id: project.id,
          label: project.label,
        })),
        { id: tasks3NoGroup, label: labels.noProject },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Tasks3GroupBy | null =>
  tasks3GroupBys.find((item) => item === value) ?? null

export function Tasks3({
  assigneeFilter: assigneeFilterProp,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  error,
  filtered = false,
  groupBy: groupByProp,
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
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPriorityChange,
  onPriorityFilterChange,
  onProjectChange,
  onRetry,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  pending,
  people = noPeople,
  priorityFilter: priorityFilterProp,
  projects = noOptions,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  sortDirection: sortDirectionProp,
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
}: Readonly<Tasks3Props>) {
  const labels = useMemo(() => resolveTasks3Labels(labelsProp), [labelsProp])
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [mode, setMode] = useControllable<Tasks3Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sortState, setSortState] = useControllable<{
    direction: Tasks3SortDirection
    sort: Tasks3Sort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? tasks3DefaultSortDirection[sortProp],
          sort: sortProp,
        }
      : undefined,
    { direction: tasks3DefaultSortDirection.due, sort: 'due' },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Tasks3Sort) =>
    setSortState({ direction: tasks3DefaultSortDirection[next], sort: next })
  const sortByColumn = (column: Tasks3SortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: tasks3DefaultSortDirection[column], sort: column },
    )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const selectable = Boolean(
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
  const [groupBy, setGroupBy] = useControllable<Tasks3GroupBy | null>(
    groupByProp,
    'priority',
    onGroupByChange,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useControllable<string[]>(
    collapsedGroupIdsProp,
    noIds,
    onCollapsedGroupIdsChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Tasks3Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [priorityFilter, setPriorityFilter] =
    useControllable<Tasks3PriorityFilter | null>(
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
  const changeStatus = useStableHandler(onStatusChange)

  const tagById = useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag])),
    [tags],
  )
  const context = useMemo<Tasks3FieldContext>(
    () => ({
      labels,
      locale,
      now,
      onAssigneesChange: changeAssignees,
      onDueChange: changeDue,
      onOpen: openTask,
      onProjectChange: changeProject,
      onSelectedChange: toggleSelected,
      people,
      projects,
      selectedIds: selectedSet,
      tagById,
      timeZone,
    }),
    [
      changeAssignees,
      changeDue,
      changeProject,
      labels,
      locale,
      now,
      openTask,
      people,
      projects,
      selectedSet,
      tagById,
      timeZone,
      toggleSelected,
    ],
  )

  const kanbanGroupBy: Tasks3KanbanGroupBy =
    groupBy === 'status' ? 'status' : 'priority'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const groupings = useMemo(
    () => createTasks3Groupings(labels, projects),
    [labels, projects],
  )
  const collection = useMemo<DataCollectionDefinition<Tasks3Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tasks,
    }),
    [groupings, tasks],
  )
  const { table } = useDataTable<Tasks3Task>({
    columns: noColumns,
    data: tasks,
    getRowId: (task) => task.id,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Tasks3Task>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove:
        (kanbanGroupBy === 'status' && changeStatus) ||
        (kanbanGroupBy === 'priority' && changePriority)
          ? ({ card, sourceGroup, targetGroup }) => {
              if (sourceGroup.id === targetGroup.id) return false
              if (targetGroup.grouping === 'status') {
                const status = tasks3Statuses.find(
                  (item) => item === targetGroup.value,
                )
                if (status && status !== card.status)
                  changeStatus?.(card.id, status)
              }
              if (targetGroup.grouping === 'priority') {
                const priority = findTasks3Priority(targetGroup.value)
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
    skeleton: <Tasks3Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="tasks-3"
      title={labels.title}
      toolbar={
        <Tasks3Toolbar
          assigneeFilter={assigneeFilter}
          groupBy={groupBy}
          kanbanGroupBy={kanbanGroupBy}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          onAssigneeFilterChange={
            onAssigneeFilterChange ? setAssigneeFilter : undefined
          }
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          onModeChange={setMode}
          onPriorityFilterChange={
            onPriorityFilterChange ? setPriorityFilter : undefined
          }
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          people={people}
          priorityFilter={priorityFilter}
          search={search}
          sort={sort}
          statusFilter={statusFilter}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Tasks3Task>
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          groupBy={activeGroupBy}
          kanban={kanban}
          label={labels.title}
          listHeader={
            <Tasks3ListHeader
              labels={labels}
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
          mode={mode}
          onCollapsedGroupIdsChange={(groupIds) =>
            setCollapsedGroupIds([...groupIds])
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openTask ? (task) => openTask(task.id) : undefined}
          renderKanbanRecord={renderTasks3KanbanCard(context)}
          renderListRecord={renderTasks3ListRow(context)}
          table={table}
        />
      )}
      {!loadState && mode === 'list' && selectable ? (
        <div className="pointer-events-none sticky bottom-3 flex justify-center">
          <ActionBar
            actions={createTasks3SelectionActions({
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
