import type {
  Crm2Lead,
  Crm2Option,
  Crm2Person,
  Crm2SavedView,
  Crm2Stage,
  Crm2View,
} from '@tc96/ui/blocks/data/crm/crm-2'

export const stages: Crm2Stage[] = [
  { id: 'novo', label: 'Novo contato', tone: 'neutral' },
  { id: 'qualificacao', label: 'Qualificação', tone: 'info' },
  { id: 'reuniao', label: 'Reunião agendada', tone: 'info' },
  { id: 'proposta', label: 'Proposta enviada', tone: 'warning' },
  { id: 'negociacao', label: 'Negociação', tone: 'warning' },
  { id: 'contrato', label: 'Contrato', tone: 'success' },
  { id: 'triagem', inactive: true, label: 'Triagem', tone: 'neutral' },
]

export const owners: Crm2Person[] = [
  { id: 'marina', label: 'Marina Costa' },
  { id: 'joao', label: 'João Pereira' },
  { id: 'lucas', label: 'Lucas Almeida' },
  { id: 'ana', label: 'Ana Ribeiro' },
]

export const tags: Crm2Option[] = [
  { id: 'quente', label: 'Quente' },
  { id: 'recorrente', label: 'Recorrente' },
  { id: 'grande-conta', label: 'Grande conta' },
  { id: 'parceiro', label: 'Parceiro' },
]

export const savedViews: Crm2SavedView[] = [
  { id: 'sv-quentes', label: 'Meus leads quentes' },
  { id: 'sv-propostas', label: 'Propostas em aberto' },
]

