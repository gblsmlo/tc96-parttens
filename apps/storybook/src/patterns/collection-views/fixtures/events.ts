import type {
  CalendarEventChipTone,
  CollectionDefinition,
} from '@tc96/parttens'

export type EventKind =
  | 'meeting'
  | 'customer'
  | 'focus'
  | 'deadline'
  | 'out-of-office'

export interface ScheduleEvent {
  end: string | null
  id: string
  isAllDay: boolean
  kind: EventKind
  ownerId: string
  start: string
  title: string
}

export const kindOptions = [
  { label: 'Reunião', tone: 'primary', value: 'meeting' },
  { label: 'Cliente', tone: 'success', value: 'customer' },
  { label: 'Foco', tone: 'neutral', value: 'focus' },
  { label: 'Prazo', tone: 'destructive', value: 'deadline' },
  { label: 'Ausência', tone: 'warning', value: 'out-of-office' },
] as const satisfies readonly {
  label: string
  tone: CalendarEventChipTone
  value: EventKind
}[]

export const KIND_TONE = Object.fromEntries(
  kindOptions.map((option) => [option.value, option.tone]),
) as Record<EventKind, CalendarEventChipTone>

const daily = (id: string, day: number): ScheduleEvent => ({
  end: `2026-10-${day}T12:45:00.000Z`,
  id,
  isAllDay: false,
  kind: 'meeting',
  ownerId: 'ana',
  start: `2026-10-${day}T12:30:00.000Z`,
  title: 'Daily da equipe',
})

export const initialEvents: ScheduleEvent[] = [
  {
    end: '2026-10-05T14:30:00.000Z',
    id: 'EVT-300',
    isAllDay: false,
    kind: 'meeting',
    ownerId: 'ana',
    start: '2026-10-05T13:00:00.000Z',
    title: 'Kickoff do trimestre',
  },
  daily('EVT-301', 12),
  daily('EVT-302', 13),
  daily('EVT-303', 14),
  daily('EVT-304', 15),
  daily('EVT-305', 16),
  {
    end: '2026-10-12T18:30:00.000Z',
    id: 'EVT-310',
    isAllDay: false,
    kind: 'meeting',
    ownerId: 'bruno',
    start: '2026-10-12T17:00:00.000Z',
    title: 'Planejamento da sprint',
  },
  {
    end: '2026-10-13T14:00:00.000Z',
    id: 'EVT-311',
    isAllDay: false,
    kind: 'customer',
    ownerId: 'carla',
    start: '2026-10-13T13:00:00.000Z',
    title: 'Demo para Banco Aurora',
  },
  {
    end: '2026-10-14T13:00:00.000Z',
    id: 'EVT-312',
    isAllDay: false,
    kind: 'focus',
    ownerId: 'diego',
    start: '2026-10-14T11:00:00.000Z',
    title: 'Foco: checkout',
  },
  {
    end: '2026-10-14T18:30:00.000Z',
    id: 'EVT-313',
    isAllDay: false,
    kind: 'meeting',
    ownerId: 'ana',
    start: '2026-10-14T18:00:00.000Z',
    title: '1:1 Ana e Bruno',
  },
  {
    end: '2026-10-14T19:00:00.000Z',
    id: 'EVT-314',
    isAllDay: false,
    kind: 'meeting',
    ownerId: 'carla',
    start: '2026-10-14T18:00:00.000Z',
    title: 'Revisão de design',
  },
  {
    end: null,
    id: 'EVT-315',
    isAllDay: false,
    kind: 'deadline',
    ownerId: 'bruno',
    start: '2026-10-15T21:00:00.000Z',
    title: 'Entrega do relatório trimestral',
  },
  {
    end: '2026-10-17T03:00:00.000Z',
    id: 'EVT-316',
    isAllDay: true,
    kind: 'out-of-office',
    ownerId: 'diego',
    start: '2026-10-15T03:00:00.000Z',
    title: 'Férias do Diego',
  },
  {
    end: '2026-10-16T20:00:00.000Z',
    id: 'EVT-317',
    isAllDay: false,
    kind: 'meeting',
    ownerId: 'ana',
    start: '2026-10-16T16:00:00.000Z',
    title: 'Workshop de acessibilidade',
  },
  {
    end: '2026-10-16T20:00:00.000Z',
    id: 'EVT-318',
    isAllDay: false,
    kind: 'meeting',
    ownerId: 'bruno',
    start: '2026-10-16T19:00:00.000Z',
    title: 'Retro da sprint',
  },
  {
    end: '2026-10-20T19:00:00.000Z',
    id: 'EVT-320',
    isAllDay: false,
    kind: 'customer',
    ownerId: 'carla',
    start: '2026-10-20T17:00:00.000Z',
    title: 'Visita à Logística Rápida',
  },
  {
    end: '2026-10-23T03:00:00.000Z',
    id: 'EVT-321',
    isAllDay: true,
    kind: 'deadline',
    ownerId: 'diego',
    start: '2026-10-22T03:00:00.000Z',
    title: 'Code freeze da versão 2.0',
  },
]

export const createEventCollection = (
  items: readonly ScheduleEvent[],
): CollectionDefinition<ScheduleEvent> => ({
  getKey: (event) => event.id,
  getLabel: (event) => event.title,
  groupings: [],
  items,
})
