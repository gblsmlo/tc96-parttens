import { richTextToPlainText } from '@tc96/helpers/rich-text'
import type { PersonPropertyOption, RichTextValue } from '@tc96/parttens'
import {
  CalendarIcon,
  FileSignatureIcon,
  type LucideIcon,
  TargetIcon,
  UserIcon,
} from 'lucide-react'

export interface NoteValues {
  body: RichTextValue
  links: readonly string[]
  title: string
}

export interface Note extends NoteValues {
  author: string
  id: string
  updatedAt: string
}

export const noteRecordName = 'Helena Duarte'

export const noteAuthor = 'gabriel'

export const notesNow = '2026-10-18T14:00:00.000Z'

export const noteAuthors: readonly PersonPropertyOption[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'GM', label: 'Gabriel Melo', value: 'gabriel' },
]

export interface NoteLinkGroup {
  icon: LucideIcon
  label: string
  options: readonly { label: string; value: string }[]
}

export const noteLinkGroups: readonly NoteLinkGroup[] = [
  {
    icon: UserIcon,
    label: 'Contato',
    options: [
      { label: 'Otávio Ramos', value: 'contact:otavio' },
      { label: 'Ricardo Melo', value: 'contact:ricardo' },
    ],
  },
  {
    icon: TargetIcon,
    label: 'Lead',
    options: [{ label: 'Revisional bancária', value: 'lead:banking' }],
  },
  {
    icon: FileSignatureIcon,
    label: 'Contratos',
    options: [
      { label: 'Contrato de honorários', value: 'contract:fees' },
      { label: 'Aditivo 01', value: 'contract:addendum' },
    ],
  },
  {
    icon: CalendarIcon,
    label: 'Reunião',
    options: [
      { label: 'Consulta inicial · 14/10', value: 'meeting:first' },
      { label: 'Revisão de contrato · 21/10', value: 'meeting:review' },
    ],
  },
]

export const noteLink = (value: string) => {
  for (const group of noteLinkGroups) {
    const option = group.options.find((item) => item.value === value)
    if (option) return { ...option, icon: group.icon }
  }
  return null
}

export const initialNotes: readonly Note[] = [
  {
    author: 'gabriel',
    body: [
      {
        children: [{ text: 'Prefere contato por WhatsApp depois das 18h.' }],
        type: 'p',
      },
    ],
    id: 'note-contact',
    links: ['meeting:first', 'contract:fees'],
    title: 'Preferências de contato',
    updatedAt: '2026-10-18T13:58:00.000Z',
  },
  {
    author: 'ana',
    body: [],
    id: 'note-empty',
    links: [],
    title: '',
    updatedAt: '2026-10-15T14:00:00.000Z',
  },
]

export const noteTitle = (note: NoteValues) =>
  note.title.trim() === '' ? 'Nota sem título' : note.title

export const notePreview = (note: NoteValues) =>
  richTextToPlainText(note.body).replaceAll('\n', ' ').trim() ||
  'Esta nota não tem conteúdo'

export const isNoteEmpty = (note: NoteValues) =>
  note.title.trim() === '' && richTextToPlainText(note.body).trim() === ''

const relative = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export function noteAge(updatedAt: string, now = notesNow): string {
  const minutes = Math.round((Date.parse(updatedAt) - Date.parse(now)) / 60_000)
  if (minutes > -1) return 'agora'
  if (minutes > -60) return relative.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours > -24) return relative.format(hours, 'hour')
  return relative.format(Math.round(hours / 24), 'day')
}
