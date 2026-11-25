import type {
  Legal5Option,
  Legal5Phase,
  Legal5Record,
  Legal5View,
} from '@tc96/ui/blocks/data/legal/legal-5'

import type { LegalSavedViewRecord } from './saved-views.ts'

export { legalOwners as owners } from './owners.ts'

export const phases: Legal5Phase[] = [
  { group: 'Casos', id: 'consulta', kind: 'matter', label: 'Consulta' },
  { group: 'Casos', id: 'negociacao', kind: 'matter', label: 'Negociação' },
  {
    group: 'Processos',
    id: 'inicial',
    kind: 'lawsuit',
    label: 'Petição inicial',
  },
  { group: 'Processos', id: 'instrucao', kind: 'lawsuit', label: 'Instrução' },
  { group: 'Processos', id: 'sentenca', kind: 'lawsuit', label: 'Sentença' },
  { group: 'Processos', id: 'recurso', kind: 'lawsuit', label: 'Recurso' },
]

export const tags: Legal5Option[] = [
  { id: 'urgente', label: 'Urgente' },
  { id: 'estrategico', label: 'Estratégico' },
  { id: 'trabalhista', label: 'Trabalhista' },
  { id: 'tributario', label: 'Tributário' },
]

export const clients: Legal5Option[] = [
  { id: 'person:11', label: 'Helena Prado' },
  { id: 'company:21', label: 'Moinho Santa Clara Ltda.' },
  { id: 'company:22', label: 'TransVale Logística S.A.' },
  { id: 'company:23', label: 'Clínica Vida Plena' },
  { id: 'person:12', label: 'Otávio Meireles' },
]

export const records: Legal5Record[] = [
  {
    archived: false,
    clients: ['Moinho Santa Clara Ltda.'],
    id: 'proc-501',
    kind: 'lawsuit',
    nextDeadline: { label: 'Faltam 2 dias úteis', tone: 'danger' },
    number: '5001234-18.2026.8.26.9001',
    ownerId: 'beatriz',
    phaseId: 'instrucao',
    tagIds: ['urgente', 'estrategico'],
    title: 'Ação de cobrança contra fornecedor de farinha',
  },
  {
    archived: false,
    clients: ['TransVale Logística S.A.'],
    id: 'proc-502',
    kind: 'lawsuit',
    nextDeadline: { label: 'Faltam 5 dias úteis', tone: 'warning' },
    number: '0010457-62.2026.5.15.9002',
    ownerId: 'rafael',
    phaseId: 'inicial',
    tagIds: ['trabalhista'],
    title: 'Reclamação trabalhista de ex-motorista',
  },
  {
    archived: false,
    clients: ['Helena Prado'],
    id: 'caso-503',
    kind: 'matter',
    nextDeadline: null,
    number: null,
    ownerId: 'camila',
    phaseId: 'consulta',
    tagIds: [],
    title: 'Revisão de contrato de locação comercial',
  },
  {
    archived: false,
    clients: ['Clínica Vida Plena'],
    id: 'proc-504',
    kind: 'lawsuit',
    nextDeadline: { label: 'Faltam 12 dias úteis', tone: 'neutral' },
    number: '1009876-40.2025.8.26.9003',
    ownerId: 'thiago',
    phaseId: 'sentenca',
    tagIds: ['estrategico'],
    title: 'Indenização por erro em exame laboratorial',
  },
  {
    archived: true,
    clients: ['Otávio Meireles'],
    id: 'proc-505',
    kind: 'lawsuit',
    nextDeadline: null,
    number: '0803321-09.2024.8.19.9004',
    ownerId: 'beatriz',
    phaseId: 'recurso',
    tagIds: [],
    title: 'Inventário de Lúcia Meireles',
  },
  {
    archived: false,
    clients: ['Moinho Santa Clara Ltda.', 'Helena Prado'],
    id: 'caso-506',
    kind: 'matter',
    nextDeadline: null,
    number: null,
    ownerId: 'rafael',
    phaseId: 'negociacao',
    tagIds: ['tributario'],
    title: 'Parcelamento de débito de ICMS',
  },
  {
    archived: false,
    clients: ['TransVale Logística S.A.'],
    id: 'proc-507',
    kind: 'lawsuit',
    nextDeadline: { label: 'Vence hoje', tone: 'danger' },
    number: '5007712-55.2026.4.03.9005',
    ownerId: 'camila',
    phaseId: 'recurso',
    tagIds: ['urgente', 'tributario'],
    title: 'Mandado de segurança contra autuação fiscal',
  },
  {
    archived: false,
    clients: ['Clínica Vida Plena'],
    id: 'proc-508',
    kind: 'lawsuit',
    nextDeadline: { label: 'Faltam 8 dias úteis', tone: 'warning' },
    number: '0021190-33.2026.5.02.9006',
    ownerId: null,
    phaseId: 'instrucao',
    tagIds: ['trabalhista'],
    title: 'Horas extras de equipe de enfermagem',
  },
  {
    archived: false,
    clients: ['Otávio Meireles'],
    id: 'caso-509',
    kind: 'matter',
    nextDeadline: null,
    number: null,
    ownerId: 'thiago',
    phaseId: 'consulta',
    tagIds: [],
    title: 'Planejamento sucessório da família Meireles',
  },
  {
    archived: false,
    clients: ['Moinho Santa Clara Ltda.'],
    id: 'proc-510',
    kind: 'lawsuit',
    nextDeadline: { label: 'Faltam 20 dias úteis', tone: 'neutral' },
    number: '1004410-71.2026.8.26.9007',
    ownerId: 'beatriz',
    phaseId: 'inicial',
    tagIds: [],
    title: 'Rescisão de contrato de distribuição',
  },
  {
    archived: false,
    clients: ['Helena Prado'],
    id: 'proc-511',
    kind: 'lawsuit',
    nextDeadline: { label: 'Atrasado há 1 dia útil', tone: 'danger' },
    number: '0715508-27.2025.8.07.9008',
    ownerId: 'rafael',
    phaseId: 'sentenca',
    tagIds: ['urgente'],
    title: 'Despejo por falta de pagamento',
  },
  {
    archived: false,
    clients: ['TransVale Logística S.A.', 'Clínica Vida Plena'],
    id: 'caso-512',
    kind: 'matter',
    nextDeadline: null,
    number: null,
    ownerId: 'camila',
    phaseId: 'negociacao',
    tagIds: ['estrategico'],
    title: 'Acordo de transporte de material biológico',
  },
]

export const pageSize = 25

export const counts: Record<Legal5View, number> = {
  all: records.length,
  lawsuit: records.filter((item) => item.kind === 'lawsuit').length,
  matter: records.filter((item) => item.kind === 'matter').length,
}

export interface Legal5Page {
  counts: Record<Legal5View, number>
  items: Legal5Record[]
  total: number
}

export interface Legal5SavedViewConfig {
  ownerFilter: string | null
  phaseFilter: string[]
  view: Legal5View
}

export const savedViews: LegalSavedViewRecord<Legal5SavedViewConfig>[] = [
  {
    config: { ownerFilter: 'beatriz', phaseFilter: [], view: 'lawsuit' },
    id: 'view-beatriz',
    label: 'Processos da Beatriz',
  },
  {
    config: {
      ownerFilter: null,
      phaseFilter: ['instrucao', 'sentenca'],
      view: 'all',
    },
    id: 'view-instrucao',
    label: 'Instrução e sentença',
  },
]
