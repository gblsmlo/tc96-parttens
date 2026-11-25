'use client'

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
import { dataPriorities } from '../../shared/properties/data-priority'
import { resolveProjects3Labels } from './labels'
import { createProjects3Columns } from './projects-3-columns'
import type { Projects3FieldContext } from './projects-3-fields'
import {
  projects3GroupBys,
  projects3NoGroup,
  projects3Statuses,
} from './projects-3-options'
import { renderProjects3KanbanCard } from './projects-3-records'
import { createProjects3SelectionActions } from './projects-3-selection-actions'
import { Projects3Skeleton } from './projects-3-skeleton'
import { Projects3Toolbar } from './projects-3-toolbar'
import type {
  Projects3Archived,
  Projects3Expanded,
  Projects3GroupBy,
  Projects3KanbanGroupBy,
  Projects3Labels,
  Projects3Mode,
  Projects3Person,
  Projects3Props,
  Projects3Sort,
  Projects3Status,
  Projects3Task,
} from './types'

export {
  projects3GroupBys,
  projects3Modes,
  projects3Sorts,
  projects3Statuses,
} from './projects-3-options'

type Projects3Grouping =
  DataCollectionDefinition<Projects3Task>['groupings'][number]

const noAssignees: NonNullable<Projects3Props['assignees']> = []
const noOptions: NonNullable<Projects3Props['tags']> = []
const noIds: string[] = []
const noExpanded: Projects3Expanded = {}
const allTasksView = ['all'] as const

const subtaskIdsOf = (tasks: readonly Projects3Task[]) => {
  const ids = new Set<string>()
  const visit = (list: readonly Projects3Task[]) => {
    for (const task of list) {
      ids.add(task.id)
      if (task.subtasks) visit(task.subtasks)
    }
  }
  for (const task of tasks) if (task.subtasks) visit(task.subtasks)
  return ids
}

function createProjects3Groupings(
  labels: Projects3Labels,
  assignees: readonly Projects3Person[],
  subtaskIds: ReadonlySet<string>,
): Projects3Grouping[] {
  const topLevel =
    (read: (task: Projects3Task) => string) =>
    (task: Projects3Task): string | null =>
      subtaskIds.has(task.id) ? null : read(task)
  return [
    {
      getGroupId: topLevel((task) => task.status),
      id: 'status',
      label: labels.groupings.status,
      options: projects3Statuses.map((status) => ({
        id: status,
        label: labels.statuses[status],
      })),
    },
    {
      getGroupId: topLevel((task) => task.priority ?? projects3NoGroup),
      id: 'priority',
      label: labels.groupings.priority,
      options: [
        ...dataPriorities.map((priority) => ({
          id: priority,
          label: labels.priorities[priority],
        })),
        { id: projects3NoGroup, label: labels.noPriority },
      ],
    },
    {
      getGroupId: topLevel((task) => task.assigneeId ?? projects3NoGroup),
      id: 'assignee',
      label: labels.groupings.assignee,
      options: [
        ...assignees.map((assignee) => ({
          id: assignee.id,
          label: assignee.label,
        })),
        { id: projects3NoGroup, label: labels.unassigned },
      ],
    },
  ]
}

function orderByGrouping(
  tasks: Projects3Task[],
  grouping: Projects3Grouping | undefined,
): Projects3Task[] {
  if (!grouping) return tasks
  const rank = new Map(
    grouping.options.map((option, index) => [option.id, index]),
  )
  const rankOf = (task: Projects3Task) =>
    rank.get(grouping.getGroupId(task) ?? '') ?? grouping.options.length
  return [...tasks].sort((a, b) => rankOf(a) - rankOf(b))
}

const pickGroupBy = (value: string | null): Projects3GroupBy | null =>
  projects3GroupBys.find((item) => item === value) ?? null

