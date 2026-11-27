'use client'

import { ScalesIcon } from '@phosphor-icons/react'
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
  createTasks6StatusOptions,
  isTasks6FieldId,
  tasks6ColumnFields,
  tasks6DefaultCompleteStatus,
  tasks6DefaultSortDirection,
  tasks6Fields,
  tasks6GroupBys,
  tasks6KanbanFields,
  tasks6KanbanGroupBys,
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
  Tasks6ChangeResult,
  Tasks6FieldId,
  Tasks6GroupBy,
  Tasks6KanbanGroupBy,
  Tasks6Labels,
  Tasks6Mode,
  Tasks6Option,
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
  tasks6GroupBys,
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
const noTypes: NonNullable<Tasks6Props['types']> = []
const noIds: string[] = []
const noColumns: [] = []
const groupIcon = 'size-4'

function createTasks6Groupings(
  labels: Tasks6Labels,
  projects: readonly Tasks6Option[],
  statuses: readonly Tasks6StatusOption[],
): Tasks6Grouping[] {
  return [
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
      getGroupId: (task) => task.projectId ?? tasks6NoGroup,
      id: 'project',
      label: labels.groupings.project,
      options: [
        ...projects.map((project) => ({
          icon: <ScalesIcon aria-hidden="true" />,
          id: project.id,
          label: project.label,
        })),
        { id: tasks6NoGroup, label: labels.noProject },
      ],
    },
  ]
}

const pickGroupBy = (value: string | null): Tasks6GroupBy | null =>
  tasks6GroupBys.find((item) => item === value) ?? null

const acceptedMove = (result: Tasks6ChangeResult) =>
  typeof result === 'boolean' || result instanceof Promise ? result : false

