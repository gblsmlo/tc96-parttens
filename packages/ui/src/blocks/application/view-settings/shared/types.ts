import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import type {
  ViewSettingsFilter,
  ViewSettingsFilterValues,
  ViewSettingsMode,
  ViewSettingsOption,
} from '@tc96/ui/patterns/view-settings/components'
import type { ReactNode } from 'react'

export type ViewSettingsDensity = 'comfortable' | 'compact'

export type {
  ViewSettingsFilter,
  ViewSettingsFilterOption,
  ViewSettingsFilterValues,
} from '@tc96/ui/patterns/view-settings/components'

export interface ViewSettingsBlockLabels {
  clear: string
  comfortable: string
  compact: string
  density: string
  display: string
  filters: string
  reset: string
  save: string
  sort: string
  trigger: string
}

export interface ViewSettingsDisplayProps<TSort extends string = string> {
  density: ViewSettingsDensity
  onDensityChange: (density: ViewSettingsDensity) => void
  onSortChange: (sort: TSort) => void
  sort: TSort
  sortOptions: readonly ViewSettingsOption<TSort>[]
}

export interface ViewSettingsFiltersProps {
  filters: readonly ViewSettingsFilter[]
  filterValues: ViewSettingsFilterValues
  onClearFilters?: () => void
  onFilterValuesChange: (values: ViewSettingsFilterValues) => void
}

export interface ViewSettingsFooterProps {
  onReset?: () => void
  onSavePreference?: () => void
  resetDisabled?: boolean
  savePreferenceDisabled?: boolean
}

export interface ViewSettingsModesProps<TMode extends string = string> {
  mode: TMode
  modes: readonly ViewSettingsMode<TMode>[]
  onModeChange: (mode: TMode) => void
}

export interface ViewSettingsBaseProps {
  className?: string
  labels?: Partial<ViewSettingsBlockLabels>
}
