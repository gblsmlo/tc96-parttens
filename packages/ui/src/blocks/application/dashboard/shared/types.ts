import type { RenderLink } from '@tc96/ui/render-anchor'

export type DashboardTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface DashboardBadgeData {
  label: string
  tone?: DashboardTone
}

export type DashboardValueFormat = 'currency' | 'number' | 'percent'

export type DashboardTrend = 'negative' | 'neutral' | 'positive'

export interface DashboardKpi {
  delta?: number
  format?: DashboardValueFormat
  id: string
  label: string
  sparkline?: number[]
  trend?: DashboardTrend
  value: number
}

export interface DashboardFormatProps {
  currency?: string
  locale?: string
}

export interface DashboardBreadcrumbItem {
  href?: string
  label: string
}

export interface DashboardOption {
  label: string
  value: string
}

export interface DashboardFilterOption extends DashboardOption {
  count?: number
}

export interface DashboardRowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface DashboardPagination {
  page: number
  pageCount: number
}

export interface DashboardHeaderProps {
  breadcrumbs?: DashboardBreadcrumbItem[]
  onExport?: () => void
  onPeriodChange?: (period: string) => void
  period?: string
  periodOptions?: DashboardOption[]
  renderLink?: RenderLink
}

export interface DashboardHeaderLabels {
  breadcrumb: string
  description: string
  export: string
  period: string
  title: string
}

export interface DashboardTableLabels {
  nextPage: string
  pageOf: (page: number, pageCount: number) => string
  pagination: string
  previousPage: string
  search: string
}
