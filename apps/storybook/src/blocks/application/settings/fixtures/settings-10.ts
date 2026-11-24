import {
  FileTextIcon,
  HandshakeIcon,
  type Icon,
  SparkleIcon,
  TrophyIcon,
  UserCheckIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type {
  Settings10Phase,
  Settings10Stage,
} from '@tc96/ui/blocks/application/settings/settings-10'

export const phases: Settings10Phase[] = [
  { id: 'aberto', label: 'Em aberto' },
  { closed: true, id: 'ganho', label: 'Ganho' },
  { closed: true, id: 'perdido', label: 'Perdido' },
]

type StageIconName =
  | 'file-text'
  | 'handshake'
  | 'sparkle'
  | 'trophy'
  | 'user-check'
  | 'x-circle'

const stageIcons: Record<StageIconName, Icon> = {
  'file-text': FileTextIcon,
  handshake: HandshakeIcon,
  sparkle: SparkleIcon,
  trophy: TrophyIcon,
  'user-check': UserCheckIcon,
  'x-circle': XCircleIcon,
}

export interface Settings10StageRecord extends Omit<Settings10Stage, 'icon'> {
  iconName: StageIconName
}

export const stageRecords: Settings10StageRecord[] = [
  {
    iconName: 'sparkle',
    id: 'novo',
    leads: 4,
    name: 'Novo',
    phase: 'aberto',
    tone: 'text-amber-700 dark:text-amber-500',
  },
  {
    iconName: 'user-check',
    id: 'qualificacao',
    leads: 7,
    name: 'Qualificação',
    phase: 'aberto',
    tone: 'text-blue-700 dark:text-blue-500',
  },
  {
    iconName: 'file-text',
    id: 'proposta',
    leads: 3,
    name: 'Proposta',
    phase: 'aberto',
    tone: 'text-yellow-700 dark:text-yellow-500',
  },
  {
    iconName: 'handshake',
    id: 'negociacao',
    leads: 2,
    name: 'Negociação',
    phase: 'aberto',
    tone: 'text-violet-700 dark:text-violet-500',
  },
  {
    iconName: 'trophy',
    id: 'fechado-ganho',
    leads: 12,
    locked: true,
    name: 'Ganho',
    phase: 'ganho',
    tone: 'text-green-700 dark:text-green-500',
  },
  {
    iconName: 'x-circle',
    id: 'fechado-perdido',
    leads: 0,
    locked: true,
    name: 'Perdido',
    phase: 'perdido',
    tone: 'text-destructive-foreground',
  },
]

export const toStages = (records: Settings10StageRecord[]): Settings10Stage[] =>
  records.map(({ iconName, ...stage }) => ({
    ...stage,
    icon: stageIcons[iconName] as Icon,
  }))

export const stages: Settings10Stage[] = toStages(stageRecords)
