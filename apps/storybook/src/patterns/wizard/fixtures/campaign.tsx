import type { WizardStep } from '@tc96/parttens'
import {
  ClipboardCheckIcon,
  FileTextIcon,
  MegaphoneIcon,
  TargetIcon,
  WalletIcon,
} from 'lucide-react'
import type { SelectOption } from './fields'

export const campaignSteps = [
  {
    description: 'Título, responsável e período',
    icon: <FileTextIcon />,
    title: 'Informações iniciais',
    value: 'basics',
  },
  {
    description: 'Origem, canal e metas',
    icon: <MegaphoneIcon />,
    title: 'Campanha',
    value: 'campaign',
  },
  {
    description: 'Contas e objetivo no Meta',
    icon: <TargetIcon />,
    title: 'Campanha de anúncios',
    value: 'ads',
  },
  {
    description: 'Opcional, por dia',
    icon: <WalletIcon />,
    title: 'Orçamento',
    value: 'budget',
  },
  {
    description: 'Confira e crie',
    icon: <ClipboardCheckIcon />,
    title: 'Revisão',
    value: 'review',
  },
] satisfies WizardStep[]

export type CampaignStepValue = (typeof campaignSteps)[number]['value']

export const acquisitionSources: SelectOption[] = [
  { label: 'Meta Ads', value: 'meta-ads' },
  { label: 'Google Ads', value: 'google-ads' },
  { label: 'Indicação', value: 'referral' },
  { label: 'Orgânico', value: 'organic' },
]

export const entryChannels: SelectOption[] = [
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Formulário do site', value: 'site-form' },
  { label: 'Instagram Direct', value: 'instagram' },
  { label: 'Telefone', value: 'phone' },
]

export const owners: SelectOption[] = [
  { label: 'Marina Costa', value: 'marina' },
  { label: 'Equipe de Atendimento', value: 'support' },
  { label: 'Diego Almeida', value: 'diego' },
  { label: 'Luiza Ferreira', value: 'luiza' },
]

export const expectedLeadRanges: SelectOption[] = [
  { label: 'Até 50', value: 'up-to-50' },
  { label: '50 a 200', value: '50-200' },
  { label: '200 a 500', value: '200-500' },
  { label: 'Mais de 500', value: 'over-500' },
]

export const contractConversionRanges: SelectOption[] = [
  { label: 'Até 5%', value: 'up-to-5' },
  { label: '5% a 10%', value: '5-10' },
  { label: '10% a 20%', value: '10-20' },
  { label: 'Mais de 20%', value: 'over-20' },
]

export interface AdAccount extends SelectOption {
  currency: string
}

export const adAccounts: AdAccount[] = [
  { currency: 'BRL', label: 'Acme | Conta principal', value: 'main' },
  { currency: 'BRL', label: 'Acme | Conta secundária', value: 'secondary' },
]

export interface CampaignObjective extends SelectOption {
  description: string
}

export const campaignObjectives: CampaignObjective[] = [
  {
    description: 'Ser lembrado na região ou na área de atuação',
    label: 'Reconhecimento',
    value: 'awareness',
  },
  { description: 'Levar pessoas ao site', label: 'Tráfego', value: 'traffic' },
  {
    description: 'Gerar conversas, por exemplo no WhatsApp',
    label: 'Engajamento',
    value: 'engagement',
  },
  {
    description: 'Receber contatos pelo formulário instantâneo ou por mensagem',
    label: 'Leads',
    value: 'leads',
  },
  {
    description: 'Conversões no site, medidas pelo pixel',
    label: 'Vendas',
    value: 'sales',
  },
]

export const specialCategories: SelectOption[] = [
  { label: 'Nenhuma', value: 'none' },
  { label: 'Crédito ou produtos financeiros', value: 'credit' },
  { label: 'Emprego', value: 'employment' },
  { label: 'Moradia', value: 'housing' },
  { label: 'Questões sociais, eleições ou política', value: 'politics' },
]

export const budgetModes = [
  { label: 'Diário', value: 'daily' },
  { label: 'Sem orçamento', value: 'none' },
] as const

export type BudgetMode = (typeof budgetModes)[number]['value']

export interface CampaignDraft {
  adAccounts: string[]
  adName: string | null
  budgetAmount: string
  budgetMode: BudgetMode
  channel: string | null
  conversion: string | null
  endsOn: string
  expectedLeads: string | null
  objective: string
  owner: string | null
  source: string | null
  specialCategory: string | null
  startsOn: string
  title: string
}

export const emptyCampaign: CampaignDraft = {
  adAccounts: [],
  adName: null,
  budgetAmount: '',
  budgetMode: 'none',
  channel: 'whatsapp',
  conversion: null,
  endsOn: '',
  expectedLeads: null,
  objective: 'leads',
  owner: 'marina',
  source: 'meta-ads',
  specialCategory: 'none',
  startsOn: '',
  title: '',
}

export const bankingPilot: CampaignDraft = {
  ...emptyCampaign,
  adAccounts: ['main', 'secondary'],
  budgetAmount: '50',
  budgetMode: 'daily',
  title: 'Piloto bancário',
}

export interface StoredCampaign {
  draft: CampaignDraft
  reached: number
  step: string
}

export const campaignDraftKey = 'parttens:wizard:campaign-draft'

export function readStoredCampaign(): StoredCampaign | null {
  try {
    const stored = localStorage.getItem(campaignDraftKey)
    return stored ? (JSON.parse(stored) as StoredCampaign) : null
  } catch {
    return null
  }
}

export function writeStoredCampaign(campaign: StoredCampaign) {
  try {
    localStorage.setItem(campaignDraftKey, JSON.stringify(campaign))
  } catch {
    return
  }
}

export function clearStoredCampaign() {
  try {
    localStorage.removeItem(campaignDraftKey)
  } catch {
    return
  }
}

export const optionLabel = (options: SelectOption[], value: string | null) =>
  options.find((option) => option.value === value)?.label
