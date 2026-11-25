import type {
  SettingsAccount2Invoice,
  SettingsAccount2Plan,
  SettingsAccount2Usage,
} from '@tc96/ui/blocks/application/settings/account/settings-account-2'

export const settingsAccount2Plan: SettingsAccount2Plan = {
  name: 'Profissional',
  price: 189.9,
  renewsOn: '15 dez 2026',
}

export const settingsAccount2Usage: SettingsAccount2Usage[] = [
  { id: 'users', label: 'Usuários', limit: 10, unit: 'usuários', used: 7 },
  { id: 'leads', label: 'Leads', limit: 5000, used: 3480 },
  { id: 'storage', label: 'Armazenamento', limit: 50, unit: 'GB', used: 18 },
]

export const settingsAccount2Invoices: SettingsAccount2Invoice[] = [
  { amount: 189.9, date: '15 nov 2026', id: 'inv-2026-11', status: 'paid' },
  { amount: 189.9, date: '15 out 2026', id: 'inv-2026-10', status: 'paid' },
  { amount: 189.9, date: '15 set 2026', id: 'inv-2026-09', status: 'failed' },
  { amount: 189.9, date: '15 dez 2026', id: 'inv-2026-12', status: 'pending' },
]

export interface SettingsAccount2Billing {
  invoices: SettingsAccount2Invoice[]
  plan: SettingsAccount2Plan
  usage: SettingsAccount2Usage[]
}

export const settingsAccount2Billing: SettingsAccount2Billing = {
  invoices: settingsAccount2Invoices,
  plan: settingsAccount2Plan,
  usage: settingsAccount2Usage,
}
