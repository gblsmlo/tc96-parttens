import type {
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
} from '../shared/types'

export type DataGrid6Health = 'atRisk' | 'healthy' | 'watch'

export type DataGrid6Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type DataGrid6ToggleColumnId =
  | 'arr'
  | 'health'
  | 'nrr'
  | 'owner'
  | 'renewal'

export type DataGrid6ColumnId = DataGrid6ToggleColumnId | 'account' | 'actions'

export type DataGrid6Person = GridPerson

export interface DataGrid6Region {
  description: string
  id: string
  label: string
}

export interface DataGrid6Account {
  arr: number
  health: DataGrid6Health
  id: string
  name: string
  nrr: number
  owner: DataGrid6Person
  regionId: string
  renewal: string
}

export interface DataGrid6Summary {
  atRiskArr: number
  portfolioNrr: number
  totalArr: number
}

export interface DataGrid6RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface DataGrid6Labels extends GridLoadLabels {
  allOptions: string
  atRiskArr: string
  clearFilters: string
  collapseAll: string
  columns: Record<DataGrid6ColumnId, string>
  columnsMenu: string
  densities: Record<DataGrid6Density, string>
  density: string
  description: string
  display: string
  empty: string
  expandAll: string
  export: string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  groupToggle: (region: string, collapsed: boolean) => string
  health: Record<DataGrid6Health, string>
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

export type DataGrid6LabelsOverride = Partial<
  Omit<DataGrid6Labels, 'columns' | 'densities' | 'health'>
> & {
  densities?: Partial<DataGrid6Labels['densities']>
  columns?: Partial<DataGrid6Labels['columns']>
  health?: Partial<DataGrid6Labels['health']>
}

export interface DataGrid6Props extends GridFormatProps, GridLoadProps {
  accounts: DataGrid6Account[]
  className?: string
  collapsedRegionIds?: readonly string[]
  density?: DataGrid6Density
  labels?: DataGrid6LabelsOverride
  onCollapsedRegionIdsChange?: (regionIds: readonly string[]) => void
  onDensityChange?: (density: DataGrid6Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, accountId: string) => void
  regions: DataGrid6Region[]
  rowActions?: DataGrid6RowAction[]
  summary?: DataGrid6Summary
}
