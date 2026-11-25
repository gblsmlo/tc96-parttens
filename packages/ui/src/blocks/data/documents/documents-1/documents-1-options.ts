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
  Documents1Access,
  Documents1GroupBy,
  Documents1Mode,
  Documents1Record,
  Documents1Sort,
  Documents1Type,
  Documents1View,
} from './types'

export const documents1Modes: readonly Documents1Mode[] = ['table', 'list']

export const documents1Views: readonly Documents1View[] = [
  'all',
  'notes',
  'documents',
  'links',
  'media',
]

export const documents1Types: readonly Documents1Type[] = [
  'note',
  'document',
  'link',
  'image',
  'video',
  'audio',
]

export const documents1ViewTypes: Readonly<
  Record<Documents1View, readonly Documents1Type[]>
> = {
  all: [],
  documents: ['document'],
  links: ['link'],
  media: ['image', 'video', 'audio'],
  notes: ['note'],
}

export const documents1Accesses: readonly Documents1Access[] = [
  'private',
  'shared',
  'public',
]

export const documents1Sorts: readonly Documents1Sort[] = ['name', 'oldest']

export const documents1Groupings: readonly Documents1GroupBy[] = [
  'pinned',
  'type',
]

export const documents1TypeIcons: Record<Documents1Type, Icon> = {
  audio: MusicNotesIcon,
  document: FileTextIcon,
  image: ImageIcon,
  link: LinkSimpleIcon,
  note: NotePencilIcon,
  video: VideoIcon,
}

export const documents1ViewIcons: Record<Documents1View, Icon> = {
  all: SquaresFourIcon,
  documents: FileTextIcon,
  links: LinkSimpleIcon,
  media: ImageIcon,
  notes: NotePencilIcon,
}

export const documents1AccessIcons: Record<Documents1Access, Icon> = {
  private: LockSimpleIcon,
  public: GlobeIcon,
  shared: UsersIcon,
}

const mediaTypes = ['image', 'video', 'audio'] as const

export function documents1TypeOf(record: Documents1Record): Documents1Type {
  if (record.kind === 'link') return 'link'
  if (record.kind !== 'file')
    return record.kind === 'note' ? 'note' : 'document'
  const family = record.contentType.split('/')[0]
  return mediaTypes.find((type) => type === family) ?? 'document'
}
