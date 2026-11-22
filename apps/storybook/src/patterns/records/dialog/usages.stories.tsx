import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordConfirmDialog } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { useState } from 'react'
import { expect, fn, screen, waitFor, within } from 'storybook/test'
import { initialContacts } from '../../collection/fixtures/contacts'
import { CreateContactDialog, type NewContact } from './create-contact-dialog'
import { LeadDialog } from './lead-dialog'
import type { NewLead } from './lead-record'
import { NoteDialog } from './note-dialog'
import {
  initialNotes,
  type Note,
  type NoteValues,
  noteRecordName,
} from './note-record'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Usages',
} satisfies Meta

export default meta

const companies = initialContacts.map((contact) => contact.company)
const roles = initialContacts.map((contact) => contact.role)

interface ContactsArgs {
  onCreate: (contact: NewContact) => void
}

export const Contacts: StoryObj<ContactsArgs> = {
  args: { onCreate: fn((_contact: NewContact) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'The create step of the Contacts collection, built like Inline Properties: the name as a borderless title, a short description below it, and every other field as a property chip. Telefone, E-mail, Tipo (CPF or CNPJ) and Documento are always shown. The ... chip opens a menu whose switches show or hide Etapa, Tags, Empresa and Cargo; Etapa starts at Sem etapa and has no Lead. Empresa and Cargo share one combobox chip: search, the existing roles or companies of the collection, and a footer that creates the typed name and selects it. The Contacts usage of `Patterns/Collection` opens the same dialog from Novo contato.',
      },
    },
  },
  render: function Contacts({ onCreate }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Novo contato
        </Button>
        <CreateContactDialog
          companies={companies}
          onCreate={onCreate}
          onOpenChange={setOpen}
          open={open}
          roles={roles}
        />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo contato' }),
    )

    await expect(dialog.getByRole('textbox', { name: 'Nome' })).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Mais propriedades' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /Criar contato/ }),
    ).toBeDisabled()
  },
}

interface LeadsArgs {
  onCreate: (lead: NewLead) => void
}

export const Leads: StoryObj<LeadsArgs> = {
  args: { onCreate: fn((_lead: NewLead) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'The create step of a lead, built like Row Properties: a borderless title and description, then labeled rows (`RecordGroupRow`) for Etapa, Origem, Responsável and Próxima ação. Etapa starts at Novo, Origem, Responsável and Próxima ação start empty, and Próxima ação lists the next step (Ligar, Enviar e-mail, Agendar reunião, Enviar proposta, Fazer follow-up). Criar lead stays disabled until the title has text.',
      },
    },
  },
  render: function Leads({ onCreate }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Novo lead
        </Button>
        <LeadDialog onCreate={onCreate} onOpenChange={setOpen} open={open} />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo lead' }),
    )

    await expect(dialog.getByRole('textbox', { name: 'Título' })).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Novo')
  },
}

interface NotesArgs {
  note: Note | null
  onCopyLink: (id: string) => void
  onSave: (values: NoteValues) => void | Promise<void>
}

const notesArgTypes = {
  note: { control: false },
  onCopyLink: { control: false },
  onSave: { control: false },
} as const

const notesDescription =
  'The note editor of a record, at the `large` size with `stretchBody`: the record name as the ancestor, then an `EditorTitle`, the author and Vínculos as `plain` property chips, and a `RichTextEditor` that fills the rest of the dialog. Enter or ArrowDown at the end of the title moves to the body, and ArrowUp at its first line goes back. Vínculos ties the note to other records: a menu with one submenu per kind (Contato, Lead, Contratos, Reunião), each holding `MenuCheckboxItem` items with the check on the right. The Notes usage of `Patterns/Records/Group/Usages` opens the same dialog instance from a row or from the + action, and the dialog resets its fields when `note` changes.'

const renderNotes = function Notes({ note, onCopyLink, onSave }: NotesArgs) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {note ? 'Abrir nota' : 'Nova nota'}
      </Button>
      <NoteDialog
        note={note}
        onCopyLink={onCopyLink}
        onOpenChange={setOpen}
        onSave={onSave}
        open={open}
        recordName={noteRecordName}
      />
    </>
  )
}

