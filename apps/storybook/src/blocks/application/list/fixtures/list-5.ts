import {
  ChartBarIcon,
  ChatsIcon,
  type Icon,
  ReceiptIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import type { List5Module } from '@tc96/blocks/application/list/list-5'

export type ModuleIconName = 'chart' | 'chat' | 'receipt' | 'team'

export interface ModuleRecord {
  description: string
  iconName: ModuleIconName
  id: string
  name: string
}

export const moduleIcons: Record<ModuleIconName, Icon> = {
  chart: ChartBarIcon,
  chat: ChatsIcon,
  receipt: ReceiptIcon,
  team: UsersThreeIcon,
}

export const moduleRecords: ModuleRecord[] = [
  {
    description: 'Acompanhe metas e indicadores em painéis.',
    iconName: 'chart',
    id: 'reports',
    name: 'Relatórios',
  },
  {
    description: 'Converse com clientes sem sair da plataforma.',
    iconName: 'chat',
    id: 'inbox',
    name: 'Caixa de entrada',
  },
  {
    description: 'Emita e acompanhe cobranças recorrentes.',
    iconName: 'receipt',
    id: 'billing',
    name: 'Cobranças',
  },
  {
    description: 'Organize equipes, cargos e permissões.',
    iconName: 'team',
    id: 'people',
    name: 'Pessoas',
  },
]

export const toModules = (records: readonly ModuleRecord[]): List5Module[] =>
  records.map(({ iconName, ...record }) => ({
    ...record,
    icon: moduleIcons[iconName],
  }))

export const modules = toModules(moduleRecords)
