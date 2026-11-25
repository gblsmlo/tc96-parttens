import type { RenderLink } from '@tc96/ui/render-anchor'
import type {
  DashboardBadgeData,
  DashboardBreadcrumbItem,
  DashboardFilterOption,
  DashboardFormatProps,
  DashboardOption,
  DashboardPagination,
} from '../shared/types'

export type Dashboard7MonthColumn = 'current' | 'forecast' | 'realized'

export interface Dashboard7Projection {
  cents: number
  date: string
}

export interface Dashboard7Balances {
  projections: Dashboard7Projection[]
  realizedCents: number
  scope: string
}

export interface Dashboard7RatioIndicator {
  detail: string
  ratio: number | null
}

export interface Dashboard7DaysIndicator {
  days: number | null
  detail: string
}

export interface Dashboard7TextIndicator {
  detail: string
  text: string | null
}

export interface Dashboard7Indicators {
  cashMargin?: Dashboard7RatioIndicator
  collectionDays?: Dashboard7DaysIndicator
  delinquency?: Dashboard7RatioIndicator
  runway?: Dashboard7TextIndicator
}

export interface Dashboard7CashFlowMonth {
  column: Dashboard7MonthColumn
  inflowCents: number
  month: string
  outflowCents: number
}

export interface Dashboard7CashFlowTotals {
  inflowCents: number
  outflowCents: number
  resultCents: number
}

export interface Dashboard7Receivables {
  openCents: number
  overdueCents: number
  receivedCents: number
  totalCents: number
}

export type Dashboard7CategoryKind = 'expense' | 'income'

export interface Dashboard7Category {
  cents: number
  id: string
  name: string
  share: number
}

export interface Dashboard7AccountBalance {
  cents: number
  href?: string
  id: string
  name: string
}

export interface Dashboard7Entry {
  amountCents: number
  description: string
  dueDate: string
  href?: string
  id: string
  kind: string
  status: DashboardBadgeData
}

export interface Dashboard7ClientMoney {
  heldCents: number
  href?: string
  id: string
  name: string
}

export type Dashboard7GridRowKind = 'line' | 'section' | 'total'

export interface Dashboard7GridRow {
  cells: (number | null)[]
  id: string
  kind: Dashboard7GridRowKind
  label: string
  selectable?: boolean
}

export interface Dashboard7GridMonth {
  column: Dashboard7MonthColumn
  month: string
}

export interface Dashboard7CashFlowGrid {
  months: Dashboard7GridMonth[]
  rows: Dashboard7GridRow[]
}

export interface Dashboard7FlowSummaryItem {
  inflow: string
  month: string
  outflow: string
  forecast: boolean
}

export interface Dashboard7AmountSummaryItem {
  label: string
  value: string
}

export interface Dashboard7Labels {
  account: string
  accountsEmpty: string
  accountsTitle: string
  balancesTitle: string
  breadcrumb: string
  cashFlowEmpty: string
  cashFlowLabel: string
  cashFlowSummary: (items: Dashboard7FlowSummaryItem[]) => string
  cashFlowTitle: string
  cashFlowTooltip: (
    month: string,
    series: string,
    value: string,
    forecast: boolean,
  ) => string
  cashMarginHelp: string
  cashMarginLabel: string
  categoriesEmpty: Record<Dashboard7CategoryKind, string>
  categoriesLabel: Record<Dashboard7CategoryKind, string>
  categoriesSummary: (items: Dashboard7AmountSummaryItem[]) => string
  categoriesTitle: string
  categoryKind: string
  categoryKinds: Record<Dashboard7CategoryKind, string>
  categoryTooltip: (name: string, value: string, share: string) => string
  cellEntries: (row: string, month: string, value: string) => string
  clientMoneyEmpty: string
  clientMoneyTitle: string
  collectionDaysHelp: string
  collectionDaysLabel: string
  columnBalance: string
  columnClient: string
  columnLine: string
  days: (count: number, formatted: string) => string
  delinquencyHelp: string
  delinquencyLabel: string
  description: string
  dueSoonEmpty: string
  dueSoonTitle: string
  emptyDescription: string
  emptyTitle: string
  entryMeta: (kind: string, date: string) => string
  errorDescription: string
  errorTitle: string
  export: string
  forecastSeries: string
  gridEmpty: string
  gridScroll: string
  gridTitle: string
  inflowSeries: string
  indicatorsTitle: string
  loading: string
  monthColumns: Record<Dashboard7MonthColumn, string>
  nextPage: string
  noData: string
  outflowSeries: string
  pageOf: (page: number, pageCount: number) => string
  pagination: string
  period: string
  previousPage: string
  projectedBalance: (date: string) => string
  projectedHelp: string
  realizedBalance: string
  realizedHelp: string
  receivablesLabel: string
  receivablesStates: Record<'open' | 'overdue' | 'received', string>
  receivablesSummary: (items: Dashboard7AmountSummaryItem[]) => string
  receivablesTitle: string
  receivablesTotal: string
  receivablesTooltip: (label: string, value: string) => string
  resultLabel: string
  retry: string
  runwayHelp: string
  runwayLabel: string
  seriesLegend: string
  title: string
}

export interface Dashboard7Props extends DashboardFormatProps {
  account?: string
  accountBalances?: Dashboard7AccountBalance[]
  accountOptions?: DashboardFilterOption[]
  balances?: Dashboard7Balances
  breadcrumbs?: DashboardBreadcrumbItem[]
  cashFlow: Dashboard7CashFlowMonth[]
  cashFlowGrid?: Dashboard7CashFlowGrid
  cashFlowTotals?: Dashboard7CashFlowTotals
  categoryKind?: Dashboard7CategoryKind
  className?: string
  clientMoney?: Dashboard7ClientMoney[]
  clientMoneyPagination?: DashboardPagination
  dueSoon: Dashboard7Entry[]
  error?: boolean
  expenseByCategory: Dashboard7Category[]
  incomeByCategory: Dashboard7Category[]
  indicators?: Dashboard7Indicators
  labels?: Partial<Dashboard7Labels>
  onAccountChange?: (account: string) => void
  onCategoryKindChange?: (kind: Dashboard7CategoryKind) => void
  onCellSelect?: (rowId: string, month: string) => void
  onClientMoneyPageChange?: (page: number) => void
  onPeriodChange?: (period: string) => void
  onRetry?: () => void
  pending?: boolean
  period?: string
  periodOptions?: DashboardOption[]
  receivables?: Dashboard7Receivables
  renderLink?: RenderLink
  timeZone?: string
}
