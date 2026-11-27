import {
  CalendarBlankIcon,
  CalendarDotsIcon,
  CellSignalHighIcon,
  ClockCounterClockwiseIcon,
  FunnelSimpleIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  RowsIcon,
  ScalesIcon,
  ShapesIcon,
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
  ViewSettingsFieldSection,
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import { PropertyMetaIcon, priorityMeta } from '@tc96/ui/property-meta'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from '../../shared/collection/data-collection-toolbar'
import {
  isTasks6FieldId,
  tasks6ColumnFields,
  tasks6GroupBys,
  tasks6Modes,
  tasks6NoGroup,
  tasks6PriorityFilters,
} from './tasks-6-options'
import type {
  Tasks6FieldId,
  Tasks6GroupBy,
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
  activeFilterCount?: number
  assigneeFilter: string | null
  filters?: ReactNode
  groupBy: Tasks6GroupBy | null
  groupBys: readonly Tasks6GroupBy[]
  kanbanGroupBy: Tasks6KanbanGroupBy
  kanbanGroupBys: readonly Tasks6KanbanGroupBy[]
  fields: readonly Tasks6FieldId[]
  labels: Tasks6Labels
  loading: boolean
  mode: Tasks6Mode
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onClearFilters?: () => void
  onCreate?: () => void
  onFieldVisibleChange: (id: Tasks6FieldId, visible: boolean) => void
  onGroupByChange: (groupBy: Tasks6GroupBy | null) => void
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

type Tasks6GroupOption = Tasks6GroupBy | typeof tasks6NoGroup

const optionIcon = 'size-4'

export const tasks6SortIcons: Record<string, PhosphorIcon> = {
  due: CalendarDotsIcon,
  priority: CellSignalHighIcon,
  project: ScalesIcon,
  title: TextTIcon,
  updated: ClockCounterClockwiseIcon,
}

const groupIcons = {
  none: RowsIcon,
  priority: CellSignalHighIcon,
  project: ScalesIcon,
  status: RadioButtonIcon,
} as const satisfies Record<Tasks6GroupOption, PhosphorIcon>

const fieldIcons = {
  assignees: UserIcon,
  due: CalendarDotsIcon,
  priority: CellSignalHighIcon,
  project: ScalesIcon,
  start: CalendarBlankIcon,
  status: RadioButtonIcon,
  type: ShapesIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Tasks6FieldId, PhosphorIcon>

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

interface Tasks6MenuProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

function Tasks6Menu({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<Tasks6MenuProps>) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <ToolbarButton
            render={
              <Button
                aria-label={label}
                size={trailing ? 'default' : 'icon'}
                type="button"
                variant="ghost"
              />
            }
          />
        }
      >
        <Icon aria-hidden="true" />
        {trailing}
      </MenuTrigger>
      <MenuPopup align="end">{children}</MenuPopup>
    </Menu>
  )
}

interface Tasks6RadioMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value: TValue
}