export function Tasks6({
  actionBar,
  activeFilterCount,
  assigneeFilter: assigneeFilterProp,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  completeStatus = tasks6DefaultCompleteStatus,
  error,
  fields = tasks6Fields,
  filtered = false,
  filters,
  footer,
  groupBy: groupByProp,
  groupBys = tasks6GroupBys,
  kanbanFields = tasks6KanbanFields,
  kanbanGroupBys = tasks6KanbanGroupBys,
  kanbanMoveGroupBys = tasks6KanbanGroupBys,
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
  onStartChange,
  onStatusChange,
  onStatusFilterChange,
  onTypeChange,
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
  types = noTypes,
}: Readonly<Tasks6Props>) {
  const labels = useMemo(() => resolveTasks6Labels(labelsProp), [labelsProp])
  const statuses = useMemo(
    () => statusesProp ?? createTasks6StatusOptions(labels),
    [labels, statusesProp],
  )
  const statusById = useMemo(
    () => new Map(statuses.map((status) => [status.id, status])),
    [statuses],
  )
  const sortOptions = useMemo<readonly Tasks6SortOption[]>(
    () =>
      sortOptionsProp ??
      tasks6Sorts.map((sort) => ({ id: sort, label: labels.sorts[sort] })),
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
  const [shownFields, setShownFields] = useState(fields)
  const [shownKanbanFields, setShownKanbanFields] = useState(kanbanFields)
  const showField = (id: string, visible: boolean) => {
    if (!isTasks6FieldId(id)) return
    const toggle = (current: readonly Tasks6FieldId[]) => {
      const next = new Set(
        visible ? [...current, id] : current.filter((field) => field !== id),
      )
      return tasks6ColumnFields.filter((field) => next.has(field))
    }
    if (mode === 'kanban') setShownKanbanFields(toggle)
    else setShownFields(toggle)
  }
  const directionOf = (sort: Tasks6Sort): Tasks6SortDirection => {
    const known = tasks6Sorts.find((item) => item === sort)
    return known ? tasks6DefaultSortDirection[known] : 'desc'
  }
  const [sortState, setSortState] = useControllable<{
    direction: Tasks6SortDirection
    sort: Tasks6Sort
  }>(
    sortProp
      ? {
          direction: sortDirectionProp ?? directionOf(sortProp),
          sort: sortProp,
        }
      : undefined,
    {
      direction: sortOptions[0] ? directionOf(sortOptions[0].id) : 'asc',
      sort: sortOptions[0]?.id ?? 'due',
    },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Tasks6Sort) =>
    setSortState({ direction: directionOf(next), sort: next })
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
  const [groupBy, setGroupBy] = useControllable<Tasks6GroupBy | null>(
    groupByProp,
    'priority',
    onGroupByChange,
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
  const changeStart = useStableHandler(onStartChange)
  const changeStatus = useStableHandler(onStatusChange)
  const changeType = useStableHandler(onTypeChange)

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
      onPriorityChange: changePriority,
      onProjectChange: changeProject,
      onSelectedChange: toggleSelected,
      onStartChange: changeStart,
      onStatusChange: changeStatus,
      onTypeChange: changeType,
      people,
      projects,
      selectedIds: selectedSet,
      statusById,
      statuses,
      tagById,
      timeZone,
      types,
    }),
    [
      changeAssignees,
      changeDue,
      changePriority,
      changeProject,
      changeStart,
      changeStatus,
      changeType,
      labels,
      locale,
      now,
      openTask,
      people,
      projects,
      selectedSet,
      statusById,
      statuses,
      tagById,
      timeZone,
      toggleSelected,
      types,
    ],
  )

  const kanbanGroupBy: Tasks6KanbanGroupBy =
    kanbanGroupBys.find((item) => item === groupBy) ??
    kanbanGroupBys[0] ??
    'priority'
  const listGroupBy = groupBy && groupBys.includes(groupBy) ? groupBy : null
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : listGroupBy

  const groupings = useMemo(
    () => createTasks6Groupings(labels, projects, statuses),
    [labels, projects, statuses],
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

  const movable =
    kanbanMoveGroupBys.includes(kanbanGroupBy) &&
    ((kanbanGroupBy === 'status' && onStatusChange) ||
      (kanbanGroupBy === 'priority' && onPriorityChange))
  const kanban = useMemo<CollectionKanbanViewProps<Tasks6Task>>(
    () => ({
      emptyGroupLabel: labels.emptyColumn,
      onRecordMove: movable
        ? ({ card, sourceGroup, targetGroup }) => {
            if (card.readOnly || sourceGroup.id === targetGroup.id) return false
            if (targetGroup.grouping === 'status') {
              const status = statusById.get(targetGroup.value ?? '')
              if (status && status.id !== card.status)
                return acceptedMove(onStatusChange?.(card.id, status.id))
            }
            if (targetGroup.grouping === 'priority') {
              const priority = findTasks6Priority(targetGroup.value)
              if (priority !== card.priority)
                return acceptedMove(onPriorityChange?.(card.id, priority))
            }
            return false
          }
        : undefined,
    }),
    [labels.emptyColumn, movable, onPriorityChange, onStatusChange, statusById],
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
      className={cn('flex h-full min-h-0 flex-col', className)}
      data-block="tasks-6"
      title={labels.title}
      toolbar={
        <Tasks6Toolbar
          activeFilterCount={activeFilterCount}
          assigneeFilter={assigneeFilter}
          filters={filters}
          groupBy={groupBy}
          groupBys={groupBys}
          kanbanGroupBy={kanbanGroupBy}
          kanbanGroupBys={kanbanGroupBys}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          onAssigneeFilterChange={
            onAssigneeFilterChange ? setAssigneeFilter : undefined
          }
          onClearFilters={onClearFilters}
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          fields={mode === 'kanban' ? shownKanbanFields : shownFields}
          onFieldVisibleChange={showField}
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
          'min-h-0 flex-1 overflow-auto transition-opacity',
          pending && 'pointer-events-none opacity-60',
        )}
        data-slot="tasks-6-body"
      >
        {loadState ?? (
          <DataCollection<Tasks6Task>
            collapseEmptyGroups
            collapsedGroupIds={collapsedGroupIdsProp}
            collection={collection}
            emptyMessage={filtered ? labels.noResult : labels.empty}
            getGroupToggleLabel={labels.groupToggle}
            groupBy={activeGroupBy}
            kanban={kanban}
            label={labels.title}
            listHeader={
              <Tasks6ListHeader
                fields={shownFields}
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
                onSort={
                  onSortChange && !sortOptionsProp ? sortByColumn : undefined
                }
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
            renderKanbanRecord={renderTasks6KanbanCard(
              context,
              shownKanbanFields,
            )}
            renderListRecord={renderTasks6ListRow(context, shownFields)}
            table={table}
          />
        )}
        {mode === 'list' && selectable ? (
          <div className="pointer-events-none sticky bottom-3 flex justify-center *:pointer-events-auto">
            {actionBar ?? (
              <ActionBar
                actions={createTasks6SelectionActions({
                  completeStatus,
                  disabled: Boolean(pending),
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
