import type { SettingsCatalog8Account } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-8'

export const settingsCatalog8Accounts: SettingsCatalog8Account[] = [
  {
    id: 'acc-itau',
    name: 'Itaú corrente',
    openingBalance: 12500.5,
    openingOn: '2026-01-01',
    type: 'bank',
  },
  {
    id: 'acc-nubank',
    name: 'Nubank PJ',
    openingBalance: 3200,
    openingOn: '2026-01-15',
    type: 'bank',
  },
  {
    id: 'acc-caixa',
    name: 'Caixa do escritório',
    openingBalance: 850,
    openingOn: '2026-02-01',
    type: 'cash',
  },
]

export const settingsCatalog8ArchivedAccounts: SettingsCatalog8Account[] = [
  {
    id: 'acc-antigo',
    name: 'Banco antigo',
    openingBalance: 0,
    openingOn: '2025-06-01',
    type: 'bank',
  },
]

export const settingsCatalog8DefaultAccountId = 'acc-itau'
