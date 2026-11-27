import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  ClockCounterClockwiseIcon,
  CubeIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  SortAscendingIcon,
  StackIcon,
  TextTIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { Action } from '@tc96/ui/patterns/collection/shared/components/collection-action'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  ViewSettings,
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import { PropertyMetaIcon, priorityMeta } from '@tc96/ui/property-meta'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from '../../shared/collection/data-collection-toolbar'
import {
  tasks6All,
  tasks6KanbanGroupBys,
  tasks6Modes,
  tasks6PriorityFilters,
} from './tasks-6-options'
import type {
  Tasks6KanbanGroupBy,
  Tasks6Labels,
  Tasks6Mode,
  Tasks6Person,
  Tasks6PriorityFilter,
  Tasks6Sort,
  Tasks6SortOption,
  Tasks6Status,
  Tasks6StatusOption,
} from './types'

export interface Tasks6ToolbarProps {
  assigneeFilter: string | null
  kanbanGroupBy: Tasks6KanbanGroupBy
  labels: Tasks6Labels
  loading: boolean
  mode: Tasks6Mode
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onKanbanGroupByChange: (groupBy: Tasks6KanbanGroupBy) => void
  onModeChange: (mode: Tasks6Mode) => void
  onPriorityFilterChange?: (priority: Tasks6PriorityFilter | null) => void
  onSortChange?: (sort: Tasks6Sort) => void
  onStatusFilterChange?: (status: Tasks6Status | null) => void
  people: readonly Tasks6Person[]
  priorityFilter: Tasks6PriorityFilter | null
  sort: Tasks6Sort
  sortOptions: readonly Tasks6SortOption[]
  statuses: readonly Tasks6StatusOption[]
  statusFilter: Tasks6Status | null
  viewSwitcher: ReactNode
}

const optionIcon = 'size-4'

const sortIcons: Record<string, PhosphorIcon> = {
  due: CalendarDotsIcon,
  priority: CellSignalHighIcon,
  project: CubeIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
}

const groupIcons = {
  priority: CellSignalHighIcon,
  status: RadioButtonIcon,
} as const satisfies Record<Tasks6KanbanGroupBy, PhosphorIcon>

const iconOption = <TValue extends string>(
  value: TValue,
  label: string,
  Icon: PhosphorIcon,
): ViewSettingsOption<TValue> => ({
  icon: <Icon aria-hidden="true" />,
  label,
  value,
})

const allOption = (label: string): ViewSettingsOption => ({
  label,
  value: tasks6All,
})

const fromAll = (value: string) => (value === tasks6All ? null : value)

export function Tasks6Toolbar({
  assigneeFilter,
  kanbanGroupBy,
  labels,
  loading,
  mode,
  onAssigneeFilterChange,
  onCreate,
  onKanbanGroupByChange,
  onModeChange,
  onPriorityFilterChange,
  onSortChange,
  onStatusFilterChange,
  people,
  priorityFilter,
  sort,
  sortOptions,
  statuses,
  statusFilter,
  viewSwitcher,
}: Readonly<Tasks6ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showPriority = Boolean(onPriorityFilterChange)
  const showAssignee = Boolean(onAssigneeFilterChange) && people.length > 0
  const hasFilters = showStatus || showPriority || showAssignee
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showPriority && priorityFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0)

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
              label={labels.display}
              onClearFilters={
                hasFilters
                  ? () => {
                      if (showStatus) onStatusFilterChange?.(null)
                      if (showPriority) onPriorityFilterChange?.(null)
                      if (showAssignee) onAssigneeFilterChange?.(null)
                    }
                  : undefined
              }
            >
              <ViewSettingsSection label={labels.display}>
                <ViewSettingsSubmenu<Tasks6Mode>
                  label={labels.layout}
                  onValueChange={onModeChange}
                  options={tasks6Modes.map((item) =>
                    iconOption(
                      item,
                      labels.modes[item],
                      dataCollectionModeIcons[item],
                    ),
                  )}
                  value={mode}
                />
                {onSortChange ? (
                  <ViewSettingsSubmenu
                    icon={SortAscendingIcon}
                    label={labels.sortBy}
                    onValueChange={onSortChange}
                    options={sortOptions.map((item) =>
                      iconOption(
                        item.id,
                        item.label,
                        sortIcons[item.id] ?? SortAscendingIcon,
                      ),
                    )}
                    value={sort}
                  />
                ) : null}
                {mode === 'kanban' ? (
                  <ViewSettingsSubmenu<Tasks6KanbanGroupBy>
                    icon={StackIcon}
                    label={labels.kanbanGroupBy}
                    onValueChange={onKanbanGroupByChange}
                    options={tasks6KanbanGroupBys.map((item) =>
                      iconOption(
                        item,
                        labels.groupings[item],
                        groupIcons[item],
                      ),
                    )}
                    value={kanbanGroupBy}
                  />
                ) : null}
              </ViewSettingsSection>
              {hasFilters ? (
                <>
                  <MenuSeparator />
                  <ViewSettingsSection label={labels.filterProperties}>
                    {showStatus ? (
                      <ViewSettingsSubmenu
                        icon={RadioButtonIcon}
                        label={labels.filterBy.status}
                        onValueChange={(value) =>
                          onStatusFilterChange?.(fromAll(value))
                        }
                        options={[
                          allOption(labels.filterAll.status),
                          ...statuses.map((status) => ({
                            icon: (
                              <PropertyMetaIcon
                                className={optionIcon}
                                meta={status.meta}
                              />
                            ),
                            label: status.label,
                            value: status.id,
                          })),
                        ]}
                        value={statusFilter ?? tasks6All}
                      />
                    ) : null}
                    {showPriority ? (
                      <ViewSettingsSubmenu
                        icon={CellSignalHighIcon}
                        label={labels.filterBy.priority}
                        onValueChange={(value) =>
                          onPriorityFilterChange?.(
                            tasks6PriorityFilters.find(
                              (item) => item === value,
                            ) ?? null,
                          )
                        }
                        options={[
                          allOption(labels.filterAll.priority),
                          ...tasks6PriorityFilters.map((priority) => ({
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
                          })),
                        ]}
                        value={priorityFilter ?? tasks6All}
                      />
                    ) : null}
                    {showAssignee ? (
                      <ViewSettingsSubmenu
                        icon={UserIcon}
                        label={labels.filterBy.assignee}
                        onValueChange={(value) =>
                          onAssigneeFilterChange?.(fromAll(value))
                        }
                        options={[
                          allOption(labels.filterAll.assignee),
                          ...people.map((person) =>
                            iconOption(person.id, person.label, UserCircleIcon),
                          ),
                        ]}
                        value={assigneeFilter ?? tasks6All}
                      />
                    ) : null}
                  </ViewSettingsSection>
                </>
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
