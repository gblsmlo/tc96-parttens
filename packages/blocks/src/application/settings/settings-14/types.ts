import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export type Settings14AccountType = 'bank' | 'cash'

export interface Settings14Account {
  id: string
  name: string
  openingBalance: number
  openingOn: string
  type: Settings14AccountType
}

export interface Settings14Labels extends SettingsLoadLabels {
  accountType: (type: Settings14AccountType) => string
  actions: (name: string) => string
  archive: string
  archived: string
  default: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  makeDefault: string
  newAccount: string
  opening: (type: string, balance: string, date: string) => string
  restore: string
  title: string
}

export type Settings14Action = 'edit' | 'make-default' | 'archive' | 'restore'

export interface Settings14Props extends SettingsLoadProps {
  accounts: Settings14Account[]
  archivedAccounts?: Settings14Account[]
  className?: string
  currency?: string
  defaultAccountId?: string
  labels?: Partial<Settings14Labels>
  locale?: string
  onAccountAction?: (accountId: string, action: Settings14Action) => void
  onCreate?: () => void
}
