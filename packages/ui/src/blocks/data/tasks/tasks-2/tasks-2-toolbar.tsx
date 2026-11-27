import {
  CalendarDotsIcon,
  CaretDownIcon,
  CellSignalHighIcon,
  ClockCounterClockwiseIcon,
  CubeIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  RadioButtonIcon,
  RowsIcon,
  SortAscendingIcon,
  StackIcon,
  TagIcon,
  TextTIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
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
import { ToolbarButton } from '@tc96/ui/toolbar'
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
import { tasks2ToggleableColumns } from './tasks-2-options'
import type { Tasks2CreateOption, Tasks2Labels } from './types'

export interface Tasks2ToolbarProps {
  assigneeFilter: string | null
  createOptions: readonly Tasks2CreateOption[]
  filters: readonly TasksFilterId[]
  groupBy: TasksGroupBy | null
  groupBys: readonly TasksGroupBy[]
  kanbanGroupBy: TasksKanbanGroupBy
  kindFilter: string | null
  kinds: readonly TasksOption[]
  labels: Tasks2Labels
  loading: boolean
  mode: TasksMode
  modes: readonly TasksMode[]
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: (optionId?: string) => void
  onGroupByChange: (groupBy: TasksGroupBy | null) => void
  onKindFilterChange?: (kindId: string | null) => void
  onModeChange: (mode: TasksMode) => void
  onPriorityFilterChange?: (priority: TasksPriorityFilter | null) => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: TasksSort) => void
  onStatusFilterChange?: (status: TasksStatus | null) => void
  onVisibleColumnsChange?: (columns: TasksColumnId[]) => void
  people: readonly TasksPerson[]
  priorityFilter: TasksPriorityFilter | null
  search: string
  sort: TasksSort
  sorts: readonly TasksSort[]
  statusFilter: TasksStatus | null
  visibleColumns: ReadonlySet<TasksColumnId>
}

type Tasks2GroupOption = TasksGroupBy | typeof tasksNoGroup

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
} as const satisfies Record<Tasks2GroupOption, PhosphorIcon>

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

function Tasks2CreateAction({
  label,
  onCreate,
  options,
}: Readonly<{
  label: string
  onCreate: (optionId?: string) => void
  options: readonly Tasks2CreateOption[]
}>) {
  if (options.length === 0)
    return (
      <ToolbarButton
        onClick={() => onCreate()}
        render={<Button type="button" />}
      >
        <PlusIcon aria-hidden="true" />
        {label}
      </ToolbarButton>
    )

  return (
    <Menu>
      <MenuTrigger render={<ToolbarButton render={<Button type="button" />} />}>
        <PlusIcon aria-hidden="true" />
        {label}
        <CaretDownIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {options.map((option) => (
          <MenuItem key={option.id} onClick={() => onCreate(option.id)}>
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

export function Tasks2Toolbar({
  assigneeFilter,
  createOptions,
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
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  onVisibleColumnsChange,
  people,
  priorityFilter,
  search,
  sort,
  sorts,
  statusFilter,
  visibleColumns,
}: Readonly<Tasks2ToolbarProps>) {
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
  const groupValues: readonly Tasks2GroupOption[] =
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
    mode === 'datatable' ? tasksTableToggleableColumns : tasks2ToggleableColumns
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
      left={
        <CollectionToolbarHeading>
          <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
        </CollectionToolbarHeading>
      }
      right={
        loading ? undefined : (
          <>
            {onSearchChange ? (
              <CollectionSearchField
                label={labels.search}
                onCommit={onSearchChange}
                placeholder={labels.search}
                value={search}
              />
            ) : null}
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
            >
              {showGroup || showSort ? (
                <ViewSettingsSection label={labels.layoutBy}>
                  {showGroup ? (
                    <ViewSettingsSubmenu<Tasks2GroupOption>
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
                  label={labels.visibleColumns}
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
              <Tasks2CreateAction
                label={labels.create}
                onCreate={onCreate}
                options={createOptions}
              />
            ) : null}
          </>
        )
      }
    />
  )
}
