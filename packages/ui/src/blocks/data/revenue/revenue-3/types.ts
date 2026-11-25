import type {
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
} from '../../shared/grid/types'

export type Revenue3Health = 'atRisk' | 'healthy' | 'watch'

export type Revenue3Density =
  | 'compact'
  | 'extra-tall'
  | 'medium'
  | 'short'
  | 'tall'

export type Revenue3ToggleColumnId =
  | 'arr'
  | 'health'
  | 'nrr'
  | 'owner'
  | 'renewal'

export type Revenue3ColumnId = Revenue3ToggleColumnId | 'account' | 'actions'

export type Revenue3Person = GridPerson

export interface Revenue3Region {
  description: string
  id: string
  label: string
}

export interface Revenue3Account {
  arr: number
  health: Revenue3Health
  id: string
  name: string
  nrr: number
  owner: Revenue3Person
  regionId: string
  renewal: string
}

export interface Revenue3Summary {
  atRiskArr: number
  portfolioNrr: number
  totalArr: number
}

export interface Revenue3RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Revenue3Labels extends GridLoadLabels {
  allOptions: string
  atRiskArr: string
  clearFilters: string
  collapseAll: string
  columns: Record<Revenue3ColumnId, string>
  columnsMenu: string
  densities: Record<Revenue3Density, string>
  density: string
  description: string
  display: string
  empty: string
  expandAll: string
  export: string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  groupToggle: (region: string, collapsed: boolean) => string
  health: Record<Revenue3Health, string>
  kpis: string
  nextRenewal: (date: string) => string
  nrrTrend: (direction: 'down' | 'up') => string
  portfolioNrr: string
  rowActionsFor: (account: string) => string
  search: string
  title: string
  toolbar: string
  totalArr: string
}

export type Revenue3LabelsOverride = Partial<
  Omit<Revenue3Labels, 'columns' | 'densities' | 'health'>
> & {
  densities?: Partial<Revenue3Labels['densities']>
  columns?: Partial<Revenue3Labels['columns']>
  health?: Partial<Revenue3Labels['health']>
}

export interface Revenue3Props extends GridFormatProps, GridLoadProps {
  accounts: Revenue3Account[]
  className?: string
  collapsedRegionIds?: readonly string[]
  density?: Revenue3Density
  labels?: Revenue3LabelsOverride
  onCollapsedRegionIdsChange?: (regionIds: readonly string[]) => void
  onDensityChange?: (density: Revenue3Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, accountId: string) => void
  regions: Revenue3Region[]
  rowActions?: Revenue3RowAction[]
  summary?: Revenue3Summary
}
