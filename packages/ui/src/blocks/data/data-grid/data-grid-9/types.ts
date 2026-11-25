import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridSettingsLabels,
  GridSort,
} from '../shared/types'

export type DataGrid9Channel =
  | 'display'
  | 'email'
  | 'search'
  | 'social'
  | 'video'

export type DataGrid9Status = 'active' | 'ended' | 'learning' | 'paused'

export type DataGrid9ToggleColumnId =
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'
  | 'trend'

export type DataGrid9ColumnId = DataGrid9ToggleColumnId | 'actions' | 'campaign'

export type DataGrid9SortKey =
  | 'campaign'
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'

export type DataGrid9DeltaDirection = 'down' | 'flat' | 'up'

export interface DataGrid9Campaign {
  budget: number
  channel: DataGrid9Channel
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
  status: DataGrid9Status
  trend: number[]
}

export type DataGrid9Density = NonNullable<
  UseDataGridOptions<DataGrid9Campaign>['density']
>

export interface DataGrid9Summary {
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

export interface DataGrid9Period {
  from: string
  to: string
}

export interface DataGrid9RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type DataGrid9Sort = GridSort<DataGrid9SortKey>

export type DataGrid9ColumnVisibility =
  GridColumnVisibility<DataGrid9ToggleColumnId>

export interface DataGrid9Labels extends GridLoadLabels, GridSettingsLabels {
  channels: Record<DataGrid9Channel, string>
  clearFilters: string
  columns: Record<DataGrid9ColumnId, string>
  columnsMenu: string
  create: string
  ctr: (percent: string) => string
  delta: (direction: DataGrid9DeltaDirection, favorable: boolean) => string
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
  statuses: Record<DataGrid9Status, string>
  subtitle: (total: number, active: number, period: string) => string
  title: string
  toolbar: string
  trendSummary: (from: string, to: string) => string
}

export type DataGrid9LabelsOverride = Partial<
  Omit<DataGrid9Labels, 'channels' | 'columns' | 'densities' | 'statuses'>
> & {
  channels?: Partial<DataGrid9Labels['channels']>
  columns?: Partial<DataGrid9Labels['columns']>
  densities?: Partial<DataGrid9Labels['densities']>
  statuses?: Partial<DataGrid9Labels['statuses']>
}

export interface DataGrid9Props extends GridFormatProps, GridLoadProps {
  campaigns: DataGrid9Campaign[]
  className?: string
  columnVisibility?: DataGrid9ColumnVisibility
  density?: DataGrid9Density
  labels?: DataGrid9LabelsOverride
  onColumnVisibilityChange?: (visibility: DataGrid9ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: DataGrid9Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, campaignId: string) => void
  onSortChange?: (sort: DataGrid9Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  period: DataGrid9Period
  rowActions?: DataGrid9RowAction[]
  sort?: DataGrid9Sort | null
  summary: DataGrid9Summary
}
