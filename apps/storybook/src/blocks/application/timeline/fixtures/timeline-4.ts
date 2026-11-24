import type { Timeline4Entry } from '@tc96/blocks/application/timeline/timeline-4'

export const activityEntries: Timeline4Entry[] = [
  {
    actor: { name: 'Marina Souza' },
    badge: { label: 'Aprovado', tone: 'success' },
    id: 'approved',
    time: 'Hoje, 10:42',
    title: 'Marina Souza aprovou o orçamento',
  },
  {
    actor: { name: 'Rafael Lima' },
    id: 'comment',
    time: 'Hoje, 09:15',
    title: 'Rafael Lima comentou na proposta',
  },
  {
    actor: { name: 'Beatriz Alves' },
    badge: { label: 'Revisão', tone: 'warning' },
    id: 'review',
    time: 'Ontem, 17:30',
    title: 'Beatriz Alves pediu uma revisão',
  },
  {
    actor: { name: 'Tiago Nunes' },
    id: 'created',
    time: '12 nov 2026, 08:00',
    title: 'Tiago Nunes criou o registro',
  },
]
