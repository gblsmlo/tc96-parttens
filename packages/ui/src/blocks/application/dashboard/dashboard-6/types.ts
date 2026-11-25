import type { RenderLink } from '@tc96/ui/render-anchor'
import type {
  DashboardBreadcrumbItem,
  DashboardFormatProps,
  DashboardOption,
} from '../shared/types'

export interface Dashboard6Total {
  count: number
  valueCents: number
}

export interface Dashboard6Stage {
  count: number
  href?: string
  id: string
  name: string
  valueCents: number
}

export interface Dashboard6LossReason {
  count: number
  id: string
  name: string
}

export interface Dashboard6Summary {
  conversion: number | null
  lost: Dashboard6Total
  open: Dashboard6Total
  won: Dashboard6Total
}

export interface Dashboard6CountSummaryItem {
  count: string
  label: string
}

export interface Dashboard6Labels {
  breadcrumb: string
  columnLeads: string
  columnStage: string
  columnValue: string
  conversionDetail: string
  conversionLabel: string
  description: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  export: string
  funnelLabel: string
  funnelSummary: (items: Dashboard6CountSummaryItem[]) => string
  funnelTitle: string
  funnelTotal: string
  indicators: string
  leadCount: (count: number, formatted: string) => string
  loading: string
  lossesEmpty: string
  lossesLabel: string
  lossesSummary: (items: Dashboard6CountSummaryItem[]) => string
  lossesTitle: string
  lostLabel: string
  noConversion: string
  openLabel: string
  period: string
  retry: string
  title: string
  tooltip: (label: string, count: string) => string
  wonLabel: string
}

export interface Dashboard6Props extends DashboardFormatProps {
  breadcrumbs?: DashboardBreadcrumbItem[]
  className?: string
  error?: boolean
  labels?: Partial<Dashboard6Labels>
  lossReasons: Dashboard6LossReason[]
  onPeriodChange?: (period: string) => void
  onRetry?: () => void
  pending?: boolean
  period?: string
  periodOptions?: DashboardOption[]
  renderLink?: RenderLink
  stages: Dashboard6Stage[]
  summary?: Dashboard6Summary
}
