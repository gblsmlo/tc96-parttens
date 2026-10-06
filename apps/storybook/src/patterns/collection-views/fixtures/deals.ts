import type { CollectionDefinition } from '@tc96/parttens'

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export interface Deal {
  closeDate: string
  company: string
  contact: string
  id: string
  ownerId: string
  stage: DealStage
  value: number
}

export const stageOptions = [
  { color: '#94a3b8', label: 'Lead', value: 'lead' },
  { color: '#3b82f6', label: 'Qualificado', value: 'qualified' },
  { color: '#8b5cf6', label: 'Proposta', value: 'proposal' },
  { color: '#f59e0b', label: 'Negociação', value: 'negotiation' },
  { color: '#22c55e', label: 'Ganho', value: 'won' },
  { color: '#ef4444', label: 'Perdido', value: 'lost' },
] as const satisfies readonly {
  color: string
  label: string
  value: DealStage
}[]

export const STAGE_COLOR = Object.fromEntries(
  stageOptions.map((option) => [option.value, option.color]),
) as Record<DealStage, string>

export const isDealStage = (value: string): value is DealStage =>
  stageOptions.some((option) => option.value === value)

export const isOpenStage = (stage: DealStage) =>
  stage !== 'won' && stage !== 'lost'

export const initialDeals: Deal[] = [
  {
    closeDate: '2026-11-20',
    company: 'Padaria Estrela',
    contact: 'Marcos Tavares',
    id: 'DEAL-201',
    ownerId: 'ana',
    stage: 'lead',
    value: 18_000,
  },
  {
    closeDate: '2026-12-05',
    company: 'Clínica Vida Plena',
    contact: 'Renata Costa',
    id: 'DEAL-202',
    ownerId: 'bruno',
    stage: 'lead',
    value: 42_000,
  },
  {
    closeDate: '2026-11-12',
    company: 'Construtora Horizonte',
    contact: 'Paulo Nunes',
    id: 'DEAL-203',
    ownerId: 'carla',
    stage: 'qualified',
    value: 125_000,
  },
  {
    closeDate: '2026-11-28',
    company: 'Escola Aprender',
    contact: 'Juliana Prado',
    id: 'DEAL-204',
    ownerId: 'diego',
    stage: 'qualified',
    value: 36_000,
  },
  {
    closeDate: '2026-10-30',
    company: 'Logística Rápida',
    contact: 'Fernando Alves',
    id: 'DEAL-205',
    ownerId: 'ana',
    stage: 'proposal',
    value: 210_000,
  },
  {
    closeDate: '2026-11-05',
    company: 'Café Montanha',
    contact: 'Beatriz Lopes',
    id: 'DEAL-206',
    ownerId: 'bruno',
    stage: 'proposal',
    value: 24_000,
  },
  {
    closeDate: '2026-10-22',
    company: 'Banco Aurora',
    contact: 'Ricardo Melo',
    id: 'DEAL-207',
    ownerId: 'carla',
    stage: 'negotiation',
    value: 480_000,
  },
  {
    closeDate: '2026-10-25',
    company: 'Farmácia Central',
    contact: 'Luciana Reis',
    id: 'DEAL-208',
    ownerId: 'diego',
    stage: 'negotiation',
    value: 95_000,
  },
  {
    closeDate: '2026-10-02',
    company: 'Studio Forma',
    contact: 'André Santos',
    id: 'DEAL-209',
    ownerId: 'ana',
    stage: 'won',
    value: 58_000,
  },
  {
    closeDate: '2026-09-26',
    company: 'Mercado Bom Preço',
    contact: 'Cláudia Ferreira',
    id: 'DEAL-210',
    ownerId: 'carla',
    stage: 'won',
    value: 132_000,
  },
  {
    closeDate: '2026-09-30',
    company: 'Hotel Litoral',
    contact: 'Gustavo Ribeiro',
    id: 'DEAL-211',
    ownerId: 'bruno',
    stage: 'lost',
    value: 76_000,
  },
]

export const dealGroupings: CollectionDefinition<Deal>['groupings'] = [
  {
    getGroupId: (deal) => deal.stage,
    id: 'stage',
    label: 'Etapa',
    options: stageOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
    setGroupId: (deal, groupId) =>
      groupId && isDealStage(groupId) ? { ...deal, stage: groupId } : deal,
  },
]

export const createDealCollection = (
  items: readonly Deal[],
): CollectionDefinition<Deal> => ({
  getKey: (deal) => deal.id,
  getLabel: (deal) => deal.company,
  groupings: dealGroupings,
  items,
})
