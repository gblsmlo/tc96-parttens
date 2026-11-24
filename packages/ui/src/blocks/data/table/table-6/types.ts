import type {
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
} from '../shared/types'

export type Table6Health = 'atRisk' | 'healthy' | 'watch'

export type Table6Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type Table6ToggleColumnId =
  | 'arr'
  | 'health'
  | 'nrr'
  | 'owner'
  | 'renewal'

export type Table6ColumnId = Table6ToggleColumnId | 'account' | 'actions'

export type Table6Person = TablePerson

export interface Table6Region {
  description: string
  id: string
  label: string
}

export interface Table6Account {
  arr: number
  health: Table6Health
  id: string
  name: string
  nrr: number
  owner: Table6Person
  regionId: string
  renewal: string
}

export interface Table6Summary {
  atRiskArr: number
  portfolioNrr: number
  totalArr: number
}

export interface Table6RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Table6Labels extends TableLoadLabels {
  allOptions: string
  atRiskArr: string
  clearFilters: string
  collapseAll: string
  columns: Record<Table6ColumnId, string>
  columnsMenu: string
  densities: Record<Table6Density, string>
  density: string
  description: string
  display: string
  empty: string
  expandAll: string
  export: string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  groupToggle: (region: string, collapsed: boolean) => string
  health: Record<Table6Health, string>
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

export type Table6LabelsOverride = Partial<
  Omit<Table6Labels, 'columns' | 'densities' | 'health'>
> & {
  densities?: Partial<Table6Labels['densities']>
  columns?: Partial<Table6Labels['columns']>
  health?: Partial<Table6Labels['health']>
}

export interface Table6Props extends TableFormatProps, TableLoadProps {
  accounts: Table6Account[]
  className?: string
  collapsedRegionIds?: readonly string[]
  density?: Table6Density
  labels?: Table6LabelsOverride
  onCollapsedRegionIdsChange?: (regionIds: readonly string[]) => void
  onDensityChange?: (density: Table6Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, accountId: string) => void
  regions: Table6Region[]
  rowActions?: Table6RowAction[]
  summary?: Table6Summary
}
