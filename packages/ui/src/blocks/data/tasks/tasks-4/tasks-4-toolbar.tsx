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
  tasks4GroupBys,
  tasks4KanbanGroupBys,
  tasks4Modes,
  tasks4NoGroup,
  tasks4PriorityFilters,
  tasks4Sorts,
  tasks4Statuses,
} from './tasks-4-options'
import type {
  Tasks4GroupBy,
  Tasks4KanbanGroupBy,
  Tasks4Labels,
  Tasks4Mode,
  Tasks4Person,
  Tasks4PriorityFilter,
  Tasks4Sort,
  Tasks4Status,
} from './types'

export interface Tasks4ToolbarProps {
  assigneeFilter: string | null
  groupBy: Tasks4GroupBy | null
  kanbanGroupBy: Tasks4KanbanGroupBy
  labels: Tasks4Labels
  loading: boolean
  mode: Tasks4Mode
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Tasks4GroupBy | null) => void
  onModeChange: (mode: Tasks4Mode) => void
  onPriorityFilterChange?: (priority: Tasks4PriorityFilter | null) => void
  onSortChange?: (sort: Tasks4Sort) => void
  onStatusFilterChange?: (status: Tasks4Status | null) => void
  people: readonly Tasks4Person[]
  priorityFilter: Tasks4PriorityFilter | null
  sort: Tasks4Sort
  statusFilter: Tasks4Status | null
  viewSwitcher: ReactNode
}

type Tasks4GroupOption = Tasks4GroupBy | typeof tasks4NoGroup

const optionIcon = 'size-4'

const sortIcons = {
  due: CalendarDotsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Tasks4Sort, PhosphorIcon>

const groupIcons = {
  none: RowsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
  status: RadioButtonIcon,
} as const satisfies Record<Tasks4GroupOption, PhosphorIcon>

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

export function Tasks4Toolbar({
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
}: Readonly<Tasks4ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showPriority = Boolean(onPriorityFilterChange)
  const showAssignee = Boolean(onAssigneeFilterChange) && people.length > 0
  const hasFilters = showStatus || showPriority || showAssignee
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showPriority && priorityFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0)
  const groupValues: readonly Tasks4GroupOption[] =
    mode === 'kanban'
      ? tasks4KanbanGroupBys
      : [tasks4NoGroup, ...tasks4GroupBys]

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
                    <ViewSettingsSubmenu<Tasks4Status>
                      icon={RadioButtonIcon}
                      label={labels.filterBy.status}
                      onValueChange={(value) => onStatusFilterChange?.(value)}
                      options={tasks4Statuses.map((status) => ({
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
                    <ViewSettingsSubmenu<Tasks4PriorityFilter>
                      icon={CellSignalHighIcon}
                      label={labels.filterBy.priority}
                      onValueChange={(value) => onPriorityFilterChange?.(value)}
                      options={tasks4PriorityFilters.map((priority) => ({
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
            <ViewSettingsRadioMenu<Tasks4Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={tasks4Modes.map((item) =>
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
              <ViewSettingsRadioMenu<Tasks4Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={tasks4Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            <ViewSettingsRadioMenu<Tasks4GroupOption>
              icon={StackIcon}
              label={labels.group}
              onValueChange={(value) =>
                onGroupByChange(pick(tasks4GroupBys, value))
              }
              options={groupValues.map((item) =>
                iconOption(item, labels.groupings[item], groupIcons[item]),
              )}
              section={labels.groupBy}
              value={
                mode === 'kanban' ? kanbanGroupBy : (groupBy ?? tasks4NoGroup)
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
