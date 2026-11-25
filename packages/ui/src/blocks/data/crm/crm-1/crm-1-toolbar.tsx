import {
  ArchiveIcon,
  ArrowsDownUpIcon,
  HandshakeIcon,
  TagIcon,
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
  crm1ArchivedChoices,
  crm1LeadStatuses,
  crm1Modes,
  crm1Sorts,
} from './crm-1-options'
import type {
  Crm1Archived,
  Crm1Labels,
  Crm1LeadStatus,
  Crm1Mode,
  Crm1Option,
  Crm1Sort,
  Crm1Variant,
} from './types'

export interface Crm1ToolbarProps {
  archivedFilter: Crm1Archived | null
  labels: Crm1Labels
  leadFilter: Crm1LeadStatus | null
  left?: ReactNode
  loading: boolean
  mode: Crm1Mode
  onArchivedFilterChange?: (archived: Crm1Archived | null) => void
  onCreate?: () => void
  onLeadFilterChange?: (leadStatus: Crm1LeadStatus | null) => void
  onModeChange: (mode: Crm1Mode) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Crm1Sort) => void
  onTagFilterChange: (tagIds: string[]) => void
  search: string
  sort: Crm1Sort
  tagFilter: readonly string[]
  tags: readonly Crm1Option[]
  tagsLoading: boolean
  variant: Crm1Variant
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Crm1Toolbar({
  archivedFilter,
  labels,
  leadFilter,
  left,
  loading,
  mode,
  onArchivedFilterChange,
  onCreate,
  onLeadFilterChange,
  onModeChange,
  onSavePreference,
  onSearchChange,
  onSortChange,
  onTagFilterChange,
  search,
  sort,
  tagFilter,
  tags,
  tagsLoading,
  variant,
}: Readonly<Crm1ToolbarProps>) {
  const variantLabels = labels[variant]
  const showSearch = Boolean(onSearchChange)
  const showArchived = Boolean(onArchivedFilterChange)
  const showTags = tags.length > 0 || tagsLoading
  const showLeads = Boolean(onLeadFilterChange)
  const archivedValue =
    archivedFilter && archivedFilter !== 'exclude' ? archivedFilter : ''
  const hasFilters = showArchived || showTags || showLeads

  const activeFilterCount =
    (showSearch && search.trim() ? 1 : 0) +
    (showArchived && archivedValue ? 1 : 0) +
    (showTags && tagFilter.length > 0 ? 1 : 0) +
    (showLeads && leadFilter ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar<Crm1Mode>
      actions={
        onCreate ? (
          <DataCollectionToolbarButton onClick={onCreate} variant="default">
            {variantLabels.create}
          </DataCollectionToolbarButton>
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={{
        clearFilters: labels.clearFilters,
        display: labels.display,
        filterCount: labels.filterCount,
        title: variantLabels.title,
        toolbar: variantLabels.toolbar,
      }}
      left={left}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={crm1Modes}
      onClearFilters={() => {
        if (showSearch && search) onSearchChange?.('')
        if (showArchived) onArchivedFilterChange?.(null)
        if (showTags) onTagFilterChange([])
        if (showLeads) onLeadFilterChange?.(null)
      }}
      onModeChange={onModeChange}
      onSavePreference={onSavePreference}
      savePreferenceLabel={labels.savePreference}
      search={
        onSearchChange ? (
          <CollectionSearchField
            label={variantLabels.search}
            onCommit={onSearchChange}
            placeholder={variantLabels.search}
            value={search}
          />
        ) : null
      }
    >
      {onSortChange ? (
        <ViewSettingsSection label={labels.sort}>
          <SortRadioSubmenu<Crm1Sort>
            icon={ArrowsDownUpIcon}
            label={labels.sortBy}
            onValueChange={onSortChange}
            options={crm1Sorts.map(
              (item) => [item, labels.sorts[item]] as const,
            )}
            value={sort}
          />
        </ViewSettingsSection>
      ) : null}
      {onSortChange && hasFilters ? <MenuSeparator /> : null}
      {hasFilters ? (
        <ViewSettingsSection label={labels.filters}>
          {showArchived ? (
            <FilterRadioSubmenu
              clearLabel={labels.archivedOptions.exclude}
              icon={ArchiveIcon}
              label={labels.archivedFilter}
              onValueChange={(value) =>
                onArchivedFilterChange?.(pick(crm1ArchivedChoices, value))
              }
              options={crm1ArchivedChoices.map(
                (item) => [item, labels.archivedOptions[item]] as const,
              )}
              value={archivedValue}
            />
          ) : null}
          {showTags ? (
            <FilterCheckboxSubmenu
              icon={TagIcon}
              label={labels.tags}
              loading={tagsLoading}
              onValueChange={onTagFilterChange}
              options={tags.map((tag) => [tag.id, tag.label] as const)}
              value={tagFilter}
            />
          ) : null}
          {showLeads ? (
            <FilterRadioSubmenu
              clearLabel={labels.allLeads}
              icon={HandshakeIcon}
              label={labels.leadFilter}
              onValueChange={(value) =>
                onLeadFilterChange?.(pick(crm1LeadStatuses, value))
              }
              options={crm1LeadStatuses.map(
                (item) => [item, labels.leadStatuses[item]] as const,
              )}
              value={leadFilter ?? ''}
            />
          ) : null}
        </ViewSettingsSection>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
