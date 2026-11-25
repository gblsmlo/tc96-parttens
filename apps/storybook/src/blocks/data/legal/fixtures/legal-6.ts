import {
  type Legal6Counts,
  type Legal6Deadline,
  type Legal6Kind,
  type Legal6Sort,
  type Legal6View,
  legal6Views,
} from '@tc96/ui/blocks/data/legal/legal-6'

import type { LegalSavedViewRecord } from './saved-views.ts'

export { legalOwners as owners } from './owners.ts'

export interface Legal6QueueDeadline extends Legal6Deadline {
  kindId: string
  queues: Legal6View[]
}

export interface Legal6QueueQuery {
  cursor?: number
  kindId?: string | null
  ownerId?: string | null
  sort?: Legal6Sort
  view: Legal6View
}

export interface Legal6QueuePage {
  counts: Legal6Counts
  items: Legal6QueueDeadline[]
  nextCursor: number | null
}

export const pageSize = 5

export const memberViews: readonly Legal6View[] = [
  'mine',
  'overdue',
  'today',
  'week',
]

export const kinds: Legal6Kind[] = [
  { id: 'contestacao', label: 'Contestação' },
  { id: 'contrarrazoes', label: 'Contrarrazões' },
  { id: 'embargos', label: 'Embargos de declaração' },
  { id: 'impugnacao', label: 'Impugnação' },
  { id: 'manifestacao', label: 'Manifestação' },
  { id: 'recurso', label: 'Recurso' },
  { id: 'replica', label: 'Réplica' },
  { id: 'personalizado', label: 'Personalizado' },
]

export const deadlines: Legal6QueueDeadline[] = [
  {
    clients: ['TransVale Logística'],
    daysLeft: { label: 'Venceu há 3 dias úteis', tone: 'danger' },
    fatalDate: '2026-11-19',
    id: 'prz-601',
    internalDate: '2026-11-17',
    kind: 'Contestação',
    kindId: 'contestacao',
    label: 'Contestação',
    lawsuitTitle: 'Reclamação trabalhista de ex-motorista',
    ownerId: 'rafael',
    queues: ['overdue', 'all'],
  },
  {
    clients: ['Panificadora Trigo Dourado'],
    daysLeft: { label: 'Vence hoje', tone: 'danger' },
    fatalDate: '2026-11-24',
    id: 'prz-602',
    internalDate: '2026-11-20',
    kind: 'Réplica',
    kindId: 'replica',
    label: 'Réplica à contestação',
    lawsuitTitle: 'Ação de cobrança contra fornecedor de farinha',
    ownerId: 'beatriz',
    queues: ['mine', 'today', 'week', 'all'],
  },
  {
    clients: ['Helena Prado', 'Marcos Prado'],
    daysLeft: { label: '1 dia útil', tone: 'danger' },
    fatalDate: '2026-11-25',
    id: 'prz-603',
    internalDate: '2026-11-23',
    kind: 'Contrarrazões',
    kindId: 'contrarrazoes',
    label: 'Contrarrazões de apelação',
    lawsuitTitle: 'Apelação em dissolução parcial de sociedade',
    ownerId: 'beatriz',
    queues: ['mine', 'today', 'week', 'all'],
  },
  {
    clients: ['Metalúrgica Serra Azul'],
    daysLeft: { label: '3 dias úteis', tone: 'warning' },
    fatalDate: '2026-11-27',
    id: 'prz-604',
    internalDate: '2026-11-25',
    kind: 'Embargos de declaração',
    kindId: 'embargos',
    label: 'Embargos de declaração',
    lawsuitTitle: 'Mandado de segurança sobre crédito de ICMS',
    ownerId: 'camila',
    queues: ['week', 'all'],
  },
  {
    clients: ['Imobiliária Jardim Sul'],
    daysLeft: { label: '4 dias úteis', tone: 'warning' },
    fatalDate: '2026-11-30',
    id: 'prz-607',
    internalDate: '2026-11-26',
    kind: 'Personalizado',
    kindId: 'personalizado',
    label: 'Emenda à petição inicial',
    lawsuitTitle: 'Ação de despejo por falta de pagamento',
    ownerId: null,
    queues: ['unassigned', 'week', 'all'],
  },
  {
    clients: ['Livraria Ponto e Vírgula'],
    daysLeft: { label: '5 dias úteis', tone: 'warning' },
    fatalDate: '2026-12-01',
    id: 'prz-605',
    internalDate: '2026-11-27',
    kind: 'Manifestação',
    kindId: 'manifestacao',
    label: 'Manifestação sobre laudo pericial',
    lawsuitTitle: 'Revisional de contrato de locação comercial',
    ownerId: 'beatriz',
    queues: ['mine', 'week', 'all'],
  },
  {
    clients: ['TransVale Logística'],
    daysLeft: { label: '10 dias úteis', tone: 'neutral' },
    fatalDate: '2026-12-08',
    id: 'prz-606',
    internalDate: '2026-12-04',
    kind: 'Recurso',
    kindId: 'recurso',
    label: 'Recurso de revista',
    lawsuitTitle: 'Recurso ordinário sobre horas extras',
    ownerId: 'thiago',
    queues: ['all'],
  },
  {
    clients: ['TransVale Logística', 'Seguradora Atlas'],
    daysLeft: { label: '11 dias úteis', tone: 'neutral' },
    fatalDate: '2026-12-09',
    id: 'prz-608',
    internalDate: '2026-12-02',
    kind: 'Recurso',
    kindId: 'recurso',
    label: 'Apelação',
    lawsuitTitle: 'Indenização por extravio de carga',
    ownerId: null,
    queues: ['unassigned', 'all'],
  },
  {
    clients: ['Clínica Vida Plena'],
    daysLeft: { label: '14 dias úteis', tone: 'neutral' },
    fatalDate: '2026-12-14',
    id: 'prz-609',
    internalDate: '2026-12-10',
    kind: 'Contestação',
    kindId: 'contestacao',
    label: 'Contestação',
    lawsuitTitle: 'Execução fiscal de ISS',
    ownerId: 'rafael',
    queues: ['proposed'],
  },
  {
    clients: ['Panificadora Trigo Dourado'],
    daysLeft: { label: '9 dias úteis', tone: 'neutral' },
    fatalDate: '2026-12-07',
    id: 'prz-610',
    internalDate: '2026-12-03',
    kind: 'Impugnação',
    kindId: 'impugnacao',
    label: 'Impugnação ao cumprimento de sentença',
    lawsuitTitle: 'Cumprimento de sentença em ação de cobrança',
    ownerId: 'beatriz',
    queues: ['proposed'],
  },
  {
    clients: ['Renata Albuquerque'],
    daysLeft: { label: '—', tone: 'neutral' },
    fatalDate: '2026-11-18',
    id: 'prz-611',
    internalDate: '2026-11-16',
    kind: 'Recurso',
    kindId: 'recurso',
    label: 'Agravo de instrumento',
    lawsuitTitle: 'Tutela de urgência em plano de saúde',
    ownerId: 'camila',
    queues: ['awaiting-closure'],
  },
  {
    clients: ['Metalúrgica Serra Azul'],
    daysLeft: { label: '—', tone: 'neutral' },
    fatalDate: '2026-11-13',
    id: 'prz-612',
    internalDate: '2026-11-11',
    kind: 'Manifestação',
    kindId: 'manifestacao',
    label: 'Razões finais',
    lawsuitTitle: 'Reintegração de posse de galpão',
    ownerId: 'thiago',
    queues: ['awaiting-closure'],
  },
]

