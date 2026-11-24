import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings23Plan {
  name: string
  price: number
  renewsOn: string
}

export interface Settings23Usage {
  id: string
  label: string
  limit: number
  unit?: string
  used: number
}

export type Settings23InvoiceStatus = 'paid' | 'pending' | 'failed'

export interface Settings23Invoice {
  amount: number
  date: string
  id: string
  status: Settings23InvoiceStatus
}

export interface Settings23Labels extends SettingsLoadLabels {
  changePlan: string
  columnActions: string
  columnAmount: string
  columnDate: string
  columnStatus: string
  download: (date: string) => string
  emptyDescription: string
  emptyTitle: string
  invoicesDescription: string
  invoicesTitle: string
  perMonth: string
  planTitle: string
  renewsOn: (date: string) => string
  statuses: Record<Settings23InvoiceStatus, string>
  title: string
  usage: (used: number, limit: number, unit?: string) => string
  usageTitle: string
}

export interface Settings23Props extends SettingsLoadProps {
  className?: string
  currency?: string
  invoices: Settings23Invoice[]
  labels?: Partial<Settings23Labels>
  locale?: string
  onChangePlan?: () => void
  onDownload?: (invoiceId: string) => void
  plan: Settings23Plan
  usage: Settings23Usage[]
}
