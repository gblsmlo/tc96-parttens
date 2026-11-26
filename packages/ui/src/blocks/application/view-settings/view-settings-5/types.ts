import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import type {
  ViewSettingsMode,
  ViewSettingsOption,
} from '@tc96/ui/patterns/view-settings/components'

export interface ViewSettings5Filter {
  icon: PhosphorIcon
  id: string
  label: string
  options: readonly ViewSettingsOption[]
}

export type ViewSettings5FilterValues = Readonly<Record<string, string | null>>

export interface ViewSettings5Labels {
  activeFilters: (count: number) => string
  clearFilters: string
  filter: string
  filterSection: string
  group: string
  groupSection: string
  layout: string
  layoutSection: string
  sort: string
  sortSection: string
}

export interface ViewSettings5Props<
  TMode extends string = string,
  TSort extends string = string,
  TGroup extends string = string,
> {
  filters?: readonly ViewSettings5Filter[]
  filterValues?: ViewSettings5FilterValues
  groupBy?: TGroup
  groupOptions?: readonly ViewSettingsOption<TGroup>[]
  labels?: Partial<ViewSettings5Labels>
  mode: TMode
  modes: readonly ViewSettingsMode<TMode>[]
  onClearFilters?: () => void
  onFilterValuesChange?: (values: ViewSettings5FilterValues) => void
  onGroupByChange?: (groupBy: TGroup) => void
  onModeChange: (mode: TMode) => void
  onSortChange?: (sort: TSort) => void
  sort?: TSort
  sortOptions?: readonly ViewSettingsOption<TSort>[]
}
