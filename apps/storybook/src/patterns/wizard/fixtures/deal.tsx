import type { WizardStep } from '@tc96/parttens'
import {
  CircleDollarSignIcon,
  CreditCardIcon,
  CrownIcon,
  FileTextIcon,
  type LucideIcon,
  PercentIcon,
  RocketIcon,
  TagIcon,
} from 'lucide-react'

export const dealSteps = [
  {
    description: 'Escolha o tipo de cupom',
    icon: <TagIcon />,
    title: 'Tipo do cupom',
    value: 'type',
  },
  {
    description: 'Informe os dados do cupom',
    icon: <FileTextIcon />,
    title: 'Detalhes',
    value: 'details',
  },
  {
    description: 'Limites e ofertas',
    icon: <CreditCardIcon />,
    title: 'Uso',
    value: 'usage',
  },
  {
    description: 'Lance o cupom',
    icon: <RocketIcon />,
    title: 'Revisão',
    value: 'review',
  },
] satisfies WizardStep[]

export type DealStepValue = (typeof dealSteps)[number]['value']

export interface Option {
  label: string
  value: string
}

export interface DealTypeOption extends Option {
  description: string
  icon: LucideIcon
}

export const dealTypes: DealTypeOption[] = [
  {
    description: 'Desconto em porcentagem sobre o total, como 5% OFF.',
    icon: PercentIcon,
    label: 'Percentual',
    value: 'percentage',
  },
  {
    description: 'Desconto de um valor fixo sobre o total, como R$ 5 OFF.',
    icon: CircleDollarSignIcon,
    label: 'Valor fixo',
    value: 'flat',
  },
  {
    description: 'Cupom exclusivo para incentivar os membros Prime.',
    icon: CrownIcon,
    label: 'Membro Prime',
    value: 'prime',
  },
]

export const regions: Option[] = [
  { label: 'Brasil', value: 'br' },
  { label: 'América Latina', value: 'latam' },
  { label: 'América do Norte', value: 'na' },
  { label: 'Europa', value: 'eu' },
]

export const offeredItems: Option[] = [
  { label: 'Todos os itens', value: 'all' },
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Moda', value: 'fashion' },
  { label: 'Casa e decoração', value: 'home' },
]

export const cardConditions: Option[] = [
  { label: 'Qualquer cartão', value: 'any' },
  { label: 'Somente crédito', value: 'credit' },
  { label: 'Somente débito', value: 'debit' },
]

export const notifyChannels: Option[] = [
  { label: 'E-mail', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
]

export const userTypes: Option[] = [
  { label: 'Todos os clientes', value: 'all' },
  { label: 'Novos clientes', value: 'new' },
  { label: 'Clientes recorrentes', value: 'returning' },
]

export const paymentMethods: Option[] = [
  { label: 'Qualquer forma', value: 'any' },
  { label: 'Cartão', value: 'card' },
  { label: 'Pix', value: 'pix' },
  { label: 'Boleto', value: 'boleto' },
]

export const dealStatuses: Option[] = [
  { label: 'Ativo', value: 'active' },
  { label: 'Agendado', value: 'scheduled' },
  { label: 'Rascunho', value: 'draft' },
]

export interface DealDraft {
  cardCondition: string | null
  code: string
  description: string
  discount: string
  endsOn: string
  maxUsers: string
  minimumCart: string
  notify: string[]
  offeredItems: string | null
  paymentMethod: string | null
  promotionalFee: string
  region: string | null
  singleUse: boolean
  startsOn: string
  status: string | null
  title: string
  type: string
  userType: string | null
}

export const blackFridayDeal: DealDraft = {
  cardCondition: 'any',
  code: 'BLACKFRIDAY25',
  description: '',
  discount: '25',
  endsOn: '2026-11-30',
  maxUsers: '500',
  minimumCart: '99',
  notify: ['email'],
  offeredItems: 'all',
  paymentMethod: 'any',
  promotionalFee: '9',
  region: 'br',
  singleUse: true,
  startsOn: '2026-11-27',
  status: 'scheduled',
  title: 'Black Friday, 25% OFF',
  type: 'percentage',
  userType: 'all',
}

export const labelOf = (options: Option[], value: string | null) =>
  options.find((option) => option.value === value)?.label
