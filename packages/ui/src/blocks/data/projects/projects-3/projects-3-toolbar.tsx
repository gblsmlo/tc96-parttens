import {
  ArchiveIcon,
  ArrowsDownUpIcon,
  CircleHalfIcon,
  ShapesIcon,
  TagIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  FilterCheckboxSubmenu,
  FilterRadioSubmenu,
} from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionToolbarButton } from '../../shared/collection/data-collection-toolbar'
import {
  projects3ArchivedChoices,
  projects3GroupBys,
  projects3KanbanGroupBys,
  projects3Modes,
  projects3NoGroup,
  projects3Sorts,
  projects3Statuses,
} from './projects-3-options'
import type {
  Projects3Archived,
  Projects3GroupBy,
  Projects3KanbanGroupBy,
  Projects3Labels,
  Projects3Mode,
  Projects3Option,
  Projects3Person,
  Projects3Sort,
  Projects3Status,
} from './types'

export interface Projects3ToolbarProps {
  archivedFilter: Projects3Archived | null
  assigneeFilter: string | null
  assignees: readonly Projects3Person[]
  assigneesLoading: boolean
  groupBy: Projects3GroupBy | null
  kanbanGroupBy: Projects3KanbanGroupBy
  labels: Projects3Labels
  left?: ReactNode
  loading: boolean
  mode: Projects3Mode
  onArchivedFilterChange?: (archived: Projects3Archived | null) => void
  onAssigneeFilterChange?: (assigneeId: string | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Projects3GroupBy | null) => void
  onModeChange: (mode: Projects3Mode) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Projects3Sort) => void
  onStatusFilterChange?: (status: Projects3Status | null) => void
  onTagFilterChange?: (tagIds: string[]) => void
  search: string
  sort: Projects3Sort
  statusFilter: Projects3Status | null
  tagFilter: readonly string[]
  tags: readonly Projects3Option[]
  tagsLoading: boolean
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Projects3Toolbar({
  archivedFilter,
  assigneeFilter,
  assignees,
  assigneesLoading,
  groupBy,
  kanbanGroupBy,
  labels,
  left,
  loading,
  mode,
  onArchivedFilterChange,
  onAssigneeFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onSavePreference,
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  onTagFilterChange,
  search,
  sort,
  statusFilter,
  tagFilter,
  tags,
  tagsLoading,
}: Readonly<Projects3ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showAssignee =
    Boolean(onAssigneeFilterChange) &&
    (assignees.length > 0 || assigneesLoading)
  const showArchived = Boolean(onArchivedFilterChange)
  const showTags =
    Boolean(onTagFilterChange) && (tags.length > 0 || tagsLoading)
  const archivedValue =
    archivedFilter && archivedFilter !== 'exclude' ? archivedFilter : ''
  const hasFilters = showStatus || showAssignee || showArchived || showTags
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showAssignee && assigneeFilter ? 1 : 0) +
    (showArchived && archivedValue ? 1 : 0) +
    (showTags && tagFilter.length > 0 ? 1 : 0)
  const groupOptions =
    mode === 'kanban'
      ? projects3KanbanGroupBys.map(
          (item) => [item, labels.groupings[item]] as const,
        )
      : [
          [projects3NoGroup, labels.groupings.none] as const,
          ...projects3GroupBys.map(
            (item) => [item, labels.groupings[item]] as const,
          ),
        ]

  return (
    <DataCollectionSettingsToolbar<Projects3Mode>
      actions={
        onCreate ? (
          <DataCollectionToolbarButton onClick={onCreate} variant="default">
            {labels.create}
          </DataCollectionToolbarButton>
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      left={left}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={projects3Modes}
      onClearFilters={() => {
        if (showStatus) onStatusFilterChange?.(null)
        if (showAssignee) onAssigneeFilterChange?.(null)
        if (showArchived) onArchivedFilterChange?.(null)
        if (showTags) onTagFilterChange?.([])
      }}
      onModeChange={onModeChange}
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
            <SortRadioSubmenu<Projects3Sort>
              icon={ArrowsDownUpIcon}
              label={labels.sortBy}
              onValueChange={onSortChange}
              options={projects3Sorts.map(
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
            onGroupByChange(pick(projects3GroupBys, value))
          }
          options={groupOptions}
          value={
            mode === 'kanban' ? kanbanGroupBy : (groupBy ?? projects3NoGroup)
          }
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
                  onStatusFilterChange?.(pick(projects3Statuses, value))
                }
                options={projects3Statuses.map(
                  (item) => [item, labels.statuses[item]] as const,
                )}
                value={statusFilter ?? ''}
              />
            ) : null}
            {showAssignee ? (
              <FilterRadioSubmenu
                clearLabel={labels.allAssignees}
                icon={UserIcon}
                label={labels.columns.assignee}
                loading={assigneesLoading}
                onValueChange={(value) =>
                  onAssigneeFilterChange?.(value || null)
                }
                options={assignees.map(
                  (assignee) => [assignee.id, assignee.label] as const,
                )}
                value={assigneeFilter ?? ''}
              />
            ) : null}
            {showArchived ? (
              <FilterRadioSubmenu
                clearLabel={labels.archivedOptions.exclude}
                icon={ArchiveIcon}
                label={labels.archivedFilter}
                onValueChange={(value) =>
                  onArchivedFilterChange?.(
                    pick(projects3ArchivedChoices, value),
                  )
                }
                options={projects3ArchivedChoices.map(
                  (item) => [item, labels.archivedOptions[item]] as const,
                )}
                value={archivedValue}
              />
            ) : null}
            {showTags ? (
              <FilterCheckboxSubmenu
                icon={TagIcon}
                label={labels.columns.tags}
                loading={tagsLoading}
                onValueChange={(tagIds) => onTagFilterChange?.(tagIds)}
                options={tags.map((tag) => [tag.id, tag.label] as const)}
                value={tagFilter}
              />
            ) : null}
          </ViewSettingsSection>
        </>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
