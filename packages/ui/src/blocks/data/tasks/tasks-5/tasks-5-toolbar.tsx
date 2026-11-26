import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  ClockCounterClockwiseIcon,
  CubeIcon,
  FunnelSimpleIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  RowsIcon,
  SortAscendingIcon,
  StackIcon,
  TextTIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Action } from '@tc96/ui/patterns/collection/shared/components/collection-action'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  ViewSettingsMenuButton,
  type ViewSettingsOption,
  ViewSettingsRadioMenu,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import {
  PropertyMetaIcon,
  priorityMeta,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from '../../shared/collection/data-collection-toolbar'
import {
  tasks5GroupBys,
  tasks5KanbanGroupBys,
  tasks5Modes,
  tasks5NoGroup,
  tasks5PriorityFilters,
  tasks5Sorts,
  tasks5Statuses,
} from './tasks-5-options'
import type {
  Tasks5GroupBy,
  Tasks5KanbanGroupBy,
  Tasks5Labels,
  Tasks5Mode,
  Tasks5Person,
  Tasks5PriorityFilter,
  Tasks5Sort,
  Tasks5Status,
} from './types'

export interface Tasks5ToolbarProps {
  assigneeFilter: string | null
  groupBy: Tasks5GroupBy | null
  kanbanGroupBy: Tasks5KanbanGroupBy
  labels: Tasks5Labels
  loading: boolean
  mode: Tasks5Mode
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Tasks5GroupBy | null) => void
  onModeChange: (mode: Tasks5Mode) => void
  onPriorityFilterChange?: (priority: Tasks5PriorityFilter | null) => void
  onSortChange?: (sort: Tasks5Sort) => void
  onStatusFilterChange?: (status: Tasks5Status | null) => void
  people: readonly Tasks5Person[]
  priorityFilter: Tasks5PriorityFilter | null
  sort: Tasks5Sort
  statusFilter: Tasks5Status | null
  viewSwitcher: ReactNode
}

type Tasks5GroupOption = Tasks5GroupBy | typeof tasks5NoGroup

const optionIcon = 'size-4'

const sortIcons = {
  due: CalendarDotsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Tasks5Sort, PhosphorIcon>

const groupIcons = {
  none: RowsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
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
  groupBy,
  kanbanGroupBy,
  labels,
  loading,
  mode,
  onAssigneeFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onPriorityFilterChange,
  onSortChange,
  onStatusFilterChange,
  people,
  priorityFilter,
  sort,
  statusFilter,
  viewSwitcher,
}: Readonly<Tasks5ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showPriority = Boolean(onPriorityFilterChange)
  const showAssignee = Boolean(onAssigneeFilterChange) && people.length > 0
  const hasFilters = showStatus || showPriority || showAssignee
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showPriority && priorityFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0)
  const groupValues: readonly Tasks5GroupOption[] =
    mode === 'kanban'
      ? tasks5KanbanGroupBys
      : [tasks5NoGroup, ...tasks5GroupBys]

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={viewSwitcher}
      right={
        loading ? undefined : (
          <>
            {hasFilters ? (
              <ViewSettingsMenuButton
                icon={FunnelSimpleIcon}
                label={
                  activeFilterCount > 0
                    ? labels.activeFilters(activeFilterCount)
                    : labels.filter
                }
                trailing={
                  activeFilterCount > 0 ? (
                    <Badge aria-hidden="true">{activeFilterCount}</Badge>
                  ) : undefined
                }
              >
                <ViewSettingsSection label={labels.filterProperties}>
                  {showStatus ? (
                    <ViewSettingsSubmenu<Tasks5Status>
                      icon={RadioButtonIcon}
                      label={labels.filterBy.status}
                      onValueChange={(value) => onStatusFilterChange?.(value)}
                      options={tasks5Statuses.map((status) => ({
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
                    <ViewSettingsSubmenu<Tasks5PriorityFilter>
                      icon={CellSignalHighIcon}
                      label={labels.filterBy.priority}
                      onValueChange={(value) => onPriorityFilterChange?.(value)}
                      options={tasks5PriorityFilters.map((priority) => ({
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
                </ViewSettingsSection>
                <MenuSeparator />
                <MenuItem
                  disabled={activeFilterCount === 0}
                  onClick={() => {
                    if (showStatus) onStatusFilterChange?.(null)
                    if (showPriority) onPriorityFilterChange?.(null)
                    if (showAssignee) onAssigneeFilterChange?.(null)
                  }}
                >
                  {labels.clearFilters}
                </MenuItem>
              </ViewSettingsMenuButton>
            ) : null}
            <ViewSettingsRadioMenu<Tasks5Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={tasks5Modes.map((item) =>
                iconOption(
                  item,
                  labels.modes[item],
                  dataCollectionModeIcons[item],
                ),
              )}
              section={labels.layoutBy}
              value={mode}
            />
            {onSortChange ? (
              <ViewSettingsRadioMenu<Tasks5Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={tasks5Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            <ViewSettingsRadioMenu<Tasks5GroupOption>
              icon={StackIcon}
              label={labels.group}
              onValueChange={(value) =>
                onGroupByChange(pick(tasks5GroupBys, value))
              }
              options={groupValues.map((item) =>
                iconOption(item, labels.groupings[item], groupIcons[item]),
              )}
              section={labels.groupBy}
              value={
                mode === 'kanban' ? kanbanGroupBy : (groupBy ?? tasks5NoGroup)
              }
            />
            {onCreate ? (
              <Action label={labels.create} onClick={onCreate} />
            ) : null}
          </>
        )
      }
    />
  )
}
