import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export type SettingsCatalog8AccountType = 'bank' | 'cash'

export interface SettingsCatalog8Account {
  id: string
  name: string
  openingBalance: number
  openingOn: string
  type: SettingsCatalog8AccountType
}

export interface SettingsCatalog8Labels extends SettingsLoadLabels {
  accountType: (type: SettingsCatalog8AccountType) => string
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

export type SettingsCatalog8Action =
  | 'edit'
  | 'make-default'
  | 'archive'
  | 'restore'

export interface SettingsCatalog8Props extends SettingsLoadProps {
  accounts: SettingsCatalog8Account[]
  archivedAccounts?: SettingsCatalog8Account[]
  className?: string
  currency?: string
  defaultAccountId?: string
  labels?: Partial<SettingsCatalog8Labels>
  locale?: string
  onAccountAction?: (accountId: string, action: SettingsCatalog8Action) => void
  onCreate?: () => void
}
