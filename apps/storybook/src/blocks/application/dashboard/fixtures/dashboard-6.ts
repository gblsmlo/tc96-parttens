import type {
  Dashboard6LossReason,
  Dashboard6Stage,
  Dashboard6Summary,
} from '@tc96/ui/blocks/application/dashboard/dashboard-6'

export const crmPeriodOptions = [
  { label: 'Este mês', value: 'month' },
  { label: 'Últimos 30 dias', value: 'last_30_days' },
  { label: 'Este trimestre', value: 'quarter' },
  { label: 'Este ano', value: 'year' },
]

export const initialCrmPeriod = 'month'

export const summary: Dashboard6Summary = {
  conversion: 0.42,
  lost: { count: 16, valueCents: 4_850_000 },
  open: { count: 23, valueCents: 13_850_000 },
  won: { count: 11, valueCents: 6_200_000 },
}

const stageHref = (id: string) => `/crm/funil?etapa=${id}`

export const stages: Dashboard6Stage[] = [
  {
    count: 8,
    href: stageHref('st-novo'),
    id: 'st-novo',
    name: 'Novo',
    valueCents: 3_600_000,
  },
  {
    count: 6,
    href: stageHref('st-qualificacao'),
    id: 'st-qualificacao',
    name: 'Qualificação',
    valueCents: 3_000_000,
  },
  {
    count: 4,
    href: stageHref('st-atendimento'),
    id: 'st-atendimento',
    name: 'Atendimento',
    valueCents: 2_400_000,
  },
  {
    count: 3,
    href: stageHref('st-proposta'),
    id: 'st-proposta',
    name: 'Proposta',
    valueCents: 2_250_000,
  },
  {
    count: 1,
    href: stageHref('st-negociacao'),
    id: 'st-negociacao',
    name: 'Negociação',
    valueCents: 1_200_000,
  },
  {
    count: 1,
    href: stageHref('st-fechamento'),
    id: 'st-fechamento',
    name: 'Fechamento',
    valueCents: 1_400_000,
  },
]

export const lossReasons: Dashboard6LossReason[] = [
  { count: 6, id: 'lr-sem-retorno', name: 'Sem retorno' },
  { count: 4, id: 'lr-recusou', name: 'Recusou a proposta' },
  { count: 3, id: 'lr-documentos', name: 'Documentos não enviados' },
  { count: 2, id: 'lr-outro-escritorio', name: 'Contratou outro escritório' },
  { count: 1, id: 'lr-fora-escopo', name: 'Fora do escopo' },
]
