import {
  ArchiveIcon,
  ArrowsDownUpIcon,
  BoxArrowUpIcon,
  ListBulletsIcon,
  ScalesIcon,
  SignpostIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  type FilterCheckboxGroup,
  type FilterCheckboxOption,
  FilterCheckboxSubmenu,
  FilterRadioSubmenu,
} from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionToolbarButton } from '../../shared/collection/data-collection-toolbar'
import {
  legal5ArchivedChoices,
  legal5Groupings,
  legal5Modes,
  legal5Poles,
  legal5SituationChoices,
  legal5Sorts,
} from './legal-5-options'
import type {
  Legal5Archived,
  Legal5GroupBy,
  Legal5Labels,
  Legal5Mode,
  Legal5Option,
  Legal5Person,
  Legal5Phase,
  Legal5Pole,
  Legal5Situation,
  Legal5Sort,
} from './types'

export interface Legal5ToolbarProps {
  archivedFilter: Legal5Archived | null
  clientFilter: string | null
  clients: readonly Legal5Option[]
  clientsLoading: boolean
  groupBy: Legal5GroupBy | null
  labels: Legal5Labels
  left: ReactNode
  loading: boolean
  mode: Legal5Mode
  onArchivedFilterChange?: (archived: Legal5Archived | null) => void
  onClientFilterChange: (clientId: string | null) => void
  onCreate?: () => void
  onGroupByChange?: (groupBy: Legal5GroupBy | null) => void
  onModeChange: (mode: Legal5Mode) => void
  onOwnerFilterChange: (ownerId: string | null) => void
  onPhaseFilterChange: (phaseIds: string[]) => void
  onPoleFilterChange?: (pole: Legal5Pole | null) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSituationFilterChange?: (situation: Legal5Situation | null) => void
  onSortChange?: (sort: Legal5Sort | null) => void
  onTagFilterChange: (tagIds: string[]) => void
  ownerFilter: string | null
  owners: readonly Legal5Person[]
  ownersLoading: boolean
  phaseFilter: readonly string[]
  phases: readonly Legal5Phase[]
  phasesLoading: boolean
  poleFilter: Legal5Pole | null
  search: string
  showLawsuitFilters: boolean
  situationFilter: Legal5Situation | null
  sort: Legal5Sort | null
  tagFilter: readonly string[]
  tags: readonly Legal5Option[]
  tagsLoading: boolean
}

const optionsOf = (items: readonly Legal5Option[]) =>
  items.map((item) => [item.id, item.label] as const)

