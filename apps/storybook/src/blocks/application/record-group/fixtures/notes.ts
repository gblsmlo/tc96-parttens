import type {
  RecordGroup11LabelsOverride,
  RecordGroup11Note,
} from '@tc96/ui/blocks/application/record-group/record-group-11'
import { richTextToPlainText } from '@tc96/ui/helpers/rich-text'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor/rich-text-editor'
import { recordDialog5People } from '../../record-dialog/fixtures/record-dialog-5.ts'

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

export const notesLabels: RecordGroup11LabelsOverride = {
  create: 'Nova nota',
  emptyPreview: 'Esta nota não tem conteúdo',
  justNow: 'agora',
  title: 'Notas',
  untitled: 'Nota sem título',
  viewAll: 'Ver tudo',
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

export const toGroupNote = (note: Note): RecordGroup11Note => {
  const person = recordDialog5People.find(({ value }) => value === note.author)

  return {
    author: {
      initials: person?.label.charAt(0) ?? '',
      name: person?.label ?? '',
    },
    id: note.id,
    preview: richTextToPlainText(note.body).replaceAll('\n', ' ').trim(),
    title: note.title,
    updatedAt: note.updatedAt,
  }
}
