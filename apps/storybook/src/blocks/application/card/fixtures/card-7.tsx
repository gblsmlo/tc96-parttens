import {
  ChartBarIcon,
  CurrencyDollarIcon,
  WalletIcon,
} from '@phosphor-icons/react'
import type {
  Card7Contact,
  Card7Item,
  Card7Stat,
} from '@tc96/ui/blocks/application/card/card-7'
import { avatarUrl } from './avatar.ts'

export const contact: Card7Contact = {
  avatarUrl: avatarUrl('Mara Alves'),
  email: 'mara.alves@northline.com.br',
  name: 'Mara Alves',
  status: { label: 'Aberta a propostas', tone: 'success' },
}

export const stats: Card7Stat[] = [
  { id: 'deals', label: 'Negócios', value: '87' },
  { id: 'ticket', label: 'Ticket médio', value: 'R$ 7,2 mi' },
  { id: 'fund', label: 'Fundo total', value: 'R$ 415 mi' },
]

export const items: Card7Item[] = [
  {
    amount: 7840000,
    icon: <ChartBarIcon />,
    id: 'northline',
    label: 'Northline Ventures',
  },
  {
    amount: 3260000,
    color: 'var(--color-violet-500)',
    icon: <WalletIcon />,
    id: 'bluepeak',
    label: 'Bluepeak Capital',
  },
  {
    amount: 1180000,
    color: 'var(--color-amber-500)',
    icon: <CurrencyDollarIcon />,
    id: 'everfield',
    label: 'Everfield Equity',
  },
]
