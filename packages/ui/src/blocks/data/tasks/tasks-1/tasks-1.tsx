import { cn } from '@tc96/utils'

;('use client')

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { useMemo } from 'react'
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
import { resolveTasks1Labels } from './labels'
import { createTasks1Columns } from './tasks-1-columns'
import type { Tasks1FieldContext } from './tasks-1-fields'
import {
  tasks1GroupBys,
  tasks1HideableColumns,
  tasks1NoGroup,
  tasks1Statuses,
} from './tasks-1-options'
import { createTasks1SelectionActions } from './tasks-1-selection-actions'
import { Tasks1Skeleton } from './tasks-1-skeleton'
import { Tasks1Toolbar } from './tasks-1-toolbar'
import type {
  Tasks1GroupBy,
  Tasks1HideableColumnId,
  Tasks1Labels,
  Tasks1Priority,
  Tasks1Props,
  Tasks1Sort,
  Tasks1Status,
  Tasks1Task,
} from './types'

export {
  tasks1GroupBys,
  tasks1HideableColumns,
  tasks1Sorts,
  tasks1Statuses,
} from './tasks-1-options'

type Tasks1Grouping = DataCollectionDefinition<Tasks1Task>['groupings'][number]

const noOptions: NonNullable<Tasks1Props['projects']> = []
const noPeople: NonNullable<Tasks1Props['assignees']> = []
const noIds: string[] = []
const noColumns: Tasks1HideableColumnId[] = []

function createTasks1Groupings(labels: Tasks1Labels): Tasks1Grouping[] {
  return [
    {
      getGroupId: (task) => task.status,
      id: 'status',
      label: labels.groupings.status,
      options: tasks1Statuses.map((status) => ({
        id: status,
        label: labels.statuses[status],
      })),
    },
    {
      getGroupId: (task) => task.priority ?? tasks1NoGroup,
      id: 'priority',
      label: labels.groupings.priority,
      options: [
        ...dataPriorities.map((priority) => ({
          id: priority,
          label: labels.priorities[priority],
        })),
        { id: tasks1NoGroup, label: labels.noPriority },
      ],
    },
  ]
}

function orderByGrouping(
  tasks: Tasks1Task[],
  grouping: Tasks1Grouping | undefined,
): Tasks1Task[] {
  if (!grouping) return tasks
  const rank = new Map(
    grouping.options.map((option, index) => [option.id, index]),
  )
  const rankOf = (task: Tasks1Task) =>
    rank.get(grouping.getGroupId(task) ?? '') ?? grouping.options.length
  return [...tasks].sort((a, b) => rankOf(a) - rankOf(b))
}

const pickGroupBy = (value: string | null): Tasks1GroupBy | null =>
  tasks1GroupBys.find((item) => item === value) ?? null

