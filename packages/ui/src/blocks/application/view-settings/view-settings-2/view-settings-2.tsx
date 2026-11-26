'use client'

import { MenuSeparator } from '@tc96/ui/menu'
import {
  ViewSettings,
  ViewSettingsFilterSection,
} from '@tc96/ui/patterns/view-settings/components'
import { countActiveFilters, resolveViewSettingsLabels } from '../shared/labels'
import { ViewSettingsDisplaySection } from '../shared/view-settings-display-section'
import type { ViewSettings2Props } from './types'

export function ViewSettings2<TMode extends string, TSort extends string>({
  className,
  density,
  filters,
  filterValues,
  labels: labelOverrides,
  mode,
  modes,
  onClearFilters,
  onDensityChange,
  onFilterValuesChange,
  onModeChange,
  onReset,
  onSavePreference,
  onSortChange,
  resetDisabled,
  savePreferenceDisabled,
  sort,
  sortOptions,
}: Readonly<ViewSettings2Props<TMode, TSort>>) {
  const labels = resolveViewSettingsLabels(labelOverrides)

  return (
    <ViewSettings
      activeFilterCount={countActiveFilters(filterValues)}
      className={className}
      clearLabel={labels.clear}
      label={labels.trigger}
      mode={mode}
      modes={modes}
      onClearFilters={onClearFilters}
      onModeChange={onModeChange}
      onReset={onReset}
      onSavePreference={onSavePreference}
      resetDisabled={resetDisabled}
      resetLabel={labels.reset}
      savePreferenceDisabled={savePreferenceDisabled}
      savePreferenceLabel={labels.save}
    >
      <ViewSettingsDisplaySection
        density={density}
        labels={labels}
        onDensityChange={onDensityChange}
        onSortChange={onSortChange}
        sort={sort}
        sortOptions={sortOptions}
      />
      <MenuSeparator />
      <ViewSettingsFilterSection
        filters={filters}
        filterValues={filterValues}
        label={labels.filters}
        onFilterValuesChange={onFilterValuesChange}
      />
    </ViewSettings>
  )
}
