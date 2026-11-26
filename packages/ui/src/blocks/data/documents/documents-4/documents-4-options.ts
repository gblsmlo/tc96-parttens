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
  Documents4ColumnId,
  Documents4GroupBy,
  Documents4Mode,
  Documents4Sort,
  Documents4Type,
} from './types'

export const documents4Modes: readonly Documents4Mode[] = [
  'list',
  'table',
  'gallery',
]

export const documents4Types: readonly Documents4Type[] = [
  'document',
  'note',
  'link',
  'image',
  'video',
  'audio',
]

export const documents4Sorts: readonly Documents4Sort[] = [
  'updated',
  'name',
  'type',
  'owner',
]

export const documents4GroupBys: readonly Documents4GroupBy[] = [
  'type',
  'owner',
]

export const documents4NoGroup = 'none'

export const documents4TypeIcons: Record<Documents4Type, Icon> = {
  audio: MusicNotesIcon,
  document: FileTextIcon,
  image: ImageIcon,
  link: LinkSimpleIcon,
  note: NotePencilIcon,
  video: VideoIcon,
}

export const documents4LeadingWidth = 'w-8'

export const documents4FieldWidth = {
  owner: 'w-44',
  size: 'w-20',
  updated: 'w-28',
} as const satisfies Partial<Record<Documents4ColumnId, string>>
