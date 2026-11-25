import type { RenderLink } from '@tc96/ui/render-anchor'
import type {
  DashboardBreadcrumbItem,
  DashboardFormatProps,
} from '../shared/types'

export interface Dashboard5CountMetric {
  count: number
  detail?: string
  href?: string
}

export type Dashboard5CaptureState = 'running' | 'simulated' | 'stopped'

export interface Dashboard5CaptureMetric {
  detail?: string
  href?: string
  state: Dashboard5CaptureState
}

export interface Dashboard5Metrics {
  capture?: Dashboard5CaptureMetric
  dueSoon?: Dashboard5CountMetric
  overdue?: Dashboard5CountMetric
  publications?: Dashboard5CountMetric
}

export type Dashboard5Urgency = 'later' | 'overdue' | 'soon' | 'today'

export interface Dashboard5Deadline {
  daysLeft: string
  fatalDate: string
  href?: string
  id: string
  lawsuitTitle: string
  title: string
  urgency: Dashboard5Urgency
}

export interface Dashboard5Publication {
  availableOn: string
  description: string
  href?: string
  id: string
  title: string
}

export interface Dashboard5Appointment {
  href?: string
  id: string
  recordTitle: string
  startsAt: string
  title: string
}

export interface Dashboard5Queue {
  count: number
  href?: string
  id: string
  label: string
}

export interface Dashboard5DueDay {
  count: number
  date: string
}

export interface Dashboard5Links {
  agenda?: string
  deadlines?: string
  publications?: string
}

export interface Dashboard5CountSummaryItem {
  count: string
  label: string
}

export interface Dashboard5Labels {
  agendaLink: string
  appointmentWhen: (day: string, time: string) => string
  appointmentsEmpty: string
  appointmentsTitle: string
  breadcrumb: string
  captureLabel: string
  captureStates: Record<Dashboard5CaptureState, string>
  decide: string
  deadlinesEmpty: string
  deadlinesLink: string
  deadlinesTitle: string
  description: string
  dueDaysLabel: string
  dueDaysSummary: (items: Dashboard5CountSummaryItem[]) => string
  dueDaysTitle: string
  dueDaysTooltip: (day: string, count: string) => string
  dueSoonLabel: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  export: string
  fatalOn: (lawsuitTitle: string, date: string) => string
  indicators: string
  loading: string
  overdueLabel: string
  period: string
  publicationsEmpty: string
  publicationsLabel: string
  publicationsLink: string
  publicationsTitle: string
  queuesEmpty: string
  queuesLabel: string
  queuesSummary: (items: Dashboard5CountSummaryItem[]) => string
  queuesTitle: string
  queuesTooltip: (label: string, count: string) => string
  retry: string
  title: string
}

export interface Dashboard5Props extends DashboardFormatProps {
  appointments: Dashboard5Appointment[]
  breadcrumbs?: DashboardBreadcrumbItem[]
  className?: string
  deadlines: Dashboard5Deadline[]
  dueDays?: Dashboard5DueDay[]
  error?: boolean
  labels?: Partial<Dashboard5Labels>
  links?: Dashboard5Links
  metrics?: Dashboard5Metrics
  onRetry?: () => void
  pending?: boolean
  publications?: Dashboard5Publication[]
  queues: Dashboard5Queue[]
  renderLink?: RenderLink
  timeZone?: string
}
