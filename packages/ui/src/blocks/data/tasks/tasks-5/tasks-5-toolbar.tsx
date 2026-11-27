import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  ClockCounterClockwiseIcon,
  CubeIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  RowsIcon,
  SortAscendingIcon,
  StackIcon,
  TagIcon,
  TextTIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Action } from '@tc96/ui/patterns/collection/shared/components/collection-action'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  ViewSettings,
  ViewSettingsFieldSection,
  type ViewSettingsMode,
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import {
  PropertyMetaIcon,
  priorityMeta,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from '../../shared/collection/data-collection-toolbar'
import {
  type TasksColumnId,
  type TasksFilterId,
  type TasksGroupBy,
  type TasksKanbanGroupBy,
  type TasksMode,
  type TasksOption,
  type TasksPerson,
  type TasksPriorityFilter,
  type TasksSort,
  type TasksStatus,
  tasksColumnIds,
  tasksKanbanGroupBys,
  tasksNoGroup,
  tasksPriorityFilters,
  tasksStatuses,
} from '../shared'
import { tasksTableToggleableColumns } from '../shared/tasks-columns'
import { tasksListToggleableColumns } from '../shared/tasks-records'
import type { Tasks5Labels } from './types'

export interface Tasks5ToolbarProps {
  assigneeFilter: string | null
  filters: readonly TasksFilterId[]
  groupBy: TasksGroupBy | null
  groupBys: readonly TasksGroupBy[]
  kanbanGroupBy: TasksKanbanGroupBy
  kindFilter: string | null
  kinds: readonly TasksOption[]
  labels: Tasks5Labels
  loading: boolean
  mode: TasksMode
  modes: readonly TasksMode[]
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: TasksGroupBy | null) => void
  onKindFilterChange?: (kindId: string | null) => void
  onModeChange: (mode: TasksMode) => void
  onPriorityFilterChange?: (priority: TasksPriorityFilter | null) => void
  onSavePreference?: () => void
  onSortChange?: (sort: TasksSort) => void
  onStatusFilterChange?: (status: TasksStatus | null) => void
  onVisibleColumnsChange?: (columns: TasksColumnId[]) => void
  people: readonly TasksPerson[]
  priorityFilter: TasksPriorityFilter | null
  sort: TasksSort
  sorts: readonly TasksSort[]
  statusFilter: TasksStatus | null
  viewSwitcher: ReactNode
  visibleColumns: ReadonlySet<TasksColumnId>
}

type Tasks5GroupOption = TasksGroupBy | typeof tasksNoGroup

const optionIcon = 'size-4'

const modeIcons = {
  datatable: dataCollectionModeIcons.table,
  kanban: dataCollectionModeIcons.kanban,
  list: dataCollectionModeIcons.list,
} as const satisfies Record<TasksMode, ViewSettingsMode['icon']>

