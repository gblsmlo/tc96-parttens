import type {
  CollectionDefinition,
  SelectPropertyOption,
  TagsPropertyOption,
} from '@tc96/parttens'
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CirclePauseIcon,
  CirclePlayIcon,
  HourglassIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  MousePointerClickIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  UserPlusIcon,
} from 'lucide-react'

export type CampaignObjective =
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'app-promotion'
  | 'sales'

export type CampaignStatus =
  | 'active'
  | 'in-review'
  | 'paused'
  | 'draft'
  | 'completed'

export type CampaignPlacement =
  | 'facebook'
  | 'instagram'
  | 'messenger'
  | 'audience-network'

export type CampaignBudgetType = 'daily' | 'lifetime'

export interface Campaign {
  adCount: number
  adSetCount: number
  budget: number
  budgetType: CampaignBudgetType
  clicks: number
  endDate: string | null
  id: string
  impressions: number
  name: string
  objective: CampaignObjective
  pixel: boolean
  placements: CampaignPlacement[]
  reach: number
  results: number
  spend: number
  startDate: string
  status: CampaignStatus
}

export const LEARNING_PHASE_RESULTS = 50

export const objectiveOptions = [
  {
    icon: MegaphoneIcon,
    label: 'Reconhecimento',
    tone: 'neutral',
    value: 'awareness',
  },
  {
    icon: MousePointerClickIcon,
    label: 'Tráfego',
    tone: 'info',
    value: 'traffic',
  },
  {
    icon: MessageCircleIcon,
    label: 'Engajamento',
    tone: 'info',
    value: 'engagement',
  },
  { icon: UserPlusIcon, label: 'Cadastros', tone: 'warning', value: 'leads' },
  {
    icon: SmartphoneIcon,
    label: 'Promoção do app',
    tone: 'neutral',
    value: 'app-promotion',
  },
  { icon: ShoppingBagIcon, label: 'Vendas', tone: 'success', value: 'sales' },
] as const satisfies readonly (SelectPropertyOption & {
  value: CampaignObjective
})[]

export const statusOptions = [
  { icon: CirclePlayIcon, label: 'Ativa', tone: 'success', value: 'active' },
  {
    icon: HourglassIcon,
    label: 'Em análise',
    tone: 'warning',
    value: 'in-review',
  },
  {
    icon: CirclePauseIcon,
    label: 'Pausada',
    tone: 'neutral',
    value: 'paused',
  },
  {
    icon: CircleDashedIcon,
    label: 'Rascunho',
    tone: 'neutral',
    value: 'draft',
  },
  {
    icon: CircleCheckIcon,
    label: 'Concluída',
    tone: 'info',
    value: 'completed',
  },
] as const satisfies readonly (SelectPropertyOption & {
  value: CampaignStatus
})[]

export const placementOptions: readonly TagsPropertyOption<CampaignPlacement>[] =
  [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Messenger', value: 'messenger' },
    { label: 'Audience Network', value: 'audience-network' },
  ]

export const resultLabels: Record<CampaignObjective, string> = {
  'app-promotion': 'Instalações',
  awareness: 'Alcance',
  engagement: 'Conversas iniciadas',
  leads: 'Cadastros',
  sales: 'Compras',
  traffic: 'Cliques no link',
}

export const budgetTypeLabels: Record<CampaignBudgetType, string> = {
  daily: 'diário',
  lifetime: 'vitalício',
}

export const isCampaignStatus = (value: string): value is CampaignStatus =>
  statusOptions.some((option) => option.value === value)

export const isCampaignObjective = (
  value: string,
): value is CampaignObjective =>
  objectiveOptions.some((option) => option.value === value)

export const isLearning = (campaign: Campaign) =>
  campaign.status === 'active' && campaign.results < LEARNING_PHASE_RESULTS

export const costPerResult = (campaign: Campaign) =>
  campaign.results > 0 ? campaign.spend / campaign.results : null

export const clickThroughRate = (campaign: Campaign) =>
  campaign.impressions > 0 ? campaign.clicks / campaign.impressions : null

