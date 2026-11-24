import {
  CalendarPlusIcon,
  type Icon,
  InvoiceIcon,
  LifebuoyIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import type { Card5Shortcut } from '@tc96/blocks/application/card/card-5'

export type ShortcutIconName = 'calendar' | 'invoice' | 'support' | 'team'

export interface ShortcutRecord {
  description: string
  href?: string
  icon: ShortcutIconName
  id: string
  title: string
}

export const shortcutIcons: Record<ShortcutIconName, Icon> = {
  calendar: CalendarPlusIcon,
  invoice: InvoiceIcon,
  support: LifebuoyIcon,
  team: UsersThreeIcon,
}

export const shortcutRecords: ShortcutRecord[] = [
  {
    description: 'Marque uma reunião com o time.',
    icon: 'calendar',
    id: 'schedule',
    title: 'Agendar reunião',
  },
  {
    description: 'Gere uma cobrança para um cliente.',
    icon: 'invoice',
    id: 'invoice',
    title: 'Emitir fatura',
  },
  {
    description: 'Convide pessoas para o espaço de trabalho.',
    icon: 'team',
    id: 'invite',
    title: 'Convidar pessoas',
  },
  {
    description: 'Abra a central de ajuda em uma nova página.',
    href: '/ajuda',
    icon: 'support',
    id: 'help',
    title: 'Central de ajuda',
  },
]

export const toShortcuts = (records: ShortcutRecord[]): Card5Shortcut[] =>
  records.map(({ icon, ...record }) => ({
    ...record,
    icon: shortcutIcons[icon],
  }))

export const shortcuts = toShortcuts(shortcutRecords)
