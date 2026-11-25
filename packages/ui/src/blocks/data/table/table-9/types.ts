import type { UseDataTableOptions } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TableSettingsLabels,
  TableSort,
} from '../shared/types'

export type Table9Channel = 'display' | 'email' | 'search' | 'social' | 'video'

export type Table9Status = 'active' | 'ended' | 'learning' | 'paused'

export type Table9ToggleColumnId =
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'
  | 'trend'

export type Table9ColumnId = Table9ToggleColumnId | 'actions' | 'campaign'

export type Table9SortKey =
  | 'campaign'
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'

export type Table9DeltaDirection = 'down' | 'flat' | 'up'

export interface Table9Campaign {
  budget: number
  channel: Table9Channel
  conversions: number
  conversionsDelta: number
  country: string
  cpa: number
  cpaDelta: number
  id: string
  name: string
  newBuyers: number
  objective: string
  roas: number
  roasTarget: number
  spend: number
  status: Table9Status
  trend: number[]
}

export type Table9Density = NonNullable<
  UseDataTableOptions<Table9Campaign>['density']
>

export interface Table9Summary {
  averageCpa: number
  averageCpaDelta: number
  averageRoas: number
  belowTarget: number
  budget: number
  conversions: number
  conversionsDelta: number
  ctr: number
  impressions: number
  roasTarget: number
  spend: number
}

export interface Table9Period {
  from: string
  to: string
}

export interface Table9RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Table9Sort = TableSort<Table9SortKey>

export type Table9ColumnVisibility = TableColumnVisibility<Table9ToggleColumnId>

export interface Table9Labels extends TableLoadLabels, TableSettingsLabels {
  channels: Record<Table9Channel, string>
  clearFilters: string
  columns: Record<Table9ColumnId, string>
  columnsMenu: string
  create: string
  ctr: (percent: string) => string
  delta: (direction: Table9DeltaDirection, favorable: boolean) => string
  density: string
  display: string
  empty: string
  export: string
  filterAll: string
  filters: string
  kpiBelowTarget: string
  kpiConversions: string
  kpiCpa: string
  kpiImpressions: string
  kpiRoas: string
  kpiSpend: string
  kpis: string
  newBuyersShare: (percent: string) => string
  ofBudget: (percent: string) => string
  ofCampaigns: (total: number) => string
  pageSize: string
  period: (from: string, to: string) => string
  roasOfTarget: (value: string, target: string) => string
  roasTarget: (target: string) => string
  rowActionsFor: (campaign: string) => string
  search: string
  settings: string
  sortBy: string
  statuses: Record<Table9Status, string>
  subtitle: (total: number, active: number, period: string) => string
  title: string
  toolbar: string
  trendSummary: (from: string, to: string) => string
}

export type Table9LabelsOverride = Partial<
  Omit<Table9Labels, 'channels' | 'columns' | 'densities' | 'statuses'>
> & {
  channels?: Partial<Table9Labels['channels']>
  columns?: Partial<Table9Labels['columns']>
  densities?: Partial<Table9Labels['densities']>
  statuses?: Partial<Table9Labels['statuses']>
}

export interface Table9Props extends TableFormatProps, TableLoadProps {
  campaigns: Table9Campaign[]
  className?: string
  columnVisibility?: Table9ColumnVisibility
  density?: Table9Density
  labels?: Table9LabelsOverride
  onColumnVisibilityChange?: (visibility: Table9ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: Table9Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, campaignId: string) => void
  onSortChange?: (sort: Table9Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  period: Table9Period
  rowActions?: Table9RowAction[]
  sort?: Table9Sort | null
  summary: Table9Summary
}
