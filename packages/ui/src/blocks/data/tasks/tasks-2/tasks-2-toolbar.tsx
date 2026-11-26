import {
  ArrowsDownUpIcon,
  CaretDownIcon,
  CircleHalfIcon,
  CubeIcon,
  PlusIcon,
  ShapesIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import {
  tasks2GroupBys,
  tasks2KanbanGroupBys,
  tasks2Modes,
  tasks2NoGroup,
  tasks2Sorts,
  tasks2Statuses,
} from './tasks-2-options'
import type {
  Tasks2CreateOption,
  Tasks2GroupBy,
  Tasks2KanbanGroupBy,
  Tasks2Labels,
  Tasks2Mode,
  Tasks2Option,
  Tasks2Person,
  Tasks2Sort,
  Tasks2Status,
} from './types'

export interface Tasks2ToolbarProps {
  assigneeFilter: string | null
  createOptions: readonly Tasks2CreateOption[]
  groupBy: Tasks2GroupBy | null
  kanbanGroupBy: Tasks2KanbanGroupBy
  labels: Tasks2Labels
  loading: boolean
  mode: Tasks2Mode
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: (optionId?: string) => void
  onGroupByChange: (groupBy: Tasks2GroupBy | null) => void
  onModeChange: (mode: Tasks2Mode) => void
  onProjectFilterChange?: (projectId: string | null) => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Tasks2Sort) => void
  onStatusFilterChange?: (status: Tasks2Status | null) => void
  people: readonly Tasks2Person[]
  projectFilter: string | null
  projects: readonly Tasks2Option[]
  search: string
  sort: Tasks2Sort
  statusFilter: Tasks2Status | null
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

function Tasks2CreateAction({
  labels,
  onCreate,
  options,
}: Readonly<{
  labels: Tasks2Labels
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
        {labels.create}
      </ToolbarButton>
    )

  return (
    <Menu>
      <MenuTrigger render={<ToolbarButton render={<Button type="button" />} />}>
        <PlusIcon aria-hidden="true" />
        {labels.create}
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
  groupBy,
  kanbanGroupBy,
  labels,
  loading,
  mode,
  onAssigneeFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onProjectFilterChange,
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  people,
  projectFilter,
  projects,
  search,
  sort,
  statusFilter,
}: Readonly<Tasks2ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showProject = Boolean(onProjectFilterChange) && projects.length > 0
  const showAssignee = Boolean(onAssigneeFilterChange) && people.length > 0
  const hasFilters = showStatus || showProject || showAssignee
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showProject && projectFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0)
  const groupOptions =
    mode === 'kanban'
      ? tasks2KanbanGroupBys.map(
          (item) => [item, labels.groupings[item]] as const,
        )
      : [
          [tasks2NoGroup, labels.groupings.none] as const,
          ...tasks2GroupBys.map(
            (item) => [item, labels.groupings[item]] as const,
          ),
        ]

  return (
    <DataCollectionSettingsToolbar<Tasks2Mode>
      actions={
        onCreate ? (
          <Tasks2CreateAction
            labels={labels}
            onCreate={onCreate}
            options={createOptions}
          />
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={tasks2Modes}
      onClearFilters={() => {
        if (showStatus) onStatusFilterChange?.(null)
        if (showProject) onProjectFilterChange?.(null)
        if (showAssignee) onAssigneeFilterChange?.(null)
      }}
      onModeChange={onModeChange}
      search={
        onSearchChange ? (
          <CollectionSearchField
            label={labels.search}
            onCommit={onSearchChange}
            placeholder={labels.search}
            value={search}
          />
        ) : null
      }
    >
      {onSortChange ? (
        <>
          <ViewSettingsSection label={labels.sort}>
            <SortRadioSubmenu<Tasks2Sort>
              icon={ArrowsDownUpIcon}
              label={labels.sortBy}
              onValueChange={onSortChange}
              options={tasks2Sorts.map(
                (item) => [item, labels.sorts[item]] as const,
              )}
              value={sort}
            />
          </ViewSettingsSection>
          <MenuSeparator />
        </>
      ) : null}
      <ViewSettingsSection label={labels.grouping}>
        <SortRadioSubmenu<string>
          icon={ShapesIcon}
          label={labels.groupBy}
          onValueChange={(value) =>
            onGroupByChange(pick(tasks2GroupBys, value))
          }
          options={groupOptions}
          value={mode === 'kanban' ? kanbanGroupBy : (groupBy ?? tasks2NoGroup)}
        />
      </ViewSettingsSection>
      {hasFilters ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label={labels.filters}>
            {showStatus ? (
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={CircleHalfIcon}
                label={labels.columns.status}
                onValueChange={(value) =>
                  onStatusFilterChange?.(pick(tasks2Statuses, value))
                }
                options={tasks2Statuses.map(
                  (item) => [item, labels.statuses[item]] as const,
                )}
                value={statusFilter ?? ''}
              />
            ) : null}
            {showProject ? (
              <FilterRadioSubmenu
                clearLabel={labels.allProjects}
                icon={CubeIcon}
                label={labels.columns.project}
                onValueChange={(value) =>
                  onProjectFilterChange?.(value || null)
                }
                options={projects.map(
                  (project) => [project.id, project.label] as const,
                )}
                value={projectFilter ?? ''}
              />
            ) : null}
            {showAssignee ? (
              <FilterRadioSubmenu
                clearLabel={labels.allAssignees}
                icon={UserIcon}
                label={labels.columns.assignees}
                onValueChange={(value) =>
                  onAssigneeFilterChange?.(value || null)
                }
                options={people.map(
                  (person) => [person.id, person.label] as const,
                )}
                value={assigneeFilter ?? ''}
              />
            ) : null}
          </ViewSettingsSection>
        </>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
