import type { PersonPropertyOption, SelectPropertyOption } from '@tc96/parttens'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import type { IconModule } from '@thesvg/icons'
import googleAds from '@thesvg/icons/google-ads'
import meta from '@thesvg/icons/meta'
import { type Channel, channels } from '../../chats-panel/fixtures/chats'

export type LeadStatus = 'disqualified' | 'new' | 'qualified' | 'qualifying'
export type AdPlatform = 'google-ads' | 'meta-ads'

export interface LeadAnswers {
  bill: string | null
  decisionMaker: string | null
  property: string | null
  timeline: string | null
}

export interface LeadMessage {
  at: string
  id: string
  own: boolean
  text: string
  time: string
}

export interface Lead {
  answers: LeadAnswers
  channel: Channel
  day: string
  id: string
  initials: string
  lastMessageAt: string
  messages: LeadMessage[]
  name: string
  owner: string | null
  source: { campaign: string; creative: string | null; platform: AdPlatform }
  status: LeadStatus
  time: string
  unreadCount: number
  windowEndsAt: string | null
}

export { channels }

export const platforms = {
  'google-ads': {
    creativeFallback: 'Sem palavra-chave',
    creativeLabel: 'Palavra-chave',
    icon: googleAds,
    label: 'Google Ads',
  },
  'meta-ads': {
    creativeFallback: 'Sem anúncio',
    creativeLabel: 'Anúncio',
    icon: meta,
    label: 'Meta Ads',
  },
} satisfies Record<
  AdPlatform,
  {
    creativeFallback: string
    creativeLabel: string
    icon: IconModule
    label: string
  }
>

export const platformOptions = Object.entries(platforms).map(
  ([value, { label }]) => [value, label] as const,
)

export const statusOptions: readonly SelectPropertyOption[] = [
  { label: 'Novo', tone: 'info', value: 'new' },
  { label: 'Em qualificação', tone: 'warning', value: 'qualifying' },
  { label: 'Qualificado', tone: 'success', value: 'qualified' },
  { label: 'Desqualificado', tone: 'danger', value: 'disqualified' },
]

export const isLeadStatus = (value: string | null): value is LeadStatus =>
  statusOptions.some((option) => option.value === value)

export const attendants: readonly PersonPropertyOption[] = [
  { fallback: 'G', label: 'Gabriel Melo', value: 'gabriel' },
  { fallback: 'A', label: 'Ana Souza', value: 'ana' },
]

export const qualificationQuestions: readonly {
  key: keyof LeadAnswers
  label: string
  options: readonly SelectPropertyOption[]
}[] = [
  {
    key: 'property',
    label: 'Imóvel',
    options: [
      { label: 'Casa', value: 'house' },
      { label: 'Apartamento', value: 'apartment' },
      { label: 'Comércio', value: 'commerce' },
      { label: 'Rural', value: 'rural' },
    ],
  },
  {
    key: 'bill',
    label: 'Conta de luz',
    options: [
      { label: 'Até R$ 300', value: 'up-to-300' },
      { label: 'R$ 300 a R$ 800', value: '300-to-800' },
      { label: 'Acima de R$ 800', value: 'above-800' },
    ],
  },
  {
    key: 'timeline',
    label: 'Prazo',
    options: [
      { label: 'Este mês', value: 'this-month' },
      { label: 'Até 3 meses', value: 'three-months' },
      { label: 'Sem prazo', value: 'no-deadline' },
    ],
  },
  {
    key: 'decisionMaker',
    label: 'Decisor',
    options: [
      { label: 'Sim', value: 'yes' },
      { label: 'Não', value: 'no' },
    ],
  },
]

