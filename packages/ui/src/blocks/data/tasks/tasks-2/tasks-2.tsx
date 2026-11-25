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
import { resolveTasks2Labels } from './labels'
import { findTasks2Priority, type Tasks2FieldContext } from './tasks-2-fields'
import {
  tasks2DefaultSortDirection,
  tasks2GroupBys,
  tasks2NoGroup,
  tasks2Statuses,
} from './tasks-2-options'
import {
  renderTasks2KanbanCard,
  renderTasks2ListRow,
  Tasks2ListHeader,
} from './tasks-2-records'
import { createTasks2SelectionActions } from './tasks-2-selection-actions'
import { Tasks2Skeleton } from './tasks-2-skeleton'
import { Tasks2Toolbar } from './tasks-2-toolbar'
import type {
  Tasks2GroupBy,
  Tasks2KanbanGroupBy,
  Tasks2Labels,
  Tasks2Mode,
  Tasks2Option,
  Tasks2Props,
  Tasks2Sort,
  Tasks2SortColumn,
  Tasks2SortDirection,
  Tasks2Status,
  Tasks2Task,
} from './types'

export {
  tasks2GroupBys,
  tasks2Modes,
  tasks2Sorts,
  tasks2Statuses,
} from './tasks-2-options'

type Tasks2Grouping = DataCollectionDefinition<Tasks2Task>['groupings'][number]

const noPeople: NonNullable<Tasks2Props['people']> = []
const noOptions: NonNullable<Tasks2Props['projects']> = []
const noTags: NonNullable<Tasks2Props['tags']> = []
const noCreateOptions: NonNullable<Tasks2Props['createOptions']> = []
const noIds: string[] = []
const noColumns: [] = []
const groupIcon = 'size-4'

function createTasks2Groupings(
  labels: Tasks2Labels,
  projects: readonly Tasks2Option[],
): Tasks2Grouping[] {
  return [
    {
      getGroupId: (task) => task.priority ?? tasks2NoGroup,
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
          id: tasks2NoGroup,
          label: labels.noPriority,
        },
      ],
    },
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: tasks2Statuses.map((status) => ({
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
      getGroupId: (task) => task.projectId ?? tasks2NoGroup,
      id: 'project',
      label: labels.groupings.project,
      options: [
        ...projects.map((project) => ({
          icon: <CubeIcon aria-hidden="true" />,
          id: project.id,
          label: project.label,
        })),
        { id: tasks2NoGroup, label: labels.noProject },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Tasks2GroupBy | null =>
  tasks2GroupBys.find((item) => item === value) ?? null

export function Tasks2({
  assigneeFilter: assigneeFilterProp,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  createOptions = noCreateOptions,
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
  onProjectChange,
  onProjectFilterChange,
  onRetry,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  pending,
  people = noPeople,
  projectFilter: projectFilterProp,
  projects = noOptions,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  sortDirection: sortDirectionProp,
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
}: Readonly<Tasks2Props>) {
  const labels = useMemo(() => resolveTasks2Labels(labelsProp), [labelsProp])
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [mode, setMode] = useControllable<Tasks2Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sortState, setSortState] = useControllable<{
    direction: Tasks2SortDirection
    sort: Tasks2Sort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? tasks2DefaultSortDirection[sortProp],
          sort: sortProp,
        }
      : undefined,
    { direction: tasks2DefaultSortDirection.due, sort: 'due' },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Tasks2Sort) =>
    setSortState({ direction: tasks2DefaultSortDirection[next], sort: next })
  const sortByColumn = (column: Tasks2SortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: tasks2DefaultSortDirection[column], sort: column },
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
  const [groupBy, setGroupBy] = useControllable<Tasks2GroupBy | null>(
    groupByProp,
    'priority',
    onGroupByChange,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useControllable<string[]>(
    collapsedGroupIdsProp,
    noIds,
    onCollapsedGroupIdsChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Tasks2Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [projectFilter, setProjectFilter] = useControllable<string | null>(
    projectFilterProp,
    null,
    onProjectFilterChange,
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
  const context = useMemo<Tasks2FieldContext>(
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

  const kanbanGroupBy: Tasks2KanbanGroupBy =
    groupBy === 'status' ? 'status' : 'priority'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const groupings = useMemo(
    () => createTasks2Groupings(labels, projects),
    [labels, projects],
  )
  const collection = useMemo<DataCollectionDefinition<Tasks2Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tasks,
    }),
    [groupings, tasks],
  )
  const { table } = useDataTable<Tasks2Task>({
    columns: noColumns,
    data: tasks,
    getRowId: (task) => task.id,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Tasks2Task>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove:
        (kanbanGroupBy === 'status' && changeStatus) ||
        (kanbanGroupBy === 'priority' && changePriority)
          ? ({ card, sourceGroup, targetGroup }) => {
              if (sourceGroup.id === targetGroup.id) return false
              if (targetGroup.grouping === 'status') {
                const status = tasks2Statuses.find(
                  (item) => item === targetGroup.value,
                )
                if (status && status !== card.status)
                  changeStatus?.(card.id, status)
              }
              if (targetGroup.grouping === 'priority') {
                const priority = findTasks2Priority(targetGroup.value)
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
    skeleton: <Tasks2Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="tasks-2"
      title={labels.title}
      toolbar={
        <Tasks2Toolbar
          assigneeFilter={assigneeFilter}
          createOptions={createOptions}
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
          onProjectFilterChange={
            onProjectFilterChange ? setProjectFilter : undefined
          }
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          people={people}
          projectFilter={projectFilter}
          projects={projects}
          search={search}
          sort={sort}
          statusFilter={statusFilter}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Tasks2Task>
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          groupBy={activeGroupBy}
          kanban={kanban}
          label={labels.title}
          listHeader={
            <Tasks2ListHeader
              labels={labels}
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
          renderKanbanRecord={renderTasks2KanbanCard(context)}
          renderListRecord={renderTasks2ListRow(context)}
          table={table}
        />
      )}
      {!loadState && mode === 'list' && selectable ? (
        <div className="pointer-events-none sticky bottom-3 flex justify-center">
          <ActionBar
            actions={createTasks2SelectionActions({
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
