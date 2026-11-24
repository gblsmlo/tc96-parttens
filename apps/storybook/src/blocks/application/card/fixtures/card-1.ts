import type { Card1Fact } from '@tc96/ui/blocks/application/card/card-1'

export const facts: Card1Fact[] = [
  { id: 'owner', label: 'Responsável', value: 'Marina Costa' },
  {
    accent: { badge: { label: 'Em andamento', tone: 'info' }, kind: 'badge' },
    id: 'status',
    label: 'Status',
    value: 'Implantação',
  },
  {
    accent: {
      kind: 'people',
      people: [
        { id: 'ana', label: 'Ana Souza' },
        { id: 'bruno', label: 'Bruno Lima' },
        { id: 'carla', label: 'Carla Dias' },
        { id: 'diego', label: 'Diego Reis' },
      ],
    },
    id: 'team',
    label: 'Equipe',
    value: '4 pessoas',
  },
  { id: 'deadline', label: 'Prazo', value: '30 de janeiro de 2027' },
]