export const leads: Lead[] = [
  {
    answers: {
      bill: null,
      decisionMaker: 'yes',
      property: 'house',
      timeline: null,
    },
    channel: 'whatsapp',
    day: 'Hoje',
    id: 'renata',
    initials: 'RS',
    lastMessageAt: '2026-10-19T14:12',
    messages: [
      {
        at: '2026-10-19T14:02',
        id: 'renata-1',
        own: false,
        text: 'Olá! Vi o anúncio no Google e queria um orçamento de energia solar.',
        time: '14:02',
      },
      {
        at: '2026-10-19T14:05',
        id: 'renata-2',
        own: true,
        text: 'Oi, Renata! Sou o Gabriel e vou te ajudar. O sistema seria para casa ou empresa?',
        time: '14:05',
      },
      {
        at: '2026-10-19T14:07',
        id: 'renata-3',
        own: false,
        text: 'Para a minha casa, aqui em Campinas.',
        time: '14:07',
      },
      {
        at: '2026-10-19T14:08',
        id: 'renata-4',
        own: true,
        text: 'Perfeito. Quem decide a compra com você?',
        time: '14:08',
      },
      {
        at: '2026-10-19T14:12',
        id: 'renata-5',
        own: false,
        text: 'Eu mesma. A conta vem uns R$ 650, no verão passa de R$ 800.',
        time: '14:12',
      },
    ],
    name: 'Renata Sousa',
    owner: 'gabriel',
    source: {
      campaign: 'Pesquisa · Solar residencial',
      creative: 'energia solar preço',
      platform: 'google-ads',
    },
    status: 'qualifying',
    time: '14:12',
    unreadCount: 0,
    windowEndsAt: '14:12 de 20/10',
  },
  {
    answers: {
      bill: null,
      decisionMaker: null,
      property: null,
      timeline: null,
    },
    channel: 'instagram',
    day: 'Hoje',
    id: 'diego',
    initials: 'DA',
    lastMessageAt: '2026-10-19T13:48',
    messages: [
      {
        at: '2026-10-19T13:46',
        id: 'diego-1',
        own: false,
        text: 'Vi o reels de vocês. Funciona pra apartamento?',
        time: '13:46',
      },
      {
        at: '2026-10-19T13:48',
        id: 'diego-2',
        own: false,
        text: 'Moro em condomínio, a laje é compartilhada.',
        time: '13:48',
      },
    ],
    name: 'Diego Almeida',
    owner: null,
    source: {
      campaign: 'Leads · Conta de luz zerada',
      creative: 'Reels · Conta zerada em 30 dias',
      platform: 'meta-ads',
    },
    status: 'new',
    time: '13:48',
    unreadCount: 2,
    windowEndsAt: '13:48 de 20/10',
  },
  {
    answers: {
      bill: 'above-800',
      decisionMaker: 'yes',
      property: 'commerce',
      timeline: 'this-month',
    },
    channel: 'messenger',
    day: 'Hoje',
    id: 'marina',
    initials: 'MC',
    lastMessageAt: '2026-10-19T11:24',
    messages: [
      {
        at: '2026-10-19T11:10',
        id: 'marina-1',
        own: false,
        text: 'Tenho uma padaria e a conta passa de R$ 2 mil por mês.',
        time: '11:10',
      },
      {
        at: '2026-10-19T11:14',
        id: 'marina-2',
        own: true,
        text: 'Dá para reduzir bastante. A decisão é sua?',
        time: '11:14',
      },
      {
        at: '2026-10-19T11:20',
        id: 'marina-3',
        own: false,
        text: 'Sim, sou a dona. Quero instalar ainda este mês.',
        time: '11:20',
      },
      {
        at: '2026-10-19T11:24',
        id: 'marina-4',
        own: true,
        text: 'Ótimo! Te mando a proposta até amanhã.',
        time: '11:24',
      },
    ],
    name: 'Marina Costa',
    owner: 'ana',
    source: {
      campaign: 'Leads · Comércio outubro',
      creative: 'Carrossel · Economia no comércio',
      platform: 'meta-ads',
    },
    status: 'qualified',
    time: '11:24',
    unreadCount: 0,
    windowEndsAt: '11:20 de 20/10',
  },
  {
    answers: {
      bill: 'up-to-300',
      decisionMaker: 'no',
      property: 'rural',
      timeline: 'no-deadline',
    },
    channel: 'whatsapp',
    day: 'Sexta-feira',
    id: 'paulo',
    initials: 'PN',
    lastMessageAt: '2026-10-16T16:40',
    messages: [
      {
        at: '2026-10-16T16:31',
        id: 'paulo-1',
        own: false,
        text: 'Só estou pesquisando preço por enquanto.',
        time: '16:31',
      },
      {
        at: '2026-10-16T16:35',
        id: 'paulo-2',
        own: true,
        text: 'Sem problema, Paulo. Posso te mandar uma simulação?',
        time: '16:35',
      },
      {
        at: '2026-10-16T16:40',
        id: 'paulo-3',
        own: false,
        text: 'Depois eu vejo com meu pai, obrigado.',
        time: '16:40',
      },
    ],
    name: 'Paulo Nogueira',
    owner: 'gabriel',
    source: {
      campaign: 'Performance Max · Solar',
      creative: null,
      platform: 'google-ads',
    },
    status: 'disqualified',
    time: 'Sex',
    unreadCount: 0,
    windowEndsAt: null,
  },
]

export const unreadLabel = (count: number) =>
  count === 1 ? '1 não lida' : `${count} não lidas`

export function LeadAvatar({
  className,
  lead,
}: Readonly<{ className?: string; lead: Lead }>) {
  return (
    <Avatar aria-hidden="true" className={className}>
      <AvatarFallback>{lead.initials}</AvatarFallback>
    </Avatar>
  )
}

export function BrandLabel({
  icon,
  label,
}: Readonly<{ icon: IconModule; label: string }>) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <img
        alt=""
        className="size-4 shrink-0 object-contain"
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon.svg)}`}
      />
      <span className="truncate">{label}</span>
    </span>
  )
}
