import {
  ArrowsDownUpIcon,
  CircleHalfIcon,
  FlagIcon,
  FolderIcon,
  ShapesIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionToolbarButton } from '../../shared/collection/data-collection-toolbar'
import { dataPriorities } from '../../shared/properties/data-priority'
import {
  tasks1GroupBys,
  tasks1NoGroup,
  tasks1Sorts,
  tasks1Statuses,
} from './tasks-1-options'
import type {
  Tasks1GroupBy,
  Tasks1Labels,
  Tasks1Option,
  Tasks1Person,
  Tasks1Priority,
  Tasks1Sort,
  Tasks1Status,
  Tasks1Task,
} from './types'

export interface Tasks1ToolbarProps {
  assigneeFilter: string | null
  assignees: readonly Tasks1Person[]
  groupBy: Tasks1GroupBy | null
  labels: Tasks1Labels
  loading: boolean
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Tasks1GroupBy | null) => void
  onPriorityFilterChange?: (priority: Tasks1Priority | null) => void
  onProjectFilterChange?: (projectId: string | null) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Tasks1Sort) => void
  onStatusFilterChange?: (status: Tasks1Status | null) => void
  priorityFilter: Tasks1Priority | null
  projectFilter: string | null
  projects: readonly Tasks1Option[]
  search: string
  sort: Tasks1Sort
  statusFilter: Tasks1Status | null
  table: DataTableTable<Tasks1Task>
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Tasks1Toolbar({
  assigneeFilter,
  assignees,
  groupBy,
  labels,
  loading,
  onAssigneeFilterChange,
  onCreate,
  onGroupByChange,
  onPriorityFilterChange,
  onProjectFilterChange,
  onSavePreference,
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  priorityFilter,
  projectFilter,
  projects,
  search,
  sort,
  statusFilter,
  table,
}: Readonly<Tasks1ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showPriority = Boolean(onPriorityFilterChange)
  const showProject = Boolean(onProjectFilterChange) && projects.length > 0
  const showAssignee = Boolean(onAssigneeFilterChange) && assignees.length > 0
  const hasFilters = showStatus || showPriority || showProject || showAssignee
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showPriority && priorityFilter ? 1 : 0) +
    (showProject && projectFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar
      actions={
        onCreate ? (
          <DataCollectionToolbarButton onClick={onCreate} variant="default">
            {labels.create}
          </DataCollectionToolbarButton>
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      loading={loading}
      onClearFilters={() => {
        if (showStatus) onStatusFilterChange?.(null)
        if (showPriority) onPriorityFilterChange?.(null)
        if (showProject) onProjectFilterChange?.(null)
        if (showAssignee) onAssigneeFilterChange?.(null)
      }}
      onSavePreference={onSavePreference}
      savePreferenceLabel={labels.savePreference}
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
            <SortRadioSubmenu<Tasks1Sort>
              icon={ArrowsDownUpIcon}
              label={labels.sortBy}
              onValueChange={onSortChange}
              options={tasks1Sorts.map(
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
            onGroupByChange(pick(tasks1GroupBys, value))
          }
          options={[
            [tasks1NoGroup, labels.groupings.none] as const,
            ...tasks1GroupBys.map(
              (item) => [item, labels.groupings[item]] as const,
            ),
          ]}
          value={groupBy ?? tasks1NoGroup}
        />
      </ViewSettingsSection>
      <MenuSeparator />
      <ViewSettingsSection label={labels.columnsSection}>
        <DataTableColumnsSubmenu label={labels.visibleColumns} table={table} />
      </ViewSettingsSection>
      {hasFilters ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label={labels.filters}>
            {showStatus ? (
              <FilterRadioSubmenu
                clearLabel={labels.allStatuses}
                icon={CircleHalfIcon}
                label={labels.status}
                onValueChange={(value) =>
                  onStatusFilterChange?.(pick(tasks1Statuses, value))
                }
                options={tasks1Statuses.map(
                  (item) => [item, labels.statuses[item]] as const,
                )}
                value={statusFilter ?? ''}
              />
            ) : null}
            {showPriority ? (
              <FilterRadioSubmenu
                clearLabel={labels.allPriorities}
                icon={FlagIcon}
                label={labels.columns.priority}
                onValueChange={(value) =>
                  onPriorityFilterChange?.(pick(dataPriorities, value))
                }
                options={dataPriorities.map(
                  (item) => [item, labels.priorities[item]] as const,
                )}
                value={priorityFilter ?? ''}
              />
            ) : null}
            {showProject ? (
              <FilterRadioSubmenu
                clearLabel={labels.allProjects}
                icon={FolderIcon}
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
                options={assignees.map(
                  (assignee) => [assignee.id, assignee.label] as const,
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
