import type { UseDataGridOptions } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridSettingsLabels,
  GridSort,
} from '../../shared/grid/types'

export type Marketing1Channel =
  | 'display'
  | 'email'
  | 'search'
  | 'social'
  | 'video'

export type Marketing1Status = 'active' | 'ended' | 'learning' | 'paused'

export type Marketing1ToggleColumnId =
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'
  | 'trend'

export type Marketing1ColumnId =
  | Marketing1ToggleColumnId
  | 'actions'
  | 'campaign'

export type Marketing1SortKey =
  | 'campaign'
  | 'conversions'
  | 'cpa'
  | 'newBuyers'
  | 'roas'
  | 'spend'
  | 'status'

export type Marketing1DeltaDirection = 'down' | 'flat' | 'up'

export interface Marketing1Campaign {
  budget: number
  channel: Marketing1Channel
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
  status: Marketing1Status
  trend: number[]
}

export type Marketing1Density = NonNullable<
  UseDataGridOptions<Marketing1Campaign>['density']
>

export interface Marketing1Summary {
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

export interface Marketing1Period {
  from: string
  to: string
}

export interface Marketing1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Marketing1Sort = GridSort<Marketing1SortKey>

export type Marketing1ColumnVisibility =
  GridColumnVisibility<Marketing1ToggleColumnId>

export interface Marketing1Labels extends GridLoadLabels, GridSettingsLabels {
  channels: Record<Marketing1Channel, string>
  clearFilters: string
  columns: Record<Marketing1ColumnId, string>
  columnsMenu: string
  create: string
  ctr: (percent: string) => string
  delta: (direction: Marketing1DeltaDirection, favorable: boolean) => string
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
  statuses: Record<Marketing1Status, string>
  subtitle: (total: number, active: number, period: string) => string
  title: string
  toolbar: string
  trendSummary: (from: string, to: string) => string
}

export type Marketing1LabelsOverride = Partial<
  Omit<Marketing1Labels, 'channels' | 'columns' | 'densities' | 'statuses'>
> & {
  channels?: Partial<Marketing1Labels['channels']>
  columns?: Partial<Marketing1Labels['columns']>
  densities?: Partial<Marketing1Labels['densities']>
  statuses?: Partial<Marketing1Labels['statuses']>
}

export interface Marketing1Props extends GridFormatProps, GridLoadProps {
  campaigns: Marketing1Campaign[]
  className?: string
  columnVisibility?: Marketing1ColumnVisibility
  density?: Marketing1Density
  labels?: Marketing1LabelsOverride
  onColumnVisibilityChange?: (visibility: Marketing1ColumnVisibility) => void
  onCreate?: () => void
  onDensityChange?: (density: Marketing1Density) => void
  onExport?: () => void
  onRowAction?: (actionId: string, campaignId: string) => void
  onSortChange?: (sort: Marketing1Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  period: Marketing1Period
  rowActions?: Marketing1RowAction[]
  sort?: Marketing1Sort | null
  summary: Marketing1Summary
}
