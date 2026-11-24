import type { Card4Meeting } from '@tc96/ui/blocks/application/card/card-4'

export const meetings: Card4Meeting[] = [
  {
    attendees: [
      { id: 'ana', label: 'Ana Souza' },
      { id: 'bruno', label: 'Bruno Lima' },
      { id: 'carla', label: 'Carla Dias' },
      { id: 'diego', label: 'Diego Reis' },
      { id: 'elisa', label: 'Elisa Prado' },
      { id: 'fabio', label: 'Fábio Nunes' },
    ],
    duration: '45 min',
    id: 'planning',
    timeRange: '09:00 - 09:45',
    title: 'Planejamento da sprint',
  },
  {
    attendees: [
      { id: 'ana', label: 'Ana Souza' },
      { id: 'gabi', label: 'Gabriela Melo' },
    ],
    duration: '30 min',
    id: 'one-on-one',
    timeRange: '11:00 - 11:30',
    title: 'Conversa individual',
  },
  {
    attendees: [
      { id: 'bruno', label: 'Bruno Lima' },
      { id: 'carla', label: 'Carla Dias' },
      { id: 'hugo', label: 'Hugo Matos' },
    ],
    duration: '1 h',
    id: 'review',
    timeRange: '15:00 - 16:00',
    title: 'Revisão de design',
  },
]
