import type {
  ViewSettingsBaseProps,
  ViewSettingsBlockLabels,
  ViewSettingsDisplayProps,
  ViewSettingsFiltersProps,
  ViewSettingsFooterProps,
} from '../shared/types'

export type {
  ViewSettingsDensity,
  ViewSettingsFilter,
  ViewSettingsFilterOption,
  ViewSettingsFilterValues,
} from '../shared/types'

export type ViewSettings1Labels = ViewSettingsBlockLabels

export interface ViewSettings1Props<TSort extends string = string>
  extends ViewSettingsBaseProps,
    ViewSettingsDisplayProps<TSort>,
    ViewSettingsFiltersProps,
    ViewSettingsFooterProps {}
