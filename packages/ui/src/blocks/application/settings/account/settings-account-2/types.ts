import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsAccount2Plan {
  name: string
  price: number
  renewsOn: string
}

export interface SettingsAccount2Usage {
  id: string
  label: string
  limit: number
  unit?: string
  used: number
}

export type SettingsAccount2InvoiceStatus = 'paid' | 'pending' | 'failed'

export interface SettingsAccount2Invoice {
  amount: number
  date: string
  id: string
  status: SettingsAccount2InvoiceStatus
}

export interface SettingsAccount2Labels extends SettingsLoadLabels {
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
  statuses: Record<SettingsAccount2InvoiceStatus, string>
  title: string
  usage: (used: number, limit: number, unit?: string) => string
  usageTitle: string
}

export interface SettingsAccount2Props extends SettingsLoadProps {
  className?: string
  currency?: string
  invoices: SettingsAccount2Invoice[]
  labels?: Partial<SettingsAccount2Labels>
  locale?: string
  onChangePlan?: () => void
  onDownload?: (invoiceId: string) => void
  plan: SettingsAccount2Plan
  usage: SettingsAccount2Usage[]
}