export const NewNote: StoryObj<NotesArgs> = {
  argTypes: notesArgTypes,
  args: {
    note: null,
    onCopyLink: fn((_id: string) => {}),
    onSave: fn((_values: NoteValues) => {}),
  },
  parameters: {
    docs: {
      description: {
        story: `${notesDescription}\n\nA new note for Helena Duarte: the title is focused, the author is the current user and nothing is linked. Criar nota stays disabled until the title or the body has text.`,
      },
      source: { inlineLimit: 250 },
    },
  },
  render: renderNotes,
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Nova nota' }),
    )

    await expect(dialog.getByText(noteRecordName)).toBeVisible()
    await expect(dialog.getByText('Gabriel Melo')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /Criar nota/ }),
    ).toBeDisabled()
  },
}

export const EditNote: StoryObj<NotesArgs> = {
  argTypes: notesArgTypes,
  args: {
    note: initialNotes[0],
    onCopyLink: fn((_id: string) => {}),
    onSave: fn((_values: NoteValues) => {}),
  },
  parameters: {
    docs: {
      description: {
        story: `${notesDescription}\n\nAn existing note opens with its title, body and links, and the header adds Copiar link, a shortcut the consumer owns. Mod+Enter saves from any field.`,
      },
      source: { inlineLimit: 250 },
    },
  },
  render: renderNotes,
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Editar nota' }),
    )

    await expect(
      dialog.getByRole('textbox', { name: 'Título da nota' }),
    ).toHaveValue('Preferências de contato')
    await expect(
      dialog.getByRole('button', { name: 'Copiar link' }),
    ).toBeVisible()
  },
}

interface DeleteProjectArgs {
  onDelete: () => void
}

export const DeleteProject: StoryObj<DeleteProjectArgs> = {
  args: { onDelete: fn() },
  parameters: {
    docs: {
      description: {
        story:
          'A confirmation with no body in the default `tone`, `destructive`: the confirm button is red and the initial focus is on Cancel.',
      },
    },
  },
  render: function DeleteProject({ onDelete }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Delete project
        </Button>
        <RecordConfirmDialog
          cancelLabel="Cancel"
          confirmingLabel="Deleting"
          confirmLabel="Delete project"
          description="Aurora and its 12 issues will be removed. This cannot be undone."
          onConfirm={() => {
            onDelete()
            return true
          }}
          onOpenChange={setOpen}
          open={open}
          title="Delete project?"
        />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('alertdialog', { name: 'Delete project?' }),
    )

    await expect(
      dialog.getByRole('button', { name: 'Delete project' }),
    ).toBeVisible()
    await waitFor(() =>
      expect(dialog.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
    )
  },
}

const targets = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archive', value: 'archive' },
  { label: 'Q4 planning', value: 'q4-planning' },
]

interface ArchiveProjectArgs {
  onArchive: (target: string) => void
}

export const ArchiveProject: StoryObj<ArchiveProjectArgs> = {
  args: { onArchive: fn((_target: string) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'A neutral confirmation with a choice in `children`: `tone="default"` puts the initial focus on Archive project, which stays disabled through `confirmDisabled` until a destination is chosen. The chosen value is the consumer state, read inside `onConfirm`.',
      },
    },
  },
  render: function ArchiveProject({ onArchive }) {
    const [open, setOpen] = useState(true)
    const [target, setTarget] = useState<string | null>(null)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Archive project
        </Button>
        <RecordConfirmDialog
          cancelLabel="Cancel"
          confirmDisabled={target === null}
          confirmingLabel="Archiving"
          confirmLabel="Archive project"
          description="Move the 12 open issues of Aurora before archiving it."
          onConfirm={() => {
            if (target === null) return false
            onArchive(target)
            return true
          }}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setTarget(null)
          }}
          open={open}
          title="Archive project?"
          tone="default"
        >
          <Field name="target">
            <FieldLabel>Move issues to</FieldLabel>
            <Select items={targets} onValueChange={setTarget} value={target}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a destination" />
              </SelectTrigger>
              <SelectPopup>
                {targets.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
        </RecordConfirmDialog>
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('alertdialog', { name: 'Archive project?' }),
    )

    await expect(
      dialog.getByRole('combobox', { name: 'Move issues to' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Archive project' }),
    ).toBeDisabled()
  },
}
