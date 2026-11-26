import {
  FileTextIcon,
  GlobeIcon,
  type Icon,
  ImageIcon,
  LinkSimpleIcon,
  LockSimpleIcon,
  MusicNotesIcon,
  NotePencilIcon,
  SquaresFourIcon,
  UsersIcon,
  VideoIcon,
} from '@phosphor-icons/react'
import type {
  Documents3Access,
  Documents3GroupBy,
  Documents3Mode,
  Documents3Record,
  Documents3Sort,
  Documents3Type,
  Documents3View,
} from './types'

export const documents3Modes: readonly Documents3Mode[] = [
  'gallery',
  'table',
  'list',
]

export const documents3Views: readonly Documents3View[] = [
  'all',
  'notes',
  'documents',
  'links',
  'media',
]

export const documents3Types: readonly Documents3Type[] = [
  'note',
  'document',
  'link',
  'image',
  'video',
  'audio',
]

export const documents3ViewTypes: Readonly<
  Record<Documents3View, readonly Documents3Type[]>
> = {
  all: [],
  documents: ['document'],
  links: ['link'],
  media: ['image', 'video', 'audio'],
  notes: ['note'],
}

export const documents3Accesses: readonly Documents3Access[] = [
  'private',
  'shared',
  'public',
]

export const documents3Sorts: readonly Documents3Sort[] = ['name', 'oldest']

export const documents3Groupings: readonly Documents3GroupBy[] = [
  'pinned',
  'type',
]

export const documents3TypeIcons: Record<Documents3Type, Icon> = {
  audio: MusicNotesIcon,
  document: FileTextIcon,
  image: ImageIcon,
  link: LinkSimpleIcon,
  note: NotePencilIcon,
  video: VideoIcon,
}

export const documents3ViewIcons: Record<Documents3View, Icon> = {
  all: SquaresFourIcon,
  documents: FileTextIcon,
  links: LinkSimpleIcon,
  media: ImageIcon,
  notes: NotePencilIcon,
}

export const documents3AccessIcons: Record<Documents3Access, Icon> = {
  private: LockSimpleIcon,
  public: GlobeIcon,
  shared: UsersIcon,
}

const mediaTypes = ['image', 'video', 'audio'] as const

export function documents3TypeOf(record: Documents3Record): Documents3Type {
  if (record.kind === 'link') return 'link'
  if (record.kind !== 'file')
    return record.kind === 'note' ? 'note' : 'document'
  const family = record.contentType.split('/')[0]
  return mediaTypes.find((type) => type === family) ?? 'document'
}
