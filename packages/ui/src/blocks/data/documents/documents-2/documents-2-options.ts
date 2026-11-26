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
  Documents2ColumnId,
  Documents2GroupBy,
  Documents2Mode,
  Documents2Sort,
  Documents2Type,
} from './types'

export const documents2Modes: readonly Documents2Mode[] = [
  'list',
  'table',
  'gallery',
]

export const documents2Types: readonly Documents2Type[] = [
  'document',
  'note',
  'link',
  'image',
  'video',
  'audio',
]

export const documents2Sorts: readonly Documents2Sort[] = [
  'updated',
  'name',
  'type',
  'owner',
]

export const documents2GroupBys: readonly Documents2GroupBy[] = [
  'type',
  'owner',
]

export const documents2NoGroup = 'none'

export const documents2TypeIcons: Record<Documents2Type, Icon> = {
  audio: MusicNotesIcon,
  document: FileTextIcon,
  image: ImageIcon,
  link: LinkSimpleIcon,
  note: NotePencilIcon,
  video: VideoIcon,
}

export const documents2LeadingWidth = 'w-8'

export const documents2FieldWidth = {
  owner: 'w-44',
  size: 'w-20',
  updated: 'w-28',
} as const satisfies Partial<Record<Documents2ColumnId, string>>
