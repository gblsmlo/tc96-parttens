import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog5 } from '@tc96/ui/blocks/application/record-dialog/record-dialog-5'
import { RecordGroup11 as RecordGroup11Block } from '@tc96/ui/blocks/application/record-group/record-group-11'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { recordDialog5People } from '../../record-dialog/fixtures/record-dialog-5.ts'
import {
  initialNotes,
  type Note,
  noteAuthor,
  noteRecordName,
  notesLabels,
  notesNow,
  toGroupNote,
} from '../fixtures/notes.ts'

const copyLink = (_id: string) => undefined

const now = new Date(notesNow)

function Notes() {
  const [notes, setNotes] = useState<readonly Note[]>(initialNotes)
  const [editing, setEditing] = useState<Note | null>(null)
  const [open, setOpen] = useState(false)

  const openNote = (note: Note | null) => {
    setEditing(note)
    setOpen(true)
  }

  return (
    <>
      <RecordGroup11Block
        labels={notesLabels}
        locale="pt-BR"
        notes={notes.map(toGroupNote)}
        now={now}
        onCreate={() => openNote(null)}
        onOpenNote={(id) =>
          openNote(notes.find((note) => note.id === id) ?? null)
        }
        onViewAll={() => undefined}
      />
      <RecordDialog5
        note={editing}
        onCopyLink={copyLink}
        onOpenChange={setOpen}
        onSave={(values) =>
          setNotes((current) => {
            const saved: Note = {
              author: editing?.author ?? noteAuthor,
              id: editing?.id ?? `note-${current.length + 1}`,
              ...values,
              updatedAt: notesNow,
            }
            return [saved, ...current.filter((note) => note.id !== saved.id)]
          })
        }
        open={open}
        people={recordDialog5People}
        recordName={noteRecordName}
      />
    </>
  )
}

const meta = {
  component: Notes,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup11',
} satisfies Meta<typeof Notes>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup11: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keeps the notes of a record in an inset group, newest first: the title carries the count, and each note is a button with the author avatar, the title in ink, the first lines of the body muted and the relative date as a `time`. The notes, the reference date and the locale come in as props, and `onOpenNote`, `onCreate` and `onViewAll` leave through callbacks (the View all button and the New note action render only when their callback is passed). The block never opens a dialog: the story mounts one [Blocks/Application/Record Dialog/Notes/RecordDialog5](?path=/story/blocks-application-record-dialog-notes-recorddialog5-playground--playground) next to it, which serves every request and resets its fields when `note` changes.',
      },
      source: { inlineLimit: 250 },
    },
  },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('region', {
      name: /^Notas/,
    })

    await expect(group).toHaveAccessibleName('Notas 2')
    await expect(
      Array.from(
        group.querySelectorAll('[data-slot="record-group-link-name"]'),
        (name) => name.textContent,
      ),
    ).toEqual([
      'Preferências de contato Prefere contato por WhatsApp depois das 18h.',
      'Nota sem título Esta nota não tem conteúdo',
    ])
    await expect(
      Array.from(group.querySelectorAll('time'), (time) => time.textContent),
    ).toEqual(['há 2 minutos', 'há 3 dias'])
  },
}