export function Tasks1({
  assigneeFilter: assigneeFilterProp,
  assignees = noPeople,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  error,
  filtered = false,
  groupBy: groupByProp,
  hiddenColumns: hiddenColumnsProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  onAssigneeFilterChange,
  onAssigneesChange,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkProjectChange,
  onBulkStatusChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onGroupByChange,
  onHiddenColumnsChange,
  onOpen,
  onPageChange,
  onPriorityChange,
  onPriorityFilterChange,
  onProjectChange,
  onProjectFilterChange,
  onRetry,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onTagsChange,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  priorityFilter: priorityFilterProp,
  projectFilter: projectFilterProp,
  projects = noOptions,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  statusFilter: statusFilterProp,
  tags = noOptions,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
  total,
}: Readonly<Tasks1Props>) {
  const labels = useMemo(() => resolveTasks1Labels(labelsProp), [labelsProp])
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Tasks1Sort>(
    sortProp,
    'updated',
    onSortChange,
  )
  const [groupBy, setGroupBy] = useControllable<Tasks1GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useControllable<string[]>(
    collapsedGroupIdsProp,
    noIds,
    onCollapsedGroupIdsChange,
  )
  const [hiddenColumns, setHiddenColumns] = useControllable<
    Tasks1HideableColumnId[]
  >(hiddenColumnsProp, noColumns, onHiddenColumnsChange)
  const [statusFilter, setStatusFilter] = useControllable<Tasks1Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [priorityFilter, setPriorityFilter] =
    useControllable<Tasks1Priority | null>(
      priorityFilterProp,
      null,
      onPriorityFilterChange,
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
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openTask = useStableHandler(onOpen)
  const changeAssignees = useStableHandler(onAssigneesChange)
  const changeDue = useStableHandler(onDueChange)
  const changePriority = useStableHandler(onPriorityChange)
  const changeProject = useStableHandler(onProjectChange)
  const changeStatus = useStableHandler(onStatusChange)
  const changeTags = useStableHandler(onTagsChange)

  const context = useMemo<Tasks1FieldContext>(
    () => ({
      assignees,
      labels,
      locale,
      onAssigneesChange: changeAssignees,
      onDueChange: changeDue,
      onPriorityChange: changePriority,
      onProjectChange: changeProject,
      onStatusChange: changeStatus,
      onTagsChange: changeTags,
      projects,
      tags,
      timeZone,
    }),
    [
      assignees,
      changeAssignees,
      changeDue,
      changePriority,
      changeProject,
      changeStatus,
      changeTags,
      labels,
      locale,
      projects,
      tags,
      timeZone,
    ],
  )

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkDelete ||
      onBulkPriorityChange ||
      onBulkProjectChange ||
      onBulkStatusChange,
  )

  const groupings = useMemo(() => createTasks1Groupings(labels), [labels])
  const tableTasks = useMemo(
    () =>
      orderByGrouping(
        tasks,
        groupings.find(({ id }) => id === groupBy),
      ),
    [groupBy, groupings, tasks],
  )
  const collection = useMemo<DataCollectionDefinition<Tasks1Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tableTasks,
    }),
    [groupings, tableTasks],
  )

  const columns = useMemo(
    () => createTasks1Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const columnVisibility = useMemo(
    () => Object.fromEntries(hiddenColumns.map((id) => [id, false])),
    [hiddenColumns],
  )
  const { table } = useDataTable<Tasks1Task>({
    columnVisibility,
    columns,
    data: tableTasks,
    enableRowSelection: selectable,
    getRowId: (task) => task.id,
    onColumnVisibilityChange: (visibility) =>
      setHiddenColumns(
        tasks1HideableColumns.filter((id) => visibility[id] === false),
      ),
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

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
      className={cn('flex h-full min-h-0 flex-col', className)}
      data-block="tasks-1"
      title={labels.title}
      toolbar={
        <Tasks1Toolbar
          assigneeFilter={assigneeFilter}
          assignees={assignees}
          groupBy={groupBy}
          labels={labels}
          loading={Boolean(loadState)}
          onAssigneeFilterChange={
            onAssigneeFilterChange ? setAssigneeFilter : undefined
          }
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          onPriorityFilterChange={
            onPriorityFilterChange ? setPriorityFilter : undefined
          }
          onProjectFilterChange={
            onProjectFilterChange ? setProjectFilter : undefined
          }
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          priorityFilter={priorityFilter}
          projectFilter={projectFilter}
          projects={projects}
          search={search}
          sort={sort}
          statusFilter={statusFilter}
          table={table}
        />
      }
    >
      <div className="min-h-0 flex-1 overflow-auto" data-slot="tasks-1-body">
        {loadState ?? (
          <DataCollection<Tasks1Task>
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
            groupBy={groupBy}
            label={labels.title}
            mode="table"
            onCollapsedGroupIdsChange={(groupIds) =>
              setCollapsedGroupIds([...groupIds])
            }
            onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
            onOpen={openTask ? (task) => openTask(task.id) : undefined}
            selectionActions={
              selectable
                ? ({ clearSelection, selectedCount, selectedRows }) => (
                    <ActionBar
                      actions={createTasks1SelectionActions({
                        labels,
                        onBulkDelete,
                        onBulkPriorityChange,
                        onBulkProjectChange,
                        onBulkStatusChange,
                        onDone: clearSelection,
                        projects,
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
      </div>
    </DataCollectionFrame>
  )
}