const matches = (
  item: Legal6QueueDeadline,
  { kindId, ownerId }: Pick<Legal6QueueQuery, 'kindId' | 'ownerId'>,
) =>
  (!ownerId || item.ownerId === ownerId) && (!kindId || item.kindId === kindId)

export function countDeadlineQueues(
  source: readonly Legal6QueueDeadline[],
  filters: Pick<Legal6QueueQuery, 'kindId' | 'ownerId'> = {},
): Legal6Counts {
  return Object.fromEntries(
    legal6Views.map((view) => [
      view,
      source.filter(
        (item) => item.queues.includes(view) && matches(item, filters),
      ).length,
    ]),
  )
}

export function readDeadlineQueue(
  source: readonly Legal6QueueDeadline[],
  { cursor = 0, sort = 'fatal', view, ...filters }: Legal6QueueQuery,
): Legal6QueuePage {
  const dateOf = (item: Legal6QueueDeadline) =>
    sort === 'internal' ? item.internalDate : item.fatalDate
  const queue = source
    .filter((item) => item.queues.includes(view) && matches(item, filters))
    .sort((left, right) => dateOf(left).localeCompare(dateOf(right)))
  const end = cursor + pageSize
  return {
    counts: countDeadlineQueues(source, filters),
    items: queue.slice(cursor, end),
    nextCursor: end < queue.length ? end : null,
  }
}

export interface Legal6SavedViewConfig {
  kindFilter: string | null
  ownerFilter: string | null
  sort: Legal6Sort
  view: Legal6View
}

export const savedViews: LegalSavedViewRecord<Legal6SavedViewConfig>[] = [
  {
    config: {
      kindFilter: 'contestacao',
      ownerFilter: null,
      sort: 'fatal',
      view: 'all',
    },
    id: 'view-contestacoes',
    label: 'Contestações',
  },
  {
    config: {
      kindFilter: null,
      ownerFilter: 'rafael',
      sort: 'internal',
      view: 'all',
    },
    id: 'view-rafael',
    label: 'Prazos do Rafael',
  },
]
