import { ArrowsDownUpIcon, BankIcon, ScalesIcon } from '@phosphor-icons/react'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import {
  legal7LawsuitFilters,
  legal7Modes,
  legal7Sorts,
} from './legal-7-options'
import type {
  Legal7Labels,
  Legal7LawsuitFilter,
  Legal7Mode,
  Legal7Sort,
} from './types'

export interface Legal7ToolbarProps {
  labels: Legal7Labels
  lawsuitFilter: Legal7LawsuitFilter | null
  left?: ReactNode
  loading: boolean
  mode: Legal7Mode
  onLawsuitFilterChange: (filter: Legal7LawsuitFilter | null) => void
  onModeChange: (mode: Legal7Mode) => void
  onSavePreference?: () => void
  onSortChange: (sort: Legal7Sort) => void
  onTribunalFilterChange: (tribunal: string | null) => void
  sort: Legal7Sort
  tribunalFilter: string | null
  tribunals: readonly string[]
  tribunalsLoading: boolean
}

export function Legal7Toolbar({
  labels,
  lawsuitFilter,
  left,
  loading,
  mode,
  onLawsuitFilterChange,
  onModeChange,
  onSavePreference,
  onSortChange,
  onTribunalFilterChange,
  sort,
  tribunalFilter,
  tribunals,
  tribunalsLoading,
}: Readonly<Legal7ToolbarProps>) {
  const tribunalOptions = [
    ...new Set([...tribunals, ...(tribunalFilter ? [tribunalFilter] : [])]),
  ].map((name) => [name, name] as const)

  return (
    <DataCollectionSettingsToolbar<Legal7Mode>
      activeFilterCount={(lawsuitFilter ? 1 : 0) + (tribunalFilter ? 1 : 0)}
      labels={labels}
      left={left}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={legal7Modes}
      onClearFilters={() => {
        onLawsuitFilterChange(null)
        onTribunalFilterChange(null)
      }}
      onModeChange={onModeChange}
      onSavePreference={onSavePreference}
      savePreferenceLabel={labels.savePreference}
    >
      <ViewSettingsSection label={labels.sort}>
        <SortRadioSubmenu
          icon={ArrowsDownUpIcon}
          label={labels.sortBy}
          onValueChange={onSortChange}
          options={legal7Sorts.map(
            (item) => [item, labels.sorts[item]] as const,
          )}
          value={sort}
        />
      </ViewSettingsSection>
      <ViewSettingsSection label={labels.filters}>
        <FilterRadioSubmenu
          clearLabel={labels.allLawsuits}
          icon={ScalesIcon}
          label={labels.lawsuit}
          onValueChange={(value) =>
            onLawsuitFilterChange(
              legal7LawsuitFilters.find((item) => item === value) ?? null,
            )
          }
          options={legal7LawsuitFilters.map(
            (item) => [item, labels.lawsuitFilters[item]] as const,
          )}
          value={lawsuitFilter ?? ''}
        />
        <FilterRadioSubmenu
          clearLabel={labels.allTribunals}
          icon={BankIcon}
          label={labels.tribunal}
          loading={tribunalsLoading}
          onValueChange={(value) => onTribunalFilterChange(value || null)}
          options={tribunalOptions}
          value={tribunalFilter ?? ''}
        />
      </ViewSettingsSection>
    </DataCollectionSettingsToolbar>
  )
}
