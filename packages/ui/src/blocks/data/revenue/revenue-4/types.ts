import type {
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
} from '../../shared/table/types'

export type Revenue4Health = 'atRisk' | 'healthy' | 'watch'

export type Revenue4Density =
  | 'compact'
  | 'extra-tall'
  | 'medium'
  | 'short'
  | 'tall'

export type Revenue4ToggleColumnId =
  | 'arr'
  | 'health'
  | 'nrr'
  | 'owner'
  | 'renewal'

export type Revenue4ColumnId = Revenue4ToggleColumnId | 'account' | 'actions'

export type Revenue4Person = TablePerson

export interface Revenue4Region {
  description: string
  id: string
  label: string
}

export interface Revenue4Account {
  arr: number
  health: Revenue4Health
  id: string
  name: string
  nrr: number
  owner: Revenue4Person
  regionId: string
  renewal: string
}

export interface Revenue4Summary {
  atRiskArr: number
  portfolioNrr: number
  totalArr: number
}

export interface Revenue4RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Revenue4Labels extends TableLoadLabels {
  allOptions: string
  atRiskArr: string
  clearFilters: string
  collapseAll: string
  columns: Record<Revenue4ColumnId, string>
  columnsMenu: string
  densities: Record<Revenue4Density, string>
  density: string
  description: string
  display: string
  empty: string
  expandAll: string
  export: string
  filters: string
  filtersTrigger: (label: string, activeFilters: number) => string
  groupToggle: (region: string, collapsed: boolean) => string
  health: Record<Revenue4Health, string>
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

export type Revenue4LabelsOverride = Partial<
  Omit<Revenue4Labels, 'columns' | 'densities' | 'health'>
> & {
  densities?: Partial<Revenue4Labels['densities']>
  columns?: Partial<Revenue4Labels['columns']>
  health?: Partial<Revenue4Labels['health']>
}

export interface Revenue4Props extends TableFormatProps, TableLoadProps {
  accounts: Revenue4Account[]
  className?: string
  collapsedRegionIds?: readonly string[]
  density?: Revenue4Density
  labels?: Revenue4LabelsOverride
  onCollapsedRegionIdsChange?: (regionIds: readonly string[]) => void
  onDensityChange?: (density: Revenue4Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, accountId: string) => void
  regions: Revenue4Region[]
  rowActions?: Revenue4RowAction[]
  summary?: Revenue4Summary
}
