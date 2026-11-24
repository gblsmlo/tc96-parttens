import type { Settings15Category } from '@tc96/ui/blocks/application/settings/settings-15'

export const settings15Categories: Settings15Category[] = [
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

export const settings15ArchivedCategories: Settings15Category[] = [
  {
    direction: 'expense',
    entries: 0,
    id: 'cat-viagens',
    name: 'Viagens antigas',
  },
]
