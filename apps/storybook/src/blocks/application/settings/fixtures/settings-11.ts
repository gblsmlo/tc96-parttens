import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  type Icon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type {
  Settings11Group,
  Settings11Status,
} from '@tc96/ui/blocks/application/settings/settings-11'

export type Settings11IconName =
  | 'check-circle'
  | 'circle-dashed'
  | 'circle-half'
  | 'x-circle'

export interface Settings11Wire {
  id: string
  statuses: (Omit<Settings11Status, 'icon'> & {
    iconName: Settings11IconName
  })[]
  title: string
}

const icons: Record<Settings11IconName, Icon> = {
  'check-circle': CheckCircleIcon,
  'circle-dashed': CircleDashedIcon,
  'circle-half': CircleHalfIcon,
  'x-circle': XCircleIcon,
}

export const settings11Wire: Settings11Wire[] = [
  {
    id: 'group-ativos',
    statuses: [
      {
        iconName: 'circle-dashed',
        id: 'status-rascunho',
        label: 'Rascunho',
        projects: 3,
        toneClassName: 'bg-muted text-muted-foreground',
      },
      {
        iconName: 'circle-half',
        id: 'status-em-andamento',
        label: 'Em andamento',
        projects: 12,
        toneClassName:
          'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      },
    ],
    title: 'Ativos',
  },
  {
    id: 'group-encerrados',
    statuses: [
      {
        iconName: 'check-circle',
        id: 'status-concluido',
        label: 'Concluído',
        projects: 1,
        toneClassName:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      },
      {
        iconName: 'x-circle',
        id: 'status-cancelado',
        label: 'Cancelado',
        toneClassName:
          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
      },
    ],
    title: 'Encerrados',
  },
]

export const toSettings11Groups = (wire: Settings11Wire[]): Settings11Group[] =>
  wire.map(({ statuses, ...group }) => ({
    ...group,
    statuses: statuses.map(({ iconName, ...status }) => ({
      ...status,
      icon: icons[iconName],
    })),
  }))

export const settings11Groups: Settings11Group[] =
  toSettings11Groups(settings11Wire)
