import { richTextToPlainText } from '@tc96/helpers/rich-text'
import type {
  PersonPropertyOption,
  RichTextValue,
  SelectPropertyOption,
} from '@tc96/parttens'
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  CircleXIcon,
  MinusIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  TriangleAlertIcon,
} from 'lucide-react'

export interface NoteValues {
  body: RichTextValue
  priority: string
  responsible: string | null
  status: string
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

export const noteStatusOptions: readonly SelectPropertyOption[] = [
  { icon: CircleIcon, label: 'Backlog', tone: 'neutral', value: 'backlog' },
  {
    icon: CircleDashedIcon,
    label: 'Planejada',
    tone: 'neutral',
    value: 'planned',
  },
  {
    icon: CircleDotIcon,
    label: 'Em andamento',
    tone: 'warning',
    value: 'in-progress',
  },
  {
    icon: CircleCheckIcon,
    label: 'Concluída',
    tone: 'success',
    value: 'completed',
  },
  { icon: CircleXIcon, label: 'Cancelada', tone: 'danger', value: 'canceled' },
]

export const notePriorityOptions: readonly SelectPropertyOption[] = [
  { icon: MinusIcon, label: 'Sem prioridade', tone: 'neutral', value: 'none' },
  {
    icon: TriangleAlertIcon,
    label: 'Urgente',
    tone: 'danger',
    value: 'urgent',
  },
  { icon: SignalHighIcon, label: 'Alta', tone: 'warning', value: 'high' },
  { icon: SignalMediumIcon, label: 'Média', tone: 'info', value: 'medium' },
  { icon: SignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
]

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
    priority: 'high',
    responsible: 'gabriel',
    status: 'in-progress',
    title: 'Preferências de contato',
    updatedAt: '2026-10-18T13:58:00.000Z',
  },
  {
    author: 'ana',
    body: [],
    id: 'note-empty',
    priority: 'none',
    responsible: null,
    status: 'planned',
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
