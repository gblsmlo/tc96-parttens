import type { SettingsCatalog9Category } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-9'

export const settingsCatalog9Categories: SettingsCatalog9Category[] = [
  {
    direction: 'income',
    entries: 48,
    id: 'cat-honorarios',
    name: 'Honorários',
    subcategories: [
      {
        direction: 'income',
        entries: 12,
        id: 'cat-honorarios-consultas',
        name: 'Consultas',
      },
    ],
  },
  {
    direction: 'expense',
    entries: 21,
    id: 'cat-custas',
    name: 'Custas processuais',
  },
  {
    direction: 'expense',
    entries: 1,
    id: 'cat-despesas',
    name: 'Despesas administrativas',
    subcategories: [
      {
        direction: 'expense',
        entries: 6,
        id: 'cat-despesas-aluguel',
        name: 'Aluguel',
      },
    ],
  },
]

export const settingsCatalog9ArchivedCategories: SettingsCatalog9Category[] = [
  {
    direction: 'expense',
    entries: 0,
    id: 'cat-viagens',
    name: 'Viagens antigas',
  },
]
