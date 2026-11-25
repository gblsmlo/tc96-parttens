import type { UseDataTableOptions } from '@tc96/ui/patterns/data-table/use-data-table'
import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TableSettingsLabels,
  TableSort,
} from '../../shared/table/types'

export type Marketing2Channel =
  | 'display'
  | 'email'
  | 'search'
  | 'social'
  | 'video'

export type Marketing2Status = 'active' | 'ended' | 'learning' | 'paused'

export type Marketing2ToggleColumnId =
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'
  | 'trend'

export type Marketing2ColumnId =
  | Marketing2ToggleColumnId
  | 'actions'
  | 'campaign'

export type Marketing2SortKey =
  | 'campaign'
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'

export type Marketing2DeltaDirection = 'down' | 'flat' | 'up'

export interface Marketing2Campaign {
  budget: number
  channel: Marketing2Channel
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
  status: Marketing2Status
  trend: number[]
}

export type Marketing2Density = NonNullable<
  UseDataTableOptions<Marketing2Campaign>['density']
>

export interface Marketing2Summary {
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

export interface Marketing2Period {
  from: string
  to: string
}

export interface Marketing2RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Marketing2Sort = TableSort<Marketing2SortKey>

export type Marketing2ColumnVisibility =
  TableColumnVisibility<Marketing2ToggleColumnId>

export interface Marketing2Labels extends TableLoadLabels, TableSettingsLabels {
  channels: Record<Marketing2Channel, string>
  clearFilters: string
  columns: Record<Marketing2ColumnId, string>
  columnsMenu: string
  create: string
  ctr: (percent: string) => string
  delta: (direction: Marketing2DeltaDirection, favorable: boolean) => string
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
  statuses: Record<Marketing2Status, string>
  subtitle: (total: number, active: number, period: string) => string
  title: string
  toolbar: string
  trendSummary: (from: string, to: string) => string
}

export type Marketing2LabelsOverride = Partial<
  Omit<Marketing2Labels, 'channels' | 'columns' | 'densities' | 'statuses'>
> & {
  channels?: Partial<Marketing2Labels['channels']>
  columns?: Partial<Marketing2Labels['columns']>
  densities?: Partial<Marketing2Labels['densities']>
  statuses?: Partial<Marketing2Labels['statuses']>
}

export interface Marketing2Props extends TableFormatProps, TableLoadProps {
  campaigns: Marketing2Campaign[]
  className?: string
  columnVisibility?: Marketing2ColumnVisibility
  density?: Marketing2Density
  labels?: Marketing2LabelsOverride
  onColumnVisibilityChange?: (visibility: Marketing2ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: Marketing2Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, campaignId: string) => void
  onSortChange?: (sort: Marketing2Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  period: Marketing2Period
  rowActions?: Marketing2RowAction[]
  sort?: Marketing2Sort | null
  summary: Marketing2Summary
}
