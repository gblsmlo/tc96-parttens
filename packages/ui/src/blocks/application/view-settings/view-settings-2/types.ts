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

export type ViewSettings2Labels = ViewSettingsBlockLabels

export interface ViewSettings2Props<
  TMode extends string = string,
  TSort extends string = string,
> extends ViewSettingsBaseProps,
    ViewSettingsDisplayProps<TSort>,
    ViewSettingsFiltersProps,
    ViewSettingsFooterProps,
    ViewSettingsModesProps<TMode> {}
