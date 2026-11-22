import type { PersonPropertyOption } from '@tc96/parttens'

export type ExamplePerson = 'ana' | 'gabriel' | 'marina'

export const personOptions: PersonPropertyOption<ExamplePerson>[] = [
  {
    fallback: 'AM',
    label: 'Ana Martins',
    supportingLabel: 'Operações',
    value: 'ana',
  },
  {
    fallback: 'GM',
    label: 'Gabriel Melo',
    supportingLabel: 'Dono',
    value: 'gabriel',
  },
  {
    fallback: 'MS',
    label: 'Marina Souza',
    supportingLabel: 'Vendas',
    value: 'marina',
  },
]

const portrait = (background: string, initials: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${background}"/><text x="24" y="31" font-family="sans-serif" font-size="20" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`,
  )}`

export const lawFirmOptions: PersonPropertyOption[] = [
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
]
