import {
  FileTextIcon,
  type Icon,
  ImageIcon,
  LinkSimpleIcon,
  MusicNotesIcon,
  NotePencilIcon,
  VideoIcon,
} from '@phosphor-icons/react'
import type {
  Documents5ColumnId,
  Documents5GroupBy,
  Documents5Mode,
  Documents5Sort,
  Documents5Type,
} from './types'

export const documents5Modes: readonly Documents5Mode[] = [
  'list',
  'table',
  'gallery',
]

export const documents5Types: readonly Documents5Type[] = [
  'document',
  'note',
  'link',
  'image',
  'video',
  'audio',
]

export const documents5Sorts: readonly Documents5Sort[] = [
  'updated',
  'name',
  'type',
  'owner',
]

export const documents5GroupBys: readonly Documents5GroupBy[] = [
  'type',
  'owner',
]

export const documents5NoGroup = 'none'

export const documents5TypeIcons: Record<Documents5Type, Icon> = {
  audio: MusicNotesIcon,
  document: FileTextIcon,
  image: ImageIcon,
  link: LinkSimpleIcon,
  note: NotePencilIcon,
  video: VideoIcon,
}

export const documents5LeadingWidth = 'w-8'

export const documents5FieldWidth = {
  owner: 'w-44',
  size: 'w-20',
  updated: 'w-28',
} as const satisfies Partial<Record<Documents5ColumnId, string>>
