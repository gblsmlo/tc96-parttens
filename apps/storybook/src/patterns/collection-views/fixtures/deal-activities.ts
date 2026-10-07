import type {
  CalendarEventChipTone,
  CollectionDefinition,
} from '@tc96/parttens'
import { type Deal, initialDeals, isOpenStage } from './deals'

export type ActivityKind = 'call' | 'meeting' | 'demo' | 'proposal' | 'closing'

export interface DealActivity {
  dealId: string
  end: string | null
  id: string
  isAllDay: boolean
  kind: ActivityKind
  ownerId: string
  start: string
  title: string
}

export const activityKindOptions = [
  { label: 'Ligação', tone: 'neutral', value: 'call' },
  { label: 'Reunião', tone: 'primary', value: 'meeting' },
  { label: 'Demo', tone: 'success', value: 'demo' },
  { label: 'Proposta', tone: 'warning', value: 'proposal' },
  { label: 'Fechamento previsto', tone: 'destructive', value: 'closing' },
] as const satisfies readonly {
  label: string
  tone: CalendarEventChipTone
  value: ActivityKind
}[]

export const ACTIVITY_TONE = Object.fromEntries(
  activityKindOptions.map((option) => [option.value, option.tone]),
) as Record<ActivityKind, CalendarEventChipTone>

const dealsById = new Map(initialDeals.map((deal) => [deal.id, deal]))

const activity = (
  id: string,
  dealId: string,
  kind: ActivityKind,
  subject: string,
  start: string,
  end: string,
): DealActivity => {
  const deal = dealsById.get(dealId) as Deal
  return {
    dealId,
    end,
    id,
    isAllDay: false,
    kind,
    ownerId: deal.ownerId,
    start,
    title: `${subject} · ${deal.company}`,
  }
}

const nextDay = (date: string) => {
  const day = new Date(`${date}T03:00:00.000Z`)
  day.setUTCDate(day.getUTCDate() + 1)
  return day.toISOString()
}

const closingActivities: DealActivity[] = initialDeals
  .filter((deal) => isOpenStage(deal.stage))
  .map((deal) => ({
    dealId: deal.id,
    end: nextDay(deal.closeDate),
    id: `CLOSE-${deal.id}`,
    isAllDay: true,
    kind: 'closing',
    ownerId: deal.ownerId,
    start: `${deal.closeDate}T03:00:00.000Z`,
    title: `Fechamento · ${deal.company}`,
  }))

export const initialActivities: DealActivity[] = [
  activity(
    'ACT-401',
    'DEAL-201',
    'call',
    'Qualificação com Marcos Tavares',
    '2026-10-12T13:00:00.000Z',
    '2026-10-12T13:30:00.000Z',
  ),
  activity(
    'ACT-402',
    'DEAL-206',
    'proposal',
    'Envio da proposta',
    '2026-10-12T19:00:00.000Z',
    '2026-10-12T19:30:00.000Z',
  ),
  activity(
    'ACT-403',
    'DEAL-207',
    'meeting',
    'Negociação do contrato',
    '2026-10-13T13:00:00.000Z',
    '2026-10-13T14:30:00.000Z',
  ),
  activity(
    'ACT-404',
    'DEAL-202',
    'call',
    'Primeiro contato com Renata Costa',
    '2026-10-13T17:00:00.000Z',
    '2026-10-13T17:30:00.000Z',
  ),
  activity(
    'ACT-405',
    'DEAL-203',
    'meeting',
    'Descoberta com Paulo Nunes',
    '2026-10-14T12:00:00.000Z',
    '2026-10-14T13:00:00.000Z',
  ),
  activity(
    'ACT-406',
    'DEAL-205',
    'proposal',
    'Revisão da proposta',
    '2026-10-14T17:00:00.000Z',
    '2026-10-14T18:00:00.000Z',
  ),
  activity(
    'ACT-407',
    'DEAL-208',
    'call',
    'Contraproposta com Luciana Reis',
    '2026-10-14T19:00:00.000Z',
    '2026-10-14T19:30:00.000Z',
  ),
  activity(
    'ACT-408',
    'DEAL-204',
    'demo',
    'Demo da plataforma',
    '2026-10-15T18:00:00.000Z',
    '2026-10-15T19:00:00.000Z',
  ),
  activity(
    'ACT-409',
    'DEAL-209',
    'meeting',
    'Kickoff da implantação',
    '2026-10-16T13:00:00.000Z',
    '2026-10-16T14:00:00.000Z',
  ),
  activity(
    'ACT-410',
    'DEAL-207',
    'meeting',
    'Revisão com o jurídico',
    '2026-10-16T14:00:00.000Z',
    '2026-10-16T15:00:00.000Z',
  ),
  activity(
    'ACT-411',
    'DEAL-205',
    'meeting',
    'Visita ao centro de distribuição',
    '2026-10-20T17:00:00.000Z',
    '2026-10-20T19:00:00.000Z',
  ),
  activity(
    'ACT-412',
    'DEAL-210',
    'meeting',
    'Onboarding com Cláudia Ferreira',
    '2026-10-21T13:00:00.000Z',
    '2026-10-21T14:00:00.000Z',
  ),
  ...closingActivities,
]

export const createActivityCollection = (
  items: readonly DealActivity[],
): CollectionDefinition<DealActivity> => ({
  getKey: (activity) => activity.id,
  getLabel: (activity) => activity.title,
  groupings: [],
  items,
})