const sortIcons = {
  due: CalendarDotsIcon,
  kind: CubeIcon,
  priority: CellSignalHighIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<TasksSort, PhosphorIcon>

const columnIcons = {
  assignees: UserIcon,
  creator: UserIcon,
  due: CalendarDotsIcon,
  kind: CubeIcon,
  priority: CellSignalHighIcon,
  status: RadioButtonIcon,
  tags: TagIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<TasksColumnId, PhosphorIcon>

const groupIcons = {
  kind: CubeIcon,
  none: RowsIcon,
  priority: CellSignalHighIcon,
  status: RadioButtonIcon,
} as const satisfies Record<Tasks5GroupOption, PhosphorIcon>

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

const iconOption = <TValue extends string>(
  value: TValue,
  label: string,
  Icon: PhosphorIcon,
): ViewSettingsOption<TValue> => ({
  icon: <Icon aria-hidden="true" />,
  label,
  value,
})

export function Tasks5Toolbar({
  assigneeFilter,
  filters,
  groupBy,
  groupBys,
  kanbanGroupBy,
  kindFilter,
  kinds,
  labels,
  loading,
  mode,
  modes,
  onAssigneeFilterChange,
  onCreate,
  onGroupByChange,
  onKindFilterChange,
  onModeChange,
  onPriorityFilterChange,
  onSavePreference,
  onSortChange,
  onStatusFilterChange,
  onVisibleColumnsChange,
  people,
  priorityFilter,
  sort,
  sorts,
  statusFilter,
  viewSwitcher,
  visibleColumns,
}: Readonly<Tasks5ToolbarProps>) {
  const showStatus = filters.includes('status') && Boolean(onStatusFilterChange)
  const showPriority =
    filters.includes('priority') && Boolean(onPriorityFilterChange)
  const showAssignee =
    filters.includes('assignee') &&
    Boolean(onAssigneeFilterChange) &&
    people.length > 0
  const showKind =
    filters.includes('kind') && Boolean(onKindFilterChange) && kinds.length > 0
  const hasFilters = showStatus || showPriority || showAssignee || showKind
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showPriority && priorityFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0) +
    (showKind && kindFilter ? 1 : 0)
  const groupValues: readonly Tasks5GroupOption[] =
    mode === 'kanban'
      ? tasksKanbanGroupBys.filter((item) => groupBys.includes(item))
      : [tasksNoGroup, ...groupBys]
  const showGroup = groupBys.length > 0
  const showSort = Boolean(onSortChange) && sorts.length > 0
  const viewModes = modes.map(
    (value): ViewSettingsMode<TasksMode> => ({
      icon: modeIcons[value],
      label: labels.modes[value],
      value,
    }),
  )
  const fields = (
    mode === 'datatable'
      ? tasksTableToggleableColumns
      : tasksListToggleableColumns
  ).map((id) => ({
    icon: columnIcons[id],
    id,
    label: labels.columns[id],
    visible: visibleColumns.has(id),
  }))

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={viewSwitcher}
      right={
        loading ? undefined : (
          <>
            <ViewSettings
              activeFilterCount={activeFilterCount}
              clearLabel={labels.clearFilters}
              label={labels.layout}
              mode={mode}
              modes={viewModes}
              onClearFilters={
                hasFilters
                  ? () => {
                      if (showStatus) onStatusFilterChange?.(null)
                      if (showPriority) onPriorityFilterChange?.(null)
                      if (showAssignee) onAssigneeFilterChange?.(null)
                      if (showKind) onKindFilterChange?.(null)
                    }
                  : undefined
              }
              onModeChange={onModeChange}
              onSavePreference={onSavePreference}
              savePreferenceLabel={labels.savePreference}
            >
              {showGroup || showSort ? (
                <ViewSettingsSection label={labels.layoutBy}>
                  {showGroup ? (
                    <ViewSettingsSubmenu<Tasks5GroupOption>
                      icon={StackIcon}
                      label={labels.groupBy}
                      onValueChange={(value) =>
                        onGroupByChange(pick(groupBys, value))
                      }
                      options={groupValues.map((item) =>
                        iconOption(
                          item,
                          labels.groupings[item],
                          groupIcons[item],
                        ),
                      )}
                      value={
                        mode === 'kanban'
                          ? kanbanGroupBy
                          : (groupBy ?? tasksNoGroup)
                      }
                    />
                  ) : null}
                  {showSort ? (
                    <ViewSettingsSubmenu<TasksSort>
                      icon={SortAscendingIcon}
                      label={labels.sortBy}
                      onValueChange={(value) => onSortChange?.(value)}
                      options={sorts.map((item) =>
                        iconOption(item, labels.sorts[item], sortIcons[item]),
                      )}
                      value={sort}
                    />
                  ) : null}
                </ViewSettingsSection>
              ) : null}
              {hasFilters ? (
                <ViewSettingsSection label={labels.filter}>
                  {showStatus ? (
                    <ViewSettingsSubmenu<TasksStatus>
                      icon={RadioButtonIcon}
                      label={labels.filterBy.status}
                      onValueChange={(value) => onStatusFilterChange?.(value)}
                      options={tasksStatuses.map((status) => ({
                        icon: (
                          <PropertyMetaIcon
                            className={optionIcon}
                            meta={workflowStatusMeta[status]}
                          />
                        ),
                        label: labels.statuses[status],
                        value: status,
                      }))}
                      value={statusFilter ?? undefined}
                    />
                  ) : null}
                  {showPriority ? (
                    <ViewSettingsSubmenu<TasksPriorityFilter>
                      icon={CellSignalHighIcon}
                      label={labels.filterBy.priority}
                      onValueChange={(value) => onPriorityFilterChange?.(value)}
                      options={tasksPriorityFilters.map((priority) => ({
                        icon: (
                          <PropertyMetaIcon
                            className={optionIcon}
                            meta={priorityMeta[priority]}
                          />
                        ),
                        label:
                          priority === 'none'
                            ? labels.noPriority
                            : labels.priorities[priority],
                        value: priority,
                      }))}
                      value={priorityFilter ?? undefined}
                    />
                  ) : null}
                  {showAssignee ? (
                    <ViewSettingsSubmenu
                      icon={UserIcon}
                      label={labels.filterBy.assignee}
                      onValueChange={(value) => onAssigneeFilterChange?.(value)}
                      options={people.map((person) =>
                        iconOption(person.id, person.label, UserCircleIcon),
                      )}
                      value={assigneeFilter ?? undefined}
                    />
                  ) : null}
                  {showKind ? (
                    <ViewSettingsSubmenu
                      icon={CubeIcon}
                      label={labels.filterBy.kind}
                      onValueChange={(value) => onKindFilterChange?.(value)}
                      options={kinds.map((kind) =>
                        iconOption(kind.id, kind.label, CubeIcon),
                      )}
                      value={kindFilter ?? undefined}
                    />
                  ) : null}
                </ViewSettingsSection>
              ) : null}
              {onVisibleColumnsChange ? (
                <ViewSettingsFieldSection
                  fields={fields}
                  label={labels.filterProperties}
                  onVisibleChange={(id, visible) =>
                    onVisibleColumnsChange(
                      tasksColumnIds.filter((column) =>
                        column === id ? visible : visibleColumns.has(column),
                      ),
                    )
                  }
                />
              ) : null}
            </ViewSettings>
            {onCreate ? (
              <Action label={labels.create} onClick={onCreate} />
            ) : null}
          </>
        )
      }
    />
  )
}