export const leads: Crm2Lead[] = [
  {
    archived: false,
    contact: 'Carla Mendes · Padaria Pão Dourado',
    id: 'lead-201',
    nextAction: 'Ligar para entender o volume de notas',
    nextActionAt: '2026-11-27',
    origin: 'referral',
    ownerId: 'marina',
    stageId: 'qualificacao',
    status: 'open',
    tagIds: ['quente'],
    title: 'Implantação de ERP na Padaria Pão Dourado',
    valueCents: 1_850_000,
  },
  {
    archived: false,
    contact: 'Renato Faria · Clínica Sorriso Leve',
    id: 'lead-202',
    nextAction: 'Enviar a proposta revisada',
    nextActionAt: '2026-11-20',
    nextActionOverdue: true,
    origin: 'website',
    ownerId: 'joao',
    stageId: 'proposta',
    status: 'open',
    tagIds: ['recorrente'],
    title: 'Plano anual para a Clínica Sorriso Leve',
    valueCents: 960_000,
  },
  {
    archived: false,
    contact: 'TransVale Logística S.A.',
    id: 'lead-203',
    nextAction: 'Reunião com o financeiro',
    nextActionAt: '2026-12-02',
    origin: 'existing-client',
    ownerId: 'lucas',
    stageId: 'negociacao',
    status: 'open',
    tagIds: ['grande-conta', 'recorrente'],
    title: 'Expansão de licenças da TransVale',
    valueCents: 4_200_000,
  },
  {
    archived: false,
    contact: 'Beatriz Lima · Café Serra Azul',
    id: 'lead-204',
    nextAction: null,
    nextActionAt: null,
    origin: 'social-media',
    ownerId: 'marina',
    stageId: 'novo',
    status: 'open',
    tagIds: [],
    title: 'Consultoria de marketing para o Café Serra Azul',
    valueCents: null,
  },
  {
    archived: false,
    contact: 'Construtora Horizonte',
    id: 'lead-205',
    nextAction: 'Confirmar a pauta da reunião',
    nextActionAt: '2026-11-26',
    origin: 'event',
    ownerId: 'ana',
    stageId: 'reuniao',
    status: 'open',
    tagIds: ['quente'],
    title: 'Treinamento da equipe da Construtora Horizonte',
    valueCents: 1_200_000,
  },
  {
    archived: false,
    contact: 'Paulo Henrique · Ótica Visão Clara',
    id: 'lead-206',
    nextAction: 'Pedir a planilha de clientes atual',
    nextActionAt: '2026-11-18',
    nextActionOverdue: true,
    origin: 'paid-ads',
    ownerId: 'joao',
    stageId: 'qualificacao',
    status: 'open',
    tagIds: [],
    title: 'Migração de dados da Ótica Visão Clara',
    valueCents: 380_000,
  },
  {
    archived: false,
    contact: 'Loja Bela Casa',
    editable: false,
    id: 'lead-207',
    nextAction: 'Aguardar o retorno do sócio',
    nextActionAt: '2026-11-29',
    origin: 'referral',
    ownerId: 'lucas',
    stageId: 'proposta',
    status: 'open',
    tagIds: ['parceiro'],
    title: 'Integração com marketplace da Loja Bela Casa',
    valueCents: 2_750_000,
  },
  {
    archived: false,
    contact: 'Fernanda Rocha · Escola Pequeno Saber',
    id: 'lead-208',
    nextAction: 'Enviar o contrato para assinatura',
    nextActionAt: '2026-11-28',
    origin: 'website',
    ownerId: 'ana',
    stageId: 'contrato',
    status: 'open',
    tagIds: ['recorrente'],
    title: 'Suporte dedicado para a Escola Pequeno Saber',
    valueCents: 640_000,
  },
  {
    archived: false,
    contact: 'Rede Farmavida',
    id: 'lead-209',
    nextAction: 'Apresentar o piloto à diretoria',
    nextActionAt: '2026-12-04',
    origin: 'event',
    ownerId: 'marina',
    stageId: 'negociacao',
    status: 'open',
    tagIds: ['grande-conta', 'quente'],
    title: 'Piloto de BI para a Rede Farmavida',
    valueCents: 5_100_000,
  },
  {
    archived: false,
    contact: 'Academia Movimento',
    id: 'lead-210',
    nextAction: null,
    nextActionAt: null,
    origin: 'existing-client',
    ownerId: null,
    stageId: 'novo',
    status: 'open',
    tagIds: ['recorrente'],
    title: 'Renovação da Academia Movimento',
    valueCents: 720_000,
  },
  {
    archived: true,
    contact: 'Hotel Mar Azul',
    id: 'lead-211',
    nextAction: null,
    nextActionAt: null,
    origin: 'other',
    ownerId: 'joao',
    stageId: 'qualificacao',
    status: 'lost',
    tagIds: [],
    title: 'Site institucional do Hotel Mar Azul',
    valueCents: 290_000,
  },
  {
    archived: false,
    contact: 'Ricardo Alves · Distribuidora Norte',
    id: 'lead-212',
    nextAction: null,
    nextActionAt: null,
    origin: 'referral',
    ownerId: 'lucas',
    stageId: 'triagem',
    status: 'lost',
    tagIds: [],
    title: 'Automação de cobranças da Distribuidora Norte',
    valueCents: 3_300_000,
  },
]

export const isOnTheBoard = (lead: Crm2Lead) =>
  lead.status === 'open' && !lead.archived

export const stageValuesOf = (items: readonly Crm2Lead[]) =>
  items.reduce<Record<string, number>>((values, lead) => {
    values[lead.stageId] = (values[lead.stageId] ?? 0) + (lead.valueCents ?? 0)
    return values
  }, {})

export const boardLeads = leads.filter(isOnTheBoard)

export const stageValues = stageValuesOf(boardLeads)

export const counts: Partial<Record<Crm2View, number>> = {
  all: leads.filter((lead) => !lead.archived).length,
}

export const pageSize = 5

export interface Crm2Page {
  items: Crm2Lead[]
  total: number
}

export interface Crm2Board {
  hasMore: boolean
  leads: Crm2Lead[]
  stageValues: Record<string, number>
}