function Tasks6RadioMenu<TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<Tasks6RadioMenuProps<TValue>>) {
  return (
    <Tasks6Menu icon={icon} label={label}>
      <ViewSettingsSection label={section}>
        <MenuRadioGroup
          onValueChange={(next: TValue) => onValueChange(next)}
          value={value}
        >
          {options.map((option) => (
            <MenuRadioItem closeOnClick key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </ViewSettingsSection>
    </Tasks6Menu>
  )
}

export function Tasks6Toolbar({
  activeFilterCount: activeFilterCountProp,
  assigneeFilter,
  fields,
  filters,
  groupBy,
  groupBys,
  kanbanGroupBy,
  kanbanGroupBys,
  labels,
  loading,
  mode,
  onAssigneeFilterChange,
  onClearFilters,
  onCreate,
  onFieldVisibleChange,
  onGroupByChange,
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
  const showStatus = !filters && Boolean(onStatusFilterChange)
  const showPriority = !filters && Boolean(onPriorityFilterChange)
  const showAssignee =
    !filters && Boolean(onAssigneeFilterChange) && people.length > 0
  const hasFilters =
    Boolean(filters) || showStatus || showPriority || showAssignee
  const activeFilterCount =
    activeFilterCountProp ??
    (showStatus && statusFilter ? 1 : 0) +
      (showPriority && priorityFilter ? 1 : 0) +
      (showAssignee && assigneeFilter ? 1 : 0)
  const groupValues: readonly Tasks6GroupOption[] =
    mode === 'kanban'
      ? kanbanGroupBys
      : groupBys.length > 0
        ? [tasks6NoGroup, ...groupBys]
        : []

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={viewSwitcher}
      right={
        <>
          {hasFilters ? (
            <Tasks6Menu
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
                {filters}
                {showStatus ? (
                  <ViewSettingsSubmenu<Tasks6Status>
                    icon={RadioButtonIcon}
                    label={labels.filterBy.status}
                    onValueChange={(value) => onStatusFilterChange?.(value)}
                    options={statuses.map((status) => ({
                      icon: (
                        <PropertyMetaIcon
                          className={optionIcon}
                          meta={status.meta}
                        />
                      ),
                      label: status.label,
                      value: status.id,
                    }))}
                    value={statusFilter ?? undefined}
                  />
                ) : null}
                {showPriority ? (
                  <ViewSettingsSubmenu<Tasks6PriorityFilter>
                    icon={CellSignalHighIcon}
                    label={labels.filterBy.priority}
                    onValueChange={(value) => onPriorityFilterChange?.(value)}
                    options={tasks6PriorityFilters.map((priority) => ({
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
                  if (onClearFilters) return onClearFilters()
                  if (showStatus) onStatusFilterChange?.(null)
                  if (showPriority) onPriorityFilterChange?.(null)
                  if (showAssignee) onAssigneeFilterChange?.(null)
                }}
              >
                {labels.clearFilters}
              </MenuItem>
            </Tasks6Menu>
          ) : null}
          <Tasks6RadioMenu<Tasks6Mode>
            icon={dataCollectionModeIcons[mode]}
            label={labels.layout}
            onValueChange={onModeChange}
            options={tasks6Modes.map((item) =>
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
            <Tasks6Menu icon={SortAscendingIcon} label={labels.sort}>
              <ViewSettingsSection label={labels.sortBy}>
                <MenuRadioGroup
                  onValueChange={(next: Tasks6Sort) => onSortChange(next)}
                  value={sort}
                >
                  {sortOptions.map((item) => {
                    const option = iconOption(
                      item.id,
                      item.label,
                      item.icon ??
                        tasks6SortIcons[item.id] ??
                        SortAscendingIcon,
                    )
                    return (
                      <MenuRadioItem closeOnClick key={item.id} value={item.id}>
                        {option.icon}
                        {option.label}
                      </MenuRadioItem>
                    )
                  })}
                </MenuRadioGroup>
              </ViewSettingsSection>
              <ViewSettingsFieldSection
                fields={tasks6ColumnFields.map((id) => ({
                  icon: fieldIcons[id],
                  id,
                  label: labels.columns[id],
                  visible: fields.includes(id),
                }))}
                label={labels.visibility}
                onVisibleChange={(id, visible) => {
                  if (isTasks6FieldId(id)) onFieldVisibleChange(id, visible)
                }}
              />
            </Tasks6Menu>
          ) : null}
          {groupValues.length > 0 ? (
            <Tasks6RadioMenu<Tasks6GroupOption>
              icon={StackIcon}
              label={labels.group}
              onValueChange={(value) =>
                onGroupByChange(pick(tasks6GroupBys, value))
              }
              options={groupValues.map((item) =>
                iconOption(item, labels.groupings[item], groupIcons[item]),
              )}
              section={labels.groupBy}
              value={
                mode === 'kanban' ? kanbanGroupBy : (groupBy ?? tasks6NoGroup)
              }
            />
          ) : null}
          {onCreate ? (
            <Action
              className="data-disabled:pointer-events-none data-disabled:opacity-64"
              disabled={loading}
              label={labels.create}
              onClick={onCreate}
            />
          ) : null}
        </>
      }
    />
  )
}
