import type { PeoplePropertyOption } from '@tc96/ui/patterns'

export const peopleOptions: PeoplePropertyOption[] = [
  { label: 'Bruno Lima', supportingLabel: 'Vendas', value: 'person-1' },
  { label: 'Ana Souza', supportingLabel: 'Operações', value: 'person-2' },
  { label: 'Carla Dias', supportingLabel: 'Jurídico', value: 'person-3' },
]

export const peopleOptionLabels = Object.fromEntries(
  peopleOptions.map((option) => [option.value, option.label]),
)

const portrait = (background: string, initials: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${background}"/><text x="24" y="31" font-family="sans-serif" font-size="20" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`,
  )}`

export const teamOptions: PeoplePropertyOption[] = [
  {
    imageUrl: portrait('#1d4ed8', 'MR'),
    label: 'Marina Rocha',
    supportingLabel: 'Advogada',
    value: 'marina',
  },
  {
    imageUrl: portrait('#047857', 'TF'),
    label: 'Tiago Fernandes',
    supportingLabel: 'Estagiário',
    value: 'tiago',
  },
  { label: 'Paula Nunes', supportingLabel: 'Sócia', value: 'paula' },
  { label: 'Rafael Costa', supportingLabel: 'Financeiro', value: 'rafael' },
]
