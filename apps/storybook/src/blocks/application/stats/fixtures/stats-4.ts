import type {
  Stats4Range,
  Stats4Source,
} from '@tc96/ui/blocks/application/stats/stats-4'

export interface LeadsOverview {
  goal: number
  sources: Stats4Source[]
  total: number
}

const colors = {
  ads: 'bg-sky-700 dark:bg-sky-500',
  organic: 'bg-emerald-700 dark:bg-emerald-500',
  referral: 'bg-violet-700 dark:bg-violet-500',
  social: 'bg-amber-600 dark:bg-amber-500',
}

const sources = (
  organic: number,
  ads: number,
  referral: number,
  social: number,
): Stats4Source[] => [
  {
    colorClassName: colors.organic,
    id: 'organic',
    name: 'Busca orgânica',
    value: organic,
  },
  {
    colorClassName: colors.ads,
    id: 'ads',
    name: 'Anúncios pagos',
    value: ads,
  },
  {
    colorClassName: colors.referral,
    id: 'referral',
    name: 'Indicações',
    value: referral,
  },
  {
    colorClassName: colors.social,
    id: 'social',
    name: 'Redes sociais',
    value: social,
  },
]

export const leadsOverviewByRange: Record<Stats4Range, LeadsOverview> = {
  '30d': { goal: 1500, sources: sources(480, 390, 210, 120), total: 1200 },
  '7d': { goal: 400, sources: sources(120, 96, 52, 32), total: 300 },
  '90d': { goal: 4000, sources: sources(1500, 1100, 520, 380), total: 3500 },
}

export const leadsOverview = leadsOverviewByRange['30d']
