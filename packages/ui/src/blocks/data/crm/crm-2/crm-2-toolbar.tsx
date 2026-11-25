import {
  ArchiveIcon,
  ArrowsDownUpIcon,
  FunnelSimpleIcon,
  MegaphoneIcon,
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
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionToolbarButton } from '../../shared/collection/data-collection-toolbar'
import {
  crm2ArchivedChoices,
  crm2Groupings,
  crm2Modes,
  crm2Origins,
  crm2Sorts,
} from './crm-2-options'
import type {
  Crm2Archived,
  Crm2GroupBy,
  Crm2Labels,
  Crm2Mode,
  Crm2Option,
  Crm2Origin,
  Crm2Person,
  Crm2Sort,
  Crm2Stage,
} from './types'

export interface Crm2ToolbarProps {
  archivedFilter: Crm2Archived | null
  groupBy: Crm2GroupBy
  labels: Crm2Labels
  left?: ReactNode
  loading: boolean
  mode: Crm2Mode
  onArchivedFilterChange?: (archived: Crm2Archived | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Crm2GroupBy) => void
  onModeChange: (mode: Crm2Mode) => void
  onOriginFilterChange?: (origin: Crm2Origin | null) => void
  onOwnerFilterChange: (ownerId: string | null) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Crm2Sort) => void
  onStageFilterChange: (stageId: string | null) => void
  onTagFilterChange: (tagIds: string[]) => void
  originFilter: Crm2Origin | null
  ownerFilter: string | null
  owners: readonly Crm2Person[]
  ownersLoading: boolean
  search: string
  sort: Crm2Sort
  stageFilter: string | null
  stages: readonly Crm2Stage[]
  stagesLoading: boolean
  tagFilter: readonly string[]
  tags: readonly Crm2Option[]
  tagsLoading: boolean
}

const optionsOf = (items: readonly Crm2Option[]) =>
  items.map((item) => [item.id, item.label] as const)

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Crm2Toolbar({
  archivedFilter,
  groupBy,
  labels,
  left,
  loading,
  mode,
  onArchivedFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onOriginFilterChange,
  onOwnerFilterChange,
  onSavePreference,
  onSearchChange,
  onSortChange,
  onStageFilterChange,
  onTagFilterChange,
  originFilter,
  ownerFilter,
  owners,
  ownersLoading,
  search,
  sort,
  stageFilter,
  stages,
  stagesLoading,
  tagFilter,
  tags,
  tagsLoading,
}: Readonly<Crm2ToolbarProps>) {
  const isBoard = mode === 'kanban'
  const showStage = stages.length > 0 || stagesLoading
  const showOwner = owners.length > 0 || ownersLoading
  const showOrigin = Boolean(onOriginFilterChange)
  const showTags = tags.length > 0 || tagsLoading
  const showArchived = Boolean(onArchivedFilterChange) && !isBoard
  const showSort = Boolean(onSortChange) && !isBoard
  const archivedValue =
    archivedFilter && archivedFilter !== 'exclude' ? archivedFilter : ''
  const hasFilters =
    showStage || showOwner || showOrigin || showTags || showArchived

  const activeFilterCount =
    (showStage && stageFilter ? 1 : 0) +
    (showOwner && ownerFilter ? 1 : 0) +
    (showOrigin && originFilter ? 1 : 0) +
    (showTags && tagFilter.length > 0 ? 1 : 0) +
    (showArchived && archivedValue ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar<Crm2Mode>
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
      modes={crm2Modes}
      onClearFilters={() => {
        if (showStage) onStageFilterChange(null)
        if (showOwner) onOwnerFilterChange(null)
        if (showOrigin) onOriginFilterChange?.(null)
        if (showTags) onTagFilterChange([])
        if (showArchived) onArchivedFilterChange?.(null)
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
      {isBoard ? (
        <ViewSettingsSection label={labels.grouping}>
          <SortRadioSubmenu<Crm2GroupBy>
            icon={ShapesIcon}
            label={labels.groupBy}
            onValueChange={onGroupByChange}
            options={crm2Groupings.map(
              (item) => [item, labels.groupings[item]] as const,
            )}
            value={groupBy}
          />
        </ViewSettingsSection>
      ) : null}
      {showSort && onSortChange ? (
        <ViewSettingsSection label={labels.sort}>
          <SortRadioSubmenu<Crm2Sort>
            icon={ArrowsDownUpIcon}
            label={labels.sortBy}
            onValueChange={onSortChange}
            options={crm2Sorts.map(
              (item) => [item, labels.sorts[item]] as const,
            )}
            value={sort}
          />
        </ViewSettingsSection>
      ) : null}
      {(isBoard || showSort) && hasFilters ? <MenuSeparator /> : null}
      {hasFilters ? (
        <ViewSettingsSection label={labels.filters}>
          {showStage ? (
            <FilterRadioSubmenu
              clearLabel={labels.allStages}
              icon={FunnelSimpleIcon}
              label={labels.columns.stage}
              loading={stagesLoading}
              onValueChange={(value) => onStageFilterChange(value || null)}
              options={optionsOf(stages)}
              value={stageFilter ?? ''}
            />
          ) : null}
          {showOwner ? (
            <FilterRadioSubmenu
              clearLabel={labels.allOwners}
              icon={UserIcon}
              label={labels.columns.owner}
              loading={ownersLoading}
              onValueChange={(value) => onOwnerFilterChange(value || null)}
              options={optionsOf(owners)}
              value={ownerFilter ?? ''}
            />
          ) : null}
          {showOrigin ? (
            <FilterRadioSubmenu
              clearLabel={labels.allOrigins}
              icon={MegaphoneIcon}
              label={labels.columns.origin}
              onValueChange={(value) =>
                onOriginFilterChange?.(pick(crm2Origins, value))
              }
              options={crm2Origins.map(
                (item) => [item, labels.origins[item]] as const,
              )}
              value={originFilter ?? ''}
            />
          ) : null}
          {showTags ? (
            <FilterCheckboxSubmenu
              icon={TagIcon}
              label={labels.columns.tags}
              loading={tagsLoading}
              onValueChange={onTagFilterChange}
              options={optionsOf(tags)}
              value={tagFilter}
            />
          ) : null}
          {showArchived ? (
            <FilterRadioSubmenu
              clearLabel={labels.archivedOptions.exclude}
              icon={ArchiveIcon}
              label={labels.archivedFilter}
              onValueChange={(value) =>
                onArchivedFilterChange?.(pick(crm2ArchivedChoices, value))
              }
              options={crm2ArchivedChoices.map(
                (item) => [item, labels.archivedOptions[item]] as const,
              )}
              value={archivedValue}
            />
          ) : null}
        </ViewSettingsSection>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
