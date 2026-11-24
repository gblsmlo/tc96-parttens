import type {
  Settings23Invoice,
  Settings23Plan,
  Settings23Usage,
} from '@tc96/blocks/application/settings/settings-23'

export const settings23Plan: Settings23Plan = {
  name: 'Profissional',
  price: 189.9,
  renewsOn: '15 dez 2026',
}

export const settings23Usage: Settings23Usage[] = [
  { id: 'users', label: 'Usuários', limit: 10, unit: 'usuários', used: 7 },
  { id: 'leads', label: 'Leads', limit: 5000, used: 3480 },
  { id: 'storage', label: 'Armazenamento', limit: 50, unit: 'GB', used: 18 },
]

export const settings23Invoices: Settings23Invoice[] = [
  { amount: 189.9, date: '15 nov 2026', id: 'inv-2026-11', status: 'paid' },
  { amount: 189.9, date: '15 out 2026', id: 'inv-2026-10', status: 'paid' },
  { amount: 189.9, date: '15 set 2026', id: 'inv-2026-09', status: 'failed' },
  { amount: 189.9, date: '15 dez 2026', id: 'inv-2026-12', status: 'pending' },
]

export interface Settings23Billing {
  invoices: Settings23Invoice[]
  plan: Settings23Plan
  usage: Settings23Usage[]
}

export const settings23Billing: Settings23Billing = {
  invoices: settings23Invoices,
  plan: settings23Plan,
  usage: settings23Usage,
}
