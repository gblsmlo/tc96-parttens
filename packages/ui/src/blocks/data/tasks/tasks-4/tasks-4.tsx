import { cn } from '@tc96/utils'

;('use client')

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
import { resolveTasks4Labels } from './labels'
import { findTasks4Priority, type Tasks4FieldContext } from './tasks-4-fields'
import {
  tasks4DefaultSortDirection,
  tasks4GroupBys,
  tasks4NoGroup,
  tasks4Statuses,
} from './tasks-4-options'
import {
  renderTasks4KanbanCard,
  renderTasks4ListRow,
  Tasks4ListHeader,
} from './tasks-4-records'
import { createTasks4SelectionActions } from './tasks-4-selection-actions'
import { Tasks4Skeleton } from './tasks-4-skeleton'
import { Tasks4Toolbar } from './tasks-4-toolbar'
import type {
  Tasks4GroupBy,
  Tasks4KanbanGroupBy,
  Tasks4Labels,
  Tasks4Mode,
  Tasks4Option,
  Tasks4PriorityFilter,
  Tasks4Props,
  Tasks4Sort,
  Tasks4SortColumn,
  Tasks4SortDirection,
  Tasks4Status,
  Tasks4Task,
} from './types'

export {
  tasks4GroupBys,
  tasks4Modes,
  tasks4PriorityFilters,
  tasks4Sorts,
  tasks4Statuses,
} from './tasks-4-options'

type Tasks4Grouping = DataCollectionDefinition<Tasks4Task>['groupings'][number]

const tasks4AllView = 'all'
const tasks4Views = [tasks4AllView] as const

const noPeople: NonNullable<Tasks4Props['people']> = []
const noOptions: NonNullable<Tasks4Props['projects']> = []
const noTags: NonNullable<Tasks4Props['tags']> = []
const noIds: string[] = []
const noColumns: [] = []
const groupIcon = 'size-4'

function createTasks4Groupings(
  labels: Tasks4Labels,
  projects: readonly Tasks4Option[],
): Tasks4Grouping[] {
  return [
    {
      getGroupId: (task) => task.priority ?? tasks4NoGroup,
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
          id: tasks4NoGroup,
          label: labels.noPriority,
        },
      ],
    },
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: tasks4Statuses.map((status) => ({
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
      getGroupId: (task) => task.projectId ?? tasks4NoGroup,
      id: 'project',
      label: labels.groupings.project,
      options: [
        ...projects.map((project) => ({
          icon: <CubeIcon aria-hidden="true" />,
          id: project.id,
          label: project.label,
        })),
        { id: tasks4NoGroup, label: labels.noProject },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Tasks4GroupBy | null =>
  tasks4GroupBys.find((item) => item === value) ?? null

export function Tasks4({
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
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
}: Readonly<Tasks4Props>) {
  const labels = useMemo(() => resolveTasks4Labels(labelsProp), [labelsProp])
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [mode, setMode] = useControllable<Tasks4Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sortState, setSortState] = useControllable<{
    direction: Tasks4SortDirection
    sort: Tasks4Sort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? tasks4DefaultSortDirection[sortProp],
          sort: sortProp,
        }
      : undefined,
    { direction: tasks4DefaultSortDirection.due, sort: 'due' },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Tasks4Sort) =>
    setSortState({ direction: tasks4DefaultSortDirection[next], sort: next })
  const sortByColumn = (column: Tasks4SortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: tasks4DefaultSortDirection[column], sort: column },
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
  const [groupBy, setGroupBy] = useControllable<Tasks4GroupBy | null>(
    groupByProp,
    'priority',
    onGroupByChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Tasks4Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [priorityFilter, setPriorityFilter] =
    useControllable<Tasks4PriorityFilter | null>(
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
  const context = useMemo<Tasks4FieldContext>(
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

  const kanbanGroupBy: Tasks4KanbanGroupBy =
    groupBy === 'status' ? 'status' : 'priority'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const groupings = useMemo(
    () => createTasks4Groupings(labels, projects),
    [labels, projects],
  )
  const collection = useMemo<DataCollectionDefinition<Tasks4Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tasks,
    }),
    [groupings, tasks],
  )
  const { table } = useDataTable<Tasks4Task>({
    columns: noColumns,
    data: tasks,
    getRowId: (task) => task.id,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Tasks4Task>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove:
        (kanbanGroupBy === 'status' && changeStatus) ||
        (kanbanGroupBy === 'priority' && changePriority)
          ? ({ card, sourceGroup, targetGroup }) => {
              if (sourceGroup.id === targetGroup.id) return false
              if (targetGroup.grouping === 'status') {
                const status = tasks4Statuses.find(
                  (item) => item === targetGroup.value,
                )
                if (status && status !== card.status)
                  changeStatus?.(card.id, status)
              }
              if (targetGroup.grouping === 'priority') {
                const priority = findTasks4Priority(targetGroup.value)
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
      className={cn('flex h-full min-h-0 flex-col', className)}
      data-block="tasks-4"
      title={labels.title}
      toolbar={
        <Tasks4Toolbar
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
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          people={people}
          priorityFilter={priorityFilter}
          sort={sort}
          statusFilter={statusFilter}
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
      <div className="min-h-0 flex-1 overflow-auto" data-slot="tasks-4-body">
        {loadState ?? (
          <DataCollection<Tasks4Task>
            collapseEmptyGroups
            collapsedGroupIds={collapsedGroupIdsProp}
            collection={collection}
            emptyMessage={filtered ? labels.noResult : labels.empty}
            getGroupToggleLabel={labels.groupToggle}
            groupBy={activeGroupBy}
            kanban={kanban}
            label={labels.title}
            listHeader={
              <Tasks4ListHeader
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
            onCollapsedGroupIdsChange={
              onCollapsedGroupIdsChange
                ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
                : undefined
            }
            onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
            onOpen={openTask ? (task) => openTask(task.id) : undefined}
            renderKanbanRecord={renderTasks4KanbanCard(context)}
            renderListRecord={renderTasks4ListRow(context)}
            table={table}
          />
        )}
        {!loadState && mode === 'list' && selectable ? (
          <div className="pointer-events-none sticky bottom-3 flex justify-center">
            <ActionBar
              actions={createTasks4SelectionActions({
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
      </div>
    </DataCollectionFrame>
  )
}
