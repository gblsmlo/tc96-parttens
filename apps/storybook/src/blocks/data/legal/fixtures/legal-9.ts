import type {
  Legal9Record,
  Legal9SavedView,
} from '@tc96/ui/blocks/data/legal/legal-9'

export { legalOwners as owners } from './owners.ts'

export const pageSize = 25

export interface Legal9Page {
  items: Legal9Record[]
  total: number
}

export const savedViews: Legal9SavedView[] = [
  { id: 'sv-1', label: 'Êxito em aberto' },
  { id: 'sv-2', label: 'Mensalidades da Beatriz' },
]

export const records: Legal9Record[] = [
  {
    amountCents: 1_500_000,
    billingModel: 'fixed',
    editable: true,
    holder: 'Moinho Santa Clara Ltda.',
    id: 'ct-901',
    ownerId: 'beatriz',
    status: 'active',
    title: 'Ação de cobrança contra fornecedor de farinha',
  },
  {
    amountCents: 450_000,
    billingModel: 'subscription',
    editable: true,
    holder: 'TransVale Logística S.A.',
    id: 'ct-902',
    ownerId: 'rafael',
    status: 'active',
    title: 'Assessoria trabalhista mensal',
  },
  {
    amountCents: null,
    billingModel: 'contingency',
    editable: true,
    holder: 'Helena Prado',
    id: 'ct-903',
    ownerId: 'camila',
    status: 'active',
    title: 'Revisional de aluguel comercial',
  },
  {
    amountCents: 35_000,
    billingModel: 'hourly',
    editable: true,
    holder: 'TransVale Logística S.A.',
    id: 'ct-904',
    ownerId: 'rafael',
    status: 'active',
    title: 'Defesa em reclamação trabalhista',
  },
  {
    amountCents: 1_200_000,
    billingModel: 'fixed',
    editable: false,
    holder: 'Otávio Meireles',
    id: 'ct-905',
    ownerId: 'thiago',
    status: 'closed',
    title: 'Inventário de Lúcia Meireles',
  },
  {
    amountCents: 2_800_000,
    billingModel: 'fixed',
    editable: true,
    holder: 'Clínica Vida Plena',
    id: 'ct-906',
    ownerId: 'beatriz',
    status: 'active',
    title: 'Reorganização societária da clínica',
  },
  {
    amountCents: 680_000,
    billingModel: 'subscription',
    editable: true,
    holder: 'Moinho Santa Clara Ltda.',
    id: 'ct-907',
    ownerId: 'beatriz',
    status: 'active',
    title: 'Planejamento tributário 2026',
  },
  {
    amountCents: null,
    billingModel: 'contingency',
    editable: false,
    holder: 'Clínica Vida Plena',
    id: 'ct-908',
    ownerId: 'camila',
    status: 'closed',
    title: 'Indenização por erro de diagnóstico',
  },
  {
    amountCents: 900_000,
    billingModel: 'fixed',
    editable: true,
    holder: 'Renata Siqueira',
    id: 'ct-909',
    ownerId: 'camila',
    status: 'active',
    title: 'Divórcio consensual e partilha de bens',
  },
  {
    amountCents: null,
    billingModel: null,
    editable: true,
    holder: 'Padaria Grão Dourado ME',
    id: 'ct-910',
    ownerId: 'rafael',
    status: 'active',
    title: 'Parecer sobre contrato de franquia',
  },
  {
    amountCents: null,
    billingModel: 'contingency',
    editable: true,
    holder: 'Moinho Santa Clara Ltda.',
    id: 'ct-911',
    ownerId: 'thiago',
    status: 'active',
    title: 'Recuperação de crédito de ICMS',
  },
  {
    amountCents: 300_000,
    billingModel: 'other',
    editable: true,
    holder: 'Construtora Horizonte S.A.',
    id: 'ct-912',
    ownerId: 'thiago',
    status: 'active',
    title: 'Acompanhamento de licitações públicas',
  },
]
