'use client'

import { MenuSeparator } from '@tc96/ui/menu'
import {
  ViewSettings,
  ViewSettingsFilterSection,
} from '@tc96/ui/patterns/view-settings/components'
import { countActiveFilters, resolveViewSettingsLabels } from '../shared/labels'
import { ViewSettingsDisplaySection } from '../shared/view-settings-display-section'
import type { ViewSettings1Props } from './types'

export function ViewSettings1<TSort extends string>({
  className,
  density,
  filters,
  filterValues,
  labels: labelOverrides,
  onClearFilters,
  onDensityChange,
  onFilterValuesChange,
  onReset,
  onSavePreference,
  onSortChange,
  resetDisabled,
  savePreferenceDisabled,
  sort,
  sortOptions,
}: Readonly<ViewSettings1Props<TSort>>) {
  const labels = resolveViewSettingsLabels(labelOverrides)

  return (
    <ViewSettings
      activeFilterCount={countActiveFilters(filterValues)}
      className={className}
      clearLabel={labels.clear}
      label={labels.trigger}
      onClearFilters={onClearFilters}
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