export const initialCampaigns: Campaign[] = [
  {
    adCount: 6,
    adSetCount: 3,
    budget: 250,
    budgetType: 'daily',
    clicks: 4_812,
    endDate: null,
    id: 'CMP-401',
    impressions: 286_400,
    name: 'Black Friday · Catálogo completo',
    objective: 'sales',
    pixel: true,
    placements: ['facebook', 'instagram'],
    reach: 118_900,
    results: 214,
    spend: 6_480.35,
    startDate: '2026-09-15',
    status: 'active',
  },
  {
    adCount: 4,
    adSetCount: 2,
    budget: 120,
    budgetType: 'daily',
    clicks: 1_036,
    endDate: null,
    id: 'CMP-402',
    impressions: 74_210,
    name: 'Remarketing · Carrinho abandonado',
    objective: 'sales',
    pixel: true,
    placements: ['facebook', 'instagram', 'audience-network'],
    reach: 21_480,
    results: 31,
    spend: 1_188.9,
    startDate: '2026-10-03',
    status: 'active',
  },
  {
    adCount: 3,
    adSetCount: 1,
    budget: 80,
    budgetType: 'daily',
    clicks: 2_954,
    endDate: null,
    id: 'CMP-403',
    impressions: 152_730,
    name: 'Blog · Guia de presentes',
    objective: 'traffic',
    pixel: true,
    placements: ['facebook', 'instagram'],
    reach: 97_350,
    results: 2_418,
    spend: 1_604.2,
    startDate: '2026-09-22',
    status: 'active',
  },
  {
    adCount: 2,
    adSetCount: 1,
    budget: 60,
    budgetType: 'daily',
    clicks: 688,
    endDate: null,
    id: 'CMP-404',
    impressions: 41_920,
    name: 'Atendimento via WhatsApp',
    objective: 'engagement',
    pixel: false,
    placements: ['facebook', 'instagram', 'messenger'],
    reach: 30_115,
    results: 142,
    spend: 712.4,
    startDate: '2026-09-28',
    status: 'active',
  },
  {
    adCount: 5,
    adSetCount: 2,
    budget: 3_000,
    budgetType: 'lifetime',
    clicks: 1_410,
    endDate: '2026-10-31',
    id: 'CMP-405',
    impressions: 63_580,
    name: 'Lista VIP · Lançamento de verão',
    objective: 'leads',
    pixel: true,
    placements: ['facebook', 'instagram'],
    reach: 44_760,
    results: 38,
    spend: 1_342.75,
    startDate: '2026-10-06',
    status: 'active',
  },
  {
    adCount: 3,
    adSetCount: 1,
    budget: 5_000,
    budgetType: 'lifetime',
    clicks: 3_215,
    endDate: '2026-09-30',
    id: 'CMP-406',
    impressions: 912_400,
    name: 'Marca · Nova coleção',
    objective: 'awareness',
    pixel: false,
    placements: ['facebook', 'instagram', 'audience-network'],
    reach: 402_870,
    results: 402_870,
    spend: 4_996.1,
    startDate: '2026-09-01',
    status: 'completed',
  },
  {
    adCount: 4,
    adSetCount: 2,
    budget: 150,
    budgetType: 'daily',
    clicks: 2_087,
    endDate: null,
    id: 'CMP-407',
    impressions: 121_640,
    name: 'App · Instalações Android',
    objective: 'app-promotion',
    pixel: false,
    placements: ['facebook', 'instagram', 'audience-network'],
    reach: 88_215,
    results: 976,
    spend: 3_120.6,
    startDate: '2026-08-20',
    status: 'paused',
  },
  {
    adCount: 2,
    adSetCount: 1,
    budget: 40,
    budgetType: 'daily',
    clicks: 412,
    endDate: null,
    id: 'CMP-408',
    impressions: 28_330,
    name: 'Engajamento · Reels da semana',
    objective: 'engagement',
    pixel: false,
    placements: ['instagram'],
    reach: 19_840,
    results: 1_284,
    spend: 386.5,
    startDate: '2026-09-10',
    status: 'paused',
  },
  {
    adCount: 3,
    adSetCount: 2,
    budget: 200,
    budgetType: 'daily',
    clicks: 0,
    endDate: null,
    id: 'CMP-409',
    impressions: 0,
    name: 'Dia das Crianças · Kits',
    objective: 'sales',
    pixel: true,
    placements: ['facebook', 'instagram'],
    reach: 0,
    results: 0,
    spend: 0,
    startDate: '2026-10-15',
    status: 'in-review',
  },
  {
    adCount: 1,
    adSetCount: 1,
    budget: 2_000,
    budgetType: 'lifetime',
    clicks: 0,
    endDate: '2026-11-30',
    id: 'CMP-410',
    impressions: 0,
    name: 'Cadastros · Webinar de dezembro',
    objective: 'leads',
    pixel: false,
    placements: ['facebook'],
    reach: 0,
    results: 0,
    spend: 0,
    startDate: '2026-11-01',
    status: 'draft',
  },
]

export const campaignGroupings: CollectionDefinition<Campaign>['groupings'] = [
  {
    getGroupId: (campaign) => campaign.status,
    id: 'status',
    label: 'Status',
    options: statusOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
    setGroupId: (campaign, groupId) =>
      groupId && isCampaignStatus(groupId)
        ? { ...campaign, status: groupId }
        : campaign,
  },
  {
    getGroupId: (campaign) => campaign.objective,
    id: 'objective',
    label: 'Objetivo',
    options: objectiveOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
    setGroupId: (campaign, groupId) =>
      groupId && isCampaignObjective(groupId)
        ? { ...campaign, objective: groupId }
        : campaign,
  },
]

export const createCampaignCollection = (
  items: readonly Campaign[],
): CollectionDefinition<Campaign> => ({
  getKey: (campaign) => campaign.id,
  getLabel: (campaign) => campaign.name,
  groupings: campaignGroupings,
  items,
})
