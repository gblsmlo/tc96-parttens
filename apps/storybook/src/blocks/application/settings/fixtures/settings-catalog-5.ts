import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleHalfIcon,
  type Icon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type {
  SettingsCatalog5Group,
  SettingsCatalog5Status,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-5'

export type SettingsCatalog5IconName =
  | 'check-circle'
  | 'circle-dashed'
  | 'circle-half'
  | 'x-circle'

export interface SettingsCatalog5Wire {
  id: string
  statuses: (Omit<SettingsCatalog5Status, 'icon'> & {
    iconName: SettingsCatalog5IconName
  })[]
  title: string
}

const icons: Record<SettingsCatalog5IconName, Icon> = {
  'check-circle': CheckCircleIcon,
  'circle-dashed': CircleDashedIcon,
  'circle-half': CircleHalfIcon,
  'x-circle': XCircleIcon,
}

export const settingsCatalog5Wire: SettingsCatalog5Wire[] = [
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

export const toSettingsCatalog5Groups = (
  wire: SettingsCatalog5Wire[],
): SettingsCatalog5Group[] =>
  wire.map(({ statuses, ...group }) => ({
    ...group,
    statuses: statuses.map(({ iconName, ...status }) => ({
      ...status,
      icon: icons[iconName],
    })),
  }))

export const settingsCatalog5Groups: SettingsCatalog5Group[] =
  toSettingsCatalog5Groups(settingsCatalog5Wire)
