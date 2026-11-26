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
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
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
  tasks3GroupBys,
  tasks3KanbanGroupBys,
  tasks3Modes,
  tasks3NoGroup,
  tasks3PriorityFilters,
  tasks3Sorts,
  tasks3Statuses,
} from './tasks-3-options'
import type {
  Tasks3GroupBy,
  Tasks3KanbanGroupBy,
  Tasks3Labels,
  Tasks3Mode,
  Tasks3Person,
  Tasks3PriorityFilter,
  Tasks3Sort,
  Tasks3Status,
} from './types'

export interface Tasks3ToolbarProps {
  assigneeFilter: string | null
  groupBy: Tasks3GroupBy | null
  kanbanGroupBy: Tasks3KanbanGroupBy
  labels: Tasks3Labels
  loading: boolean
  mode: Tasks3Mode
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Tasks3GroupBy | null) => void
  onModeChange: (mode: Tasks3Mode) => void
  onPriorityFilterChange?: (priority: Tasks3PriorityFilter | null) => void
  onSortChange?: (sort: Tasks3Sort) => void
  onStatusFilterChange?: (status: Tasks3Status | null) => void
  people: readonly Tasks3Person[]
  priorityFilter: Tasks3PriorityFilter | null
  sort: Tasks3Sort
  statusFilter: Tasks3Status | null
}

type Tasks3GroupOption = Tasks3GroupBy | typeof tasks3NoGroup

const optionIcon = 'size-4'

const sortIcons = {
  due: CalendarDotsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Tasks3Sort, PhosphorIcon>

const groupIcons = {
  none: RowsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
  status: RadioButtonIcon,
} as const satisfies Record<Tasks3GroupOption, PhosphorIcon>

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

export function Tasks3Toolbar({
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
}: Readonly<Tasks3ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showPriority = Boolean(onPriorityFilterChange)
  const showAssignee = Boolean(onAssigneeFilterChange) && people.length > 0
  const hasFilters = showStatus || showPriority || showAssignee
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showPriority && priorityFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0)
  const groupValues: readonly Tasks3GroupOption[] =
    mode === 'kanban'
      ? tasks3KanbanGroupBys
      : [tasks3NoGroup, ...tasks3GroupBys]

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={
        <CollectionToolbarHeading>
          <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
          {labels.description ? (
            <CollectionToolbarDescription>
              {labels.description}
            </CollectionToolbarDescription>
          ) : null}
        </CollectionToolbarHeading>
      }
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
                    <ViewSettingsSubmenu<Tasks3Status>
                      icon={RadioButtonIcon}
                      label={labels.filterBy.status}
                      onValueChange={(value) => onStatusFilterChange?.(value)}
                      options={tasks3Statuses.map((status) => ({
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
                    <ViewSettingsSubmenu<Tasks3PriorityFilter>
                      icon={CellSignalHighIcon}
                      label={labels.filterBy.priority}
                      onValueChange={(value) => onPriorityFilterChange?.(value)}
                      options={tasks3PriorityFilters.map((priority) => ({
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
            <ViewSettingsRadioMenu<Tasks3Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={tasks3Modes.map((item) =>
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
              <ViewSettingsRadioMenu<Tasks3Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={tasks3Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            <ViewSettingsRadioMenu<Tasks3GroupOption>
              icon={StackIcon}
              label={labels.group}
              onValueChange={(value) =>
                onGroupByChange(pick(tasks3GroupBys, value))
              }
              options={groupValues.map((item) =>
                iconOption(item, labels.groupings[item], groupIcons[item]),
              )}
              section={labels.groupBy}
              value={
                mode === 'kanban' ? kanbanGroupBy : (groupBy ?? tasks3NoGroup)
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
