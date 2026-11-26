import type {
  ViewSettingsBaseProps,
  ViewSettingsBlockLabels,
  ViewSettingsDisplayProps,
  ViewSettingsFiltersProps,
  ViewSettingsFooterProps,
  ViewSettingsModesProps,
} from '../shared/types'

export type {
  ViewSettingsDensity,
  ViewSettingsFilter,
  ViewSettingsFilterOption,
  ViewSettingsFilterValues,
} from '../shared/types'

export type ViewSettings3Labels = ViewSettingsBlockLabels

export interface ViewSettings3Props<
  TMode extends string = string,
  TSort extends string = string,
> extends ViewSettingsBaseProps,
    ViewSettingsDisplayProps<TSort>,
    ViewSettingsFiltersProps,
    ViewSettingsFooterProps,
    ViewSettingsModesProps<TMode> {}
