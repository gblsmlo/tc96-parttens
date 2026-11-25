export interface CalendarSample {
  completed: boolean
  end: string | null
  id: string
  isAllDay: boolean
  start: string
  title: string
}

const timed = (
  id: string,
  title: string,
  start: string,
  end: string | null,
): CalendarSample => ({
  completed: false,
  end,
  id,
  isAllDay: false,
  start,
  title,
})

export const calendarSamples: readonly CalendarSample[] = [
  timed(
    'kickoff',
    'Kickoff do trimestre',
    '2026-08-10T12:00:00.000Z',
    '2026-08-10T13:30:00.000Z',
  ),
  timed(
    'pipeline',
    'Revisão do pipeline',
    '2026-08-11T17:00:00.000Z',
    '2026-08-11T18:00:00.000Z',
  ),
  {
    completed: false,
    end: null,
    id: 'conference',
    isAllDay: true,
    start: '2026-08-12T03:00:00.000Z',
    title: 'Conferência de vendas',
  },
  timed(
    'daily',
    'Daily da equipe',
    '2026-08-12T12:00:00.000Z',
    '2026-08-12T12:15:00.000Z',
  ),
  timed(
    'lunch',
    'Almoço com cliente',
    '2026-08-12T15:00:00.000Z',
    '2026-08-12T16:30:00.000Z',
  ),
  timed(
    'design',
    'Sync de design',
    '2026-08-12T15:30:00.000Z',
    '2026-08-12T16:00:00.000Z',
  ),
  timed('report', 'Entrega do relatório', '2026-08-13T20:00:00.000Z', null),
  timed(
    'planning',
    'Planejamento da sprint',
    '2026-08-14T13:00:00.000Z',
    '2026-08-14T14:30:00.000Z',
  ),
]

export const calendarSamplesWith = ({
  completed,
  empty,
}: Readonly<{ completed: boolean; empty: boolean }>): CalendarSample[] =>
  empty
    ? []
    : calendarSamples.map((sample) =>
        sample.id === 'kickoff' ? { ...sample, completed } : sample,
      )