export function Projects3({
  archivedFilter: archivedFilterProp,
  assigneeFilter: assigneeFilterProp,
  assignees = noAssignees,
  assigneesLoading = false,
  className,
  collapsedGroupIds: collapsedGroupIdsProp,
  error,
  expanded: expandedProp,
  filtered = false,
  groupBy: groupByProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onArchivedFilterChange,
  onAssigneeChange,
  onAssigneeFilterChange,
  onBulkArchive,
  onBulkAssigneeChange,
  onBulkPriorityChange,
  onBulkStatusChange,
  onBulkTypeChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDueChange,
  onExpandedChange,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPageChange,
  onPriorityChange,
  onRetry,
  onSavedViewChange,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewUpdate,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStartChange,
  onStatusChange,
  onStatusFilterChange,
  onTagFilterChange,
  onTagsChange,
  onTypeChange,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  savedViewId: savedViewIdProp,
  savedViewModified = false,
  savedViews,
  savedViewsLoading = false,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  statusFilter: statusFilterProp,
  tagFilter: tagFilterProp,
  tags = noOptions,
  tagsLoading = false,
  tasks,
  timeZone = defaultDataCollectionTimeZone,
  total,
  types = noOptions,
}: Readonly<Projects3Props>) {
  const labels = useMemo(() => resolveProjects3Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Projects3Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Projects3Sort>(
    sortProp,
    'newest',
    onSortChange,
  )
  const [groupBy, setGroupBy] = useControllable<Projects3GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useControllable<string[]>(
    collapsedGroupIdsProp,
    noIds,
    onCollapsedGroupIdsChange,
  )
  const [expanded, setExpanded] = useControllable<Projects3Expanded>(
    expandedProp,
    noExpanded,
    onExpandedChange,
  )
  const [statusFilter, setStatusFilter] =
    useControllable<Projects3Status | null>(
      statusFilterProp,
      null,
      onStatusFilterChange,
    )
  const [assigneeFilter, setAssigneeFilter] = useControllable<string | null>(
    assigneeFilterProp,
    null,
    onAssigneeFilterChange,
  )
  const [archivedFilter, setArchivedFilter] =
    useControllable<Projects3Archived | null>(
      archivedFilterProp,
      null,
      onArchivedFilterChange,
    )
  const [tagFilter, setTagFilter] = useControllable<string[]>(
    tagFilterProp,
    noIds,
    onTagFilterChange,
  )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const [savedViewId, setSavedViewId] = useControllable<string | null>(
    savedViewIdProp,
    null,
    onSavedViewChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openTask = useStableHandler(onOpen)
  const changeAssignee = useStableHandler(onAssigneeChange)
  const changeDue = useStableHandler(onDueChange)
  const changePriority = useStableHandler(onPriorityChange)
  const changeStart = useStableHandler(onStartChange)
  const changeStatus = useStableHandler(onStatusChange)
  const changeTags = useStableHandler(onTagsChange)
  const changeType = useStableHandler(onTypeChange)

  const context = useMemo<Projects3FieldContext>(
    () => ({
      assignees,
      labels,
      locale,
      onAssigneeChange: changeAssignee,
      onDueChange: changeDue,
      onOpen: openTask,
      onPriorityChange: changePriority,
      onStartChange: changeStart,
      onStatusChange: changeStatus,
      onTagsChange: changeTags,
      onTypeChange: changeType,
      tags,
      tagsLoading,
      timeZone,
      types,
    }),
    [
      assignees,
      changeAssignee,
      changeDue,
      changePriority,
      changeStart,
      changeStatus,
      changeTags,
      changeType,
      labels,
      locale,
      openTask,
      tags,
      tagsLoading,
      timeZone,
      types,
    ],
  )

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkArchive ||
      onBulkAssigneeChange ||
      onBulkPriorityChange ||
      onBulkStatusChange ||
      onBulkTypeChange,
  )

  const kanbanGroupBy: Projects3KanbanGroupBy =
    groupBy === 'priority' ? 'priority' : 'status'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const subtaskIds = useMemo(() => subtaskIdsOf(tasks), [tasks])
  const groupings = useMemo(
    () => createProjects3Groupings(labels, assignees, subtaskIds),
    [assignees, labels, subtaskIds],
  )
  const tableTasks = useMemo(
    () =>
      mode === 'table'
        ? orderByGrouping(
            tasks,
            groupings.find(({ id }) => id === groupBy),
          )
        : tasks,
    [groupBy, groupings, mode, tasks],
  )
  const collection = useMemo<DataCollectionDefinition<Projects3Task>>(
    () => ({
      getKey: (task) => task.id,
      getLabel: (task) => task.title,
      groupings,
      records: tasks,
    }),
    [groupings, tasks],
  )

  const columns = useMemo(
    () => createProjects3Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Projects3Task>({
    columns,
    data: tableTasks,
    enableExpanding: true,
    enableRowSelection: selectable,
    expanded,
    getRowId: (task) => task.id,
    getSubRows: (task) => task.subtasks,
    onExpandedChange: setExpanded,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
    tableOptions: {
      enableRowSelection: (row) => selectable && row.depth === 0,
      enableSubRowSelection: false,
    },
  })

  const kanban = useMemo<CollectionKanbanViewProps<Projects3Task>>(
    () => ({
      emptyColumnLabel: labels.emptyColumn,
      onMoveCard:
        changeStatus && kanbanGroupBy === 'status'
          ? ({ card, sourceGroup, targetGroup }) => {
              if (card.archived || targetGroup.grouping !== 'status')
                return false
              if (sourceGroup.id === targetGroup.id) return false
              const status = projects3Statuses.find(
                (item) => item === targetGroup.value,
              )
              if (status && status !== card.status)
                changeStatus(card.id, status)
              return false
            }
          : undefined,
    }),
    [changeStatus, kanbanGroupBy, labels.emptyColumn],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Projects3Skeleton label={labels.loading} />,
  })

  const hasTasks = total === undefined ? tasks.length > 0 : total > 0
  const showSavedViews = savedViews !== undefined || savedViewsLoading

  return (
    <DataCollectionFrame
      className={className}
      data-block="projects-3"
      title={labels.title}
      toolbar={
        <Projects3Toolbar
          archivedFilter={archivedFilter}
          assigneeFilter={assigneeFilter}
          assignees={assignees}
          assigneesLoading={assigneesLoading}
          groupBy={groupBy}
          kanbanGroupBy={kanbanGroupBy}
          labels={labels}
          left={
            showSavedViews ? (
              <DataCollectionViewSwitcher<(typeof allTasksView)[number]>
                label={labels.viewList}
                locale={locale}
                modified={savedViewModified}
                onSavedViewCreate={onSavedViewCreate}
                onSavedViewDelete={onSavedViewDelete}
                onSavedViewDuplicate={onSavedViewDuplicate}
                onSavedViewRename={onSavedViewRename}
                onSavedViewSelect={setSavedViewId}
                onSavedViewUpdate={onSavedViewUpdate}
                onViewChange={() => setSavedViewId(null)}
                savedViewId={savedViewId}
                savedViewLabels={labels.savedViews}
                savedViews={savedViews}
                savedViewsLoading={savedViewsLoading}
                view="all"
                viewLabels={{ all: labels.allTasks }}
                views={allTasksView}
              />
            ) : undefined
          }
          loading={Boolean(loadState)}
          mode={mode}
          onArchivedFilterChange={
            onArchivedFilterChange ? setArchivedFilter : undefined
          }
          onAssigneeFilterChange={
            onAssigneeFilterChange ? setAssigneeFilter : undefined
          }
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          onModeChange={setMode}
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          onTagFilterChange={onTagFilterChange ? setTagFilter : undefined}
          search={search}
          sort={sort}
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          tags={tags}
          tagsLoading={tagsLoading}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Projects3Task>
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
          mode={mode}
          onCollapsedGroupIdsChange={(groupIds) =>
            setCollapsedGroupIds([...groupIds])
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openTask ? (task) => openTask(task.id) : undefined}
          renderKanbanRecord={renderProjects3KanbanCard(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createProjects3SelectionActions({
                      assignees,
                      labels,
                      onBulkArchive,
                      onBulkAssigneeChange,
                      onBulkPriorityChange,
                      onBulkStatusChange,
                      onBulkTypeChange,
                      onDone: clearSelection,
                      selectedRows,
                      types,
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