const phaseOptionsOf = (phases: readonly Legal5Phase[]) => {
  const groups = new Map<string, FilterCheckboxOption[]>()
  const options: (FilterCheckboxOption | FilterCheckboxGroup)[] = []
  for (const phase of phases) {
    const option = [phase.id, phase.label] as const
    if (!phase.group) {
      options.push(option)
      continue
    }
    const group = groups.get(phase.group)
    if (group) {
      group.push(option)
      continue
    }
    const groupOptions: FilterCheckboxOption[] = [option]
    groups.set(phase.group, groupOptions)
    options.push({ label: phase.group, options: groupOptions })
  }
  return options
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Legal5Toolbar({
  archivedFilter,
  clientFilter,
  clients,
  clientsLoading,
  groupBy,
  labels,
  left,
  loading,
  mode,
  onArchivedFilterChange,
  onClientFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onOwnerFilterChange,
  onPhaseFilterChange,
  onPoleFilterChange,
  onSavePreference,
  onSearchChange,
  onSituationFilterChange,
  onSortChange,
  onTagFilterChange,
  ownerFilter,
  owners,
  ownersLoading,
  phaseFilter,
  phases,
  phasesLoading,
  poleFilter,
  search,
  showLawsuitFilters,
  situationFilter,
  sort,
  tagFilter,
  tags,
  tagsLoading,
}: Readonly<Legal5ToolbarProps>) {
  const showSearch = Boolean(onSearchChange)
  const showPhase = phases.length > 0 || phasesLoading
  const showOwner = owners.length > 0 || ownersLoading
  const showClient = clients.length > 0 || clientsLoading
  const showTags = tags.length > 0 || tagsLoading
  const showPole = Boolean(onPoleFilterChange) && showLawsuitFilters
  const showSituation = Boolean(onSituationFilterChange) && showLawsuitFilters
  const showArchived = Boolean(onArchivedFilterChange) && showLawsuitFilters
  const situationValue =
    situationFilter && situationFilter !== 'active' ? situationFilter : ''
  const archivedValue =
    archivedFilter && archivedFilter !== 'exclude' ? archivedFilter : ''
  const hasFilters =
    showPhase ||
    showOwner ||
    showClient ||
    showTags ||
    showPole ||
    showSituation ||
    showArchived

  const activeFilterCount =
    (showSearch && search.trim() ? 1 : 0) +
    (showPhase && phaseFilter.length > 0 ? 1 : 0) +
    (showOwner && ownerFilter ? 1 : 0) +
    (showClient && clientFilter ? 1 : 0) +
    (showTags && tagFilter.length > 0 ? 1 : 0) +
    (showPole && poleFilter ? 1 : 0) +
    (showSituation && situationValue ? 1 : 0) +
    (showArchived && archivedValue ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar<Legal5Mode>
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
      modes={legal5Modes}
      onClearFilters={() => {
        if (showSearch && search) onSearchChange?.('')
        if (showPhase) onPhaseFilterChange([])
        if (showOwner) onOwnerFilterChange(null)
        if (showClient) onClientFilterChange(null)
        if (showTags) onTagFilterChange([])
        if (showPole) onPoleFilterChange?.(null)
        if (showSituation) onSituationFilterChange?.(null)
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
      {onSortChange ? (
        <ViewSettingsSection label={labels.sort}>
          <FilterRadioSubmenu
            clearLabel={labels.defaultSort}
            icon={ArrowsDownUpIcon}
            label={labels.sortBy}
            onValueChange={(value) => onSortChange(pick(legal5Sorts, value))}
            options={legal5Sorts.map(
              (item) => [item, labels.sorts[item]] as const,
            )}
            value={sort ?? ''}
          />
        </ViewSettingsSection>
      ) : null}
      {onSortChange && onGroupByChange ? <MenuSeparator /> : null}
      {onGroupByChange ? (
        <ViewSettingsSection label={labels.group}>
          <FilterRadioSubmenu
            clearLabel={labels.noGrouping}
            icon={ListBulletsIcon}
            label={labels.groupBy}
            onValueChange={(value) =>
              onGroupByChange(pick(legal5Groupings, value))
            }
            options={legal5Groupings.map(
              (item) => [item, labels.groupings[item]] as const,
            )}
            value={groupBy ?? ''}
          />
        </ViewSettingsSection>
      ) : null}
      {(onSortChange || onGroupByChange) && hasFilters ? (
        <MenuSeparator />
      ) : null}
      {hasFilters ? (
        <ViewSettingsSection label={labels.filters}>
          {showPhase ? (
            <FilterCheckboxSubmenu
              clearLabel={labels.allPhases}
              icon={SignpostIcon}
              label={labels.columns.phase}
              loading={phasesLoading}
              onValueChange={onPhaseFilterChange}
              options={phaseOptionsOf(phases)}
              value={phaseFilter}
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
          {showPole ? (
            <FilterRadioSubmenu
              clearLabel={labels.allPoles}
              icon={ScalesIcon}
              label={labels.pole}
              onValueChange={(value) =>
                onPoleFilterChange?.(pick(legal5Poles, value))
              }
              options={legal5Poles.map(
                (item) => [item, labels.poles[item]] as const,
              )}
              value={poleFilter ?? ''}
            />
          ) : null}
          {showClient ? (
            <FilterRadioSubmenu
              clearLabel={labels.allClients}
              icon={UsersIcon}
              label={labels.client}
              loading={clientsLoading}
              onValueChange={(value) => onClientFilterChange(value || null)}
              options={optionsOf(clients)}
              value={clientFilter ?? ''}
            />
          ) : null}
          {showSituation ? (
            <FilterRadioSubmenu
              clearLabel={labels.situations.active}
              icon={ArchiveIcon}
              label={labels.situation}
              onValueChange={(value) =>
                onSituationFilterChange?.(pick(legal5SituationChoices, value))
              }
              options={legal5SituationChoices.map(
                (item) => [item, labels.situations[item]] as const,
              )}
              value={situationValue}
            />
          ) : null}
          {showArchived ? (
            <FilterRadioSubmenu
              clearLabel={labels.archivedOptions.exclude}
              icon={BoxArrowUpIcon}
              label={labels.archivedFilter}
              onValueChange={(value) =>
                onArchivedFilterChange?.(pick(legal5ArchivedChoices, value))
              }
              options={legal5ArchivedChoices.map(
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
              onValueChange={onTagFilterChange}
              options={optionsOf(tags)}
              value={tagFilter}
            />
          ) : null}
        </ViewSettingsSection>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
