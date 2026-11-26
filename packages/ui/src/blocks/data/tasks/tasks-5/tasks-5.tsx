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
import { resolveTasks5Labels } from './labels'
import { findTasks5Priority, type Tasks5FieldContext } from './tasks-5-fields'
import {
  tasks5DefaultSortDirection,
  tasks5GroupBys,
  tasks5NoGroup,
  tasks5Statuses,
} from './tasks-5-options'
import {
  renderTasks5KanbanCard,
  renderTasks5ListRow,
  Tasks5ListHeader,
} from './tasks-5-records'
import { createTasks5SelectionActions } from './tasks-5-selection-actions'
import { Tasks5Skeleton } from './tasks-5-skeleton'
import { Tasks5Toolbar } from './tasks-5-toolbar'
import type {
  Tasks5GroupBy,
  Tasks5KanbanGroupBy,
  Tasks5Labels,
  Tasks5Mode,
  Tasks5Option,
  Tasks5PriorityFilter,
  Tasks5Props,
  Tasks5Sort,
  Tasks5SortColumn,
  Tasks5SortDirection,
  Tasks5Status,
  Tasks5Task,
} from './types'

export {
  tasks5GroupBys,
  tasks5Modes,
  tasks5PriorityFilters,
  tasks5Sorts,
  tasks5Statuses,
} from './tasks-5-options'

type Tasks5Grouping = DataCollectionDefinition<Tasks5Task>['groupings'][number]

const tasks5AllView = 'all'
const tasks5Views = [tasks5AllView] as const

const noPeople: NonNullable<Tasks5Props['people']> = []
const noOptions: NonNullable<Tasks5Props['projects']> = []
const noTags: NonNullable<Tasks5Props['tags']> = []
const noIds: string[] = []
const noColumns: [] = []
const groupIcon = 'size-4'

function createTasks5Groupings(
  labels: Tasks5Labels,
  projects: readonly Tasks5Option[],
): Tasks5Grouping[] {
  return [
    {
      getGroupId: (task) => task.priority ?? tasks5NoGroup,
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
          id: tasks5NoGroup,
          label: labels.noPriority,
        },
      ],
    },
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: tasks5Statuses.map((status) => ({
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
      getGroupId: (task) => task.projectId ?? tasks5NoGroup,
      id: 'project',
      label: labels.groupings.project,
      options: [
        ...projects.map((project) => ({
          icon: <CubeIcon aria-hidden="true" />,
          id: project.id,
          label: project.label,
        })),
        { id: tasks5NoGroup, label: labels.noProject },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Tasks5GroupBy | null =>
  tasks5GroupBys.find((item) => item === value) ?? null

export function Tasks5({
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
  statusFilter: statusFilterProp,
  tags = noTags,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
}: Readonly<Tasks5Props>) {
  const labels = useMemo(() => resolveTasks5Labels(labelsProp), [labelsProp])
  const [mountedAt] = useState(() => new Date())
  const now = useMemo(
    () => (nowProp ? new Date(nowProp) : mountedAt),
    [mountedAt, nowProp],
  )
  const [mode, setMode] = useControllable<Tasks5Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sortState, setSortState] = useControllable<{
    direction: Tasks5SortDirection
    sort: Tasks5Sort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? tasks5DefaultSortDirection[sortProp],
          sort: sortProp,
        }
      : undefined,
    { direction: tasks5DefaultSortDirection.due, sort: 'due' },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Tasks5Sort) =>
    setSortState({ direction: tasks5DefaultSortDirection[next], sort: next })
  const sortByColumn = (column: Tasks5SortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: tasks5DefaultSortDirection[column], sort: column },
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
  const [groupBy, setGroupBy] = useControllable<Tasks5GroupBy | null>(
    groupByProp,
    'priority',
    onGroupByChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Tasks5Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [priorityFilter, setPriorityFilter] =
    useControllable<Tasks5PriorityFilter | null>(
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
  const context = useMemo<Tasks5FieldContext>(
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
      tagById,
      timeZone,
      toggleSelected,
    ],
  )

  const kanbanGroupBy: Tasks5KanbanGroupBy =
    groupBy === 'status' ? 'status' : 'priority'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const groupings = useMemo(
    () => createTasks5Groupings(labels, projects),
    [labels, projects],
  )
  const collection = useMemo<DataCollectionDefinition<Tasks5Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tasks,
    }),
    [groupings, tasks],
  )
  const { table } = useDataTable<Tasks5Task>({
    columns: noColumns,
    data: tasks,
    getRowId: (task) => task.id,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Tasks5Task>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove:
        (kanbanGroupBy === 'status' && changeStatus) ||
        (kanbanGroupBy === 'priority' && changePriority)
          ? ({ card, sourceGroup, targetGroup }) => {
              if (sourceGroup.id === targetGroup.id) return false
              if (targetGroup.grouping === 'status') {
                const status = tasks5Statuses.find(
                  (item) => item === targetGroup.value,
                )
                if (status && status !== card.status)
                  changeStatus?.(card.id, status)
              }
              if (targetGroup.grouping === 'priority') {
                const priority = findTasks5Priority(targetGroup.value)
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
    skeleton: <Tasks5Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="tasks-5"
      title={labels.title}
      toolbar={
        <Tasks5Toolbar
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
            <DataCollectionViewSwitcher<typeof tasks5AllView>
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
              view={tasks5AllView}
              viewLabels={{ [tasks5AllView]: labels.title }}
              views={tasks5Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<Tasks5Task>
          collapseEmptyGroups
          collapsedGroupIds={collapsedGroupIdsProp}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          groupBy={activeGroupBy}
          kanban={kanban}
          label={labels.title}
          listHeader={
            <Tasks5ListHeader
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
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openTask ? (task) => openTask(task.id) : undefined}
          renderKanbanRecord={renderTasks5KanbanCard(context)}
          renderListRecord={renderTasks5ListRow(context)}
          table={table}
        />
      )}
      {!loadState && mode === 'list' && selectable ? (
        <div className="pointer-events-none sticky bottom-3 flex justify-center">
          <ActionBar
            actions={createTasks5SelectionActions({
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
